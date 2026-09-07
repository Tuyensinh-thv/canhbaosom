import React, { useState, useEffect } from 'react';
import {
  Globe,
  AlertTriangle,
  Flame,
  Wind,
  Waves,
  Mountain,
  Zap,
  Activity,
  RefreshCw,
  Search,
  ExternalLink,
  MapPin,
  Clock,
  Radio,
  X,
  ShieldCheck,
  Compass,
  Layers,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import {
  GlobalDisasterEvent,
  GlobalDisasterCategory,
  GlobalDisasterSeverity,
  GlobalDisasterSummary
} from '../types';

interface GlobalDisasterIntelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEventOnMap?: (lat: number, lng: number, title: string) => void;
  onOpen3DGlobe?: () => void;
}

export const GlobalDisasterIntelModal: React.FC<GlobalDisasterIntelModalProps> = ({
  isOpen,
  onClose,
  onSelectEventOnMap,
  onOpen3DGlobe
}) => {
  const [events, setEvents] = useState<GlobalDisasterEvent[]>([]);
  const [summary, setSummary] = useState<GlobalDisasterSummary | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<GlobalDisasterEvent | null>(null);
  const [activeCategory, setActiveCategory] = useState<GlobalDisasterCategory | 'ALL'>('ALL');
  const [activeSeverity, setActiveSeverity] = useState<GlobalDisasterSeverity | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const fetchDisasterData = async () => {
    setIsLoading(true);
    try {
      const summaryRes = await fetch('/api/v2/global-disasters/summary');
      if (summaryRes.ok) {
        const summaryData = await summaryRes.json();
        setSummary(summaryData);
        setEvents(summaryData.events || []);
        if (summaryData.events && summaryData.events.length > 0 && !selectedEvent) {
          setSelectedEvent(summaryData.events[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to load global disaster events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceSync = async () => {
    setIsSyncing(true);
    try {
      const syncRes = await fetch('/api/v2/global-disasters/sync', { method: 'POST' });
      if (syncRes.ok) {
        await fetchDisasterData();
      }
    } catch (err) {
      console.warn('Failed to force sync global feeds:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDisasterData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredEvents = events.filter((e) => {
    if (activeCategory !== 'ALL' && e.category !== activeCategory) return false;
    if (activeSeverity !== 'ALL' && e.severity !== activeSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        e.title.toLowerCase().includes(q) ||
        e.title_vi.toLowerCase().includes(q) ||
        e.location_name.toLowerCase().includes(q) ||
        e.country.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getCategoryIcon = (category: GlobalDisasterCategory) => {
    switch (category) {
      case 'LANDSLIDE':
        return <Mountain className="w-4 h-4 text-amber-400" />;
      case 'EARTHQUAKE':
        return <Activity className="w-4 h-4 text-red-400" />;
      case 'CYCLONE':
        return <Wind className="w-4 h-4 text-cyan-400" />;
      case 'FLOOD':
        return <Waves className="w-4 h-4 text-blue-400" />;
      case 'VOLCANO':
        return <Zap className="w-4 h-4 text-orange-400" />;
      case 'WILDFIRE':
        return <Flame className="w-4 h-4 text-rose-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getSeverityBadge = (severity: GlobalDisasterSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-950/90 text-red-300 border border-red-500/60 animate-pulse">
            🔴 CỰC KỲ NGUY HIỂM
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-950/90 text-orange-300 border border-orange-500/60">
            🟠 NGUY HIỂM CAO
          </span>
        );
      case 'MODERATE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-950/90 text-yellow-300 border border-yellow-500/60">
            🟡 CẢNH BÁO
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
            🔵 THEO DÕI
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-7xl h-[92vh] flex flex-col bg-slate-950/95 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header Strip */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-inner">
              <Globe className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-wide text-white uppercase flex items-center gap-2">
                  Trung tâm Tình báo Thiên tai & Sạt lở Toàn cầu
                  <span className="text-xs px-2 py-0.5 font-mono bg-cyan-950 text-cyan-300 border border-cyan-700/50 rounded-full">
                    NASA EONET • USGS • GDACS
                  </span>
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Thu thập và phân tích trực tiếp dữ liệu thảm họa, sạt lở đất, động đất, siêu bão thời gian thực trên toàn thế giới
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleForceSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-600/40 text-xs font-semibold transition-all disabled:opacity-50"
              title="Đồng bộ lại dữ liệu mới nhất từ NASA EONET & USGS"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isSyncing ? 'Đang đồng bộ...' : 'Làm mới nguồn tin'}</span>
            </button>

            {onOpen3DGlobe && (
              <button
                onClick={onOpen3DGlobe}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-600/40 text-xs font-semibold transition-all"
                title="Mở trên Quả địa cầu 3D toàn cầu"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Quả cầu 3D</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 px-5 py-2.5 bg-slate-900/60 border-b border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <Radio className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Tổng sự kiện đang theo dõi</div>
              <div className="text-sm font-bold font-mono text-cyan-300">{summary?.total_active_events || events.length}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/30 border border-red-900/50">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <div>
              <div className="text-[10px] text-red-300/80 uppercase">Thảm họa khẩn cấp</div>
              <div className="text-sm font-bold font-mono text-red-400">{summary?.critical_events_count || 0}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/30 border border-amber-900/50">
            <Mountain className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-amber-300/80 uppercase">Sạt lở & Lũ bùn đá</div>
              <div className="text-sm font-bold font-mono text-amber-300">{summary?.landslides_count || 0}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/30 border border-rose-900/50">
            <Activity className="w-4 h-4 text-rose-400" />
            <div>
              <div className="text-[10px] text-rose-300/80 uppercase">Động đất lớn</div>
              <div className="text-sm font-bold font-mono text-rose-300">{summary?.earthquakes_count || 0}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/30 border border-blue-900/50 col-span-2 sm:col-span-1">
            <Wind className="w-4 h-4 text-blue-400" />
            <div>
              <div className="text-[10px] text-blue-300/80 uppercase">Siêu bão & Lũ lụt</div>
              <div className="text-sm font-bold font-mono text-blue-300">{(summary?.cyclones_count || 0) + (summary?.floods_count || 0)}</div>
            </div>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Filter & Event List */}
          <div className="w-full md:w-5/12 lg:w-4/12 flex flex-col border-r border-slate-800 bg-slate-950/60 overflow-hidden">
            {/* Search & Category Pills */}
            <div className="p-3 border-b border-slate-800/80 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm quốc gia, địa điểm, sự kiện..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'ALL', label: 'Tất cả' },
                  { id: 'LANDSLIDE', label: 'Sạt lở đất', icon: <Mountain className="w-3 h-3" /> },
                  { id: 'EARTHQUAKE', label: 'Động đất', icon: <Activity className="w-3 h-3" /> },
                  { id: 'CYCLONE', label: 'Siêu bão', icon: <Wind className="w-3 h-3" /> },
                  { id: 'FLOOD', label: 'Lũ lụt', icon: <Waves className="w-3 h-3" /> },
                  { id: 'VOLCANO', label: 'Núi lửa', icon: <Zap className="w-3 h-3" /> }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                      activeCategory === cat.id
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* List of Events */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1.5 custom-scrollbar">
              {filteredEvents.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Không tìm thấy sự kiện phù hợp với bộ lọc hiện tại.
                </div>
              ) : (
                filteredEvents.map((evt) => {
                  const isSelected = selectedEvent?.id === evt.id;
                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className={`p-3 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/40'
                          : 'bg-slate-900/40 hover:bg-slate-900/90 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          {getCategoryIcon(evt.category)}
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                            {evt.category_label_vi}
                          </span>
                        </div>
                        {getSeverityBadge(evt.severity)}
                      </div>

                      <h4 className="text-xs font-bold text-slate-100 leading-snug line-clamp-2 mb-1">
                        {evt.title_vi}
                      </h4>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                        <span className="flex items-center gap-1 text-cyan-300 font-medium truncate max-w-[170px]">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{evt.country} • {evt.location_name}</span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-400 text-[10px] font-mono">
                          <Clock className="w-3 h-3" />
                          {new Date(evt.occurred_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Detailed Event Intelligence */}
          <div className="w-full md:w-7/12 lg:w-8/12 flex flex-col bg-slate-950 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
            {selectedEvent ? (
              <div className="space-y-5">
                {/* Event Top Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/80 to-cyan-950/30 border border-slate-800 shadow-xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono text-xs font-bold">
                        {selectedEvent.source_provider}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        MÃ: {selectedEvent.id}
                      </span>
                    </div>
                    {getSeverityBadge(selectedEvent.severity)}
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                    {selectedEvent.title_vi}
                  </h3>

                  <p className="text-xs text-slate-400 italic">
                    Original name: "{selectedEvent.title}"
                  </p>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Địa điểm & Quốc gia</span>
                      <span className="font-semibold text-cyan-300 truncate block">
                        {selectedEvent.location_name}, {selectedEvent.country}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Quy mô / Cường độ</span>
                      <span className="font-semibold text-amber-300 truncate block">
                        {selectedEvent.magnitude_display || 'Đang cập nhật'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Tọa độ chấn tâm</span>
                      <span className="font-mono font-semibold text-slate-200 block">
                        [{selectedEvent.lat.toFixed(3)}, {selectedEvent.lng.toFixed(3)}]
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Thời điểm phát sinh</span>
                      <span className="font-semibold text-slate-300 block">
                        {new Date(selectedEvent.occurred_at).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Tactical Assessment */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 space-y-2 shadow-lg">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wide">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    Phân tích Tình báo & Cơ chế Địa chất / Khí tượng (AI Assessment)
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedEvent.ai_tactical_assessment_vi}
                  </p>
                  {selectedEvent.lead_time_insight_vi && (
                    <div className="text-[11px] text-amber-300/90 pt-1 flex items-center gap-1.5 border-t border-cyan-900/40">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span><strong>Thời gian cảnh báo sớm (Lead Time):</strong> {selectedEvent.lead_time_insight_vi}</span>
                    </div>
                  )}
                </div>

                {/* Damage & Situation Summary */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wide">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Tình hình thiệt hại & Tác động thực địa
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedEvent.damage_summary_vi}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs">
                    {selectedEvent.affected_population_est && (
                      <div className="p-2 rounded bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Dân số bị ảnh hưởng</span>
                        <span className="font-bold text-amber-300">
                          ~{selectedEvent.affected_population_est.toLocaleString('vi-VN')} người
                        </span>
                      </div>
                    )}
                    {selectedEvent.fatalities_est !== undefined && (
                      <div className="p-2 rounded bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Thương vong ước tính</span>
                        <span className="font-bold text-red-400">
                          {selectedEvent.fatalities_est > 0 ? `${selectedEvent.fatalities_est.toLocaleString('vi-VN')} người` : 'Chưa ghi nhận'}
                        </span>
                      </div>
                    )}
                    {selectedEvent.affected_radius_km && (
                      <div className="p-2 rounded bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Bán kính ảnh hưởng</span>
                        <span className="font-bold text-cyan-300">
                          ~{selectedEvent.affected_radius_km} km
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Satellite Imagery Preview */}
                {selectedEvent.satellite_evidence_url && (
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wide">
                        <Layers className="w-4 h-4 text-indigo-400" />
                        Hình ảnh vệ tinh viễn thám & Hiện trường
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">NASA Earth Observatory / Sentinel Hub</span>
                    </div>
                    <div className="relative rounded-lg overflow-hidden border border-slate-700 h-48 sm:h-64 bg-slate-950">
                      <img
                        src={selectedEvent.satellite_evidence_url}
                        alt={selectedEvent.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                        <div className="text-[11px] text-slate-200 font-medium">
                          Ảnh chụp hiện trường & phân tích dị thường địa mạo vùng {selectedEvent.location_name}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  {onSelectEventOnMap && (
                    <button
                      onClick={() => {
                        onSelectEventOnMap(selectedEvent.lat, selectedEvent.lng, selectedEvent.title_vi);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 transition-all"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Định vị trên Bản đồ WebGIS</span>
                    </button>
                  )}

                  {selectedEvent.source_url && (
                    <a
                      href={selectedEvent.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
                    >
                      <span>Nguồn chuẩn ({selectedEvent.source_provider})</span>
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
                <Globe className="w-12 h-12 text-slate-700 animate-pulse" />
                <p className="text-sm">Chọn một sự kiện thảm họa từ danh sách bên trái để xem phân tích chi tiết.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
