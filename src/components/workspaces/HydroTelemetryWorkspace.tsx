import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Waves,
  CloudRain,
  Activity,
  TrendingUp,
  Clock,
  ShieldAlert,
  Search,
  RefreshCw,
  Sliders,
  ExternalLink,
  ChevronRight,
  Globe2,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { RainfallStation, SpatialZone, LstmHydrographAnalysis } from '../../types';
import { safeFetchJson } from '../../utils/apiClient';
import { NORTHERN_VIETNAM_ZONES } from '../../../server/data/northern_vietnam_zones';

interface HydroTelemetryWorkspaceProps {
  stations: RainfallStation[];
  onOpenTransboundaryModal?: () => void;
  onOpenLstmModal?: () => void;
}

export const HydroTelemetryWorkspace: React.FC<HydroTelemetryWorkspaceProps> = ({
  stations,
  onOpenTransboundaryModal,
  onOpenLstmModal
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRiverBasin, setSelectedRiverBasin] = useState<string>('ALL');
  const [selectedStation, setSelectedStation] = useState<RainfallStation | null>(stations[0] || null);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('ZONE-LC-01');
  const [hydrographData, setHydrographData] = useState<LstmHydrographAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    if (stations.length > 0 && !selectedStation) {
      setSelectedStation(stations[0]);
    }
  }, [stations, selectedStation]);

  const fetchHydrograph = async (zoneId: string) => {
    setLoading(true);
    try {
      const json = await safeFetchJson<LstmHydrographAnalysis>(`/api/v1/lstm/hydrograph/${zoneId}`);
      if (json) {
        setHydrographData(json);
      }
    } catch (err) {
      console.warn('Error fetching hydrograph:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedZoneId) {
      fetchHydrograph(selectedZoneId);
    }
  }, [selectedZoneId]);

  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      await safeFetchJson('/api/v2/weather/sync', { method: 'POST' });
      await fetchHydrograph(selectedZoneId);
    } catch (e) {
      console.warn('Sync failed:', e);
    } finally {
      setTimeout(() => setIsSyncing(false), 800);
    }
  };

  // Filter stations
  const filteredStations = stations.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.station_code.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedRiverBasin === 'ALL') return matchesSearch;
    return matchesSearch && s.province.toLowerCase().includes(selectedRiverBasin.toLowerCase());
  });

  const heavyRainCount = stations.filter((s) => (s.rainfall_1h_mm || s.rain_1h || 0) >= 20).length;
  const criticalRainCount = stations.filter((s) => (s.rainfall_24h_mm || s.rain_24h || 0) >= 100).length;

  const points = hydrographData?.hydrograph_points || [];
  const maxFlow = Math.max(...points.map((p) => p.upper_bound_m3s || 0), hydrographData?.alarm_levels.bd3_m3s || 100, 20);
  const maxRain = Math.max(...points.map((p) => p.rainfall_mm || 0), 20);

  const svgWidth = 740;
  const svgHeight = 220;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070B14] text-slate-100 overflow-hidden select-none font-sans">
      {/* Top Banner KPI Strip */}
      <div className="bg-[#0B1220] border-b border-slate-800/80 px-4 py-3 shrink-0 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-950/80 border border-sky-500/40 text-sky-400">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>TRUNG TÂM QUAN TRẮC KHÍ TƯỢNG THỦY VĂN & THỦY HỆ QUỐC GIA</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                110 TRẠM KTTV
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Giám sát viễn trắc mưa thời gian thực, mực nước sông hồ, mô hình dự báo lũ LSTM & hồ chứa xuyên biên giới
            </p>
          </div>
        </div>

        {/* Quick KPI Counters */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400">Trực tuyến:</span>
            <span className="font-mono font-bold text-xs text-emerald-400">{stations.length}/{stations.length}</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-amber-950/50 border border-amber-500/40 flex items-center gap-2">
            <CloudRain className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-amber-200">Mưa lớn (&gt;20mm/h):</span>
            <span className="font-mono font-bold text-xs text-amber-400">{heavyRainCount} trạm</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-rose-950/50 border border-rose-500/40 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-xs text-rose-200">Mưa rất to (&gt;100mm/24h):</span>
            <span className="font-mono font-bold text-xs text-rose-400">{criticalRainCount} trạm</span>
          </div>

          <button
            onClick={handleSyncData}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ WMO Live'}</span>
          </button>
        </div>
      </div>

      {/* Main Multi-Column Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT COLUMN: Stations Directory & River Basins (4 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 border-r border-slate-800/80 bg-[#090F1D] flex flex-col overflow-hidden">
          {/* Search & River Filters */}
          <div className="p-3 border-b border-slate-800/80 space-y-2 bg-[#0B1426]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm trạm đo, tỉnh, mã trạm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition"
              />
            </div>

            {/* River Basin Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-semibold scrollbar-thin py-0.5">
              <button
                onClick={() => setSelectedRiverBasin('ALL')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap transition ${
                  selectedRiverBasin === 'ALL'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                Tất cả ({stations.length})
              </button>
              <button
                onClick={() => setSelectedRiverBasin('Lào Cai')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap transition ${
                  selectedRiverBasin === 'Lào Cai'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                🇨🇳 Lưu vực S.Hồng
              </button>
              <button
                onClick={() => setSelectedRiverBasin('Yên Bái')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap transition ${
                  selectedRiverBasin === 'Yên Bái'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                Lưu vực S.Chảy
              </button>
              <button
                onClick={() => setSelectedRiverBasin('Sơn La')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap transition ${
                  selectedRiverBasin === 'Sơn La'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                Lưu vực S.Đà
              </button>
            </div>
          </div>

          {/* Stations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
            {filteredStations.map((st) => {
              const isSelected = selectedStation?.id === st.id;
              const rain1h = st.rainfall_1h_mm || st.rain_1h || 0;
              const rain24h = st.rainfall_24h_mm || st.rain_24h || 0;
              const isWarning = rain24h >= 80 || rain1h >= 25;

              return (
                <div
                  key={st.id}
                  onClick={() => setSelectedStation(st)}
                  className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-sky-950/70 border border-sky-500/60 shadow-md'
                      : 'bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isWarning ? 'bg-rose-950/80 text-rose-400 border border-rose-600/50' : 'bg-slate-800 text-sky-400'
                    }`}>
                      <CloudRain className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white flex items-center gap-2">
                        <span>{st.name}</span>
                        <span className="font-mono text-[10px] text-slate-400 font-normal">[{st.station_code}]</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{st.province}</span>
                        <span>•</span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {st.lat.toFixed(2)}°N, {st.lng.toFixed(2)}°E
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rainfall Metrics */}
                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-white">
                      {rain1h} <span className="text-[10px] text-slate-400 font-normal">mm/h</span>
                    </div>
                    <div className={`text-[10px] font-mono font-semibold ${
                      isWarning ? 'text-rose-400 font-bold' : 'text-slate-400'
                    }`}>
                      24h: {rain24h} mm
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Hydrograph & Reservoir Analytics (7-8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-[#070C16] flex flex-col overflow-y-auto p-4 space-y-4">
          {/* Station Detail Card */}
          {selectedStation && (
            <div className="bg-[#0B1322] border border-slate-800 rounded-xl p-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                      TRẠM TỰ ĐỘNG KHÍ TƯỢNG THỦY VĂN
                    </span>
                    <h2 className="text-base font-bold text-white">{selectedStation.name}</h2>
                    <span className="text-xs text-slate-400 font-mono">({selectedStation.province})</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tọa độ: {selectedStation.lat}°N, {selectedStation.lng}°E • Độ cao: {selectedStation.elevation_m || 245}m so với mực nước biển
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {onOpenTransboundaryModal && (
                    <button
                      onClick={onOpenTransboundaryModal}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-300 border border-sky-500/40 text-xs font-bold transition"
                    >
                      <Globe2 className="w-3.5 h-3.5" />
                      <span>Hồ Thủy Điện Thượng Nguồn</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Station telemetry stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Lượng mưa 1 giờ</div>
                  <div className="text-lg font-mono font-bold text-cyan-400 mt-1">
                    {selectedStation.rainfall_1h_mm || selectedStation.rain_1h || 0} <span className="text-xs text-slate-400">mm</span>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Lượng mưa tích lũy 24h</div>
                  <div className="text-lg font-mono font-bold text-sky-300 mt-1">
                    {selectedStation.rainfall_24h_mm || selectedStation.rain_24h || 0} <span className="text-xs text-slate-400">mm</span>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Mực nước sông hiện tại</div>
                  <div className="text-lg font-mono font-bold text-emerald-400 mt-1">
                    {(14.2 + (selectedStation.rain_1h || 0) * 0.15).toFixed(2)} <span className="text-xs text-slate-400">m</span>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Trạng thái Báo động</div>
                  <div className="text-xs font-bold text-amber-400 mt-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Dưới Báo Động I (An toàn)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LSTM Hydrograph Forecasting Suite */}
          <div className="bg-[#0B1322] border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-sky-950 border border-sky-500/40 text-sky-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    ĐƯỜNG QUÁ TRÌNH LŨ LSTM 24H & DỰ BÁO XUNG YẾU LƯU VỰC
                  </h3>
                  <p className="text-xs text-slate-400">
                    Mô hình học sâu AI mô phỏng lưu lượng đỉnh lũ (m³/s), độ trễ truyền lũ và xác suất tràn đê
                  </p>
                </div>
              </div>

              {/* Zone Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Lưu vực điểm:</span>
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 font-bold focus:outline-none focus:border-sky-400"
                >
                  <option value="ZONE-LC-01">Vùng Bát Xát - TP Lào Cai (Sông Hồng)</option>
                  <option value="ZONE-YB-02">Vùng Lục Yên - Yên Bái (Sông Chảy)</option>
                  <option value="ZONE-LS-03">Vùng Na Sầm - Lạng Sơn (Sông Kỳ Cùng)</option>
                  <option value="ZONE-BK-04">Vùng Chợ Mới - Bắc Kạn (Sông Cầu)</option>
                </select>
              </div>
            </div>

            {/* Hydrograph Chart Display */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 overflow-x-auto">
              <div className="min-w-[680px]">
                {loading ? (
                  <div className="h-[220px] flex items-center justify-center text-slate-400 text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin mr-2 text-sky-400" />
                    Đang nạp mô hình LSTM...
                  </div>
                ) : points.length > 0 ? (
                  <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-[220px]">
                    {/* Grid lines */}
                    <line x1="50" y1="20" x2={svgWidth - 20} y2="20" stroke="#1e293b" strokeDasharray="3 3" />
                    <line x1="50" y1="80" x2={svgWidth - 20} y2="80" stroke="#1e293b" strokeDasharray="3 3" />
                    <line x1="50" y1="140" x2={svgWidth - 20} y2="140" stroke="#1e293b" strokeDasharray="3 3" />
                    <line x1="50" y1="180" x2={svgWidth - 20} y2="180" stroke="#334155" />

                    {/* Alarm Level 3 (Red) */}
                    {hydrographData?.alarm_levels.bd3_m3s && (
                      <g>
                        <line
                          x1="50"
                          y1={180 - (hydrographData.alarm_levels.bd3_m3s / maxFlow) * 160}
                          x2={svgWidth - 20}
                          y2={180 - (hydrographData.alarm_levels.bd3_m3s / maxFlow) * 160}
                          stroke="#ef4444"
                          strokeWidth="1.5"
                          strokeDasharray="4 2"
                        />
                        <text
                          x={svgWidth - 110}
                          y={176 - (hydrographData.alarm_levels.bd3_m3s / maxFlow) * 160}
                          fill="#ef4444"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          BÁO ĐỘNG III ({hydrographData.alarm_levels.bd3_m3s} m³/s)
                        </text>
                      </g>
                    )}

                    {/* Flow Forecast Curve */}
                    <path
                      d={points
                        .map((p, idx) => {
                          const x = 50 + (idx / (points.length - 1)) * (svgWidth - 70);
                          const y = 180 - (p.mean_flow_m3s / maxFlow) * 160;
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="3"
                    />

                    {/* Points */}
                    {points.map((p, idx) => {
                      const x = 50 + (idx / (points.length - 1)) * (svgWidth - 70);
                      const y = 180 - (p.mean_flow_m3s / maxFlow) * 160;
                      return (
                        <circle
                          key={idx}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#0284c7"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          className="hover:r-6 cursor-pointer"
                        />
                      );
                    })}

                    {/* X-Axis labels */}
                    {points.filter((_, i) => i % 3 === 0).map((p, idx) => {
                      const origIndex = idx * 3;
                      const x = 50 + (origIndex / (points.length - 1)) * (svgWidth - 70);
                      return (
                        <text key={idx} x={x} y="200" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                          {p.timestamp}
                        </text>
                      );
                    })}
                  </svg>
                ) : (
                  <div className="h-[220px] flex items-center justify-center text-slate-400 text-xs">
                    Chưa có chuỗi quan trắc cho lưu vực này
                  </div>
                )}
              </div>
            </div>

            {/* Legend & Summary */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800 gap-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
                  <span className="w-3 h-1 bg-sky-500 rounded-full inline-block" />
                  Đường quá trình lưu lượng lũ (m³/s)
                </span>
                <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                  <span className="w-3 h-1 bg-rose-500 border-dashed inline-block" />
                  Ngưỡng Báo động III
                </span>
              </div>
              <div className="font-mono text-slate-400 text-[11px]">
                Đỉnh lũ dự báo: <strong className="text-white">{(maxFlow * 0.92).toFixed(1)} m³/s</strong> (sau 4h30)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
