import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Activity,
  Play,
  Sliders,
  Database,
  Layers,
  History,
  Volume2,
  VolumeX,
  Radio,
  FileSpreadsheet,
  Server,
  LayoutDashboard,
  Globe,
  Waves,
  CloudRain,
  Send,
  Share2,
  Zap,
  Globe2,
  Sparkles,
  FileText,
  User,
  LogOut,
  Home,
  Compass,
  ChevronDown,
  Menu,
  X,
  Cpu,
  Radar,
  RadioTower,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import { SystemMode } from '../types';
import { ROLE_PERMISSIONS } from '../data/auth';
import { HvuBrandEmblem } from './HvuBrandEmblem';

interface NavbarProps {
  systemMode: SystemMode;
  currentView: 'PORTAL' | 'MAP' | 'ADMIN';
  onToggleView: (view: 'PORTAL' | 'MAP' | 'ADMIN') => void;
  onSelectMode: (mode: SystemMode) => void;
  currentUser?: any;
  onLogout?: () => void;
  onOpenLoginModal?: () => void;
  onOpenCopilot?: () => void;
  onOpenReport?: () => void;
  onOpenEarthAi: () => void;
  onOpenTransboundary?: () => void;
  onOpenTyphoonTracker?: () => void;
  onOpenSevereWeather: () => void;
  onOpenLstm: () => void;
  onOpenRadar: () => void;
  onOpenBroadcast: () => void;
  onOpenSocialSensors: () => void;
  onOpenSimulation: () => void;
  onOpenReplay: () => void;
  onOpenThresholds: () => void;
  onOpenDataQuality: () => void;
  onOpenObservability: () => void;
  onOpenGlobalDisaster?: () => void;
  onOpenWeatherNext?: () => void;
  activeWarningCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  systemMode,
  currentView,
  onToggleView,
  onSelectMode,
  currentUser,
  onLogout,
  onOpenLoginModal,
  onOpenCopilot,
  onOpenReport,
  onOpenEarthAi,
  onOpenTransboundary,
  onOpenTyphoonTracker,
  onOpenSevereWeather,
  onOpenLstm,
  onOpenRadar,
  onOpenBroadcast,
  onOpenSocialSensors,
  onOpenSimulation,
  onOpenReplay,
  onOpenThresholds,
  onOpenDataQuality,
  onOpenObservability,
  onOpenGlobalDisaster,
  onOpenWeatherNext,
  activeWarningCount
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showToolsDropdown, setShowToolsDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }) + ' (GMT+7)'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowToolsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleMeta = currentUser?.role ? ROLE_PERMISSIONS[currentUser.role as keyof typeof ROLE_PERMISSIONS] : null;

  return (
    <header className="bg-[#003B73] border-b-2 border-[#F5B400] text-white backdrop-blur sticky top-0 z-40 px-3 sm:px-4 py-2 shadow-md">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-3">
        {/* Left Branding: Official HVU & National Emblem */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => onToggleView('PORTAL')}
          title="Về Cổng Thông Tin Dân Sự HVU"
        >
          <HvuBrandEmblem size="md" variant="dark" />
        </div>

        {/* View Switcher: Portal vs GIS Map vs Admin Portal */}
        <div className="flex items-center bg-[#002B54] p-1 rounded-xl border border-[#005BAC]/80 text-xs shadow-inner">
          {/* Button Home / Portal */}
          <button
            onClick={() => onToggleView('PORTAL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              currentView === 'PORTAL'
                ? 'bg-[#005BAC] text-white shadow font-bold border border-[#00A6D6]'
                : 'text-sky-200 hover:text-white hover:bg-white/5'
            }`}
            title="Xem Cổng Thông Tin Dân Sự Công Khai"
          >
            <Home className="w-3.5 h-3.5 text-[#F5B400]" />
            <span className="hidden sm:inline">Cổng Dân Sự</span>
          </button>

          {/* Button GIS Map */}
          <button
            onClick={() => onToggleView('MAP')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              currentView === 'MAP'
                ? 'bg-gradient-to-r from-[#D71920] to-[#E63946] text-white shadow font-bold ring-1 ring-[#FFE066]'
                : 'text-sky-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#FFE066]" />
            <span>Bản đồ Tác chiến</span>
          </button>

          {/* Button Admin */}
          <button
            onClick={() => onToggleView('ADMIN')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              currentView === 'ADMIN'
                ? 'bg-[#005BAC] text-white shadow font-bold border border-[#00A6D6]'
                : 'text-sky-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span className="hidden sm:inline">Quản Trị HVU</span>
          </button>
        </div>

        {/* Center: System Mode Selector (Only on GIS MAP View) */}
        {currentView === 'MAP' && (
          <div className="hidden xl:flex items-center bg-[#002B54] p-1 rounded-xl border border-[#005BAC]/70 text-xs shadow-inner">
            <button
              onClick={() => onSelectMode('REAL_TIME')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                systemMode === 'REAL_TIME'
                  ? 'bg-emerald-600 text-white shadow ring-1 ring-emerald-400'
                  : 'text-sky-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Radio className="w-3 h-3 text-emerald-300" />
              <span>Thời gian thực</span>
            </button>
            <button
              onClick={() => onSelectMode('DEMO')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                systemMode === 'DEMO'
                  ? 'bg-amber-600 text-white shadow ring-1 ring-amber-400'
                  : 'text-sky-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-3 h-3 text-amber-300" />
              <span>Mô phỏng Demo</span>
            </button>
            <button
              onClick={() => {
                onSelectMode('HISTORICAL_REPLAY');
                onOpenReplay();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                systemMode === 'HISTORICAL_REPLAY'
                  ? 'bg-purple-600 text-white shadow ring-1 ring-purple-400'
                  : 'text-sky-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <History className="w-3 h-3 text-purple-300" />
              <span>Tua Lịch sử</span>
            </button>
          </div>
        )}

        {/* Right Tools & Tactical Actions */}
        <div className="flex items-center gap-2">
          {/* High Priority Actions in War Room */}
          {currentView === 'MAP' && (
            <>
              {/* Tình Báo Toàn Cầu / Sạt lở Quốc Tế */}
              {onOpenGlobalDisaster && (
                <button
                  onClick={onOpenGlobalDisaster}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-900 to-blue-900 hover:from-cyan-800 hover:to-blue-800 text-white border border-cyan-400/50 text-xs font-bold shadow transition group"
                  title="Trung tâm Tình báo Thiên tai & Sạt lở Toàn cầu (NASA EONET / USGS)"
                >
                  <Globe2 className="w-3.5 h-3.5 text-cyan-300 group-hover:rotate-45 transition-transform" />
                  <span className="hidden xl:inline">Tình Báo Quốc Tế</span>
                </button>
              )}

              {/* Bão Biển Đông */}
              {onOpenTyphoonTracker && (
                <button
                  onClick={onOpenTyphoonTracker}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-700 to-amber-600 hover:from-rose-600 hover:to-amber-500 text-white border border-[#FFE066]/50 text-xs font-bold shadow transition group"
                  title="Giám sát Bão & Áp thấp Nhiệt đới Biển Đông Thời Gian Thực"
                >
                  <Compass className="w-3.5 h-3.5 text-[#FFE066] group-hover:rotate-180 transition-transform duration-700" />
                  <span className="hidden sm:inline">Bão Biển Đông</span>
                </button>
              )}

              {/* Google WeatherNext 3 AI */}
              {onOpenWeatherNext && (
                <button
                  onClick={onOpenWeatherNext}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-900 via-sky-800 to-teal-900 hover:from-cyan-800 hover:to-sky-700 text-white border border-cyan-400/60 text-xs font-bold shadow transition group"
                  title="Google DeepMind WeatherNext 3 - Dự báo Khí tượng AI 5km & Đối soát Đa Mô hình"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                  <span className="hidden md:inline">WeatherNext 3</span>
                  <span className="text-[10px] px-1 py-0.2 bg-cyan-500/30 text-cyan-200 rounded font-mono border border-cyan-400/40">5km</span>
                </button>
              )}

              {/* AI Copilot */}
              {onOpenCopilot && (
                <button
                  onClick={onOpenCopilot}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-600 hover:to-purple-600 text-white border border-purple-400/50 text-xs font-bold shadow transition"
                  title="AI Tham mưu Tác chiến War Room Copilot"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-200 animate-pulse" />
                  <span className="hidden md:inline">AI Tham Mưu</span>
                </button>
              )}

              {/* Bản Tin PCTT */}
              {onOpenReport && (
                <button
                  onClick={onOpenReport}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#004B87] hover:bg-[#005BAC] text-sky-100 border border-[#00A6D6]/40 text-xs font-semibold shadow-sm transition"
                  title="Bản tin Tình huống Khẩn cấp & Công điện Tác chiến PCTT"
                >
                  <FileText className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span className="hidden lg:inline">Bản Tin</span>
                </button>
              )}

              {/* Grouped Tactical Tools Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition shadow ${
                    showToolsDropdown
                      ? 'bg-[#F5B400] text-[#002B54] border-[#FFE066]'
                      : 'bg-[#002B54] hover:bg-[#003B73] text-sky-100 border-[#005BAC]'
                  }`}
                  title="Mở toàn bộ công cụ tác chiến khí tượng và chỉ huy"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#F5B400]" />
                  <span>Công Cụ Tác Chiến</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showToolsDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Tactical Dropdown Menu */}
                {showToolsDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#002B54] border-2 border-[#005BAC] rounded-2xl shadow-2xl backdrop-blur-xl p-3 z-50 text-xs animate-in fade-in slide-in-from-top-2 text-slate-100">
                    <div className="flex items-center justify-between pb-2 border-b border-[#004B87] mb-2.5">
                      <div className="flex items-center gap-1.5 font-bold text-[#F5B400] uppercase tracking-wider text-[11px]">
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Danh Mục Công Cụ Tác Chiến</span>
                      </div>
                      <span className="text-[10px] text-sky-300 font-mono">{timeStr}</span>
                    </div>

                    {/* Section 1: AI & Satellite SAR */}
                    <div className="space-y-1 mb-3">
                      <div className="text-[10px] font-bold text-sky-300 uppercase tracking-wide px-1">
                        🛰️ Vệ Tinh SAR & Mô Hình AI
                      </div>
                      <button
                        onClick={() => {
                          onOpenEarthAi();
                          setShowToolsDropdown(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-[#005BAC]/50 border border-[#004B87] transition text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-emerald-400" />
                          <div>
                            <div className="font-semibold text-slate-100">Google Earth AI & SAR</div>
                            <div className="text-[10px] text-sky-200">Phân tích vệ tinh đa phương thức</div>
                          </div>
                        </div>
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono">SAR</span>
                      </button>

                      {onOpenGlobalDisaster && (
                        <button
                          onClick={() => {
                            onOpenGlobalDisaster();
                            setShowToolsDropdown(false);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-700/50 transition text-left"
                        >
                          <div className="flex items-center gap-2">
                            <Globe2 className="w-4 h-4 text-cyan-400" />
                            <div>
                              <div className="font-semibold text-cyan-100">Thiên Tai & Sạt Lở Toàn Cầu</div>
                              <div className="text-[10px] text-cyan-300/80">Tình báo NASA EONET & USGS</div>
                            </div>
                          </div>
                          <span className="text-[10px] bg-cyan-900 text-cyan-200 px-1.5 py-0.5 rounded font-mono font-bold">NASA</span>
                        </button>
                      )}

                      {onOpenWeatherNext && (
                        <button
                          onClick={() => {
                            onOpenWeatherNext();
                            setShowToolsDropdown(false);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-cyan-950/60 to-slate-900 hover:from-cyan-900/60 hover:to-slate-800 border border-cyan-500/40 transition text-left"
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-cyan-300" />
                            <div>
                              <div className="font-semibold text-cyan-100 flex items-center gap-1.5">
                                <span>WeatherNext 3 (DeepMind)</span>
                                <span className="text-[9px] px-1 bg-cyan-500/30 text-cyan-200 rounded">AI 5km</span>
                              </div>
                              <div className="text-[10px] text-slate-400">Dự báo 1h/lần & Phương án A</div>
                            </div>
                          </div>
                          <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">1h AI</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onOpenLstm();
                          setShowToolsDropdown(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-[#005BAC]/50 border border-[#004B87] transition text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-cyan-400" />
                          <div>
                            <div className="font-semibold text-slate-100">Thủy Đồ Dự Báo LSTM AI</div>
                            <div className="text-[10px] text-sky-200">Mô phỏng đỉnh lũ 6-24h tới</div>
                          </div>
                        </div>
                        <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded font-mono">LSTM</span>
                      </button>
                    </div>

                    {/* Section 2: Khí tượng & Thủy văn chuyên sâu */}
                    <div className="space-y-1 mb-3">
                      <div className="text-[10px] font-bold text-sky-300 uppercase tracking-wide px-1">
                        🌊 Khí Tượng & Thủy Văn
                      </div>
                      <button
                        onClick={() => {
                          if (onOpenTransboundary) onOpenTransboundary();
                          setShowToolsDropdown(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-[#005BAC]/50 border border-[#004B87] transition text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Globe2 className="w-4 h-4 text-indigo-400" />
                          <div>
                            <div className="font-semibold text-slate-100">Thủy Văn Xuyên Biên Giới</div>
                            <div className="text-[10px] text-sky-200">Lưu vực sông Mekong & Sông Hồng</div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          onOpenRadar();
                          setShowToolsDropdown(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-[#005BAC]/50 border border-[#004B87] transition text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Radar className="w-4 h-4 text-blue-400" />
                          <div>
                            <div className="font-semibold text-slate-100">Radar Doppler Nowcasting</div>
                            <div className="text-[10px] text-sky-200">Dự báo cực ngắn 0-3h theo trạm</div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          onOpenSevereWeather();
                          setShowToolsDropdown(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-[#005BAC]/50 border border-[#004B87] transition text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-400" />
                          <div>
                            <div className="font-semibold text-slate-100">Giông Sét & Mưa Đá</div>
                            <div className="text-[10px] text-sky-200">Cảnh báo lốc xoáy & sét đánh</div>
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Section 3: Chỉ huy & Truyền thông PCTT */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-sky-300 uppercase tracking-wide px-1">
                        📢 Chỉ Huy & Truyền Thông PCTT
                      </div>
                      <button
                        onClick={() => {
                          onOpenBroadcast();
                          setShowToolsDropdown(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-[#005BAC]/50 border border-[#004B87] transition text-left"
                      >
                        <div className="flex items-center gap-2">
                          <RadioTower className="w-4 h-4 text-rose-400" />
                          <div>
                            <div className="font-semibold text-slate-100">Phát Lệnh SMS / Cell Broadcast</div>
                            <div className="text-[10px] text-sky-200">Đài truyền thanh & Loa xã phường</div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          onOpenSocialSensors();
                          setShowToolsDropdown(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-[#005BAC]/50 border border-[#004B87] transition text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Share2 className="w-4 h-4 text-teal-400" />
                          <div>
                            <div className="font-semibold text-slate-100">Cảm Biến Mạng Xã Hội (VGI)</div>
                            <div className="text-[10px] text-sky-200">Phản ánh thực địa của nhân dân</div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          onOpenSimulation();
                          setShowToolsDropdown(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-[#005BAC]/50 border border-[#004B87] transition text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-purple-400" />
                          <div>
                            <div className="font-semibold text-slate-100">Thử Nghiệm Kịch Bản Mưa</div>
                            <div className="text-[10px] text-sky-200">Diễn tập tham số mưa cực đoan</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-[#002B54] hover:bg-[#004B87] text-sky-200 border border-[#005BAC] transition"
            title={soundEnabled ? 'Tắt âm thanh thông báo' : 'Bật âm thanh thông báo'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#FFE066]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Authenticated User Badge & Logout */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#005BAC]">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-white truncate max-w-[130px]">
                  {currentUser.full_name || currentUser.username}
                </span>
                <span className="text-[10px] text-[#FFE066] font-mono">{currentUser.role}</span>
              </div>

              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg bg-[#002B54] hover:bg-rose-900/80 text-sky-200 hover:text-rose-200 border border-[#005BAC] transition"
                title="Đăng xuất khỏi Trung tâm Tác chiến"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-1.5 bg-[#D71920] hover:bg-[#E63946] text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow transition border border-[#FFE066]/60"
            >
              <User className="w-3.5 h-3.5 text-[#FFE066]" />
              <span>Đăng Nhập</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

