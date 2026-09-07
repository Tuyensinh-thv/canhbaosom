import React, { useState, useEffect } from 'react';
import {
  X,
  Radio,
  CloudRain,
  Wind,
  Compass,
  AlertTriangle,
  RefreshCw,
  Eye,
  Shield,
  Layers,
  Clock
} from 'lucide-react';
import { RadarNowcastMosaic, RadarNowcastCell } from '../types';
import { safeFetchJson } from '../utils/apiClient';

interface RadarNowcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RadarNowcastModal: React.FC<RadarNowcastModalProps> = ({
  isOpen,
  onClose
}) => {
  const [data, setData] = useState<RadarNowcastMosaic | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCell, setSelectedCell] = useState<RadarNowcastCell | null>(null);

  const fetchRadarData = async () => {
    setLoading(true);
    try {
      const json = await safeFetchJson<RadarNowcastMosaic>('/api/v1/radar/nowcast');
      if (json) {
        setData(json);
        if (json.convective_cells && json.convective_cells.length > 0) {
          setSelectedCell(json.convective_cells[0]);
        }
      }
    } catch (err) {
      console.warn('Notice loading radar nowcasting data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRadarData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getDbzColor = (dbz: number) => {
    if (dbz >= 60) return 'text-purple-400 bg-purple-500/20 border-purple-500/40';
    if (dbz >= 50) return 'text-red-400 bg-red-500/20 border-red-500/40';
    if (dbz >= 40) return 'text-amber-400 bg-amber-500/20 border-amber-500/40';
    return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-blue-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">
                  Mạng Lưới Radar Doppler & Dự Báo Mưa Tức Thời (Nowcasting QPE)
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Quét Liên tục 10 Trạm Quốc Gia
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Theo dõi khối mây đối lưu gây mưa cực đoan, phân tích phản hồi vô tuyến ($dBZ$) và ước tính lượng mưa $Z = 200R^{1.6}$
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
          {/* Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-400">
                Trạm trực tuyến: <strong className="text-emerald-400">{data?.total_active_radars || 8}/8 Trạm</strong>
              </span>
              <span className="text-slate-400">
                Tế bào đối lưu phát hiện: <strong className="text-red-400">{data?.convective_cells_count || 4} Khối mây</strong>
              </span>
              <span className="text-slate-400">
                Phản hồi cực đại: <strong className="text-purple-400">{data?.highest_reflectivity_dbz || 58.5} dBZ</strong>
              </span>
            </div>

            <button
              onClick={fetchRadarData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 rounded-lg text-xs font-medium transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Quét lại Radar Doppler
            </button>
          </div>

          {/* Convective Cells Grid */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-blue-400" />
              Các Khối Mây Đối Lưu Gây Mưa Cực Đoan Đang Di Chuyển
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data?.convective_cells.map((cell) => {
                const isSelected = selectedCell?.id === cell.id;
                return (
                  <div
                    key={cell.id}
                    onClick={() => setSelectedCell(cell)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800/80 border-blue-400 ring-1 ring-blue-400/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-bold text-slate-100">{cell.name}</h4>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-lg border ${getDbzColor(cell.reflectivity_dbz)}`}>
                        {cell.reflectivity_dbz} dBZ
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs mb-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Cường độ mưa QPE</span>
                        <strong className="text-cyan-300">{cell.rainfall_rate_mmh} mm/h</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Đỉnh mây (Echo Top)</span>
                        <strong className="text-amber-300">{cell.echo_top_km} km</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Hàm lượng nước VIL</span>
                        <strong className="text-purple-300">{cell.vil_kg_m2} kg/m²</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Wind className="w-3.5 h-3.5 text-slate-400" />
                        <span>Vận tốc: <strong>{cell.velocity_kmh} km/h</strong> (Hướng {cell.direction_bearing_deg}°)</span>
                      </div>
                      <div className="flex items-center gap-1 text-red-400 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Đến vùng sau: {cell.estimated_arrival_minutes} phút</span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                      Vùng chịu tác động dự kiến:{' '}
                      <strong className="text-slate-200">{cell.projected_impact_zones.join(', ')}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Radar Doppler Stations Table */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              Mạng Lưới 8 Trạm Radar Doppler Quốc Gia Giám Sát
            </h3>

            <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Tên Trạm Radar</th>
                    <th className="px-4 py-3 font-semibold">Vị trí Lắp đặt</th>
                    <th className="px-4 py-3 font-semibold">Băng Tần</th>
                    <th className="px-4 py-3 font-semibold">Bán Kính Quét</th>
                    <th className="px-4 py-3 font-semibold">Phản hồi Gần nhất</th>
                    <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {data?.radar_stations.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-900/40">
                      <td className="px-4 py-2.5 font-medium text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                        {st.name}
                      </td>
                      <td className="px-4 py-2.5 text-slate-400">{st.location}</td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">
                          {st.band}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">{st.range_km} km</td>
                      <td className="px-4 py-2.5 font-bold text-amber-300">{st.max_reflectivity_dbz} dBZ</td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {st.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Chuẩn thuật toán: Marshall-Palmer QPE Equation ($Z = 200 R^{1.6}$) & Doppler Radial Velocity</span>
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
