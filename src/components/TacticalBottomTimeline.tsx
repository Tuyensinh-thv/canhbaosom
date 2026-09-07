import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Radio,
  History,
  FastForward,
  Rewind,
  Sparkles,
  Info
} from 'lucide-react';

interface TacticalBottomTimelineProps {
  currentHorizon: string; // '+1h' | '+3h' | '+6h' | '+12h' | '+24h'
  onChangeHorizon: (horizon: string) => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  onSelectHistoricalReplay?: () => void;
  onLiveSync?: () => void;
}

export const TacticalBottomTimeline: React.FC<TacticalBottomTimelineProps> = ({
  currentHorizon = '+6h',
  onChangeHorizon,
  isPlaying: externalPlaying,
  onTogglePlay: externalTogglePlay,
  onSelectHistoricalReplay,
  onLiveSync
}) => {
  const [internalPlaying, setInternalPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<'1x' | '2x' | '4x'>('1x');
  const [currentTimeStr, setCurrentTimeStr] = useState('22:26 21/08');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const isPlaying = externalPlaying !== undefined ? externalPlaying : internalPlaying;

  const handleTogglePlay = () => {
    if (externalTogglePlay) {
      externalTogglePlay();
    } else {
      setInternalPlaying(!internalPlaying);
    }
  };

  const horizons = ['+1h', '+3h', '+6h', '+12h', '+24h'];

  // Time ticks for chart: 20:00, 21:00, HIỆN TẠI (22:00), 23:00, 00:00 (22/08), 01:00, 02:00, 03:00, 04:00, 05:00
  const timeTicks = [
    { label: '20:00', isCurrent: false, xPct: 10 },
    { label: '21:00', isCurrent: false, xPct: 22 },
    { label: '22:00', isCurrent: true, labelTop: 'HIỆN TẠI', xPct: 35 },
    { label: '23:00', isCurrent: false, xPct: 48 },
    { label: '00:00', isCurrent: false, sub: '22/08', xPct: 60 },
    { label: '01:00', isCurrent: false, xPct: 70 },
    { label: '02:00', isCurrent: false, xPct: 78 },
    { label: '03:00', isCurrent: false, xPct: 85 },
    { label: '04:00', isCurrent: false, xPct: 92 },
    { label: '05:00', isCurrent: false, xPct: 98 }
  ];

  const handleCycleSpeed = () => {
    setPlaybackSpeed((prev) => (prev === '1x' ? '2x' : prev === '2x' ? '4x' : '1x'));
  };

  return (
    <div className="h-32 sm:h-36 bg-[#040a16] border-t border-[#0f2744] flex flex-col sm:flex-row items-stretch select-none text-slate-200 z-20">
      {/* LEFT SECTION: DÒNG THỜI GIAN */}
      <div className="w-full sm:w-80 lg:w-96 p-3 border-b sm:border-b-0 sm:border-r border-[#0f2744] flex flex-col justify-between shrink-0 bg-[#030813]">
        {/* Header & Modes */}
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
            DÒNG THỜI GIAN
          </div>

          <div className="flex items-center gap-1.5">
            {/* LIVE Button */}
            <button
              onClick={onLiveSync}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/80 text-[10px] font-extrabold text-emerald-400 shadow-sm"
              title="Đang đồng bộ trực tiếp thời gian thực"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE</span>
              <RotateCw className="w-2.5 h-2.5 ml-0.5" />
            </button>

            {/* Tua Lịch Sử Button */}
            <button
              onClick={onSelectHistoricalReplay}
              className="px-2 py-0.5 rounded-lg bg-[#091e38] hover:bg-[#103058] border border-[#143a6c] text-[10px] font-bold text-slate-300 hover:text-white transition"
              title="Tua lại lịch sử thiên tai"
            >
              TUA LỊCH SỬ
            </button>
          </div>
        </div>

        {/* Player Controls & Time Display */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="text-xs">
            <span className="text-[10px] text-slate-400 block">Hiện tại</span>
            <span className="font-bold text-white font-mono">{currentTimeStr}</span>
          </div>

          <div className="flex items-center gap-1 bg-[#071324] border border-[#0f2744] p-1 rounded-xl">
            {/* Rewind */}
            <button
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
              title="Lùi 1 giờ"
            >
              <Rewind className="w-3.5 h-3.5" />
            </button>

            {/* Play / Pause */}
            <button
              onClick={handleTogglePlay}
              className={`p-1.5 rounded-lg text-white transition ${
                isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-[#005BAC] hover:bg-[#0070D2]'
              }`}
              title={isPlaying ? 'Tạm dừng' : 'Phát chuỗi dự báo'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>

            {/* Speed */}
            <button
              onClick={handleCycleSpeed}
              className="px-1.5 py-0.5 rounded-lg bg-black/40 hover:bg-black/60 text-[10px] font-mono font-bold text-sky-300 border border-white/10"
              title="Tốc độ phát"
            >
              {playbackSpeed}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: DỰ BÁO NGUY CƠ CHART */}
      <div className="flex-1 p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden bg-[#040a16]">
        {/* Header with Legend & Horizon Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Title & Legend */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase text-slate-300 tracking-wider">
              DỰ BÁO NGUY CƠ
            </span>

            <div className="flex items-center gap-3 text-[10px] font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span>
                <span className="text-slate-300">Nguy cơ sạt lở</span>
              </span>

              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0284c7]"></span>
                <span className="text-slate-300">Nguy cơ lũ</span>
              </span>

              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-[#06b6d4]"></span>
                <span className="text-slate-300">Mưa</span>
              </span>
            </div>
          </div>

          {/* Horizon Pills */}
          <div className="flex items-center gap-1 bg-[#071324] p-0.5 rounded-lg border border-[#0f2744]">
            {horizons.map((h) => {
              const isActive = currentHorizon === h;
              return (
                <button
                  key={h}
                  onClick={() => onChangeHorizon(h)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition font-mono ${
                    isActive
                      ? 'bg-[#005BAC] text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {h}
                </button>
              );
            })}
          </div>
        </div>

        {/* SVG Multi-Wave Risk Curve Chart */}
        <div className="relative flex-1 w-full mt-1 min-h-[48px]">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 100">
            <defs>
              {/* Red Gradient for Landslide */}
              <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
              </linearGradient>

              {/* Blue Gradient for Flood */}
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1="0" y1="20" x2="1000" y2="20" stroke="#0f2744" strokeDasharray="3,3" />
            <line x1="0" y1="60" x2="1000" y2="60" stroke="#0f2744" strokeDasharray="3,3" />
            <line x1="0" y1="95" x2="1000" y2="95" stroke="#16375f" />

            {/* Blue Flood Area & Curve */}
            <path
              d="M 0,85 Q 150,82 300,75 T 450,55 T 600,45 T 750,50 T 900,70 T 1000,80 L 1000,95 L 0,95 Z"
              fill="url(#blueGradient)"
            />
            <path
              d="M 0,85 Q 150,82 300,75 T 450,55 T 600,45 T 750,50 T 900,70 T 1000,80"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.5"
            />

            {/* Red Landslide Area & Curve */}
            <path
              d="M 0,90 Q 150,88 300,78 T 450,50 T 600,32 T 750,38 T 900,60 T 1000,75 L 1000,95 L 0,95 Z"
              fill="url(#redGradient)"
            />
            <path
              d="M 0,90 Q 150,88 300,78 T 450,50 T 600,32 T 750,38 T 900,60 T 1000,75"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.5"
            />

            {/* Vertical Time needle for "HIỆN TẠI" (x = 350) */}
            <line x1="350" y1="5" x2="350" y2="95" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="350" cy="50" r="4.5" fill="#38bdf8" stroke="#002B54" strokeWidth="2" />
            <circle cx="350" cy="50" r="8" fill="none" stroke="#38bdf8" strokeWidth="1" className="animate-ping" />
          </svg>

          {/* Time markers on bottom axis */}
          <div className="absolute inset-x-0 bottom-0 flex justify-between text-[9px] font-mono text-slate-400 pointer-events-none px-1">
            {timeTicks.map((t, idx) => (
              <div
                key={idx}
                className={`text-center ${t.isCurrent ? 'text-[#38bdf8] font-bold' : ''}`}
                style={{ position: 'absolute', left: `${t.xPct}%`, transform: 'translateX(-50%)' }}
              >
                {t.labelTop && <div className="text-[8px] uppercase tracking-wider text-[#38bdf8] font-extrabold -mt-3">{t.labelTop}</div>}
                <div>{t.label}</div>
                {t.sub && <div className="text-[7px] text-slate-400">{t.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
