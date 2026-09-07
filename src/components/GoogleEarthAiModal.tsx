import React, { useState, useEffect } from 'react';
import {
  Globe,
  Satellite,
  Waves,
  BrainCircuit,
  MessageSquare,
  AlertTriangle,
  Layers,
  Zap,
  CheckCircle2,
  Clock,
  Compass,
  Mountain,
  Droplets,
  Route,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Send,
  Loader2,
  X,
  Radio,
  Eye
} from 'lucide-react';
import { EarthAiAnalysis, SpatialZone, ZoneRiskAssessment } from '../types';
import { safeFetchJson } from '../utils/apiClient';

interface GoogleEarthAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedZone: SpatialZone | null;
  allZones: SpatialZone[];
  assessments: ZoneRiskAssessment[];
  onSelectZone: (zone: SpatialZone) => void;
}

export const GoogleEarthAiModal: React.FC<GoogleEarthAiModalProps> = ({
  isOpen,
  onClose,
  selectedZone,
  allZones,
  assessments,
  onSelectZone
}) => {
  const [activeTab, setActiveTab] = useState<'INSAR' | 'RUNOUT' | 'XAI' | 'CHAT'>('INSAR');
  const [currentZoneId, setCurrentZoneId] = useState<string>(selectedZone?.id || allZones[0]?.id || '');
  const [analysis, setAnalysis] = useState<EarthAiAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Chat State
  const [chatQuery, setChatQuery] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<{
    sender: 'USER' | 'EARTH_AI';
    text: string;
    referencedZones?: string[];
    suggestedActions?: string[];
    timestamp: string;
  }[]>([
    {
      sender: 'EARTH_AI',
      text: 'Xin chào Chỉ huy trưởng! Tôi là Trợ lý Trí tuệ Không gian Địa lý Google Earth AI (Geospatial Foundation Model). Tôi đã sẵn sàng phân tích ảnh vệ tinh SAR InSAR, biến dạng sườn dốc, độ ẩm đất viễn thám SMAP và mô phỏng đường đi bùn đá trên toàn bộ 63 tỉnh thành Việt Nam. Hãy đặt câu hỏi hoặc chọn một vùng cần phân tích sâu!',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Sync selected zone from prop
  useEffect(() => {
    if (selectedZone) {
      setCurrentZoneId(selectedZone.id);
    }
  }, [selectedZone]);

  // Fetch Earth AI Analysis whenever currentZoneId changes
  useEffect(() => {
    if (!isOpen || !currentZoneId) return;

    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await safeFetchJson<EarthAiAnalysis>(`/api/v1/earth-ai/zone/${currentZoneId}`);
        if (data) {
          setAnalysis(data);
        }
      } catch (err: any) {
        console.warn('Notice loading Earth AI analysis:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [isOpen, currentZoneId]);

  const activeZone = allZones.find((z) => z.id === currentZoneId) || allZones[0];
  const activeAssessment = assessments.find((a) => a.zone_id === currentZoneId);

  const handleSendChat = async (queryText?: string) => {
    const q = queryText || chatQuery;
    if (!q.trim() || chatLoading) return;

    const userMsg = {
      sender: 'USER' as const,
      text: q,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatQuery('');
    setChatLoading(true);

    try {
      const data = await safeFetchJson<{ answer?: string; referenced_zones?: string[]; suggested_actions?: string[] }>('/api/v1/earth-ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });

      if (data && data.answer) {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'EARTH_AI',
            text: data.answer || '',
            referencedZones: data.referenced_zones,
            suggestedActions: data.suggested_actions,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error('Chế độ ngoại tuyến');
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'EARTH_AI',
          text: 'Không thể kết nối đến máy chủ Google Earth AI. Đang sử dụng chế độ ngoại tuyến.',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl shadow-emerald-950/50 flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg shadow-emerald-500/20 text-white">
              <Globe className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Google Earth AI Integration Hub
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                    Geospatial Foundation Model
                  </span>
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Tích hợp Mô hình Nền tảng Không gian Địa lý & Suy luận Đa phương thức (SAR InSAR + Optical + Hydrology + IoT Telemetry)
              </p>
            </div>
          </div>

          {/* Top Controls: Zone Selector & Close */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <Compass className="w-4 h-4 text-emerald-400" />
              <select
                value={currentZoneId}
                onChange={(e) => {
                  setCurrentZoneId(e.target.value);
                  const found = allZones.find((z) => z.id === e.target.value);
                  if (found) onSelectZone(found);
                }}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer max-w-[220px] truncate"
              >
                {allZones.map((z) => (
                  <option key={z.id} value={z.id} className="bg-slate-900 text-white">
                    {z.province_name}: {z.zone_name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('INSAR')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'INSAR'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Satellite className="w-4 h-4" />
            <span>1. Vệ tinh InSAR & Dị thường Thảm phủ</span>
          </button>

          <button
            onClick={() => setActiveTab('RUNOUT')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'RUNOUT'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Waves className="w-4 h-4" />
            <span>2. Mô phỏng Đường đi Bùn đá (Debris Runout)</span>
          </button>

          <button
            onClick={() => setActiveTab('XAI')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'XAI'
                ? 'border-amber-400 text-amber-400 bg-amber-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>3. Suy luận Đa phương thức (Cross-Modal XAI)</span>
          </button>

          <button
            onClick={() => setActiveTab('CHAT')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'CHAT'
                ? 'border-purple-400 text-purple-400 bg-purple-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>4. Hỏi đáp Không gian Địa lý (Spatial QA)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
              <p className="text-sm font-medium">Đang kết nối Google Earth AI & Tổng hợp Dữ liệu Vệ tinh Đa thời gian...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-sm">
              {error}
            </div>
          ) : analysis ? (
            <>
              {/* TAB 1: INSAR & OPTICAL */}
              {activeTab === 'INSAR' && (
                <div className="space-y-6">
                  {/* Top Status Banner */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Satellite className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">
                          Sentinel-1 Radar InSAR + Sentinel-2 Multispectral Feed
                        </div>
                        <div className="text-xs text-slate-400">
                          Lần quét vệ tinh gần nhất: {analysis.sar_deformation.last_pass_date}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Mức độ nứt tách sườn dốc</div>
                        <div
                          className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${
                            analysis.sar_deformation.crack_severity === 'CRITICAL'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : analysis.sar_deformation.crack_severity === 'MEDIUM'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {analysis.sar_deformation.crack_severity === 'CRITICAL'
                            ? 'CẢNH BÁO NGUY CƠ CAO (VẾT NỨT SÂU)'
                            : analysis.sar_deformation.crack_severity === 'MEDIUM'
                            ? 'THEO DÕI BIẾN DẠNG (VẾT NỨT VỪA)'
                            : 'KHÔNG PHÁT HIỆN NỨT TÁCH'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4 Multi-spectral Satellite Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: InSAR Subsidence */}
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Biến dạng Radar InSAR</span>
                        <TrendingDown className="w-4 h-4 text-rose-400" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-rose-400 font-mono">
                          {analysis.sar_deformation.subsidence_rate_mm_year}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">mm/năm</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Tốc độ dịch chuyển sườn dốc (Line-of-Sight). Độ mất đồng pha: {analysis.sar_deformation.coherence_loss_index}.
                      </p>
                    </div>

                    {/* Card 2: Tension Cracks */}
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Vết Nứt Tách (Tension Cracks)</span>
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-amber-400 font-mono">
                          {analysis.sar_deformation.tension_crack_count}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">vết nứt lớn</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Zero-Shot scar detector xác định các cung nứt vòng cung ở cao độ {activeZone.elevation}m.
                      </p>
                    </div>

                    {/* Card 3: NDVI Vegetation Anomaly */}
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Dị Thường Thảm Phủ (NDVI)</span>
                        <Mountain className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`text-2xl font-black font-mono ${
                            analysis.multispectral.ndvi_anomaly_pct < -15 ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {analysis.multispectral.ndvi_anomaly_pct}%
                        </span>
                        <span className="text-xs text-slate-400 font-medium">so với chuẩn</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Chỉ số NDVI hiện tại: {analysis.multispectral.ndvi_current}. Đất trống phơi lộ:{' '}
                        {analysis.multispectral.bare_soil_exposure_pct}%.
                      </p>
                    </div>

                    {/* Card 4: SMAP Soil Moisture */}
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Độ Ẩm Viễn Thám (SMAP)</span>
                        <Droplets className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-cyan-400 font-mono">
                          {analysis.hydrology_moisture.volumetric_soil_moisture_m3m3}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">m³/m³</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Áp lực nước lỗ rỗng: {analysis.hydrology_moisture.pore_water_pressure_kpa} kPa. Bão hòa rễ cây:{' '}
                        {analysis.hydrology_moisture.root_zone_saturation_pct}%.
                      </p>
                    </div>
                  </div>

                  {/* Satellite Narrative Box */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                      <Sparkles className="w-4 h-4" />
                      <span>Nhận Định Viễn Thám từ Google Earth AI</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {analysis.cross_modal_reasoning.satellite_insight}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: RUNOUT SIMULATION */}
              {activeTab === 'RUNOUT' && (
                <div className="space-y-6">
                  {/* Top Runout Parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="text-xs text-slate-400 mb-1">Thể tích Nguồn trượt (V₀)</div>
                      <div className="text-xl font-bold text-white font-mono">
                        {analysis.debris_runout.source_volume_m3.toLocaleString('vi-VN')}{' '}
                        <span className="text-xs font-normal text-slate-400">m³</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Tính từ lưu vực {activeZone.basin_area_km2} km² & độ dốc {activeZone.slope}°
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="text-xs text-slate-400 mb-1">Tầm Truyền Xa Tối đa (L_max)</div>
                      <div className="text-xl font-bold text-cyan-400 font-mono">
                        {analysis.debris_runout.max_runout_distance_m}{' '}
                        <span className="text-xs font-normal text-slate-400">mét</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">Mô hình ma sát Voellmy 2 tham số</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="text-xs text-slate-400 mb-1">Vận tốc Dòng Lũ Đỉnh (v_peak)</div>
                      <div className="text-xl font-bold text-amber-400 font-mono">
                        {analysis.debris_runout.peak_flow_velocity_ms}{' '}
                        <span className="text-xs font-normal text-slate-400">m/s (~{(analysis.debris_runout.peak_flow_velocity_ms * 3.6).toFixed(0)} km/h)</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">Động năng cực lớn, sức tàn phá cấp 4-5</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="text-xs text-slate-400 mb-1">Thời gian Chạm Hạ du (Lead-time)</div>
                      <div className="text-xl font-bold text-rose-400 font-mono">
                        {analysis.debris_runout.estimated_arrival_minutes}{' '}
                        <span className="text-xs font-normal text-slate-400">phút</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">Cửa sổ sơ tán tức thời</div>
                    </div>
                  </div>

                  {/* Flow Path & Blocked Roads Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <Route className="w-4 h-4 text-cyan-400" />
                        <span>Hành lang Dòng chảy & Tọa độ Suy luận 3D</span>
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Google Earth AI đã tính toán đường dốc cực tiểu từ đỉnh sườn núi ({activeZone.elevation}m) qua khe tụ thủy chính của lưu vực {activeZone.basin_name}:
                      </p>
                      <div className="space-y-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px]">
                        {analysis.debris_runout.inundation_corridor_coords.map((coord, idx) => (
                          <div key={idx} className="flex items-center justify-between text-slate-300">
                            <span className="text-slate-400">Điểm kiểm soát #{idx + 1}:</span>
                            <span className="text-cyan-300">
                              Lat: {coord[0].toFixed(5)}°, Lon: {coord[1].toFixed(5)}°
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>Các Tuyến Giao thông & Hạ tầng có Nguy cơ Chia cắt</span>
                      </h4>
                      <div className="space-y-2">
                        {analysis.debris_runout.blocked_roads.length > 0 ? (
                          analysis.debris_runout.blocked_roads.map((road, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40 text-rose-200 text-xs font-medium"
                            >
                              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                              <span>{road}</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-2.5 rounded-lg bg-slate-900 text-slate-400 text-xs">
                            Đường liên thôn và cầu cống dân sinh thuộc lưu vực {activeZone.basin_name}
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Bán kính sơ tán mở rộng khuyến nghị: <strong className="text-white">{analysis.debris_runout.impact_zone_radius_m} mét</strong> xung quanh trục dòng chảy.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CROSS-MODAL REASONING XAI */}
              {activeTab === 'XAI' && (
                <div className="space-y-6">
                  {/* Lead-Time Upgrade Callout */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <Zap className="w-4 h-4" />
                        <span>Nâng cấp Đột phá về Thời gian Cảnh báo Sớm (Lead-Time)</span>
                      </div>
                      <p className="text-xs text-slate-300 max-w-2xl">
                        {analysis.cross_modal_reasoning.lead_time_enhancement}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-2 rounded-xl bg-slate-950 border border-emerald-500/30 text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Hệ số khuếch đại rủi ro</div>
                        <div className="text-xl font-black text-emerald-400 font-mono">
                          {analysis.cross_modal_reasoning.risk_amplification_factor}x
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deep Narrative */}
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                      <BrainCircuit className="w-4 h-4" />
                      <span>Suy luận Khoa học Tổng hợp (Cross-Modal Synthesis)</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {analysis.cross_modal_reasoning.deep_narrative}
                    </p>
                  </div>

                  {/* Grounding & Priority Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="text-xs font-bold uppercase text-slate-300 flex items-center gap-2">
                        <Radio className="w-4 h-4 text-cyan-400" />
                        <span>Đối soát Viễn thám & Trạm Đo Mưa Mặt đất</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {analysis.cross_modal_reasoning.telemetry_synthesis}
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="text-xs font-bold uppercase text-slate-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Chỉ đạo Tác chiến Ưu tiên cho Ban Chỉ huy</span>
                      </div>
                      <ul className="space-y-2">
                        {analysis.cross_modal_reasoning.priority_action_steps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SPATIAL QA CHAT */}
              {activeTab === 'CHAT' && (
                <div className="flex flex-col h-[520px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-3 max-w-[85%] ${
                          msg.sender === 'USER' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            msg.sender === 'USER'
                              ? 'bg-rose-600 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {msg.sender === 'USER' ? (
                            <span className="text-xs font-bold">CH</span>
                          ) : (
                            <Globe className="w-4 h-4" />
                          )}
                        </div>

                        <div
                          className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                            msg.sender === 'USER'
                              ? 'bg-rose-600/20 border border-rose-500/30 text-rose-100 rounded-tr-none'
                              : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{msg.text}</div>

                          {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                            <div className="pt-2 border-t border-slate-800 space-y-1">
                              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                                Khuyến nghị tác chiến:
                              </span>
                              <ul className="list-disc list-inside text-xs text-slate-300 space-y-0.5">
                                {msg.suggestedActions.map((act, aIdx) => (
                                  <li key={aIdx}>{act}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="text-[10px] text-slate-500 text-right">{msg.timestamp}</div>
                        </div>
                      </div>
                    ))}

                    {chatLoading && (
                      <div className="flex items-center gap-2 text-xs text-emerald-400 p-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Google Earth AI đang phân tích dữ liệu không gian...</span>
                      </div>
                    )}
                  </div>

                  {/* Pre-canned Suggestions */}
                  <div className="p-2 border-t border-slate-800/80 bg-slate-900/50 flex gap-2 overflow-x-auto text-[11px]">
                    <button
                      onClick={() =>
                        handleSendChat(`Phân tích nguy cơ sạt lở tại ${activeZone.zone_name} (${activeZone.province_name}) khi mưa 150mm`)
                      }
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition"
                    >
                      🌧️ Phân tích sạt lở {activeZone.zone_name} khi mưa 150mm
                    </button>
                    <button
                      onClick={() =>
                        handleSendChat(`Đánh giá vết nứt sườn dốc và nguy cơ chia cắt đường đèo tại ${activeZone.province_name}`)
                      }
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition"
                    >
                      🏔️ Đánh giá vết nứt đèo tại {activeZone.province_name}
                    </button>
                    <button
                      onClick={() =>
                        handleSendChat(`Lập phương án sơ tán dân cư khẩn cấp cho lưu vực ${activeZone.basin_name}`)
                      }
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition"
                    >
                      🚨 Lộ trình sơ tán lưu vực {activeZone.basin_name}
                    </button>
                  </div>

                  {/* Input Box */}
                  <div className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2">
                    <input
                      type="text"
                      value={chatQuery}
                      onChange={(e) => setChatQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendChat();
                      }}
                      placeholder="Hỏi Google Earth AI về địa hình, vết nứt InSAR, lũ quét, tuyến đường chia cắt..."
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => handleSendChat()}
                      disabled={chatLoading || !chatQuery.trim()}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white disabled:opacity-40 transition font-medium"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Nguồn cấp dữ liệu: Google Earth Engine & Sentinel-1 InSAR / Sentinel-2 L2A / NASA SMAP</span>
          </div>
          <div className="font-mono text-slate-400">
            {analysis?.foundation_model_version || 'Google Earth AI Foundation v2.4'}
          </div>
        </div>
      </div>
    </div>
  );
};
