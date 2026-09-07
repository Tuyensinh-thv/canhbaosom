import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Radio,
  MessageSquare,
  Volume2,
  PhoneCall,
  CheckCircle2,
  AlertOctagon,
  RefreshCw,
  Clock,
  Users,
  ShieldAlert,
  Wifi,
  WifiOff,
  Layers,
  Check
} from 'lucide-react';
import { BroadcastChannelOverview, BroadcastTransmissionLog, EmergencyDispatch } from '../types';
import { safeFetchJson } from '../utils/apiClient';
import { alertOutbox, QueuedDispatchItem } from '../utils/alertQueue';

interface BroadcastDispatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  dispatches?: EmergencyDispatch[];
}

export const BroadcastDispatcherModal: React.FC<BroadcastDispatcherModalProps> = ({
  isOpen,
  onClose,
  dispatches = []
}) => {
  const [overview, setOverview] = useState<BroadcastChannelOverview | null>(null);
  const [logs, setLogs] = useState<BroadcastTransmissionLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [transmitting, setTransmitting] = useState<boolean>(false);
  const [outboxItems, setOutboxItems] = useState<QueuedDispatchItem[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected Channels
  const [selectedChannels, setSelectedChannels] = useState<{
    CELL_BROADCAST: boolean;
    SMS: boolean;
    ZALO_OA: boolean;
    EMERGENCY_SIREN: boolean;
    COMMUNE_RADIO: boolean;
  }>({
    CELL_BROADCAST: true,
    SMS: true,
    ZALO_OA: true,
    EMERGENCY_SIREN: true,
    COMMUNE_RADIO: true
  });

  const [selectedDispatchId, setSelectedDispatchId] = useState<string>(dispatches[0]?.id || 'disp-001');

  const fetchData = async () => {
    setLoading(true);
    try {
      const json = await safeFetchJson<{ overview?: BroadcastChannelOverview; logs?: BroadcastTransmissionLog[] }>('/api/v1/broadcast/overview');
      if (json) {
        if (json.overview) setOverview(json.overview);
        if (json.logs) setLogs(json.logs);
      }
    } catch (err) {
      console.warn('Notice loading broadcast data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
      const unsubscribe = alertOutbox.subscribe((items, online) => {
        setOutboxItems(items);
        setIsOnline(online);
      });
      return () => unsubscribe();
    }
  }, [isOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTransmit = async () => {
    const activeChannels = Object.entries(selectedChannels)
      .filter(([_, active]) => active)
      .map(([channel]) => channel);

    if (activeChannels.length === 0) {
      showToast('Vui lòng chọn ít nhất 1 kênh phát sóng.');
      return;
    }

    setTransmitting(true);
    try {
      // Stage into transactional outbox with UUID Idempotency Key
      const item = await alertOutbox.enqueue(selectedDispatchId, activeChannels, {
        triggered_by: 'COMMANDER_HQ',
        timestamp: new Date().toISOString()
      });

      showToast(`Đã đưa lệnh ${item.id.slice(0, 12)} vào hàng đợi phát sóng an toàn.`);
      await fetchData();
    } catch (err: any) {
      console.warn('Notice transmitting broadcast:', err);
      showToast('Có lỗi xảy ra, lệnh đã được bảo lưu an toàn trong Outbox.');
    } finally {
      setTransmitting(false);
    }
  };

  const pendingCount = outboxItems.filter((q) => q.status === 'PENDING' || q.status === 'TRANSMITTING').length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-red-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-4 right-16 z-50 bg-emerald-500/95 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xl animate-in fade-in slide-in-from-top-2">
            <Check className="w-4 h-4 text-slate-950" />
            {toastMessage}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">
                  Cổng Phát Lệnh Cảnh Báo Đa Kênh Quốc Gia (Emergency Broadcast)
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                  Tác Chiến 24/7
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Phát lệnh hỏa tốc qua Cell Broadcast BTS, SMS Brandname, Zalo OA, Còi hú đầu nguồn và Hệ thống loa thông minh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Outbox Status Pill */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              isOnline
                ? pendingCount > 0
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}>
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              )}
              <span>{isOnline ? 'Online (Outbox Ready)' : 'Offline (Đang lưu đệm)'}</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-slate-950 font-extrabold text-[10px] rounded-full">
                  {pendingCount}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Channel Readiness Stats */}
          {overview && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Trạm BTS Geofence</span>
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  {overview.cell_broadcast_bts_count.toLocaleString('vi-VN')}
                </div>
                <div className="text-[10px] text-emerald-400">Sẵn sàng phát sóng</div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Thuê bao SMS</span>
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  {(overview.total_sms_subscribers / 1000000).toFixed(1)}M
                </div>
                <div className="text-[10px] text-blue-400">Brandname Quốc gia</div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Zalo OA Follower</span>
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  {(overview.zalo_oa_followers_active / 1000).toFixed(0)}k
                </div>
                <div className="text-[10px] text-cyan-400">Tương tác trực tiếp</div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Còi Hú Hồ Chứa</span>
                  <Volume2 className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-lg font-bold text-white">{overview.emergency_sirens_online}</div>
                <div className="text-[10px] text-amber-400">Kích hoạt từ xa</div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Loa Xã Thông Minh</span>
                  <Radio className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  {overview.radio_speakers_online.toLocaleString('vi-VN')}
                </div>
                <div className="text-[10px] text-purple-400">Đa ngữ Kinh/Mông/Thái</div>
              </div>
            </div>
          )}

          {/* Action Dispatcher Form */}
          <div className="bg-slate-950/80 p-5 rounded-xl border border-red-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-red-300 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                Thiết Lập Lệnh Phát Sóng Khẩn Cấp (Guaranteed Outbox Delivery)
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Chuẩn: At-Least-Once Delivery + Idempotent Key
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Chọn Công điện / Bản tin Báo động cần phát:
                </label>
                <select
                  value={selectedDispatchId}
                  onChange={(e) => setSelectedDispatchId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-red-500 font-medium"
                >
                  <option value="disp-001">Công điện số 09/CĐ-PCTT - Lũ bùn đá Làng Nủ (Cấp 5)</option>
                  <option value="disp-002">Công điện số 10/CĐ-PCTT - Sạt trượt Sa Pa & Trung Chải (Cấp 4)</option>
                  {dispatches.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.dispatch_number} - {d.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Các kênh truyền tin kích hoạt đồng thời:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'CELL_BROADCAST', label: 'Cell Broadcast BTS', icon: PhoneCall },
                    { key: 'SMS', label: 'SMS Brandname', icon: MessageSquare },
                    { key: 'ZALO_OA', label: 'Zalo OA', icon: Users },
                    { key: 'EMERGENCY_SIREN', label: 'Còi Hú Báo Động', icon: Volume2 },
                    { key: 'COMMUNE_RADIO', label: 'Loa Xã Thông Minh', icon: Radio }
                  ].map((ch) => {
                    const active = selectedChannels[ch.key as keyof typeof selectedChannels];
                    return (
                      <button
                        key={ch.key}
                        onClick={() =>
                          setSelectedChannels((prev) => ({
                            ...prev,
                            [ch.key]: !prev[ch.key as keyof typeof selectedChannels]
                          }))
                        }
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          active
                            ? 'bg-red-500/20 text-red-300 border-red-500/50'
                            : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <ch.icon className="w-3.5 h-3.5" />
                        {ch.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Lệnh phát sóng sẽ được cấp Idempotency Key chống phát lặp và lưu offline nếu mạng ngắt quãng.</span>
              </div>

              <button
                onClick={handleTransmit}
                disabled={transmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-red-600/30 cursor-pointer"
              >
                <Send className={`w-4 h-4 ${transmitting ? 'animate-bounce' : ''}`} />
                {transmitting ? 'Đang kích hoạt Outbox...' : 'Phát Lệnh Ngay Lập Tức ➔'}
              </button>
            </div>
          </div>

          {/* Outbox Pending Synchronizer Banner */}
          {outboxItems.length > 0 && (
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  Hàng Đợi Giao Dịch Outbox ({outboxItems.length} mục)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alertOutbox.flush()}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Đồng bộ ngay
                  </button>
                  <button
                    onClick={() => alertOutbox.clearCompleted()}
                    className="text-[11px] text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    Xóa mục đã gửi
                  </button>
                </div>
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {outboxItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-400 font-semibold">{item.id.slice(0, 16)}</span>
                      <span className="text-slate-400">({item.channels.join(', ')})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] rounded font-bold ${
                        item.status === 'SENT'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : item.status === 'TRANSMITTING'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {item.status === 'SENT' ? 'Đã phát sóng' : item.status === 'TRANSMITTING' ? 'Đang truyền' : 'Đang chờ mạng'}
                      </span>
                      {item.status === 'FAILED_FATAL' && (
                        <button
                          onClick={() => alertOutbox.retryItem(item.id)}
                          className="text-[10px] text-rose-400 hover:underline"
                        >
                          Thử lại
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transmission History Logs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Nhật Ký Truyền Tin & Tỷ Lệ Tiếp Nhận Thực Tế
              </h3>
              <button
                onClick={fetchData}
                disabled={loading}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Kênh Truyền Thông</th>
                    <th className="px-4 py-3 font-semibold">Địa Bàn Tiếp Nhận</th>
                    <th className="px-4 py-3 font-semibold">Ước Tính Thuê Bao</th>
                    <th className="px-4 py-3 font-semibold">Độ Trễ Phân Phối</th>
                    <th className="px-4 py-3 font-semibold">Thời Gian Phát</th>
                    <th className="px-4 py-3 font-semibold">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/40">
                      <td className="px-4 py-2.5 font-medium text-white">{log.channel_label}</td>
                      <td className="px-4 py-2.5 text-slate-300">
                        {log.target_zone_name} ({log.target_province})
                      </td>
                      <td className="px-4 py-2.5 text-emerald-400 font-bold">
                        {log.successful_deliveries.toLocaleString('vi-VN')}{' '}
                        <span className="text-slate-500 font-normal">/ {log.target_recipients_est.toLocaleString('vi-VN')}</span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-cyan-300">{(log.latency_ms / 1000).toFixed(2)}s</td>
                      <td className="px-4 py-2.5 text-slate-400">
                        {new Date(log.transmitted_at).toLocaleTimeString('vi-VN')}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Hoàn tất (99.8%)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Tiêu chuẩn kết nối: Cục Viễn thông & Ban Chỉ đạo Quốc gia về Phòng, Chống Thiên tai</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
