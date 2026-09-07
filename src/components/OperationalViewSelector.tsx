import React from 'react';
import {
  Crown,
  Crosshair,
  ShieldAlert,
  MapPin,
  Building2,
  Globe2,
  ChevronDown,
  UserCheck,
  Radio,
  Clock,
  Layers,
  Filter
} from 'lucide-react';
import { OperationalViewMode, UserRole } from '../types';
import { VIETNAM_PROVINCES } from '../data/provinces';

interface OperationalViewSelectorProps {
  currentViewMode: OperationalViewMode;
  onChangeViewMode: (mode: OperationalViewMode) => void;
  selectedProvince: string;
  onChangeProvince: (provId: string) => void;
  selectedIncidentCode?: string;
  currentUserRole?: UserRole;
}

export const OperationalViewSelector: React.FC<OperationalViewSelectorProps> = ({
  currentViewMode,
  onChangeViewMode,
  selectedProvince,
  onChangeProvince,
  selectedIncidentCode,
  currentUserRole = 'SUPER_ADMIN'
}) => {
  const activeProvObj = VIETNAM_PROVINCES.find((p) => p.id === selectedProvince) || null;

  return (
    <div className="bg-[#002244] border-b border-[#004B87] px-3 sm:px-4 py-2 text-white shadow-md">
      <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: 4-Tier Operational Roles / Views */}
        <div className="flex items-center gap-1.5 bg-[#001830] p-1 rounded-xl border border-[#003B73]">
          <span className="text-[10px] font-bold text-[#F5B400] px-2 uppercase tracking-wider hidden lg:inline">
            Góc Nhìn Tác Chiến:
          </span>

          {/* 1. Commander View (Lãnh đạo Tỉnh) */}
          <button
            onClick={() => onChangeViewMode('COMMANDER')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentViewMode === 'COMMANDER'
                ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 shadow-md ring-1 ring-amber-300'
                : 'text-sky-200 hover:text-white hover:bg-[#002B54]'
            }`}
            title="Dành cho Lãnh đạo Tỉnh & Ban Chỉ huy: Nắm toàn cảnh, xác định ưu tiên, phê duyệt lệnh sơ tán"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Chỉ Huy Tỉnh</span>
          </button>

          {/* 2. Operation View (Phòng Ban Tác Nghiệp) */}
          <button
            onClick={() => onChangeViewMode('OPERATION')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentViewMode === 'OPERATION'
                ? 'bg-[#005BAC] text-white shadow-md ring-1 ring-sky-300'
                : 'text-sky-200 hover:text-white hover:bg-[#002B54]'
            }`}
            title="Dành cho Trực ban & Cán bộ chuyên môn: Radar, Trạm KTTV, AI Risk, Điều phối nhiệm vụ"
          >
            <Crosshair className="w-3.5 h-3.5 text-[#F5B400]" />
            <span>Tác Nghiệp & Phân Tích</span>
          </button>

          {/* 3. Field View (Cấp Xã & Hiện Trường) */}
          <button
            onClick={() => onChangeViewMode('FIELD')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentViewMode === 'FIELD'
                ? 'bg-emerald-600 text-white shadow-md ring-1 ring-emerald-300'
                : 'text-sky-200 hover:text-white hover:bg-[#002B54]'
            }`}
            title="Dành cho Cán bộ Xã, Đội Xung Kích: Nhận nhiệm vụ, báo cáo ảnh/GPS, yêu cầu chi viện"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-300" />
            <span>Hiện Trường Cấp Xã</span>
          </button>

          {/* 4. Incident View (Hồ Sơ Điểm Sự Cố) */}
          <button
            onClick={() => onChangeViewMode('INCIDENT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentViewMode === 'INCIDENT'
                ? 'bg-rose-600 text-white shadow-md ring-1 ring-rose-300 animate-pulse'
                : 'text-sky-200 hover:text-white hover:bg-[#002B54]'
            }`}
            title="Xem hồ sơ chi tiết vòng đời xử lý sự cố cụ thể từ phát hiện đến hoàn thành"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-300" />
            <span>Hồ Sơ Sự Cố {selectedIncidentCode ? `(${selectedIncidentCode})` : ''}</span>
          </button>
        </div>

        {/* Right: Geographic Operational Scope Selector */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 bg-[#001830] px-2.5 py-1 rounded-xl border border-[#003B73]">
            <Globe2 className="w-3.5 h-3.5 text-[#F5B400]" />
            <span className="text-sky-300 font-semibold text-[11px]">Địa Bàn Tác Chiến:</span>
            <select
              value={selectedProvince}
              onChange={(e) => onChangeProvince(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer max-w-[200px] truncate"
            >
              <option value="ALL" className="bg-[#002244] text-white">
                🌐 Toàn Quốc (Toàn Bộ Tỉnh / Thành Phố Trực Thuộc TW)
              </option>
              {VIETNAM_PROVINCES.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#001D3D] text-white">
                  📍 {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Operational Paradigm Indicator: Observe -> Predict -> Assess -> Act -> Learn */}
          <div className="hidden xl:flex items-center gap-1 text-[10px] text-sky-300 font-mono bg-[#001830] px-2.5 py-1 rounded-xl border border-[#003B73]">
            <span className="text-emerald-400 font-bold">QUAN SÁT</span>
            <span>→</span>
            <span className="text-cyan-400 font-bold">DỰ BÁO</span>
            <span>→</span>
            <span className="text-amber-400 font-bold">TÁC ĐỘNG</span>
            <span>→</span>
            <span className="text-rose-400 font-bold">TÁC CHIẾN</span>
            <span>→</span>
            <span className="text-purple-400 font-bold">HẬU KIỂM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
