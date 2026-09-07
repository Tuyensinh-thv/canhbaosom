import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, History, Clock, X, AlertTriangle, Calendar, Info, CloudRain, Flame } from 'lucide-react';
import { HistoricalScenarioMetadata } from '../types';
import { safeFetchJson } from '../utils/apiClient';

interface ReplayControlBarProps {
  onClose: () => void;
  onFrameChange: (frameIndex: number) => void;
  currentFrameIndex: number;
}

export const ReplayControlBar: React.FC<ReplayControlBarProps> = ({
  onClose,
  onFrameChange,
  currentFrameIndex
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [scenarios, setScenarios] = useState<HistoricalScenarioMetadata[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scenario-yagi-2024');
  const [currentFrameData, setCurrentFrameData] = useState<any>(null);
  const [showMetadataDetail, setShowMetadataDetail] = useState<boolean>(false);

  // Fetch scenarios on mount
  useEffect(() => {
    safeFetchJson<HistoricalScenarioMetadata[]>('/api/v1/replay/scenarios')
      .then((data) => {
        if (data && Array.isArray(data)) {
          setScenarios(data);
        }
      })
      .catch((e) => console.warn('Notice loading replay scenarios:', e));
  }, []);

  // Fetch current frame data
  useEffect(() => {
    safeFetchJson(`/api/v1/replay/frame?scenario_id=${selectedScenarioId}&frame_index=${currentFrameIndex}`)
      .then((data) => {
        if (data) {
          setCurrentFrameData(data);
        }
      })
      .catch((e) => console.warn('Notice loading replay frame:', e));
  }, [selectedScenarioId, currentFrameIndex]);

  const activeScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];
  const maxFrames = activeScenario?.total_frames || 5;

  // Auto-play timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        const next = (currentFrameIndex + 1) % maxFrames;
        onFrameChange(next);
      }, 3500 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentFrameIndex, speed, maxFrames, onFrameChange]);

  const frame = currentFrameData?.frame;

  // Group scenarios by Era for clean selection
  const eraGroups = [
    { key: '1900_1970', label: 'Thời kỳ 1900 - 1970 (Lũ Lịch Sử Thời Pháp & Kháng Chiến)' },
    { key: '1971_2000', label: 'Thời kỳ 1971 - 2000 (Đại Hồng Thủy 1971 & Thế Kỷ 20)' },
    { key: '2001_2015', label: 'Thời kỳ 2001 - 2015 (Hà Nội 2008 & Mưa Lũ Quảng Ninh)' },
    { key: '2016_2024', label: 'Thời kỳ 2016 - 2024 (Mường La, Rào Trăng, YAGI 2024)' }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[96%] max-w-5xl bg-slate-900/95 border border-purple-500/70 rounded-2xl shadow-2xl backdrop-blur-xl p-3.5 z-40 text-slate-200 animate-in fade-in slide-in-from-bottom-6">
      {/* Top row: Header & Era-based Scenario selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 mb-2.5 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 shrink-0">
            <History className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xs text-purple-300 uppercase tracking-wider">
                TUA LỊCH SỬ THIÊN TAI (HISTORICAL REPLAY 1900 - 2024)
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-950 border border-purple-600 text-purple-200">
                {scenarios.length} Kịch bản lưu trữ
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Tái hiện diễn tiến mưa, độ ẩm đất và kích hoạt rủi ro từ số liệu đo đạc & biên niên sử 100 năm qua
            </span>
          </div>
        </div>

        {/* Dropdown with grouping */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <select
            value={selectedScenarioId}
            onChange={(e) => {
              setSelectedScenarioId(e.target.value);
              onFrameChange(0);
            }}
            className="bg-slate-950 border border-purple-500/50 rounded-lg px-2.5 py-1.5 text-xs text-purple-200 focus:outline-none focus:border-purple-400 font-medium max-w-[280px] sm:max-w-md truncate"
          >
            {eraGroups.map((grp) => {
              const grpScenarios = scenarios.filter((s) => s.era === grp.key);
              if (grpScenarios.length === 0) return null;
              return (
                <optgroup key={grp.key} label={grp.label} className="bg-slate-900 text-purple-300 font-bold">
                  {grpScenarios.map((s) => (
                    <option key={s.id} value={s.id} className="bg-slate-950 text-slate-200 font-normal">
                      [{s.year}] {s.name}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>

          <button
            onClick={() => setShowMetadataDetail(!showMetadataDetail)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
              showMetadataDetail ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Xem hồ sơ bối cảnh khí tượng & ý nghĩa lịch sử"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Hồ Sơ</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700"
            title="Đóng chế độ Tua lại"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Historical Metadata Details Expandable Banner */}
      {showMetadataDetail && activeScenario && (
        <div className="bg-purple-950/40 p-2.5 rounded-xl border border-purple-800/60 mb-2.5 text-xs space-y-1.5 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-900/60 pb-1.5">
            <span className="font-bold text-purple-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              Năm: <b className="text-amber-300">{activeScenario.year}</b> ({activeScenario.date_range})
            </span>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-900/80 px-2 py-0.5 rounded border border-purple-700">
              {activeScenario.era_label}
            </span>
          </div>
          <div className="text-[11px] text-slate-300 space-y-1">
            <div>
              <span className="text-purple-300 font-semibold">Hình thế khí tượng: </span>
              <span>{activeScenario.meteorological_cause || 'Tổ hợp thời tiết nguy hiểm'}</span>
            </div>
            <div>
              <span className="text-purple-300 font-semibold">Tầm vóc & Ý nghĩa lịch sử: </span>
              <span>{activeScenario.historical_significance || activeScenario.description}</span>
            </div>
          </div>
        </div>
      )}

      {/* Frame Details Banner */}
      {frame && (
        <div className="bg-slate-950/90 p-2.5 rounded-xl border border-slate-800 mb-2.5">
          <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
            <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {frame.event_title}
            </span>
            <div className="flex items-center gap-2">
              {frame.warning_summary && (
                <div className="flex items-center gap-1 text-[10px] font-mono">
                  {frame.warning_summary.level_5 > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700 font-bold animate-pulse">
                      Cấp 5: {frame.warning_summary.level_5}
                    </span>
                  )}
                  {frame.warning_summary.level_4 > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-700 font-bold">
                      Cấp 4: {frame.warning_summary.level_4}
                    </span>
                  )}
                  {frame.warning_summary.level_3 > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700 font-bold">
                      Cấp 3: {frame.warning_summary.level_3}
                    </span>
                  )}
                </div>
              )}
              <span className="font-mono text-[10px] text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                {new Date(frame.timestamp).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })} - {new Date(frame.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            {frame.event_description}
          </p>
        </div>
      )}

      {/* Playback Controls & Timeline Scrubber */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Play/Pause/Prev/Next buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onFrameChange(Math.max(0, currentFrameIndex - 1))}
            disabled={currentFrameIndex === 0}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
            title="Khung trước"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-900/50 transition"
            title={isPlaying ? 'Tạm dừng' : 'Phát kịch bản'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>

          <button
            onClick={() => onFrameChange(Math.min(maxFrames - 1, currentFrameIndex + 1))}
            disabled={currentFrameIndex >= maxFrames - 1}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
            title="Khung kế tiếp"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px] ml-1">
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-1.5 py-0.5 rounded font-mono ${
                  speed === s ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Scrubber slider & Frame indicator */}
        <div className="flex-1 w-full space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-purple-300">
              Khung hình: {currentFrameIndex + 1} / {maxFrames}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Bước thời gian tái hiện
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={maxFrames - 1}
            step="1"
            value={currentFrameIndex}
            onChange={(e) => onFrameChange(Number(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-mono">
            <span>Khung 1 (Tiếp cận)</span>
            {maxFrames >= 3 && <span>Khung {Math.ceil(maxFrames / 2)} (Đỉnh điểm)</span>}
            <span>Khung {maxFrames} (Khắc phục)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
