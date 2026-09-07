import React, { useEffect, useState } from 'react';
import {
  Globe2,
  AlertTriangle,
  Radio,
  Waves,
  RefreshCw,
  Clock,
  ArrowRight,
  Droplets,
  ExternalLink,
  Info,
  CheckCircle2,
  FileCheck,
  Compass,
  Wind,
  Gauge,
  Activity,
  Layers,
  MapPin
} from 'lucide-react';
import { TransboundaryBasinOverview, CrossBorderReservoir, RainfallStation } from '../types';
import { safeFetchJson } from '../utils/apiClient';

type StationRegionFilter = 'ALL' | 'HAINAN' | 'PHILIPPINES' | 'TAIWAN' | 'GUANGZHOU' | 'MEKONG_RED_RIVER';

export const TransboundaryHydroModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const [data, setData] = useState<TransboundaryBasinOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRiver, setSelectedRiver] = useState<'ALL' | 'RED_RIVER_BASIN' | 'MEKONG_BASIN' | 'MA_CA_RIVER_BASIN'>('ALL');
  const [stationRegionFilter, setStationRegionFilter] = useState<StationRegionFilter>('ALL');

  const fetchData = async () => {
    try {
      setLoading(true);
      const json = await safeFetchJson<{ data?: TransboundaryBasinOverview }>('/api/v1/transboundary-hydro');
      if (json?.data) {
        setData(json.data);
      }
    } catch (err) {
      console.warn('Notice fetching transboundary hydro data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredReservoirs = (data?.reservoirs || []).filter((r) => {
    if (selectedRiver === 'ALL') return true;
    return r.river_system === selectedRiver;
  });

  const getCountryFlag = (country?: string) => {
    switch (country) {
      case 'CHINA':
        return '🇨🇳 Trung Quốc';
      case 'PHILIPPINES':
        return '🇵🇭 Philippines';
      case 'TAIWAN':
        return '🇹🇼 Đài Loan';
      case 'LAOS':
        return '🇱🇦 Lào';
      case 'CAMBODIA':
        return '🇰🇭 Campuchia';
      case 'THAILAND':
        return '🇹🇭 Thái Lan';
      default:
        return '🌐 Quốc tế';
    }
  };

  const getDischargeBadge = (status: CrossBorderReservoir['discharge_status']) => {
    switch (status) {
      case 'EMERGENCY_SPILLWAY':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500 text-white animate-pulse">XẢ LŨ KHẨN CẤP</span>;
      case 'WARNING_INCREASING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">TĂNG LƯỢNG XẢ</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">XẢ BÌNH THƯỜNG</span>;
    }
  };

  const filteredStations = (data?.key_upstream_stations || []).filter((sta) => {
    if (stationRegionFilter === 'ALL') return true;
    if (stationRegionFilter === 'HAINAN') {
      return sta.region_tag === 'HAINAN' || sta.source === 'CROSS_BORDER_HAINAN' || sta.province?.includes('Hải Nam');
    }
    if (stationRegionFilter === 'PHILIPPINES') {
      return sta.country === 'PHILIPPINES' || sta.source === 'CROSS_BORDER_PHILIPPINES';
    }
    if (stationRegionFilter === 'TAIWAN') {
      return sta.country === 'TAIWAN' || sta.source === 'CROSS_BORDER_TAIWAN';
    }
    if (stationRegionFilter === 'GUANGZHOU') {
      return sta.region_tag === 'GUANGZHOU' || sta.source === 'CROSS_BORDER_GUANGZHOU' || sta.province?.includes('Quảng Đông') || sta.province?.includes('Hồng Kông');
    }
    if (stationRegionFilter === 'MEKONG_RED_RIVER') {
      return sta.country === 'LAOS' || sta.country === 'CAMBODIA' || sta.country === 'THAILAND' || sta.source === 'CROSS_BORDER_MEKONG' || sta.source === 'CROSS_BORDER_RED_RIVER' || sta.source === 'CROSS_BORDER_LAOS';
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-sky-600 via-blue-700 to-slate-900 rounded-xl text-white shadow-lg shadow-sky-950/50">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold tracking-tight text-white">
                  Mạng Lưới Quan Trắc Khí Tượng - Hải Văn & Thủy Văn Quốc Tế
                </h2>
                <span className="px-2 py-0.5 text-[11px] font-bold bg-sky-500/20 text-sky-200 border border-sky-500/40 rounded-full">
                  Hải Nam • Philippines • Đài Loan • Quảng Châu • Mekong
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Thu nhận viễn trắc radar, khí áp, hoàn lưu bão, sóng biển và cảnh báo xả lũ thượng nguồn quốc tế
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
            >
              Đóng
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-xl">
              <div className="text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
                <span>Tổng Trạm Quốc Tế Kết Nối</span>
                <Radio className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {data?.online_stations || 0} <span className="text-sm font-normal text-slate-400">/ {data?.total_upstream_stations || 0} trạm</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Đồng bộ WMO & API Hải văn
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-xl">
              <div className="text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
                <span>Hồ Thượng Nguồn Giám Sát</span>
                <Waves className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {data?.total_monitored_reservoirs || 0} <span className="text-sm font-normal text-slate-400">hồ</span>
              </div>
              <div className="text-[11px] text-sky-400 mt-1 flex items-center gap-1 font-medium">
                <Activity className="w-3.5 h-3.5" /> Lưu vực Sông Hồng & Mekong
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-xl">
              <div className="text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
                <span>Hồ Xả Lũ / Báo Động</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-black text-rose-400 font-mono">
                {data?.emergency_spillway_reservoirs || 0} <span className="text-sm font-normal text-slate-400">hồ</span>
              </div>
              <div className="text-[11px] text-rose-400 mt-1 font-medium">
                Cảnh báo dòng truyền lũ đến biên giới
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-xl">
              <div className="text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
                <span>Lưu lượng Về Sông Hồng & Mekong</span>
                <Droplets className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-sm font-bold text-white font-mono space-y-0.5">
                <div>S.Hồng: <span className="text-indigo-300 font-black">{data?.red_river_inflow_m3s?.toLocaleString()} m³/s</span></div>
                <div>Mekong: <span className="text-indigo-300 font-black">{data?.mekong_inflow_m3s?.toLocaleString()} m³/s</span></div>
              </div>
              <div className="text-[11px] text-amber-300 mt-1 font-medium">
                Xu thế: Đang dâng nhanh
              </div>
            </div>
          </div>

          {/* Regional Station Directory (Hainan, Philippines, Taiwan, Guangzhou, Mekong) */}
          <div className="bg-slate-950/40 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Trạm Quan Trắc Hải Nam • Philippines • Đài Loan • Quảng Châu • Lưu Vực Quốc Tế
                </h3>
              </div>

              {/* Station Region Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                <button
                  onClick={() => setStationRegionFilter('ALL')}
                  className={`px-2.5 py-1 rounded font-semibold transition ${
                    stationRegionFilter === 'ALL' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  Tất cả ({data?.key_upstream_stations?.length || 0})
                </button>
                <button
                  onClick={() => setStationRegionFilter('HAINAN')}
                  className={`px-2.5 py-1 rounded font-semibold transition ${
                    stationRegionFilter === 'HAINAN' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  🇨🇳 Đảo Hải Nam
                </button>
                <button
                  onClick={() => setStationRegionFilter('PHILIPPINES')}
                  className={`px-2.5 py-1 rounded font-semibold transition ${
                    stationRegionFilter === 'PHILIPPINES' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  🇵🇭 Philippines
                </button>
                <button
                  onClick={() => setStationRegionFilter('TAIWAN')}
                  className={`px-2.5 py-1 rounded font-semibold transition ${
                    stationRegionFilter === 'TAIWAN' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  🇹🇼 Đài Loan
                </button>
                <button
                  onClick={() => setStationRegionFilter('GUANGZHOU')}
                  className={`px-2.5 py-1 rounded font-semibold transition ${
                    stationRegionFilter === 'GUANGZHOU' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  🇨🇳 Quảng Châu & GBA
                </button>
                <button
                  onClick={() => setStationRegionFilter('MEKONG_RED_RIVER')}
                  className={`px-2.5 py-1 rounded font-semibold transition ${
                    stationRegionFilter === 'MEKONG_RED_RIVER' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  🇱🇦 🇰🇭 S.Hồng & Mekong
                </button>
              </div>
            </div>

            {/* Station Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 p-4">
              {filteredStations.map((sta) => (
                <div
                  key={sta.id}
                  className="p-3.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl flex flex-col justify-between transition group shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        {getCountryFlag(sta.country || 'VIETNAM')}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                          {sta.station_code}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                          {sta.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-100 font-bold mb-1 group-hover:text-sky-300 transition">
                      {sta.station_name}
                    </div>

                    <div className="text-[10px] text-slate-400 mb-2 flex items-center justify-between">
                      <span className="truncate pr-2">Mạng: {sta.provider_network}</span>
                      <span className="font-mono text-slate-500 shrink-0">H: {sta.elevation}m</span>
                    </div>
                  </div>

                  {/* Telemetry Metrics Grid */}
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-2 rounded-lg font-mono text-[11px] border border-slate-800/80">
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase">Mưa 1h</div>
                        <div className="font-bold text-indigo-400">{sta.current_rainfall_1h} mm</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase">Mưa 24h</div>
                        <div className={`font-bold ${sta.current_rainfall_24h >= 100 ? 'text-rose-400' : 'text-slate-200'}`}>
                          {sta.current_rainfall_24h} mm
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase">Khí áp</div>
                        <div className="font-bold text-sky-400">
                          {sta.atmospheric_pressure_hpa ? `${sta.atmospheric_pressure_hpa} hPa` : '---'}
                        </div>
                      </div>
                    </div>

                    {/* Marine & Radar Row */}
                    {(sta.wind_speed_kmh || sta.wave_height_m || sta.radar_reflectivity_dbz || sta.discharge_m3s) && (
                      <div className="flex items-center justify-between text-[10px] font-mono px-2 py-1 bg-slate-800/40 rounded border border-slate-800/60 text-slate-300">
                        {sta.wind_speed_kmh && (
                          <span className="flex items-center gap-1">
                            <Wind className="w-3 h-3 text-cyan-400" />
                            <span>{sta.wind_speed_kmh} km/h {sta.wind_direction ? `(${sta.wind_direction})` : ''}</span>
                          </span>
                        )}
                        {sta.wave_height_m && (
                          <span className="flex items-center gap-1 text-sky-300">
                            <Waves className="w-3 h-3 text-sky-400" />
                            <span>{sta.wave_height_m}m sóng</span>
                          </span>
                        )}
                        {sta.radar_reflectivity_dbz && (
                          <span className="flex items-center gap-1 text-purple-300">
                            <Radio className="w-3 h-3 text-purple-400" />
                            <span>{sta.radar_reflectivity_dbz} dBZ</span>
                          </span>
                        )}
                        {sta.discharge_m3s && (
                          <span className="flex items-center gap-1 text-emerald-300">
                            <span>Q: {sta.discharge_m3s.toLocaleString()} m³/s</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reservoirs Filter & Table */}
          <div className="bg-slate-950/40 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Hồ Chứa Thủy Điện & Đập Thượng Nguồn Giáp Ranh Xuyên Biên Giới
                </h3>
              </div>

              {/* River Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setSelectedRiver('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    selectedRiver === 'ALL' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  Tất cả lưu vực
                </button>
                <button
                  onClick={() => setSelectedRiver('RED_RIVER_BASIN')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    selectedRiver === 'RED_RIVER_BASIN' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  🇨🇳 Thượng nguồn Sông Hồng
                </button>
                <button
                  onClick={() => setSelectedRiver('MEKONG_BASIN')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    selectedRiver === 'MEKONG_BASIN' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  🇱🇦 🇰🇭 Sông Mekong
                </button>
                <button
                  onClick={() => setSelectedRiver('MA_CA_RIVER_BASIN')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    selectedRiver === 'MA_CA_RIVER_BASIN' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  🇱🇦 Sông Mã & Sông Cả
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Hồ Thủy Điện / Quốc Gia</th>
                    <th className="px-4 py-3">Vị trí & Lưu vực</th>
                    <th className="px-4 py-3 text-right">Dung tích (Triệu m³)</th>
                    <th className="px-4 py-3 text-right">Mực nước / Tối đa (m)</th>
                    <th className="px-4 py-3 text-right">Lưu lượng xả (m³/s)</th>
                    <th className="px-4 py-3 text-center">Trạng thái xả</th>
                    <th className="px-4 py-3 text-center">Thời gian lũ về VN</th>
                    <th className="px-4 py-3">Điểm nhận lũ tại Việt Nam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredReservoirs.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 font-medium text-white">
                        <div>{res.name}</div>
                        <div className="text-[11px] text-slate-400 font-normal mt-0.5">{getCountryFlag(res.country)}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        <div>{res.location_name}</div>
                        <div className="text-[10px] text-indigo-400 font-mono">{res.river_system}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-200">
                        {res.capacity_million_m3.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        <span className="text-white font-bold">{res.current_water_level_m}</span>
                        <span className="text-slate-500"> / {res.max_water_level_m} m</span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        <span className="text-rose-400 font-bold text-sm">{res.current_discharge_m3s.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getDischargeBadge(res.discharge_status)}
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-amber-300 font-bold">
                        ⏱️ ~{res.flow_travel_time_to_vietnam_hours}h
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        <div className="font-medium text-sky-300">{res.downstream_vietnam_entry_point}</div>
                        <div className="text-[10px] text-slate-400">Rủi ro: <b className="text-rose-400">{res.impact_risk}</b></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bilateral Sharing Protocols & Legal Framework */}
          <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
              <FileCheck className="w-4 h-4" />
              Cơ Chế Hợp Tác & Hiệp Định Chia Sẻ Số Liệu Khí Tượng - Hải Văn Quốc Tế & Biên Giới
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(data?.international_protocols || []).map((proto, idx) => (
                <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs space-y-1.5">
                  <div className="font-bold text-white line-clamp-2">{proto.protocol_name}</div>
                  <div className="text-[11px] text-slate-300"><b>Đối tác:</b> {proto.bilateral_partner}</div>
                  <div className="text-[11px] text-slate-400"><b>Tần suất:</b> {proto.frequency_sync}</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono pt-1">
                    <CheckCircle2 className="w-3 h-3" /> Gói tin gần nhất: {new Date(proto.last_packet_received).toLocaleTimeString('vi-VN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400" />
            <span>
              Mạng lưới đồng bộ trực tiếp từ CMA (Hải Nam, Quảng Châu), PAGASA (Philippines), CWA (Đài Loan) & MRC ISG (Lào, Campuchia, Thái Lan).
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition"
          >
            Đã hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
