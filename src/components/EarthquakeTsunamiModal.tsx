import React, { useState } from 'react';
import {
  Activity,
  Waves,
  AlertTriangle,
  Radio,
  Clock,
  MapPin,
  Compass,
  Layers,
  ChevronRight,
  X,
  Volume2,
  Info,
  Shield,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle2,
  Share2,
  ExternalLink,
  Flame,
  Zap
} from 'lucide-react';
import { EarthquakeEvent, TsunamiAlert, FaultLine } from '../types';
import { SAMPLE_EARTHQUAKE_EVENTS, SAMPLE_TSUNAMI_ALERT, VIETNAM_FAULT_LINES, EARTHQUAKE_ACTION_GUIDES } from '../data/earthquake_tsunami';

interface EarthquakeTsunamiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOnMap?: (lat: number, lng: number, zoom: number) => void;
}

export const EarthquakeTsunamiModal: React.FC<EarthquakeTsunamiModalProps> = ({
  isOpen,
  onClose,
  onSelectOnMap
}) => {
  const [activeTab, setActiveTab] = useState<'EARTHQUAKE' | 'TSUNAMI' | 'FAULTS' | 'GUIDE'>('EARTHQUAKE');
  const [selectedEq, setSelectedEq] = useState<EarthquakeEvent>(SAMPLE_EARTHQUAKE_EVENTS[0]);
  const [tsunamiAlert, setTsunamiAlert] = useState<TsunamiAlert>(SAMPLE_TSUNAMI_ALERT);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSimulateAlert = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER BAR */}
        <div className="bg-gradient-to-r from-slate-900 via-[#002855] to-[#003B73] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  HỆ THỐNG ĐỊA CHẤN & SÓNG THẦN
                </span>
                <span className="text-[11px] text-sky-200 font-mono">
                  VAST-IGP / USGS / PTWC
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-0.5">
                Cảnh Báo Động Đất & Nguy Cơ Sóng Thần Biển Đông
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateAlert}
              disabled={isSimulating}
              className="hidden sm:flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow"
              title="Kiểm tra tín hiệu chuông cảnh báo khẩn"
            >
              <Radio className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Đang kích hoạt...' : 'Phát thử nghiệm'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SUB HEADER TABS */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50/80 px-5 pt-2 gap-2 overflow-x-auto text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('EARTHQUAKE')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition whitespace-nowrap ${
              activeTab === 'EARTHQUAKE'
                ? 'border-[#005BAC] text-[#005BAC] bg-white rounded-t-xl font-extrabold shadow-2xs'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-amber-500" />
            <span>Mạng Lưới Động Đất (Realtime)</span>
            <span className="bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full text-[10px]">
              {SAMPLE_EARTHQUAKE_EVENTS.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('TSUNAMI')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition whitespace-nowrap ${
              activeTab === 'TSUNAMI'
                ? 'border-[#005BAC] text-[#005BAC] bg-white rounded-t-xl font-extrabold shadow-2xs'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Waves className="w-4 h-4 text-sky-600" />
            <span>Cảnh Báo Sóng Thần (PTWC)</span>
            {tsunamiAlert.is_active && (
              <span className="bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-full text-[10px] animate-pulse">
                Đang theo dõi
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('FAULTS')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition whitespace-nowrap ${
              activeTab === 'FAULTS'
                ? 'border-[#005BAC] text-[#005BAC] bg-white rounded-t-xl font-extrabold shadow-2xs'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>Đới Đứt Gãy Kiến Tạo ({VIETNAM_FAULT_LINES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('GUIDE')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition whitespace-nowrap ${
              activeTab === 'GUIDE'
                ? 'border-[#005BAC] text-[#005BAC] bg-white rounded-t-xl font-extrabold shadow-2xs'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            <span>Cẩm Nang Ứng Phó Khẩn Cấp</span>
          </button>
        </div>

        {/* TAB 1: EARTHQUAKE TAB */}
        {activeTab === 'EARTHQUAKE' && (
          <div className="p-5 overflow-y-auto space-y-5 flex-1 bg-[#F8FAFC]">
            {/* Top Alert Banner */}
            <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-300/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shrink-0 shadow">
                  M{selectedEq.magnitude}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-amber-900">
                      SỰ KIỆN GẦN NHẤT GHI NHẬN TẠI {selectedEq.location_name.toUpperCase()}
                    </span>
                    <span className="bg-amber-200/80 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                      Cấp {selectedEq.intensity_mmi}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5">
                    {selectedEq.guidance_summary}
                  </p>
                </div>
              </div>

              {onSelectOnMap && (
                <button
                  onClick={() => {
                    onSelectOnMap(selectedEq.latitude, selectedEq.longitude, 10);
                    onClose();
                  }}
                  className="bg-[#005BAC] hover:bg-[#00488a] text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow flex items-center gap-1.5 whitespace-nowrap"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Xem trên bản đồ GIS</span>
                </button>
              )}
            </div>

            {/* Content 2-Column: Event List + Selected Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left Column: Recent Earthquakes List */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-black text-slate-600 uppercase">
                  <span>DANH SÁCH RUNG CHẤN GẦN ĐÂY</span>
                  <span>{SAMPLE_EARTHQUAKE_EVENTS.length} sự kiện</span>
                </div>

                <div className="space-y-2">
                  {SAMPLE_EARTHQUAKE_EVENTS.map((eq) => {
                    const isSelected = selectedEq.id === eq.id;
                    return (
                      <div
                        key={eq.id}
                        onClick={() => setSelectedEq(eq)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-white border-[#005BAC] ring-2 ring-[#005BAC]/20 shadow-md'
                            : 'bg-white hover:bg-slate-50 border-slate-200/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-mono font-black text-white shrink-0 shadow-xs ${
                              eq.magnitude >= 6.0
                                ? 'bg-red-600'
                                : eq.magnitude >= 4.5
                                ? 'bg-amber-500'
                                : 'bg-emerald-600'
                            }`}
                          >
                            <span className="text-xs leading-none">M</span>
                            <span className="text-sm leading-none">{eq.magnitude}</span>
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900 line-clamp-1">
                              {eq.location_name}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>Sâu {eq.depth_km} km</span>
                              <span>•</span>
                              <span>{new Date(eq.timestamp).toLocaleTimeString('vi-VN')}</span>
                            </div>
                          </div>
                        </div>

                        <ChevronRight className={`w-4 h-4 transition ${isSelected ? 'text-[#005BAC] translate-x-1' : 'text-slate-400'}`} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Deep Parameters & Wave Propagation */}
              <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#005BAC] tracking-wider">
                      THÔNG SỐ VẬT LÝ ĐỊA CHẤN CHI TIẾT
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                      {selectedEq.location_name} (M{selectedEq.magnitude})
                    </h3>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-slate-500 font-mono">Nguồn: </span>
                    <span className="font-bold text-slate-800">{selectedEq.source}</span>
                  </div>
                </div>

                {/* 4 Metric Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                    <div className="text-[11px] text-slate-500 font-semibold">Tọa độ tâm chấn</div>
                    <div className="text-xs font-mono font-bold text-slate-900 mt-0.5">
                      {selectedEq.latitude}°N, {selectedEq.longitude}°E
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                    <div className="text-[11px] text-slate-500 font-semibold">Độ sâu chấn tiêu</div>
                    <div className="text-xs font-bold text-amber-700 mt-0.5">
                      {selectedEq.depth_km} km
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                    <div className="text-[11px] text-slate-500 font-semibold">Bán kính sóng P/S</div>
                    <div className="text-xs font-bold text-sky-700 mt-0.5">
                      {selectedEq.p_wave_radius_km} / {selectedEq.s_wave_radius_km} km
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                    <div className="text-[11px] text-slate-500 font-semibold">Xác suất dư chấn</div>
                    <div className="text-xs font-bold text-rose-700 mt-0.5">
                      {selectedEq.aftershock_probability}%
                    </div>
                  </div>
                </div>

                {/* Geological and Social Impact Box */}
                <div className="bg-sky-50/60 border border-sky-200/80 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-sky-950 font-bold">
                    <span>Đới đứt gãy liên đới:</span>
                    <span className="text-[#005BAC]">{selectedEq.fault_system || 'Đang xác định'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sky-950 font-bold">
                    <span>Khu vực chịu ảnh hưởng rung chấn:</span>
                    <span>{selectedEq.affected_districts.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sky-950 font-bold">
                    <span>Số lượt người dân gửi phản hồi cảm nhận:</span>
                    <span className="bg-sky-200/80 px-2 py-0.5 rounded-md font-mono">{selectedEq.felt_reports_count} báo cáo</span>
                  </div>
                </div>

                {/* Quick Advice */}
                <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                  <div className="font-extrabold flex items-center gap-1.5 text-amber-950">
                    <Shield className="w-4 h-4 text-amber-700" />
                    <span>Lưu ý đặc thù địa hình dốc & sạt lở kết hợp:</span>
                  </div>
                  <p className="leading-relaxed">
                    Sau các đợt rung chấn trên $M \ge 4.0$ tại khu vực đồi núi (Tây Bắc, Tây Nguyên), cấu trúc đất sườn dốc bị rạn nứt. Nếu có mưa lớn dồn dập sau đó, nguy cơ sạt lở đất và lũ bùn đá tăng gấp 3 lần bình thường.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TSUNAMI TAB */}
        {activeTab === 'TSUNAMI' && (
          <div className="p-5 overflow-y-auto space-y-5 flex-1 bg-[#F8FAFC]">
            {/* Tsunami Status Banner */}
            <div className="bg-gradient-to-r from-sky-900 to-[#003B73] text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                      THEO DÕI NGUY CƠ SÓNG THẦN BIỂN ĐÔNG
                    </span>
                    <span className="text-xs text-sky-200 font-mono">{tsunamiAlert.bulletin_no}</span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-1">
                    Mô Hình Dự Báo Lan Truyền Sóng Thần Từ Rãnh Hút Chìm Manila
                  </h3>
                  <p className="text-xs text-sky-100 max-w-2xl mt-1 leading-relaxed">
                    {tsunamiAlert.evacuation_order}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl text-center shrink-0">
                  <div className="text-[11px] text-sky-200">Thời gian truyền sóng đến bờ</div>
                  <div className="text-2xl font-black text-amber-300 font-mono">115 - 135 phút</div>
                  <div className="text-[10px] text-sky-300 mt-0.5">Vận tốc sóng: ~680 km/h ngoài khơi</div>
                </div>
              </div>
            </div>

            {/* Coastal Forecast Stations Table */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  DỰ BÁO CHIỀU CAO SÓNG & THỜI GIAN ĐỔ BỘ DỌC DẢI VEN BIỂN
                </h4>
                <span className="text-xs text-slate-500 font-medium">Cập nhật theo mạng lưới phao DART</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-extrabold uppercase text-[11px]">
                      <th className="py-2.5 px-3">Trạm Quan Trắc Ven Bờ</th>
                      <th className="py-2.5 px-3">Tỉnh / Thành Phố</th>
                      <th className="py-2.5 px-3 text-center">Thời Gian Dự Kiến Đổ Bộ</th>
                      <th className="py-2.5 px-3 text-center">Thời Gian Ứng Phó (Lead Time)</th>
                      <th className="py-2.5 px-3 text-center">Chiều Cao Sóng Cực Đại</th>
                      <th className="py-2.5 px-3 text-center">Ngưỡng Sơ Tán An Toàn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tsunamiAlert.forecasts.map((fc) => (
                      <tr key={fc.coastal_station_code} className="hover:bg-sky-50/40 transition">
                        <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                          <Waves className="w-4 h-4 text-sky-600 shrink-0" />
                          <span>{fc.coastal_station_name}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-700 font-medium">{fc.province}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                          {fc.estimated_arrival_time}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="bg-amber-100 text-amber-900 font-mono font-bold px-2 py-0.5 rounded text-[11px]">
                            {fc.lead_time_minutes} phút
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-extrabold text-rose-600 font-mono text-sm">
                          {fc.max_wave_height_meters} m
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-emerald-700">
                          ≥ {fc.evacuation_zone_elevation_m} m so với mực nước biển
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FAULT LINES TAB */}
        {activeTab === 'FAULTS' && (
          <div className="p-5 overflow-y-auto space-y-4 flex-1 bg-[#F8FAFC]">
            <div className="flex items-center justify-between text-xs font-black text-slate-600 uppercase">
              <span>HỆ THỐNG CÁC ĐỚI ĐỨT GÃY KIẾN TẠO CHÍNH TẠI VIỆT NAM</span>
              <span className="text-slate-500 font-normal">Dữ liệu Địa vật lý & Kiến tạo mảng</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {VIETNAM_FAULT_LINES.map((fl) => (
                <div key={fl.id} className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{fl.name}</h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Loại hình: {fl.category} • Chiều dài: ~{fl.length_km} km
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase shrink-0 ${
                        fl.activity_level === 'VERY_ACTIVE'
                          ? 'bg-rose-100 text-rose-800'
                          : fl.activity_level === 'ACTIVE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {fl.activity_level}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {fl.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Độ lớn tiềm năng cực đại (Mmax):</span>
                    <span className="text-rose-600 font-mono text-sm font-black">M{fl.max_potential_magnitude}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ACTION GUIDES TAB */}
        {activeTab === 'GUIDE' && (
          <div className="p-5 overflow-y-auto space-y-5 flex-1 bg-[#F8FAFC]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {EARTHQUAKE_ACTION_GUIDES.map((guide) => (
                <div key={guide.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{guide.title}</h4>
                      <p className="text-xs text-slate-500">{guide.subtitle}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {guide.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                        <span className="w-5 h-5 rounded-full bg-[#005BAC] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#005BAC] shrink-0" />
            <span>Nguồn cấp dữ liệu: Viện Vật lý Địa cầu (VAST-IGP), USGS, Trung tâm Cảnh báo Sóng thần Thái Bình Dương (PTWC).</span>
          </div>

          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl transition"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
