import React, { useState } from 'react';
import {
  Layers,
  ChevronDown,
  ChevronUp,
  AlertOctagon,
  Waves,
  Zap,
  Droplets,
  Radio,
  Satellite,
  Camera,
  Home,
  GraduationCap,
  Hospital,
  Compass,
  Tent,
  LifeBuoy,
  Package,
  Settings,
  Crosshair,
  Gauge,
  Eye,
  Sliders
} from 'lucide-react';
import { VIETNAM_PROVINCES } from '../data/provinces';

export interface TacticalLayerState {
  // NGUY CƠ THIÊN TAI
  landslide_points: boolean;
  landslide_zones: boolean;
  flood_points: boolean;
  flood_zones: boolean;
  lightning: boolean;

  // DỮ LIỆU QUAN TRẮC
  rain_stations: boolean;
  hydro_stations: boolean;
  radar_nowcast: boolean;
  satellite: boolean;
  camera: boolean;

  // ĐỐI TƯỢNG & HẠ TẦNG
  residential: boolean;
  schools: boolean;
  hospitals: boolean;
  bridges: boolean;
  roads: boolean;

  // PHƯƠNG ÁN ỨNG PHÓ
  evacuation_points: boolean;
  rescue_teams: boolean;
  supplies_depot: boolean;
}

interface TacticalLeftSidebarProps {
  selectedProvince: string;
  onChangeProvince: (provId: string) => void;
  layers: TacticalLayerState;
  onToggleLayer: (layerKey: keyof TacticalLayerState) => void;
  onOpenLayerConfig?: () => void;
  onSelectTool?: (toolId: string) => void;
}

