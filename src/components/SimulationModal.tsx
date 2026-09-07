import React, { useState } from 'react';
import { X, Play, Sliders, AlertTriangle, ShieldCheck, RefreshCw, Flame } from 'lucide-react';
import { SimulationResult, SimulationScenarioInput, SpatialZone } from '../types';
import { safeFetchJson } from '../utils/apiClient';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  zones: SpatialZone[];
  onApplySimulationToMap?: (result: SimulationResult) => void;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  zones,
  onApplySimulationToMap
}) => {
  const [r1h, setR1h] = useState<number>(65);
  const [r3h, setR3h] = useState<number>(120);
  const [r6h, setR6h] = useState<number>(180);
  const [r24h, setR24h] = useState<number>(240);
  const [soilSatMod, setSoilSatMod] = useState<number>(15);
  const [trend, setTrend] = useState<'RISING_SHARP' | 'RISING' | 'STABLE' | 'DECREASING'>('RISING_SHARP');
  const [selectedZoneIds, setSelectedZoneIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  if (!isOpen) return null;

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const payload: SimulationScenarioInput = {
        rainfall_1h: r1h,
        rainfall_3h: r3h,
        rainfall_6h: r6h,
        rainfall_24h: r24h,
        soil_saturation_modifier: soilSatMod,
        rainfall_trend: trend,
        zone_ids: selectedZoneIds.length > 0 ? selectedZoneIds : undefined
      };

      const data = await safeFetchJson<SimulationResult>('/api/v1/simulation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (data) {
        setSimResult(data);
      }
    } catch (err) {
      console.warn('Notice running simulation:', err);
    } finally {
      setLoading(false);
    }
  };

  const presetExtremeTyphoon = () => {
    setR1h(90);
    setR3h(175);
    setR6h(260);
    setR24h(380);
    setSoilSatMod(30);
    setTrend('RISING_SHARP');
  };

  const presetModerate = () => {
    setR1h(35);
    setR3h(65);
    setR6h(90);
    setR24h(130);
    setSoilSatMod(5);
    setTrend('STABLE');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                SIMULATION MODE – KHÔNG GIAN THỬ NGHIỆM KỊCH BẢN MƯA
              </h2>
              <p className="text-xs text-slate-400">
                Mô phỏng phản ứng của Hybrid Risk Engine khi thay đổi cường độ mưa và độ bão hòa đất
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Left Column: Parameter Sliders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-xs">THIẾT LẬP THÔNG SỐ MƯA KỊCH BẢN</span>
              <div className="flex gap-1.5">
                <button
                  onClick={presetExtremeTyphoon}
                  className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold"
                >
                  ⚡ Siêu bão cực đoan
                </button>
                <button
                  onClick={presetModerate}
                  className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold"
                >
                  Mưa vừa
                </button>
              </div>
            </div>

            {/* R1h Slider */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-300">Cường độ mưa 1h (R1h)</span>
                <span className="font-mono font-bold text-amber-400">{r1h} mm/h</span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                value={r1h}
                onChange={(e) => setR1h(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 mm</span>
                <span>60mm (Ngưỡng Cấp 4)</span>
                <span>150 mm/h</span>
              </div>
            </div>

            {/* R3h Slider */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-300">Mưa dồn dập 3h (R3h)</span>
                <span className="font-mono font-bold text-amber-400">{r3h} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                value={r3h}
                onChange={(e) => setR3h(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* R24h Slider */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-300">Mưa tích lũy 24h (R24h)</span>
                <span className="font-mono font-bold text-rose-400">{r24h} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="600"
                value={r24h}
                onChange={(e) => setR24h(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 mm</span>
                <span>200mm (Bão hòa trượt đất)</span>
                <span>600 mm</span>
              </div>
            </div>

            {/* Trend Selector */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-slate-300 block">Xu hướng mưa (Rainfall Trend)</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'RISING_SHARP', label: 'Tăng Đột Biến' },
                  { id: 'RISING', label: 'Đang Tăng' },
                  { id: 'STABLE', label: 'Ổn Định' },
                  { id: 'DECREASING', label: 'Giảm Dần' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTrend(t.id as any)}
                    className={`py-1.5 px-2 rounded text-center font-medium transition ${
                      trend === t.id
                        ? 'bg-amber-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{loading ? 'Đang chạy mô phỏng...' : 'CHẠY TÍNH TOÁN KỊCH BẢN (RUN SIMULATION)'}</span>
            </button>
          </div>

          {/* Right Column: Simulation Output Results */}
          <div className="space-y-4">
            <span className="font-bold text-slate-200 text-xs block">KẾT QUẢ ĐÁNH GIÁ TỔNG HỢP KỊCH BẢN</span>

            {!simResult ? (
              <div className="h-64 flex flex-col items-center justify-center p-6 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500 space-y-2">
                <Sliders className="w-8 h-8 text-slate-600" />
                <p>Nhấp vào "Chạy tính toán kịch bản" để xem kết quả phân cấp rủi ro trên toàn bộ các xã miền núi.</p>
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in duration-300">
                {/* Impact summary numbers */}
                <div className="grid grid-cols-5 gap-1.5 text-center font-mono">
                  <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-800">
                    <span className="text-[10px] text-purple-300 block">Cấp 5</span>
                    <span className="text-base font-bold text-purple-300">{simResult.impact_summary.level_5_count}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-red-950/60 border border-red-800">
                    <span className="text-[10px] text-red-300 block">Cấp 4</span>
                    <span className="text-base font-bold text-red-400">{simResult.impact_summary.level_4_count}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-orange-950/60 border border-orange-800">
                    <span className="text-[10px] text-orange-300 block">Cấp 3</span>
                    <span className="text-base font-bold text-orange-400">{simResult.impact_summary.level_3_count}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-yellow-950/60 border border-yellow-800">
                    <span className="text-[10px] text-yellow-300 block">Cấp 2</span>
                    <span className="text-base font-bold text-yellow-300">{simResult.impact_summary.level_2_count}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-sky-950/60 border border-sky-800">
                    <span className="text-[10px] text-sky-300 block">Cấp 1</span>
                    <span className="text-base font-bold text-sky-300">{simResult.impact_summary.level_1_count}</span>
                  </div>
                </div>

                {/* Cascade Warning Banner */}
                <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                    <Flame className="w-4 h-4" />
                    <span>ĐÁNH GIÁ TÁC ĐỘNG LIÊN HOÀN (CASCADE IMPACT)</span>
                  </div>
                  <p className="text-slate-200 text-xs leading-relaxed">
                    {simResult.cascade_warning}
                  </p>
                </div>

                {/* Top Affected Zones List */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-300 block text-xs">CÁC ĐỊA BÀN CHỊU ẢNH HƯỞNG NẶNG NHẤT:</span>
                  <div className="max-h-48 overflow-y-auto space-y-1.5 divide-y divide-slate-800/60">
                    {simResult.results
                      .filter((r) => r.overall_risk_level >= 3)
                      .map((r) => (
                        <div key={r.zone_id} className="pt-1.5 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-white text-xs">{r.zone_name}</span>
                            <span className="text-[11px] text-slate-400 block">{r.district_name}, {r.province_name}</span>
                          </div>
                          <span
                            style={{ backgroundColor: r.color }}
                            className="px-2 py-0.5 rounded font-extrabold text-[10px] text-white"
                          >
                            CẤP {r.overall_risk_level}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>HAEWS Simulation Engine v2.0</span>
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
