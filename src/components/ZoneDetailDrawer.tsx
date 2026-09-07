import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Compass,
  Mountain,
  Droplet,
  FileText,
  MapPin,
  ChevronRight,
  TrendingUp,
  Cpu,
  Loader2,
  Globe
} from 'lucide-react';
import { GeoJsonFeatureProperties, EvidenceItem } from '../types';
import { safeFetchJson } from '../utils/apiClient';

interface ZoneDetailDrawerProps {
  zoneData: GeoJsonFeatureProperties | null;
  onClose: () => void;
  onOpenEarthAi?: () => void;
  onOpenLstm?: () => void;
  onOpen3DEarth?: () => void;
}

export const ZoneDetailDrawer: React.FC<ZoneDetailDrawerProps> = ({ zoneData, onClose, onOpenEarthAi, onOpenLstm, onOpen3DEarth }) => {
  const [activeTab, setActiveTab] = useState<'xai' | 'evidence' | 'hydrology' | 'safety' | 'gemini'>('xai');
  const [geminiConsultation, setGeminiConsultation] = useState<{
    tactical_analysis: string;
    evacuation_plan: string;
    infrastructure_protection: string;
    source: string;
  } | null>(null);
  const [loadingGemini, setLoadingGemini] = useState<boolean>(false);
  const [floodForecast, setFloodForecast] = useState<any>(null);
  const [loadingFloodForecast, setLoadingFloodForecast] = useState<boolean>(false);
  const [evidenceFusion, setEvidenceFusion] = useState<{
    fusion_algorithm: string;
    overall_confidence_score: number;
    evidence_chain: EvidenceItem[];
  } | null>(null);
  const [loadingEvidence, setLoadingEvidence] = useState<boolean>(false);

  if (!zoneData) return null;

  const handleFetchGemini = async () => {
    setLoadingGemini(true);
    try {
      const data = await safeFetchJson<{
        tactical_analysis: string;
        evacuation_plan: string;
        infrastructure_protection: string;
        source: string;
      }>('/api/v1/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zone_id: zoneData.zone_id })
      });
      if (data) {
        setGeminiConsultation(data);
      }
    } catch (e) {
      console.warn('Notice loading AI consult:', e);
    } finally {
      setLoadingGemini(false);
    }
  };

  const handleFetchFloodForecast = async () => {
    if (floodForecast || loadingFloodForecast) return;
    setLoadingFloodForecast(true);
    try {
      const data = await safeFetchJson(`/api/v1/zones/${zoneData.zone_id}/flood-forecast`);
      if (data) {
        setFloodForecast(data);
      }
    } catch (e) {
      console.warn('Notice loading flood forecast:', e);
    } finally {
      setLoadingFloodForecast(false);
    }
  };

  const handleFetchEvidenceFusion = async () => {
    if (evidenceFusion || loadingEvidence) return;
    setLoadingEvidence(true);
    try {
      const data = await safeFetchJson<{
        fusion_algorithm: string;
        overall_confidence_score: number;
        evidence_chain: EvidenceItem[];
      }>(`/api/v1/zones/${zoneData.zone_id}/evidence-fusion`);
      if (data) {
        setEvidenceFusion(data);
      }
    } catch (e) {
      console.warn('Notice loading evidence fusion:', e);
    } finally {
      setLoadingEvidence(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[540px] md:w-[620px] bg-slate-900/98 border-l border-slate-700 shadow-2xl backdrop-blur-xl z-50 flex flex-col text-slate-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              style={{
                backgroundColor: zoneData.color,
                color: zoneData.overall_risk_level === 2 ? '#000' : '#fff'
              }}
              className="px-2.5 py-0.5 rounded font-extrabold text-xs tracking-wider uppercase shadow"
            >
              CẤP {zoneData.overall_risk_level} – {zoneData.overall_risk_level === 5 ? 'THẢM HỌA' : zoneData.overall_risk_level === 4 ? 'RẤT LỚN' : zoneData.overall_risk_level === 3 ? 'LỚN' : zoneData.overall_risk_level === 2 ? 'TRUNG BÌNH' : 'THẤP'}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {zoneData.overall_risk_type === 'combined' ? 'Nguy cơ Kép' : zoneData.overall_risk_type === 'flash_flood' ? 'Lũ Quét' : 'Sạt Lở'}
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-white">{zoneData.zone_name}</h2>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>{zoneData.district_name}, {zoneData.province_name}</span>
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/40 text-xs font-medium">
        <button
          onClick={() => setActiveTab('xai')}
          className={`flex-1 py-2.5 px-2 text-center border-b-2 transition ${
            activeTab === 'xai'
              ? 'border-rose-500 text-rose-400 font-bold bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🧠 XAI
        </button>
        <button
          onClick={() => {
            setActiveTab('evidence');
            handleFetchEvidenceFusion();
          }}
          className={`flex-1 py-2.5 px-2 text-center border-b-2 transition ${
            activeTab === 'evidence'
              ? 'border-cyan-500 text-cyan-400 font-bold bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🔗 Bằng Chứng
        </button>
        <button
          onClick={() => {
            setActiveTab('hydrology');
            handleFetchFloodForecast();
          }}
          className={`flex-1 py-2.5 px-2 text-center border-b-2 transition ${
            activeTab === 'hydrology'
              ? 'border-blue-500 text-blue-400 font-bold bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🌧️ Thủy Văn
        </button>
        <button
          onClick={() => setActiveTab('safety')}
          className={`flex-1 py-2.5 px-2 text-center border-b-2 transition ${
            activeTab === 'safety'
              ? 'border-emerald-500 text-emerald-400 font-bold bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🛡️ Ứng Phó
        </button>
        <button
          onClick={() => {
            setActiveTab('gemini');
            if (!geminiConsultation && !loadingGemini) {
              handleFetchGemini();
            }
          }}
          className={`flex-1 py-2.5 px-2 text-center border-b-2 transition ${
            activeTab === 'gemini'
              ? 'border-amber-500 text-amber-400 font-bold bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          ✨ Gemini AI
        </button>
      </div>

      {/* Drawer Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Google Earth AI Foundation Model Quick Access Banner */}
        {onOpenEarthAi && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-950 to-teal-950/80 border border-emerald-500/40 flex items-center justify-between gap-3 shadow-lg shadow-emerald-950/30">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Globe className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <span>Google Earth AI (Geospatial Foundation)</span>
                  <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30 font-mono">
                    InSAR + NDVI + Runout
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Phát hiện biến dạng sườn dốc SAR vi mô & mô phỏng đường đi bùn đá
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
              {onOpen3DEarth && (
                <button
                  onClick={onOpen3DEarth}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 font-bold text-xs flex items-center gap-1 transition shadow border border-emerald-500/40"
                  title="Khảo sát địa hình 3D góc nghiêng trên Google Earth Web"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3D Earth</span>
                </button>
              )}
              {onOpenLstm && (
                <button
                  onClick={onOpenLstm}
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 font-bold text-xs flex items-center gap-1 transition shadow border border-cyan-500/30"
                  title="Xem biểu đồ thủy văn dòng chảy và đỉnh lũ LSTM"
                >
                  <span>LSTM Thủy Văn</span>
                </button>
              )}
              <button
                onClick={onOpenEarthAi}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition shadow"
              >
                <span>Xem Vệ Tinh AI</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Explainable AI (XAI) */}
        {activeTab === 'xai' && (
          <div className="space-y-4">
            {/* Core Question & Answer Banner */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-amber-400 font-bold text-xs mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>TẠI SAO KHU VỰC NÀY ĐƯỢC CẢNH BÁO?</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                {zoneData.explanation_summary}
              </p>
            </div>

            {/* AI vs Physical Rule Comparison */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-slate-400 font-mono text-[11px] mb-1">MÔ HÌNH AI (HYBRID)</div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xl font-bold text-indigo-400 font-mono">
                    {(zoneData.overall_probability * 100).toFixed(0)}%
                  </span>
                  <span className="text-[10px] text-slate-400">Độ tin cậy: <b className="text-emerald-400">{zoneData.model_confidence}</b></span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Landslide: {(zoneData.landslide_ai_probability * 100).toFixed(0)}% | Flash flood: {(zoneData.flash_flood_ai_probability * 100).toFixed(0)}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-slate-400 font-mono text-[11px] mb-1">QUY TẮC VẬT LÝ (RULES)</div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm font-bold text-amber-400 font-mono">
                    {zoneData.physical_rule_active ? 'ĐÃ KÍCH HOẠT' : 'KHÔNG VI PHẠM'}
                  </span>
                  <span className="text-[10px] text-slate-400">Trạng thái</span>
                </div>
                <div className="text-[10px] text-slate-300 line-clamp-2">
                  {zoneData.trigger_detail}
                </div>
              </div>
            </div>

            {/* Feature Contribution Breakdown */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="font-bold text-slate-200 text-xs flex items-center justify-between">
                <span>TRỌNG SỐ ĐÓNG GÓP NGUY CƠ (FEATURE IMPORTANCE)</span>
                <span className="text-[10px] font-mono text-slate-400">SHAP / XGBoost</span>
              </div>
              <div className="space-y-2 pt-1">
                {zoneData.contributing_factors.map((factor, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300">{factor.feature_label} ({factor.value})</span>
                      <span className="font-mono font-bold text-rose-400">{factor.contribution_percent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full"
                        style={{ width: `${factor.contribution_percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead Time & Future Scenario Projection */}
            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40 space-y-2">
              <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-xs">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>DỰ BÁO XU HƯỚNG NGUY CƠ (LEAD-TIME PROJECTION)</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Hiện tại</span>
                  <span className="text-sm font-bold text-white">CẤP {zoneData.overall_risk_level}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-indigo-300 block">T + 30 phút</span>
                  <span className="text-sm font-bold text-amber-400">CẤP {zoneData.projected_level_30m}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-indigo-300 block">T + 60 phút</span>
                  <span className="text-sm font-bold text-rose-400">CẤP {zoneData.projected_level_60m}</span>
                </div>
              </div>
              <p className="text-[11px] text-indigo-200/90 italic">
                {zoneData.lead_time_status}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Hydrology & Topography */}
        {activeTab === 'hydrology' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200 block text-xs">THÔNG SỐ MƯA ĐỘNG (TELEMETRY)</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Mưa 1h</span>
                  <span className="text-sm font-bold text-rose-400">{zoneData.rainfall_1h} mm</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Mưa 3h</span>
                  <span className="text-sm font-bold text-amber-400">{zoneData.rainfall_3h} mm</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Mưa 6h</span>
                  <span className="text-sm font-bold text-slate-200">{zoneData.rainfall_6h} mm</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Mưa 24h</span>
                  <span className="text-sm font-bold text-rose-400">{zoneData.rainfall_24h} mm</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 pt-1">
                {zoneData.meteorological_factors}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200 block text-xs">ĐẶC TRƯNG ĐỊA LÝ & ĐỊA CHẤT CÔNG TRÌNH</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Độ cao trung bình</span>
                  <b className="text-slate-200 font-mono">{zoneData.elevation} m</b>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Độ dốc sườn núi</span>
                  <b className="text-slate-200 font-mono">{zoneData.slope}° ({zoneData.aspect})</b>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Độ nhạy địa chất</span>
                  <b className="text-rose-400">{zoneData.geology_sensitivity}</b>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Độ bão hòa đất</span>
                  <b className="text-amber-400 font-mono">{zoneData.soil_saturation_percent}%</b>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                {zoneData.geological_factors}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-200 block text-xs">HỆ THỐNG LƯU VỰC & DÒNG CHẢY</span>
              <div className="text-[11px] text-slate-300">
                Lưu vực chính: <b className="text-white">{zoneData.basin_name}</b>
              </div>
              <div className="text-[11px] text-slate-400">
                Dân số trong diện nguy cơ: <b className="text-rose-300">{zoneData.vulnerable_population} người</b>
              </div>
            </div>

            {/* Global Flood Forecasting API (Copernicus GloFAS) Section */}
            <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-800/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-blue-300 font-bold text-xs">
                  <Droplet className="w-4 h-4 text-blue-400" />
                  <span>DỰ BÁO LŨ TOÀN CẦU (FLOOD FORECASTING API)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/50 text-blue-200 border border-blue-700/50">
                  GloFAS 4.0 / Open-Meteo
                </span>
              </div>

              {loadingFloodForecast ? (
                <div className="py-4 flex items-center justify-center gap-2 text-slate-400 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span>Đang truy vấn mô hình GloFAS Copernicus...</span>
                </div>
              ) : floodForecast ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Lưu lượng hiện tại (Q)</span>
                      <span className="text-sm font-bold font-mono text-cyan-300">
                        {floodForecast.current_river_discharge} m³/s
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Đỉnh lũ dự báo 7 ngày</span>
                      <span className="text-sm font-bold font-mono text-rose-400">
                        {floodForecast.peak_discharge_7d} m³/s
                      </span>
                    </div>
                  </div>

                  {/* 7-Day Discharge Forecast Chart */}
                  {floodForecast.daily?.time && floodForecast.daily?.river_discharge && (
                    <div className="pt-1">
                      <span className="text-[10px] text-slate-400 block mb-1.5">
                        Xu hướng lưu lượng dòng chảy 7 ngày tới (m³/s):
                      </span>
                      <div className="grid grid-cols-7 gap-1 text-center font-mono">
                        {floodForecast.daily.time.slice(0, 7).map((t: string, idx: number) => {
                          const val = floodForecast.daily.river_discharge[idx] || 0;
                          const isPeak = val === floodForecast.peak_discharge_7d;
                          return (
                            <div key={idx} className="flex flex-col items-center gap-1">
                              <span className="text-[9px] text-slate-500">
                                {new Date(t).toLocaleDateString([], { weekday: 'narrow' })}
                              </span>
                              <div className="w-full bg-slate-800 h-14 rounded flex flex-col justify-end p-0.5">
                                <div
                                  className={`w-full rounded-sm ${
                                    isPeak
                                      ? 'bg-rose-500'
                                      : val > 200
                                      ? 'bg-amber-500'
                                      : 'bg-cyan-500'
                                  }`}
                                  style={{
                                    height: `${Math.min(100, Math.max(15, (val / (floodForecast.peak_discharge_7d || 300)) * 100))}%`
                                  }}
                                />
                              </div>
                              <span className={`text-[9px] ${isPeak ? 'text-rose-300 font-bold' : 'text-slate-300'}`}>
                                {Math.round(val)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="text-[10px] text-blue-200/80 pt-1 border-t border-blue-900/40 flex items-center justify-between">
                    <span>Nguồn: <strong>{floodForecast.source}</strong></span>
                    <span className="text-emerald-400">● Trực tuyến</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleFetchFloodForecast}
                  className="w-full py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 rounded-lg text-xs font-semibold transition"
                >
                  Tải dữ liệu Thủy văn & Lưu lượng Dòng chảy GloFAS
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Emergency Safety Plan */}
        {activeTab === 'safety' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>QUY TRÌNH HÀNH ĐỘNG KHẨN CẤP (BAN CHỈ HUY PCTT)</span>
              </div>
              <ul className="space-y-2 pt-1">
                {zoneData.safety_recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-200 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-200 block text-xs">ĐIỂM TRỌNG YẾU CẦN BẢO VỆ & CHỐT CHẶN</span>
              <div className="text-[11px] text-slate-300">
                Các vị trí có nguy cơ cô lập:
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 text-[11px]">
                  Cầu tràn dân sinh
                </span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 text-[11px]">
                  Điểm trường tiểu học & mầm non
                </span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 text-[11px]">
                  Tuyến giao thông độc đạo
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Evidence: Multi-Source Evidence Fusion (Dexuat 04-AI) */}
        {activeTab === 'evidence' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-slate-100 text-xs">HỢP NHẤT BẰNG CHỨNG ĐA NGUỒN (EVIDENCE FUSION)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Độ tin cậy: {evidenceFusion?.overall_confidence_score || 94}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Hệ thống kết hợp dữ liệu Vật lý thủy văn, Viễn thám vệ tinh, Địa hình DEM, Mô hình AI và Báo cáo thực địa từ công dân theo chuẩn <span className="text-cyan-300 font-mono">Dexuat 04-AI / 04-evidence-fusion</span>.
              </p>
            </div>

            {loadingEvidence && (
              <div className="p-8 text-center space-y-2 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-cyan-400" />
                <p>Đang truy vấn chuỗi bằng chứng không gian...</p>
              </div>
            )}

            {!loadingEvidence && evidenceFusion && (
              <div className="space-y-2.5">
                {evidenceFusion.evidence_chain.map((ev, idx) => (
                  <div
                    key={ev.id || idx}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                      ev.status === 'ALERT_TRIGGERED'
                        ? 'bg-red-950/20 border-red-500/40 text-red-200'
                        : ev.status === 'WARNING'
                        ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[11px] text-slate-400 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-mono font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        {ev.source_label}
                      </span>
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-900 border border-slate-700 text-cyan-300">
                        Trọng số: {ev.weight_percent}%
                      </span>
                    </div>

                    <div className="font-bold text-white text-xs pl-6">
                      {ev.evidence_title}
                    </div>

                    <div className="flex items-center justify-between text-[11px] pl-6 text-slate-400">
                      <span className="font-mono text-cyan-200">{ev.value_display}</span>
                      <span className="text-[10px] text-slate-500">{ev.provenance}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Gemini Deep AI Consultation */}
        {activeTab === 'gemini' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-900 via-sky-950/70 to-slate-900 border border-sky-600/40">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-400" />
                <div>
                  <div className="font-bold text-white text-xs tracking-wider">TƯ VẤN CHIẾN THUẬT TỪ GEMINI AI</div>
                  <div className="text-[10px] text-sky-200">Tổng hợp phân tích chuyên sâu cho chỉ huy trưởng</div>
                </div>
              </div>
              <button
                onClick={handleFetchGemini}
                disabled={loadingGemini}
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-sm disabled:opacity-50"
              >
                {loadingGemini ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{loadingGemini ? 'Đang phân tích...' : 'Cập nhật AI'}</span>
              </button>
            </div>

            {loadingGemini && (
              <div className="p-8 text-center space-y-2 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-400" />
                <p>Gemini đang phân tích bối cảnh thủy văn và đề xuất phương án di dời...</p>
              </div>
            )}

            {!loadingGemini && geminiConsultation && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-amber-400 text-xs block">1. ĐÁNH GIÁ ĐỘNG LỰC HỌC DÒNG CHẢY & TRƯỢT ĐẤT</span>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    {geminiConsultation.tactical_analysis}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-emerald-400 text-xs block">2. KẾ HOẠCH SƠ TÁN & THỨ TỰ ƯU TIÊN</span>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    {geminiConsultation.evacuation_plan}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-sky-400 text-xs block">3. HƯỚNG DẪN KỸ THUẬT BẢO VỆ HẠ TẦNG</span>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    {geminiConsultation.infrastructure_protection}
                  </p>
                </div>

                <div className="text-[10px] text-slate-500 text-right font-mono">
                  Nguồn: {geminiConsultation.source}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Mô hình: <b className="text-slate-300">{zoneData.model_version}</b></span>
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
        >
          Đóng chi tiết
        </button>
      </div>
    </div>
  );
};
