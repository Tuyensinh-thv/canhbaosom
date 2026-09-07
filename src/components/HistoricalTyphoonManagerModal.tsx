import React, { useState, useMemo } from 'react';
import {
  X,
  History,
  Search,
  Filter,
  Download,
  Play,
  Eye,
  Plus,
  Compass,
  Wind,
  Waves,
  CloudRain,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Shield,
  Trash2,
  ArrowRight,
  TrendingUp,
  Share2
} from 'lucide-react';
import { TyphoonStorm } from '../types';

interface HistoricalTyphoonManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  historicalStorms: TyphoonStorm[];
  onSelectStormForInspection: (stormId: string) => void;
  onLoadScenarioForReplay?: (stormId: string) => void;
}

export const HistoricalTyphoonManagerModal: React.FC<HistoricalTyphoonManagerModalProps> = ({
  isOpen,
  onClose,
  historicalStorms,
  onSelectStormForInspection,
  onLoadScenarioForReplay
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [customStorms, setCustomStorms] = useState<TyphoonStorm[]>(() => {
    try {
      const saved = localStorage.getItem('haews_custom_historical_storms');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notification, setNotification] = useState<string | null>(null);

  // New Storm Form State
  const [newStormName, setNewStormName] = useState('');
  const [newStormVnNum, setNewStormVnNum] = useState('');
  const [newStormYear, setNewStormYear] = useState(2025);
  const [newStormCategory, setNewStormCategory] = useState('TYPHOON');
  const [newStormWindKmh, setNewStormWindKmh] = useState(130);
  const [newStormPressure, setNewStormPressure] = useState(965);
  const [newStormLandfall, setNewStormLandfall] = useState('Quảng Ninh - Hải Phòng');
  const [newStormRainfall, setNewStormRainfall] = useState('250 - 450 mm');
  const [newStormSummary, setNewStormSummary] = useState('');
  const [newStormLesson, setNewStormLesson] = useState('');

  if (!isOpen) return null;

  const allStorms = [...historicalStorms, ...customStorms];

  // Unique years for filter
  const availableYears = Array.from(new Set(allStorms.map((s) => String(s.season_year || 2024)))).sort().reverse();

  // Filtered List
  const filteredStorms = allStorms.filter((storm) => {
    const matchesSearch =
      storm.international_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      storm.vietnam_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      storm.estimated_landfall_area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      storm.synoptic_summary.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesYear = selectedYear === 'ALL' || String(storm.season_year) === selectedYear;

    const matchesCategory =
      selectedCategory === 'ALL' ||
      (selectedCategory === 'SUPER' && storm.current_category === 'SUPER_TYPHOON') ||
      (selectedCategory === 'VIOLENT' && (storm.current_category === 'VIOLENT_TYPHOON' || storm.current_category === 'TYPHOON')) ||
      (selectedCategory === 'TROPICAL_STORM' && (storm.current_category === 'SEVERE_TROPICAL_STORM' || storm.current_category === 'TROPICAL_STORM'));

    const matchesRegion =
      selectedRegion === 'ALL' ||
      (selectedRegion === 'BAC_BO' && (storm.estimated_landfall_area.includes('Quảng Ninh') || storm.estimated_landfall_area.includes('Hải Phòng') || storm.estimated_landfall_area.includes('Bắc Bộ'))) ||
      (selectedRegion === 'BAC_TRUNG_BO' && (storm.estimated_landfall_area.includes('Thanh Hóa') || storm.estimated_landfall_area.includes('Nghệ An') || storm.estimated_landfall_area.includes('Hà Tĩnh') || storm.estimated_landfall_area.includes('Quảng Bình'))) ||
      (selectedRegion === 'TRUNG_TRUNG_BO' && (storm.estimated_landfall_area.includes('Huế') || storm.estimated_landfall_area.includes('Đà Nẵng') || storm.estimated_landfall_area.includes('Quảng Nam') || storm.estimated_landfall_area.includes('Quảng Ngãi'))) ||
      (selectedRegion === 'NAM_TRUNG_BO' && (storm.estimated_landfall_area.includes('Khánh Hòa') || storm.estimated_landfall_area.includes('Phú Yên') || storm.estimated_landfall_area.includes('Bình Định')));

    return matchesSearch && matchesYear && matchesCategory && matchesRegion;
  });

  const handleExportStorm = (storm: TyphoonStorm) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(storm, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Ho_so_bao_${storm.international_name.replace(/[^a-zA-Z0-9]/g, '_')}_${storm.season_year}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setNotification(`Đã xuất hồ sơ cơn bão ${storm.international_name} dạng JSON thành công!`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSaveNewStorm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStormName) return;

    const newStorm: TyphoonStorm = {
      id: `custom-hist-${Date.now()}`,
      storm_code: `TY-${newStormYear}-CUSTOM`,
      international_name: newStormName.toUpperCase(),
      vietnam_number: newStormVnNum || `Bão ${newStormName.toUpperCase()} (${newStormYear})`,
      is_historical: true,
      season_year: Number(newStormYear),
      status: 'HISTORICAL_REFERENCE',
      current_category: newStormCategory as any,
      current_category_label: `${newStormCategory} (HỒ SƠ TỰ TẠO / DIỄN TẬP)`,
      current_coords: [19.5, 107.5],
      current_wind_speed_kmh: Number(newStormWindKmh),
      current_wind_gust_kmh: Math.round(Number(newStormWindKmh) * 1.25),
      current_pressure_hpa: Number(newStormPressure),
      beaufort_scale_str: `Gió cấp ${Math.floor(newStormWindKmh / 15)}, giật mạnh`,
      moving_direction: 'Tây Tây Bắc',
      moving_speed_kmh: 18,
      distance_to_mainland_km: 0,
      estimated_landfall_time: `Mùa bão ${newStormYear}`,
      estimated_landfall_area: newStormLandfall,
      sea_wave_height_m: '5.0 - 7.0m',
      storm_surge_height_m: '1.0 - 2.0m',
      past_track: [],
      forecast_track: [],
      cone_of_uncertainty: [],
      coastal_danger_zones: [newStormLandfall],
      inland_torrential_rain_risk_zones: [
        {
          province: newStormLandfall,
          expected_rainfall_mm: newStormRainfall,
          landslide_flashflood_risk: 'VERY_HIGH',
          key_districts: ['Vùng xung yếu']
        }
      ],
      model_comparisons: [],
      synoptic_summary: newStormSummary || `Hồ sơ cơn bão ${newStormName} đổ bộ khu vực ${newStormLandfall}, gây mưa lớn diện rộng và gió giật mạnh.`,
      official_bulletin_number: `HỒ SƠ DIỄN TẬP PCTT - ${newStormName.toUpperCase()}`,
      issuer: 'Ban Chỉ đạo PCTT Tỉnh / Quốc gia',
      last_updated_time: new Date().toISOString(),
      safety_instructions: [
        newStormLesson || 'Chủ động rà soát phương án 4 tại chỗ và sơ tán dân cư vùng taluy nguy cơ cao.'
      ]
    };

    const updated = [newStorm, ...customStorms];
    setCustomStorms(updated);
    try {
      localStorage.setItem('haews_custom_historical_storms', JSON.stringify(updated));
    } catch (err) {
      console.warn('Cannot persist custom storm:', err);
    }

    setShowAddForm(false);
    setNewStormName('');
    setNewStormVnNum('');
    setNewStormSummary('');
    setNewStormLesson('');
    setNotification(`Đã thêm thành công hồ sơ bão "${newStorm.international_name}" vào kho lưu trữ!`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDeleteCustomStorm = (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa hồ sơ bão "${name}" khỏi danh mục diễn tập?`)) return;
    const updated = customStorms.filter((s) => s.id !== id);
    setCustomStorms(updated);
    try {
      localStorage.setItem('haews_custom_historical_storms', JSON.stringify(updated));
    } catch {}
    setNotification(`Đã xóa hồ sơ bão "${name}"`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-purple-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-purple-800/50 bg-gradient-to-r from-slate-950 via-purple-950/80 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-purple-950/60 border border-purple-400/40">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg font-black tracking-tight text-purple-100 flex items-center gap-2">
                  KHO LƯU TRỮ HỒ SƠ BÃO LỊCH SỬ & QUẢN LÝ KỊCH BẢN DIỄN TẬP
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full flex items-center gap-1.5">
                  <Layers className="w-3 h-3" />
                  {allStorms.length} Hồ sơ điển hình
                </span>
              </div>
              <p className="text-xs text-purple-300/80 mt-0.5">
                Cơ sở dữ liệu các cơn bão lịch sử đổ bộ Việt Nam dùng để đối sánh mô hình hoàn lưu mưa, phân tích rủi ro sạt lở và huấn luyện diễn tập PCTT
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition shadow-md shadow-purple-950/50 active:scale-95 border border-purple-400/40"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Đóng Form Nhập' : 'Thêm Hồ Sơ Bão Mới'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification Alert */}
        {notification && (
          <div className="bg-emerald-950/90 border-b border-emerald-600/60 px-6 py-2 flex items-center justify-between text-xs text-emerald-200 font-medium animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{notification}</span>
            </div>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên bão, số hiệu, địa bàn đổ bộ (Yagi, Trami, Làng Nủ...)..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-700/80">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-slate-400 font-medium">Năm:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900">Tất cả</option>
                {availableYears.map((y) => (
                  <option key={y} value={y} className="bg-slate-900">{y}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-700/80">
              <Filter className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-slate-400 font-medium">Cấp bão:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900">Tất cả cấp độ</option>
                <option value="SUPER" className="bg-slate-900">Siêu bão (Cấp 16+)</option>
                <option value="VIOLENT" className="bg-slate-900">Bão rất mạnh (Cấp 12-15)</option>
                <option value="TROPICAL_STORM" className="bg-slate-900">Bão nhiệt đới (Cấp 8-11)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-700/80">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400 font-medium">Vùng ảnh hưởng:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900">Toàn quốc</option>
                <option value="BAC_BO" className="bg-slate-900">Bắc Bộ (Quảng Ninh - Hải Phòng - Ninh Bình)</option>
                <option value="BAC_TRUNG_BO" className="bg-slate-900">Bắc Trung Bộ (Thanh Hóa - Hà Tĩnh)</option>
                <option value="TRUNG_TRUNG_BO" className="bg-slate-900">Trung Trung Bộ (Quảng Bình - Quảng Ngãi)</option>
                <option value="NAM_TRUNG_BO" className="bg-slate-900">Nam Trung Bộ (Khánh Hòa - Phú Yên)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Add Form Drawer */}
        {showAddForm && (
          <form onSubmit={handleSaveNewStorm} className="p-5 bg-purple-950/40 border-b border-purple-800/60 animate-in slide-in-from-top-2">
            <h3 className="text-sm font-black text-purple-200 mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-400" />
              NHẬP HỒ SƠ CƠN BÃO LỊCH SỬ / KỊCH BẢN DIỄN TẬP MỚI
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Tên quốc tế (VD: GAEMI, KALMAEGI):</label>
                <input
                  type="text"
                  required
                  value={newStormName}
                  onChange={(e) => setNewStormName(e.target.value)}
                  placeholder="VD: YAGI, NORU"
                  className="w-full bg-slate-900 border border-purple-700/80 rounded-lg p-2 text-slate-100 font-bold focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Số hiệu Việt Nam:</label>
                <input
                  type="text"
                  value={newStormVnNum}
                  onChange={(e) => setNewStormVnNum(e.target.value)}
                  placeholder="VD: Bão số 3 (2024)"
                  className="w-full bg-slate-900 border border-purple-700/80 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Năm bão đổ bộ:</label>
                <input
                  type="number"
                  value={newStormYear}
                  onChange={(e) => setNewStormYear(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-purple-700/80 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Phân loại cấp độ:</label>
                <select
                  value={newStormCategory}
                  onChange={(e) => setNewStormCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-purple-700/80 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-purple-400 font-bold"
                >
                  <option value="SUPER_TYPHOON">Siêu bão (Cấp 16+)</option>
                  <option value="VIOLENT_TYPHOON">Bão rất mạnh (Cấp 14 - 15)</option>
                  <option value="TYPHOON">Bão mạnh (Cấp 12 - 13)</option>
                  <option value="SEVERE_TROPICAL_STORM">Bão nhiệt đới dữ dội (Cấp 10 - 11)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Vận tốc gió cực đại (km/h):</label>
                <input
                  type="number"
                  value={newStormWindKmh}
                  onChange={(e) => setNewStormWindKmh(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-purple-700/80 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Khí áp tâm bão thấp nhất (hPa):</label>
                <input
                  type="number"
                  value={newStormPressure}
                  onChange={(e) => setNewStormPressure(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-purple-700/80 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Khu vực đổ bộ trọng điểm:</label>
                <input
                  type="text"
                  value={newStormLandfall}
                  onChange={(e) => setNewStormLandfall(e.target.value)}
                  placeholder="VD: Quảng Ninh - Hải Phòng"
                  className="w-full bg-slate-900 border border-purple-700/80 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Lượng mưa hoàn lưu tích lũy:</label>
                <input
                  type="text"
                  value={newStormRainfall}
                  onChange={(e) => setNewStormRainfall(e.target.value)}
                  placeholder="VD: 300 - 550 mm"
                  className="w-full bg-slate-900 border border-purple-700/80 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-bold mb-1">Tóm tắt diễn biến thảm họa:</label>
                <textarea
                  rows={2}
                  value={newStormSummary}
                  onChange={(e) => setNewStormSummary(e.target.value)}
                  placeholder="Mô tả mức độ tàn phá, phạm vi ảnh hưởng, tình trạng sạt lở hoặc ngập lụt..."
                  className="w-full bg-slate-900 border border-purple-700/80 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-bold mb-1">Bài học tác chiến & Chỉ đạo PCTT:</label>
                <textarea
                  rows={2}
                  value={newStormLesson}
                  onChange={(e) => setNewStormLesson(e.target.value)}
                  placeholder="Kinh nghiệm chỉ đạo sơ tán, cảnh báo lũ quét sạt lở, cấm biển..."
                  className="w-full bg-slate-900 border border-purple-700/80 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Lưu vào Kho Bão Diễn Tập
              </button>
            </div>
          </form>
        )}

        {/* Content Body: Storm Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredStorms.length === 0 ? (
            <div className="text-center py-16 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
              <History className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-pulse" />
              <div className="text-base font-bold text-slate-300">Không tìm thấy cơn bão phù hợp với bộ lọc</div>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh lại các tiêu chí bộ lọc năm, cấp độ hoặc vùng ảnh hưởng.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredStorms.map((storm) => {
                const isCustom = storm.id.startsWith('custom-');
                return (
                  <div
                    key={storm.id}
                    className="bg-slate-950/70 border border-purple-900/40 hover:border-purple-500/70 rounded-2xl p-5 shadow-lg transition duration-200 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base font-black text-white group-hover:text-purple-200 transition">
                              {storm.international_name}
                            </span>
                            <span className="px-2 py-0.5 text-[11px] font-black rounded-md bg-purple-950 text-purple-300 border border-purple-700/60">
                              Năm {storm.season_year || 2024}
                            </span>
                            {isCustom && (
                              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-950 text-amber-300 border border-amber-800">
                                Bản ghi tự tạo
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 font-medium mt-0.5">
                            {storm.vietnam_number}
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider border ${
                            storm.current_category === 'SUPER_TYPHOON'
                              ? 'bg-purple-950/80 text-purple-200 border-purple-500'
                              : storm.current_category === 'VIOLENT_TYPHOON'
                              ? 'bg-rose-950/80 text-rose-200 border-rose-500'
                              : 'bg-indigo-950/80 text-indigo-200 border-indigo-500'
                          }`}
                        >
                          {storm.current_category === 'SUPER_TYPHOON'
                            ? 'Siêu Bão Cấp 16+'
                            : storm.current_category === 'VIOLENT_TYPHOON'
                            ? 'Bão Rất Mạnh (Cấp 14-15)'
                            : storm.current_category === 'TYPHOON'
                            ? 'Bão Mạnh (Cấp 12-13)'
                            : 'Bão Nhiệt Đới'}
                        </span>
                      </div>

                      {/* Physical Metrics Grid */}
                      <div className="grid grid-cols-3 gap-2 my-3 text-xs">
                        <div className="p-2 bg-slate-900/90 rounded-xl border border-slate-800">
                          <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                            <Wind className="w-3 h-3 text-rose-400" />
                            <span>Gió Cực Đại:</span>
                          </div>
                          <div className="font-bold text-slate-200 mt-0.5">
                            {storm.current_wind_speed_kmh} km/h
                          </div>
                        </div>

                        <div className="p-2 bg-slate-900/90 rounded-xl border border-slate-800">
                          <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                            <Compass className="w-3 h-3 text-cyan-400" />
                            <span>Khí Áp Thấp Nhất:</span>
                          </div>
                          <div className="font-bold text-slate-200 mt-0.5">
                            {storm.current_pressure_hpa} hPa
                          </div>
                        </div>

                        <div className="p-2 bg-slate-900/90 rounded-xl border border-slate-800">
                          <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                            <CloudRain className="w-3 h-3 text-blue-400" />
                            <span>Mưa Hoàn Lưu:</span>
                          </div>
                          <div className="font-bold text-slate-200 mt-0.5 truncate">
                            {storm.inland_torrential_rain_risk_zones[0]?.expected_rainfall_mm || '250-450mm'}
                          </div>
                        </div>
                      </div>

                      {/* Landfall & Disaster Scope */}
                      <div className="text-xs space-y-2 mb-3">
                        <div className="flex items-start gap-1.5 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-slate-400">Khu vực đổ bộ:</strong> {storm.estimated_landfall_area}
                          </span>
                        </div>

                        <p className="text-slate-300/90 text-xs bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                          {storm.synoptic_summary}
                        </p>

                        {storm.safety_instructions && storm.safety_instructions.length > 0 && (
                          <div className="flex items-start gap-1.5 text-[11px] text-amber-300/90 bg-amber-950/30 p-2 rounded-lg border border-amber-900/40">
                            <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>
                              <strong>Bài học chỉ đạo:</strong> {storm.safety_instructions[0]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onSelectStormForInspection(storm.id);
                            onClose();
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-md shadow-purple-950 flex items-center gap-1.5"
                          title="Mở toàn bộ hồ sơ quỹ đạo, bán kính gió và mô hình bão này"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Xem Toàn Bộ Hồ Sơ Quỹ Đạo</span>
                        </button>

                        {onLoadScenarioForReplay && (
                          <button
                            onClick={() => {
                              onLoadScenarioForReplay(storm.id);
                              onClose();
                            }}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-200 border border-purple-800/60 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                            title="Nạp kịch bản cơn bão này vào chế độ Tua thời gian / Diễn tập War Room"
                          >
                            <Play className="w-3.5 h-3.5 text-purple-400" />
                            <span>Nạp Diễn Tập / Replay</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleExportStorm(storm)}
                          className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 transition"
                          title="Xuất hồ sơ dữ liệu cơn bão (.JSON)"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {isCustom && (
                          <button
                            onClick={() => handleDeleteCustomStorm(storm.id, storm.international_name)}
                            className="p-1.5 bg-rose-950/50 hover:bg-rose-900 text-rose-400 hover:text-rose-200 rounded-lg border border-rose-900/60 transition"
                            title="Xóa hồ sơ tự tạo này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Hồ sơ lưu trữ theo chuẩn dữ liệu Khí tượng Thủy văn Quốc tế (WMO & NCHMF)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition"
          >
            Đóng Kho Lưu Trữ
          </button>
        </div>
      </div>
    </div>
  );
};
