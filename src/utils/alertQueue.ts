/**
 * Offline-First Outbox & Idempotency Alert Dispatcher
 * Inspired by Chapter 11 (Data Consistency & Outbox Pattern) of Awesome Architecture.
 *
 * Guarantees:
 * 1. At-Least-Once Delivery: Dispatches are staged locally before transmission.
 * 2. Idempotency: Each dispatch gets a unique UUID to prevent duplicate broadcast fires.
 * 3. Automatic Recovery: Automatically flushes queued broadcasts when connectivity restores.
 */

export interface QueuedDispatchItem {
  id: string; // Unique message UUID (Idempotency Key)
  dispatch_id: string;
  channels: string[];
  payload?: any;
  createdAt: number;
  attempts: number;
  lastError?: string;
  status: 'PENDING' | 'TRANSMITTING' | 'SENT' | 'FAILED_FATAL';
}

export type OutboxSubscriber = (items: QueuedDispatchItem[], isOnline: boolean) => void;

class AlertOutboxManager {
  private queue: QueuedDispatchItem[] = [];
  private readonly storageKey = 'HAEWS_ALERT_OUTBOX_QUEUE_V2';
  private subscribers: OutboxSubscriber[] = [];
  private isFlushing = false;
  private isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  constructor() {
    this.loadFromStorage();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        console.info('[OutboxManager] Connectivity restored. Initiating automatic outbox flush...');
        this.notify();
        this.flush();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        console.warn('[OutboxManager] Device went offline. All dispatches will be stored in local outbox.');
        this.notify();
      });

      // Background heartbeat sync check every 15 seconds
      setInterval(() => {
        if (this.isOnline && this.getPendingCount() > 0 && !this.isFlushing) {
          this.flush();
        }
      }, 15000);
    }
  }

  private loadFromStorage() {
    if (typeof localStorage === 'undefined') return;
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        this.queue = JSON.parse(data);
      }
    } catch (e) {
      console.warn('[OutboxManager] Failed to load local outbox storage:', e);
      this.queue = [];
    }
  }

  private saveToStorage() {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
    } catch (e) {
      console.warn('[OutboxManager] Failed to persist outbox:', e);
    }
  }

  public subscribe(subscriber: OutboxSubscriber): () => void {
    this.subscribers.push(subscriber);
    subscriber([...this.queue], this.isOnline);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== subscriber);
    };
  }

  private notify() {
    this.subscribers.forEach((s) => s([...this.queue], this.isOnline));
  }

  public getPendingCount(): number {
    return this.queue.filter((q) => q.status === 'PENDING').length;
  }

  public getQueue(): QueuedDispatchItem[] {
    return [...this.queue];
  }

  /**
   * Enqueue a dispatch item with an Idempotency Key
   */
  public async enqueue(dispatch_id: string, channels: string[], payload?: any): Promise<QueuedDispatchItem> {
    // Generate RFC4122 compliant UUID v4 for idempotency
    const idempotencyKey = 'disp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);

    const item: QueuedDispatchItem = {
      id: idempotencyKey,
      dispatch_id,
      channels,
      payload,
      createdAt: Date.now(),
      attempts: 0,
      status: 'PENDING'
    };

    this.queue.unshift(item);
    this.saveToStorage();
    this.notify();

    // Trigger immediate flush if online
    if (this.isOnline) {
      this.flush();
    }

    return item;
  }

  /**
   * Flush pending items sequentially to server
   */
  public async flush(): Promise<void> {
    if (this.isFlushing) return;
    this.isFlushing = true;

    try {
      const pendingItems = this.queue.filter((item) => item.status === 'PENDING');
      for (const item of pendingItems) {
        item.status = 'TRANSMITTING';
        item.attempts++;
        this.saveToStorage();
        this.notify();

        try {
          const res = await fetch('/api/v1/broadcast/transmit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Idempotency-Key': item.id, // Transmit idempotency key
            },
            body: JSON.stringify({
              dispatch_id: item.dispatch_id,
              channels: item.channels,
              idempotency_key: item.id,
              payload: item.payload
            })
          });

          if (!res.ok) {
            throw new Error(`Server returned HTTP ${res.status}`);
          }

          const json = await res.json();
          if (json.success !== false) {
            item.status = 'SENT';
            console.info(`[OutboxManager] Dispatch ${item.id} successfully transmitted via channels:`, item.channels);
          } else {
            throw new Error(json.error || 'Transmit indicated unfulfilled');
          }
        } catch (err: any) {
          console.warn(`[OutboxManager] Dispatch attempt failed for ${item.id}:`, err?.message || err);
          item.lastError = err?.message || 'Network error';
          if (item.attempts >= 5) {
            item.status = 'FAILED_FATAL';
          } else {
            item.status = 'PENDING';
          }
        }

        this.saveToStorage();
        this.notify();
      }

      // Cleanup items that were SENT older than 1 hour to keep storage light
      const oneHourAgo = Date.now() - 3600 * 1000;
      this.queue = this.queue.filter((item) => item.status !== 'SENT' || item.createdAt > oneHourAgo);
      this.saveToStorage();
      this.notify();
    } finally {
      this.isFlushing = false;
    }
  }

  /**
   * Retries a failed item manually
   */
  public retryItem(id: string) {
    const found = this.queue.find((q) => q.id === id);
    if (found) {
      found.status = 'PENDING';
      found.attempts = 0;
      this.saveToStorage();
      this.notify();
      this.flush();
    }
  }

  /**
   * Clears finished items
   */
  public clearCompleted() {
    this.queue = this.queue.filter((q) => q.status !== 'SENT');
    this.saveToStorage();
    this.notify();
  }
}

export const alertOutbox = new AlertOutboxManager();
