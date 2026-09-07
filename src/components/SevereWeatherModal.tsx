import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Wind,
  CloudRain,
  ShieldAlert,
  AlertTriangle,
  Waves,
  RefreshCw,
  Compass,
  MapPin,
  Flame,
  Radio,
  Clock,
  ShieldCheck,
  Activity,
  Droplets,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';
import {
  SevereWeatherOverview,
  SevereWeatherAlert,
  LightningStrikePoint,
  UrbanFloodHotspot,
  SevereHazardType
} from '../types';
import { safeFetchJson } from '../utils/apiClient';

interface SevereWeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SevereWeatherModal: React.FC<SevereWeatherModalProps> = ({
  isOpen,
  onClose
}) => {
  const [data, setData] = useState<SevereWeatherOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'ALERTS' | 'LIGHTNING' | 'URBAN_FLOOD'>('ALERTS');
  const [selectedAlert, setSelectedAlert] = useState<SevereWeatherAlert | null>(null);
  const [filterHazard, setFilterHazard] = useState<string>('ALL');

  const fetchData = async () => {
    setLoading(true);
    try {
      const json = await safeFetchJson<SevereWeatherOverview>('/api/v1/severe-weather/overview');
      if (json) {
        setData(json);
        if (json.alerts && json.alerts.length > 0) {
          setSelectedAlert(json.alerts[0]);
        }
      }
    } catch (err) {
      console.warn('Notice loading severe weather overview:', err);
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

  const getHazardBadge = (type: SevereHazardType) => {
    switch (type) {
      case 'THUNDERSTORM_LIGHTNING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> Sét Đánh & Giông Lốc
          </span>
        );
      case 'HAIL_STORM':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
            <CloudRain className="w-3 h-3 text-purple-400" /> Mưa Đá Cực Đoan
          </span>
        );
      case 'TORNADO_SQUALL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
            <Wind className="w-3 h-3 text-rose-400" /> Lốc Xoáy & Gió Giật
          </span>
        );
      case 'URBAN_FLASH_FLOOD':
      case 'RIVER_PONDING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
            <Waves className="w-3 h-3 text-cyan-400" /> Ngập Lụt Đô Thị
          </span>
        );
    }
  };

  const getSeverityBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-600/30 text-red-300 border border-red-500/60 animate-pulse">Cấp 5 - Khẩn Cấp Đặc Biệt</span>;
      case 'VERY_HIGH':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">Cấp 4 - Rất Nguy Hiểm</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">Cấp 3 - Nguy Hiểm Cao</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">Cấp 2 - Đề Phòng</span>;
    }
  };

  const filteredAlerts = (data?.alerts || []).filter((a) => {
    if (filterHazard === 'ALL') return true;
    return a.hazard_type === filterHazard;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">
                  Cảnh Báo Khí Tượng Cực Đoan (Giông, Sét, Lốc, Mưa Đá & Ngập Lụt)
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Mạng Định Vị Sét Linet & Viễn Thám Real-time
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tích hợp 18 cảm biến phóng điện sét toàn quốc, phát hiện lốc xoáy tầng thấp (Doppler Shear), nhận dạng mưa đá và mô phỏng điểm ngập úng đô thị
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Metric Bar */}
          {data && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Cú Sét Ghi Nhận (1h)</span>
                  <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                </div>
                <div className="text-xl font-bold text-amber-300">
                  {data.total_lightning_strikes_1h.toLocaleString('vi-VN')} <span className="text-xs font-normal text-slate-400">cú</span>
                </div>
                <div className="text-[10px] text-amber-400/80 mt-0.5">{data.lightning_network_sensors_online} Trạm cảm biến trực tuyến</div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Vùng Nguy Cơ Mưa Đá</span>
                  <CloudRain className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xl font-bold text-purple-300">
                  {data.hail_risk_zones_count} Khu vực
                </div>
                <div className="text-[10px] text-purple-400/80 mt-0.5">Hạt băng d ≥ 2.5cm</div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Lốc Xoáy & Gió Giật</span>
                  <Wind className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-xl font-bold text-rose-400">
                  {data.tornado_risk_zones_count} Điểm cảnh báo
                </div>
                <div className="text-[10px] text-rose-400/80 mt-0.5">Gió giật ≥ 90 km/h (Cấp 10)</div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Điểm Ngập Lụt Đô Thị</span>
                  <Waves className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-xl font-bold text-cyan-300">
                  {data.urban_flood_points_active} Tuyến đường
                </div>
                <div className="text-[10px] text-cyan-400/80 mt-0.5">Độ sâu cực đại ≥ 1.2m</div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Bản Tin Tác Chiến</span>
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-xl font-bold text-red-400">
                  {data.active_alerts_count} Bản tin
                </div>
                <div className="text-[10px] text-red-400/80 mt-0.5">Có hiệu lực trong 3 giờ tới</div>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('ALERTS')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'ALERTS'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Cảnh Báo Giông Lốc, Sét & Mưa Đá Khẩn Cấp ({data?.alerts.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('LIGHTNING')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'LIGHTNING'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Mạng Lưới Định Vị Sét Thực Tế (Live Lightning Tracing)
              </button>
              <button
                onClick={() => setActiveTab('URBAN_FLOOD')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'URBAN_FLOOD'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Bản Đồ Ngập Lụt Đô Thị & Tuyến Trũng Thấp ({data?.urban_flood_hotspots.length || 0})
              </button>
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Làm mới Dữ liệu Cực đoan
            </button>
          </div>

          {/* TAB 1: ALERTS */}
          {activeTab === 'ALERTS' && (
            <div className="space-y-4">
              {/* Category Filter Chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium mr-1">Lọc loại hình thiên tai:</span>
                {[
                  { key: 'ALL', label: 'Tất Cả Loại Hình' },
                  { key: 'THUNDERSTORM_LIGHTNING', label: 'Giông Lốc & Sét' },
                  { key: 'HAIL_STORM', label: 'Mưa Đá' },
                  { key: 'TORNADO_SQUALL', label: 'Lốc Xoáy' },
                  { key: 'URBAN_FLASH_FLOOD', label: 'Ngập Lụt Đô Thị' }
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilterHazard(f.key)}
                    className={`px-3 py-1 rounded-lg font-medium border transition-all ${
                      filterHazard === f.key
                        ? 'bg-amber-500/25 text-amber-200 border-amber-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Alerts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredAlerts.map((alert) => {
                  const isSelected = selectedAlert?.id === alert.id;
                  return (
                    <div
                      key={alert.id}
                      onClick={() => setSelectedAlert(alert)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-slate-800/90 border-amber-400 ring-1 ring-amber-400/50'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getHazardBadge(alert.hazard_type)}
                          <span className="text-xs text-slate-400">
                            {alert.province}
                          </span>
                        </div>
                        {getSeverityBadge(alert.severity_level)}
                      </div>

                      <h4 className="text-sm font-bold text-white mb-1.5">{alert.hazard_name}</h4>
                      <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                        {alert.description}
                      </p>

                      {/* Quick Metric Pills */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] mb-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                        {alert.key_metrics.wind_gust_kmh && (
                          <span className="text-rose-300 flex items-center gap-1">
                            <Wind className="w-3 h-3" /> Gió giật: <strong>{alert.key_metrics.wind_gust_kmh} km/h</strong>
                          </span>
                        )}
                        {alert.key_metrics.hail_prob_pct && (
                          <span className="text-purple-300 flex items-center gap-1">
                            <CloudRain className="w-3 h-3" /> Xác suất mưa đá: <strong>{alert.key_metrics.hail_prob_pct}%</strong> (Hạt {alert.key_metrics.max_hail_diameter_cm}cm)
                          </span>
                        )}
                        {alert.key_metrics.lightning_flash_rate_per_min && (
                          <span className="text-amber-300 flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Sét: <strong>{alert.key_metrics.lightning_flash_rate_per_min} lần/phút</strong>
                          </span>
                        )}
                        {alert.key_metrics.flood_depth_cm && (
                          <span className="text-cyan-300 flex items-center gap-1">
                            <Waves className="w-3 h-3" /> Ngập sâu: <strong>{alert.key_metrics.flood_depth_cm} cm</strong>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                        <span>Địa bàn: <strong>{alert.district_communes.join(', ')}</strong></span>
                        <span className="text-emerald-400 font-semibold">{alert.safe_shelters_count} Điểm sơ tán an toàn</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Alert Detailed Tactical Advice */}
              {selectedAlert && (
                <div className="bg-slate-950/80 p-5 rounded-xl border border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      Hướng Dẫn Ứng Phó Khẩn Cấp: {selectedAlert.hazard_name} ({selectedAlert.province})
                    </h3>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Hiệu lực đến: {new Date(selectedAlert.valid_until).toLocaleTimeString('vi-VN')}
                    </span>
                  </div>

                  <div className="bg-amber-950/20 p-4 rounded-xl border border-amber-500/30 text-xs space-y-2">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Khuyến Cáo An Toàn Cho Nhân Dân & Lực Lượng Ứng Trực:
                    </div>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-200 leading-relaxed">
                      {selectedAlert.safety_instructions.map((inst, i) => (
                        <li key={i}>{inst}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIGHTNING DETECTION */}
          {activeTab === 'LIGHTNING' && (
            <div className="space-y-4">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>Mạng lưới LINET 3D phát hiện thời gian thực các vụ phóng điện mây-đất (CG) và trong mây (IC)</span>
                </div>
                <span className="text-amber-400 font-bold">Sai số định vị: ±100m</span>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Thời Gian Đánh</th>
                      <th className="px-4 py-3 font-semibold">Loại Phóng Điện</th>
                      <th className="px-4 py-3 font-semibold">Cường Độ Dòng Sét</th>
                      <th className="px-4 py-3 font-semibold">Vị Trí & Địa Bàn</th>
                      <th className="px-4 py-3 font-semibold">Tọa Độ (Lat, Lng)</th>
                      <th className="px-4 py-3 font-semibold">Mức Độ Nguy Hiểm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {data?.recent_lightning_strikes.map((lt) => (
                      <tr key={lt.id} className="hover:bg-slate-900/40">
                        <td className="px-4 py-2.5 text-slate-300">
                          {new Date(lt.timestamp).toLocaleTimeString('vi-VN')}
                        </td>
                        <td className="px-4 py-2.5">
                          {lt.type === 'CLOUD_TO_GROUND' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                              Mây - Đất (CG)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                              Trong mây (IC)
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 font-mono font-bold text-amber-300">
                          {lt.current_ka} kA
                        </td>
                        <td className="px-4 py-2.5 font-medium text-white">{lt.location_name}</td>
                        <td className="px-4 py-2.5 font-mono text-slate-400">
                          {lt.coords[0].toFixed(3)}, {lt.coords[1].toFixed(3)}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            lt.risk_level === 'EXTREME'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}>
                            {lt.risk_level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: URBAN FLOOD HOTSPOTS */}
          {activeTab === 'URBAN_FLOOD' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {data?.urban_flood_hotspots.map((spot) => (
                  <div key={spot.id} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white">{spot.name}</h4>
                        <span className="text-xs text-slate-400">{spot.district}, {spot.city_province}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border ${
                        spot.traffic_status === 'IMPASSABLE'
                          ? 'bg-red-500/20 text-red-400 border-red-500/40'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      }`}>
                        {spot.traffic_status === 'IMPASSABLE' ? 'Tê liệt giao thông' : 'Hạn chế di chuyển'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Mực nước ngập hiện tại:</span>
                        <strong className="text-cyan-300 text-sm font-mono">{spot.current_depth_cm} cm</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Dự báo đỉnh ngập:</span>
                        <strong className="text-rose-400 text-sm font-mono">{spot.projected_peak_depth_cm} cm</strong>
                        <span className="text-[10px] text-slate-400 block">(sau +{spot.peak_time_offset_min}p)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span>Khả năng thoát nước: <strong className="text-amber-300">{spot.drainage_capacity_pct}%</strong></span>
                      <span className="text-emerald-400">{spot.pump_stations_active} Trạm bơm vận hành</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Tiêu chuẩn: Tổng cục Khí tượng Thủy văn & Cục Phòng chống Thiên tai</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
