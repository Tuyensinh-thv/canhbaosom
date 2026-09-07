import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  ShieldAlert,
  Flame,
  Globe2,
  Building2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Users,
  Copy,
  Check,
  SlidersHorizontal,
  LayoutList,
  Grid
} from 'lucide-react';
import { GeoJsonWarningMap, RiskLevel, RiskType } from '../types';
import { VIETNAM_PROVINCES } from '../data/provinces';

interface AlertPanelProps {
  warningMapData: GeoJsonWarningMap | null;
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string) => void;
  activeRiskTypeFilter: RiskType | 'all';
  onChangeRiskTypeFilter: (type: RiskType | 'all') => void;
  activeLevelFilter: RiskLevel | null;
  onChangeLevelFilter: (level: RiskLevel | null) => void;
  selectedProvince?: string; // 'ALL' or province id
  onChangeProvince?: (provId: string) => void;
  isPanelCollapsed?: boolean;
  onTogglePanelCollapse?: () => void;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({
  warningMapData,
  selectedZoneId,
  onSelectZone,
  activeRiskTypeFilter,
  onChangeRiskTypeFilter,
  activeLevelFilter,
  onChangeLevelFilter,
  selectedProvince = 'ALL',
  onChangeProvince,
  isPanelCollapsed,
  onTogglePanelCollapse
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFiltersSection, setShowFiltersSection] = useState(true);
  const [denseViewMode, setDenseViewMode] = useState<'detailed' | 'compact'>('detailed');
  const [copiedReport, setCopiedReport] = useState(false);

  // Find active province object
  const activeProvinceObj = useMemo(() => {
    if (selectedProvince === 'ALL') return null;
    return VIETNAM_PROVINCES.find((p) => p.id === selectedProvince) || null;
  }, [selectedProvince]);

  // Filter features
  const filteredFeatures = useMemo(() => {
    if (!warningMapData) return [];
    let features = [...warningMapData.features];

    // Filter by Province
    if (selectedProvince !== 'ALL' && activeProvinceObj) {
      const cleanProv = activeProvinceObj.name.replace(/^Tỉnh\s+|^Thành phố\s+/i, '').toLowerCase();
      features = features.filter((f) => {
        const featProv = f.properties.province_name.replace(/^Tỉnh\s+|^Thành phố\s+/i, '').toLowerCase();
        return featProv.includes(cleanProv) || cleanProv.includes(featProv);
      });
    }

    // Filter by Risk Type
    if (activeRiskTypeFilter !== 'all') {
      features = features.filter((f) => {
        if (activeRiskTypeFilter === 'flash_flood') {
          return f.properties.overall_risk_type === 'flash_flood' || f.properties.overall_risk_type === 'combined';
        }
        if (activeRiskTypeFilter === 'landslide') {
          return f.properties.overall_risk_type === 'landslide' || f.properties.overall_risk_type === 'combined';
        }
        return true;
      });
    }

    // Filter by Level
    if (activeLevelFilter !== null) {
      features = features.filter((f) => f.properties.overall_risk_level === activeLevelFilter);
    }

    // Search filter (commune name, district, province)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      features = features.filter(
        (f) =>
          f.properties.zone_name.toLowerCase().includes(q) ||
          f.properties.district_name.toLowerCase().includes(q) ||
          f.properties.province_name.toLowerCase().includes(q)
      );
    }

    // Sort descending by risk level then probability
    features.sort((a, b) => {
      if (b.properties.overall_risk_level !== a.properties.overall_risk_level) {
        return b.properties.overall_risk_level - a.properties.overall_risk_level;
      }
      return b.properties.overall_probability - a.properties.overall_probability;
    });

    return features;
  }, [warningMapData, selectedProvince, activeProvinceObj, activeRiskTypeFilter, activeLevelFilter, searchQuery]);

  // Risk count stats for current scope
  const stats = useMemo(() => {
    if (!warningMapData) return { total: 0, c5: 0, c4: 0, c3: 0, c2: 0, c1: 0 };
    let scopeList = [...warningMapData.features];
    if (selectedProvince !== 'ALL' && activeProvinceObj) {
      const cleanProv = activeProvinceObj.name.replace(/^Tỉnh\s+|^Thành phố\s+/i, '').toLowerCase();
      scopeList = scopeList.filter((f) => {
        const featProv = f.properties.province_name.replace(/^Tỉnh\s+|^Thành phố\s+/i, '').toLowerCase();
        return featProv.includes(cleanProv) || cleanProv.includes(featProv);
      });
    }
    return {
      total: scopeList.length,
      c5: scopeList.filter((f) => f.properties.overall_risk_level === 5).length,
      c4: scopeList.filter((f) => f.properties.overall_risk_level === 4).length,
      c3: scopeList.filter((f) => f.properties.overall_risk_level === 3).length,
      c2: scopeList.filter((f) => f.properties.overall_risk_level === 2).length,
      c1: scopeList.filter((f) => f.properties.overall_risk_level === 1).length
    };
  }, [warningMapData, selectedProvince, activeProvinceObj]);

  const handleCopyReport = () => {
    if (!warningMapData) return;
    const provText = selectedProvince === 'ALL' ? 'Toàn quốc' : activeProvinceObj?.name;
    const text = `[HAEWS-VN] BÁO CÁO CẢNH BÁO THIÊN TAI\nĐịa bàn: ${provText}\nTổng số xã giám sát: ${stats.total}\n- Cấp 5 (Thảm họa): ${stats.c5}\n- Cấp 4 (Rất lớn): ${stats.c4}\n- Cấp 3 (Lớn): ${stats.c3}\n- Cấp 2 (Trung bình): ${stats.c2}\n- Cấp 1 (Thấp): ${stats.c1}\nThời gian lập: ${new Date().toLocaleString('vi-VN')}`;
    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  if (!warningMapData) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-slate-400 bg-[#001D3D] text-xs">
        <Activity className="w-4 h-4 mr-2 animate-spin text-[#F5B400]" />
        Đang nạp dữ liệu cảnh báo xã phường...
      </div>
    );
  }

  const getRiskTypeBadge = (type: RiskType) => {
    switch (type) {
      case 'flash_flood':
        return <span className="px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-600/40 text-[9px] font-bold">LŨ QUÉT</span>;
      case 'landslide':
        return <span className="px-1.5 py-0.5 rounded bg-amber-900/80 text-amber-200 border border-amber-600/40 text-[9px] font-bold">SẠT LỞ</span>;
      case 'combined':
        return <span className="px-1.5 py-0.5 rounded bg-rose-900/80 text-rose-200 border border-rose-600/40 text-[9px] font-bold">LŨ & SẠT LỞ</span>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#001D3D] border-l border-[#004B87] text-slate-100 shadow-2xl">
      {/* HEADER SECTION: COMMAND TITLE & ACTIONS */}
      <div className="p-3 border-b border-[#004B87] bg-[#002B54]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#003B73] border border-[#005BAC] flex items-center justify-center text-[#F5B400]">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-xs text-white tracking-wide uppercase">
                {selectedProvince === 'ALL' ? 'Danh Sách Địa Bàn Cảnh Báo' : activeProvinceObj?.name}
              </h2>
              <p className="text-[10px] text-sky-200/80">
                {selectedProvince === 'ALL' ? 'Toàn bộ Tỉnh / Thành Phố • Trực ban 24/7' : `Phân cấp rủi ro xã/phường (${filteredFeatures.length})`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Copy report */}
            <button
              onClick={handleCopyReport}
              className="p-1.5 rounded-lg bg-[#003B73] hover:bg-[#004B87] border border-[#005BAC] text-sky-200 hover:text-white transition text-xs"
              title="Sao chép tóm tắt tình hình báo cáo"
            >
              {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* View Mode (Detailed vs Compact) */}
            <button
              onClick={() => setDenseViewMode(denseViewMode === 'detailed' ? 'compact' : 'detailed')}
              className="p-1.5 rounded-lg bg-[#003B73] hover:bg-[#004B87] border border-[#005BAC] text-sky-200 hover:text-white transition"
              title={denseViewMode === 'detailed' ? 'Chuyển sang chế độ danh sách rút gọn' : 'Chuyển sang chế độ thẻ chi tiết'}
            >
              {denseViewMode === 'detailed' ? <LayoutList className="w-3.5 h-3.5 text-[#F5B400]" /> : <Grid className="w-3.5 h-3.5 text-[#F5B400]" />}
            </button>

            {/* Toggle Filters section */}
            <button
              onClick={() => setShowFiltersSection(!showFiltersSection)}
              className={`p-1.5 rounded-lg border transition ${
                showFiltersSection ? 'bg-[#005BAC] text-white border-sky-300' : 'bg-[#003B73] text-sky-200 border-[#005BAC] hover:text-white'
              }`}
              title={showFiltersSection ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* COLLAPSIBLE CONTROLS & FILTER BAR */}
        {showFiltersSection && (
          <div className="mt-2.5 space-y-2 pt-2 border-t border-[#003B73]">
            {/* Scope Selector: Toàn quốc vs Từng tỉnh */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onChangeProvince && onChangeProvince('ALL')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 whitespace-nowrap ${
                  selectedProvince === 'ALL'
                    ? 'bg-[#D71920] text-white shadow'
                    : 'bg-[#003B73] text-sky-200 hover:bg-[#004B87] border border-[#005BAC]'
                }`}
              >
                <Globe2 className="w-3 h-3" />
                <span>Toàn Quốc</span>
              </button>

              <div className="flex-1 relative">
                <select
                  value={selectedProvince}
                  onChange={(e) => onChangeProvince && onChangeProvince(e.target.value)}
                  className="w-full bg-[#001D3D] border border-[#005BAC] text-[11px] text-sky-200 font-medium py-1 px-2 rounded-lg focus:outline-none focus:border-[#F5B400] cursor-pointer truncate"
                >
                  <option value="ALL">-- Chọn Tỉnh / Thành --</option>
                  {VIETNAM_PROVINCES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Level Filter Badges */}
            <div className="grid grid-cols-6 gap-1 font-mono text-[10px]">
              <button
                onClick={() => onChangeLevelFilter(null)}
                className={`py-1 rounded text-center font-bold transition border ${
                  activeLevelFilter === null
                    ? 'bg-[#005BAC] text-white border-sky-300 ring-1 ring-sky-300/40'
                    : 'bg-[#002B54] text-sky-200 border-[#004B87] hover:bg-[#003B73]'
                }`}
              >
                Tất cả ({stats.total})
              </button>
              <button
                onClick={() => onChangeLevelFilter(5)}
                className={`py-1 rounded text-center font-bold transition border ${
                  activeLevelFilter === 5
                    ? 'bg-purple-600 text-white border-purple-300'
                    : 'bg-purple-950/60 text-purple-200 border-purple-900 hover:border-purple-600'
                }`}
              >
                C5 ({stats.c5})
              </button>
              <button
                onClick={() => onChangeLevelFilter(4)}
                className={`py-1 rounded text-center font-bold transition border ${
                  activeLevelFilter === 4
                    ? 'bg-red-600 text-white border-red-300'
                    : 'bg-red-950/60 text-red-200 border-red-900 hover:border-red-600'
                }`}
              >
                C4 ({stats.c4})
              </button>
              <button
                onClick={() => onChangeLevelFilter(3)}
                className={`py-1 rounded text-center font-bold transition border ${
                  activeLevelFilter === 3
                    ? 'bg-amber-600 text-white border-amber-300'
                    : 'bg-amber-950/60 text-amber-200 border-amber-900 hover:border-amber-600'
                }`}
              >
                C3 ({stats.c3})
              </button>
              <button
                onClick={() => onChangeLevelFilter(2)}
                className={`py-1 rounded text-center font-bold transition border ${
                  activeLevelFilter === 2
                    ? 'bg-yellow-500 text-black border-yellow-200 font-extrabold'
                    : 'bg-yellow-950/60 text-yellow-200 border-yellow-900 hover:border-yellow-600'
                }`}
              >
                C2 ({stats.c2})
              </button>
              <button
                onClick={() => onChangeLevelFilter(1)}
                className={`py-1 rounded text-center font-bold transition border ${
                  activeLevelFilter === 1
                    ? 'bg-sky-600 text-white border-sky-300'
                    : 'bg-sky-950/60 text-sky-200 border-sky-900 hover:border-sky-600'
                }`}
              >
                C1 ({stats.c1})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-sky-400" />
              <input
                type="text"
                placeholder="Tìm nhanh xã, phường, huyện, tỉnh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#001D3D] border border-[#004B87] rounded-lg pl-7 pr-3 py-1 text-xs text-white placeholder-sky-400/60 focus:outline-none focus:border-[#F5B400]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1.5 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* COMMUNE / WARD ALERTS LIST */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2 custom-scrollbar">
        {filteredFeatures.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs">
            <ShieldCheck className="w-8 h-8 text-sky-400 mb-2" />
            <p className="font-semibold text-white">Không có xã/phường nào phù hợp bộ lọc</p>
            <p className="mt-1 text-slate-400">Thử xóa bộ lọc cấp độ hoặc chuyển sang phạm vi toàn quốc</p>
          </div>
        ) : (
          filteredFeatures.map((feature) => {
            const props = feature.properties;
            const isSelected = selectedZoneId === feature.id;

            if (denseViewMode === 'compact') {
              /* DENSE COMPACT ROW */
              return (
                <div
                  key={feature.id}
                  onClick={() => onSelectZone(feature.id)}
                  className={`px-2.5 py-1.5 rounded-lg border transition cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-[#003B73] border-[#F5B400] shadow-md ring-1 ring-[#F5B400]'
                      : 'bg-[#002244] border-[#003B73] hover:border-sky-500 hover:bg-[#002B54]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      style={{ backgroundColor: props.color }}
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    />
                    <div className="truncate">
                      <span className="font-bold text-xs text-white truncate block">{props.zone_name}</span>
                      <span className="text-[10px] text-sky-200/80 truncate block">{props.district_name}, {props.province_name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-mono text-[10px] text-sky-300">{props.rainfall_1h}mm</span>
                    <span
                      style={{
                        backgroundColor: props.color,
                        color: props.overall_risk_level === 2 ? '#000' : '#fff'
                      }}
                      className="px-1.5 py-0.5 rounded text-[10px] font-extrabold font-mono"
                    >
                      C{props.overall_risk_level}
                    </span>
                  </div>
                </div>
              );
            }

            /* DETAILED CARD VIEW */
            return (
              <div
                key={feature.id}
                onClick={() => onSelectZone(feature.id)}
                className={`p-2.5 rounded-xl border transition cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#003B73] border-[#F5B400] shadow-xl ring-2 ring-[#F5B400]/80'
                    : 'bg-[#002244] border-[#003B73] hover:border-sky-400 hover:bg-[#002B54]'
                }`}
              >
                {/* Risk Level Badge & Header */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-white">{props.zone_name}</span>
                      {props.overall_risk_level >= 4 && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-sky-200/80 mt-0.5 flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-[#F5B400]" />
                      {props.district_name}, {props.province_name}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      style={{
                        backgroundColor: props.color,
                        color: props.overall_risk_level === 2 ? '#000' : '#fff'
                      }}
                      className="px-2 py-0.5 rounded font-extrabold text-[10px] uppercase shadow-sm"
                    >
                      CẤP {props.overall_risk_level}
                    </span>
                    {getRiskTypeBadge(props.overall_risk_type)}
                  </div>
                </div>

                {/* Hydro-Meteorological Telemetry Grid */}
                <div className="grid grid-cols-4 gap-1 bg-[#001D3D] p-1.5 rounded-lg border border-[#004B87] font-mono text-[10px] mb-1.5">
                  <div>
                    <span className="text-[9px] text-sky-300/80 block">Mưa 1h</span>
                    <span className="font-bold text-sky-200">{props.rainfall_1h} mm</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-sky-300/80 block">Mưa 24h</span>
                    <span className="font-bold text-sky-200">{props.rainfall_24h} mm</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-sky-300/80 block">Ẩm đất</span>
                    <span className="font-bold text-amber-300">{props.soil_saturation_percent}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-sky-300/80 block">Xác suất</span>
                    <span className="font-bold text-rose-300">{(props.overall_probability * 100).toFixed(0)}%</span>
                  </div>
                </div>

                {/* Triggers & Safety Note */}
                <div className="flex items-center justify-between text-[10px] text-sky-200/80 pt-1 border-t border-[#003B73]">
                  <span className="truncate max-w-[200px]">
                    ⚡ {props.trigger_detail}
                  </span>
                  <span className="text-[#F5B400] font-mono font-bold text-[9px]">
                    ⏱️ {props.lead_time_status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FOOTER BAR: SUMMARY & REALTIME INDICATOR */}
      <div className="p-2 border-t border-[#004B87] bg-[#002B54] flex items-center justify-between text-[11px] text-sky-200">
        <span className="font-mono">
          Hiển thị: <b>{filteredFeatures.length}</b> địa bàn
        </span>
        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Dữ liệu trực tiếp
        </span>
      </div>
    </div>
  );
};
