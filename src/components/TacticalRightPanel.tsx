import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  Waves,
  CloudRain,
  Clock,
  Users,
  ChevronRight,
  MoreHorizontal,
  Send,
  CheckCircle2,
  ListTodo,
  Eye,
  Wind,
  Droplets,
  Thermometer,
  CloudLightning
} from 'lucide-react';
import { DisasterIncident } from '../types';

interface TacticalRightPanelProps {
  incidents?: DisasterIncident[];
  onSelectIncident?: (incidentId: string) => void;
  onOpenBroadcast?: (incidentId?: string) => void;
  onOpenTasks?: () => void;
  onOpenWeatherDetails?: () => void;
}

export const TacticalRightPanel: React.FC<TacticalRightPanelProps> = ({
  incidents,
  onSelectIncident,
  onOpenBroadcast,
  onOpenTasks,
  onOpenWeatherDetails
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'EMERGENCY' | 'DANGER' | 'WATCH'>('ALL');

  const incidentsList = incidents && incidents.length > 0
    ? incidents.map((inc) => {
        const isEmergency = inc.level === 5;
        const isDanger = inc.level === 4;
        const severity: 'EMERGENCY' | 'DANGER' | 'WATCH' = isEmergency ? 'EMERGENCY' : isDanger ? 'DANGER' : 'WATCH';
        const severityLabel = isEmergency ? 'KHẨN CẤP' : isDanger ? 'NGUY HIỂM' : 'THEO DÕI';
        const typeLabel = inc.type === 'landslide' ? 'Sạt lở đất & Đá lăn' : inc.type === 'flash_flood' ? 'Lũ quét & Bùn đá' : 'Ngập lụt sâu';
        
        return {
          id: inc.id,
          type: inc.type === 'landslide' ? 'LANDSLIDE' : inc.type === 'flash_flood' ? 'FLASH_FLOOD' : 'DEEP_FLOOD',
          typeLabel,
          severity,
          severityLabel,
          location: `${inc.zoneName}, ${inc.provinceName}`,
          riskPct: inc.riskScorePercent,
          timeRemaining: `${Math.floor(inc.timeToCriticalThresholdMinutes / 60)}h ${inc.timeToCriticalThresholdMinutes % 60}m`,
          impactText: `${inc.impact.exposedPopulation} người, ${inc.impact.exposedHouseholds} hộ`,
          borderColor: isEmergency ? 'border-[#ef4444]/60' : isDanger ? 'border-[#f97316]/60' : 'border-[#eab308]/60',
          bgTint: isEmergency ? 'bg-[#18080b]/90' : isDanger ? 'bg-[#180d05]/90' : 'bg-[#141205]/90',
          badgeColor: isEmergency ? 'bg-[#ef4444] text-white' : isDanger ? 'bg-[#f97316] text-white' : 'bg-[#eab308] text-slate-950 font-bold',
          riskColor: isEmergency ? 'text-[#ef4444]' : isDanger ? 'text-[#f97316]' : 'text-[#eab308]'
        };
      })
    : [
    {
      id: 'inc-001',
      type: 'LANDSLIDE',
      typeLabel: 'Sạt lở đất',
      severity: 'EMERGENCY',
      severityLabel: 'KHẨN CẤP',
      location: 'Xã La Pán Tẩn, H. Mù Cang Chải',
      riskPct: 86,
      timeRemaining: '01h 25m',
      impactText: '327 người, 87 hộ',
      borderColor: 'border-[#ef4444]/60',
      bgTint: 'bg-[#18080b]/90',
      badgeColor: 'bg-[#ef4444] text-white',
      riskColor: 'text-[#ef4444]'
    },
    {
      id: 'inc-002',
      type: 'FLASH_FLOOD',
      typeLabel: 'Lũ quét',
      severity: 'DANGER',
      severityLabel: 'NGUY HIỂM',
      location: 'Xã Chế Cu Nha, H. Mù Cang Chải',
      riskPct: 72,
      timeRemaining: '02h 40m',
      impactText: '156 người, 42 hộ',
      borderColor: 'border-[#f97316]/60',
      bgTint: 'bg-[#180d05]/90',
      badgeColor: 'bg-[#f97316] text-white',
      riskColor: 'text-[#f97316]'
    },
    {
      id: 'inc-003',
      type: 'DEEP_FLOOD',
      typeLabel: 'Ngập sâu',
      severity: 'WATCH',
      severityLabel: 'THEO DÕI',
      location: 'Phường Hòa Bình, TP. Việt Trì',
      riskPct: 48,
      timeRemaining: '03h 15m',
      impactText: '98 người, 28 hộ',
      borderColor: 'border-[#eab308]/60',
      bgTint: 'bg-[#141205]/90',
      badgeColor: 'bg-[#eab308] text-slate-950 font-bold',
      riskColor: 'text-[#eab308]'
    }
  ];

  const filteredIncidents = incidentsList.filter((item) => {
    if (activeFilter === 'EMERGENCY') return item.severity === 'EMERGENCY';
    if (activeFilter === 'DANGER') return item.severity === 'DANGER';
    if (activeFilter === 'WATCH') return item.severity === 'WATCH';
    return true;
  });

  return (
    <div className="w-80 sm:w-96 flex flex-col h-full bg-[#050c18] border-l border-[#0f2744] select-none text-slate-200 overflow-hidden shrink-0">
      {/* SECTION 1: TÌNH HUỐNG CẦN XỬ LÝ */}
      <div className="p-3 border-b border-[#0f2744] flex-1 flex flex-col min-h-0">
        {/* Title + Action */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 font-extrabold text-xs text-slate-100 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-[#F5B400]" />
            <span>TÌNH HUỐNG CẦN XỬ LÝ</span>
          </div>
          <button
            onClick={() => onSelectIncident && onSelectIncident('inc-001')}
            className="text-[11px] text-[#38bdf8] hover:text-white flex items-center gap-0.5 font-medium transition"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mb-2.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition whitespace-nowrap ${
              activeFilter === 'ALL'
                ? 'bg-[#005BAC] text-white'
                : 'bg-[#091e38] text-slate-300 hover:text-white'
            }`}
          >
            Tất cả <span className="font-mono ml-0.5">12</span>
          </button>

          <button
            onClick={() => setActiveFilter('EMERGENCY')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition whitespace-nowrap ${
              activeFilter === 'EMERGENCY'
                ? 'bg-[#ef4444] text-white'
                : 'bg-[#26080c] text-[#f87171] hover:bg-[#380e14]'
            }`}
          >
            Khẩn cấp <span className="font-mono ml-0.5">03</span>
          </button>

          <button
            onClick={() => setActiveFilter('DANGER')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition whitespace-nowrap ${
              activeFilter === 'DANGER'
                ? 'bg-[#f97316] text-white'
                : 'bg-[#261306] text-[#fb923c] hover:bg-[#381c09]'
            }`}
          >
            Nguy hiểm <span className="font-mono ml-0.5">08</span>
          </button>

          <button
            onClick={() => setActiveFilter('WATCH')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition whitespace-nowrap ${
              activeFilter === 'WATCH'
                ? 'bg-[#eab308] text-slate-950'
                : 'bg-[#262007] text-[#fde047] hover:bg-[#382f0a]'
            }`}
          >
            Theo dõi <span className="font-mono ml-0.5">21</span>
          </button>
        </div>

        {/* Cards List (Scrollable) */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
          {filteredIncidents.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border ${item.borderColor} ${item.bgTint} p-3 transition shadow-lg relative group`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center shrink-0">
                    {item.type === 'LANDSLIDE' ? (
                      <AlertOctagon className="w-4 h-4 text-[#ef4444]" />
                    ) : item.type === 'FLASH_FLOOD' ? (
                      <Waves className="w-4 h-4 text-[#f97316]" />
                    ) : (
                      <CloudRain className="w-4 h-4 text-[#eab308]" />
                    )}
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-white">
                      {item.typeLabel}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${item.badgeColor}`}>
                  {item.severityLabel}
                </span>
              </div>

              {/* Location */}
              <div className="text-[11px] text-slate-300 font-medium mb-2 pl-1">
                {item.location}
              </div>

              {/* Risk & Countdown Info */}
              <div className="flex items-center justify-between text-xs bg-black/30 px-2.5 py-1.5 rounded-lg mb-2.5 border border-white/5 font-mono">
                <div>
                  <span className="text-slate-400 text-[10px]">Nguy cơ: </span>
                  <span className={`font-bold ${item.riskColor}`}>{item.riskPct}%</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Còn: <b className="text-white">{item.timeRemaining}</b></span>
                </div>
              </div>

              {/* Impact */}
              <div className="text-[10px] text-slate-400 mb-3 flex items-center gap-1 pl-1">
                <Users className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Ảnh hưởng: <b className="text-slate-200">{item.impactText}</b></span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  onClick={() => onSelectIncident && onSelectIncident(item.id)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-[#002B54]/80 hover:bg-[#003B73] border border-[#005BAC] text-[10px] font-bold text-sky-200 hover:text-white transition text-center uppercase tracking-wide"
                >
                  XEM CHI TIẾT
                </button>

                {item.severity === 'EMERGENCY' ? (
                  <button
                    onClick={() => onOpenBroadcast && onOpenBroadcast(item.id)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-[#005BAC] hover:bg-[#0070D2] text-white text-[10px] font-bold transition flex items-center justify-center gap-1 uppercase tracking-wide shadow"
                  >
                    <Send className="w-3 h-3" />
                    <span>PHÁT CẢNH BÁO</span>
                  </button>
                ) : item.severity === 'DANGER' ? (
                  <button
                    onClick={() => onOpenBroadcast && onOpenBroadcast(item.id)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-[#005BAC] hover:bg-[#0070D2] text-white text-[10px] font-bold transition flex items-center justify-center gap-1 uppercase tracking-wide shadow"
                  >
                    <ListTodo className="w-3 h-3" />
                    <span>GIAO NHIỆM VỤ</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectIncident && onSelectIncident(item.id)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-[#292005] hover:bg-[#3d3008] border border-[#eab308]/60 text-[#fde047] text-[10px] font-bold transition flex items-center justify-center gap-1 uppercase tracking-wide"
                  >
                    <Eye className="w-3 h-3" />
                    <span>THEO DÕI</span>
                  </button>
                )}

                <button
                  onClick={() => onSelectIncident && onSelectIncident(item.id)}
                  className="w-7 h-7 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition shrink-0"
                  title="Tùy chọn khác"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: NHIỆM VỤ ĐANG THỰC HIỆN */}
      <div className="p-3 border-b border-[#0f2744] bg-[#071324]/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 font-extrabold text-xs text-slate-100 uppercase tracking-wider">
            <span className="text-[#F5B400]">🛡️</span>
            <span>NHIỆM VỤ ĐANG THỰC HIỆN</span>
          </div>
          <button
            onClick={onOpenTasks}
            className="text-[11px] text-[#38bdf8] hover:text-white flex items-center gap-0.5 font-medium transition"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Task Counters Strip */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-[#1e070a]/90 border border-[#4a1219] text-center">
            <div className="text-[10px] text-[#f87171] font-medium">Quá hạn</div>
            <div className="text-base font-black text-[#ef4444] font-mono leading-none mt-0.5">02</div>
          </div>

          <div className="p-2 rounded-lg bg-[#061c2c]/90 border border-[#103d60] text-center">
            <div className="text-[10px] text-[#38bdf8] font-medium">Đang thực hiện</div>
            <div className="text-base font-black text-[#0284c7] font-mono leading-none mt-0.5">07</div>
          </div>

          <div className="p-2 rounded-lg bg-[#051c14]/90 border border-[#0e4733] text-center">
            <div className="text-[10px] text-[#4ade80] font-medium">Hoàn thành</div>
            <div className="text-base font-black text-[#22c55e] font-mono leading-none mt-0.5">15</div>
          </div>
        </div>
      </div>

      {/* SECTION 3: THÔNG TIN THỜI TIẾT */}
      <div
        onClick={onOpenWeatherDetails}
        className="p-3 bg-[#071324]/80 cursor-pointer hover:bg-[#091b34] transition"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 font-extrabold text-xs text-slate-200 uppercase tracking-wider">
            <CloudLightning className="w-4 h-4 text-[#38bdf8]" />
            <span>THÔNG TIN THỜI TIẾT</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#030a16] border border-[#0f2744] p-2.5 rounded-xl">
          <div className="w-12 h-12 rounded-xl bg-[#0284c7]/15 border border-[#0284c7]/30 flex items-center justify-center shrink-0">
            <CloudRain className="w-7 h-7 text-[#38bdf8] animate-bounce" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white mb-1 truncate">
              Mưa vừa, có nơi mưa to
            </div>
            <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-300 font-mono">
              <div>
                <span className="text-slate-400">Nhiệt độ</span>
                <div className="font-bold text-white">26°C</div>
              </div>
              <div>
                <span className="text-slate-400">Độ ẩm</span>
                <div className="font-bold text-white">92%</div>
              </div>
              <div>
                <span className="text-slate-400">Gió</span>
                <div className="font-bold text-white truncate">Đông 12 km/h</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 text-right mt-1.5 font-medium">
          🕒 Cập nhật 5 phút trước
        </div>
      </div>
    </div>
  );
};
