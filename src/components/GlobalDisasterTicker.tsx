import React from 'react';
import { AlertTriangle, Globe, RefreshCw, ChevronRight, ShieldAlert } from 'lucide-react';
import { GlobalDisasterSummary } from '../types';

interface GlobalDisasterTickerProps {
  summary: GlobalDisasterSummary | null;
  onOpenModal: () => void;
  onSyncFeeds?: () => void;
}

export const GlobalDisasterTicker: React.FC<GlobalDisasterTickerProps> = ({
  summary,
  onOpenModal,
  onSyncFeeds
}) => {
  if (!summary || !summary.breaking_event) {
    return null;
  }

  const event = summary.breaking_event;
  const isCritical = event.severity === 'CRITICAL';

  return (
    <div
      onClick={onOpenModal}
      className={`group relative flex items-center justify-between px-3 py-1.5 cursor-pointer border-b transition-all duration-300 text-xs overflow-hidden z-20 ${
        isCritical
          ? 'bg-gradient-to-r from-red-950/90 via-rose-900/80 to-slate-900/90 border-red-500/40 text-red-100 hover:border-red-400'
          : 'bg-gradient-to-r from-amber-950/90 via-orange-950/80 to-slate-900/90 border-amber-500/40 text-amber-100 hover:border-amber-400'
      }`}
      title="Bấm để mở Trung tâm Giám sát Thiên tai & Sạt lở Toàn cầu (NASA / USGS / GDACS)"
    >
      {/* Left Badge */}
      <div className="flex items-center gap-2 flex-shrink-0 font-semibold tracking-wide">
        <span className="flex h-2.5 w-2.5 relative">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isCritical ? 'bg-red-400' : 'bg-amber-400'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isCritical ? 'bg-red-500' : 'bg-amber-500'
            }`}
          />
        </span>
        <span
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            isCritical ? 'bg-red-500/30 text-red-200 border border-red-500/50' : 'bg-amber-500/30 text-amber-200 border border-amber-500/50'
          }`}
        >
          <Globe className="w-3 h-3 text-cyan-300" />
          TÌNH BÁO QUỐC TẾ
        </span>
        <span className="hidden sm:inline-block font-mono text-[11px] text-cyan-300">
          [{event.source_provider}]
        </span>
      </div>

      {/* Marquee / Headline Text */}
      <div className="flex-1 mx-3 truncate font-medium flex items-center gap-2">
        <span className="font-bold text-white tracking-wide truncate">
          {event.title_vi}
        </span>
        <span className="hidden md:inline text-slate-300 text-[11px] truncate">
          • {event.location_name} ({event.country})
        </span>
        {event.magnitude_display && (
          <span className="hidden lg:inline px-1.5 py-0.2 rounded bg-black/40 text-amber-300 border border-amber-500/30 font-mono text-[10px]">
            {event.magnitude_display}
          </span>
        )}
      </div>

      {/* Right Action buttons */}
      <div className="flex items-center gap-2 flex-shrink-0 text-[11px]">
        {summary.landslides_count > 0 && (
          <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-950/80 text-orange-200 border border-orange-600/40 text-[10px]">
            <AlertTriangle className="w-3 h-3 text-orange-400" />
            {summary.landslides_count} Sạt lở lớn
          </span>
        )}
        <span className="flex items-center gap-1 text-cyan-300 group-hover:text-cyan-200 group-hover:translate-x-0.5 transition-transform font-semibold text-[11px]">
          Chi tiết <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
