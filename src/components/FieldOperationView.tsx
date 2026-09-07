import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckSquare,
  Square,
  Clock,
  Camera,
  MapPin,
  Send,
  AlertTriangle,
  Users,
  Home,
  CheckCircle2,
  Wifi,
  WifiOff,
  PhoneCall,
  Navigation,
  Sparkles,
  Upload,
  RefreshCw,
  FileText
} from 'lucide-react';
import { DisasterIncident, ResponseTask } from '../types';

interface FieldOperationViewProps {
  incidents: DisasterIncident[];
  onSelectIncident: (incidentId: string) => void;
  onOpenIncidentWorkspace: (incidentId: string) => void;
}

export const FieldOperationView: React.FC<FieldOperationViewProps> = ({
  incidents,
  onSelectIncident,
  onOpenIncidentWorkspace
}) => {
  const primaryIncident = incidents[0]; // SL-0821 as primary example

  const [tasks, setTasks] = useState<ResponseTask[]>(primaryIncident?.tasks || []);
  const [evacuatedCount, setEvacuatedCount] = useState<number>(62);
  const totalHouseholds = primaryIncident?.impact.exposedHouseholds || 87;
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [supportMessage, setSupportMessage] = useState<string>('');
  const [supportSent, setSupportSent] = useState<boolean>(false);
  const [selectedTaskForUpload, setSelectedTaskForUpload] = useState<string | null>(null);
  const [fieldNote, setFieldNote] = useState<string>('');

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
          return {
            ...t,
            status: nextStatus,
            completedAt: nextStatus === 'COMPLETED' ? '2026-08-21 08:30' : undefined
          };
        }
        return t;
      })
    );
  };

  const handleSendSupportRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSupportSent(true);
    setTimeout(() => {
      setShowSupportModal(false);
      setSupportSent(false);
      setSupportMessage('');
    }, 2000);
  };

  return (
    <div className="bg-[#001D3D] text-white p-4 space-y-5 rounded-2xl border border-[#004B87] shadow-2xl max-w-5xl mx-auto">
      {/* Header: Field Command HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#002B54] p-4 rounded-xl border border-emerald-500/60 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Giao Diện Tác Nghiệp Hiện Trường & Chỉ Huy Cấp Cơ Sở (Field View)
              </span>
              <span className="bg-emerald-700 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                XÃ LA PÁN TẨN (MÙ CANG CHẢI)
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white">
              Đội Ứng Cứu Xung Kích & Cán Bộ Hiện Trường
            </h1>
          </div>
        </div>

        {/* Offline & Sync Status Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOfflineMode(!offlineMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              offlineMode
                ? 'bg-amber-900/80 text-amber-200 border-amber-500 ring-1 ring-amber-400'
                : 'bg-[#001D3D] text-emerald-300 border-emerald-500/50'
            }`}
            title="Mô phỏng chế độ ngoại tuyến mất sóng di động"
          >
            {offlineMode ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{offlineMode ? 'Chế Độ Ngoại Tuyến (Offline PWA)' : 'Đang Kết Nối Trực Tuyến'}</span>
          </button>

          <button
            onClick={() => setShowSupportModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:brightness-110 text-white text-xs font-bold shadow-lg animate-pulse"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Yêu Cầu Chi Viện Khẩn Cấp</span>
          </button>
        </div>
      </div>

      {/* EMERGENCY DISASTER CARD FOR CURRENT COMMUNE */}
      {primaryIncident && (
        <div className="bg-[#002B54] border-2 border-rose-600 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#004B87] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
              <span className="font-extrabold text-sm text-rose-300">
                SỰ CỐ KHẨN CẤP: {primaryIncident.incidentCode} — {primaryIncident.name}
              </span>
            </div>
            <span className="bg-purple-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg">
              CẤP ĐỘ 5 — NGUY CƠ SỤP ĐỔ TRONG {primaryIncident.timeToCriticalThresholdMinutes} PHÚT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-[#001D3D] p-3 rounded-xl border border-[#003B73]">
              <span className="text-slate-400">Vị trí trọng điểm:</span>
              <div className="font-bold text-white mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#F5B400]" />
                <span>{primaryIncident.specificLocation}</span>
              </div>
            </div>

            <div className="bg-[#001D3D] p-3 rounded-xl border border-[#003B73]">
              <span className="text-slate-400">Tiến độ di dời nhân dân:</span>
              <div className="font-bold text-[#F5B400] text-sm mt-1">
                {evacuatedCount}/{totalHouseholds} hộ ({Math.round((evacuatedCount / totalHouseholds) * 100)}%)
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${(evacuatedCount / totalHouseholds) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-[#001D3D] p-3 rounded-xl border border-[#003B73]">
              <span className="text-slate-400">Điểm sơ tán an toàn:</span>
              <div className="font-bold text-emerald-300 mt-1">
                {primaryIncident.shelters[0]?.name} (Sức chứa 450 người)
              </div>
            </div>
          </div>

          {/* Quick Increment Evacuation Counter for Field Officer */}
          <div className="flex items-center justify-between bg-[#001830] p-2.5 rounded-xl border border-[#003B73] text-xs">
            <span className="font-semibold text-sky-200">
              Cập nhật nhanh số hộ đã đưa đến điểm sơ tán an toàn:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEvacuatedCount((c) => Math.max(0, c - 1))}
                className="px-2.5 py-1 bg-[#003B73] hover:bg-[#004B87] rounded text-white font-bold"
              >
                -1
              </button>
              <span className="font-mono font-black text-sm text-[#F5B400] px-2">{evacuatedCount} Hộ</span>
              <button
                onClick={() => setEvacuatedCount((c) => Math.min(totalHouseholds, c + 1))}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-white font-bold"
              >
                +1 Hộ Đã Đến
              </button>
              <button
                onClick={() => setEvacuatedCount((c) => Math.min(totalHouseholds, c + 5))}
                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-white font-bold"
              >
                +5 Hộ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TASK DISPATCH & FIELD CHECKLIST */}
      <div className="bg-[#002244] border border-[#005BAC] rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#004B87] pb-2">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#F5B400]" />
            <h2 className="text-sm font-extrabold text-[#F5B400] uppercase tracking-wide">
              Danh Sách Nhiệm Vụ Ứng Phó Được Giao Cho Xã ({tasks.length})
            </h2>
          </div>
          <span className="text-xs text-emerald-300 font-bold bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-600">
            {tasks.filter((t) => t.status === 'COMPLETED').length}/{tasks.length} Đã hoàn thành
          </span>
        </div>

        <div className="space-y-2.5">
          {tasks.map((task) => {
            const isDone = task.status === 'COMPLETED';

            return (
              <div
                key={task.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isDone
                    ? 'bg-[#001D3D]/80 border-emerald-600/50 opacity-90'
                    : task.priority === 'URGENT'
                    ? 'bg-[#002B54] border-rose-600/80 shadow-md ring-1 ring-rose-500/50'
                    : 'bg-[#00264d] border-[#004B87]'
                } space-y-2.5`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="mt-0.5 text-sky-400 hover:text-white transition"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-bold text-xs ${
                            isDone ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                            task.priority === 'URGENT' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-slate-950'
                          }`}
                        >
                          {task.priority === 'URGENT' ? 'KHẨN CẤP' : 'ƯU TIÊN CAO'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">{task.description}</p>
                    </div>
                  </div>

                  <div className="text-right text-[11px] font-mono shrink-0">
                    <span className="text-slate-400">Hạn chót: </span>
                    <span className="text-[#F5B400] font-bold">{task.deadline}</span>
                  </div>
                </div>

                {/* Responsible Person & Assigned Unit */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-[#001830] p-2 rounded-lg text-xs text-sky-200">
                  <div className="flex items-center gap-3">
                    <span>
                      👤 Phụ trách: <b>{task.assigneeName}</b> ({task.assigneePhone})
                    </span>
                    <span>
                      🏢 Đơn vị: <b>{task.assignedUnit}</b>
                    </span>
                  </div>

                  {/* Task Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedTaskForUpload(task.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#003B73] hover:bg-[#004B87] text-[11px] font-bold text-sky-100"
                    >
                      <Camera className="w-3 h-3 text-[#F5B400]" />
                      <span>Gửi Ảnh & GPS</span>
                    </button>

                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                        isDone ? 'bg-slate-700 text-slate-300' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {isDone ? 'Mở lại' : 'Xác nhận hoàn thành'}
                    </button>
                  </div>
                </div>

                {/* Field Notes & Evidence if available */}
                {task.fieldNotes && (
                  <div className="p-2 rounded bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200">
                    <b>Ghi chú hiện trường:</b> {task.fieldNotes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SUPPORT REQUEST MODAL */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#002244] border-2 border-rose-600 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 text-white animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#004B87] pb-3">
              <div className="flex items-center gap-2 text-rose-400 font-extrabold text-sm">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
                <span>YÊU CẦU CHI VIỆN KHẨN CẤP CHO CƠ SỞ</span>
              </div>
              <button onClick={() => setShowSupportModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {supportSent ? (
              <div className="p-6 text-center space-y-2 bg-emerald-950/60 border border-emerald-500 rounded-xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Yêu Cầu Đã Gửi Tới BCH Tỉnh & Quân Khu</h3>
                <p className="text-xs text-emerald-200">
                  Tổng đài chỉ huy đã ghi nhận tọa độ GPS và ưu tiên điều động phương tiện tiếp ứng trong 15 phút.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendSupportRequest} className="space-y-3">
                <p className="text-xs text-slate-300">
                  Hệ thống sẽ chuyển phát tín hiệu SOS trực tiếp đến Lãnh đạo Tỉnh, Bộ Chỉ huy Quân sự và Công an Tỉnh:
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-sky-200">Nội dung nhu cầu chi viện:</label>
                  <textarea
                    required
                    rows={3}
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Ví dụ: Đề nghị điều động 02 xe múc giải phóng đoạn sạt lở Km 285; Cần thêm 50 phao cứu sinh và 1 xuồng cứu hộ chuyên dụng..."
                    className="w-full bg-[#001830] border border-[#004B87] rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F5B400]"
                  />
                </div>

                <div className="bg-[#001830] p-2.5 rounded-xl border border-[#003B73] text-[11px] text-slate-300 flex items-center justify-between">
                  <span>📍 Tọa độ GPS tự động: <b>21.8215°N, 104.0520°E</b></span>
                  <span className="text-emerald-400 font-bold">Sai số: ±3m</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSupportModal(false)}
                    className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
                  >
                    Phát Tín Hiệu Yêu Cầu Chi Viện
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
