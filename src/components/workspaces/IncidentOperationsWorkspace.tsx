import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Send,
  Radio,
  Users,
  Home,
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  School,
  Hospital,
  ChevronRight,
  Filter,
  PhoneCall,
  Flame,
  LifeBuoy,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { DisasterIncident, MultiTierKPIs } from '../../types';

interface IncidentOperationsWorkspaceProps {
  incidents: DisasterIncident[];
  kpis: MultiTierKPIs;
  onSelectIncident?: (incidentId: string) => void;
  onApproveOrder?: (incidentId: string, orderId: string) => void;
  onOpenBroadcastModal?: () => void;
  onOpenReportModal?: () => void;
}

const SAFE_POINTS = [
  { id: 'sp-1', name: 'Trường THPT Dân Tộc Nội Trú Na Sầm', type: 'school', province: 'Lạng Sơn', capacity: '600 người', distance: '1.2 km', status: 'SẴN SÀNG', phone: '0205.3871.234' },
  { id: 'sp-2', name: 'Nhà Văn Hóa Xã Chi Lăng', type: 'culture', province: 'Lạng Sơn', capacity: '350 người', distance: '0.8 km', status: 'ĐANG TIẾP NHẬN (120/350)', phone: '0205.3872.555' },
  { id: 'sp-3', name: 'Trụ sở UBND Xã La Pán Tẩn', type: 'government', province: 'Yên Bái', capacity: '400 người', distance: '2.1 km', status: 'SẴN SÀNG', phone: '0216.3875.111' },
  { id: 'sp-4', name: 'Trạm Y Tế Xã Bát Xát', type: 'medical', province: 'Lào Cai', capacity: '200 người', distance: '1.5 km', status: 'SẴN SÀNG', phone: '0214.3881.999' }
];

