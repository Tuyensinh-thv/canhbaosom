import React, { useState, useEffect } from 'react';
import {
  X,
  Compass,
  Wind,
  Waves,
  AlertTriangle,
  RefreshCw,
  Eye,
  Navigation,
  ShieldAlert,
  CloudRain,
  MapPin,
  Flame,
  Radio,
  CheckCircle2,
  Clock,
  Layers,
  Activity,
  Droplets,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Globe2,
  History,
  BookOpen,
  FolderArchive,
  ArrowRight
} from 'lucide-react';
import { TyphoonTrackingOverview, TyphoonStorm, TyphoonTrackPoint, MultiModelForecastComparison } from '../types';
import { safeFetchJson } from '../utils/apiClient';
import { HistoricalTyphoonManagerModal } from './HistoricalTyphoonManagerModal';

interface TyphoonTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectZoneOnMap?: (zoneId: string) => void;
  onLoadScenarioForReplay?: (stormId: string) => void;
}

export const TyphoonTrackerModal: React.FC<TyphoonTrackerModalProps> = ({
  isOpen,
  onClose,
  onSelectZoneOnMap,
  onLoadScenarioForReplay
}) => {
  const [data, setData] = useState<TyphoonTrackingOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedStormId, setSelectedStormId] = useState<string>('typhoon-live-2026-05');
  const [activeTab, setActiveTab] = useState<'TRACK_MAP' | 'MULTI_MODEL' | 'INLAND_RAIN' | 'ADVISORIES'>('TRACK_MAP');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [showHistoricalManager, setShowHistoricalManager] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const json = await safeFetchJson<TyphoonTrackingOverview>('/api/v1/typhoon/overview');
      if (json) {
        setData(json);
        if (json.storms && json.storms.length > 0) {
          // Default to the first active (non-historical) storm if available
          const activeStorm = json.storms.find((s) => !s.is_historical) || json.storms[0];
          setSelectedStormId((prev) => {
            const exists = json.storms.some((s) => s.id === prev);
            return exists ? prev : activeStorm.id;
          });
        }
      }
    } catch (err) {
      console.warn('Notice loading typhoon overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleSyncLive = async () => {
    setIsSyncing(true);
    try {
      const res = await safeFetchJson<{ success?: boolean; message?: string }>('/api/v1/typhoon/sync-live', {
        method: 'POST'
      });
      if (res?.success) {
        setSyncMessage(res.message || 'Đã đồng bộ dữ liệu bão thành công!');
        await fetchData();
        setTimeout(() => setSyncMessage(null), 4000);
      }
    } catch (e) {
      console.warn('Notice syncing typhoon live data:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOpen) return null;

  const currentStorm: TyphoonStorm | undefined =
    data?.storms.find((s) => s.id === selectedStormId) || data?.storms[0];

  const getCategoryColor = (cat?: string) => {
    switch (cat) {
      case 'SUPER_TYPHOON':
        return 'bg-purple-900/60 text-purple-200 border-purple-500/80 shadow-purple-900/50';
      case 'VIOLENT_TYPHOON':
      case 'TYPHOON':
        return 'bg-rose-900/60 text-rose-200 border-rose-500/80 shadow-rose-900/50';
      case 'SEVERE_TROPICAL_STORM':
      case 'TROPICAL_STORM':
        return 'bg-amber-900/60 text-amber-200 border-amber-500/80 shadow-amber-900/50';
      default:
        return 'bg-cyan-900/60 text-cyan-200 border-cyan-500/80 shadow-cyan-900/50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-7xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
        {/* Top Header Banner */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/70">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 bg-gradient-to-br from-rose-600 to-amber-600 rounded-xl text-white shadow-lg shadow-rose-900/40">
              <Compass className="w-6 h-6 animate-spin duration-[15000ms]" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  GIÁM SÁT BÃO & ÁP THẤP NHIỆT ĐỚI BIỂN ĐÔNG
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  REAL-TIME CYCLONE TRACKER
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md">
                  NCHMF • JTWC • JMA • ECMWF
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Theo dõi quỹ đạo tâm bão, bán kính gió nguy hiểm, nón xác suất di chuyển và cảnh báo mưa lũ hoàn lưu vùng núi phía Bắc
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistoricalManager(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-slate-800 to-blue-900/80 hover:from-slate-700 hover:to-blue-800 text-sky-100 border border-sky-500/40 rounded-lg transition shadow-md shadow-sky-950/60 active:scale-95 group"
              title="Mở menu quản lý các cơn bão đã qua & kịch bản diễn tập PCTT"
            >
              <FolderArchive className="w-3.5 h-3.5 text-sky-300 group-hover:scale-110 transition-transform" />
              <span>Kho Bão Lịch Sử & Diễn Tập</span>
              <span className="px-1.5 py-0.2 bg-slate-900 text-sky-300 text-[10px] font-black rounded border border-sky-500/40 ml-0.5">
                {(data?.storms || []).filter((s) => s.is_historical).length || 5}
              </span>
            </button>

            <button
              onClick={handleSyncLive}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 rounded-lg transition shadow-sm active:scale-95 disabled:opacity-50"
              title="Đồng bộ dữ liệu thời gian thực từ Vệ tinh & Radar"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-indigo-400' : ''}`} />
              <span>{isSyncing ? 'Đang nạp...' : 'Đồng bộ Dữ liệu Trực tiếp'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sync Success Alert */}
        {syncMessage && (
          <div className="bg-emerald-950/70 border-b border-emerald-600/40 px-6 py-2 flex items-center justify-between text-xs text-emerald-200 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{syncMessage}</span>
            </div>
            <span className="text-[11px] text-emerald-400/80">Cập nhật: {new Date().toLocaleTimeString('vi-VN')}</span>
          </div>
        )}

        {/* Storm Selector Tabs & Basin KPI */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-rose-400 bg-rose-950/50 border border-rose-800/60 px-2 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Bão & Áp Thấp Thời Gian Thực (2026):</span>
            </div>

            {(data?.storms || []).filter((s) => !s.is_historical).map((storm) => {
              const isSelected = storm.id === selectedStormId;
              return (
                <button
                  key={storm.id}
                  onClick={() => setSelectedStormId(storm.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white border-rose-400 shadow-md shadow-rose-900/40 scale-105'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <Compass className={`w-3.5 h-3.5 ${isSelected ? 'animate-spin duration-[6000ms]' : ''}`} />
                  <span>{storm.vietnam_number}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-black bg-black/30 text-white">
                    {storm.current_category === 'SUPER_TYPHOON' ? 'Siêu bão' : storm.current_category === 'TROPICAL_DEPRESSION' ? 'ATNĐ' : 'Bão'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Nhiệt độ biển (SST): <strong className="text-amber-300 font-bold">{data?.sea_surface_temperature_east_sea || 30.5}°C</strong></span>
            </div>
            <div className="flex items-center gap-1.5 hidden md:flex">
              <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>Himawari-9 & Radar: <strong className="text-slate-200">10 phút/quét</strong></span>
            </div>
          </div>
        </div>

        {/* Main Body */}
        {currentStorm ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Historical Storm Banner when active */}
            {currentStorm.is_historical && (
              <div className="bg-purple-950/80 border border-purple-500/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-purple-200 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-900 rounded-xl text-purple-300 font-black border border-purple-700/60 flex items-center gap-1.5">
                    <History className="w-4 h-4" />
                    <span>HỒ SƠ LỊCH SỬ</span>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-purple-100 flex items-center gap-2">
                      <span>Đang xem hồ sơ bão: {currentStorm.international_name} ({currentStorm.vietnam_number})</span>
                      <span className="px-2 py-0.5 bg-purple-900 text-purple-300 rounded text-[10px] font-black">Năm {currentStorm.season_year || 2024}</span>
                    </div>
                    <div className="text-purple-300/80 mt-0.5">Dữ liệu được lưu trữ làm chuẩn đối sánh mô hình khí tượng, kịch bản hoàn lưu mưa và diễn tập sạt lở đồi dốc.</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setShowHistoricalManager(true)}
                    className="px-3 py-1.5 bg-purple-800 hover:bg-purple-700 text-purple-200 font-bold rounded-lg transition whitespace-nowrap border border-purple-600/50 text-xs"
                  >
                    Xem Hồ Sơ Khác 📚
                  </button>
                  <button
                    onClick={() => {
                      const active = data?.storms.find((s) => !s.is_historical);
                      if (active) setSelectedStormId(active.id);
                    }}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold rounded-lg transition whitespace-nowrap shadow-md text-xs flex items-center gap-1.5"
                  >
                    <span>Quay lại Bão Thời Gian Thực (2026)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-slate-850 to-slate-900 border border-slate-700/70 rounded-2xl p-5 shadow-xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border shadow-md ${getCategoryColor(currentStorm.current_category)}`}>
                      {currentStorm.current_category_label}
                    </span>
                    <h3 className="text-2xl font-black text-white tracking-tight">
                      {currentStorm.international_name} ({currentStorm.vietnam_number})
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      Mã quốc tế: {currentStorm.storm_code}
                    </span>
                  </div>
                  <p className="text-sm text-amber-300 font-semibold mt-1.5 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Dự kiến đổ bộ: <strong>{currentStorm.estimated_landfall_area}</strong> ({currentStorm.estimated_landfall_time})</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <div className="text-xs">
                    <div className="text-slate-400">Cách bờ biển Việt Nam:</div>
                    <div className="text-sm font-bold text-rose-400">~{currentStorm.distance_to_mainland_km} km</div>
                  </div>
                </div>
              </div>

              {/* 5-Column Gauges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-4">
                {/* Wind Speed */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-rose-400" /> Sức Gió Cực Đại</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-rose-400">{currentStorm.current_wind_speed_kmh}</span>
                    <span className="text-xs text-slate-400 font-semibold">km/h</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5 font-medium truncate">{currentStorm.beaufort_scale_str}</div>
                </div>

                {/* Wind Gust */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-purple-400" /> Gió Giật Tối Đa</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-purple-400">{currentStorm.current_wind_gust_kmh}</span>
                    <span className="text-xs text-slate-400 font-semibold">km/h</span>
                  </div>
                  <div className="text-[11px] text-purple-300 mt-0.5 font-medium">Giật trên Cấp 17</div>
                </div>

                {/* Central Pressure */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Khí Áp Tâm Bão</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-cyan-400">{currentStorm.current_pressure_hpa}</span>
                    <span className="text-xs text-slate-400 font-semibold">hPa</span>
                  </div>
                  <div className="text-[11px] text-cyan-300 mt-0.5 font-medium">Áp suất cực thấp (Rất mạnh)</div>
                </div>

                {/* Moving Direction & Speed */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Navigation className="w-3.5 h-3.5 text-amber-400" /> Hướng & Tốc Độ</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-amber-400">{currentStorm.moving_speed_kmh}</span>
                    <span className="text-xs text-slate-400 font-semibold">km/h</span>
                  </div>
                  <div className="text-[11px] text-amber-300 mt-0.5 font-medium truncate">{currentStorm.moving_direction}</div>
                </div>

                {/* Sea Waves & Storm Surge */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Waves className="w-3.5 h-3.5 text-sky-400" /> Sóng & Nước Dâng</span>
                  </div>
                  <div className="mt-1 text-sm font-bold text-sky-300">{currentStorm.sea_wave_height_m}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Nước dâng: {currentStorm.storm_surge_height_m}</div>
                </div>
              </div>
            </div>

            {/* Navigation Sub-Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('TRACK_MAP')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'TRACK_MAP'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Quỹ Đạo Tâm Bão & Bán Kính Gió Nguy Hiểm</span>
              </button>

              <button
                onClick={() => setActiveTab('MULTI_MODEL')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'MULTI_MODEL'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Globe2 className="w-4 h-4" />
                <span>So Sánh Đa Mô Hình Dự Báo (NCHMF/JTWC/JMA/ECMWF)</span>
              </button>

              <button
                onClick={() => setActiveTab('INLAND_RAIN')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'INLAND_RAIN'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <CloudRain className="w-4 h-4 text-cyan-400" />
                <span>Hoàn Lưu Mưa Bão & Nguy Cơ Lũ Quét Sạt Lở Vùng Núi</span>
              </button>

              <button
                onClick={() => setActiveTab('ADVISORIES')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'ADVISORIES'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Công Điện & Khuyến Cáo Tác Chiến PCTT</span>
              </button>
            </div>

            {/* TAB 1: TRACK & DANGER RADII */}
            {activeTab === 'TRACK_MAP' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Schematic Cyclone Track Radar View */}
                <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4 z-10">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-rose-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Sơ Đồ Quỹ Đạo Vị Trí Tâm Bão & Nón Xác Suất Di Chuyển (Biển Đông)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Quá khứ</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" /> Hiện tại</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-dashed" /> Dự báo (12-48h)</span>
                    </div>
                  </div>

                  {/* Visual SVG Map Schema */}
                  <div className="relative w-full h-80 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/40 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />

                    {/* Coastal Outline SVG (Vietnam Gulf of Tonkin & East Sea) */}
                    <svg viewBox="0 0 600 320" className="w-full h-full absolute inset-0 text-slate-700">
                      {/* Coastline approximate */}
                      <path
                        d="M 120 20 L 150 50 L 180 70 L 190 100 L 170 140 L 160 180 L 170 230 L 190 280 L 220 310"
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="3"
                        strokeDasharray="4 2"
                        className="opacity-70"
                      />
                      {/* Hainan Island */}
                      <path
                        d="M 330 110 Q 380 90 400 130 Q 390 170 340 160 Z"
                        fill="#1e293b"
                        stroke="#0ea5e9"
                        strokeWidth="1.5"
                        className="opacity-60"
                      />
                      <text x="345" y="140" fill="#94a3b8" fontSize="10" fontWeight="bold">Đảo Hải Nam</text>
                      <text x="70" y="80" fill="#38bdf8" fontSize="11" fontWeight="bold">ĐẤT LIỀN BẮC BỘ</text>
                      <text x="175" y="60" fill="#f87171" fontSize="9">Quảng Ninh - Hải Phòng</text>
                      <text x="140" y="220" fill="#f87171" fontSize="9">Miền Trung</text>

                      {/* Paracel / Hoang Sa */}
                      <circle cx="440" cy="230" r="4" fill="#fbbf24" />
                      <text x="450" y="235" fill="#fde047" fontSize="9" fontWeight="bold">QĐ Hoàng Sa</text>

                      {/* Cone of Uncertainty Polygon */}
                      <polygon
                        points="480,110 370,120 280,105 180,95 100,80 120,130 200,140 300,160 480,110"
                        fill="rgba(239, 68, 68, 0.12)"
                        stroke="rgba(239, 68, 68, 0.4)"
                        strokeWidth="1.5"
                        strokeDasharray="5 3"
                      />

                      {/* Track Line connecting points */}
                      <polyline
                        points="500,110 400,125 320,115 260,110 180,95 120,85"
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="3.5"
                      />

                      {/* Past Points */}
                      <circle cx="500" cy="110" r="5" fill="#64748b" />
                      <circle cx="400" cy="125" r="5" fill="#64748b" />
                      <circle cx="320" cy="115" r="6" fill="#f43f5e" />

                      {/* CURRENT EYE (Animated) */}
                      <circle cx="260" cy="110" r="16" fill="rgba(225, 29, 72, 0.25)" className="animate-ping" />
                      <circle cx="260" cy="110" r="8" fill="#e11d48" stroke="#ffffff" strokeWidth="2" />
                      
                      {/* Wind Danger Radii Circles */}
                      {/* Radius Lv 6 (Gale ~ 250km) */}
                      <circle cx="260" cy="110" r="65" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                      {/* Radius Lv 10 (Storm ~ 130km) */}
                      <circle cx="260" cy="110" r="38" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.7" />
                      {/* Radius Lv 12 (Destructive ~ 60km) */}
                      <circle cx="260" cy="110" r="18" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.9" />

                      {/* Forecast Points */}
                      <circle cx="180" cy="95" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                      <text x="175" y="82" fill="#fbbf24" fontSize="9" fontWeight="bold">+6h (Đổ bộ)</text>
                      
                      <circle cx="120" cy="85" r="4" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
                      <text x="110" y="72" fill="#22d3ee" fontSize="9" fontWeight="bold">+24h (Yên Bái - Lào Cai)</text>
                    </svg>

                    {/* Overlay Label Card */}
                    <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-2.5 text-[11px] space-y-1">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        Tâm Bão Hiện Tại: {currentStorm.current_coords[0]}°N, {currentStorm.current_coords[1]}°E
                      </div>
                      <div className="text-amber-300">Bán kính gió bão cấp 10: <strong>130 km</strong></div>
                      <div className="text-rose-400">Bán kính gió tàn phá cấp 12: <strong>60 km</strong></div>
                    </div>
                  </div>

                  {/* Sequence Timeline Steps */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                    {currentStorm.forecast_track.map((pt, idx) => (
                      <div key={idx} className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{pt.time_display.split('(')[0]}</span>
                        </div>
                        <div className="text-xs font-bold text-white mt-1 truncate">{pt.intensity_label_vn}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Gió: <strong>{pt.wind_speed_kmh} km/h</strong></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right 1 Col: Coastal Danger Alert Zones */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      Khu Vực Nguy Hiểm Ven Biển & Cấm Biển
                    </h4>
                    <div className="space-y-2">
                      {currentStorm.coastal_danger_zones.map((zone, idx) => (
                        <div key={idx} className="p-3 bg-slate-900/90 border border-rose-900/40 rounded-xl text-xs flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="text-slate-200 font-medium leading-relaxed">{zone}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs space-y-1.5">
                    <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-indigo-400" />
                      Lệnh Cấm Biển & Điều Hành Tàu Thuyền
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      100% tàu thuyền tại Vịnh Bắc Bộ đã được kêu gọi vào nơi tránh trú an toàn. Tạm dừng vận hành cáp treo, phà biển Cát Bà - Cô Tô.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MULTI-MODEL FORECAST COMPARISON */}
            {activeTab === 'MULTI_MODEL' && (
              <div className="space-y-4">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Globe2 className="w-4 h-4 text-indigo-400" />
                      So Sánh Dự Báo Quỹ Đạo Giữa Các Trung Tâm Khí Tượng Hàng Đầu
                    </h4>
                    <span className="text-xs text-slate-400">Độ đồng thuận dự báo (Model Consensus): <strong className="text-emerald-400">92% Rất cao</strong></span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {currentStorm.model_comparisons.map((model) => (
                      <div key={model.agency_id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-xs font-bold text-white">{model.country}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/20 text-indigo-300">
                            {model.agency_id}
                          </span>
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <div>
                            <span className="text-slate-400">Thời gian đổ bộ:</span>
                            <div className="font-bold text-amber-300">{model.predicted_landfall_time}</div>
                          </div>
                          <div>
                            <span className="text-slate-400">Khu vực tâm bão vào:</span>
                            <div className="font-bold text-slate-200">{model.predicted_landfall_location}</div>
                          </div>
                          <div>
                            <span className="text-slate-400">Cường độ lúc đổ bộ:</span>
                            <div className="font-bold text-rose-400">{model.predicted_landfall_intensity}</div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80">
                          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Dự báo vị trí (+24h):</span>
                          {model.track_points[model.track_points.length - 1] && (
                            <div className="text-xs font-mono text-cyan-300 bg-slate-950 px-2 py-1 rounded">
                              {model.track_points[model.track_points.length - 1].coords[0]}°N, {model.track_points[model.track_points.length - 1].coords[1]}°E ({model.track_points[model.track_points.length - 1].wind_speed_kmh} km/h)
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: INLAND TORRENTIAL RAIN & LANDSLIDE RISK */}
            {activeTab === 'INLAND_RAIN' && (
              <div className="space-y-4">
                <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-2xl flex items-start gap-3">
                  <Flame className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-200">
                      Cảnh Báo Hoàn Lưu Bão Sau Đổ Bộ Gây Mưa Lũ Lịch Sử & Sạt Lở Đất Vùng Núi
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Bài học từ các cơn bão mạnh như <strong>Bão YAGI</strong> cho thấy thiệt hại lớn nhất thường xảy ra do <strong>hoàn lưu bão gây mưa đặc biệt lớn (300 - 500mm)</strong> dồn dập tại vùng núi cao, làm sụp đổ các sườn taluy dốc và gây lũ quét lũ bùn đá nghiêm trọng tại các địa bàn như Bảo Yên (Làng Nủ), Sa Pa, Bát Xát, Lục Yên, Nguyên Bình.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentStorm.inland_torrential_rain_risk_zones.map((item, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-sm font-black text-white">{item.province}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          item.landslide_flashflood_risk === 'EXTREME'
                            ? 'bg-rose-600 text-white animate-pulse'
                            : item.landslide_flashflood_risk === 'VERY_HIGH'
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : 'bg-yellow-400 text-slate-950 font-black'
                        }`}>
                          RỦI RO {item.landslide_flashflood_risk === 'EXTREME' ? 'CỰC KỲ CAO' : 'RẤT CAO'}
                        </span>
                      </div>

                      <div>
                        <div className="text-xs text-slate-400">Lượng mưa hoàn lưu dự kiến:</div>
                        <div className="text-base font-black text-cyan-400 mt-0.5">{item.expected_rainfall_mm}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-400 mb-1">Các huyện / điểm nóng trọng điểm:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.key_districts.map((d, dIdx) => (
                            <span key={dIdx} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-200 border border-slate-700">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: OFFICIAL ADVISORIES & PCTT ORDERS */}
            {activeTab === 'ADVISORIES' && (
              <div className="space-y-4">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white">{currentStorm.official_bulletin_number}</h4>
                      <p className="text-xs text-slate-400">Cơ quan ban hành: <strong>{currentStorm.issuer}</strong></p>
                    </div>
                    <span className="text-xs text-slate-400">Thời gian ban hành: {new Date(currentStorm.last_updated_time).toLocaleString('vi-VN')}</span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Tóm Tắt Nhận Định Khí Tượng:</h5>
                    <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 font-sans">
                      {currentStorm.synoptic_summary}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">Chỉ Đạo Tác Chiến & Hướng Dẫn Phòng Chống Của Ban Chỉ Huy:</h5>
                    <div className="space-y-2">
                      {currentStorm.safety_instructions.map((inst, idx) => (
                        <div key={idx} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                            {idx + 1}
                          </span>
                          <span className="text-slate-100 font-medium leading-relaxed">{inst}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-2" />
            <span>Đang tải thông tin bão...</span>
          </div>
        )}
        {/* Sub-Modal: Dedicated Historical Typhoon Archive & Drill Manager */}
        <HistoricalTyphoonManagerModal
          isOpen={showHistoricalManager}
          onClose={() => setShowHistoricalManager(false)}
          historicalStorms={(data?.storms || []).filter((s) => s.is_historical)}
          onSelectStormForInspection={(stormId) => {
            setSelectedStormId(stormId);
            setShowHistoricalManager(false);
          }}
          onLoadScenarioForReplay={onLoadScenarioForReplay}
        />
      </div>
    </div>
  );
};
