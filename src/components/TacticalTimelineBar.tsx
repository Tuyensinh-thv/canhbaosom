import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Flame,
  Radio,
  Calendar,
  Layers
} from 'lucide-react';

export type TimelineStep = '-6h' | '-3h' | 'NOW' | '+1h' | '+3h' | '+6h' | '+12h' | '+24h';

interface TacticalTimelineBarProps {
  currentStep: TimelineStep;
  onChangeStep: (step: TimelineStep) => void;
  countdownMinutes?: number;
  activeHotspotName?: string;
  isSimulating?: boolean;
  onToggleSimulation?: () => void;
}

const TIMELINE_STEPS: { key: TimelineStep; label: string; type: 'PAST' | 'NOW' | 'FUTURE'; desc: string }[] = [
  { key: '-6h', label: '-6h', type: 'PAST', desc: 'Mưa & Radar 6 giờ trước' },
  { key: '-3h', label: '-3h', type: 'PAST', desc: 'Mưa & Radar 3 giờ trước' },
  { key: 'NOW', label: 'HIỆN TẠI', type: 'NOW', desc: 'Thời gian thực quan trắc' },
  { key: '+1h', label: '+1h', type: 'FUTURE', desc: 'Dự báo AI Nowcasting 1h tới' },
  { key: '+3h', label: '+3h', type: 'FUTURE', desc: 'Dự báo dồn nước lưu vực 3h tới' },
  { key: '+6h', label: '+6h', type: 'FUTURE', desc: 'Dự báo ngập lụt & sạt lở 6h' },
  { key: '+12h', label: '+12h', type: 'FUTURE', desc: 'Mô phỏng bão/mưa 12h' },
  { key: '+24h', label: '+24h', type: 'FUTURE', desc: 'Kịch bản toàn cảnh 24h' }
];

export const TacticalTimelineBar: React.FC<TacticalTimelineBarProps> = ({
  currentStep,
  onChangeStep,
  countdownMinutes = 85,
  activeHotspotName = 'Thôn Trống Páo Sang (La Pán Tẩn)',
  isSimulating = false,
  onToggleSimulation
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(isSimulating);

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
    if (onToggleSimulation) onToggleSimulation();
  };

  return (
    <div className="bg-[#001D3D]/95 border-t-2 border-[#005BAC] px-3 sm:px-4 py-2.5 shadow-2xl backdrop-blur-md text-white">
      <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Play/Pause & Step Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg transition ${
              isPlaying
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
            title="Phát lại diễn biến hoặc Chạy mô phỏng dự báo tương lai"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span className="hidden sm:inline">{isPlaying ? 'Tạm Dừng' : 'Phát Diễn Biến'}</span>
          </button>

          <span className="text-[10px] text-sky-300 font-bold uppercase tracking-wider hidden md:inline">
            Dòng Thời Gian Tác Chiến:
          </span>
        </div>

        {/* Center: Timeline Step Slider */}
        <div className="flex items-center bg-[#001830] p-1 rounded-xl border border-[#003B73] text-xs font-bold overflow-x-auto max-w-full">
          {TIMELINE_STEPS.map((step) => {
            const isSelected = currentStep === step.key;

            return (
              <button
                key={step.key}
                onClick={() => onChangeStep(step.key)}
                className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap text-[11px] ${
                  isSelected
                    ? step.type === 'NOW'
                      ? 'bg-emerald-600 text-white shadow font-black ring-1 ring-emerald-400'
                      : step.type === 'FUTURE'
                      ? 'bg-purple-600 text-white shadow font-black ring-1 ring-purple-400'
                      : 'bg-[#005BAC] text-white shadow font-black ring-1 ring-sky-400'
                    : step.type === 'NOW'
                    ? 'text-emerald-300 hover:bg-emerald-950 font-extrabold'
                    : step.type === 'FUTURE'
                    ? 'text-purple-300 hover:bg-purple-950'
                    : 'text-sky-200 hover:bg-[#002B54]'
                }`}
                title={step.desc}
              >
                {step.type === 'NOW' && '🔴 '}
                {step.label}
              </button>
            );
          })}
        </div>

        {/* Right: Hotspot Countdown to Danger Threshold */}
        <div className="flex items-center gap-2 bg-[#001830] border border-rose-600/70 px-3 py-1 rounded-xl shadow">
          <Clock className="w-3.5 h-3.5 text-rose-400 animate-pulse shrink-0" />
          <div className="text-[11px] leading-tight">
            <div className="text-slate-400 truncate max-w-[140px] sm:max-w-[200px]">
              {activeHotspotName}:
            </div>
            <div className="font-bold text-rose-300 font-mono">
              Còn <b>{Math.floor(countdownMinutes / 60)}h {countdownMinutes % 60}m</b> đến ngưỡng sạt lở
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
