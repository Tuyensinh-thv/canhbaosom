import React from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  Eye,
  Users,
  Home,
  ShieldAlert,
  Radio,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { RiskLevel } from '../types';

interface TacticalKpiStripProps {
  levelCounts: {
    level_1: number;
    level_2: number;
    level_3: number;
    level_4: number;
    level_5: number;
  };
  totalStations?: number;
  onlineStations?: number;
  activeRiskFilter: RiskLevel | null;
  onFilterByLevel: (level: RiskLevel | null) => void;
  onOpenSensorHealth?: () => void;
}

export const TacticalKpiStrip: React.FC<TacticalKpiStripProps> = ({
  levelCounts,
  totalStations = 91,
  onlineStations = 91,
  activeRiskFilter,
  onFilterByLevel,
  onOpenSensorHealth
}) => {
  const criticalCount = levelCounts.level_5 || 3;
  const highDangerCount = (levelCounts.level_4 || 0) + (levelCounts.level_3 || 0) || 8;
  const watchCount = (levelCounts.level_2 || 0) + (levelCounts.level_1 || 0) || 21;

  const affectedPeople = 4218;
  const affectedHouseholds = 892;
  const criticalRoutes = 17;

  return (
    <div className="bg-[#050e1f] border-b border-[#0f2744] px-3 py-2 select-none">
      <div className="max-w-[1920px] mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {/* Card 1: Khẩn cấp */}
        <button
          onClick={() => onFilterByLevel(activeRiskFilter === 5 ? null : 5)}
          className={`relative flex items-center justify-between p-2.5 rounded-xl border transition-all text-left group ${
            activeRiskFilter === 5
              ? 'bg-[#2a080c] border-[#ef4444] ring-2 ring-[#ef4444]/60'
              : 'bg-[#12060a]/90 hover:bg-[#1f0a10] border-[#3f1219]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#ef4444]/15 border border-[#ef4444]/30 flex items-center justify-center shrink-0">
              <AlertOctagon className="w-5 h-5 text-[#ef4444] animate-pulse" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-[#ef4444] font-mono leading-none tracking-tight">
                  {criticalCount < 10 ? `0${criticalCount}` : criticalCount}
                </span>
                <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wide">
                  Khẩn cấp
                </span>
              </div>
              <div className="text-[10px] text-[#f87171] flex items-center gap-0.5 mt-0.5 font-medium">
                <span>+1 so với 1h trước</span>
              </div>
            </div>
          </div>
        </button>

        {/* Card 2: Nguy hiểm */}
        <button
          onClick={() => onFilterByLevel(activeRiskFilter === 4 ? null : 4)}
          className={`relative flex items-center justify-between p-2.5 rounded-xl border transition-all text-left group ${
            activeRiskFilter === 4
              ? 'bg-[#291304] border-[#f97316] ring-2 ring-[#f97316]/60'
              : 'bg-[#140b05]/90 hover:bg-[#201107] border-[#44220c]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#f97316]/15 border border-[#f97316]/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-[#f97316]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-[#f97316] font-mono leading-none tracking-tight">
                  {highDangerCount < 10 ? `0${highDangerCount}` : highDangerCount}
                </span>
                <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wide">
                  Nguy hiểm
                </span>
              </div>
              <div className="text-[10px] text-[#fb923c] flex items-center gap-0.5 mt-0.5 font-medium">
                <span>+2 so với 1h trước</span>
              </div>
            </div>
          </div>
        </button>

        {/* Card 3: Cần theo dõi */}
        <button
          onClick={() => onFilterByLevel(activeRiskFilter === 2 ? null : 2)}
          className={`relative flex items-center justify-between p-2.5 rounded-xl border transition-all text-left group ${
            activeRiskFilter === 2
              ? 'bg-[#291f04] border-[#eab308] ring-2 ring-[#eab308]/60'
              : 'bg-[#141005]/90 hover:bg-[#201908] border-[#3f310c]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#eab308]/15 border border-[#eab308]/30 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5 text-[#eab308]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-[#eab308] font-mono leading-none tracking-tight">
                  {watchCount < 10 ? `0${watchCount}` : watchCount}
                </span>
                <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wide">
                  Cần theo dõi
                </span>
              </div>
              <div className="text-[10px] text-[#4ade80] flex items-center gap-0.5 mt-0.5 font-medium">
                <span>-3 so với 1h trước</span>
              </div>
            </div>
          </div>
        </button>

        {/* Card 4: Người bị ảnh hưởng */}
        <div className="relative flex items-center justify-between p-2.5 rounded-xl bg-[#08172b]/90 border border-[#14325c] text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#0284c7]/15 border border-[#0284c7]/30 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-[#38bdf8]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-[#38bdf8] font-mono leading-none tracking-tight">
                  {affectedPeople.toLocaleString('vi-VN')}
                </span>
              </div>
              <div className="text-[11px] font-bold text-slate-200 tracking-tight">
                Người bị ảnh hưởng
              </div>
              <div className="text-[10px] text-[#38bdf8] flex items-center gap-0.5 mt-0.5 font-medium">
                <span>+327 so với 1h trước</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Hộ dân */}
        <div className="relative flex items-center justify-between p-2.5 rounded-xl bg-[#061e24]/90 border border-[#0e4450] text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#0d9488]/15 border border-[#0d9488]/30 flex items-center justify-center shrink-0">
              <Home className="w-5 h-5 text-[#2dd4bf]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-[#2dd4bf] font-mono leading-none tracking-tight">
                  {affectedHouseholds.toLocaleString('vi-VN')}
                </span>
                <span className="text-[11px] font-bold text-slate-200 tracking-wide">
                  Hộ dân
                </span>
              </div>
              <div className="text-[10px] text-[#2dd4bf] flex items-center gap-0.5 mt-0.5 font-medium">
                <span>+68 so với 1h trước</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 6: Tuyến đường nguy cơ */}
        <div className="relative flex items-center justify-between p-2.5 rounded-xl bg-[#091b15]/90 border border-[#163f2c] text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#16a34a]/15 border border-[#16a34a]/30 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-[#4ade80]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-[#4ade80] font-mono leading-none tracking-tight">
                  {criticalRoutes}
                </span>
              </div>
              <div className="text-[11px] font-bold text-slate-200 tracking-tight">
                Tuyến đường nguy cơ
              </div>
              <div className="text-[10px] text-[#4ade80] flex items-center gap-0.5 mt-0.5 font-medium">
                <span>+2 so với 1h trước</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 7: Trạng thái kết nối trạm */}
        <div
          onClick={onOpenSensorHealth}
          className="col-span-2 sm:col-span-1 relative flex items-center justify-between p-2.5 rounded-xl bg-[#051c14]/90 border border-[#0d4430] text-left cursor-pointer hover:bg-[#09291d] transition group"
        >
          <div className="flex items-center gap-2.5 w-full">
            <div className="w-9 h-9 rounded-lg bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 text-[#34d399] animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] font-extrabold uppercase text-slate-300 tracking-wider">
                TRẠNG THÁI KẾT NỐI
              </div>
              <div className="flex items-center justify-between gap-1 mt-0.5">
                <span className="text-[10px] text-emerald-400 font-bold">Trạm online</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-black text-xs border border-emerald-500/40">
                  {onlineStations}/{totalStations}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
