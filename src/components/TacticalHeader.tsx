import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Droplets,
  CloudRain,
  AlertTriangle,
  Shield,
  FileText,
  Sparkles,
  LogOut,
  ChevronDown,
  User,
  Settings,
  Globe2,
  Home,
  Server
} from 'lucide-react';
import { HvuBrandEmblem } from './HvuBrandEmblem';

interface TacticalHeaderProps {
  activeTab: 'OVERVIEW' | 'SENSORS' | 'FORECAST' | 'ALERTS' | 'RESPONSE' | 'REPORTS' | 'AI';
  onSelectTab: (tab: 'OVERVIEW' | 'SENSORS' | 'FORECAST' | 'ALERTS' | 'RESPONSE' | 'REPORTS' | 'AI') => void;
  currentUser?: any;
  onLogout?: () => void;
  onNavigatePortal?: () => void;
  onNavigateAdmin?: () => void;
  onOpenCopilot?: () => void;
  onOpenReport?: () => void;
  onOpenTyphoon?: () => void;
  onOpenRadar?: () => void;
  onOpenBroadcast?: () => void;
  onOpenLstm?: () => void;
  onOpenEarthAi?: () => void;
  onOpenGlobalDisaster?: () => void;
  onOpenWeatherNext?: () => void;
}

