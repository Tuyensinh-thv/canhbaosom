import React, { useState } from 'react';
import {
  AlertTriangle,
  Shield,
  Wifi,
  Database,
  CheckCircle2,
  Cpu,
  ChevronDown,
  ChevronUp,
  Filter,
  Flame,
  Radio
} from 'lucide-react';
import { RiskLevel } from '../types';

interface KpiBarProps {
  levelCounts: {
    level_1: number;
    level_2: number;
    level_3: number;
    level_4: number;
    level_5: number;
  };
  totalStations: number;
  onlineStations: number;
  qualityValidPct: number;
  activeRiskFilter: RiskLevel | null;
  onFilterByLevel: (level: RiskLevel | null) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const KpiBar: React.FC<KpiBarProps> = ({
  levelCounts,
  totalStations,
  onlineStations,
  qualityValidPct,
  activeRiskFilter,
  onFilterByLevel,
  isCollapsed: externalCollapsed,
  onToggleCollapse: externalToggle
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(false);
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const handleToggle = () => {
    if (externalToggle) {
      externalToggle();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const totalCritical = levelCounts.level_5 + levelCounts.level_4 + levelCounts.level_3;

  return (
    <div className="bg-[#002B54] border-b border-[#005BAC]/80 text-white shadow-md transition-all">
      {/* 1. COLLAPSED VIEW: Ultra-compact, single-line operational ticker */}
      {isCollapsed ? (
        <div className="max-w-[1920px] mx-auto px-3 sm:px-4 py-1.5 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[11px] text-[#F5B400] uppercase flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Tổng Quan Rủi Ro:
            </span>

            {/* Compact Level Badges */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onFilterByLevel(activeRiskFilter === 5 ? null : 5)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold transition ${
                  activeRiskFilter === 5
                    ? 'bg-purple-600 text-white ring-1 ring-purple-300'
                    : 'bg-purple-950/80 text-purple-200 hover:bg-purple-900 border border-purple-800'
                }`}
                title="Lọc Cấp 5: Thảm họa"
              >
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                <span>C5: <b>{levelCounts.level_5}</b></span>
              </button>

              <button
                onClick={() => onFilterByLevel(activeRiskFilter === 4 ? null : 4)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold transition ${
                  activeRiskFilter === 4
                    ? 'bg-red-600 text-white ring-1 ring-red-300'
                    : 'bg-red-950/80 text-red-200 hover:bg-red-900 border border-red-800'
                }`}
                title="Lọc Cấp 4: Rất lớn"
              >
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                <span>C4: <b>{levelCounts.level_4}</b></span>
              </button>

              <button
                onClick={() => onFilterByLevel(activeRiskFilter === 3 ? null : 3)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold transition ${
                  activeRiskFilter === 3
                    ? 'bg-amber-600 text-white ring-1 ring-amber-300'
                    : 'bg-amber-950/80 text-amber-200 hover:bg-amber-900 border border-amber-800'
                }`}
                title="Lọc Cấp 3: Lớn"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>C3: <b>{levelCounts.level_3}</b></span>
              </button>

              <button
                onClick={() => onFilterByLevel(activeRiskFilter === 2 ? null : 2)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold transition ${
                  activeRiskFilter === 2
                    ? 'bg-yellow-500 text-black ring-1 ring-yellow-200'
                    : 'bg-yellow-950/80 text-yellow-200 hover:bg-yellow-900 border border-yellow-800'
                }`}
                title="Lọc Cấp 2: Trung bình"
              >
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                <span>C2: <b>{levelCounts.level_2}</b></span>
              </button>

              <button
                onClick={() => onFilterByLevel(activeRiskFilter === 1 ? null : 1)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold transition ${
                  activeRiskFilter === 1
                    ? 'bg-sky-600 text-white ring-1 ring-sky-300'
                    : 'bg-sky-950/80 text-sky-200 hover:bg-sky-900 border border-sky-800'
                }`}
                title="Lọc Cấp 1: Bình thường"
              >
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                <span>C1: <b>{levelCounts.level_1}</b></span>
              </button>

              {activeRiskFilter !== null && (
                <button
                  onClick={() => onFilterByLevel(null)}
                  className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Xóa bộ lọc cấp độ"
                >
                  Xóa lọc (Hiện tất cả)
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-sky-200 font-mono">
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>Trạm: <b>{onlineStations}/{totalStations}</b></span>
            </span>

            <button
              onClick={handleToggle}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#003B73] hover:bg-[#004B87] text-sky-200 hover:text-white border border-[#005BAC] text-[11px] font-medium transition"
              title="Mở rộng chi tiết KPI tác chiến"
            >
              <span>Chi tiết</span>
              <ChevronDown className="w-3 h-3 text-[#F5B400]" />
            </button>
          </div>
        </div>
      ) : (
        /* 2. EXPANDED VIEW: Full 8-metric interactive control grid */
        <div className="max-w-[1920px] mx-auto px-3 sm:px-4 py-2">
          <div className="flex items-center justify-between mb-1.5 text-[11px] font-semibold text-sky-200">
            <div className="flex items-center gap-1.5">
              <span className="text-[#F5B400] font-bold uppercase tracking-wider">Thống Kê Chỉ Huy & Phân Cấp Rủi Ro Toàn Tuyến:</span>
              {activeRiskFilter !== null && (
                <span className="bg-rose-950 text-rose-300 border border-rose-700 px-2 py-0.2 rounded text-[10px] font-mono">
                  Đang lọc: Cấp {activeRiskFilter}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeRiskFilter !== null && (
                <button
                  onClick={() => onFilterByLevel(null)}
                  className="text-[10px] text-sky-300 hover:text-white underline"
                >
                  Bỏ lọc
                </button>
              )}
              <button
                onClick={handleToggle}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#003B73] hover:bg-[#004B87] text-sky-200 hover:text-white border border-[#005BAC] text-[10px] font-medium transition"
                title="Thu gọn thanh thống kê"
              >
                <span>Thu gọn</span>
                <ChevronUp className="w-3 h-3 text-[#F5B400]" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {/* Cấp 5: Thảm họa */}
            <button
              onClick={() => onFilterByLevel(activeRiskFilter === 5 ? null : 5)}
              className={`flex items-center justify-between p-2 rounded-xl border transition-all text-left ${
                activeRiskFilter === 5
                  ? 'bg-purple-900 border-purple-400 ring-2 ring-purple-400/50 shadow-md'
                  : 'bg-[#001D3D]/90 border-purple-900/60 hover:bg-purple-950/60'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#800080] animate-ping" />
                  <span className="text-[11px] font-extrabold text-purple-300">CẤP 5</span>
                </div>
                <span className="text-[10px] text-purple-200/80">Thảm họa (Sơ tán)</span>
              </div>
              <span className="text-xl font-extrabold text-purple-300 font-mono">
                {levelCounts.level_5.toString().padStart(2, '0')}
              </span>
            </button>

            {/* Cấp 4: Rất lớn */}
            <button
              onClick={() => onFilterByLevel(activeRiskFilter === 4 ? null : 4)}
              className={`flex items-center justify-between p-2 rounded-xl border transition-all text-left ${
                activeRiskFilter === 4
                  ? 'bg-red-900 border-red-400 ring-2 ring-red-400/50 shadow-md'
                  : 'bg-[#001D3D]/90 border-red-900/60 hover:bg-red-950/60'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D71920] shadow-[0_0_8px_#D71920]" />
                  <span className="text-[11px] font-extrabold text-red-300">CẤP 4</span>
                </div>
                <span className="text-[10px] text-red-200/80">Rất lớn (Báo động)</span>
              </div>
              <span className="text-xl font-extrabold text-red-400 font-mono">
                {levelCounts.level_4.toString().padStart(2, '0')}
              </span>
            </button>

            {/* Cấp 3: Lớn */}
            <button
              onClick={() => onFilterByLevel(activeRiskFilter === 3 ? null : 3)}
              className={`flex items-center justify-between p-2 rounded-xl border transition-all text-left ${
                activeRiskFilter === 3
                  ? 'bg-amber-900 border-amber-400 ring-2 ring-amber-400/50 shadow-md'
                  : 'bg-[#001D3D]/90 border-amber-900/60 hover:bg-amber-950/60'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFA500]" />
                  <span className="text-[11px] font-extrabold text-amber-300">CẤP 3</span>
                </div>
                <span className="text-[10px] text-amber-200/80">Lớn (Cảnh báo)</span>
              </div>
              <span className="text-xl font-extrabold text-amber-400 font-mono">
                {levelCounts.level_3.toString().padStart(2, '0')}
              </span>
            </button>

            {/* Cấp 2: Trung bình */}
            <button
              onClick={() => onFilterByLevel(activeRiskFilter === 2 ? null : 2)}
              className={`flex items-center justify-between p-2 rounded-xl border transition-all text-left ${
                activeRiskFilter === 2
                  ? 'bg-yellow-800 border-yellow-400 ring-2 ring-yellow-400/50 shadow-md text-white'
                  : 'bg-[#001D3D]/90 border-yellow-900/60 hover:bg-yellow-950/60'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFFF00]" />
                  <span className="text-[11px] font-extrabold text-yellow-300">CẤP 2</span>
                </div>
                <span className="text-[10px] text-yellow-200/80">Trung bình (Theo dõi)</span>
              </div>
              <span className="text-xl font-extrabold text-yellow-300 font-mono">
                {levelCounts.level_2.toString().padStart(2, '0')}
              </span>
            </button>

            {/* Cấp 1: Thấp */}
            <button
              onClick={() => onFilterByLevel(activeRiskFilter === 1 ? null : 1)}
              className={`flex items-center justify-between p-2 rounded-xl border transition-all text-left ${
                activeRiskFilter === 1
                  ? 'bg-sky-900 border-sky-400 ring-2 ring-sky-400/50 shadow-md'
                  : 'bg-[#001D3D]/90 border-sky-900/60 hover:bg-sky-950/60'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00A6D6]" />
                  <span className="text-[11px] font-extrabold text-sky-300">CẤP 1</span>
                </div>
                <span className="text-[10px] text-sky-200/80">Thấp (An toàn)</span>
              </div>
              <span className="text-xl font-extrabold text-sky-300 font-mono">
                {levelCounts.level_1.toString().padStart(2, '0')}
              </span>
            </button>

            {/* Trạm Quan Trắc */}
            <div className="flex items-center justify-between p-2 rounded-xl border bg-[#001D3D]/90 border-[#004B87]">
              <div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                  <Wifi className="w-3.5 h-3.5" />
                  <span>TRẠM KTTV</span>
                </div>
                <span className="text-[10px] text-sky-200">Trực tuyến</span>
              </div>
              <span className="text-lg font-bold text-emerald-400 font-mono">
                {onlineStations}/{totalStations}
              </span>
            </div>

            {/* Data Quality Health */}
            <div className="flex items-center justify-between p-2 rounded-xl border bg-[#001D3D]/90 border-[#004B87]">
              <div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-cyan-400">
                  <Database className="w-3.5 h-3.5" />
                  <span>CHẤT LƯỢNG</span>
                </div>
                <span className="text-[10px] text-sky-200">Kiểm định WMO</span>
              </div>
              <span className="text-lg font-bold text-cyan-400 font-mono">
                {qualityValidPct}%
              </span>
            </div>

            {/* Model AI Hybrid */}
            <div className="flex items-center justify-between p-2 rounded-xl border bg-[#001D3D]/90 border-[#004B87]">
              <div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-300">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI HYBRID</span>
                </div>
                <span className="text-[10px] text-sky-200">XGBoost & LSTM</span>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                ACTIVE
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

