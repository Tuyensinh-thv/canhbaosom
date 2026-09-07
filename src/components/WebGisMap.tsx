import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import {
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  Compass,
  CloudRain,
  Eye,
  Globe2,
  Building2,
  X,
  AlertTriangle,
  Flame,
  ShieldCheck,
  RefreshCw,
  SlidersHorizontal,
  Radio,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronDown,
  EyeOff,
  Navigation,
  Crosshair,
  Maximize,
  Minimize,
  Mountain,
  Satellite,
  Sun,
  Moon,
  Waves,
  Grid
} from 'lucide-react';
import { GeoJsonWarningMap, RainfallStation, RiskLevel, RiskType, RegionScope, SystemMode } from '../types';
import { VIETNAM_PROVINCES, ProvinceInfo } from '../data/provinces';
import { VIETNAM_COMMUNES_DIRECTORY, CommuneRecord } from '../data/communes_directory';

export type BaseMapStyle = 'topo' | 'satellite_hybrid' | 'tactical_navy' | 'light_command' | 'dark_radar';

interface WebGisMapProps {
  warningMapData: GeoJsonWarningMap | null;
  stations: RainfallStation[];
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string) => void;
  activeRiskTypeFilter: RiskType | 'all';
  activeLevelFilter: RiskLevel | null;
  activeRegion?: RegionScope;
  onChangeRegion?: (region: RegionScope) => void;
  selectedProvince?: string; // 'ALL' or province id e.g. 'phu_tho', 'yen_bai'
  onSelectProvince?: (provId: string) => void;
  systemMode?: SystemMode;
  onToggleMode?: (mode: SystemMode) => void;
  onSyncLive?: () => Promise<void> | void;
  isSyncingLive?: boolean;
}

const REGION_BOUNDS: Record<RegionScope, { center: [number, number]; zoom: number; label: string; desc: string }> = {
  ALL: {
    center: [16.2, 106.8],
    zoom: 6,
    label: 'Toàn Quốc (Toàn Bộ Tỉnh/Thành)',
    desc: 'Bản đồ Giám sát Cảnh báo Thiên tai Toàn lãnh thổ Việt Nam'
  },
  BAC_BO: {
    center: [21.8, 104.6],
    zoom: 7.8,
    label: 'Bắc Bộ',
    desc: 'Khu vực Miền núi Phía Bắc & Đồng bằng Sông Hồng'
  },
  TRUNG_BO: {
    center: [16.2, 107.6],
    zoom: 7.4,
    label: 'Miền Trung',
    desc: 'Bắc Trung Bộ & Duyên hải Nam Trung Bộ'
  },
  TAY_NGUYEN: {
    center: [13.0, 108.0],
    zoom: 7.5,
    label: 'Tây Nguyên',
    desc: 'Khu vực Cao nguyên Đắk Lắk, Gia Lai, Kon Tum, Lâm Đồng, Đắk Nông'
  },
  NAM_BO: {
    center: [10.2, 105.8],
    zoom: 7.8,
    label: 'Nam Bộ & ĐBSCL',
    desc: 'Đông Nam Bộ & Đồng bằng Sông Cửu Long'
  }
};

// Major Doppler Radars in Vietnam & Maritime perimeter
const DOPPLER_RADAR_STATIONS = [
  { id: 'R-HN', name: 'Radar Đông Anh (Hà Nội)', center: [21.136, 105.845] as [number, number], radiusKm: 250 },
  { id: 'R-PL', name: 'Radar Phù Liễn (Hải Phòng)', center: [20.803, 106.633] as [number, number], radiusKm: 250 },
  { id: 'R-VN', name: 'Radar Việt Trì (Phú Thọ)', center: [21.322, 105.401] as [number, number], radiusKm: 200 },
  { id: 'R-DN', name: 'Radar Sơn Trà (Đà Nẵng)', center: [16.121, 108.283] as [number, number], radiusKm: 280 },
  { id: 'R-SG', name: 'Radar Nhà Bè (TP.HCM)', center: [10.662, 106.741] as [number, number], radiusKm: 250 },
  { id: 'R-HK', name: 'Radar Hải Khẩu (Hải Nam)', center: [20.044, 110.34] as [number, number], radiusKm: 300 }
];

// Major Key River Basin Paths
const KEY_RIVER_SYSTEMS = [
  {
    name: 'Hệ thống Sông Hồng - Sông Thao',
    color: '#0284c7',
    coords: [
      [22.85, 103.35],
      [22.48, 103.97],
      [21.72, 104.91],
      [21.31, 105.41],
      [21.05, 105.86],
      [20.45, 106.35],
      [20.27, 106.56]
    ] as [number, number][]
  },
  {
    name: 'Hệ thống Sông Đà (Hòa Bình - Sơn La - Lai Châu)',
    color: '#0ea5e9',
    coords: [
      [22.45, 102.85],
      [22.05, 103.15],
      [21.45, 103.95],
      [20.81, 105.33],
      [21.28, 105.35]
    ] as [number, number][]
  },
  {
    name: 'Hệ thống Sông Lô - Sông Gâm',
    color: '#38bdf8',
    coords: [
      [23.15, 104.98],
      [22.82, 104.98],
      [22.15, 105.02],
      [21.75, 105.22],
      [21.32, 105.41]
    ] as [number, number][]
  },
  {
    name: 'Hệ thống Sông Mã - Sông Chu',
    color: '#06b6d4',
    coords: [
      [21.35, 103.55],
      [20.85, 104.15],
      [20.25, 105.25],
      [19.82, 105.85],
      [19.78, 105.92]
    ] as [number, number][]
  },
  {
    name: 'Hệ thống Sông Mekong (Tiền Giang & Hậu Giang)',
    color: '#0284c7',
    coords: [
      [10.95, 105.15],
      [10.75, 105.35],
      [10.35, 105.85],
      [10.25, 106.35],
      [9.75, 106.65]
    ] as [number, number][]
  }
];

