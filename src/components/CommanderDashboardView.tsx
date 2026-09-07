import React, { useState } from 'react';
import {
  Crown,
  AlertOctagon,
  Flame,
  Users,
  Home,
  GraduationCap,
  HeartPulse,
  Route,
  CheckCircle2,
  Clock,
  Send,
  Radio,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  MapPin,
  Compass,
  FileText,
  AlertTriangle,
  Building,
  PhoneCall
} from 'lucide-react';
import { DisasterIncident, MultiTierKPIs } from '../types';

interface CommanderDashboardViewProps {
  incidents: DisasterIncident[];
  kpis: MultiTierKPIs;
  onSelectIncident: (incidentId: string) => void;
  onOpenIncidentWorkspace: (incidentId: string) => void;
  onApproveOrder?: (incidentId: string, orderId: string) => void;
  onOpenBroadcastModal?: () => void;
  onOpenReportModal?: () => void;
}

export const CommanderDashboardView: React.FC<CommanderDashboardViewProps> = ({
  incidents,
  kpis,
  onSelectIncident,
  onOpenIncidentWorkspace,
  onApproveOrder,
  onOpenBroadcastModal,
  onOpenReportModal
}) => {
  const [approvedOrders, setApprovedOrders] = useState<Record<string, boolean>>({});

  const handleApprove = (incidentId: string, orderId: string, title: string) => {
    setApprovedOrders((prev) => ({ ...prev, [orderId]: true }));
    if (onApproveOrder) onApproveOrder(incidentId, orderId);
  };

  // Top critical incidents requiring decisions
  const criticalIncidents = incidents.filter((inc) => inc.level >= 4);

  return (
    <div className="bg-[#001D3D] text-white p-4 space-y-5 rounded-2xl border border-[#004B87] shadow-2xl">
      {/* Top Banner: Commander Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#002B54] via-[#003B73] to-[#002B54] p-4 rounded-xl border border-[#F5B400]/60 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#F5B400] text-slate-950 flex items-center justify-center font-extrabold shadow-md">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F5B400]">
                Trung Tâm Chỉ Huy Tác Chiến & Ra Quyết Định Cấp Tỉnh
              </span>
              <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                TRẠNG THÁI KHẨN CẤP
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white">
              Bảng Chỉ Huy & Phê Duyệt Lệnh Ứng Phó Thiên Tai
            </h1>
          </div>
        </div>

        {/* Quick Command Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {onOpenBroadcastModal && (
            <button
              onClick={onOpenBroadcastModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#D71920] to-[#E63946] hover:brightness-110 text-white text-xs font-bold shadow-lg transition"
            >
              <Radio className="w-4 h-4 text-[#FFE066] animate-pulse" />
              <span>Phát Điện Khẩn Toàn Tỉnh</span>
            </button>
          )}

          {onOpenReportModal && (
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#004B87] hover:bg-[#005BAC] text-sky-100 text-xs font-bold border border-[#00A6D6]/40 shadow transition"
            >
              <FileText className="w-4 h-4 text-[#F5B400]" />
              <span>Xuất Báo Cáo Ban Chỉ Huy</span>
            </button>
          )}
        </div>
      </div>

      {/* TOP STATS: SITUATION OVERVIEW AT A GLANCE */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Stat 1: Khẩn Cấp */}
        <div className="bg-[#002B54] border border-rose-600/70 p-3 rounded-xl shadow">
          <div className="flex items-center justify-between text-xs text-rose-300 font-semibold mb-1">
            <span>Sự Cố Cấp 5</span>
            <AlertOctagon className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{kpis.commander.criticalIncidentsCount}</div>
          <div className="text-[11px] text-rose-200 mt-0.5">Yêu cầu sơ tán dân ngay</div>
        </div>

        {/* Stat 2: Nguy Cơ Cao */}
        <div className="bg-[#002B54] border border-amber-500/70 p-3 rounded-xl shadow">
          <div className="flex items-center justify-between text-xs text-amber-300 font-semibold mb-1">
            <span>Nguy Cơ Cấp 4</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{kpis.commander.highRiskZonesCount}</div>
          <div className="text-[11px] text-amber-200 mt-0.5">Sẵn sàng lực lượng 4 tại chỗ</div>
        </div>

        {/* Stat 3: Dân Cư Nguy Cơ */}
        <div className="bg-[#002B54] border border-[#005BAC] p-3 rounded-xl shadow">
          <div className="flex items-center justify-between text-xs text-sky-300 font-semibold mb-1">
            <span>Người Dân Nguy Cơ</span>
            <Users className="w-4 h-4 text-[#F5B400]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {kpis.commander.totalExposedPopulation.toLocaleString()}
          </div>
          <div className="text-[11px] text-sky-200 mt-0.5">{kpis.commander.totalExposedHouseholds} hộ gia đình</div>
        </div>

        {/* Stat 4: Trường Học & Y Tế */}
        <div className="bg-[#002B54] border border-[#005BAC] p-3 rounded-xl shadow">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-1">
            <span>Trường Học & Trạm Y Tế</span>
            <GraduationCap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {kpis.commander.schoolsAtRisk} / {kpis.commander.clinicsAtRisk}
          </div>
          <div className="text-[11px] text-emerald-200 mt-0.5">Đã cho học sinh nghỉ học</div>
        </div>

        {/* Stat 5: Tuyến Đường Bị Chia Cắt */}
        <div className="bg-[#002B54] border border-rose-500/50 p-3 rounded-xl shadow">
          <div className="flex items-center justify-between text-xs text-rose-300 font-semibold mb-1">
            <span>Điểm Chia Cắt Đường</span>
            <Route className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{kpis.commander.severedRoadsCount}</div>
          <div className="text-[11px] text-rose-200 mt-0.5">QL32, ĐT.109, QL7A</div>
        </div>

        {/* Stat 6: Vấn đề Cần Quyết Định */}
        <div className="bg-gradient-to-br from-[#003B73] to-amber-950/60 border border-[#F5B400] p-3 rounded-xl shadow">
          <div className="flex items-center justify-between text-xs text-amber-300 font-semibold mb-1">
            <span>Cần Ra Quyết Định</span>
            <Sparkles className="w-4 h-4 text-[#F5B400] animate-pulse" />
          </div>
          <div className="text-2xl font-black text-[#F5B400] font-mono">{kpis.commander.pendingDecisionsCount}</div>
          <div className="text-[11px] text-amber-200 mt-0.5">Chờ Chủ tịch phê duyệt</div>
        </div>
      </div>

      {/* CORE SECTION: MATTERS REQUIRING COMMANDER'S DECISION */}
      <div className="bg-[#002244] border border-[#005BAC] rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#004B87] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
            <h2 className="text-base font-extrabold text-[#F5B400] uppercase tracking-wide">
              Trọng Tâm Tác Chiến: 03 Vấn Đề Lãnh Đạo Cần Xem Xét & Ra Quyết Định
            </h2>
          </div>
          <span className="text-xs text-sky-300 font-mono bg-[#001830] px-2.5 py-1 rounded-lg border border-[#003B73]">
            Ưu tiên giải quyết theo thời gian đếm ngược (Countdown)
          </span>
        </div>

        <div className="space-y-3">
          {criticalIncidents.map((incident, idx) => {
            const hasApproved = approvedOrders[incident.id] || false;

            return (
              <div
                key={incident.id}
                className={`p-4 rounded-xl border transition-all ${
                  incident.level === 5
                    ? 'bg-[#002B54] border-rose-600 shadow-rose-950/30'
                    : 'bg-[#00264d] border-[#005BAC]'
                } shadow-lg space-y-3`}
              >
                {/* Row 1: Header of Decision Item */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-rose-600 text-white font-black flex items-center justify-center text-xs">
                      0{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white">{incident.name}</span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                            incident.level === 5 ? 'bg-purple-600 text-white' : 'bg-red-600 text-white'
                          }`}
                        >
                          CẤP {incident.level}
                        </span>
                      </div>
                      <div className="text-xs text-sky-300 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#F5B400]" />
                        <span>
                          {incident.specificLocation} — <b>{incident.districtName}, {incident.provinceName}</b>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Countdown Box */}
                  <div className="flex items-center gap-2 bg-[#001830] border border-rose-500/60 px-3 py-1.5 rounded-xl font-mono text-xs">
                    <Clock className="w-4 h-4 text-rose-400 animate-pulse" />
                    <div>
                      <div className="text-[10px] text-slate-400">Thời gian đến ngưỡng:</div>
                      <div className="font-bold text-rose-300">
                        {Math.floor(incident.timeToCriticalThresholdMinutes / 60)}h{' '}
                        {incident.timeToCriticalThresholdMinutes % 60}m
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Impact Summary & Exposure Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#001D3D] p-3 rounded-lg border border-[#003B73] text-xs">
                  <div>
                    <span className="text-slate-400">Dân cư nguy cơ:</span>
                    <div className="font-bold text-[#F5B400] text-sm">
                      {incident.impact.exposedPopulation} người ({incident.impact.exposedHouseholds} hộ)
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Tuyến giao thông:</span>
                    <div className="font-bold text-rose-300 text-xs truncate">
                      {incident.impact.blockedRoadNames[0] || 'Chưa ghi nhận'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Xác suất AI:</span>
                    <div className="font-bold text-cyan-300 text-sm">
                      {incident.riskScorePercent}% (Tin cậy {incident.confidencePercent}%)
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Điểm sơ tán sẵn sàng:</span>
                    <div className="font-bold text-emerald-300 text-xs">
                      {incident.shelters[0]?.name || 'Trường THCS La Pán Tẩn'}
                    </div>
                  </div>
                </div>

                {/* Row 3: Decision Prompt (Quyết định cần xem xét) */}
                <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/50 text-xs text-amber-200 space-y-1">
                  <div className="font-bold text-[#F5B400] flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-[#F5B400]" />
                    <span>NỘI DUNG LÃNH ĐẠO CẦN RA QUYẾT ĐỊNH NGAY:</span>
                  </div>
                  <p className="leading-relaxed">{incident.decisionRequired}</p>
                </div>

                {/* Row 4: Action Buttons for Leaders */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    {/* Approve Evacuation Order */}
                    <button
                      onClick={() => handleApprove(incident.id, 'ORD-01', incident.name)}
                      disabled={hasApproved}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition ${
                        hasApproved
                          ? 'bg-emerald-700 text-white cursor-default'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white'
                      }`}
                    >
                      <FileCheck className="w-4 h-4 text-emerald-200" />
                      <span>{hasApproved ? '✓ Đã Phê Duyệt Lệnh Sơ Tán' : 'Phê Duyệt Lệnh Sơ Tán Khẩn Cấp'}</span>
                    </button>

                    {/* Blockade road command */}
                    <button
                      onClick={() => handleApprove(incident.id, 'ORD-02', incident.name)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#003B73] hover:bg-[#004B87] border border-[#005BAC] text-sky-100 text-xs font-bold transition"
                    >
                      <Route className="w-4 h-4 text-amber-400" />
                      <span>Lệnh Cấm Đường & Phân Luồng</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Incident Lifecycle / Workspace */}
                    <button
                      onClick={() => onOpenIncidentWorkspace(incident.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-rose-700 to-purple-700 hover:brightness-110 text-white text-xs font-bold shadow transition"
                    >
                      <span>Mở Hồ Sơ Tác Chiến Sự Cố</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