export const TacticalHeader: React.FC<TacticalHeaderProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onLogout,
  onNavigatePortal,
  onNavigateAdmin,
  onOpenCopilot,
  onOpenReport,
  onOpenTyphoon,
  onOpenRadar,
  onOpenBroadcast,
  onOpenLstm,
  onOpenEarthAi,
  onOpenGlobalDisaster,
  onOpenWeatherNext
}) => {
  const [timeStr, setTimeStr] = useState<string>('22:26:31');
  const [dateStr, setDateStr] = useState<string>('Thứ Năm, 21/08/2026');
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      );
      const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = days[now.getDay()];
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      setDateStr(`${dayName}, ${day}/${month}/${year}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userName = currentUser?.full_name || 'Nguyễn Văn A';
  const userRole = currentUser?.role_label || 'Trưởng ban PCTT';

  return (
    <header className="bg-gradient-to-r from-[#071326] via-[#0b1e38] to-[#071326] border-b border-sky-900/60 text-white select-none sticky top-0 z-50 px-3 py-2 shadow-xl shadow-slate-950/40">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* LEFT: HAEWS-HVU BRAND & TITLE */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={onNavigatePortal}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition group"
            title="Về Cổng thông tin dân sự"
          >
            <HvuBrandEmblem size="sm" variant="dark" showText={true} />
          </div>

          <div className="h-8 w-px bg-sky-900/60 hidden md:block mx-1" />

          <div className="hidden md:block leading-tight">
            <div className="font-extrabold text-sm text-white tracking-wide uppercase flex items-center gap-2">
              <span>BẢN ĐỒ TÁC CHIẾN</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/40">GIS CHỈ HUY</span>
            </div>
            <div className="text-[10px] text-sky-200/70 font-medium">
              Giám sát đa chiều lũ quét, sạt lở đất & khí tượng thủy văn
            </div>
          </div>
        </div>

        {/* CENTER: NAV TABS */}
        <div className="flex items-center bg-[#071326]/90 p-1 rounded-xl border border-sky-800/50 text-xs font-bold gap-0.5 overflow-x-auto max-w-full backdrop-blur-md">
          {/* TỔNG QUAN */}
          <button
            onClick={() => onSelectTab('OVERVIEW')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'OVERVIEW'
                ? 'bg-gradient-to-r from-[#005BAC] to-[#0078D4] text-white shadow font-black border border-sky-400'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#F5B400]" />
            <span>TỔNG QUAN</span>
          </button>

          {/* QUAN TRẮC */}
          <button
            onClick={() => onSelectTab('SENSORS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'SENSORS'
                ? 'bg-gradient-to-r from-[#005BAC] to-[#0078D4] text-white shadow font-black border border-sky-400'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title="Trung tâm Quan trắc Khí tượng Thủy văn & 110 trạm đo"
          >
            <Droplets className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">QUAN TRẮC KTTV</span>
          </button>

          {/* DỰ BÁO */}
          <button
            onClick={() => onSelectTab('FORECAST')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'FORECAST'
                ? 'bg-gradient-to-r from-[#005BAC] to-[#0078D4] text-white shadow font-black border border-sky-400'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title="Đài Quan sát Radar Doppler & Bão Biển Đông"
          >
            <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">RADAR & BÃO</span>
          </button>

          {/* ĐIỀU HÀNH & CỨU HỘ */}
          <button
            onClick={() => onSelectTab('RESPONSE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'RESPONSE' || activeTab === 'ALERTS'
                ? 'bg-gradient-to-r from-[#005BAC] to-[#0078D4] text-white shadow font-black border border-sky-400'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title="Điều hành tác chiến, ứng cứu & sơ tán"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">ĐIỀU HÀNH CỨU HỘ</span>
          </button>

          {/* BÁO CÁO & AI */}
          <button
            onClick={() => onSelectTab('REPORTS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'REPORTS' || activeTab === 'AI'
                ? 'bg-gradient-to-r from-[#005BAC] to-[#0078D4] text-white shadow font-black border border-sky-400'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title="Bản tin tình hình, Tình báo toàn cầu & Gemini AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">BÁO CÁO & AI</span>
          </button>

          {/* TÌNH BÁO QUỐC TẾ */}
          {onOpenGlobalDisaster && (
            <button
              onClick={onOpenGlobalDisaster}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 font-bold shadow"
              title="Trung tâm Tình báo Thiên tai & Sạt lở Toàn cầu (NASA EONET / USGS / GDACS)"
            >
              <Globe2 className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span className="hidden md:inline">QUỐC TẾ</span>
            </button>
          )}

          {/* GOOGLE WEATHERNEXT 3 AI */}
          {onOpenWeatherNext && (
            <button
              onClick={onOpenWeatherNext}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap bg-gradient-to-r from-teal-950/80 via-cyan-950/80 to-blue-950/80 hover:from-teal-900/90 hover:to-cyan-900/90 text-cyan-200 border border-cyan-400/50 font-bold shadow group"
              title="Google DeepMind WeatherNext 3 (Dự báo Khí tượng 5km, Gió 100m & Phương án A)"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span className="hidden md:inline">WEATHERNEXT 3</span>
              <span className="text-[10px] px-1 py-0.2 bg-cyan-500/30 text-cyan-200 rounded font-mono border border-cyan-400/40">5km</span>
            </button>
          )}
        </div>

        {/* RIGHT: CLOCK & USER PROFILE */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Digital Clock */}
          <div className="text-right hidden sm:block">
            <div className="font-mono font-black text-sm text-white tracking-wider">
              {timeStr}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {dateStr}
            </div>
          </div>

          {/* User Profile Badge with dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-[#061224] hover:bg-[#0a1e38] border border-[#0f2744] transition shadow group"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[#005BAC] border border-sky-400 flex items-center justify-center font-bold text-xs text-white">
                  {userName.charAt(0)}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#030813]"></span>
              </div>

              <div className="text-left hidden lg:block leading-tight">
                <div className="font-bold text-xs text-white group-hover:text-[#F5B400] transition">
                  {userName}
                </div>
                <div className="text-[10px] text-slate-400">
                  {userRole}
                </div>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#061224] border border-[#0f2744] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 text-xs text-slate-200">
                <div className="p-2 border-b border-[#0f2744] mb-1">
                  <div className="font-bold text-white">{userName}</div>
                  <div className="text-[10px] text-sky-400">{userRole}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">ID: TK-PCTT-2026</div>
                </div>

                {onNavigatePortal && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigatePortal();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition"
                  >
                    <Home className="w-4 h-4 text-[#F5B400]" />
                    <span>Cổng Thông Tin Dân Sự</span>
                  </button>
                )}

                {onNavigateAdmin && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigateAdmin();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition"
                  >
                    <Server className="w-4 h-4 text-sky-400" />
                    <span>Quản Trị Hệ Thống</span>
                  </button>
                )}

                {onLogout && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/20 text-rose-300 text-left transition mt-1 border-t border-[#0f2744] pt-2"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Đăng Xuất Khỏi Trực Ban</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
