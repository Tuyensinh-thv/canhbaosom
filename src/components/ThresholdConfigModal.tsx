import React, { useState, useEffect } from 'react';
import { X, Layers, Save, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import { ThresholdProfile } from '../types';
import { safeFetchJson } from '../utils/apiClient';

interface ThresholdConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThresholdConfigModal: React.FC<ThresholdConfigModalProps> = ({ isOpen, onClose }) => {
  const [profiles, setProfiles] = useState<ThresholdProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      safeFetchJson<{ data?: ThresholdProfile[] }>('/api/v1/thresholds')
        .then((data) => {
          setProfiles(data?.data || []);
          setLoading(false);
        })
        .catch((e) => {
          console.warn('Notice loading thresholds:', e);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdateValue = (id: string, field: keyof ThresholdProfile, val: any) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: Number(val) || val } : p))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await safeFetchJson<{ success?: boolean }>('/api/v1/thresholds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profiles })
      });
      if (data?.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.warn('Notice saving thresholds:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                CẤU HÌNH NGƯỠNG CẢNH BÁO VẬT LÝ (THRESHOLD PROFILES)
              </h2>
              <p className="text-xs text-slate-400">
                Lưu trong CSDL và nạp động vào Physical Rules Engine (Không hard-code mã nguồn)
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

        {/* Content Table */}
        <div className="flex-1 overflow-y-auto p-4 text-xs">
          {loading ? (
            <div className="py-12 text-center text-slate-500">Đang tải cấu hình ngưỡng...</div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 text-[11px] font-mono border-b border-slate-800">
                      <th className="p-3">Loại Rủi Ro</th>
                      <th className="p-3">Cấp Độ</th>
                      <th className="p-3">Ngưỡng R1h (mm)</th>
                      <th className="p-3">Ngưỡng R3h (mm)</th>
                      <th className="p-3">Ngưỡng R6h (mm)</th>
                      <th className="p-3">Ngưỡng R24h (mm)</th>
                      <th className="p-3">Bão Hòa Đất (%)</th>
                      <th className="p-3">Nguồn Quy Chuẩn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                    {profiles.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-bold font-sans">
                          {p.risk_type === 'flash_flood' ? (
                            <span className="text-blue-400">Lũ Quét (FF)</span>
                          ) : (
                            <span className="text-amber-400">Sạt Lở (LS)</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-white ${
                              p.level === 5
                                ? 'bg-purple-900'
                                : p.level === 4
                                ? 'bg-red-900'
                                : p.level === 3
                                ? 'bg-orange-900'
                                : 'bg-yellow-900 text-yellow-200'
                            }`}
                          >
                            CẤP {p.level}
                          </span>
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={p.rainfall_1h_threshold}
                            onChange={(e) => handleUpdateValue(p.id, 'rainfall_1h_threshold', e.target.value)}
                            className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:border-blue-500"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={p.rainfall_3h_threshold}
                            onChange={(e) => handleUpdateValue(p.id, 'rainfall_3h_threshold', e.target.value)}
                            className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:border-blue-500"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={p.rainfall_6h_threshold}
                            onChange={(e) => handleUpdateValue(p.id, 'rainfall_6h_threshold', e.target.value)}
                            className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:border-blue-500"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={p.rainfall_24h_threshold}
                            onChange={(e) => handleUpdateValue(p.id, 'rainfall_24h_threshold', e.target.value)}
                            className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:border-blue-500"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={p.soil_saturation_threshold || 80}
                            onChange={(e) => handleUpdateValue(p.id, 'soil_saturation_threshold', e.target.value)}
                            className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:border-blue-500"
                          />
                        </td>
                        <td className="p-3 text-slate-400 font-sans text-[10px]">
                          {p.source}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã lưu thành công cấu hình ngưỡng và cập nhật ngay vào Hybrid Risk Engine!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Các thay đổi sẽ kích hoạt tính toán lại phân cấp cảnh báo tức thì.
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Đang lưu...' : 'Lưu Cấu Hình'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
