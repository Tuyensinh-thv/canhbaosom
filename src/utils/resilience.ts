/**
 * Resilience & Fault Tolerance Engine for HAEWS v2.0
 * Inspired by Chapter 12 (Resilience Engineering) of Awesome Architecture.
 *
 * Patterns implemented:
 * 1. Circuit Breaker (CLOSED -> OPEN -> HALF_OPEN)
 * 2. Exponential Backoff with Jitter (prevents thundering herd)
 * 3. Graceful Degradation (fallback to baseline cache)
 * 4. Request Timeout Guards
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  failureThreshold?: number; // Number of consecutive failures before opening circuit (default: 3)
  successThreshold?: number; // Number of successful calls in HALF_OPEN to close circuit (default: 2)
  resetTimeoutMs?: number;   // Time to wait before moving from OPEN to HALF_OPEN (default: 15000ms)
  timeoutMs?: number;        // Request timeout (default: 8000ms)
  name?: string;             // Service or group identifier
}

export interface CircuitBreakerMetrics {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  lastFailureTime: number | null;
  lastSuccessTime: number | null;
  totalCalls: number;
  totalFallbackActivations: number;
}

export class CircuitBreaker {
  public state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime: number | null = null;
  private lastSuccessTime: number | null = null;
  private totalCalls = 0;
  private totalFallbackActivations = 0;

  private readonly failureThreshold: number;
  private readonly successThreshold: number;
  private readonly resetTimeoutMs: number;
  private readonly timeoutMs: number;
  public readonly name: string;

  private listeners: Array<(metrics: CircuitBreakerMetrics) => void> = [];

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 3;
    this.successThreshold = options.successThreshold ?? 2;
    this.resetTimeoutMs = options.resetTimeoutMs ?? 15000;
    this.timeoutMs = options.timeoutMs ?? 8000;
    this.name = options.name ?? 'default-service';
  }

  public subscribe(listener: (metrics: CircuitBreakerMetrics) => void): () => void {
    this.listeners.push(listener);
    listener(this.getMetrics());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    const metrics = this.getMetrics();
    this.listeners.forEach((l) => l(metrics));
  }

  public getMetrics(): CircuitBreakerMetrics {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      totalCalls: this.totalCalls,
      totalFallbackActivations: this.totalFallbackActivations,
    };
  }

  private checkStateTransition() {
    if (this.state === 'OPEN' && this.lastFailureTime) {
      const now = Date.now();
      if (now - this.lastFailureTime >= this.resetTimeoutMs) {
        this.state = 'HALF_OPEN';
        this.successCount = 0;
        console.info(`[CircuitBreaker:${this.name}] Cooldown passed. Moving to HALF_OPEN to probe service health.`);
        this.notify();
      }
    }
  }

  private recordSuccess() {
    this.lastSuccessTime = Date.now();
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = 'CLOSED';
        this.failureCount = 0;
        console.info(`[CircuitBreaker:${this.name}] Probing succeeded. Circuit is now CLOSED (Healthy).`);
      }
    } else if (this.state === 'CLOSED') {
      this.failureCount = 0;
    }
    this.notify();
  }

  private recordFailure(error: any) {
    this.lastFailureTime = Date.now();
    this.failureCount++;
    console.warn(`[CircuitBreaker:${this.name}] Failure #${this.failureCount}:`, error?.message || error);

    if (this.state === 'HALF_OPEN' || this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      console.error(`[CircuitBreaker:${this.name}] Threshold exceeded. Circuit is now OPEN (Traffic Diverted to Fallback).`);
    }
    this.notify();
  }

  public async execute<T>(action: () => Promise<T>, fallbackValue: T | null = null): Promise<T | null> {
    this.totalCalls++;
    this.checkStateTransition();

    if (this.state === 'OPEN') {
      this.totalFallbackActivations++;
      this.notify();
      console.warn(`[CircuitBreaker:${this.name}] Fast-failing open circuit, returning safe fallback.`);
      return fallbackValue;
    }

    // Set timeout guard
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Timeout of ${this.timeoutMs}ms exceeded on ${this.name}`));
      }, this.timeoutMs);
    });

    try {
      const result = await Promise.race([action(), timeoutPromise]);
      this.recordSuccess();
      return result;
    } catch (err: any) {
      this.recordFailure(err);
      this.totalFallbackActivations++;
      this.notify();
      return fallbackValue;
    }
  }
}

// Pre-configured Circuit Breakers for distinct architectural zones
export const circuitBreakers = {
  geo: new CircuitBreaker({ name: 'HAEWS-GIS-Service', failureThreshold: 3, timeoutMs: 6000, resetTimeoutMs: 10000 }),
  ai: new CircuitBreaker({ name: 'Gemini-AI-Service', failureThreshold: 2, timeoutMs: 12000, resetTimeoutMs: 20000 }),
  broadcast: new CircuitBreaker({ name: 'Broadcast-Dispatcher', failureThreshold: 3, timeoutMs: 8000, resetTimeoutMs: 15000 }),
  general: new CircuitBreaker({ name: 'Core-API', failureThreshold: 3, timeoutMs: 8000, resetTimeoutMs: 15000 }),
};

/**
 * Executes an async task with Exponential Backoff and Full Jitter.
 * Jitter formula: sleep = Math.random() * min(maxSleep, baseSleep * 2^attempt)
 */
export async function executeWithRetry<T>(
  task: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelayMs?: number;
    maxDelayMs?: number;
    operationName?: string;
  } = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 400;
  const maxDelayMs = options.maxDelayMs ?? 3000;
  const opName = options.operationName ?? 'Operation';

  let attempt = 0;
  while (true) {
    try {
      return await task();
    } catch (error: any) {
      attempt++;
      if (attempt > maxRetries) {
        console.error(`[Retry:${opName}] All ${maxRetries} retries exhausted. Failing permanently.`);
        throw error;
      }

      // Calculate exponential backoff with full jitter
      const expDelay = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
      const jitterDelay = Math.floor(Math.random() * expDelay);

      console.warn(`[Retry:${opName}] Attempt ${attempt}/${maxRetries} failed (${error?.message}). Retrying in ${jitterDelay}ms...`);
      await new Promise((res) => setTimeout(res, jitterDelay));
    }
  }
}
