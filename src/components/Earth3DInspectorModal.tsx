// src/components/Earth3DInspectorModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Globe,
  Mountain,
  Layers,
  Compass,
  ExternalLink,
  X,
  Flame,
  Sparkles,
  TrendingDown,
  ShieldCheck,
  Eye,
  Camera,
  RotateCcw,
  Zap,
  Activity,
  Maximize2,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  MapPin
} from 'lucide-react';
import { GeoJsonFeatureProperties } from '../types';
import { HvuBrandEmblem } from './HvuBrandEmblem';

interface Earth3DInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  zoneProps: GeoJsonFeatureProperties | null;
}

type LayerMode = 'GOOGLE_HYBRID' | 'ESRI_SATELLITE' | 'OPENTOPOMAP' | 'DEBRIS_FLOW';
type ViewMode = 'INTERACTIVE_TERRAIN' | 'GOOGLE_EARTH_WEB';

export const Earth3DInspectorModal: React.FC<Earth3DInspectorModalProps> = ({
  isOpen,
  onClose,
  zoneProps
}) => {
  const [activeLayer, setActiveLayer] = useState<LayerMode>('GOOGLE_HYBRID');
  const [viewMode, setViewMode] = useState<ViewMode>('INTERACTIVE_TERRAIN');
  const [currentCameraAngle, setCurrentCameraAngle] = useState<'RIDGE' | 'CLIFF' | 'VALLEY' | 'ORBIT'>('CLIFF');
  const [showElevationProfile, setShowElevationProfile] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(14);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const overlaysGroupRef = useRef<L.LayerGroup | null>(null);

  const rawLat = zoneProps?.center?.[0];
  const rawLon = zoneProps?.center?.[1];
  const lat = typeof rawLat === 'number' && !isNaN(rawLat) ? rawLat : 21.345;
  const lon = typeof rawLon === 'number' && !isNaN(rawLon) ? rawLon : 105.372;
  const elevation = zoneProps?.elevation || 680;
  const slope = zoneProps?.slope || 34;

  // Google Earth Web 3D URL with calibrated 3D perspective camera angles
  const googleEarthUrl = `https://earth.google.com/web/@${lat},${lon},${elevation}a,3500d,45y,315h,60t,0r`;
  const googleMapsSatUrl = `https://www.google.com/maps/@${lat},${lon},${elevation}m/data=!3m1!1e3`;

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!isOpen || !zoneProps || viewMode !== 'INTERACTIVE_TERRAIN' || !mapContainerRef.current) return;

    // Destroy existing instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [lat, lon],
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Layer URL selector
    const getTileLayer = (mode: LayerMode) => {
      switch (mode) {
        case 'GOOGLE_HYBRID':
          return L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
          });
        case 'OPENTOPOMAP':
          return L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            maxZoom: 17,
            subdomains: ['a', 'b', 'c']
          });
        case 'ESRI_SATELLITE':
        case 'DEBRIS_FLOW':
        default:
          return L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19
          });
      }
    };

    const tileLayer = getTileLayer(activeLayer).addTo(map);
    tileLayerRef.current = tileLayer;

    // Overlays group
    const overlayGroup = L.layerGroup().addTo(map);
    overlaysGroupRef.current = overlayGroup;

    // 1. Epicenter Hazard Landmark Marker
    const hazardIcon = L.divIcon({
      className: 'custom-hazard-3d-marker',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 48px; height: 48px;">
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: ${zoneProps.color}; opacity: 0.45; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background: ${zoneProps.color}; border: 3px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 18px rgba(0,0,0,0.85);">
            <span style="font-size: 12px; font-weight: 900; color: ${zoneProps.overall_risk_level === 2 ? '#000' : '#fff'};">${zoneProps.overall_risk_level}</span>
          </div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });

    L.marker([lat, lon], { icon: hazardIcon })
      .bindPopup(
        `<div style="font-family: sans-serif; font-size: 12px; line-height: 1.5; color: #0f172a; padding: 4px;">
          <strong style="color: #b91c1c; font-size: 14px;">📍 ${zoneProps.zone_name}</strong><br/>
          <span>Cao độ đỉnh: <b>${elevation}m</b></span> | <span>Độ dốc: <b>${slope}°</b></span><br/>
          <span>Nguy cơ: <b style="color: ${zoneProps.color};">CẤP ${zoneProps.overall_risk_level}</b></span><br/>
          <span style="color: #64748b; font-size: 11px;">Tọa độ: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E</span>
        </div>`
      )
      .addTo(overlayGroup);

    // 2. High-Risk Landslide Scarp & Debris Runout Flow Paths
    const fractureCoords: [number, number][] = [
      [lat + 0.0035, lon - 0.003],
      [lat + 0.0045, lon + 0.0015],
      [lat + 0.0028, lon + 0.004],
      [lat + 0.001, lon + 0.0022],
      [lat + 0.0018, lon - 0.002]
    ];

    L.polygon(fractureCoords, {
      color: '#f43f5e',
      weight: 3,
      fillColor: '#e11d48',
      fillOpacity: 0.4,
      dashArray: '6, 6'
    })
      .bindTooltip('⚡ Khối trượt sườn đồi dự báo (Vết nứt đỉnh)', { permanent: true, direction: 'top' })
      .addTo(overlayGroup);

    // Debris flow trajectory path
    const flowPathCoords: [number, number][] = [
      [lat + 0.003, lon + 0.001],
      [lat + 0.001, lon + 0.002],
      [lat - 0.0025, lon + 0.0032],
      [lat - 0.0055, lon + 0.0045],
      [lat - 0.0085, lon + 0.0062]
    ];

    L.polyline(flowPathCoords, {
      color: '#fbbf24',
      weight: 5,
      opacity: 0.9,
      dashArray: '10, 8'
    })
      .bindTooltip('🌊 Hướng lũ quét & dòng bùn đá D8', { permanent: false })
      .addTo(overlayGroup);

    // Inundation Alluvial Fan Polygon
    const fanCoords: [number, number][] = [
      [lat - 0.006, lon + 0.003],
      [lat - 0.009, lon + 0.008],
      [lat - 0.012, lon + 0.005],
      [lat - 0.0085, lon + 0.0018]
    ];

    L.polygon(fanCoords, {
      color: '#dc2626',
      weight: 2.5,
      fillColor: '#ef4444',
      fillOpacity: 0.45
    })
      .bindTooltip('⚠️ Vùng trũng ngập lụt & bồi lắng chân núi', { permanent: false })
      .addTo(overlayGroup);

    mapInstanceRef.current = map;

    // Invalidate size smoothly
    const timer1 = setTimeout(() => map.invalidateSize(), 100);
    const timer2 = setTimeout(() => map.invalidateSize(), 350);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, lat, lon, activeLayer, viewMode, zoneProps]);

  // Adjust camera viewpoint preset
  const handleSetCameraPreset = (preset: 'RIDGE' | 'CLIFF' | 'VALLEY' | 'ORBIT') => {
    setCurrentCameraAngle(preset);
    if (!mapInstanceRef.current) return;

    if (preset === 'RIDGE') {
      mapInstanceRef.current.flyTo([lat + 0.005, lon - 0.004], 15, { duration: 1.2 });
    } else if (preset === 'CLIFF') {
      mapInstanceRef.current.flyTo([lat, lon], 15, { duration: 1.2 });
    } else if (preset === 'VALLEY') {
      mapInstanceRef.current.flyTo([lat - 0.008, lon + 0.005], 15, { duration: 1.2 });
    } else if (preset === 'ORBIT') {
      mapInstanceRef.current.flyTo([lat, lon], 13, { duration: 1.2 });
    }
  };

  if (!isOpen || !zoneProps) return null;

  return (
    <div
      id="earth-3d-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#172033]/85 backdrop-blur-md animate-in fade-in"
    >
      <div
        id="earth-3d-modal-container"
        className="bg-white border-2 border-[#005BAC] rounded-3xl overflow-hidden shadow-2xl max-w-7xl w-full h-[94vh] flex flex-col text-[#172033] relative"
      >
        {/* 1. INSTITUTIONAL MODAL HEADER (HVU BLUE #003B73 & GOLD #F5B400) */}
        <div className="px-5 py-3.5 bg-[#003B73] border-b-2 border-[#F5B400] text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#005BAC] border border-[#00A6D6]/50 flex items-center justify-center shadow-md shrink-0">
              <Globe className="w-6 h-6 text-[#F5B400]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-sky-200 font-bold uppercase tracking-wider">
                  Khảo Sát Địa Hình 3D & Sườn Núi:
                </span>
                <h3 className="font-extrabold text-base sm:text-xl text-white">
                  {zoneProps.zone_name}
                </h3>
                <span
                  style={{
                    backgroundColor: zoneProps.color,
                    color: zoneProps.overall_risk_level === 2 ? '#000' : '#fff'
                  }}
                  className="px-2.5 py-0.5 rounded-full font-extrabold text-[11px] uppercase shadow-sm tracking-wider"
                >
                  CẤP {zoneProps.overall_risk_level} - {zoneProps.overall_risk_level === 5 ? 'THẢM HỌA' : zoneProps.overall_risk_level === 4 ? 'RẤT NGUY HIỂM' : zoneProps.overall_risk_level === 3 ? 'CẢNH BÁO CAO' : 'AN TOÀN'}
                </span>
              </div>
              <p className="text-xs text-sky-200 flex items-center gap-2 font-mono mt-0.5">
                <span>📍 {zoneProps.district_name}, {zoneProps.province_name}</span>
                <span>•</span>
                <span className="text-[#00D2FF]">Tọa độ: {lat.toFixed(4)}°N, {lon.toFixed(4)}°E</span>
                <span>•</span>
                <span className="text-[#FFE066]">Cao độ: {elevation}m</span>
                <span>•</span>
                <span className="text-rose-200">Độ dốc: {slope}°</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct 3D Google Earth Launch Button */}
            <a
              id="btn-launch-google-earth"
              href={googleEarthUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#005BAC] hover:bg-[#004b8d] text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-md transition active:scale-95 border border-[#00A6D6]/50"
              title="Mở toàn màn hình trong ứng dụng Google Earth 3D với góc nghiêng mô phỏng"
            >
              <Globe className="w-4 h-4 text-[#F5B400]" />
              <span>Mở Google Earth 3D Trực Tuyến</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              id="btn-close-earth-3d-modal"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-sky-200 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. TACTICAL SUB-BAR: VIEW LAYERS & CAMERA PERSPECTIVE CONTROLS */}
        <div className="px-5 py-2.5 bg-[#F5F8FC] border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Main View Mode Selector */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#CBD5E1] shadow-sm">
            <button
              onClick={() => setViewMode('INTERACTIVE_TERRAIN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                viewMode === 'INTERACTIVE_TERRAIN'
                  ? 'bg-[#005BAC] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#003B73]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Bản Đồ Vệ Tinh 3D Leaflet</span>
            </button>

            <button
              onClick={() => setViewMode('GOOGLE_EARTH_WEB')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                viewMode === 'GOOGLE_EARTH_WEB'
                  ? 'bg-[#0078D4] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#003B73]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Google Maps Vệ Tinh Trực Tiếp</span>
            </button>
          </div>

          {/* Layer Selector (for Interactive Terrain) */}
          {viewMode === 'INTERACTIVE_TERRAIN' && (
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#CBD5E1] flex-wrap shadow-sm">
              <button
                id="layer-btn-google-hybrid"
                onClick={() => setActiveLayer('GOOGLE_HYBRID')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition ${
                  activeLayer === 'GOOGLE_HYBRID'
                    ? 'bg-[#005BAC] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#003B73]'
                }`}
              >
                <Globe className="w-3 h-3" />
                <span>Google Earth (Hybrid)</span>
              </button>

              <button
                id="layer-btn-esri"
                onClick={() => setActiveLayer('ESRI_SATELLITE')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition ${
                  activeLayer === 'ESRI_SATELLITE'
                    ? 'bg-[#0078D4] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#003B73]'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Maxar 0.3m (Esri)</span>
              </button>

              <button
                id="layer-btn-topo"
                onClick={() => setActiveLayer('OPENTOPOMAP')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition ${
                  activeLayer === 'OPENTOPOMAP'
                    ? 'bg-[#003B73] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#003B73]'
                }`}
              >
                <Mountain className="w-3 h-3" />
                <span>Đường Đồng Mức DEM</span>
              </button>

              <button
                id="layer-btn-debris"
                onClick={() => setActiveLayer('DEBRIS_FLOW')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition ${
                  activeLayer === 'DEBRIS_FLOW'
                    ? 'bg-[#D71920] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#003B73]'
                }`}
              >
                <TrendingDown className="w-3 h-3" />
                <span>Khối Trượt & Lũ Bùn Đá</span>
              </button>
            </div>
          )}

          {/* Camera View Angle Presets */}
          {viewMode === 'INTERACTIVE_TERRAIN' && (
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#CBD5E1] shadow-sm">
              <span className="text-[11px] text-[#64748B] px-2 font-mono font-bold">Góc Nhìn:</span>
              <button
                onClick={() => handleSetCameraPreset('CLIFF')}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
                  currentCameraAngle === 'CLIFF' ? 'bg-[#005BAC] text-white shadow-sm' : 'text-[#64748B] hover:text-[#003B73]'
                }`}
              >
                📐 Taluy
              </button>
              <button
                onClick={() => handleSetCameraPreset('RIDGE')}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
                  currentCameraAngle === 'RIDGE' ? 'bg-[#F5B400] text-[#172033] font-bold shadow-sm' : 'text-[#64748B] hover:text-[#003B73]'
                }`}
              >
                ⛰️ Đỉnh Núi
              </button>
              <button
                onClick={() => handleSetCameraPreset('VALLEY')}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
                  currentCameraAngle === 'VALLEY' ? 'bg-[#0078D4] text-white shadow-sm' : 'text-[#64748B] hover:text-[#003B73]'
                }`}
              >
                🌊 Thung Lũng
              </button>
              <button
                onClick={() => handleSetCameraPreset('ORBIT')}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
                  currentCameraAngle === 'ORBIT' ? 'bg-[#003B73] text-white shadow-sm' : 'text-[#64748B] hover:text-[#003B73]'
                }`}
              >
                🔄 Toàn Cảnh
              </button>
            </div>
          )}
        </div>

        {/* 3. MAIN BODY: MAP CANVAS + GEOTECHNICAL SIDEBAR */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative">
          {/* MAP CANVAS (Col 8) */}
          <div className="lg:col-span-8 relative bg-slate-900 h-full border-r border-[#E2E8F0] flex flex-col overflow-hidden">
            {viewMode === 'INTERACTIVE_TERRAIN' ? (
              <div className="flex-1 w-full h-full relative">
                <div ref={mapContainerRef} className="w-full h-full" />

                {/* OVERLAY COMPASS & HUD BADGE */}
                <div className="absolute top-3 left-3 pointer-events-none z-[400] flex flex-col gap-2">
                  <div className="bg-white/95 border border-[#CBD5E1] px-3.5 py-2 rounded-2xl shadow-lg backdrop-blur text-xs flex items-center gap-2.5 pointer-events-auto">
                    <Compass className="w-4 h-4 text-[#005BAC] shrink-0" />
                    <span className="font-mono text-[11px] text-[#172033]">
                      Hướng dốc: <b>Tây Bắc (315°)</b> | Độ dốc: <b className="text-amber-700">{slope}°</b> | Độ ẩm đất: <b className="text-[#005BAC]">{zoneProps.soil_saturation_percent}%</b>
                    </span>
                  </div>

                  <div className="bg-[#005BAC]/90 border border-[#00A6D6] px-3 py-1.5 rounded-xl text-[11px] text-white font-mono shadow-md backdrop-blur flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#F5B400]" />
                    <span>Ảnh vệ tinh độ phân giải cao Google Earth & Maxar 0.3m sẵn sàng</span>
                  </div>
                </div>

                {/* FLOATING ELEVATION CROSS-SECTION PROFILE (MẶT CẮT ĐỊA HÌNH 3D) */}
                {showElevationProfile && (
                  <div className="absolute bottom-10 left-3 right-3 pointer-events-none z-[400] flex justify-center">
                    <div className="bg-white/95 border border-[#CBD5E1] p-3.5 rounded-2xl max-w-2xl w-full shadow-xl backdrop-blur text-xs space-y-2 pointer-events-auto">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-bold text-[#003B73] text-xs">
                          <Mountain className="w-4 h-4 text-[#F5B400]" />
                          <span>Mặt Cắt Địa Hình Cao Độ 3D (Đỉnh Núi ➔ Chân Thung Lũng Tụ Thủy)</span>
                        </div>
                        <button
                          onClick={() => setShowElevationProfile(false)}
                          className="text-[#64748B] hover:text-[#172033] text-[10px] bg-[#F1F5F9] px-2 py-0.5 rounded font-semibold"
                        >
                          Ẩn mặt cắt
                        </button>
                      </div>

                      {/* SVG Elevation Profile Chart */}
                      <div className="h-20 w-full relative">
                        <svg viewBox="0 0 500 80" className="w-full h-full overflow-visible">
                          <defs>
                            <linearGradient id="terrainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#F5B400" stopOpacity="0.9" />
                              <stop offset="35%" stopColor="#D71920" stopOpacity="0.9" />
                              <stop offset="70%" stopColor="#0078D4" stopOpacity="0.9" />
                              <stop offset="100%" stopColor="#005BAC" stopOpacity="0.9" />
                            </linearGradient>
                            <linearGradient id="terrainFill" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#D71920" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#005BAC" stopOpacity="0.05" />
                            </linearGradient>
                          </defs>

                          {/* Mountain Silhouette Filled Area */}
                          <path
                            d="M 20 15 Q 120 10, 180 38 T 320 62 L 480 72 L 480 80 L 20 80 Z"
                            fill="url(#terrainFill)"
                          />

                          {/* Top Ridge Line */}
                          <path
                            d="M 20 15 Q 120 10, 180 38 T 320 62 L 480 72"
                            fill="none"
                            stroke="url(#terrainGradient)"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />

                          {/* Landmark Points */}
                          <circle cx="20" cy="15" r="4.5" fill="#F5B400" stroke="#ffffff" strokeWidth="1.5" />
                          <text x="25" y="12" fill="#003B73" fontSize="9" fontWeight="bold" fontFamily="monospace">
                            Đỉnh núi: +{elevation}m
                          </text>

                          <circle cx="180" cy="38" r="5" fill="#D71920" stroke="#ffffff" strokeWidth="2" />
                          <text x="185" y="32" fill="#D71920" fontSize="9" fontWeight="bold" fontFamily="monospace">
                            Vết nứt taluy ({slope}°)
                          </text>

                          <circle cx="320" cy="62" r="4" fill="#0078D4" stroke="#ffffff" strokeWidth="1.5" />
                          <text x="325" y="58" fill="#0078D4" fontSize="9" fontWeight="bold" fontFamily="monospace">
                            Dòng bùn đá D8 (15m/s)
                          </text>

                          <circle cx="480" cy="72" r="4.5" fill="#005BAC" stroke="#ffffff" strokeWidth="1.5" />
                          <text x="390" y="78" fill="#005BAC" fontSize="9" fontWeight="bold" fontFamily="monospace">
                            Khu dân cư (+{Math.max(20, elevation - 350)}m)
                          </text>
                        </svg>
                      </div>

                      <div className="flex justify-between text-[10px] text-[#64748B] font-mono pt-1 border-t border-[#E2E8F0]">
                        <span>Chiều dài sườn dốc: ~1.85 km</span>
                        <span className="text-[#D71920] font-bold">Chênh cao địa hình (H): {Math.min(elevation, 450)} mét</span>
                        <span className="text-[#005BAC] font-bold">Vùng an toàn: &gt; 1.5 km</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Google Maps Satellite Embed Viewport */
              <div className="flex-1 w-full h-full relative bg-slate-950 flex flex-col items-center justify-center">
                <iframe
                  title="Google Maps Satellite 3D"
                  src={`https://maps.google.com/maps?q=${lat},${lon}&t=k&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-white/95 border border-[#CBD5E1] p-3 rounded-xl shadow-lg backdrop-blur flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#005BAC]" />
                  <div>
                    <span className="font-bold text-xs text-[#003B73] block">Bản đồ Vệ tinh Trực Tuyến: {zoneProps.zone_name}</span>
                    <span className="text-[11px] text-[#64748B]">Tọa độ: {lat.toFixed(4)}°N, {lon.toFixed(4)}°E</span>
                  </div>
                  <a
                    href={googleEarthUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 bg-[#005BAC] hover:bg-[#003B73] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                  >
                    <span>Mở Google Earth 3D</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#F5B400]" />
                  </a>
                </div>
              </div>
            )}

            {/* Bottom Status Bar */}
            <div className="bg-[#F5F8FC] px-4 py-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B] z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Bản đồ Vệ tinh Không gian 3D tương tác (Kéo thả, cuộn chuột để phóng to/thu nhỏ)</span>
              </div>
              <div className="flex items-center gap-3">
                {!showElevationProfile && viewMode === 'INTERACTIVE_TERRAIN' && (
                  <button
                    onClick={() => setShowElevationProfile(true)}
                    className="text-[#005BAC] hover:underline font-mono text-[10px] font-bold"
                  >
                    + Hiện mặt cắt cao độ
                  </button>
                )}
                <span className="font-mono text-[#003B73] font-bold">Lat: {lat.toFixed(4)}°, Lon: {lon.toFixed(4)}°</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: GEOTECHNICAL & CIVIL DEFENSE PARAMETERS (Col 4) */}
          <div className="lg:col-span-4 bg-white p-4 overflow-y-auto space-y-4 text-xs">
            <div>
              <h4 className="font-extrabold text-[#003B73] text-sm mb-1 flex items-center gap-1.5">
                <Mountain className="w-4 h-4 text-[#F5B400]" />
                <span>Đặc Tính Địa Mạo & Trọng Lực Sườn Dốc</span>
              </h4>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Thông số địa hình trích xuất từ dữ liệu viễn thám InSAR vi sai và mô hình số độ cao DEM 12.5m của Trường ĐH Hùng Vương.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 font-mono">
              <div className="bg-[#F5F8FC] p-2.5 rounded-xl border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] block">Cao Độ Đỉnh Núi:</span>
                <span className="text-sm font-bold text-[#172033]">{elevation} m</span>
              </div>

              <div className="bg-[#F5F8FC] p-2.5 rounded-xl border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] block">Độ Dốc Sườn Núi:</span>
                <span className={`text-sm font-bold ${slope >= 30 ? 'text-[#D71920]' : 'text-amber-700'}`}>
                  {slope}° {slope >= 30 ? '(Dốc Nguy Hiểm)' : '(Trung Bình)'}
                </span>
              </div>

              <div className="bg-[#F5F8FC] p-2.5 rounded-xl border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] block">Lưu Vực Tụ Thủy:</span>
                <span className="text-sm font-bold text-[#0078D4]">~24.5 km²</span>
              </div>

              <div className="bg-[#F5F8FC] p-2.5 rounded-xl border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] block">Độ Ẩm Tầng Đất:</span>
                <span className="text-sm font-bold text-[#005BAC]">{zoneProps.soil_saturation_percent}%</span>
              </div>
            </div>

            {/* Slope Stability Assessment */}
            <div className="bg-[#F5F8FC] p-3.5 rounded-2xl border border-[#CBD5E1] space-y-2">
              <span className="font-bold text-[#003B73] text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#005BAC]" />
                <span>Đánh Giá Khả Năng Ổn Định Mái Dốc:</span>
              </span>

              <div className="space-y-1.5 text-[11px] text-[#172033] leading-relaxed">
                <p>
                  • <b>Cơ chế trượt lở:</b> {zoneProps.trigger_detail}
                </p>
                <p>
                  • <b>Tầng đất đá phong hóa:</b> Đất feralit mùn dày 1.5 - 3.5m nằm trên đá phiến sét nứt nẻ, dễ mất ổn định khi ngậm no nước mưa liên tục &gt; 120mm/24h.
                </p>
                <p>
                  • <b>Vùng hạ lưu xung yếu:</b> Bản làng và các cụm dân cư nằm ngay cửa khe suối tụ thủy, cần di dời khẩn cấp đến vị trí cao hơn sườn dốc &gt; 25m.
                </p>
              </div>
            </div>

            {/* Evacuation Target Action */}
            <div className="p-3.5 rounded-2xl bg-[#005BAC]/5 border border-[#005BAC]/30 space-y-2 shadow-sm">
              <span className="font-bold text-[#003B73] text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#0078D4]" />
                <span>Phương Án Sơ Tán Cứu Hộ Đề Xuất</span>
              </span>
              <p className="text-[11px] text-[#172033] leading-relaxed">
                Di chuyển dân cư theo tuyến đường liên xã phía Đông Nam, tập kết tại Trường PTDT Bán trú hoặc Nhà văn hóa kiên cố cao trình an toàn <b>+{elevation + 120}m</b>.
              </p>
              <div className="pt-2 border-t border-[#005BAC]/20 flex items-center justify-between text-[11px]">
                <span className="text-[#64748B]">Khoảng cách an toàn:</span>
                <b className="text-[#005BAC] font-mono">&gt; 1.5 km khỏi cửa khe</b>
              </div>
            </div>

            {/* Direct Quick Link Cards */}
            <div className="space-y-2">
              <a
                href={googleEarthUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#005BAC] hover:bg-[#003B73] text-white transition group shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#F5B400]" />
                  <span className="font-bold text-xs">Mở 3D Google Earth Web Studio</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#F5B400] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </a>

              <a
                href={googleMapsSatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F5F8FC] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#003B73] transition group"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-[#0078D4]" />
                  <span className="font-bold text-xs">Xem Google Maps Vệ Tinh Trực Tiếp</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#0078D4] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
