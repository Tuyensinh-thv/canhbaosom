import React, { useState, useEffect } from 'react';
import {
  X,
  Activity,
  Droplets,
  TrendingUp,
  Clock,
  Layers,
  ChevronRight,
  ShieldAlert,
  Info,
  Waves,
  RefreshCw
} from 'lucide-react';
import { LstmHydrographAnalysis, SpatialZone } from '../types';
import { safeFetchJson } from '../utils/apiClient';

interface LstmHydrographModalProps {
  isOpen: boolean;
  onClose: () => void;
  zones: SpatialZone[];
  initialZoneId?: string;
}

export const LstmHydrographModal: React.FC<LstmHydrographModalProps> = ({
  isOpen,
  onClose,
  zones,
  initialZoneId
}) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(initialZoneId || (zones[0]?.id ?? 'ZONE-LC-01'));
  const [data, setData] = useState<LstmHydrographAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  useEffect(() => {
    if (initialZoneId) {
      setSelectedZoneId(initialZoneId);
    }
  }, [initialZoneId]);

  const fetchHydrograph = async (zoneId: string) => {
    setLoading(true);
    try {
      const json = await safeFetchJson<LstmHydrographAnalysis>(`/api/v1/lstm/hydrograph/${zoneId}`);
      if (json) {
        setData(json);
      }
    } catch (err) {
      console.warn('Notice loading LSTM hydrograph:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && selectedZoneId) {
      fetchHydrograph(selectedZoneId);
    }
  }, [isOpen, selectedZoneId]);

  if (!isOpen) return null;

  const points = data?.hydrograph_points || [];
  const maxFlow = Math.max(...points.map((p) => p.upper_bound_m3s), data?.alarm_levels.bd3_m3s || 100, 10);
  const maxRain = Math.max(...points.map((p) => p.rainfall_mm), 20);

  // SVG dimensions
  const svgWidth = 840;
  const svgHeight = 280;
  const padLeft = 55;
  const padRight = 35;
  const padTop = 30;
  const padBottom = 40;
  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  const getX = (index: number) => padLeft + (index / (points.length - 1 || 1)) * chartW;
  const getYFlow = (val: number) => padTop + chartH - (val / maxFlow) * chartH;
  const getYRain = (val: number) => padTop + (val / maxRain) * (chartH * 0.45);

  // Flow path generator
  const createPath = (key: 'predicted_discharge_m3s' | 'observed_discharge_m3s' | 'upper_bound_m3s' | 'lower_bound_m3s') => {
    return points
      .filter((p) => p[key] !== null)
      .map((p, i) => {
        const globalIdx = points.indexOf(p);
        const x = getX(globalIdx);
        const y = getYFlow(p[key] as number);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">
                  Biểu Đồ Thủy Văn Dòng Chảy LSTM Hydrograph 2D
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Mô hình Chuỗi Thời gian Toàn cầu
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Dự báo lưu lượng nước tức thời $Q(t)$ ($m^3/s$) và mực nước lũ quét 48 giờ liên tục (-24h quá khứ đến +24h tương lai)
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
          {/* Zone Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400">Chọn lưu vực trọng điểm:</span>
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-medium"
              >
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.zone_name} ({z.province_name}) - Lưu vực {z.basin_name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => fetchHydrograph(selectedZoneId)}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 rounded-lg text-xs font-medium transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Cập nhật Thủy văn AI
            </button>
          </div>

          {data && (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Lưu lượng Hiện tại</span>
                    <Waves className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-xl font-bold text-cyan-300">
                    {data.current_discharge_m3s} <span className="text-xs font-normal text-slate-400">m³/s</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Cấp báo động:{' '}
                    <span className={`font-semibold ${data.warning_level_current >= 3 ? 'text-red-400' : data.warning_level_current >= 2 ? 'text-amber-400' : data.warning_level_current >= 1 ? 'text-yellow-300' : 'text-emerald-400'}`}>
                      {data.warning_level_current === 0 ? 'Bình thường' : `Báo động ${data.warning_level_current}`}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Đỉnh Lũ Dự Báo ($Q_{'{peak}'}$)</span>
                    <TrendingUp className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="text-xl font-bold text-red-400">
                    {data.peak_discharge_m3s} <span className="text-xs font-normal text-slate-400">m³/s</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Đạt đỉnh sau: <strong className="text-slate-200">+{data.peak_time_offset_hours} Giờ</strong>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Thời Gian Tập Trung Lũ</span>
                    <Clock className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold text-emerald-300">
                    {data.time_to_peak_hours} <span className="text-xs font-normal text-slate-400">Giờ</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Diện tích lưu vực: <strong className="text-slate-200">{data.basin_area_km2} km²</strong>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Trữ Nước LSTM ($c_t$)</span>
                    <Layers className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xl font-bold text-purple-300">
                    {Math.round(data.lstm_internals.cell_state_retention * 100)}%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Độ bão hòa tầng đất ngầm
                  </div>
                </div>
              </div>

              {/* Main SVG Chart Container */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-3 h-0.5 bg-cyan-400 inline-block"></span> Dự báo Lưu lượng LSTM ($Q(t)$)
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-3 h-0.5 bg-blue-500 border-b border-dashed inline-block"></span> Quan trắc thực tế
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-2.5 h-2.5 bg-blue-500/40 rounded-sm inline-block"></span> Mưa từng giờ (mm)
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-yellow-400">BĐ I: {data.alarm_levels.bd1_m3s}m³/s</span>
                    <span className="text-amber-400">BĐ II: {data.alarm_levels.bd2_m3s}m³/s</span>
                    <span className="text-red-400 font-semibold">BĐ III: {data.alarm_levels.bd3_m3s}m³/s</span>
                  </div>
                </div>

                {/* SVG Visualizer */}
                <div className="relative w-full overflow-x-auto">
                  <svg
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="w-full h-auto max-h-[320px] select-none"
                  >
                    {/* Background Grid Lines */}
                    {[0.25, 0.5, 0.75, 1.0].map((ratio, i) => (
                      <line
                        key={i}
                        x1={padLeft}
                        y1={padTop + chartH * (1 - ratio)}
                        x2={svgWidth - padRight}
                        y2={padTop + chartH * (1 - ratio)}
                        stroke="#334155"
                        strokeDasharray="3 3"
                        strokeWidth="0.8"
                      />
                    ))}

                    {/* Alarm Threshold Lines */}
                    {/* BD1 */}
                    <line
                      x1={padLeft}
                      y1={getYFlow(data.alarm_levels.bd1_m3s)}
                      x2={svgWidth - padRight}
                      y2={getYFlow(data.alarm_levels.bd1_m3s)}
                      stroke="#facc15"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    {/* BD2 */}
                    <line
                      x1={padLeft}
                      y1={getYFlow(data.alarm_levels.bd2_m3s)}
                      x2={svgWidth - padRight}
                      y2={getYFlow(data.alarm_levels.bd2_m3s)}
                      stroke="#fb923c"
                      strokeDasharray="4 4"
                      strokeWidth="1.2"
                    />
                    {/* BD3 */}
                    <line
                      x1={padLeft}
                      y1={getYFlow(data.alarm_levels.bd3_m3s)}
                      x2={svgWidth - padRight}
                      y2={getYFlow(data.alarm_levels.bd3_m3s)}
                      stroke="#f87171"
                      strokeDasharray="5 3"
                      strokeWidth="1.5"
                    />

                    {/* Rainfall Bars (Inverted from Top) */}
                    {points.map((p, i) => {
                      const x = getX(i);
                      const barH = getYRain(p.rainfall_mm) - padTop;
                      return (
                        <rect
                          key={`rain-${i}`}
                          x={x - 4}
                          y={padTop}
                          width={8}
                          height={Math.max(0, barH)}
                          fill="#3b82f6"
                          opacity={0.35}
                          rx={1}
                        />
                      );
                    })}

                    {/* Current Time Vertical Line (offset = 0) */}
                    <line
                      x1={getX(24)}
                      y1={padTop}
                      x2={getX(24)}
                      y2={padTop + chartH}
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="2 2"
                    />
                    <text
                      x={getX(24)}
                      y={padTop - 8}
                      fill="#10b981"
                      fontSize="10"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      Hiện tại (0h)
                    </text>

                    {/* Predicted Flow Path */}
                    <path
                      d={createPath('predicted_discharge_m3s')}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.5"
                    />

                    {/* Observed Past Flow Path */}
                    <path
                      d={createPath('observed_discharge_m3s')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />

                    {/* Interactive Points */}
                    {points.map((p, i) => {
                      const x = getX(i);
                      const y = getYFlow(p.predicted_discharge_m3s);
                      const isHovered = hoveredPoint === i;
                      const isNow = p.hour_offset === 0;

                      return (
                        <g
                          key={`pt-${i}`}
                          onMouseEnter={() => setHoveredPoint(i)}
                          onMouseLeave={() => setHoveredPoint(null)}
                          className="cursor-pointer"
                        >
                          <circle
                            cx={x}
                            cy={y}
                            r={isHovered ? 6 : isNow ? 5 : 2.5}
                            fill={isNow ? '#10b981' : isHovered ? '#f43f5e' : '#22d3ee'}
                            stroke="#0f172a"
                            strokeWidth="1.5"
                          />
                        </g>
                      );
                    })}

                    {/* X-axis time labels */}
                    {[-24, -18, -12, -6, 0, 6, 12, 18, 24].map((offset) => {
                      const ptIdx = points.findIndex((p) => p.hour_offset === offset);
                      if (ptIdx === -1) return null;
                      const x = getX(ptIdx);
                      return (
                        <text
                          key={offset}
                          x={x}
                          y={padTop + chartH + 18}
                          fill="#94a3b8"
                          fontSize="9.5"
                          textAnchor="middle"
                        >
                          {offset === 0 ? '0h' : offset > 0 ? `+${offset}h` : `${offset}h`}
                        </text>
                      );
                    })}

                    {/* Y-axis left labels (Discharge m3/s) */}
                    <text x={padLeft - 8} y={padTop + 10} fill="#22d3ee" fontSize="9" textAnchor="end">
                      {Math.round(maxFlow)} m³/s
                    </text>
                    <text x={padLeft - 8} y={padTop + chartH / 2} fill="#94a3b8" fontSize="9" textAnchor="end">
                      {Math.round(maxFlow / 2)}
                    </text>
                    <text x={padLeft - 8} y={padTop + chartH} fill="#94a3b8" fontSize="9" textAnchor="end">
                      0
                    </text>
                  </svg>
                </div>

                {/* Hover Point Inspector Tooltip */}
                {hoveredPoint !== null && points[hoveredPoint] && (
                  <div className="mt-3 p-3 bg-slate-900 border border-cyan-500/40 rounded-lg flex flex-wrap items-center justify-between text-xs gap-3">
                    <div>
                      <span className="text-slate-400">Mốc thời gian:</span>{' '}
                      <strong className="text-white">
                        {points[hoveredPoint].hour_offset === 0
                          ? 'Hiện tại'
                          : `${points[hoveredPoint].hour_offset > 0 ? '+' : ''}${points[hoveredPoint].hour_offset} Giờ`}
                      </strong>{' '}
                      <span className="text-slate-500">({new Date(points[hoveredPoint].timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })})</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Lưu lượng dự báo:</span>{' '}
                      <strong className="text-cyan-300">{points[hoveredPoint].predicted_discharge_m3s} m³/s</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Mưa mô phỏng:</span>{' '}
                      <strong className="text-blue-400">{points[hoveredPoint].rainfall_mm} mm/h</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Ẩm đất tầng sâu:</span>{' '}
                      <strong className="text-purple-300">{points[hoveredPoint].soil_moisture_saturation_pct}%</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* LSTM Internal Architecture Explanation */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <Info className="w-4 h-4" />
                  <span>Cơ chế Hoạt động của Mạng LSTM trong Thủy văn Lưu vực {data.basin_name}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Mô hình <strong>Bi-directional LSTM</strong> mô phỏng trực tiếp hàm truyền lưu vực sông núi:
                  Cổng quên ($f_t = {data.lstm_internals.forget_gate_rate}$) tính toán tốc độ tiêu thoát nước ngầm tự nhiên;
                  Ô nhớ trạng thái ($c_t = {data.lstm_internals.cell_state_retention}$) ghi nhớ dung lượng ngậm nước tích lũy từ các đợt mưa trước;
                  khi đất bão hòa, Cổng nạp ($i_t = {data.lstm_internals.input_gate_activation}$) mở rộng cực đại, biến gần như 100% lượng mưa bổ sung thành lũ tràn bề mặt và dòng bùn đá tốc độ cao.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Chuẩn thuật toán: Hydrological LSTM Nature (Google Research + Bộ TN&MT)</span>
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
