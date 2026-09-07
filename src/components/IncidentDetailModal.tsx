import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Flame,
  ShieldCheck,
  AlertTriangle,
  Users,
  Home,
  GraduationCap,
  HeartPulse,
  Route,
  Sparkles,
  Layers,
  FileCheck,
  CheckCircle2,
  PhoneCall,
  Download,
  Share2,
  Printer,
  ChevronRight,
  HelpCircle,
  Building,
  CheckSquare
} from 'lucide-react';
import { DisasterIncident, IncidentLifecycleStatus } from '../types';

interface IncidentDetailModalProps {
  incident: DisasterIncident | null;
  onClose: () => void;
  onApproveOrder?: (incidentId: string, orderId: string) => void;
}

const LIFECYCLE_STEPS: { stage: IncidentLifecycleStatus; label: string; desc: string }[] = [
  { stage: 'DETECTED', label: '1. Phát Hiện', desc: 'Trạm KTTV / AI phát hiện bất thường' },
  { stage: 'AI_ANALYZED', label: '2. AI Phân Tích', desc: 'Ensemble XGBoost chấm điểm & giải thích' },
  { stage: 'VERIFIED', label: '3. Xác Minh', desc: 'Trực ban & cơ sở xác minh thực địa' },
  { stage: 'ALERT_ISSUED', label: '4. Ban Hành Lệnh', desc: 'Phát thanh, còi hú, công điện khẩn' },
  { stage: 'TASK_DISPATCHED', label: '5. Giao Việc', desc: 'Phân bổ 4 tại chỗ cho công an, quân sự' },
  { stage: 'RESPONDING', label: '6. Ứng Phó', desc: 'Đang triển khai sơ tán & chốt chặn' },
  { stage: 'RESOLVED', label: '7. Hoàn Thành', desc: 'Khu vực an toàn, hoàn tất xử lý' },
  { stage: 'POST_AUDITED', label: '8. Hậu Kiểm', desc: 'Tua lại timeline, đánh giá rút kinh nghiệm' }
];

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  onClose,
  onApproveOrder
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EXPLAINABLE_AI' | 'IMPACT_SHELTERS' | 'TASKS_ORDERS' | 'AUDIT_TIMELINE'>('OVERVIEW');

  if (!incident) return null;

  const currentStepIdx = LIFECYCLE_STEPS.findIndex((s) => s.stage === incident.status);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#001D3D] border-2 border-[#005BAC] rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl text-white overflow-hidden animate-in zoom-in-95">
        {/* MODAL HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#002B54] via-[#003B73] to-[#002B54] px-5 py-3.5 border-b border-[#005BAC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D71920] text-white flex items-center justify-center font-extrabold shadow">
              <Flame className="w-5 h-5 text-[#F5B400] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#001830] text-[#F5B400] font-mono text-xs font-bold px-2 py-0.5 rounded border border-[#004B87]">
                  {incident.incidentCode}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                    incident.level >= 5 ? 'bg-purple-600 text-white' : 'bg-red-600 text-white'
                  }`}
                >
                  CẤP ĐỘ RỦI RO {incident.level}
                </span>
                <span className="text-xs text-sky-200 font-mono">
                  Xác suất: <b>{incident.riskScorePercent}%</b> (Tin cậy <b>{incident.confidencePercent}%</b>)
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5">{incident.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-[#002B54] hover:bg-[#004B87] text-sky-200 hover:text-white transition text-xs flex items-center gap-1"
              title="In Báo Cáo Sự Cố Tác Chiến"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#002B54] hover:bg-[#004B87] text-sky-200 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* INCIDENT LIFECYCLE PROGRESS BAR (8 STEPS) */}
        <div className="bg-[#001830] px-4 py-3 border-b border-[#003B73] overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] gap-2">
            {LIFECYCLE_STEPS.map((step, idx) => {
              const isPast = idx <= (currentStepIdx === -1 ? 5 : currentStepIdx);
              const isCurrent = idx === (currentStepIdx === -1 ? 5 : currentStepIdx);

              return (
                <div key={step.stage} className="flex-1 flex flex-col items-center relative text-center">
                  {/* Connecting line */}
                  {idx > 0 && (
                    <div
                      className={`absolute top-3 right-1/2 w-full h-0.5 -z-0 ${
                        isPast ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    />
                  )}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition ${
                      isCurrent
                        ? 'bg-[#F5B400] text-slate-950 ring-4 ring-amber-500/40 shadow-lg animate-pulse'
                        : isPast
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-1 whitespace-nowrap ${
                      isCurrent ? 'text-[#F5B400]' : isPast ? 'text-emerald-300' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex items-center gap-1 bg-[#002244] px-4 py-2 border-b border-[#004B87] text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'OVERVIEW'
                ? 'bg-[#005BAC] text-white shadow ring-1 ring-sky-300'
                : 'text-sky-200 hover:bg-[#003B73]'
            }`}
          >
            Tổng Quan Tác Chiến
          </button>
          <button
            onClick={() => setActiveTab('EXPLAINABLE_AI')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'EXPLAINABLE_AI'
                ? 'bg-purple-600 text-white shadow ring-1 ring-purple-300'
                : 'text-purple-200 hover:bg-[#003B73]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>AI Giải Thích Nguyên Nhân</span>
          </button>
          <button
            onClick={() => setActiveTab('IMPACT_SHELTERS')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'IMPACT_SHELTERS'
                ? 'bg-amber-600 text-white shadow ring-1 ring-amber-300'
                : 'text-amber-200 hover:bg-[#003B73]'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-300" />
            <span>Đánh Giá Tác Động & Điểm Sơ Tán</span>
          </button>
          <button
            onClick={() => setActiveTab('TASKS_ORDERS')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'TASKS_ORDERS'
                ? 'bg-emerald-600 text-white shadow ring-1 ring-emerald-300'
                : 'text-emerald-200 hover:bg-[#003B73]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-300" />
            <span>Lệnh & Nhiệm Vụ ({incident.tasks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('AUDIT_TIMELINE')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'AUDIT_TIMELINE'
                ? 'bg-cyan-600 text-white shadow ring-1 ring-cyan-300'
                : 'text-cyan-200 hover:bg-[#003B73]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-cyan-300" />
            <span>Nhật Ký Tác Chiến (Audit)</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-4">
              {/* Countdown & Recommendation Box */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#002B54] border border-rose-600 p-4 rounded-2xl shadow-lg flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-rose-300 font-semibold uppercase tracking-wider">
                      Thời Gian Đến Ngưỡng Nguy Hiểm
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1 flex items-center gap-2">
                      <Clock className="w-7 h-7 text-rose-400 animate-pulse" />
                      <span>
                        {Math.floor(incident.timeToCriticalThresholdMinutes / 60)}h{' '}
                        {incident.timeToCriticalThresholdMinutes % 60}m
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-rose-200 mt-2">{incident.leadTimeStatus}</p>
                </div>

                <div className="md:col-span-2 bg-[#002B54] border border-purple-500/70 p-4 rounded-2xl shadow-lg space-y-2">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
                    <span>Khuyến Nghị Hành Động Của AI Tác Chiến</span>
                  </div>
                  <p className="text-xs text-purple-100 leading-relaxed bg-[#001D3D] p-3 rounded-xl border border-purple-500/40 font-medium">
                    {incident.aiRecommendation}
                  </p>
                </div>
              </div>

              {/* Matters Requiring Leader's Decision */}
              <div className="bg-amber-950/50 border border-[#F5B400] p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-[#F5B400] font-extrabold text-xs uppercase">
                  <AlertTriangle className="w-4 h-4 text-[#F5B400]" />
                  <span>Vấn Đề Trọng Tâm Lãnh Đạo Cần Quyết Định:</span>
                </div>
                <p className="text-xs text-amber-100 font-semibold leading-relaxed">
                  {incident.decisionRequired}
                </p>
              </div>

              {/* Geographic Scope & Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#002B54] p-3 rounded-xl border border-[#004B87]">
                  <span className="text-slate-400">Địa bàn:</span>
                  <div className="font-bold text-white mt-0.5">{incident.districtName}, {incident.provinceName}</div>
                </div>
                <div className="bg-[#002B54] p-3 rounded-xl border border-[#004B87]">
                  <span className="text-slate-400">Dân cư nguy cơ:</span>
                  <div className="font-bold text-[#F5B400] mt-0.5">
                    {incident.impact.exposedPopulation} người ({incident.impact.exposedHouseholds} hộ)
                  </div>
                </div>
                <div className="bg-[#002B54] p-3 rounded-xl border border-[#004B87]">
                  <span className="text-slate-400">Hạ tầng trường học:</span>
                  <div className="font-bold text-emerald-300 mt-0.5">{incident.impact.schoolsCount} điểm trường</div>
                </div>
                <div className="bg-[#002B54] p-3 rounded-xl border border-[#004B87]">
                  <span className="text-slate-400">Diện tích ảnh hưởng:</span>
                  <div className="font-bold text-cyan-300 mt-0.5">{incident.impact.affectedAreaKm2} km²</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPLAINABLE AI */}
          {activeTab === 'EXPLAINABLE_AI' && (
            <div className="space-y-4">
              <div className="bg-[#002B54] p-4 rounded-2xl border border-purple-500/60 space-y-3">
                <div className="flex items-center justify-between border-b border-[#004B87] pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-extrabold text-purple-200 uppercase">
                      Mô Hình AI Giải Thích Trọng Số & Nguyên Nhân Kích Hoạt
                    </h3>
                  </div>
                  <span className="text-xs text-purple-300 font-mono">Ensemble: XGBoost + Random Forest + Physical Rules</span>
                </div>

                <div className="space-y-3">
                  {incident.explainableFactors.map((factor) => (
                    <div key={factor.key} className="bg-[#001D3D] p-3 rounded-xl border border-[#003B73] space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-bold text-white">
                          <span>{factor.name}</span>
                          <span className="bg-[#002B54] text-sky-200 px-2 py-0.5 rounded font-mono text-[11px] border border-[#004B87]">
                            {factor.value} {factor.unit || ''}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-[#F5B400]">Đóng góp: {factor.scorePercent}%</span>
                      </div>

                      {/* Percentage Bar */}
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            factor.contribution === 'VERY_HIGH'
                              ? 'bg-rose-500'
                              : factor.contribution === 'HIGH'
                              ? 'bg-amber-500'
                              : 'bg-sky-500'
                          }`}
                          style={{ width: `${factor.scorePercent}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-slate-300 italic">{factor.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IMPACT & SHELTERS */}
          {activeTab === 'IMPACT_SHELTERS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Evacuation Shelters */}
                <div className="bg-[#002B54] p-4 rounded-2xl border border-emerald-500/60 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase border-b border-[#004B87] pb-2">
                    <Building className="w-4 h-4 text-emerald-400" />
                    <span>Điểm Sơ Tán An Toàn ({incident.shelters.length})</span>
                  </div>

                  <div className="space-y-2.5">
                    {incident.shelters.map((shelter) => (
                      <div key={shelter.id} className="bg-[#001D3D] p-3 rounded-xl border border-[#003B73] text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{shelter.name}</span>
                          <span className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-600">
                            {shelter.currentOccupants}/{shelter.capacityPeople} người
                          </span>
                        </div>
                        <div className="text-slate-400">
                          Khoảng cách: <b>{shelter.distanceKmFromHazard} km</b> | Liên hệ: <b>{shelter.contactPerson}</b> ({shelter.contactPhone})
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-sky-200">
                          <span>⚡ Máy phát điện: {shelter.facilities.powerGenerator ? '✓ Có' : '✗ Không'}</span>
                          <span>💧 Nước sạch: {shelter.facilities.cleanWaterSupply ? '✓ Đầy' : '✗ Không'}</span>
                          <span>🍞 Lương thực: {shelter.facilities.foodRationsDays} ngày</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safe Routes */}
                <div className="bg-[#002B54] p-4 rounded-2xl border border-amber-500/60 space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase border-b border-[#004B87] pb-2">
                    <Route className="w-4 h-4 text-amber-400" />
                    <span>Tuyến Đường Di Chuyển An Toàn</span>
                  </div>

                  <div className="space-y-2.5">
                    {incident.safeRoutes.map((route) => (
                      <div key={route.id} className="bg-[#001D3D] p-3 rounded-xl border border-[#003B73] text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{route.fromArea} → {route.toShelterName}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              route.status === 'SAFE' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-slate-950'
                            }`}
                          >
                            {route.status === 'SAFE' ? 'AN TOÀN' : 'CẢNH BÁO'}
                          </span>
                        </div>
                        <div className="text-slate-300">
                          Khoảng cách: <b>{route.distanceKm} km</b> (~{route.estimatedTravelMinutes} phút)
                        </div>
                        {route.chokePoints.length > 0 && (
                          <div className="text-amber-200 text-[11px]">
                            ⚠️ Điểm nghẽn: {route.chokePoints.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TASKS & ORDERS */}
          {activeTab === 'TASKS_ORDERS' && (
            <div className="space-y-4">
              {/* Tactical Orders */}
              <div className="bg-[#002B54] p-4 rounded-2xl border border-rose-600 space-y-3">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase border-b border-[#004B87] pb-2">
                  <FileCheck className="w-4 h-4 text-rose-400" />
                  <span>Lệnh Tác Chiến & Công Điện Đã Ban Hành ({incident.tacticalOrders.length})</span>
                </div>

                <div className="space-y-2">
                  {incident.tacticalOrders.map((ord) => (
                    <div key={ord.id} className="bg-[#001D3D] p-3 rounded-xl border border-[#003B73] text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#F5B400]">{ord.orderNumber}: {ord.title}</span>
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{ord.content}</p>
                      <div className="text-slate-400 text-[10px]">
                        Người ký: <b>{ord.issuedBy}</b> ({ord.issuedByRole}) lúc {ord.issuedAt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks Checklist */}
              <div className="bg-[#002B54] p-4 rounded-2xl border border-[#005BAC] space-y-3">
                <div className="flex items-center gap-2 text-sky-200 font-bold text-xs uppercase border-b border-[#004B87] pb-2">
                  <CheckSquare className="w-4 h-4 text-[#F5B400]" />
                  <span>Nhiệm Vụ Hiện Trường Chi Tiết ({incident.tasks.length})</span>
                </div>

                <div className="space-y-2">
                  {incident.tasks.map((task) => (
                    <div key={task.id} className="bg-[#001D3D] p-3 rounded-xl border border-[#003B73] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{task.title}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            task.status === 'COMPLETED' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                          }`}
                        >
                          {task.status === 'COMPLETED' ? 'ĐÃ HOÀN THÀNH' : 'ĐANG THỰC HIỆN'}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{task.description}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span>Đơn vị: <b>{task.assignedUnit}</b> (Phụ trách: {task.assigneeName})</span>
                        <span>Hạn chót: <b>{task.deadline}</b></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AUDIT TIMELINE */}
          {activeTab === 'AUDIT_TIMELINE' && (
            <div className="bg-[#002B54] p-4 rounded-2xl border border-cyan-500/60 space-y-3">
              <div className="flex items-center justify-between border-b border-[#004B87] pb-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Nhật Ký Tác Chiến & Vết Vết Xử Lý (Audit Trail)</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Bảo đảm minh bạch & phục vụ hậu kiểm</span>
              </div>

              <div className="space-y-3 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#005BAC]">
                {incident.timeline.map((item, idx) => (
                  <div key={idx} className="relative pl-3 space-y-0.5 text-xs">
                    <div className="absolute -left-4 top-1.5 w-2.5 h-2.5 rounded-full bg-[#F5B400] ring-2 ring-[#001D3D]" />
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-300">{item.time}</span>
                      <span className="bg-[#001830] text-sky-200 px-1.5 py-0.5 rounded text-[10px] font-bold border border-[#003B73]">
                        {item.stage}
                      </span>
                      <span className="text-slate-400 font-semibold">{item.actor}</span>
                    </div>
                    <p className="text-slate-200 text-[11px]">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
