import React, { useState, useEffect } from 'react';
import { X, Database, ShieldCheck, AlertOctagon, CheckCircle2, AlertTriangle, RefreshCw, Zap } from 'lucide-react';
import { DataQualityAuditRecord } from '../types';
import { safeFetchJson } from '../utils/apiClient';

interface DataQualityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataQualityDrawer: React.FC<DataQualityDrawerProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<DataQualityAuditRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [testingSpike, setTestingSpike] = useState<boolean>(false);

  const fetchQualityData = () => {
    setLoading(true);
    safeFetchJson<{ logs?: DataQualityAuditRecord[]; stats?: any }>('/api/v1/data-quality/audit')
      .then((data) => {
        setLogs(data?.logs || []);
        setStats(data?.stats || null);
        setLoading(false);
      })
      .catch((e) => {
        console.warn('Notice loading quality data:', e);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isOpen) {
      fetchQualityData();
    }
  }, [isOpen]);

  const handleTestMockSpike = async () => {
    setTestingSpike(true);
    try {
      await safeFetchJson('/api/v1/data-quality/mock-spike', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ station_code: 'VNA-LCA02', r1h: 310.0 })
      });
      fetchQualityData();
    } catch (e) {
      console.warn('Notice testing mock spike:', e);
    } finally {
      setTestingSpike(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                DATA QUALITY ENGINE – KIỂM ĐỊNH & LỌC NHIỄU DỮ LIỆU ĐO MƯA
              </h2>
              <p className="text-xs text-slate-400">
                Quy trình bắt buộc kiểm tra Outlier, Missing, Duplicate trước khi đưa vào AI (PRD Section 8)
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Stats Bar */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">TỔNG SỐ LƯỢT KIỂM ĐỊNH</span>
                <span className="text-xl font-bold font-mono text-white">{stats.totalChecks}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">TỶ LỆ ĐẠT CHUẨN (VALID)</span>
                <span className="text-xl font-bold font-mono text-emerald-400">{stats.validPercentage}%</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">CẢNH BÁO NHIỄU (WARNING)</span>
                <span className="text-xl font-bold font-mono text-amber-400">{stats.warningCount}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">DỊ THƯỜNG / LỖI (INVALID)</span>
                <span className="text-xl font-bold font-mono text-rose-400">{stats.invalidCount}</span>
              </div>
            </div>
          )}

          {/* Test Action Bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div>
              <span className="font-bold text-white block text-xs">THỬ NGHIỆM BỘ LỌC DỮ LIỆU DỊ THƯỜNG (OUTLIER SPIKE)</span>
              <span className="text-slate-400 text-[11px]">Bơm giá trị mưa ảo 310mm/h để kiểm tra bộ lọc chặn phi vật lý</span>
            </div>
            <button
              onClick={handleTestMockSpike}
              disabled={testingSpike}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold transition flex items-center gap-1.5 shadow"
            >
              {testingSpike ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              <span>Bơm Thử Outlier</span>
            </button>
          </div>

          {/* Audit Logs Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-2.5 bg-slate-950 font-bold text-slate-300 border-b border-slate-800 flex items-center justify-between">
              <span>NHẬT KÝ TRUY VẾT KIỂM ĐỊNH (AUDIT TRAIL LOGS)</span>
              <button onClick={fetchQualityData} className="text-slate-400 hover:text-white flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Làm mới
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-800 font-mono text-[11px]">
              {logs.map((log) => (
                <div key={log.id} className="p-2.5 hover:bg-slate-800/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                          log.status === 'VALID'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : log.status === 'WARNING'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {log.status}
                      </span>
                      <span className="font-bold text-slate-200">{log.station_code}</span>
                      <span className="text-slate-500">[{log.check_type}]</span>
                    </div>
                    <span className="text-slate-500 text-[10px] font-sans">
                      {new Date(log.timestamp).toLocaleTimeString('vi-VN')}
                    </span>
                  </div>
                  <div className="text-slate-300 font-sans text-xs">{log.details}</div>
                  <div className="text-emerald-400 font-sans text-[11px]">→ Xử lý: {log.action_taken}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex justify-end">
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