export const WebGisMap: React.FC<WebGisMapProps> = ({
  warningMapData,
  stations,
  selectedZoneId,
  onSelectZone,
  activeRiskTypeFilter,
  activeLevelFilter,
  activeRegion = 'ALL',
  onChangeRegion,
  selectedProvince = 'ALL',
  onSelectProvince,
  systemMode = 'REAL_TIME',
  onToggleMode,
  onSyncLive,
  isSyncingLive = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayersRef = useRef<L.Layer[]>([]);
  const polygonLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const stationsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const labelsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const communesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const radarSweepLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const riversLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const tacticalGridLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Tactical Controls State - Default to 'topo' (Vivid 3D Topographic Terrain) for high visual impression!
  const [baseMapType, setBaseMapType] = useState<BaseMapStyle>('topo');
  const [showStations, setShowStations] = useState<boolean>(true);
  const [showPolygons, setShowPolygons] = useState<boolean>(true);
  const [showCommuneLabels, setShowCommuneLabels] = useState<boolean>(true);
  const [showCommunesLayer, setShowCommunesLayer] = useState<boolean>(true);
  const [showRadarSweeps, setShowRadarSweeps] = useState<boolean>(true);
  const [showRiversLayer, setShowRiversLayer] = useState<boolean>(true);
  const [showTacticalGrid, setShowTacticalGrid] = useState<boolean>(false);

  const [selectedCommuneId, setSelectedCommuneId] = useState<string | null>(null);
  const [communeSearchTerm, setCommuneSearchTerm] = useState<string>('');
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const [showHotspotsTicker, setShowHotspotsTicker] = useState<boolean>(true);
  const [emergencyOnly, setEmergencyOnly] = useState<boolean>(false);
  const [showLayerPanel, setShowLayerPanel] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [cleanViewMode, setCleanViewMode] = useState<boolean>(false);
  const [currentZoom, setCurrentZoom] = useState<number>(6);
  const [currentRegion, setCurrentRegion] = useState<RegionScope>(activeRegion);
  const [currentProvinceId, setCurrentProvinceId] = useState<string>(selectedProvince);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [16.2, 106.8],
      zoom: 6,
      minZoom: 5,
      maxZoom: 18,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initialize layer groups in order of depth
    tacticalGridLayerGroupRef.current = L.layerGroup().addTo(map);
    riversLayerGroupRef.current = L.layerGroup().addTo(map);
    radarSweepLayerGroupRef.current = L.layerGroup().addTo(map);
    polygonLayerGroupRef.current = L.layerGroup().addTo(map);
    stationsLayerGroupRef.current = L.layerGroup().addTo(map);
    communesLayerGroupRef.current = L.layerGroup().addTo(map);
    labelsLayerGroupRef.current = L.layerGroup().addTo(map);

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync external province prop changes
  useEffect(() => {
    if (selectedProvince !== currentProvinceId) {
      setCurrentProvinceId(selectedProvince);
      if (selectedProvince === 'ALL') {
        flyToRegion(currentRegion);
      } else {
        const prov = VIETNAM_PROVINCES.find((p) => p.id === selectedProvince);
        if (prov && prov.center && !isNaN(prov.center[0]) && !isNaN(prov.center[1]) && mapInstanceRef.current) {
          mapInstanceRef.current.flyTo(prov.center, prov.zoom || 10, { duration: 1.4 });
        }
      }
    }
  }, [selectedProvince]);

  // Sync external region prop changes
  useEffect(() => {
    if (activeRegion && activeRegion !== currentRegion) {
      setCurrentRegion(activeRegion);
      if (currentProvinceId === 'ALL') {
        flyToRegion(activeRegion as RegionScope);
      }
    }
  }, [activeRegion]);

  const flyToRegion = (reg: RegionScope) => {
    if (!mapInstanceRef.current) return;
    const config = REGION_BOUNDS[reg];
    if (config && config.center && !isNaN(config.center[0]) && !isNaN(config.center[1])) {
      mapInstanceRef.current.flyTo(config.center, config.zoom, {
        duration: 1.4
      });
    }
  };

  const handleSelectProvince = (provId: string) => {
    setCurrentProvinceId(provId);
    if (onSelectProvince) onSelectProvince(provId);

    if (provId === 'ALL') {
      flyToRegion(currentRegion);
    } else {
      const prov = VIETNAM_PROVINCES.find((p) => p.id === provId);
      if (prov && prov.center && !isNaN(prov.center[0]) && !isNaN(prov.center[1]) && mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(prov.center, prov.zoom || 10, { duration: 1.4 });
      }
    }
  };

  // Switch Base Map Tiles (Topo 3D, Satellite Hybrid, Tactical Navy, State Light, Dark Radar)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear previous base tile layers
    baseTileLayersRef.current.forEach((layer) => {
      map.removeLayer(layer);
    });
    baseTileLayersRef.current = [];

    if (baseMapType === 'topo') {
      // 1. Esri World Topographic Map - Rich elevation contours, shaded mountain relief, lush valleys
      const topoLayer = L.tileLayer('https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri World Topographic',
        maxZoom: 19
      });
      topoLayer.addTo(map);
      baseTileLayersRef.current.push(topoLayer);
    } else if (baseMapType === 'satellite_hybrid') {
      // 2. High-Res Esri Satellite + Boundaries & Reference Overlay
      const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri World Imagery',
        maxZoom: 19
      });
      const refLayer = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri Boundaries',
        maxZoom: 19
      });
      satLayer.addTo(map);
      refLayer.addTo(map);
      baseTileLayersRef.current.push(satLayer, refLayer);
    } else if (baseMapType === 'tactical_navy') {
      // 3. Carto Voyager / Cyber Navy Tactical Map
      const voyagerLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO &copy; OpenStreetMap',
        maxZoom: 19
      });
      voyagerLayer.addTo(map);
      baseTileLayersRef.current.push(voyagerLayer);
    } else if (baseMapType === 'light_command') {
      // 4. Clean State HQ Command Light Map
      const lightLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO &copy; OpenStreetMap',
        maxZoom: 19
      });
      lightLayer.addTo(map);
      baseTileLayersRef.current.push(lightLayer);
    } else {
      // 5. Dark Tactical Radar Base
      const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO &copy; OpenStreetMap',
        maxZoom: 19
      });
      darkLayer.addTo(map);
      baseTileLayersRef.current.push(darkLayer);
    }
  }, [baseMapType]);

  // Current active province object
  const activeProvinceObj = useMemo(() => {
    if (currentProvinceId === 'ALL') return null;
    return VIETNAM_PROVINCES.find((p) => p.id === currentProvinceId) || null;
  }, [currentProvinceId]);

  // Filter features for rendering
  const activeFeatures = useMemo(() => {
    if (!warningMapData) return [];
    let list = warningMapData.features;

    // Filter Emergency Only mode (Cấp 4-5 only)
    if (emergencyOnly) {
      list = list.filter((f) => f.properties.overall_risk_level >= 4);
    }

    // Filter by Province if selected
    if (currentProvinceId !== 'ALL' && activeProvinceObj) {
      const provNameClean = activeProvinceObj.name.replace(/^Tỉnh\s+|^Thành phố\s+/i, '').toLowerCase();
      list = list.filter((f) => {
        const featProv = f.properties.province_name.replace(/^Tỉnh\s+|^Thành phố\s+/i, '').toLowerCase();
        return featProv.includes(provNameClean) || provNameClean.includes(featProv);
      });
    } else if (currentRegion !== 'ALL') {
      list = list.filter((f) => {
        const zoneRegion = (f as any).region || (f.properties as any).region;
        if (zoneRegion) return zoneRegion === currentRegion;
        return true;
      });
    }

    // Filter by Risk Type
    if (activeRiskTypeFilter !== 'all') {
      list = list.filter((f) => {
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
      list = list.filter((f) => f.properties.overall_risk_level === activeLevelFilter);
    }

    return list;
  }, [warningMapData, currentProvinceId, currentRegion, activeProvinceObj, activeRiskTypeFilter, activeLevelFilter, emergencyOnly]);

  // Top critical emergency hotspots for ticker
  const topCriticalHotspots = useMemo(() => {
    if (!warningMapData) return [];
    return warningMapData.features
      .filter((f) => f.properties.overall_risk_level >= 4)
      .slice(0, 4);
  }, [warningMapData]);

  // Render Tactical Coordinate Grid Overlay (MGRS / Lat-Long)
  useEffect(() => {
    if (!mapInstanceRef.current || !tacticalGridLayerGroupRef.current) return;
    const gridLayer = tacticalGridLayerGroupRef.current;
    gridLayer.clearLayers();

    if (!showTacticalGrid) return;

    // Generate latitude lines (8° to 24°N)
    for (let lat = 8; lat <= 24; lat += 2) {
      const line = L.polyline(
        [
          [lat, 100],
          [lat, 116]
        ],
        {
          color: baseMapType === 'light_command' ? 'rgba(0, 91, 172, 0.25)' : 'rgba(0, 166, 214, 0.25)',
          weight: 1,
          dashArray: '3, 6'
        }
      );
      gridLayer.addLayer(line);
    }

    // Generate longitude lines (102° to 114°E)
    for (let lng = 102; lng <= 114; lng += 2) {
      const line = L.polyline(
        [
          [8, lng],
          [24, lng]
        ],
        {
          color: baseMapType === 'light_command' ? 'rgba(0, 91, 172, 0.25)' : 'rgba(0, 166, 214, 0.25)',
          weight: 1,
          dashArray: '3, 6'
        }
      );
      gridLayer.addLayer(line);
    }
  }, [showTacticalGrid, baseMapType]);

  // Render Major River Basin Paths
  useEffect(() => {
    if (!mapInstanceRef.current || !riversLayerGroupRef.current) return;
    const riverLayer = riversLayerGroupRef.current;
    riverLayer.clearLayers();

    if (!showRiversLayer) return;

    KEY_RIVER_SYSTEMS.forEach((riv) => {
      const polyline = L.polyline(riv.coords, {
        color: riv.color,
        weight: 3,
        opacity: 0.85,
        smoothFactor: 1.2
      });

      polyline.bindTooltip(`🌊 ${riv.name}`, {
        sticky: true,
        className: 'bg-slate-900/90 text-sky-200 text-[10px] font-bold border border-sky-500/40 rounded px-1.5 py-0.5'
      });

      riverLayer.addLayer(polyline);
    });
  }, [showRiversLayer]);

  // Render Doppler Radar Sweeps Layer (Conic radar animations)
  useEffect(() => {
    if (!mapInstanceRef.current || !radarSweepLayerGroupRef.current) return;
    const radarLayer = radarSweepLayerGroupRef.current;
    radarLayer.clearLayers();

    if (!showRadarSweeps) return;

    DOPPLER_RADAR_STATIONS.forEach((sta) => {
      // Range Ring 1 (100km)
      const ring1 = L.circle(sta.center, {
        radius: 100000,
        color: '#00A6D6',
        weight: 1,
        fill: false,
        opacity: 0.4,
        dashArray: '4, 6'
      });

      // Range Ring 2 (Max radius)
      const ring2 = L.circle(sta.center, {
        radius: sta.radiusKm * 1000,
        color: '#005BAC',
        weight: 1.5,
        fillColor: '#00A6D6',
        fillOpacity: 0.04,
        opacity: 0.6
      });

      // Radar Icon Marker with Rotating Sweep
      const radarIcon = L.divIcon({
        className: 'custom-radar-icon',
        html: `
          <div class="relative flex items-center justify-center pointer-events-none" style="width: 80px; height: 80px;">
            <div class="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping opacity-30"></div>
            <div class="w-16 h-16 rounded-full border border-cyan-500/50 bg-gradient-to-tr from-transparent via-cyan-500/20 to-cyan-400/40 animate-radar-sweep pointer-events-none"></div>
            <div class="absolute w-3 h-3 rounded-full bg-cyan-400 border border-white shadow-lg flex items-center justify-center">
              <div class="w-1 h-1 rounded-full bg-slate-950"></div>
            </div>
          </div>
        `,
        iconSize: [80, 80],
        iconAnchor: [40, 40]
      });

      const centerMarker = L.marker(sta.center, { icon: radarIcon });
      centerMarker.bindTooltip(`📡 ${sta.name} (Bán kính ${sta.radiusKm}km)`, {
        className: 'bg-slate-900/90 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 rounded px-1.5 py-0.5'
      });

      radarLayer.addLayer(ring1);
      radarLayer.addLayer(ring2);
      radarLayer.addLayer(centerMarker);
    });
  }, [showRadarSweeps]);

  // Render Risk Zone Polygons & Commune Labels
  useEffect(() => {
    if (!mapInstanceRef.current || !polygonLayerGroupRef.current || !labelsLayerGroupRef.current) return;

    const polyLayer = polygonLayerGroupRef.current;
    const labelLayer = labelsLayerGroupRef.current;
    polyLayer.clearLayers();
    labelLayer.clearLayers();

    if (!showPolygons) return;

    const shouldDisplayDetailedLabels = currentZoom >= 9.5 || currentProvinceId !== 'ALL';

    activeFeatures.forEach((feature) => {
      const props = feature.properties;
      const latLngs = feature.geometry.coordinates[0].map((coord) => [coord[1], coord[0]] as [number, number]);

      const isSelected = selectedZoneId === feature.id;
      const isExtreme = props.overall_risk_level >= 4;

      const polygon = L.polygon(latLngs, {
        color: isSelected ? '#F5B400' : props.color,
        weight: isSelected ? 3.5 : isExtreme ? 2.5 : 1.5,
        opacity: isSelected ? 1 : 0.9,
        fillColor: props.color,
        fillOpacity: isSelected ? 0.75 : isExtreme ? 0.6 : 0.4,
        dashArray: isSelected ? '4, 4' : undefined
      });

      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; min-width: 270px; color: #f8fafc; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #00A6D6; padding-bottom: 6px; margin-bottom: 8px;">
            <span style="font-weight: 800; font-size: 13px; color: #38bdf8;">${props.zone_name}</span>
            <span style="background-color: ${props.color}; color: ${props.overall_risk_level === 2 ? '#000' : '#fff'}; padding: 2px 8px; border-radius: 4px; font-weight: 800; font-size: 11px;">
              CẤP ${props.overall_risk_level}
            </span>
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">
            🏛️ <b>${props.district_name}, ${props.province_name}</b>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background-color: rgba(15, 23, 42, 0.75); padding: 8px; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.2); font-size: 11px; font-family: monospace; margin-bottom: 8px;">
            <div><span style="color: #94a3b8;">Mưa 1h:</span> <b style="color: #38bdf8;">${props.rainfall_1h} mm</b></div>
            <div><span style="color: #94a3b8;">Mưa 24h:</span> <b style="color: #f8fafc;">${props.rainfall_24h} mm</b></div>
            <div><span style="color: #94a3b8;">Ẩm đất:</span> <b style="color: #fbbf24;">${props.soil_saturation_percent}%</b></div>
            <div><span style="color: #94a3b8;">Xác suất AI:</span> <b style="color: #f87171;">${(props.overall_probability * 100).toFixed(0)}%</b></div>
          </div>
          <div style="font-size: 11px; color: #fde68a; background-color: rgba(69, 26, 3, 0.4); border: 1px solid rgba(245, 180, 0, 0.3); padding: 6px; border-radius: 4px; margin-bottom: 8px;">
            <b>Cơ chế kích hoạt:</b> ${props.trigger_detail}
          </div>
          <button id="btn-inspect-${feature.id}" style="width: 100%; background: linear-gradient(135deg, #005BAC, #00A6D6); color: #fff; font-weight: 700; padding: 7px; border-radius: 6px; border: none; cursor: pointer; font-size: 11px; text-align: center; box-shadow: 0 4px 12px rgba(0, 91, 172, 0.4);">
            🔍 Mở Bảng Phân Tích & Chỉ Huy Tác Chiến
          </button>
        </div>
      `;

      polygon.bindPopup(popupHtml, { maxWidth: 310 });

      polygon.on('popupopen', () => {
        const btn = document.getElementById(`btn-inspect-${feature.id}`);
        if (btn) {
          btn.onclick = () => onSelectZone(feature.id);
        }
      });

      polygon.on('click', () => onSelectZone(feature.id));
      polyLayer.addLayer(polygon);

      if (showCommuneLabels && props.center && Array.isArray(props.center) && !isNaN(props.center[0]) && !isNaN(props.center[1])) {
        const shouldShowThisLabel = isExtreme || shouldDisplayDetailedLabels || isSelected;

        if (shouldShowThisLabel) {
          const labelHtml = `
            <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-lg shadow-lg border backdrop-blur-md text-[10px] font-bold whitespace-nowrap cursor-pointer transition-all hover:scale-105 ${
              props.overall_risk_level >= 5
                ? 'bg-purple-950/95 text-purple-200 border-purple-400 animate-pulse ring-1 ring-purple-500'
                : props.overall_risk_level === 4
                ? 'bg-red-950/95 text-white border-red-500 animate-pulse'
                : props.overall_risk_level === 3
                ? 'bg-amber-950/95 text-amber-200 border-amber-500'
                : 'bg-slate-900/90 text-sky-200 border-sky-600/50'
            }">
              <span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${props.color}"></span>
              <span>${props.zone_name.replace(/^(Xã|Phường|Thị trấn|TT)\s+/i, '')}</span>
            </div>
          `;

          const labelMarker = L.marker(props.center, {
            icon: L.divIcon({
              className: 'custom-commune-label',
              html: labelHtml,
              iconSize: [120, 20],
              iconAnchor: [60, 10]
            })
          });

          labelMarker.on('click', () => onSelectZone(feature.id));
          labelLayer.addLayer(labelMarker);
        }
      }
    });
  }, [activeFeatures, showPolygons, showCommuneLabels, selectedZoneId, onSelectZone, currentZoom, currentProvinceId]);

  // Render Telemetry Stations
  useEffect(() => {
    if (!mapInstanceRef.current || !stationsLayerGroupRef.current) return;

    const layerGroup = stationsLayerGroupRef.current;
    layerGroup.clearLayers();

    if (!showStations) return;

    stations.forEach((station) => {
      if (typeof station.latitude !== 'number' || typeof station.longitude !== 'number' || isNaN(station.latitude) || isNaN(station.longitude)) {
        return;
      }

      let markerColor = '#10b981';
      if (station.current_rainfall_1h >= 50) markerColor = '#ef4444';
      else if (station.current_rainfall_1h >= 30) markerColor = '#f97316';
      else if (station.current_rainfall_1h >= 15) markerColor = '#eab308';

      const isWarning = station.status === 'WARNING';
      const isOffline = station.status === 'OFFLINE';
      const isInternational = station.country && station.country !== 'VIETNAM';

      const customIcon = L.divIcon({
        className: 'custom-station-icon',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <span class="absolute w-4 h-4 rounded-full ${isInternational ? 'bg-purple-500 animate-ping opacity-75' : isWarning ? 'bg-amber-500 animate-ping opacity-75' : station.current_rainfall_1h >= 40 ? 'bg-rose-500 animate-ping opacity-75' : 'bg-sky-500/30'}"></span>
            <div style="background-color: ${isOffline ? '#64748b' : isInternational ? '#8b5cf6' : markerColor}" class="w-3.5 h-3.5 rounded-full border-2 ${isInternational ? 'border-amber-300' : 'border-white'} shadow-md flex items-center justify-center text-[7px] font-bold text-white transition transform group-hover:scale-125">
              ${isInternational ? '🌐' : ''}
            </div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([station.latitude, station.longitude], { icon: customIcon });

      const extraTelemetry = [
        station.wind_speed_kmh ? `<div><span style="color: #94a3b8;">Gió:</span> <b style="color: #38bdf8;">${station.wind_speed_kmh} km/h</b></div>` : '',
        station.atmospheric_pressure_hpa ? `<div><span style="color: #94a3b8;">Khí áp:</span> <b style="color: #38bdf8;">${station.atmospheric_pressure_hpa} hPa</b></div>` : '',
        station.wave_height_m ? `<div><span style="color: #94a3b8;">Sóng biển:</span> <b style="color: #38bdf8;">${station.wave_height_m}m</b></div>` : '',
        station.radar_reflectivity_dbz ? `<div><span style="color: #94a3b8;">Radar:</span> <b style="color: #c084fc;">${station.radar_reflectivity_dbz} dBZ</b></div>` : '',
        station.discharge_m3s ? `<div><span style="color: #94a3b8;">Lưu lượng:</span> <b style="color: #34d399;">${station.discharge_m3s.toLocaleString()} m³/s</b></div>` : ''
      ].filter(Boolean).join('');

      const stationPopup = `
        <div style="font-family: system-ui, sans-serif; min-width: 270px; color: #f8fafc; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #00A6D6; padding-bottom: 6px; margin-bottom: 8px;">
            <span style="font-weight: 800; font-size: 12px; color: #38bdf8;">${isInternational ? '🌐 ' : ''}${station.station_name}</span>
            <span style="padding: 2px 6px; border-radius: 4px; font-weight: 800; font-size: 10px; background-color: ${isInternational ? '#581c87; color: #d8b4fe;' : '#0369a1; color: #e0f2fe;'}">${station.status}</span>
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">
            Mã: <b>${station.station_code}</b> | Cao độ: <b>${station.elevation}m</b> | ${station.province || station.country || ''}
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background-color: rgba(15, 23, 42, 0.75); padding: 6px; border-radius: 4px; border: 1px solid rgba(56, 189, 248, 0.2); font-size: 11px; font-family: monospace; margin-bottom: 6px;">
            <div><span style="color: #94a3b8;">Mưa 1h:</span> <b style="color: ${station.current_rainfall_1h >= 20 ? '#f87171' : '#38bdf8'};">${station.current_rainfall_1h} mm</b></div>
            <div><span style="color: #94a3b8;">Mưa 24h:</span> <b style="color: ${station.current_rainfall_24h >= 100 ? '#f87171' : '#f8fafc'};">${station.current_rainfall_24h} mm</b></div>
            ${extraTelemetry}
          </div>
          <div style="font-size: 10px; color: #64748b;">
            📡 Mạng lưới: <i>${station.provider_network || station.source}</i>
          </div>
        </div>
      `;

      marker.bindPopup(stationPopup, { maxWidth: 300 });
      layerGroup.addLayer(marker);
    });
  }, [stations, showStations]);

  // Communes & Administrative Layer
  const activeCommunes = useMemo(() => {
    if (currentProvinceId === 'ALL') {
      return VIETNAM_COMMUNES_DIRECTORY.slice(0, 150);
    }
    return VIETNAM_COMMUNES_DIRECTORY.filter((c) => c.province_id === currentProvinceId);
  }, [currentProvinceId]);

  // Fly to selected commune
  const handleSelectCommune = (communeId: string) => {
    setSelectedCommuneId(communeId);
    const c = VIETNAM_COMMUNES_DIRECTORY.find((item) => item.id === communeId);
    if (c && c.center && Array.isArray(c.center) && !isNaN(c.center[0]) && !isNaN(c.center[1]) && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(c.center, 13.5, { duration: 1.2 });
    }
  };

  // Group provinces by region for dropdown
  const provincesByRegion = useMemo(() => {
    return [
      { key: 'BAC_BO', label: 'Bắc Bộ', list: VIETNAM_PROVINCES.filter((p) => p.region === 'BAC_BO') },
      { key: 'TRUNG_BO', label: 'Miền Trung', list: VIETNAM_PROVINCES.filter((p) => p.region === 'TRUNG_BO') },
      { key: 'TAY_NGUYEN', label: 'Tây Nguyên', list: VIETNAM_PROVINCES.filter((p) => p.region === 'TAY_NGUYEN') },
      { key: 'NAM_BO', label: 'Nam Bộ & ĐBSCL', list: VIETNAM_PROVINCES.filter((p) => p.region === 'NAM_BO') }
    ];
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[500px] bg-slate-950 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* TOP FLOATING BAR: STREAMLINED SCOPE & GEOGRAPHIC JUMP */}
      {!cleanViewMode && (
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 max-w-[95vw]">
          <div className="flex flex-wrap items-center gap-1.5 bg-[#0b1e36]/90 border border-sky-500/40 rounded-2xl p-1.5 shadow-2xl backdrop-blur-md text-white">
            {/* Button: Toàn Quốc */}
            <button
              onClick={() => handleSelectProvince('ALL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                currentProvinceId === 'ALL'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg'
                  : 'text-sky-200 hover:text-white hover:bg-sky-900/50'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5 text-[#F5B400]" />
              <span>Toàn Quốc (63 Tỉnh / Thành)</span>
            </button>

            <div className="h-4 w-px bg-sky-600/40 mx-0.5 hidden sm:block" />

            {/* Dropdown: Chọn 1 Tỉnh Cụ Thể */}
            <div className="flex items-center gap-1.5 bg-[#071326] px-2.5 py-1 rounded-xl border border-sky-600/40">
              <Building2 className="w-3.5 h-3.5 text-[#F5B400] shrink-0" />
              <select
                value={currentProvinceId}
                onChange={(e) => handleSelectProvince(e.target.value)}
                className="bg-transparent text-xs text-sky-200 font-semibold focus:outline-none cursor-pointer max-w-[180px] sm:max-w-[220px] truncate"
              >
                <option value="ALL" className="bg-[#071326] text-white">
                  -- Chọn 1 Tỉnh / Thành phố --
                </option>
                {provincesByRegion.map((grp) => (
                  <optgroup key={grp.key} label={`=== ${grp.label} ===`} className="bg-[#071326] text-[#F5B400] font-bold">
                    {grp.list.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#071326] text-white font-normal">
                        {p.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* 1-Click Hotspots Focus Toggle */}
            <button
              onClick={() => setEmergencyOnly(!emergencyOnly)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow ${
                emergencyOnly
                  ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-400'
                  : 'bg-slate-800/80 text-sky-200 hover:text-white hover:bg-slate-700'
              }`}
              title="Bật/Tắt chỉ hiển thị các điểm nóng Khẩn cấp (Cấp 4-5)"
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Điểm Nóng Cấp 4-5</span>
            </button>
          </div>

          {/* PROVINCE SUB-BAR: When a single province is selected */}
          {activeProvinceObj && (
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0b1e36]/95 border border-sky-500/40 rounded-xl px-3 py-1.5 shadow-xl backdrop-blur text-xs w-full animate-in fade-in text-white">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-[#F5B400] uppercase tracking-wide flex items-center gap-1">
                  📍 {activeProvinceObj.name}
                </span>
                <span className="text-[10px] text-sky-200 font-mono bg-slate-900/80 px-1.5 py-0.5 rounded border border-sky-700/50">
                  {activeFeatures.length} Vùng Nguy Cơ GIS
                </span>
                <span className="text-[10px] text-emerald-300 font-mono bg-slate-900/80 px-1.5 py-0.5 rounded border border-emerald-700/50">
                  {activeCommunes.length} Xã/Phường/TT (Chính Quyền 2 Cấp)
                </span>
              </div>

              {/* Jump directly to a Zone or Commune in this Province */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Selector 1: Risk Zones */}
                <select
                  value={selectedZoneId || ''}
                  onChange={(e) => {
                    if (e.target.value) onSelectZone(e.target.value);
                  }}
                  className="bg-slate-900 border border-sky-600/50 rounded-lg px-2 py-1 text-[11px] text-sky-200 focus:outline-none focus:border-[#F5B400] max-w-[170px] truncate"
                  title="Zoom tới Vùng cảnh báo nguy cơ"
                >
                  <option value="">-- Vùng Nguy Cơ ({activeFeatures.length}) --</option>
                  {activeFeatures.map((f) => (
                    <option key={f.id} value={f.id}>
                      [{f.properties.overall_risk_level >= 4 ? '⚠️' : '📍'}] {f.properties.zone_name}
                    </option>
                  ))}
                </select>

                {/* Selector 2: Full Administrative Communes/Wards */}
                <select
                  value={selectedCommuneId || ''}
                  onChange={(e) => {
                    if (e.target.value) handleSelectCommune(e.target.value);
                  }}
                  className="bg-slate-900 border border-emerald-600/50 rounded-lg px-2 py-1 text-[11px] text-emerald-300 focus:outline-none focus:border-emerald-400 max-w-[180px] truncate"
                  title="Zoom tới Xã/Phường/Thị trấn thuộc tỉnh"
                >
                  <option value="">-- Toàn Bộ Xã/Phường ({activeCommunes.length}) --</option>
                  {activeCommunes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.is_landslide_hotspot ? '⚠️ ' : '🏛️ '}{c.name} ({c.type})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleSelectProvince('ALL')}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-200 hover:text-white transition"
                  title="Quay lại Toàn Quốc"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOP LEFT: REAL-TIME DATA STATUS HUD */}
      {!cleanViewMode && (
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 bg-[#0b1e36]/90 border border-sky-500/30 px-2.5 py-1.5 rounded-xl shadow-xl backdrop-blur-md text-xs text-white">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${systemMode === 'REAL_TIME' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${systemMode === 'REAL_TIME' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </span>
              <span className="font-bold text-[11px] tracking-wide uppercase text-sky-200">
                {systemMode === 'REAL_TIME' ? '🔴 THỜI GIAN THỰC' : '⚡ MÔ PHỎNG'}
              </span>
            </div>

            <div className="h-3.5 w-px bg-sky-700/40" />

            {/* Sync Button */}
            {onSyncLive && (
              <button
                onClick={() => onSyncLive()}
                disabled={isSyncingLive}
                className="p-1 rounded-lg bg-sky-900/40 hover:bg-sky-800/60 text-sky-200 hover:text-white transition disabled:opacity-50"
                title="Đồng bộ dữ liệu thời gian thực KTTV & Radar"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingLive ? 'animate-spin text-[#F5B400]' : ''}`} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* TOP RIGHT: QUICK MAP THEME SELECTOR & TACTICAL TOOLS */}
      <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {/* Quick Map Theme Switcher Bar (1-Click) */}
          {!cleanViewMode && (
            <div className="flex items-center gap-1 bg-[#0b1e36]/90 border border-sky-500/40 p-1 rounded-xl shadow-2xl backdrop-blur-md">
              <button
                onClick={() => setBaseMapType('topo')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  baseMapType === 'topo'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md ring-1 ring-emerald-300'
                    : 'text-sky-200 hover:text-white hover:bg-sky-900/40'
                }`}
                title="Bản đồ Địa hình 3D cao độ sống động (Mặc định)"
              >
                <Mountain className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden sm:inline">Địa Hình 3D</span>
              </button>

              <button
                onClick={() => setBaseMapType('satellite_hybrid')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  baseMapType === 'satellite_hybrid'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md ring-1 ring-blue-300'
                    : 'text-sky-200 hover:text-white hover:bg-sky-900/40'
                }`}
                title="Bản đồ Vệ tinh độ nét cao kết hợp đường & địa danh"
              >
                <Satellite className="w-3.5 h-3.5 text-sky-300" />
                <span className="hidden sm:inline">Vệ Tinh Hybrid</span>
              </button>

              <button
                onClick={() => setBaseMapType('tactical_navy')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  baseMapType === 'tactical_navy'
                    ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md ring-1 ring-cyan-300'
                    : 'text-sky-200 hover:text-white hover:bg-sky-900/40'
                }`}
                title="Bản đồ Hải quân Tác chiến Công nghệ cao"
              >
                <Waves className="w-3.5 h-3.5 text-cyan-300" />
                <span className="hidden sm:inline">Hải Quân</span>
              </button>

              <button
                onClick={() => setBaseMapType('light_command')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  baseMapType === 'light_command'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md ring-1 ring-amber-300 font-extrabold'
                    : 'text-sky-200 hover:text-white hover:bg-sky-900/40'
                }`}
                title="Bản đồ Chỉ huy Quốc gia nền Sáng tương phản cao"
              >
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Chỉ Huy Sáng</span>
              </button>

              <button
                onClick={() => setBaseMapType('dark_radar')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  baseMapType === 'dark_radar'
                    ? 'bg-slate-800 text-purple-300 shadow-md ring-1 ring-purple-400'
                    : 'text-sky-200 hover:text-white hover:bg-sky-900/40'
                }`}
                title="Bản đồ Radar Đêm chuyên dụng"
              >
                <Moon className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Radar Đêm</span>
              </button>
            </div>
          )}

          {/* Clean Map Mode Toggle */}
          <button
            onClick={() => setCleanViewMode(!cleanViewMode)}
            className={`p-2 rounded-xl text-xs font-semibold shadow-xl backdrop-blur transition-all border ${
              cleanViewMode
                ? 'bg-[#F5B400] text-slate-950 font-bold border-amber-300'
                : 'bg-[#0b1e36]/90 text-sky-200 border-sky-500/30 hover:bg-sky-900/50 hover:text-white'
            }`}
            title={cleanViewMode ? 'Bật lại thanh công cụ' : 'Chế độ xem bản đồ tối giản'}
          >
            {cleanViewMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          {/* Layer Settings Drawer Button */}
          {!cleanViewMode && (
            <button
              onClick={() => setShowLayerPanel(!showLayerPanel)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xl backdrop-blur transition-all border ${
                showLayerPanel
                  ? 'bg-sky-600 text-white border-sky-300'
                  : 'bg-[#0b1e36]/90 text-sky-200 border-sky-500/30 hover:text-white hover:bg-sky-900/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#F5B400]" />
              <span>Lớp Dữ Liệu</span>
            </button>
          )}
        </div>

        {/* Collapsible Layer Settings Drawer */}
        {showLayerPanel && !cleanViewMode && (
          <div className="bg-[#0b1e36]/98 border border-sky-500/40 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md text-xs space-y-3 w-64 animate-in slide-in-from-top-2 text-white">
            <div className="flex items-center justify-between border-b border-sky-800/60 pb-1.5">
              <span className="font-bold text-[#F5B400] uppercase tracking-wider text-[11px]">Tùy Chọn Lớp Bản Đồ</span>
              <button onClick={() => setShowLayerPanel(false)} className="text-sky-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tactical Overlays Toggles */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-sky-300 font-bold uppercase tracking-wider">Lớp Tác Chiến Nâng Cao:</div>

              <button
                onClick={() => setShowRadarSweeps(!showRadarSweeps)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition ${
                  showRadarSweeps ? 'bg-cyan-950/80 text-cyan-200 border-cyan-400/80 shadow-sm' : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-medium">Quét Radar Doppler 360°</span>
                </span>
                <span className="font-mono text-[10px] font-bold">{DOPPLER_RADAR_STATIONS.length} Đài</span>
              </button>

              <button
                onClick={() => setShowRiversLayer(!showRiversLayer)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition ${
                  showRiversLayer ? 'bg-sky-950/80 text-sky-200 border-sky-400/80 shadow-sm' : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-medium">Lưu Vực Sông & Thủy Hệ</span>
                </span>
                <span className="font-mono text-[10px] font-bold">{KEY_RIVER_SYSTEMS.length} Hệ thống</span>
              </button>

              <button
                onClick={() => setShowTacticalGrid(!showTacticalGrid)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition ${
                  showTacticalGrid ? 'bg-blue-950/80 text-blue-200 border-blue-400/80 shadow-sm' : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Grid className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-medium">Lưới Tọa Độ Trắc Địa Quân Sự</span>
                </span>
                <span className="text-[10px] font-bold">{showTacticalGrid ? 'Bật' : 'Tắt'}</span>
              </button>
            </div>

            {/* Standard Warning Layer Toggles */}
            <div className="space-y-1.5 pt-1 border-t border-sky-900/50">
              <div className="text-[10px] text-sky-300 font-bold uppercase tracking-wider">Lớp Cảnh Báo & Giám Sát:</div>
              
              <button
                onClick={() => setShowPolygons(!showPolygons)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition ${
                  showPolygons ? 'bg-sky-950/80 text-sky-100 border-sky-400/80 shadow-sm' : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-medium">Vùng Nguy Cơ GIS</span>
                </span>
                <span className="font-mono text-[10px] font-bold">{activeFeatures.length}</span>
              </button>

              <button
                onClick={() => setShowCommunesLayer(!showCommunesLayer)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition ${
                  showCommunesLayer ? 'bg-emerald-950/80 text-emerald-200 border-emerald-400/80 shadow-sm' : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-medium">Danh Mục Xã/Phường</span>
                </span>
                <span className="font-mono text-[10px] font-bold">{activeCommunes.length}</span>
              </button>

              <button
                onClick={() => setShowCommuneLabels(!showCommuneLabels)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition ${
                  showCommuneLabels ? 'bg-sky-950/80 text-sky-100 border-sky-400/80 shadow-sm' : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-medium">Nhãn Tên Vùng</span>
                </span>
                <span className="text-[10px] font-bold">{showCommuneLabels ? 'Bật' : 'Tắt'}</span>
              </button>

              <button
                onClick={() => setShowStations(!showStations)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition ${
                  showStations ? 'bg-sky-950/80 text-sky-100 border-sky-400/80 shadow-sm' : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-medium">Trạm Đo Mưa KTTV</span>
                </span>
                <span className="font-mono text-[10px] font-bold">{stations.length}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM LEFT: EMERGENCY HOTSPOT TICKER (Collapsible) */}
      {!cleanViewMode && topCriticalHotspots.length > 0 && (
        <div className="absolute bottom-4 left-3 z-10 flex flex-col gap-1.5 max-w-sm hidden sm:flex">
          {showHotspotsTicker ? (
            <div className="bg-[#0b1e36]/95 border border-rose-600/70 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md text-xs space-y-1.5 text-white">
              <div className="flex items-center justify-between text-[11px] font-bold text-rose-300">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  ĐIỂM NÓNG KHẨN CẤP ({topCriticalHotspots.length})
                </span>
                <button onClick={() => setShowHotspotsTicker(false)} className="text-sky-300 hover:text-white text-[10px]">
                  Thu gọn
                </button>
              </div>

              <div className="space-y-1">
                {topCriticalHotspots.map((spot) => (
                  <div
                    key={spot.id}
                    onClick={() => onSelectZone(spot.id)}
                    className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-[#F5B400] cursor-pointer transition"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${spot.properties.overall_risk_level === 5 ? 'bg-purple-500 animate-ping' : 'bg-rose-500'}`}></span>
                      <span className="font-semibold text-white truncate">{spot.properties.zone_name}</span>
                      <span className="text-[10px] text-sky-200">({spot.properties.province_name})</span>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-rose-400 shrink-0 ml-1">
                      Cấp {spot.properties.overall_risk_level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowHotspotsTicker(true)}
              className="bg-[#0b1e36]/90 border border-rose-600 px-2.5 py-1 rounded-xl text-[11px] font-bold text-rose-300 hover:text-white shadow-xl backdrop-blur-md flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Điểm nóng khẩn cấp ({topCriticalHotspots.length})</span>
            </button>
          )}
        </div>
      )}

      {/* BOTTOM RIGHT: MINIMALIST COLLAPSIBLE 5-TIER LEGEND */}
      {!cleanViewMode && (
        showLegend ? (
          <div className="absolute bottom-12 right-3 z-10 bg-[#0b1e36]/95 border border-sky-500/40 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md max-w-xs text-xs space-y-1.5 animate-in fade-in text-white">
            <div className="flex items-center justify-between border-b border-sky-800/50 pb-1">
              <span className="font-bold text-[10px] uppercase tracking-wider text-[#F5B400]">Phân Cấp Nguy Cơ Thiên Tai</span>
              <button onClick={() => setShowLegend(false)} className="text-sky-300 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-1 text-[10px] font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 border border-purple-400 animate-pulse shrink-0"></span>
                <span className="text-purple-300 font-bold">Cấp 5: Thảm Họa (Sơ tán khẩn cấp)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-red-400 shrink-0"></span>
                <span className="text-red-300 font-bold">Cấp 4: Rất Lớn (Báo động đỏ)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-400 shrink-0"></span>
                <span className="text-amber-300">Cấp 3: Lớn (Cảnh báo cao)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-yellow-300 shrink-0"></span>
                <span className="text-yellow-300">Cấp 2: Trung Bình (Theo dõi sát)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 border border-sky-300 shrink-0"></span>
                <span className="text-sky-300">Cấp 1: Thấp (Bình thường)</span>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowLegend(true)}
            className="absolute bottom-12 right-3 z-10 bg-[#0b1e36]/90 border border-sky-500/40 px-2.5 py-1 rounded-xl text-[10px] text-sky-200 hover:text-white shadow-xl backdrop-blur-md font-bold flex items-center gap-1"
          >
            <span>🏷️ Chú giải cấp độ</span>
          </button>
        )
      )}
    </div>
  );
};
