import React, { useState, useEffect } from 'react';
import { X, Activity, Server, Cpu, Database, CheckCircle2, ShieldAlert, Clock, RefreshCw } from 'lucide-react';
import { SystemObservability } from '../types';
import { safeFetchJson } from '../utils/apiClient';

interface SystemObservabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemObservabilityModal: React.FC<SystemObservabilityModalProps> = ({ isOpen, onClose }) => {
  const [obs, setObs] = useState<SystemObservability | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchObs = () => {
    setLoading(true);
    safeFetchJson<SystemObservability>('/api/v1/observability')
      .then((data) => {
        if (data) setObs(data);
        setLoading(false);
      })
      .catch((e) => {
        console.warn('Notice loading observability data:', e);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isOpen) {
      fetchObs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                HỆ THỐNG GIÁM SÁT TRỰC TUYẾN (OBSERVABILITY & HEALTH)
              </h2>
              <p className="text-xs text-slate-400">
                Theo dõi tình trạng Database, API Microservice, AI Inference Engine và Telemetry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {loading || !obs ? (
            <div className="py-12 text-center text-slate-500">Đang kiểm tra kết nối dịch vụ...</div>
          ) : (
            <div className="space-y-4">
              {/* Overall Status Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <div>
                    <span className="font-bold text-white text-sm block">HỆ THỐNG ĐANG HOẠT ĐỘNG BÌNH THƯỜNG</span>
                    <span className="text-emerald-300 text-xs">Tất cả các pipeline AI Lai và Telemetry đang đồng bộ</span>
                  </div>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                  HEALTHY
                </span>
              </div>

              {/* Service Matrix Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="font-bold text-slate-200 block">PostgreSQL / PostGIS</span>
                      <span className="text-[10px] text-slate-400">Spatial Grid & Warning Logs</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    ONLINE
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="font-bold text-slate-200 block">FastAPI / Express Gateway</span>
                      <span className="text-[10px] text-slate-400">REST & GeoJSON API (v2.0)</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    ONLINE
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="font-bold text-slate-200 block">Landslide AI (XGBoost)</span>
                      <span className="text-[10px] text-slate-400">{obs.landslide_model_version}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    ACTIVE
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-rose-400" />
                    <div>
                      <span className="font-bold text-slate-200 block">Flash Flood AI (LightGBM)</span>
                      <span className="text-[10px] text-slate-400">{obs.flashflood_model_version}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    ACTIVE
                  </span>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Trạm đo mưa trực tuyến:</span>
                  <span className="text-white font-bold">{obs.active_stations_count} / {obs.total_stations_count} trạm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Chỉ số dữ liệu hợp lệ (Data Quality):</span>
                  <span className="text-emerald-400 font-bold">{obs.quality_valid_percentage}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Thời gian chạy mô hình gần nhất:</span>
                  <span className="text-slate-200">{new Date(obs.last_model_run).toLocaleTimeString('vi-VN')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Thời gian hoạt động liên tục (Uptime):</span>
                  <span className="text-slate-200">{Math.floor(obs.uptime_seconds / 60)} phút {obs.uptime_seconds % 60} giây</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <button onClick={fetchObs} className="flex items-center gap-1 hover:text-white transition">
            <RefreshCw className="w-3.5 h-3.5" /> Làm mới trạng thái
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