export const TacticalLeftSidebar: React.FC<TacticalLeftSidebarProps> = ({
  selectedProvince,
  onChangeProvince,
  layers,
  onToggleLayer,
  onOpenLayerConfig,
  onSelectTool
}) => {
  const [openSections, setOpenSections] = useState({
    risks: true,
    sensors: true,
    infrastructure: true,
    response: true
  });

  const [activeSideTool, setActiveSideTool] = useState<string>('layers');

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="flex h-full bg-[#050c18] border-r border-[#0f2744] select-none text-slate-200">
      {/* 1. Far-left mini icon dock */}
      <div className="w-12 bg-[#040812] border-r border-[#0d1e34] flex flex-col items-center py-3 gap-3 shrink-0">
        <button
          onClick={() => {
            setActiveSideTool('layers');
            if (onSelectTool) onSelectTool('layers');
          }}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
            activeSideTool === 'layers'
              ? 'bg-[#005BAC] text-white shadow-lg shadow-[#005BAC]/40 ring-1 ring-sky-300'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Lớp bản đồ"
        >
          <Layers className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            setActiveSideTool('sensors');
            if (onSelectTool) onSelectTool('sensors');
          }}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
            activeSideTool === 'sensors'
              ? 'bg-[#005BAC] text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Trạm quan trắc & Cảm biến"
        >
          <Gauge className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            setActiveSideTool('radar');
            if (onSelectTool) onSelectTool('radar');
          }}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
            activeSideTool === 'radar'
              ? 'bg-[#005BAC] text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Radar & Dự báo thời tiết"
        >
          <Radio className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            setActiveSideTool('lightning');
            if (onSelectTool) onSelectTool('lightning');
          }}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
            activeSideTool === 'lightning'
              ? 'bg-[#005BAC] text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Giông sét & Cảnh báo tức thời"
        >
          <Zap className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            setActiveSideTool('camera');
            if (onSelectTool) onSelectTool('camera');
          }}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
            activeSideTool === 'camera'
              ? 'bg-[#005BAC] text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Camera thực địa & Drone"
        >
          <Camera className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            setActiveSideTool('target');
            if (onSelectTool) onSelectTool('target');
          }}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
            activeSideTool === 'target'
              ? 'bg-[#005BAC] text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Định vị tâm điểm & Khảo sát"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Main layer controls panel */}
      <div className="w-64 sm:w-72 flex flex-col h-full overflow-hidden">
        {/* Top: Scope Selector */}
        <div className="p-3 border-b border-[#0f2744] bg-[#071324]/80">
          <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-1.5 flex items-center justify-between">
            <span>PHẠM VI TÁC CHIẾN</span>
          </div>

          <div className="relative">
            <select
              value={selectedProvince}
              onChange={(e) => onChangeProvince(e.target.value)}
              className="w-full bg-[#091e38] border border-[#173e6e] rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#F5B400] appearance-none cursor-pointer pr-8 shadow-inner"
            >
              <option value="phu_tho" className="bg-[#050e1f] text-white font-bold">
                TỈNH PHÚ THỌ
              </option>
              <option value="ALL" className="bg-[#050e1f] text-white">
                🌐 TOÀN BỘ TỈNH / THÀNH PHỐ
              </option>
              {VIETNAM_PROVINCES.filter((p) => p.id !== 'phu_tho').map((p) => (
                <option key={p.id} value={p.id} className="bg-[#050e1f] text-white">
                  {p.name.toUpperCase()}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Breadcrumbs */}
          <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 font-medium">
            <span className="text-[#38bdf8] font-bold">Tỉnh</span>
            <span>&gt;</span>
            <span className="hover:text-white cursor-pointer">Huyện</span>
            <span>&gt;</span>
            <span className="hover:text-white cursor-pointer">Xã</span>
            <span>&gt;</span>
            <span className="text-[#f87171] font-bold">Điểm sự cố</span>
          </div>
        </div>

        {/* Middle: Layer Tree (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-2 text-xs space-y-3 custom-scrollbar">
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase text-slate-300 tracking-wider pt-1">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#38bdf8]" />
              LỚP HIỂN THỊ
            </span>
            <span className="text-[10px] text-slate-400">18 Lớp</span>
          </div>

          {/* GROUP 1: NGUY CƠ THIÊN TAI */}
          <div className="rounded-lg bg-[#071324]/50 border border-[#0f2744] overflow-hidden">
            <button
              onClick={() => toggleSection('risks')}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold text-slate-200 hover:bg-white/5 transition"
            >
              <span className="flex items-center gap-1.5 text-[#ef4444]">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>NGUY CƠ THIÊN TAI</span>
              </span>
              {openSections.risks ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {openSections.risks && (
              <div className="p-2 pt-0 space-y-1.5 border-t border-[#0f2744]/60">
                {/* Điểm sạt lở */}
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shrink-0"></span>
                    <span className="text-[11px] text-slate-300 group-hover:text-white">Điểm sạt lở</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.landslide_points}
                    onChange={() => onToggleLayer('landslide_points')}
                    className="w-3.5 h-3.5 rounded bg-[#091e38] border-slate-600 text-rose-600 focus:ring-0 cursor-pointer"
                  />
                </label>

                {/* Vùng nguy cơ sạt lở */}
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full border border-[#ef4444] shrink-0"></span>
                    <span className="text-[11px] text-slate-300 group-hover:text-white">Vùng nguy cơ sạt lở</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.landslide_zones}
                    onChange={() => onToggleLayer('landslide_zones')}
                    className="w-3.5 h-3.5 rounded bg-[#091e38] border-slate-600 text-rose-600 focus:ring-0 cursor-pointer"
                  />
                </label>

                {/* Điểm lũ/Ngập */}
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rotate-45 bg-[#0284c7] shrink-0"></span>
                    <span className="text-[11px] text-slate-300 group-hover:text-white">Điểm lũ/Ngập</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.flood_points}
                    onChange={() => onToggleLayer('flood_points')}
                    className="w-3.5 h-3.5 rounded bg-[#091e38] border-slate-600 text-sky-600 focus:ring-0 cursor-pointer"
                  />
                </label>

                {/* Vùng nguy cơ lũ */}
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded border border-[#0284c7] shrink-0"></span>
                    <span className="text-[11px] text-slate-300 group-hover:text-white">Vùng nguy cơ lũ</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.flood_zones}
                    onChange={() => onToggleLayer('flood_zones')}
                    className="w-3.5 h-3.5 rounded bg-[#091e38] border-slate-600 text-sky-600 focus:ring-0 cursor-pointer"
                  />
                </label>

                {/* Giông sét */}
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-[#eab308] shrink-0" />
                    <span className="text-[11px] text-slate-300 group-hover:text-white">Giông sét</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.lightning}
                    onChange={() => onToggleLayer('lightning')}
                    className="w-3.5 h-3.5 rounded bg-[#091e38] border-slate-600 text-amber-500 focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>
            )}
          </div>

          {/* GROUP 2: DỮ LIỆU QUAN TRẮC */}
          <div className="rounded-lg bg-[#071324]/50 border border-[#0f2744] overflow-hidden">
            <button
              onClick={() => toggleSection('sensors')}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold text-slate-200 hover:bg-white/5 transition"
            >
              <span className="flex items-center gap-1.5 text-[#38bdf8]">
                <Droplets className="w-3.5 h-3.5" />
                <span>DỮ LIỆU QUAN TRẮC</span>
              </span>
              {openSections.sensors ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {openSections.sensors && (
              <div className="p-2 pt-0 space-y-1.5 border-t border-[#0f2744]/60">
                {/* Trạm mưa */}
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-3 h-3 text-[#0284c7] shrink-0" />
                    <span className="text-[11px] text-slate-300 group-hover:text-white">Trạm mưa</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.rain_stations}
                    onChange={() => onToggleLayer('rain_stations')}
                    className="w-3.5 h-3.5 rounded bg-[#091e38] border-slate-600 text-sky-600 focus:ring-0 cursor-pointer"
                  />
                </label>

                {/* Trạm thủy văn */}
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <Waves className="w-3 h-3 text-[#06b6d4] shrink-0" />
                    <span className="text-[11px] text-slate-300 group-hover:text-white">Trạm thủy văn</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.hydro_stations}
                    onChange={() => onToggleLayer('hydro_stations')}
                    className="w-3.5 h-3.5 rounded bg-[#091e38] border-slate-600 text-cyan-600 focus:ring-0 cursor-pointer"
                  />
                </label>

                {/* Radar thời tiết */}
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <Radio className="w-3 h-3 text-[#10b981] shrink-0" />
                    <span className="text-[11px] text-slate-300 group-hover:text-white">Radar thời tiết</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.radar_nowcast}
                    onChange={() => onToggleLayer('radar_nowcast')}
                    className="w-3.5 h-3.5 rounded bg-[#091e38] border-slate-600 text-emerald-600 focus:ring-0 cursor-pointer"
                  />
                </label>

                {/* Vệ tinh */}
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <Satellite className="w-3 h-3 text-[#818cf8] shrink-0" />
                    <span className="text-[11px] text-slate-300 group-hover:text-white">Vệ tinh</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.satellite}
                    onChange={() => onToggleLayer('satellite')}
                    className="w-3.5 h-3.5 rounded bg-[#091e38] border-slate-600 text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                </label>

                {/* Camera */}
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <Camera className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="text-[11px] text-slate-300 group-hover:text-white">Camera</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.camera}
                    onChange={() => onToggleLayer('camera')}
                    className="w-3.5 h-3.5 rounded bg-[#091e38] border-slate-600 text-slate-500 focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>
            )}
          </div>

          {/* GROUP 3: ĐỐI TƯỢNG & HẠ TẦNG */}
          <div className="rounded-lg bg-[#071324]/50 border border-[#0f2744] overflow-hidden">
            <button
              onClick={() => toggleSection('infrastructure')}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold text-slate-200 hover:bg-white/5 transition"
            >
              <span className="flex items-center gap-1.5 text-[#fb923c]">
                <Home className="w-3.5 h-3.5" />
                <span>ĐỐI TƯỢNG & HẠ TẦNG</span>
              </span>
              {openSections.infrastructure ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {openSections.infrastructure && (
              <div className="p-2 pt-0 space-y-1.5 border-t border-[#0f2744]/60">
                {/* Khu dân cư */}
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <Home className="w-3 h-3 text-[#2dd4bf] shrink-0" />
                    <span className="text-[11px] text-slate-300 group-hover:text-white">Khu dân cư</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.residential}
                    onChange={() => onToggleLayer('residential')}
                    className="w-3.5 h-3.5 rounded bg-[#091e38] border-slate-600 text-teal-600 focus:ring-0 cursor-pointer"
                  />
                </label>

                {/* Trường học */}
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3 h-3 text-[#38bdf8] shrink-0" />
                    <span className="text-[11px] text-slate-300 group-hover:text-white">Trường học</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.schools}
                    onChange={() => onToggleLayer('schools')}
                    className="w-3.5 h-3.5 rounded bg-[#091e38] border-slate-600 text-sky-600 focus:ring-0 cursor-pointer"
                  />
                </label>

                {/* Trạm y tế */}
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <Hospital className="w-3 h-3 text-[#f87171] shrink-0" />
                    <span className="text-[11px] text-slate-300 group-hover:text-white">Trạm y tế</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.hospitals}
                    onChange={() => onToggleLayer('hospitals')}
                    className="w-3.5 h-3.5 rounded bg-[#091e38] border-slate-600 text-rose-600 focus:ring-0 cursor-pointer"
                  />
                </label>

                {/* Cầu */}
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-amber-400">🌉</span>
                    <span className="text-[11px] text-slate-300 group-hover:text-white">Cầu</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.bridges}
                    onChange={() => onToggleLayer('bridges')}
                    className="w-3.5 h-3.5 rounded bg-[#091e38] border-slate-600 text-amber-600 focus:ring-0 cursor-pointer"
                  />
                </label>

                {/* Tuyến đường */}
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <Compass className="w-3 h-3 text-[#a78bfa] shrink-0" />
                    <span className="text-[11px] text-slate-300 group-hover:text-white">Tuyến đường</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.roads}
                    onChange={() => onToggleLayer('roads')}
                    className="w-3.5 h-3.5 rounded bg-[#091e38] border-slate-600 text-purple-600 focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>
            )}
          </div>

          {/* GROUP 4: PHƯƠNG ÁN ỨNG PHÓ */}
          <div className="rounded-lg bg-[#071324]/50 border border-[#0f2744] overflow-hidden">
            <button
              onClick={() => toggleSection('response')}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold text-slate-200 hover:bg-white/5 transition"
            >
              <span className="flex items-center gap-1.5 text-[#eab308]">
                <Tent className="w-3.5 h-3.5" />
                <span>PHƯƠNG ÁN ỨNG PHÓ</span>
              </span>
              {openSections.response ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {openSections.response && (
              <div className="p-2 pt-0 space-y-1.5 border-t border-[#0f2744]/60">
                {/* Điểm sơ tán */}
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <Tent className="w-3 h-3 text-[#38bdf8] shrink-0" />
                    <span className="text-[11px] text-slate-300 group-hover:text-white">Điểm sơ tán</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.evacuation_points}
                    onChange={() => onToggleLayer('evacuation_points')}
                    className="w-3.5 h-3.5 rounded bg-[#091e38] border-slate-600 text-sky-600 focus:ring-0 cursor-pointer"
                  />
                </label>

                {/* Đội ứng cứu */}
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <LifeBuoy className="w-3 h-3 text-[#f97316] shrink-0" />
                    <span className="text-[11px] text-slate-300 group-hover:text-white">Đội ứng cứu</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.rescue_teams}
                    onChange={() => onToggleLayer('rescue_teams')}
                    className="w-3.5 h-3.5 rounded bg-[#091e38] border-slate-600 text-orange-600 focus:ring-0 cursor-pointer"
                  />
                </label>

                {/* Kho vật tư */}
                <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <Package className="w-3 h-3 text-[#2dd4bf] shrink-0" />
                    <span className="text-[11px] text-slate-300 group-hover:text-white">Kho vật tư</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.supplies_depot}
                    onChange={() => onToggleLayer('supplies_depot')}
                    className="w-3.5 h-3.5 rounded bg-[#091e38] border-slate-600 text-teal-600 focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Bottom: Quản lý lớp button */}
        <div className="p-2.5 border-t border-[#0f2744] bg-[#071324]/80">
          <button
            onClick={onOpenLayerConfig}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#002B54] hover:bg-[#003B73] border border-[#005BAC] text-xs font-bold text-sky-200 hover:text-white transition shadow"
          >
            <span>QUẢN LÝ LỚP</span>
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
