import React, { useState, useEffect } from 'react';
import {
  Radio,
  Wind,
  CloudRain,
  Eye,
  Layers,
  Compass,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Flame,
  Globe2,
  FolderArchive,
  RefreshCw,
  Zap,
  MapPin,
  Clock,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { TyphoonTrackingOverview, TyphoonStorm } from '../../types';
import { safeFetchJson } from '../../utils/apiClient';

interface RadarTyphoonWorkspaceProps {
  onOpenTyphoonModal?: () => void;
  onOpenRadarModal?: () => void;
}

const DOPPLER_STATIONS = [
  { id: 'PL', name: 'Đài Radar Phù Liễn', province: 'Hải Phòng', freq: 'C-Band', range: '250 km', status: 'ONLINE', sweepDbz: 48 },
  { id: 'VT', name: 'Đài Radar Việt Trì', province: 'Phú Thọ', freq: 'C-Band', range: '250 km', status: 'ONLINE', sweepDbz: 35 },
  { id: 'DH', name: 'Đài Radar Đông Hà', province: 'Quảng Trị', freq: 'S-Band', range: '450 km', status: 'ONLINE', sweepDbz: 52 },
  { id: 'TK', name: 'Đài Radar Tam Kỳ', province: 'Quảng Nam', freq: 'S-Band', range: '450 km', status: 'ONLINE', sweepDbz: 42 },
  { id: 'VINH', name: 'Đài Radar Vinh', province: 'Nghệ An', freq: 'C-Band', range: '250 km', status: 'ONLINE', sweepDbz: 38 },
  { id: 'QN', name: 'Đài Radar Quy Nhơn', province: 'Bình Định', freq: 'C-Band', range: '250 km', status: 'ONLINE', sweepDbz: 28 },
  { id: 'NT', name: 'Đài Radar Nha Trang', province: 'Khánh Hòa', freq: 'S-Band', range: '450 km', status: 'ONLINE', sweepDbz: 32 }
];

export const RadarTyphoonWorkspace: React.FC<RadarTyphoonWorkspaceProps> = ({
  onOpenTyphoonModal,
  onOpenRadarModal
}) => {
  const [selectedStation, setSelectedStation] = useState(DOPPLER_STATIONS[0]);
  const [typhoonData, setTyphoonData] = useState<TyphoonTrackingOverview | null>(null);
  const [selectedStormId, setSelectedStormId] = useState<string | null>(null);
  const [isPlayingRadar, setIsPlayingRadar] = useState<boolean>(true);
  const [radarStep, setRadarStep] = useState<number>(0);
  const [selectedElevation, setSelectedElevation] = useState<string>('0.5°');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const fetchTyphoonData = async () => {
    try {
      const json = await safeFetchJson<TyphoonTrackingOverview>('/api/v2/typhoon/live');
      if (json) {
        setTyphoonData(json);
        if (json.storms && json.storms.length > 0) {
          setSelectedStormId(json.storms[0].id);
        }
      }
    } catch (e) {
      console.warn('Error fetching typhoon live:', e);
    }
  };

  useEffect(() => {
    fetchTyphoonData();
  }, []);

  useEffect(() => {
    if (!isPlayingRadar) return;
    const interval = setInterval(() => {
      setRadarStep((prev) => (prev + 1) % 6);
    }, 1500);
    return () => clearInterval(interval);
  }, [isPlayingRadar]);

  const handleSyncJma = async () => {
    setIsSyncing(true);
    try {
      await safeFetchJson('/api/v2/typhoon/sync-live', { method: 'POST' });
      await fetchTyphoonData();
    } catch (e) {
      console.warn('Sync failed:', e);
    } finally {
      setTimeout(() => setIsSyncing(false), 900);
    }
  };

  const currentStorm: TyphoonStorm | null =
    typhoonData?.storms?.find((s) => s.id === selectedStormId) || typhoonData?.storms?.[0] || null;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070B14] text-slate-100 overflow-hidden select-none font-sans">
      {/* Top Banner */}
      <div className="bg-[#0B1220] border-b border-slate-800/80 px-4 py-3 shrink-0 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>ĐÀI QUAN SÁT RADAR DOPPLER & GIÁM SÁT BÃO BIỂN ĐÔNG</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                NOWCASTING 360°
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Phân tích phản hồi vô tuyến dBZ, vi trích gió Doppler, dự báo quỹ đạo tâm bão và hoàn lưu mưa bão
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncJma}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Đang cập nhật...' : 'Đồng bộ JMA / JTWC'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT COLUMN: Doppler Radar Control & Sweeper (6 cols) */}
        <div className="lg:col-span-6 xl:col-span-6 border-r border-slate-800/80 bg-[#080E1B] flex flex-col overflow-y-auto p-4 space-y-4">
          <div className="bg-[#0B1322] border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-white tracking-wide">MẠNG LƯỚI ĐÀI RADAR THỜI TIẾT</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">7/7 ĐÀI HOẠT ĐỘNG TỐT</span>
            </div>

            {/* Radar Stations Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DOPPLER_STATIONS.map((station) => {
                const isSel = selectedStation.id === station.id;
                return (
                  <button
                    key={station.id}
                    onClick={() => setSelectedStation(station)}
                    className={`p-2.5 rounded-lg text-left transition border ${
                      isSel
                        ? 'bg-cyan-950/80 border-cyan-400/80 text-cyan-200 shadow-md'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>{station.name}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between font-mono">
                      <span>{station.province}</span>
                      <span>{station.range}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Radar Sweep Simulator HUD */}
          <div className="bg-[#0B1322] border border-slate-800 rounded-xl p-4 shadow-lg flex-1 flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>MÀN HÌNH QUÉT ĐẲNG PHẢN HỒI (PPI SCOPE) - {selectedStation.name}</span>
                </h3>
                <p className="text-[11px] text-slate-400">Bán kính quét: {selectedStation.range} • Băng tần: {selectedStation.freq}</p>
              </div>

              {/* Elevation angles */}
              <div className="flex items-center gap-1 text-[10px] font-bold bg-slate-950 p-1 rounded-md border border-slate-800">
                {['0.5°', '1.5°', '3.0°', '5.0°'].map((ang) => (
                  <button
                    key={ang}
                    onClick={() => setSelectedElevation(ang)}
                    className={`px-2 py-0.5 rounded transition ${
                      selectedElevation === ang ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ang}
                  </button>
                ))}
              </div>
            </div>

            {/* Radar Circular Visualizer */}
            <div className="flex-1 min-h-[260px] bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
              <svg viewBox="0 0 300 300" className="w-[260px] h-[260px]">
                {/* Concentric distance rings */}
                <circle cx="150" cy="150" r="130" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="150" cy="150" r="95" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="150" cy="150" r="60" fill="none" stroke="#1e293b" strokeWidth="1" />
                <circle cx="150" cy="150" r="25" fill="none" stroke="#1e293b" strokeWidth="1" />

                {/* Crosshairs */}
                <line x1="150" y1="10" x2="150" y2="290" stroke="#334155" strokeWidth="1" />
                <line x1="10" y1="150" x2="290" y2="150" stroke="#334155" strokeWidth="1" />

                {/* Radar Sweep Rotating Line */}
                <line
                  x1="150"
                  y1="150"
                  x2={150 + 130 * Math.cos((radarStep * 60 * Math.PI) / 180)}
                  y2={150 + 130 * Math.sin((radarStep * 60 * Math.PI) / 180)}
                  stroke="#06b6d4"
                  strokeWidth="2"
                  className="transition-all duration-1000"
                />

                {/* Simulated Rain Clouds / dBZ Echoes */}
                <circle cx="180" cy="120" r="22" fill="#eab308" opacity="0.6" />
                <circle cx="185" cy="115" r="14" fill="#ef4444" opacity="0.8" />
                <circle cx="120" cy="170" r="30" fill="#22c55e" opacity="0.5" />
                <circle cx="130" cy="180" r="18" fill="#eab308" opacity="0.6" />

                {/* Center Station Icon */}
                <circle cx="150" cy="150" r="4" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
                <text x="150" y="165" fill="#06b6d4" fontSize="8" fontWeight="bold" textAnchor="middle">
                  {selectedStation.id}
                </text>
              </svg>

              {/* Time Step Overlay */}
              <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-md font-mono text-[11px] text-cyan-300">
                FRAME: +{radarStep * 15} PHÚT DỰ BÁO
              </div>
            </div>

            {/* Playback Controls & dBZ Legend */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingRadar(!isPlayingRadar)}
                  className="p-1.5 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 font-bold"
                >
                  {isPlayingRadar ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <span className="text-slate-400 font-mono text-[11px]">Tốc độ quét: 1 khung / 1.5s</span>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-mono font-bold">
                <span className="text-slate-400 mr-1">dBZ:</span>
                <span className="px-1.5 py-0.2 bg-[#22c55e] text-black rounded">20 (Nhẹ)</span>
                <span className="px-1.5 py-0.2 bg-[#eab308] text-black rounded">35 (Vừa)</span>
                <span className="px-1.5 py-0.2 bg-[#ef4444] text-white rounded">50 (To)</span>
                <span className="px-1.5 py-0.2 bg-[#a855f7] text-white rounded">&gt;65 (Mưa đá)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Typhoon Tracking & Landfall Forecast (6 cols) */}
        <div className="lg:col-span-6 xl:col-span-6 bg-[#070C16] flex flex-col overflow-y-auto p-4 space-y-4">
          {/* Active Typhoon Card */}
          {currentStorm ? (
            <div className="bg-[#0B1322] border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-rose-950 border border-rose-500/40 text-rose-400">
                    <Flame className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-extrabold text-white">{currentStorm.international_name}</h2>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-600 text-white">
                        {currentStorm.current_category_label || currentStorm.beaufort_scale_str}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      {currentStorm.vietnam_number}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs text-slate-400">Tâm bão hiện tại:</div>
                  <div className="text-sm font-bold text-cyan-400">
                    {currentStorm.current_coords?.[0]}°N, {currentStorm.current_coords?.[1]}°E
                  </div>
                </div>
              </div>

              {/* Storm Telemetry 4-Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Tốc độ di chuyển</div>
                  <div className="text-base font-mono font-bold text-sky-300 mt-1">
                    {currentStorm.moving_speed_kmh} <span className="text-xs text-slate-400">km/h</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Hướng: {currentStorm.moving_direction}</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Áp suất tâm bão</div>
                  <div className="text-base font-mono font-bold text-rose-400 mt-1">
                    {currentStorm.current_pressure_hpa} <span className="text-xs text-slate-400">hPa</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Khí áp rất thấp</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Tốc độ gió hiện tại</div>
                  <div className="text-base font-mono font-bold text-amber-300 mt-1">
                    {currentStorm.current_wind_speed_kmh} <span className="text-xs text-slate-400">km/h</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Giật: {currentStorm.current_wind_gust_kmh || 120} km/h</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Dự kiến đổ bộ</div>
                  <div className="text-xs font-bold text-amber-400 mt-2 truncate">
                    {currentStorm.estimated_landfall_time || 'Trong 24-36h tới'}
                  </div>
                </div>
              </div>

              {/* Inland Rainfall Impact Provinces */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  CẢNH BÁO MƯA HOÀN LƯU & SẠT LỞ CÁC TỈNH PHÍA BẮC:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(currentStorm.inland_torrential_rain_risk_zones || []).slice(0, 4).map((zone, idx) => (
                    <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{zone.province}</div>
                        <div className="text-[11px] text-slate-400">Lượng mưa: {zone.expected_rainfall_mm}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        zone.landslide_flashflood_risk === 'EXTREME'
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-400 text-slate-950'
                      }`}>
                        {zone.landslide_flashflood_risk === 'EXTREME' ? 'CỰC KỲ CAO' : 'RẤT CAO'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0B1322] border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
              Đang nạp dữ liệu bão thời gian thực...
            </div>
          )}

          {/* Historical Typhoon Library Quick Selector */}
          <div className="bg-[#0B1322] border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <FolderArchive className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  KHO BÃO LỊCH SỬ & KỊCH BẢN DIỄN TẬP
                </span>
              </div>
              <span className="text-[10px] text-slate-400">5 kịch bản mẫu</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(typhoonData?.storms || []).map((storm) => (
                <button
                  key={storm.id}
                  onClick={() => setSelectedStormId(storm.id)}
                  className={`p-2.5 rounded-lg text-left transition border ${
                    selectedStormId === storm.id
                      ? 'bg-sky-950 border-sky-400 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="font-bold text-xs truncate">{storm.international_name}</div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between font-mono">
                    <span className="truncate">{storm.beaufort_scale_str || 'Cấp 9-10'}</span>
                    <span className="text-amber-400 shrink-0 ml-1">{storm.current_wind_speed_kmh} km/h</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