export const IncidentOperationsWorkspace: React.FC<IncidentOperationsWorkspaceProps> = ({
  incidents,
  kpis,
  onSelectIncident,
  onApproveOrder,
  onOpenBroadcastModal,
  onOpenReportModal
}) => {
  const [selectedIncident, setSelectedIncident] = useState<DisasterIncident>(incidents[0]);
  const [incidentFilter, setIncidentFilter] = useState<'ALL' | 'EMERGENCY' | 'DANGER' | 'WATCH'>('ALL');
  const [broadcastTarget, setBroadcastTarget] = useState<string>('ALL_AFFECTED');
  const [broadcastMessage, setBroadcastMessage] = useState<string>(
    'CẢNH BÁO KHẨN CẤP: Yêu cầu toàn bộ nhân dân khu vực trũng thấp ven sông Suối khẩn trương sơ tán lên điểm cao an toàn trước 17:00.'
  );
  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);

  const filteredIncidents = incidents.filter((inc) => {
    if (incidentFilter === 'ALL') return true;
    if (incidentFilter === 'EMERGENCY') return inc.level === 5;
    if (incidentFilter === 'DANGER') return inc.level === 4;
    return inc.level <= 3;
  });

  const handleSendBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070B14] text-slate-100 overflow-hidden select-none font-sans">
      {/* Top Banner & KPI Strip */}
      <div className="bg-[#0B1220] border-b border-slate-800/80 px-4 py-3 shrink-0 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>TRUNG TÂM ĐIỀU HÀNH TÁC CHIẾN & ỨNG PHÓ CỨU HỘ KHẨN CẤP</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                SẴN SÀNG CHIẾN ĐẤU
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Quản lý danh sách tình huống khẩn cấp, phê duyệt mệnh lệnh sơ tán và điều phối phát thanh Zalo/SMS/Loa xã
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {onOpenBroadcastModal && (
            <button
              onClick={onOpenBroadcastModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-sm"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Phát Thanh Zalo / SMS</span>
            </button>
          )}

          {onOpenReportModal && (
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition shadow-sm"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Lập Báo Cáo Nhanh</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Incident Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT COLUMN: Incidents Queue & Priority List (5 cols) */}
        <div className="lg:col-span-5 xl:col-span-5 border-r border-slate-800/80 bg-[#080E1B] flex flex-col overflow-hidden">
          {/* Incident Filter Buttons */}
          <div className="p-3 border-b border-slate-800/80 bg-[#0B1426] flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setIncidentFilter('ALL')}
                className={`px-2.5 py-1 rounded-md transition ${
                  incidentFilter === 'ALL'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                Tất cả ({incidents.length})
              </button>
              <button
                onClick={() => setIncidentFilter('EMERGENCY')}
                className={`px-2.5 py-1 rounded-md transition ${
                  incidentFilter === 'EMERGENCY'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-900 text-rose-300 hover:text-white border border-slate-800'
                }`}
              >
                Khẩn cấp ({incidents.filter((i) => i.level === 5).length})
              </button>
              <button
                onClick={() => setIncidentFilter('DANGER')}
                className={`px-2.5 py-1 rounded-md transition ${
                  incidentFilter === 'DANGER'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-900 text-amber-300 hover:text-white border border-slate-800'
                }`}
              >
                Nguy hiểm ({incidents.filter((i) => i.level === 4).length})
              </button>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Cập nhật: 1 phút trước</span>
          </div>

          {/* Incidents List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-3 space-y-2">
            {filteredIncidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              const isEmergency = inc.level === 5;
              const isDanger = inc.level === 4;

              return (
                <div
                  key={inc.id}
                  onClick={() => {
                    setSelectedIncident(inc);
                    if (onSelectIncident) onSelectIncident(inc.id);
                  }}
                  className={`p-3.5 rounded-xl cursor-pointer transition border space-y-2.5 ${
                    isSelected
                      ? 'bg-[#101A2E] border-sky-400/80 shadow-lg ring-1 ring-sky-400/40'
                      : isEmergency
                      ? 'bg-rose-950/30 border-rose-900/60 hover:bg-rose-950/50'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      isEmergency
                        ? 'bg-rose-600 text-white'
                        : isDanger
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-yellow-500 text-slate-950'
                    }`}>
                      {isEmergency ? 'KHẨN CẤP (CẤP 5)' : isDanger ? 'NGUY HIỂM (CẤP 4)' : 'THEO DÕI'}
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Còn {Math.floor(inc.timeToCriticalThresholdMinutes / 60)}h {inc.timeToCriticalThresholdMinutes % 60}p
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {inc.type === 'landslide' ? 'Sạt lở đất & Đá lăn' : inc.type === 'flash_flood' ? 'Lũ quét & Bùn đá' : 'Ngập lụt sâu'} - {inc.zoneName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{inc.provinceName} • {inc.communeCount} xã chịu ảnh hưởng</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
                    <span>Ảnh hưởng: <strong className="text-white">{inc.impact.exposedPopulation}</strong> người ({inc.impact.exposedHouseholds} hộ)</span>
                    <span className="text-sky-400 font-bold flex items-center gap-1">
                      Chi tiết <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Tactical Command Workspace & Evacuation Dispatch (7 cols) */}
        <div className="lg:col-span-7 xl:col-span-7 bg-[#070C16] flex flex-col overflow-y-auto p-4 space-y-4">
          {/* Selected Incident Command Center */}
          {selectedIncident && (
            <div className="bg-[#0B1322] border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-600 text-white">
                      MỆNH LỆNH TÁC CHIẾN
                    </span>
                    <h2 className="text-base font-bold text-white">{selectedIncident.zoneName}</h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tỉnh: {selectedIncident.provinceName} • Nguy cơ: {selectedIncident.riskScorePercent}% • Mực mưa kích hoạt: 145mm/3h
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <div className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-slate-400">Sơ tán: </span>
                    <span className="text-emerald-400 font-bold">142/215 hộ</span>
                  </div>
                </div>
              </div>

              {/* Tactical Orders List */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-sky-300 uppercase tracking-wide">
                  DANH SÁCH MỆNH LỆNH CỦA CHỈ HUY TRƯỞNG:
                </div>

                <div className="space-y-2">
                  {selectedIncident.tacticalOrders.map((order) => (
                    <div key={order.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{order.title}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            order.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {order.priority}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{order.description}</p>
                      </div>

                      <div className="shrink-0">
                        {order.status === 'APPROVED' ? (
                          <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/40">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            ĐÃ DUYỆT
                          </span>
                        ) : (
                          <button
                            onClick={() => onApproveOrder && onApproveOrder(selectedIncident.id, order.id)}
                            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition shadow-sm"
                          >
                            PHÊ DUYỆT LỆNH
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Safe Points & Evacuation Centers Directory */}
          <div className="bg-[#0B1322] border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  MẠNG LƯỚI ĐIỂM TRÁNH TRÚ AN TOÀN & TIẾP NHẬN SƠ TÁN
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">4 điểm xung yếu</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAFE_POINTS.map((sp) => (
                <div key={sp.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{sp.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{sp.distance}</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">Sức chứa: <strong className="text-sky-300">{sp.capacity}</strong></div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                    <span className="text-emerald-400 font-semibold">{sp.status}</span>
                    <span className="text-slate-400 font-mono flex items-center gap-1">
                      <PhoneCall className="w-3 h-3 text-sky-400" />
                      {sp.phone}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fast Broadcast Dispatch Console */}
          <div className="bg-[#0B1322] border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  ĐIỀU PHỐI PHÁT THANH KHẨN CẤP (ZALO OA / CELL BROADCAST / LOA XÃ)
                </span>
              </div>
              {broadcastSent && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ĐÃ PHÁT THÀNH CÔNG TỚI 4.218 THUÊ BAO!
                </span>
              )}
            </div>

            <div className="space-y-2">
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-sans"
              />

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Kênh phát:</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-300 font-mono text-[10px]">
                    ZALO OA + SMS CELL + LOA KHÔNG DÂY
                  </span>
                </div>

                <button
                  onClick={handleSendBroadcast}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>PHÁT LỆNH NGAY</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
