import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  Home,
  Bell,
  Map as MapIcon,
  BookOpen,
  Newspaper,
  Phone,
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  Flame,
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  Search,
  Layers,
  ChevronRight,
  ChevronDown,
  Navigation,
  Building2,
  Building,
  School,
  Landmark,
  Compass,
  Waves,
  Mountain,
  Zap,
  Sun,
  LogIn,
  X,
  ExternalLink,
  Check,
  CheckCircle2,
  MapPin,
  Crosshair,
  LocateFixed,
  Maximize2,
  Minimize2,
  Globe,
  QrCode,
  Smartphone,
  Send,
  Info,
  LifeBuoy,
  Plus,
  Minus,
  Sparkles,
  PhoneCall,
  Volume2,
  ArrowRight,
  Clock,
  Share2
} from 'lucide-react';
import { GeoJsonWarningMap, RainfallStation, RiskLevel, GeoJsonFeatureProperties, CitizenDisasterReport } from '../types';
import { VIETNAM_PROVINCES, ProvinceInfo } from '../data/provinces';
import { VIETNAM_COMMUNES_DIRECTORY, CommuneRecord } from '../data/communes_directory';
import { HvuBrandEmblem } from './HvuBrandEmblem';
import { EarthquakeTsunamiModal } from './EarthquakeTsunamiModal';
import { CitizenReportModal } from './CitizenReportModal';
import { FloatingWeatherMeteogramBar } from './FloatingWeatherMeteogramBar';
import { Activity } from 'lucide-react';
import { getSavedNavigationMenus, NavigationMenuItem } from '../data/navigationMenu';

interface PublicPortalHomeProps {
  warningMapData: GeoJsonWarningMap | null;
  stations: RainfallStation[];
  onOpenLoginModal: () => void;
  onOpenTyphoonModal?: () => void;
  onOpenEarthquakeModal?: () => void;
  onOpenGlobalDisaster?: () => void;
  onOpenWeatherNext?: () => void;
  onEnterWarRoom: (zoneId?: string) => void;
  defaultProvinceId?: string;
}

type ActiveNavTab = 'HOME' | 'ALERTS' | 'MAP' | 'GUIDE' | 'NEWS' | 'CONTACT';

interface SafePoint {
  id: string;
  name: string;
  type: 'school' | 'culture' | 'medical' | 'government';
  distance: string;
  capacity: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
}

const SAMPLE_SAFE_POINTS: SafePoint[] = [
  {
    id: 'sp-1',
    name: 'Trường THPT Hùng Vương',
    type: 'school',
    distance: '1,2 km',
    capacity: 'Sức chứa: 500 người',
    address: 'Đường Hùng Vương, Phường Gia Cẩm, TP. Việt Trì',
    lat: 21.325,
    lng: 105.395,
    phone: '0210 3846 123'
  },
  {
    id: 'sp-2',
    name: 'Nhà văn hóa phường Vân Phú',
    type: 'culture',
    distance: '1,8 km',
    capacity: 'Sức chứa: 300 người',
    address: 'Khu 3, Phường Vân Phú, TP. Việt Trì',
    lat: 21.341,
    lng: 105.378,
    phone: '0210 3855 456'
  },
  {
    id: 'sp-3',
    name: 'Trạm y tế phường Vân Phú',
    type: 'medical',
    distance: '2,1 km',
    capacity: 'Y tế cơ sở',
    address: 'Khu 2, Phường Vân Phú, TP. Việt Trì',
    lat: 21.346,
    lng: 105.372,
    phone: '0210 3855 789'
  },
  {
    id: 'sp-4',
    name: 'UBND phường Vân Phú',
    type: 'government',
    distance: '2,5 km',
    capacity: 'Trụ sở cơ quan',
    address: 'Quốc lộ 2, Phường Vân Phú, TP. Việt Trì',
    lat: 21.348,
    lng: 105.368,
    phone: '0210 3855 111'
  }
];

const DISASTER_ACTION_GUIDES = [
  {
    id: 'flood',
    title: 'Nếu có lũ, ngập lụt',
    subtitle: '7 việc cần làm để bảo vệ bạn và gia đình',
    icon: Waves,
    color: '#0284c7',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    steps: [
      'Thường xuyên theo dõi thông tin cảnh báo mưa lũ trên loa truyền thanh, app HAEWS-HVU và đài báo.',
      'Ngắt toàn bộ nguồn điện, khóa van bình gas và đưa các tài sản, gia súc lên vị trí cao ráo.',
      'Dự trữ sẵn nước sạch, thực phẩm đóng hộp, đèn pin, thuốc men thiết yếu và giấy tờ quan trọng trong túi chống nước.',
      'Tuyệt đối không đi bộ, bơi lội hoặc lái xe qua các ngầm tràn, đoạn đường ngập sâu, nước chảy xiết.',
      'Không đánh bắt cá, vớt củi trên sông, suối khi đang có lũ lớn.',
      'Chủ động di dời đến điểm sơ tán an toàn theo hướng dẫn của chính quyền và lực lượng xung kích.',
      'Ghi nhớ số điện thoại cứu hộ khẩn cấp 112 và báo ngay vị trí khi bị cô lập.'
    ]
  },
  {
    id: 'landslide',
    title: 'Nếu có sạt lở đất',
    subtitle: '6 việc cần làm để đảm bảo an toàn',
    icon: Mountain,
    color: '#d97706',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    steps: [
      'Quan sát kỹ các dấu hiệu nứt đất, tường nhà nứt, cây cối nghiêng ngả hoặc nước suối chuyển màu đục ngầu cuồn cuộn.',
      'Lắng nghe âm thanh lạ như tiếng nổ trong lòng đất, tiếng rền của đất đá lăn từ trên núi.',
      'Khẩn trương sơ tán ngay lập tức người già, trẻ em ra khỏi chân taluy dốc, khe tụ thủy.',
      'Di chuyển vuông góc với hướng trượt lở của dòng đất đá để thoát ra ngoài vùng quét.',
      'Không quay lại nhà lấy đồ đạc khi chưa có thông báo an toàn từ cơ quan chức năng.',
      'Cắm biển cảnh báo và báo cáo ngay cho chính quyền xã/phường gần nhất.'
    ]
  },
  {
    id: 'lightning',
    title: 'Nếu có giông sét',
    subtitle: '5 việc cần làm khi có giông sét',
    icon: Zap,
    color: '#9333ea',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    steps: [
      'Nhanh chóng vào trong nhà kiên cố, đóng kín cửa sổ và tránh xa các kết cấu kim loại.',
      'Rút phích cắm các thiết bị điện tử, không sử dụng điện thoại có dây khi sấm sét đang diễn ra.',
      'Nếu ở ngoài trời, tuyệt đối không trú mưa dưới gốc cây to, cột điện cao thế hoặc chòi đơn độc giữa đồng.',
      'Tránh xa các vật thể kim loại như xe đạp, máy cày, cuốc xẻng, hàng rào sắt.',
      'Nếu cảm thấy tóc dựng đứng hoặc da ngứa ran (dấu hiệu sắp bị sét đánh), hãy ngồi xổm, cúi đầu, hai tay ôm đầu gối, nhón chân tiếp đất nhỏ nhất có thể.'
    ]
  },
  {
    id: 'typhoon',
    title: 'Nếu có bão',
    subtitle: '8 việc cần làm trước, trong và sau bão',
    icon: Compass,
    color: '#0d9488',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    steps: [
      'Chằng chống nhà cửa, cắt tỉa cành cây lớn xung quanh khu vực sinh sống.',
      'Gia cố mái tôn bằng bao cát, nẹp gỗ chữ X để chống gió giật mạnh.',
      'Tàu thuyền khẩn trương vào nơi neo đậu an toàn, không ở lại trên chòi canh thủy sản.',
      'Dự trữ lương thực khô, nước uống đủ dùng trong ít nhất 3-5 ngày.',
      'Ở yên trong nhà kiên cố trong thời gian tâm bão đổ bộ; cảnh giác khi bão tạm lắng (mắt bão) vì gió sẽ đảo chiều rất mạnh.',
      'Tránh xa các cửa sổ kính lớn, có thể dán băng dính chéo chữ X để giảm mảnh văng nếu kính vỡ.',
      'Sau bão, cẩn thận với dây điện đứt, cây đổ và ngập úng ngầm.',
      'Tham gia dọn dẹp vệ sinh môi trường, phòng chống dịch bệnh sau bão.'
    ]
  },
  {
    id: 'earthquake',
    title: 'Nếu có động đất',
    subtitle: 'Quy tắc Drop - Cover - Hold On khi có rung chấn',
    icon: Activity,
    color: '#ea580c',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    steps: [
      'HẠ THẤP THÂN THỂ (DROP): Nhanh chóng quỳ gối xuống sàn nhà để không bị ngã do lực rung chấn mạnh.',
      'CHỐN NẤU & CHE CHẮN (COVER): Chui ngay xuống gầm bàn gỗ kiên cố hoặc góc tường chịu lực, dùng tay hoặc cặp sách bảo vệ vùng đầu và gáy.',
      'GIỮ CHẶT (HOLD ON): Giữ chắc chân bàn cho tới khi hết rung lắc hoàn toàn.',
      'Tránh xa cửa sổ kính lớn, gương soi, giá sách và các đèn chùm treo trên trần nhà.',
      'Nếu đang ở ngoài trời: Tìm bãi đất trống phẳng, tránh xa dây điện cao thế, biển hiệu quảng cáo và chân tường taluy dốc.',
      'Sau động đất: Đề phòng sạt lở đất đá sườn dốc và các đợt dư chấn kế tiếp.'
    ]
  },
  {
    id: 'tsunami',
    title: 'Nếu có cảnh báo sóng thần',
    subtitle: 'Hành động khẩn cấp cứu sinh vùng duyên hải',
    icon: Waves,
    color: '#0369a1',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    steps: [
      'Nhận biết dấu hiệu tự nhiên: Nước biển đột ngột rút cạn trơ đáy hoặc có tiếng gầm rú như máy bay từ đại dương.',
      'SƠ TÁN NGAY LẬP TỨC: Chạy ngay vào đất liền hoặc di chuyển lên vị trí cao ráo trên 10-15 mét so với mực nước biển.',
      'Không đứng trên bờ biển để quay phim, chụp ảnh vì sóng thần di chuyển với vận tốc 500-800 km/h.',
      'Tàu thuyền ngoài khơi vùng nước sâu (>200m) hãy giữ nguyên vị trí, không quay về bến cảng.',
      'Sóng thần là một chuỗi nhiều đợt sóng; đợt sóng đầu tiên chưa hẳn là đợt sóng lớn nhất.'
    ]
  }
];

export const PublicPortalHome: React.FC<PublicPortalHomeProps> = ({
  warningMapData,
  stations,
  onOpenLoginModal,
  onOpenTyphoonModal,
  onOpenEarthquakeModal,
  onOpenGlobalDisaster,
  onOpenWeatherNext,
  onEnterWarRoom,
  defaultProvinceId = 'phu_tho'
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('HOME');

  // Earthquake & Tsunami Modal State
  const [showEarthquakeModal, setShowEarthquakeModal] = useState<boolean>(false);

  // Selected Province & Commune State
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>(() => {
    try {
      return localStorage.getItem('haews_default_province') || defaultProvinceId || 'phu_tho';
    } catch {
      return defaultProvinceId || 'phu_tho';
    }
  });
  const [selectedCommuneName, setSelectedCommuneName] = useState<string>('Phường Vân Phú, TP. Việt Trì');
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showWeatherMeteogram, setShowWeatherMeteogram] = useState<boolean>(false);
  const [provinceSearchQuery, setProvinceSearchQuery] = useState<string>('');

  // Modals & Interactivity
  const [showSubscribeModal, setShowSubscribeModal] = useState<boolean>(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState<boolean>(false);
  const [subscribePhone, setSubscribePhone] = useState<string>('');
  const [subscribeName, setSubscribeName] = useState<string>('');
  const [subscribeChannel, setSubscribeChannel] = useState<'SMS' | 'ZALO' | 'APP'>('ZALO');

  const [showActiveAlertsModal, setShowActiveAlertsModal] = useState<boolean>(false);
  const [showStationsModal, setShowStationsModal] = useState<boolean>(false);
  const [showIncidentsModal, setShowIncidentsModal] = useState<boolean>(false);
  const [showCitizenReportModal, setShowCitizenReportModal] = useState<boolean>(false);
  const [citizenReportsList, setCitizenReportsList] = useState<CitizenDisasterReport[]>([]);
  const [alertsFilterLevel, setAlertsFilterLevel] = useState<string>('ALL');
  const [alertsSearchQuery, setAlertsSearchQuery] = useState<string>('');

  const [selectedGuide, setSelectedGuide] = useState<any | null>(null);
  const [selectedRiskDetail, setSelectedRiskDetail] = useState<string | null>(null);
  const [selectedSafePoint, setSelectedSafePoint] = useState<SafePoint | null>(null);
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<any | null>(null);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('17:51, 22/08/2026');

  // Dynamic Multi-Level Navigation Menus (Admin Synchronized)
  const [navigationMenus, setNavigationMenus] = useState<NavigationMenuItem[]>(() => getSavedNavigationMenus());
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const navDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleNavUpdate = () => {
      setNavigationMenus(getSavedNavigationMenus());
    };
    window.addEventListener('haews-navigation-updated', handleNavUpdate);
    return () => window.removeEventListener('haews-navigation-updated', handleNavUpdate);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navDropdownRef.current && !navDropdownRef.current.contains(e.target as Node)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExecuteNavAction = (item: NavigationMenuItem) => {
    setActiveDropdownId(null);

    // Explicit check by menu ID or targetTab
    if (item.id === 'nav-sub-alerts' || item.targetTab === 'ALERTS') {
      setShowActiveAlertsModal(true);
      return;
    }

    if (item.id === 'nav-sub-stations' || item.targetTab === 'SENSORS') {
      setShowStationsModal(true);
      return;
    }

    if (item.id === 'nav-sub-incidents') {
      setShowIncidentsModal(true);
      return;
    }

    if (item.id === 'nav-sub-typhoon' || item.targetTab === 'TYPHOON_MODAL') {
      if (onOpenTyphoonModal) {
        onOpenTyphoonModal();
      } else {
        setMapEngineMode('windy');
        setWindyOverlay('hurricanes');
        const mapElem = document.getElementById('section-map');
        if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (item.id === 'nav-sub-earthquake' || item.targetTab === 'EARTHQUAKE_MODAL') {
      setShowEarthquakeModal(true);
      if (onOpenEarthquakeModal) onOpenEarthquakeModal();
      return;
    }

    if (item.id === 'nav-sub-shelters' || item.targetTab === 'SHELTERS') {
      setMapEngineMode('gis');
      setMapLayerFilter('SAFE');
      const mapElem = document.getElementById('section-map');
      if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (item.id === 'nav-sub-warroom' || item.targetTab === 'WAR_ROOM') {
      onEnterWarRoom();
      return;
    }

    if (item.id === 'nav-sub-guide-flood') {
      setSelectedGuide(DISASTER_ACTION_GUIDES.find((g) => g.id === 'flood') || DISASTER_ACTION_GUIDES[0]);
      return;
    }

    if (item.id === 'nav-sub-guide-typhoon') {
      setSelectedGuide(DISASTER_ACTION_GUIDES.find((g) => g.id === 'typhoon') || DISASTER_ACTION_GUIDES[1]);
      return;
    }

    if (item.id === 'nav-sub-guide-lightning') {
      setSelectedGuide(DISASTER_ACTION_GUIDES.find((g) => g.id === 'lightning') || DISASTER_ACTION_GUIDES[0]);
      return;
    }

    if (item.id === 'nav-sub-news-bulletin') {
      setSelectedNewsArticle({
        level: 'Khẩn cấp',
        time: '17:45 - Hôm nay',
        title: 'Bản tin Dự báo Khí tượng Thủy văn: Mưa lớn diện rộng cục bộ',
        desc: 'Đài Khí tượng Thủy văn tỉnh Phú Thọ dự báo lượng mưa từ 80-140mm trong 24h tới. Đề phòng lũ quét và sạt lở đồi dốc tại các huyện miền núi.'
      });
      return;
    }

    if (item.id === 'nav-sub-news-research') {
      setSelectedNewsArticle({
        level: 'Nghiên cứu HVU',
        time: 'Hôm nay',
        title: 'Đề tài Ứng dụng AI & GIS Cảnh báo sớm Thiên tai Tỉnh Phú Thọ',
        desc: 'Trường Đại học Hùng Vương phát triển hệ thống HAEWS tích hợp trí tuệ nhân tạo dự báo lũ quét và trượt lở đất thời gian thực phục vụ nhân dân và chính quyền.'
      });
      return;
    }

    switch (item.targetTab) {
      case 'HOME':
        setActiveTab('HOME');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'MAP':
        setActiveTab('HOME');
        setMapEngineMode('gis');
        const mapElem = document.getElementById('section-map');
        if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'GUIDE':
        setSelectedGuide(DISASTER_ACTION_GUIDES[0]);
        break;
      case 'NEWS':
        setSelectedNewsArticle({
          level: 'Khẩn cấp',
          time: '17:45 - Hôm nay',
          title: 'Bản tin Dự báo Khí tượng Thủy văn Mới Nhất',
          desc: 'Tổng hợp diễn biến mưa lũ, độ bão hòa đất và mực nước các lưu vực sông trên địa bàn.'
        });
        break;
      case 'CONTACT':
        const hotlineElem = document.getElementById('section-hotlines');
        if (hotlineElem) hotlineElem.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        if (item.url) {
          window.open(item.url, '_blank');
        }
        break;
    }
  };

  // User GPS & Real-time Location State
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
    address: string;
    isLiveGPS: boolean;
  }>({
    lat: 21.338,
    lng: 105.385,
    address: 'Phường Vân Phú, TP. Việt Trì, Tỉnh Phú Thọ',
    isLiveGPS: false
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);

  // Weather Overlays & View Mode (Windy Engine & Local GIS)
  type WeatherOverlayMode = 'radar' | 'wind' | 'satellite' | 'lightning' | 'temp' | 'zones' | 'windy_embed';
  type WindyOverlayType = 'wind' | 'waves' | 'rain' | 'radar' | 'satellite' | 'temp' | 'clouds' | 'thunder' | 'hurricanes' | 'rainAccu';
  const [windyOverlay, setWindyOverlay] = useState<WindyOverlayType>('wind');
  const [mapEngineMode, setMapEngineMode] = useState<'windy' | 'gis'>('windy');
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState<boolean>(true);
  const [activeWeatherOverlay, setActiveWeatherOverlay] = useState<WeatherOverlayMode>('zones');
  
  // Base Map Layer Type
  type BaseMapType = 'osm' | 'satellite' | 'terrain' | 'dark';
  const [baseMapType, setBaseMapType] = useState<BaseMapType>('terrain');
  const [isMapFullscreen, setIsMapFullscreen] = useState<boolean>(false);

  // Map Interactive Layers on Mini GIS
  const [mapLayerFilter, setMapLayerFilter] = useState<'ALL' | 'WARNING' | 'SAFE' | 'MEDICAL'>('ALL');
  const [mapSearchQuery, setMapSearchQuery] = useState<string>('');

  // Leaflet Map Reference
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const mapLayersRef = useRef<{ [key: string]: L.LayerGroup }>({});
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const weatherOverlayLayerRef = useRef<L.TileLayer | null>(null);

  const currentProvince = VIETNAM_PROVINCES.find((p) => p.id === selectedProvinceId) || VIETNAM_PROVINCES[0];

  // Detect User GPS Geolocation automatically
  const detectUserGPS = () => {
    if ('geolocation' in navigator) {
      setIsDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const accuracy = Math.round(pos.coords.accuracy || 20);
          setUserLocation({
            lat,
            lng,
            accuracy,
            address: `Tọa độ GPS hiện tại (${lat.toFixed(3)}°B, ${lng.toFixed(3)}°Đ)`,
            isLiveGPS: true
          });
          setIsDetectingLocation(false);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([lat, lng], 13, { duration: 1.5 });
          }
        },
        (err) => {
          console.log('GPS Geolocation notice:', err.message);
          setIsDetectingLocation(false);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    }
  };

  useEffect(() => {
    detectUserGPS();
  }, []);

  // Dynamic Warning Counts
  const warningCounts = React.useMemo(() => {
    if (!warningMapData) return { emergency: 0, danger: 2, monitor: 6, normal: 17 };
    const emergency = warningMapData.features.filter((f) => f.properties.overall_risk_level >= 5).length;
    const danger = warningMapData.features.filter((f) => f.properties.overall_risk_level === 4).length;
    const monitor = warningMapData.features.filter((f) => f.properties.overall_risk_level === 3).length;
    const normal = Math.max(12, 25 - (emergency + danger + monitor));
    return { emergency, danger, monitor, normal };
  }, [warningMapData]);

  // Current Weather Metrics
  const weatherMetrics = {
    temp: '27°C',
    humidity: '82%',
    rain24h: '12 mm',
    windSpeed: '5 km/h'
  };

  // Clock Update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      setCurrentTimeStr(`${hours}:${mins}, ${day}/${month}/${year}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Initialize Interactive Map for Civilian Portal
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 12,
      minZoom: 5,
      maxZoom: 18,
      zoomControl: false
    });

    // Default Base Tile Layer: High-performance Esri World Topographic Map
    const baseTile = L.tileLayer('https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri World Topographic',
      maxZoom: 19
    }).addTo(map);
    baseTileLayerRef.current = baseTile;

    // Initialize Layer Groups
    const zonesGroup = L.layerGroup().addTo(map);
    const safePointsGroup = L.layerGroup().addTo(map);
    const userLocationGroup = L.layerGroup().addTo(map);
    const lightningGroup = L.layerGroup().addTo(map);

    mapLayersRef.current = {
      zones: zonesGroup,
      safePoints: safePointsGroup,
      userLocation: userLocationGroup,
      lightning: lightningGroup
    };

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // When switching to GIS Map mode, ensure Leaflet calculates dimensions, re-centers, and forces tile redraw
  useEffect(() => {
    if (mapEngineMode === 'gis' && mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      map.invalidateSize(true);
      map.setView([userLocation.lat, userLocation.lng], 12);
      if (baseTileLayerRef.current) {
        baseTileLayerRef.current.redraw();
      }

      // Multi-stage invalidation to guarantee tiles render on all viewports
      const t1 = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize(true);
          if (baseTileLayerRef.current) baseTileLayerRef.current.redraw();
        }
      }, 50);

      const t2 = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize(true);
          if (baseTileLayerRef.current) baseTileLayerRef.current.redraw();
        }
      }, 250);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [mapEngineMode, userLocation]);

  // Update Base Map Type (OSM, Satellite, Terrain, Dark)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }

    let url = 'https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
    let attribution = '&copy; Esri World Topographic';

    if (baseMapType === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri & Maxar';
    } else if (baseMapType === 'terrain') {
      url = 'https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri & OpenTopoMap';
    } else if (baseMapType === 'dark') {
      url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attribution = '&copy; CARTO';
    } else if (baseMapType === 'osm') {
      url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      attribution = '&copy; OpenStreetMap & CARTO';
    }

    const newBase = L.tileLayer(url, { attribution, maxZoom: 19 }).addTo(map);
    newBase.bringToBack();
    baseTileLayerRef.current = newBase;
  }, [baseMapType]);

  // RainViewer Live API metadata (Radar & Satellite)
  const [radarPath, setRadarPath] = useState<string>('');
  const [satPath, setSatPath] = useState<string>('');

  useEffect(() => {
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then((res) => res.json())
      .then((data) => {
        if (data?.radar?.past?.length) {
          const latestRadar = data.radar.past[data.radar.past.length - 1];
          setRadarPath(latestRadar.path);
        }
        if (data?.satellite?.infrared?.length) {
          const latestSat = data.satellite.infrared[data.satellite.infrared.length - 1];
          setSatPath(latestSat.path);
        }
      })
      .catch((err) => console.log('Notice fetching RainViewer maps:', err));
  }, []);

  // Update Windy-Style Weather Overlays on Leaflet Map
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear previous weather overlay tile layer
    if (weatherOverlayLayerRef.current) {
      map.removeLayer(weatherOverlayLayerRef.current);
      weatherOverlayLayerRef.current = null;
    }

    const { lightning } = mapLayersRef.current;
    if (lightning) lightning.clearLayers();

    if (activeWeatherOverlay === 'lightning' && lightning) {
      // Render animated lightning strike markers in the region
      const strikes = [
        [userLocation.lat + 0.08, userLocation.lng - 0.05],
        [userLocation.lat - 0.06, userLocation.lng + 0.07],
        [userLocation.lat + 0.12, userLocation.lng + 0.03],
        [userLocation.lat - 0.1, userLocation.lng - 0.08]
      ];
      strikes.forEach(([sLat, sLng], idx) => {
        const lightIcon = L.divIcon({
          className: 'lightning-icon',
          html: `
            <div class="relative flex items-center justify-center">
              <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-amber-400 opacity-90"></span>
              <div class="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-lg border border-white">
                ⚡
              </div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        const m = L.marker([sLat, sLng], { icon: lightIcon });
        m.bindPopup(`<div class="p-1.5 text-xs font-bold text-amber-700">⚡ Sét đối lưu vừa ghi nhận (#${idx + 1})</div>`);
        lightning.addLayer(m);
      });
    }
  }, [activeWeatherOverlay, userLocation, radarPath, satPath]);

  // Sync Map when Province or Filter changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const { zones, safePoints, userLocation: userLocGroup } = mapLayersRef.current;
    if (!zones || !safePoints || !userLocGroup) return;

    zones.clearLayers();
    safePoints.clearLayers();
    userLocGroup.clearLayers();

    // 1. User Current Location Pin (Pulsing GPS indicator)
    const userIcon = L.divIcon({
      className: 'user-loc-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-sky-400 opacity-80"></span>
          <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-[#003B73] to-[#005BAC] border-2 border-white shadow-2xl flex items-center justify-center text-white text-xs font-black ring-2 ring-[#005BAC]/40">
            📍
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
    userMarker.bindTooltip(
      `<b>Vị trí của bạn</b><br/>${userLocation.address}${userLocation.accuracy ? ` (±${userLocation.accuracy}m)` : ''}`,
      { className: 'text-xs font-semibold' }
    );
    userLocGroup.addLayer(userMarker);

    // Accuracy Circle
    if (userLocation.accuracy && userLocation.accuracy < 2000) {
      const circle = L.circle([userLocation.lat, userLocation.lng], {
        radius: userLocation.accuracy,
        color: '#005BAC',
        fillColor: '#00A6D6',
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: '3, 4'
      });
      userLocGroup.addLayer(circle);
    }

    // 2. Risk Zone Polygons (Simulated polygons representing Danger & Monitoring zones)
    if (mapLayerFilter === 'ALL' || mapLayerFilter === 'WARNING' || activeWeatherOverlay === 'zones') {
      // Danger Polygon (Red)
      const redCoords: [number, number][] = [
        [userLocation.lat + 0.03, userLocation.lng - 0.05],
        [userLocation.lat + 0.06, userLocation.lng - 0.02],
        [userLocation.lat + 0.04, userLocation.lng + 0.04],
        [userLocation.lat + 0.01, userLocation.lng + 0.01],
        [userLocation.lat + 0.01, userLocation.lng - 0.04]
      ];
      const redPoly = L.polygon(redCoords, {
        color: '#dc2626',
        fillColor: '#ef4444',
        fillOpacity: 0.38,
        weight: 2
      });
      redPoly.bindPopup(`
        <div class="p-2 text-xs">
          <div class="font-bold text-red-600 text-sm mb-1">⚠️ KHU VỰC CẢNH BÁO NGUY CƠ CAO (CẤP 4)</div>
          <p class="text-slate-700 mb-1">Nguy cơ lũ quét và sạt lở đất sườn đồi dốc.</p>
          <div class="bg-red-50 text-red-700 p-1.5 rounded font-mono text-[11px]">Mưa 24h: 94mm | Độ bão hòa đất: 88%</div>
        </div>
      `);
      zones.addLayer(redPoly);

      // Warning Polygon (Orange)
      const orangeCoords: [number, number][] = [
        [userLocation.lat - 0.04, userLocation.lng - 0.06],
        [userLocation.lat - 0.01, userLocation.lng - 0.03],
        [userLocation.lat - 0.02, userLocation.lng + 0.02],
        [userLocation.lat - 0.06, userLocation.lng - 0.01]
      ];
      const orangePoly = L.polygon(orangeCoords, {
        color: '#d97706',
        fillColor: '#f59e0b',
        fillOpacity: 0.35,
        weight: 2
      });
      orangePoly.bindPopup(`
        <div class="p-2 text-xs">
          <div class="font-bold text-amber-600 text-sm mb-1">⚠️ KHU VỰC THEO DÕI NGUY HIỂM</div>
          <p class="text-slate-700 mb-1">Ven sông suối - Đề phòng mực nước dâng nhanh.</p>
        </div>
      `);
      zones.addLayer(orangePoly);
    }

    // 3. Safe Points & Medical Facilities
    if (mapLayerFilter === 'ALL' || mapLayerFilter === 'SAFE' || mapLayerFilter === 'MEDICAL') {
      SAMPLE_SAFE_POINTS.forEach((sp) => {
        if (mapLayerFilter === 'MEDICAL' && sp.type !== 'medical') return;
        if (mapLayerFilter === 'SAFE' && sp.type === 'medical') return;
        if (typeof sp.lat !== 'number' || typeof sp.lng !== 'number' || isNaN(sp.lat) || isNaN(sp.lng)) return;

        let iconBg = '#8b5cf6';
        let iconSymbol = '🏛️';
        if (sp.type === 'medical') {
          iconBg = '#ef4444';
          iconSymbol = '➕';
        } else if (sp.type === 'school') {
          iconBg = '#0284c7';
          iconSymbol = '🏫';
        } else if (sp.type === 'government') {
          iconBg = '#059669';
          iconSymbol = '🏢';
        }

        const customIcon = L.divIcon({
          className: 'sp-icon',
          html: `
            <div style="background-color: ${iconBg}" class="w-7 h-7 rounded-full border-2 border-white shadow-md flex items-center justify-center text-xs text-white transform hover:scale-110 transition cursor-pointer">
              ${iconSymbol}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([sp.lat, sp.lng], { icon: customIcon });
        marker.bindPopup(`
          <div class="p-2 text-xs min-w-[200px]">
            <div class="font-bold text-slate-900 text-sm mb-1">${sp.name}</div>
            <div class="text-slate-600 mb-1">📍 ${sp.address}</div>
            <div class="text-sky-700 font-semibold mb-2">● ${sp.capacity} (${sp.distance})</div>
            <a href="tel:${sp.phone}" class="inline-flex items-center gap-1 bg-sky-600 text-white px-2.5 py-1 rounded text-[11px] font-bold hover:bg-sky-700 transition">
              📞 Gọi: ${sp.phone}
            </a>
          </div>
        `);
        safePoints.addLayer(marker);
      });
    }
  }, [userLocation, mapLayerFilter, activeWeatherOverlay]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleFlyToUserLocation = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 13, { duration: 1.2 });
    }
  };

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribePhone.trim()) return;
    setSubscribeSuccess(true);
    setTimeout(() => {
      setShowSubscribeModal(false);
      setSubscribeSuccess(false);
      setSubscribePhone('');
      setSubscribeName('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F0F4F9] text-slate-800 flex flex-col font-sans selection:bg-[#005BAC] selection:text-white">
      {/* 1. TOP OPERATIONAL UTILITY STRIP (NATIONAL EARLY WARNING NETWORK) */}
      <div className="bg-[#002147] text-white text-[11px] font-medium border-b border-sky-900/60 px-4 sm:px-6 py-1.5 select-none hidden md:block">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4">
          {/* Left: Operational Status & Scope */}
          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-wide">TRỰC BAN GIÁM SÁT 24/7</span>
            </div>
            <span className="text-sky-700">|</span>
            <div className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F5B400]" />
              <span>Cơ sở Dữ liệu Quốc gia (QĐ 19/2021/QĐ-TTg)</span>
            </div>
            <span className="text-sky-700">|</span>
            <div className="text-slate-300">
              <span>Giám sát 34 tỉnh/thành trọng điểm</span>
            </div>
          </div>

          {/* Right: Quick Severe Weather Modals & Hotline & Clock */}
          <div className="flex items-center gap-4 shrink-0 whitespace-nowrap">
            {onOpenTyphoonModal && (
              <button
                onClick={onOpenTyphoonModal}
                className="flex items-center gap-1 text-amber-300 hover:text-amber-200 transition font-semibold"
                title="Theo dõi bão & áp thấp nhiệt đới thời gian thực"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                <span>Bão Biển Đông</span>
              </button>
            )}
            {onOpenEarthquakeModal && (
              <button
                onClick={onOpenEarthquakeModal}
                className="flex items-center gap-1 text-rose-300 hover:text-rose-200 transition font-semibold"
                title="Cảnh báo động đất & sóng thần viện Vật lý Địa cầu"
              >
                <Zap className="w-3.5 h-3.5 text-rose-400" />
                <span>Động đất & Sóng thần</span>
              </button>
            )}
            <span className="text-sky-700">|</span>
            <div className="flex items-center gap-1 text-sky-200 font-mono">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>{currentTimeStr || '20:45:00, 24/08/2026'} (GMT+7)</span>
            </div>
            <span className="text-sky-700">|</span>
            <a
              href="tel:112"
              className="flex items-center gap-1 text-red-400 hover:text-red-300 font-bold tracking-tight"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
              <span>Cứu nạn: 112</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY INSTITUTIONAL HEADER & NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 sm:px-6 py-2.5 transition-all">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4">
          {/* LEFT: BRAND EMBLEM & HIERARCHY */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0 whitespace-nowrap"
            onClick={() => setActiveTab('HOME')}
            title="Trang chủ Cổng Thông Tin Dân Sự HVU"
          >
            <HvuBrandEmblem size="md" variant="light" showText={true} />
          </div>

          {/* CENTER: DYNAMIC MULTI-LEVEL CIVILIAN NAVIGATION MENU (TEXT-ONLY, SLEEK DROPDOWN, NO LINE BREAKS) */}
          <nav ref={navDropdownRef} className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0 flex-nowrap whitespace-nowrap">
            {navigationMenus
              .filter((m) => m.enabled)
              .sort((a, b) => a.order - b.order)
              .map((menu) => {
                const hasChildren = menu.children && menu.children.filter((c) => c.enabled).length > 0;
                const isDropdownOpen = activeDropdownId === menu.id;
                const isRootActive = activeTab === menu.targetTab;

                return (
                  <div
                    key={menu.id}
                    className="relative shrink-0 whitespace-nowrap"
                    onMouseEnter={() => hasChildren && setActiveDropdownId(menu.id)}
                    onMouseLeave={() => hasChildren && setActiveDropdownId(null)}
                  >
                    <button
                      onClick={() => {
                        if (hasChildren) {
                          setActiveDropdownId(isDropdownOpen ? null : menu.id);
                        } else {
                          handleExecuteNavAction(menu);
                        }
                      }}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all select-none whitespace-nowrap shrink-0 ${
                        isRootActive
                          ? 'text-[#005BAC] font-black bg-sky-50/80 shadow-2xs'
                          : 'text-slate-700 hover:text-[#005BAC] hover:bg-slate-50 font-bold'
                      }`}
                    >
                      <span className="whitespace-nowrap">{menu.title}</span>
                      {hasChildren && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                            isDropdownOpen ? 'rotate-180 text-[#005BAC]' : ''
                          }`}
                        />
                      )}
                      {menu.badge && (
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full text-white shrink-0 whitespace-nowrap ${
                            menu.badgeColor === 'red'
                              ? 'bg-red-600'
                              : menu.badgeColor === 'amber'
                              ? 'bg-amber-600'
                              : 'bg-sky-600'
                          }`}
                        >
                          {menu.badge}
                        </span>
                      )}
                    </button>

                    {/* Multi-Level Submenu Dropdown */}
                    {hasChildren && isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 min-w-[240px] bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-md">
                        {menu.children!
                          .filter((sub) => sub.enabled)
                          .sort((a, b) => a.order - b.order)
                          .map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => handleExecuteNavAction(sub)}
                              className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-[#005BAC] transition flex items-center justify-between group whitespace-nowrap"
                            >
                              <span className="group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
                                {sub.title}
                              </span>
                              {sub.badge && (
                                <span
                                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full text-white shrink-0 whitespace-nowrap ${
                                    sub.badgeColor === 'red'
                                      ? 'bg-red-600'
                                      : sub.badgeColor === 'amber'
                                      ? 'bg-amber-600'
                                      : 'bg-sky-600'
                                  }`}
                                >
                                  {sub.badge}
                                </span>
                              )}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </nav>

          {/* RIGHT ACTION HUB: Consolidated Clean Action Group */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 whitespace-nowrap">
            {/* Subscribe Citizen Alert CTA */}
            <button
              onClick={() => setShowSubscribeModal(true)}
              className="bg-sky-50 hover:bg-sky-100 text-[#005BAC] border border-sky-200/80 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 shadow-2xs whitespace-nowrap shrink-0 cursor-pointer"
              title="Đăng ký nhận thông báo thiên tai qua SMS/Zalo"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Nhận cảnh báo</span>
            </button>

            {/* Citizen Disaster Reporting CTA (Dexuat 07-CITIZEN) */}
            <button
              onClick={() => setShowCitizenReportModal(true)}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border border-amber-500/40 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 shadow-2xs whitespace-nowrap shrink-0 cursor-pointer"
              title="Gửi báo cáo hiện trường sạt lở, lũ quét từ người dân"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>Báo cáo hiện trường</span>
            </button>

            {/* WeatherNext 3 AI Button on Public Portal */}
            {onOpenWeatherNext && (
              <button
                onClick={onOpenWeatherNext}
                className="bg-gradient-to-r from-teal-700 via-cyan-700 to-sky-700 hover:from-teal-600 hover:to-sky-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-md shadow-cyan-900/30 transition-all flex items-center gap-1.5 active:scale-95 whitespace-nowrap shrink-0 cursor-pointer border border-cyan-400/50 group"
                title="Google DeepMind WeatherNext 3 - Khí tượng AI 5km & Phương án A"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
                <span>WeatherNext 3</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-white/20 text-cyan-100 rounded-md font-mono font-bold">5km</span>
              </button>
            )}

            {/* Consolidated Login Button */}
            <button
              onClick={onOpenLoginModal}
              className="bg-[#005BAC] hover:bg-[#003B73] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
              title="Đăng nhập dành cho Cán bộ & Trực ban Chỉ huy"
            >
              <LogIn className="w-3.5 h-3.5 text-sky-200" />
              <span>Đăng nhập</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER: MODERN SPLIT-VIEW WORKSPACE (9-COLUMNS HERO MAP ON LEFT + 3-COLUMNS INFO PANEL ON RIGHT) */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-2 sm:p-3 lg:py-2 lg:px-3.5 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
          {/* ========================================================
              LEFT COLUMN: HERO METEOROLOGICAL & WINDY WEATHER ENGINE (9/12 = 75%)
              ======================================================== */}
          <div
            id="section-map"
            className={`lg:col-span-9 xl:col-span-9 ${
              isMapFullscreen
                ? 'fixed inset-0 z-50 p-4 bg-slate-950/95 flex flex-col backdrop-blur-lg'
                : 'relative flex flex-col space-y-2'
            }`}
          >
            {/* MAP STAGE CONTAINER (GENUINE WINDY.COM ENGINE OR LOCAL GIS - 100VH RESPONSIVE) */}
            <div
              className={`relative w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-md ${
                isMapFullscreen ? 'flex-1 h-full' : 'h-[520px] sm:h-[600px] lg:h-[calc(100vh-140px)] min-h-[480px]'
              }`}
            >
              {/* LEAFLET LOCAL GIS RISK & EVACUATION CANVAS (ALWAYS MOUNTED & SIZED IN DOM) */}
              <div
                ref={mapContainerRef}
                className={`absolute inset-0 w-full h-full transition-opacity duration-200 ${
                  mapEngineMode === 'gis' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              />

              {/* WINDY.COM HIGH-FIDELITY INTERACTIVE ENGINE */}
              <iframe
                title="Windy Weather Engine"
                src={`https://embed.windy.com/embed.html?lat=${userLocation.lat}&lon=${userLocation.lng}${
                  showWeatherMeteogram
                    ? `&detailLat=${userLocation.lat}&detailLon=${userLocation.lng}&detail=true`
                    : '&detail=false'
                }&zoom=7&level=surface&overlay=${windyOverlay}&product=ecmwf&menu=true&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`}
                className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-200 ${
                  mapEngineMode === 'windy' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
                allow="geolocation"
              />

              {/* FLOATING TOP-LEFT: GPS & PROVINCE STATUS CHIP */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-auto">
                <div className="bg-slate-950/85 hover:bg-slate-950 text-white backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 shadow-xl flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  <div className="leading-tight">
                    <div className="text-[11px] font-bold text-slate-100">
                      Bạn đang ở toạ độ GPS
                    </div>
                    <div className="text-[10px] font-mono text-cyan-300 font-semibold truncate max-w-[200px] sm:max-w-[280px]">
                      ({userLocation.lat.toFixed(3)}°B, {userLocation.lng.toFixed(3)}°Đ)
                    </div>
                  </div>
                </div>

                {/* GPS Fly-to Button */}
                <button
                  onClick={handleFlyToUserLocation}
                  className="bg-slate-950/80 hover:bg-slate-950 text-white backdrop-blur-md p-2.5 rounded-2xl border border-white/20 shadow-xl transition-all hover:scale-105"
                  title="Phóng to vị trí hiện tại của bạn"
                >
                  <Crosshair className="w-4 h-4 text-sky-400" />
                </button>

                {/* Fullscreen Toggle */}
                <button
                  onClick={() => setIsMapFullscreen(!isMapFullscreen)}
                  className="bg-slate-950/80 hover:bg-slate-950 text-white backdrop-blur-md p-2.5 rounded-2xl border border-white/20 shadow-xl transition-all hover:scale-105"
                  title={isMapFullscreen ? 'Thu nhỏ bản đồ' : 'Toàn màn hình'}
                >
                  {isMapFullscreen ? <Minimize2 className="w-4 h-4 text-slate-200" /> : <Maximize2 className="w-4 h-4 text-slate-200" />}
                </button>
              </div>

              {/* FLOATING RIGHT: ICONIC WINDY-STYLE VERTICAL LAYER SWITCHER (EXACT MATCH TO WINDY.COM) */}
              <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-1.5 pointer-events-auto select-none">
                <div className="flex items-center gap-2">
                  {/* Weather Meteogram Floating Toggle Button */}
                  <button
                    onClick={() => {
                      if (mapEngineMode !== 'windy') {
                        setMapEngineMode('windy');
                      }
                      setShowWeatherMeteogram(!showWeatherMeteogram);
                    }}
                    className={`backdrop-blur-md pl-3.5 pr-1.5 py-1 rounded-full border shadow-2xl flex items-center gap-2 transition-all hover:scale-105 cursor-pointer ${
                      showWeatherMeteogram && mapEngineMode === 'windy'
                        ? 'bg-sky-600/95 text-white border-white/80 ring-2 ring-white/60 shadow-sky-500/40'
                        : 'bg-slate-950/85 hover:bg-slate-950 text-white border-white/20'
                    }`}
                    title="Hiển thị / Ẩn bảng dự báo thời tiết chi tiết theo giờ (Meteogram)"
                  >
                    <span className="text-xs font-black tracking-wide text-white">Thời tiết</span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md text-xs font-bold transition ${
                      showWeatherMeteogram && mapEngineMode === 'windy' ? 'bg-sky-500' : 'bg-blue-600 hover:bg-blue-700'
                    }`}>
                      🌤️
                    </div>
                  </button>

                  {/* Menu Toggle Header Button */}
                  <button
                    onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
                    className="bg-slate-950/85 hover:bg-slate-950 text-white backdrop-blur-md pl-3.5 pr-1.5 py-1 rounded-full border border-white/20 shadow-2xl flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                    title="Đóng / Mở danh sách lớp bản đồ khí tượng"
                  >
                    <span className="text-xs font-black tracking-wide text-white">Trình đơn</span>
                    <div className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-md text-xs font-bold transition">
                      ☰
                    </div>
                  </button>
                </div>

                {/* Vertical Floating Layers List */}
                {isLayerMenuOpen && (
                  <div className="flex flex-col items-end gap-1 animate-in fade-in slide-in-from-right-4 duration-200">
                    {/* Weather Meteogram */}
                    <button
                      onClick={() => setShowWeatherMeteogram(!showWeatherMeteogram)}
                      className={`backdrop-blur-md rounded-full shadow-lg border pl-3.5 pr-1 py-1 flex items-center gap-2.5 transition-all hover:scale-105 text-xs font-semibold ${
                        showWeatherMeteogram
                          ? 'bg-sky-600/90 text-white border-white/80 ring-2 ring-white/60 shadow-sky-500/30 font-bold'
                          : 'bg-slate-900/80 hover:bg-slate-900/95 text-slate-100 border-white/20'
                      }`}
                    >
                      <span>Biểu đồ thời tiết</span>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-500 via-blue-400 to-indigo-600 border border-white/80 shadow-inner flex items-center justify-center text-[10px]">
                        🌤️
                      </div>
                    </button>

                    {/* Google WeatherNext 3 AI Layer */}
                    {onOpenWeatherNext && (
                      <button
                        onClick={onOpenWeatherNext}
                        className="backdrop-blur-md rounded-full shadow-lg border pl-3.5 pr-1 py-1 flex items-center gap-2.5 transition-all hover:scale-105 text-xs font-bold bg-gradient-to-r from-teal-950/90 to-cyan-950/90 border-cyan-400/60 text-cyan-200 hover:border-cyan-300 ring-1 ring-cyan-500/30"
                        title="Google DeepMind WeatherNext 3 - Dự báo Khí tượng 5km & Đối soát Đa Mô hình"
                      >
                        <span>WeatherNext 3 AI</span>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-teal-500 text-slate-950 flex items-center justify-center font-extrabold text-[10px] shadow-sm">
                          5k
                        </div>
                      </button>
                    )}
                    {/* 1. Radar thời tiết */}
                    <button
                      onClick={() => {
                        setMapEngineMode('windy');
                        setWindyOverlay('radar');
                      }}
                      className={`backdrop-blur-md rounded-full shadow-lg border pl-3.5 pr-1 py-1 flex items-center gap-2.5 transition-all hover:scale-105 text-xs font-semibold ${
                        mapEngineMode === 'windy' && windyOverlay === 'radar'
                          ? 'bg-red-600/90 text-white border-white/80 ring-2 ring-white/60 shadow-red-500/30 font-bold'
                          : 'bg-slate-900/80 hover:bg-slate-900/95 text-slate-100 border-white/20'
                      }`}
                    >
                      <span>Radar thời tiết</span>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-green-500 via-yellow-400 to-red-500 border border-white/80 shadow-inner flex items-center justify-center text-[10px]">
                        📡
                      </div>
                    </button>

                    {/* 2. Vệ tinh */}
                    <button
                      onClick={() => {
                        setMapEngineMode('windy');
                        setWindyOverlay('satellite');
                      }}
                      className={`backdrop-blur-md rounded-full shadow-lg border pl-3.5 pr-1 py-1 flex items-center gap-2.5 transition-all hover:scale-105 text-xs font-semibold ${
                        mapEngineMode === 'windy' && windyOverlay === 'satellite'
                          ? 'bg-red-600/90 text-white border-white/80 ring-2 ring-white/60 shadow-red-500/30 font-bold'
                          : 'bg-slate-900/80 hover:bg-slate-900/95 text-slate-100 border-white/20'
                      }`}
                    >
                      <span>Vệ tinh</span>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 via-sky-300 to-indigo-700 border border-white/80 shadow-inner flex items-center justify-center text-[10px]">
                        🛰️
                      </div>
                    </button>

                    {/* 3. Gió */}
                    <button
                      onClick={() => {
                        setMapEngineMode('windy');
                        setWindyOverlay('wind');
                      }}
                      className={`backdrop-blur-md rounded-full shadow-lg border pl-3.5 pr-1 py-1 flex items-center gap-2.5 transition-all hover:scale-105 text-xs font-semibold ${
                        mapEngineMode === 'windy' && windyOverlay === 'wind'
                          ? 'bg-red-600/90 text-white border-white/80 ring-2 ring-white/60 shadow-red-500/30 font-bold'
                          : 'bg-slate-900/80 hover:bg-slate-900/95 text-slate-100 border-white/20'
                      }`}
                    >
                      <span>Gió</span>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-teal-500 via-emerald-400 to-lime-400 border border-white/80 shadow-inner flex items-center justify-center text-[10px]">
                        💨
                      </div>
                    </button>

                    {/* 4. Mưa, sét */}
                    <button
                      onClick={() => {
                        setMapEngineMode('windy');
                        setWindyOverlay('rain');
                      }}
                      className={`backdrop-blur-md rounded-full shadow-lg border pl-3.5 pr-1 py-1 flex items-center gap-2.5 transition-all hover:scale-105 text-xs font-semibold ${
                        mapEngineMode === 'windy' && windyOverlay === 'rain'
                          ? 'bg-red-600/90 text-white border-white/80 ring-2 ring-white/60 shadow-red-500/30 font-bold'
                          : 'bg-slate-900/80 hover:bg-slate-900/95 text-slate-100 border-white/20'
                      }`}
                    >
                      <span>Mưa, sét</span>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-600 via-blue-500 to-sky-400 border border-white/80 shadow-inner flex items-center justify-center text-[10px]">
                        🌧️
                      </div>
                    </button>

                    {/* 5. Nhiệt độ */}
                    <button
                      onClick={() => {
                        setMapEngineMode('windy');
                        setWindyOverlay('temp');
                      }}
                      className={`backdrop-blur-md rounded-full shadow-lg border pl-3.5 pr-1 py-1 flex items-center gap-2.5 transition-all hover:scale-105 text-xs font-semibold ${
                        mapEngineMode === 'windy' && windyOverlay === 'temp'
                          ? 'bg-red-600/90 text-white border-white/80 ring-2 ring-white/60 shadow-red-500/30 font-bold'
                          : 'bg-slate-900/80 hover:bg-slate-900/95 text-slate-100 border-white/20'
                      }`}
                    >
                      <span>Nhiệt độ</span>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 border border-white/80 shadow-inner flex items-center justify-center text-[10px]">
                        🌡️
                      </div>
                    </button>

                    {/* 6. Trình theo dõi bão */}
                    <button
                      onClick={() => {
                        setMapEngineMode('windy');
                        setWindyOverlay('hurricanes');
                      }}
                      className={`backdrop-blur-md rounded-full shadow-lg border pl-3.5 pr-1 py-1 flex items-center gap-2.5 transition-all hover:scale-105 text-xs font-semibold ${
                        mapEngineMode === 'windy' && windyOverlay === 'hurricanes'
                          ? 'bg-red-600/90 text-white border-white/80 ring-2 ring-white/60 shadow-red-500/30 font-bold'
                          : 'bg-slate-900/80 hover:bg-slate-900/95 text-slate-100 border-white/20'
                      }`}
                    >
                      <span>Trình theo dõi bão</span>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-pink-600 border border-white/80 shadow-inner flex items-center justify-center text-[10px] animate-pulse">
                        🌪️
                      </div>
                    </button>

                    {/* 7. Mây */}
                    <button
                      onClick={() => {
                        setMapEngineMode('windy');
                        setWindyOverlay('clouds');
                      }}
                      className={`backdrop-blur-md rounded-full shadow-lg border pl-3.5 pr-1 py-1 flex items-center gap-2.5 transition-all hover:scale-105 text-xs font-semibold ${
                        mapEngineMode === 'windy' && windyOverlay === 'clouds'
                          ? 'bg-red-600/90 text-white border-white/80 ring-2 ring-white/60 shadow-red-500/30 font-bold'
                          : 'bg-slate-900/80 hover:bg-slate-900/95 text-slate-100 border-white/20'
                      }`}
                    >
                      <span>Mây</span>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-slate-400 via-slate-300 to-zinc-500 border border-white/80 shadow-inner flex items-center justify-center text-[10px]">
                        ☁️
                      </div>
                    </button>

                    {/* 8. Sóng */}
                    <button
                      onClick={() => {
                        setMapEngineMode('windy');
                        setWindyOverlay('waves');
                      }}
                      className={`backdrop-blur-md rounded-full shadow-lg border pl-3.5 pr-1 py-1 flex items-center gap-2.5 transition-all hover:scale-105 text-xs font-semibold ${
                        mapEngineMode === 'windy' && windyOverlay === 'waves'
                          ? 'bg-red-600/90 text-white border-white/80 ring-2 ring-white/60 shadow-red-500/30 font-bold'
                          : 'bg-slate-900/80 hover:bg-slate-900/95 text-slate-100 border-white/20'
                      }`}
                    >
                      <span>Sóng</span>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-fuchsia-600 border border-white/80 shadow-inner flex items-center justify-center text-[10px]">
                        🌊
                      </div>
                    </button>

                    {/* 9. Tích lũy lượng mưa */}
                    <button
                      onClick={() => {
                        setMapEngineMode('windy');
                        setWindyOverlay('rainAccu');
                      }}
                      className={`backdrop-blur-md rounded-full shadow-lg border pl-3.5 pr-1 py-1 flex items-center gap-2.5 transition-all hover:scale-105 text-xs font-semibold ${
                        mapEngineMode === 'windy' && windyOverlay === 'rainAccu'
                          ? 'bg-red-600/90 text-white border-white/80 ring-2 ring-white/60 shadow-red-500/30 font-bold'
                          : 'bg-slate-900/80 hover:bg-slate-900/95 text-slate-100 border-white/20'
                      }`}
                    >
                      <span>Tích lũy lượng mưa</span>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 via-orange-600 to-red-600 border border-white/80 shadow-inner flex items-center justify-center text-[10px]">
                        💧
                      </div>
                    </button>

                    {/* 10. Dông có sấm sét */}
                    <button
                      onClick={() => {
                        setMapEngineMode('windy');
                        setWindyOverlay('thunder');
                      }}
                      className={`backdrop-blur-md rounded-full shadow-lg border pl-3.5 pr-1 py-1 flex items-center gap-2.5 transition-all hover:scale-105 text-xs font-semibold ${
                        mapEngineMode === 'windy' && windyOverlay === 'thunder'
                          ? 'bg-red-600/90 text-white border-white/80 ring-2 ring-white/60 shadow-red-500/30 font-bold'
                          : 'bg-slate-900/80 hover:bg-slate-900/95 text-slate-100 border-white/20'
                      }`}
                    >
                      <span>Dông có sấm sét</span>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 via-amber-500 to-red-500 border border-white/80 shadow-inner flex items-center justify-center text-[10px]">
                        ⚡
                      </div>
                    </button>

                    {/* 11. GIS Địa bàn & Điểm sơ tán */}
                    <button
                      onClick={() => setMapEngineMode(mapEngineMode === 'gis' ? 'windy' : 'gis')}
                      className={`backdrop-blur-md rounded-full shadow-lg border pl-3.5 pr-1 py-1 flex items-center gap-2.5 transition-all hover:scale-105 text-xs font-black ${
                        mapEngineMode === 'gis'
                          ? 'bg-[#005BAC] text-white border-white/90 ring-2 ring-white/60 shadow-sky-500/40'
                          : 'bg-slate-900/85 hover:bg-slate-900 text-sky-300 border-sky-400/40'
                      }`}
                    >
                      <span>Bản đồ GIS Địa bàn</span>
                      <div className="w-6 h-6 rounded-full bg-[#005BAC] border border-white/80 shadow-inner flex items-center justify-center text-[10px] text-white">
                        🛡️
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* FLOATING BOTTOM: GIS CONTROLS & ZOOM TOOLBAR */}
              {mapEngineMode === 'gis' && (
                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none gap-2">
                  {/* Layer Filters & Basemap */}
                  <div className="bg-slate-950/85 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-2xl text-xs flex flex-wrap items-center gap-1.5 pointer-events-auto">
                    <button
                      onClick={() => setMapLayerFilter(mapLayerFilter === 'WARNING' ? 'ALL' : 'WARNING')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
                        mapLayerFilter === 'WARNING'
                          ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                          : 'bg-white/10 text-slate-200 hover:bg-white/20'
                      }`}
                    >
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>Vùng nguy cơ</span>
                    </button>

                    <button
                      onClick={() => setMapLayerFilter(mapLayerFilter === 'SAFE' ? 'ALL' : 'SAFE')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
                        mapLayerFilter === 'SAFE'
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                          : 'bg-white/10 text-slate-200 hover:bg-white/20'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Điểm sơ tán ({SAMPLE_SAFE_POINTS.length})</span>
                    </button>

                    <button
                      onClick={() => setMapLayerFilter(mapLayerFilter === 'MEDICAL' ? 'ALL' : 'MEDICAL')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
                        mapLayerFilter === 'MEDICAL'
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-500/30'
                          : 'bg-white/10 text-slate-200 hover:bg-white/20'
                      }`}
                    >
                      <span>➕ Y tế cứu hộ</span>
                    </button>

                    {/* Basemap Switcher (OSM, Satellite, Terrain) */}
                    <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-xl border border-white/10 text-[11px] font-semibold ml-1">
                      <button
                        onClick={() => setBaseMapType('osm')}
                        className={`px-2 py-1 rounded-lg transition ${
                          baseMapType === 'osm' ? 'bg-[#005BAC] text-white' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        Bản đồ
                      </button>
                      <button
                        onClick={() => setBaseMapType('satellite')}
                        className={`px-2 py-1 rounded-lg transition ${
                          baseMapType === 'satellite' ? 'bg-[#005BAC] text-white' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        Vệ tinh
                      </button>
                      <button
                        onClick={() => setBaseMapType('terrain')}
                        className={`px-2 py-1 rounded-lg transition ${
                          baseMapType === 'terrain' ? 'bg-[#005BAC] text-white' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        Địa hình
                      </button>
                    </div>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex flex-col gap-1 pointer-events-auto">
                    <button
                      onClick={handleZoomIn}
                      className="w-9 h-9 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center font-black text-white hover:bg-slate-900 transition hover:scale-105 text-base"
                      title="Phóng to bản đồ"
                    >
                      +
                    </button>
                    <button
                      onClick={handleZoomOut}
                      className="w-9 h-9 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center font-black text-white hover:bg-slate-900 transition hover:scale-105 text-base"
                      title="Thu nhỏ bản đồ"
                    >
                      -
                    </button>
                  </div>
                </div>
              )}

              {/* SEAMLESS VIETNAMESE METEOROLOGICAL RADAR COLOR SCALE (REPLACING dBZ 0..60 DIRECTLY) */}
              {mapEngineMode === 'windy' && !showWeatherMeteogram && (windyOverlay === 'radar' || windyOverlay === 'rain' || windyOverlay === 'thunder') && (
                <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-auto select-none">
                  <div
                    className="w-full h-6 px-3 flex items-center justify-between text-[11px] font-bold text-white shadow-lg border-t border-white/20"
                    style={{
                      background: 'linear-gradient(90deg, #1e1b4b 0%, #1e40af 10%, #0d9488 24%, #16a34a 38%, #ca8a04 52%, #ea580c 68%, #dc2626 82%, #9333ea 94%, #c026d3 100%)'
                    }}
                  >
                    <span className="text-[10px] uppercase tracking-wider text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] shrink-0 font-extrabold pr-2">
                      Mức độ nguy hiểm:
                    </span>
                    <div className="flex-1 flex items-center justify-between text-[10px] sm:text-[11px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                      <span className="text-sky-200">Mây mỏng</span>
                      <span className="text-emerald-100">Mưa nhỏ</span>
                      <span className="text-emerald-200">Mưa vừa</span>
                      <span className="text-yellow-100">Mưa to</span>
                      <span className="text-white font-extrabold">Mưa rất to / Nguy hiểm</span>
                      <span className="text-pink-100 font-extrabold">Mưa đá / Cực đoan</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: MODERN COMPACT WEATHER & EARLY WARNING WIDGET (3/12 = 25%)
              ======================================================== */}
          <div className="lg:col-span-3 xl:col-span-3 space-y-2.5 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-1 custom-scrollbar">
            {/* WIDGET 1: THỜI TIẾT & AN TOÀN TẠI VỊ TRÍ CỦA BẠN (COMPACT & INTUITIVE) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm space-y-2.5 relative overflow-hidden">
              {/* Top Location Row */}
              <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-xs truncate">
                  <div className="w-6 h-6 rounded-lg bg-[#005BAC]/10 flex items-center justify-center text-[#005BAC] shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-[#005BAC]" />
                  </div>
                  <span className="truncate">{selectedCommuneName || userLocation.address}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setShowLocationModal(true)}
                    className="text-[10px] text-[#005BAC] font-bold bg-sky-50 hover:bg-sky-100 px-2 py-0.5 rounded-lg border border-sky-200/80 transition"
                  >
                    Đổi
                  </button>
                  <button
                    onClick={detectUserGPS}
                    disabled={isDetectingLocation}
                    className="text-[10px] text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200 transition flex items-center gap-0.5"
                    title="Định vị GPS tự động"
                  >
                    <LocateFixed className={`w-2.5 h-2.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                    <span>GPS</span>
                  </button>
                </div>
              </div>

              {/* Safety Status Pill */}
              <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-xs">
                    🛡️
                  </div>
                  <div>
                    <div className="text-xs font-black text-emerald-800 leading-tight">
                      KHU VỰC AN TOÀN
                    </div>
                    <div className="text-[10px] text-emerald-700 font-medium">
                      Cấp 1 • Không có cảnh báo nguy hiểm
                    </div>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>

              {/* Integrated Compact Weather Strip */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌤️</span>
                  <div>
                    <div className="text-base font-black text-slate-800 leading-none">
                      {weatherMetrics.temp}
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">Nhiều mây, dịu</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 border-l border-slate-200 pl-3">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 font-normal">Độ ẩm</span>
                    <span className="text-sky-700 font-extrabold">{weatherMetrics.humidity}</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200" />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 font-normal">Mưa 24h</span>
                    <span className="text-blue-700 font-extrabold">{weatherMetrics.rain24h}</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200" />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 font-normal">Gió</span>
                    <span className="text-teal-700 font-extrabold">{weatherMetrics.windSpeed}</span>
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-400 font-mono text-right">
                Cập nhật lúc {currentTimeStr}
              </div>
            </div>

            {/* WIDGET 2: TỔNG QUAN CẢNH BÁO TOÀN TỈNH (STREAMLINED TILES & CTA) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-[11px] text-slate-800 uppercase tracking-wider">
                    CẢNH BÁO TOÀN TỈNH
                  </span>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.2 rounded">
                    25 Xã/Phường
                  </span>
                </div>
                <button
                  onClick={() => setShowActiveAlertsModal(true)}
                  className="text-[10px] text-[#005BAC] font-bold hover:underline"
                >
                  Xem chi tiết →
                </button>
              </div>

              {/* 4 Sleek Color Segment Pills */}
              <div className="grid grid-cols-4 gap-1.5 text-center">
                <button
                  onClick={() => {
                    setAlertsFilterLevel('EMERGENCY');
                    setShowActiveAlertsModal(true);
                  }}
                  className="bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl p-1.5 transition"
                >
                  <div className="text-xs font-black text-red-700">{warningCounts.emergency}</div>
                  <div className="text-[9px] font-bold text-red-600 mt-0.5">Khẩn cấp</div>
                </button>

                <button
                  onClick={() => {
                    setAlertsFilterLevel('DANGER');
                    setShowActiveAlertsModal(true);
                  }}
                  className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl p-1.5 transition"
                >
                  <div className="text-xs font-black text-orange-700">{warningCounts.danger}</div>
                  <div className="text-[9px] font-bold text-orange-600 mt-0.5">Nguy hiểm</div>
                </button>

                <button
                  onClick={() => {
                    setAlertsFilterLevel('MONITOR');
                    setShowActiveAlertsModal(true);
                  }}
                  className="bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl p-1.5 transition"
                >
                  <div className="text-xs font-black text-amber-700">{warningCounts.monitor}</div>
                  <div className="text-[9px] font-bold text-amber-600 mt-0.5">Theo dõi</div>
                </button>

                <button
                  onClick={() => {
                    setAlertsFilterLevel('ALL');
                    setShowActiveAlertsModal(true);
                  }}
                  className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl p-1.5 transition"
                >
                  <div className="text-xs font-black text-emerald-700">{warningCounts.normal}</div>
                  <div className="text-[9px] font-bold text-emerald-600 mt-0.5">An toàn</div>
                </button>
              </div>

              {/* Flash News Strip */}
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl px-2.5 py-1.5 flex items-center justify-between gap-1.5 text-xs">
                <div className="flex items-center gap-1 text-amber-900 text-[11px] font-medium truncate">
                  <span>📢</span>
                  <span className="truncate">Đêm nay có mưa vừa, mưa to cục bộ.</span>
                </div>
                <button
                  onClick={() => setShowActiveAlertsModal(true)}
                  className="text-[10px] font-bold text-[#005BAC] hover:underline whitespace-nowrap shrink-0"
                >
                  Xem
                </button>
              </div>

              {/* Quick Subscribe Button */}
              <button
                onClick={() => setShowSubscribeModal(true)}
                className="w-full bg-gradient-to-r from-[#005BAC] to-[#0078D4] hover:from-[#004b8d] hover:to-[#005BAC] text-white font-bold text-xs py-2 px-3 rounded-xl shadow-xs transition flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Nhận Cảnh Báo Miễn Phí (Zalo OA / SMS)</span>
                </span>
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">Đăng ký</span>
              </button>
            </div>

            {/* WIDGET 3: 7 NGUY CƠ THIÊN TAI (COMPACT 2-COLUMN GRID) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[11px] text-slate-800 uppercase tracking-wider">
                  7 NGUY CƠ THIÊN TAI
                </span>
                <span className="text-[9px] text-slate-400">Chọn lớp bản đồ</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {/* 1. Ngập lụt */}
                <button
                  onClick={() => {
                    setMapEngineMode('windy');
                    setWindyOverlay('rainAccu');
                    setSelectedRiskDetail('ngap_lut');
                  }}
                  className={`p-2 rounded-xl border text-left transition flex items-center gap-1.5 ${
                    mapEngineMode === 'windy' && windyOverlay === 'rainAccu'
                      ? 'bg-sky-100 border-sky-400 font-bold text-sky-900 ring-1 ring-sky-300'
                      : 'bg-slate-50 hover:bg-sky-50 border-slate-200/70 text-slate-700'
                  }`}
                >
                  <span className="text-sm">🌊</span>
                  <span className="text-[11px] font-bold truncate">Ngập lụt</span>
                </button>

                {/* 2. Sạt lở đất */}
                <button
                  onClick={() => {
                    setMapEngineMode('gis');
                    setActiveWeatherOverlay('zones');
                    setSelectedRiskDetail('sat_lo');
                  }}
                  className={`p-2 rounded-xl border text-left transition flex items-center gap-1.5 ${
                    mapEngineMode === 'gis' && activeWeatherOverlay === 'zones'
                      ? 'bg-amber-100 border-amber-400 font-bold text-amber-900 ring-1 ring-amber-300'
                      : 'bg-slate-50 hover:bg-amber-50 border-slate-200/70 text-slate-700'
                  }`}
                >
                  <span className="text-sm">⛰️</span>
                  <span className="text-[11px] font-bold truncate">Sạt lở đồi dốc</span>
                </button>

                {/* 3. Bão */}
                <button
                  onClick={() => {
                    setMapEngineMode('windy');
                    setWindyOverlay('hurricanes');
                    setSelectedRiskDetail('bao');
                  }}
                  className={`p-2 rounded-xl border text-left transition flex items-center gap-1.5 ${
                    mapEngineMode === 'windy' && windyOverlay === 'hurricanes'
                      ? 'bg-teal-100 border-teal-400 font-bold text-teal-900 ring-1 ring-teal-300'
                      : 'bg-slate-50 hover:bg-teal-50 border-slate-200/70 text-slate-700'
                  }`}
                >
                  <span className="text-sm">🌪️</span>
                  <span className="text-[11px] font-bold truncate">Bão Biển Đông</span>
                </button>

                {/* 4. Sóng biển / Động đất */}
                <button
                  onClick={() => {
                    setMapEngineMode('windy');
                    setWindyOverlay('waves');
                    if (onOpenEarthquakeModal) onOpenEarthquakeModal();
                    else setShowEarthquakeModal(true);
                  }}
                  className={`p-2 rounded-xl border text-left transition flex items-center gap-1.5 ${
                    mapEngineMode === 'windy' && windyOverlay === 'waves'
                      ? 'bg-orange-100 border-orange-400 font-bold text-orange-950 ring-1 ring-orange-300'
                      : 'bg-slate-50 hover:bg-orange-50 border-slate-200/70 text-slate-700'
                  }`}
                >
                  <span className="text-sm">⚡</span>
                  <span className="text-[11px] font-bold truncate">Động đất / Sóng</span>
                </button>

                {/* 5. Dông sấm sét */}
                <button
                  onClick={() => {
                    setMapEngineMode('windy');
                    setWindyOverlay('thunder');
                    setSelectedRiskDetail('giong_set');
                  }}
                  className={`p-2 rounded-xl border text-left transition flex items-center gap-1.5 ${
                    mapEngineMode === 'windy' && windyOverlay === 'thunder'
                      ? 'bg-purple-100 border-purple-400 font-bold text-purple-900 ring-1 ring-purple-300'
                      : 'bg-slate-50 hover:bg-purple-50 border-slate-200/70 text-slate-700'
                  }`}
                >
                  <span className="text-sm">🌩️</span>
                  <span className="text-[11px] font-bold truncate">Dông sấm sét</span>
                </button>

                {/* 6. Mưa lớn & Radar */}
                <button
                  onClick={() => {
                    setMapEngineMode('windy');
                    setWindyOverlay('rain');
                    setSelectedRiskDetail('mua_lon');
                  }}
                  className={`p-2 rounded-xl border text-left transition flex items-center gap-1.5 ${
                    mapEngineMode === 'windy' && windyOverlay === 'rain'
                      ? 'bg-blue-100 border-blue-400 font-bold text-blue-900 ring-1 ring-blue-300'
                      : 'bg-slate-50 hover:bg-blue-50 border-slate-200/70 text-slate-700'
                  }`}
                >
                  <span className="text-sm">🌧️</span>
                  <span className="text-[11px] font-bold truncate">Mưa lớn / Radar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            ROW 4: 3-COLUMN ACTION & GUIDANCE SECTION
            ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* COLUMN 1: BẢN TIN CẢNH BÁO MỚI NHẤT */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                <h3 className="font-extrabold text-xs text-slate-600 uppercase tracking-wider">
                  BẢN TIN CẢNH BÁO MỚI NHẤT
                </h3>
                <button
                  onClick={() => setActiveTab('ALERTS')}
                  className="text-xs text-[#005BAC] font-bold hover:underline flex items-center gap-0.5"
                >
                  <span>Xem tất cả</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3.5">
                {/* News 1: Khẩn cấp */}
                <div
                  onClick={() =>
                    setSelectedNewsArticle({
                      level: 'Khẩn cấp',
                      time: '17:45 - 22/08/2026',
                      title: 'Cảnh báo nguy cơ sạt lở đất tại 3 xã miền núi',
                      desc: 'Nguy cơ cao trong 3 giờ tới. Người dân cần chủ động di chuyển đến nơi an toàn.',
                      color: 'red'
                    })
                  }
                  className="p-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <div className="flex items-center gap-1.5 text-slate-600 font-mono">
                      <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                      <span>17:45 - 22/08/2026</span>
                    </div>
                    <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-[10px]">
                      Khẩn cấp
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 leading-snug">
                    Cảnh báo nguy cơ sạt lở đất tại 3 xã miền núi
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    Nguy cơ cao trong 3 giờ tới. Người dân cần chủ động di chuyển đến nơi an toàn.
                  </p>
                </div>

                {/* News 2: Nguy hiểm */}
                <div
                  onClick={() =>
                    setSelectedNewsArticle({
                      level: 'Nguy hiểm',
                      time: '16:30 - 22/08/2026',
                      title: 'Mưa lớn có khả năng xảy ra trên diện rộng',
                      desc: 'Lượng mưa dự báo 80-120mm trong 24h tới.',
                      color: 'orange'
                    })
                  }
                  className="p-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <div className="flex items-center gap-1.5 text-slate-600 font-mono">
                      <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                      <span>16:30 - 22/08/2026</span>
                    </div>
                    <span className="bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded text-[10px]">
                      Nguy hiểm
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 leading-snug">
                    Mưa lớn có khả năng xảy ra trên diện rộng
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    Lượng mưa dự báo 80-120mm trong 24h tới.
                  </p>
                </div>

                {/* News 3: Theo dõi */}
                <div
                  onClick={() =>
                    setSelectedNewsArticle({
                      level: 'Theo dõi',
                      time: '15:10 - 22/08/2026',
                      title: 'Theo dõi diễn biến áp thấp nhiệt đới trên biển Đông',
                      desc: 'Áp thấp đang di chuyển theo hướng Tây Tây Bắc.',
                      color: 'amber'
                    })
                  }
                  className="p-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <div className="flex items-center gap-1.5 text-slate-600 font-mono">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                      <span>15:10 - 22/08/2026</span>
                    </div>
                    <span className="bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded text-[10px]">
                      Theo dõi
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 leading-snug">
                    Theo dõi diễn biến áp thấp nhiệt đới trên biển Đông
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    Áp thấp đang di chuyển theo hướng Tây Tây Bắc.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: ĐIỂM AN TOÀN GẦN BẠN */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                <h3 className="font-extrabold text-xs text-slate-600 uppercase tracking-wider">
                  ĐIỂM AN TOÀN GẦN BẠN
                </h3>
                <button
                  onClick={() => {
                    const mapElem = document.getElementById('section-map');
                    if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs text-[#005BAC] font-bold hover:underline flex items-center gap-0.5"
                >
                  <span>Xem tất cả</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                {SAMPLE_SAFE_POINTS.map((sp) => {
                  let badgeBg = 'bg-purple-100 text-purple-700';
                  let iconSymbol = <School className="w-4 h-4 text-purple-600" />;
                  if (sp.type === 'culture') {
                    badgeBg = 'bg-blue-100 text-blue-700';
                    iconSymbol = <Building className="w-4 h-4 text-blue-600" />;
                  } else if (sp.type === 'medical') {
                    badgeBg = 'bg-red-100 text-red-700';
                    iconSymbol = <span className="text-red-600 font-bold text-xs">➕</span>;
                  } else if (sp.type === 'government') {
                    badgeBg = 'bg-emerald-100 text-emerald-700';
                    iconSymbol = <Landmark className="w-4 h-4 text-emerald-600" />;
                  }

                  return (
                    <div
                      key={sp.id}
                      onClick={() => setSelectedSafePoint(sp)}
                      className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                          {iconSymbol}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{sp.name}</h4>
                          <div className="text-[11px] text-slate-600 flex items-center gap-2 mt-0.5">
                            <span className="font-semibold text-slate-700">{sp.distance}</span>
                            <span>•</span>
                            <span>{sp.capacity}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (mapInstanceRef.current) {
                            mapInstanceRef.current.flyTo([sp.lat, sp.lng], 14, { duration: 1 });
                            const mapElem = document.getElementById('section-map');
                            if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="w-8 h-8 rounded-lg bg-sky-50 hover:bg-[#005BAC] text-[#005BAC] hover:text-white flex items-center justify-center transition shrink-0"
                        title="Chỉ đường tới điểm này"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* COLUMN 3: TÔI PHẢI LÀM GÌ? (DISASTER RESPONSE GUIDELINES) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                <h3 className="font-extrabold text-xs text-slate-600 uppercase tracking-wider">
                  TÔI PHẢI LÀM GÌ?
                </h3>
                <button
                  onClick={() => setActiveTab('GUIDE')}
                  className="text-xs text-[#005BAC] font-bold hover:underline flex items-center gap-0.5"
                >
                  <span>Xem tất cả</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                {DISASTER_ACTION_GUIDES.map((g) => {
                  const Icon = g.icon;
                  return (
                    <div
                      key={g.id}
                      onClick={() => setSelectedGuide(g)}
                      className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition flex items-center justify-between gap-3 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          style={{ backgroundColor: `${g.color}15`, color: g.color }}
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition"
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#005BAC] transition">
                            {g.title}
                          </h4>
                          <p className="text-[11px] text-slate-600 mt-0.5">{g.subtitle}</p>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#005BAC] group-hover:translate-x-1 transition shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            ROW 5: CẦN HỖ TRỢ KHẨN CẤP? (EMERGENCY HELPLINE BANNER)
            ======================================================== */}
        <section
          id="section-hotlines"
          className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4"
        >
          {/* Left: Call to action with big blue round icon */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#005BAC] flex items-center justify-center text-white shrink-0 shadow-md">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-slate-900 tracking-tight">
                CẦN HỖ TRỢ KHẨN CẤP?
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Liên hệ ngay các số điện thoại dưới đây
              </p>
            </div>
          </div>

          {/* Right: 4 Direct Hotline Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
            {/* 1. Tổng đài khẩn cấp: 112 */}
            <a
              href="tel:112"
              className="bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl p-2.5 flex items-center gap-2.5 transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="text-[10px] text-slate-600 font-medium">Tổng đài khẩn cấp</div>
                <div className="font-black text-sm text-[#005BAC] group-hover:scale-105 transition">
                  112
                </div>
              </div>
            </a>

            {/* 2. PCTT Tỉnh Phú Thọ: 0210 3868 999 */}
            <a
              href="tel:02103868999"
              className="bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl p-2.5 flex items-center gap-2.5 transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700 shrink-0">
                <Landmark className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="text-[10px] text-slate-600 font-medium">PCTT Tỉnh Phú Thọ</div>
                <div className="font-black text-xs sm:text-sm text-[#005BAC] group-hover:scale-105 transition">
                  0210 3868 999
                </div>
              </div>
            </a>

            {/* 3. Cứu hộ cứu nạn: 116 114 */}
            <a
              href="tel:114"
              className="bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl p-2.5 flex items-center gap-2.5 transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700 shrink-0">
                <LifeBuoy className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="text-[10px] text-slate-600 font-medium">Cứu hộ cứu nạn</div>
                <div className="font-black text-sm text-[#005BAC] group-hover:scale-105 transition">
                  116 114
                </div>
              </div>
            </a>

            {/* 4. Y tế khẩn cấp: 115 */}
            <a
              href="tel:115"
              className="bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl p-2.5 flex items-center gap-2.5 transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <span className="font-bold text-xs">➕</span>
              </div>
              <div className="leading-tight">
                <div className="text-[10px] text-slate-600 font-medium">Y tế khẩn cấp</div>
                <div className="font-black text-sm text-red-600 group-hover:scale-105 transition">
                  115
                </div>
              </div>
            </a>
          </div>
        </section>
      </main>

      {/* ========================================================
          FOOTER: INSTITUTIONAL DEEP NAVY (EXACT MATCH TO MOCKUP)
          ======================================================== */}
      <footer className="bg-[#041E42] text-white mt-10 border-t border-sky-950">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* COL 1: LOGO & ADDRESS */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <HvuBrandEmblem size="md" variant="dark" />
                <div>
                  <h4 className="font-black text-base tracking-wide text-white">HAEWS-HVU</h4>
                  <p className="text-xs text-sky-200">Hệ thống Cảnh báo sớm thiên tai</p>
                  <p className="text-xs text-sky-300 font-medium">Trường Đại học Hùng Vương</p>
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed pt-2">
                <p>Địa chỉ: Km 9, Quốc lộ 2, xã Vân Phú, TP. Việt Trì, Tỉnh Phú Thọ</p>
                <p className="mt-1">Điện thoại: (0210) 3821 970 | Email: haews@hvu.edu.vn</p>
              </div>
            </div>

            {/* COL 2: VỀ CHÚNG TÔI */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-sky-300">
                VỀ CHÚNG TÔI
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li><a href="#" className="hover:text-white transition">Giới thiệu</a></li>
                <li><a href="#" className="hover:text-white transition">Mục tiêu</a></li>
                <li><a href="#" className="hover:text-white transition">Đối tác</a></li>
                <li><a href="#" className="hover:text-white transition">Liên hệ</a></li>
              </ul>
            </div>

            {/* COL 3: HƯỚNG DẪN */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-sky-300">
                HƯỚNG DẪN
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li><a href="#" className="hover:text-white transition">Kiến thức thiên tai</a></li>
                <li><a href="#" className="hover:text-white transition">Hướng dẫn ứng phó</a></li>
                <li><a href="#" className="hover:text-white transition">Câu hỏi thường gặp</a></li>
                <li><a href="#" className="hover:text-white transition">Tài liệu</a></li>
              </ul>
            </div>

            {/* COL 4: KẾT NỐI */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-sky-300">
                KẾT NỐI
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li><a href="#" className="hover:text-white transition">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition">Zalo Official</a></li>
                <li><a href="#" className="hover:text-white transition">YouTube</a></li>
                <li><a href="#" className="hover:text-white transition">Email</a></li>
              </ul>
            </div>

            {/* COL 5: TẢI ỨNG DỤNG */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-sky-300">
                TẢI ỨNG DỤNG
              </h4>
              <div className="flex items-center gap-3">
                <div className="space-y-2">
                  {/* App Store button */}
                  <a
                    href="#"
                    className="bg-black/60 hover:bg-black/80 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2 text-left transition"
                  >
                    <Smartphone className="w-4 h-4 text-white" />
                    <div>
                      <div className="text-[9px] text-slate-400 leading-none">Tải trên</div>
                      <div className="text-xs font-bold text-white">App Store</div>
                    </div>
                  </a>

                  {/* Google Play button */}
                  <a
                    href="#"
                    className="bg-black/60 hover:bg-black/80 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2 text-left transition"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-[9px] text-slate-400 leading-none">Tải trên</div>
                      <div className="text-xs font-bold text-white">Google Play</div>
                    </div>
                  </a>
                </div>

                {/* QR Code */}
                <div className="bg-white p-1.5 rounded-lg shadow shrink-0">
                  <div className="w-16 h-16 bg-slate-900 rounded flex items-center justify-center text-white">
                    <QrCode className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM COPYRIGHT */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              © 2026 Trường Đại học Hùng Vương (HVU) - Hệ thống Cảnh báo sớm thiên tai. Mọi quyền được bảo lưu.
            </div>
            <div className="font-mono text-[11px] text-sky-300">
              Phiên bản: 2.0.0
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================
          MODAL 1: ĐĂNG KÝ NHẬN CẢNH BÁO THIÊN TAI (SMS/ZALO/APP)
          ======================================================== */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 text-slate-800 relative">
            <button
              onClick={() => setShowSubscribeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#005BAC]/10 flex items-center justify-center text-[#005BAC]">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#003B73]">
                  Đăng Ký Nhận Cảnh Báo Thiên Tai
                </h3>
                <p className="text-xs text-slate-500">
                  Miễn phí 100% qua Zalo OA, SMS & App HAEWS
                </p>
              </div>
            </div>

            {subscribeSuccess ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h4 className="font-black text-lg text-emerald-700">Đăng Ký Thành Công!</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Hệ thống HAEWS-HVU đã ghi nhận số điện thoại của bạn. Bạn sẽ nhận được thông báo ngay khi có nguy cơ mưa lũ, sạt lở.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và tên người nhận:
                  </label>
                  <input
                    type="text"
                    required
                    value={subscribeName}
                    onChange={(e) => setSubscribeName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#005BAC] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số điện thoại nhận tin (Zalo / SMS):
                  </label>
                  <input
                    type="tel"
                    required
                    value={subscribePhone}
                    onChange={(e) => setSubscribePhone(e.target.value)}
                    placeholder="09xx xxx xxx"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#005BAC] focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kênh nhận thông báo ưu tiên:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSubscribeChannel('ZALO')}
                      className={`p-2 rounded-xl text-xs font-bold border transition ${
                        subscribeChannel === 'ZALO'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      💬 Zalo OA
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubscribeChannel('SMS')}
                      className={`p-2 rounded-xl text-xs font-bold border transition ${
                        subscribeChannel === 'SMS'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      📩 Tin nhắn SMS
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubscribeChannel('APP')}
                      className={`p-2 rounded-xl text-xs font-bold border transition ${
                        subscribeChannel === 'APP'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      📱 Ứng dụng App
                    </button>
                  </div>
                </div>

                <div className="bg-sky-50 border border-sky-200/80 rounded-xl p-3 text-[11px] text-sky-800 flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#005BAC] shrink-0 mt-0.5" />
                  <span>
                    Khu vực đăng ký theo dõi: <b>{selectedCommuneName}, Tỉnh Phú Thọ</b>.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#005BAC] hover:bg-[#004b8d] text-white font-bold py-2.5 rounded-xl text-sm shadow transition"
                >
                  Xác Nhận Đăng Ký
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: THAY ĐỔI VỊ TRÍ (CHỌN TỈNH / XÃ PHƯỜNG)
          ======================================================== */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 text-slate-800 relative">
            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#005BAC]/10 flex items-center justify-center text-[#005BAC]">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#003B73]">
                  Chọn Địa Điểm Của Bạn
                </h3>
                <p className="text-xs text-slate-500">
                  Hệ thống sẽ tùy biến thời tiết và chỉ số an toàn theo vị trí của bạn
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. Chọn Tỉnh / Thành phố (63 Tỉnh Thành • 10.598 Xã Phường):
                </label>
                <select
                  value={selectedProvinceId}
                  onChange={(e) => setSelectedProvinceId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#005BAC]"
                >
                  {VIETNAM_PROVINCES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.total_communes || 50} xã/phường)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    2. Chọn Xã / Phường / Thị trấn:
                  </label>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {VIETNAM_COMMUNES_DIRECTORY.filter(c => c.province_id === selectedProvinceId).length} xã/phường nạp sẵn
                  </span>
                </div>

                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm tên xã, phường, thị trấn..."
                    value={provinceSearchQuery}
                    onChange={(e) => setProvinceSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005BAC]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {(() => {
                    const filtered = VIETNAM_COMMUNES_DIRECTORY.filter((c) => {
                      const matchProv = c.province_id === selectedProvinceId;
                      const matchQuery = !provinceSearchQuery.trim() || 
                        c.name.toLowerCase().includes(provinceSearchQuery.toLowerCase()) ||
                        c.district_name.toLowerCase().includes(provinceSearchQuery.toLowerCase());
                      return matchProv && matchQuery;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="col-span-2 py-4 text-center text-xs text-slate-500">
                          Không tìm thấy xã/phường phù hợp. Hãy thử tìm từ khóa khác.
                        </div>
                      );
                    }

                    return filtered.map((commune) => {
                      const displayTitle = `${commune.name}, ${commune.district_name}`;
                      const isSelected = selectedCommuneName.includes(commune.name);

                      return (
                        <button
                          key={commune.id}
                          onClick={() => {
                            setSelectedCommuneName(displayTitle);
                            setShowLocationModal(false);
                          }}
                          className={`p-2 rounded-xl text-xs font-bold text-left border transition truncate ${
                            isSelected
                              ? 'bg-[#005BAC] text-white border-[#005BAC]'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-sky-50 hover:text-[#005BAC]'
                          }`}
                        >
                          📍 {displayTitle}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: CHI TIẾT HƯỚNG DẪN ỨNG PHÓ THIÊN TAI (TÔI PHẢI LÀM GÌ?)
          ======================================================== */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 text-slate-800 relative">
            <button
              onClick={() => setSelectedGuide(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                style={{ backgroundColor: `${selectedGuide.color}15`, color: selectedGuide.color }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              >
                {React.createElement(selectedGuide.icon, { className: 'w-6 h-6' })}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {selectedGuide.title}
                </h3>
                <p className="text-xs text-slate-500">{selectedGuide.subtitle}</p>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {selectedGuide.steps.map((step: string, idx: number) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs flex items-start gap-2.5"
                >
                  <span
                    style={{ backgroundColor: selectedGuide.color }}
                    className="w-5 h-5 rounded-full text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5"
                  >
                    {idx + 1}
                  </span>
                  <span className="text-slate-800 leading-relaxed font-medium">{step}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedGuide(null)}
              className="w-full mt-4 bg-[#005BAC] hover:bg-[#004b8d] text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              Đã Hiểu Hướng Dẫn
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: CHI TIẾT BẢN TIN CẢNH BÁO
          ======================================================== */}
      {selectedNewsArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 text-slate-800 relative">
            <button
              onClick={() => setSelectedNewsArticle(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-mono text-slate-500">{selectedNewsArticle.time}</span>
              <span
                className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                  selectedNewsArticle.level === 'Khẩn cấp'
                    ? 'bg-red-100 text-red-700'
                    : selectedNewsArticle.level === 'Nguy hiểm'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {selectedNewsArticle.level}
              </span>
            </div>

            <h3 className="text-base font-extrabold text-slate-900 mb-3 leading-snug">
              {selectedNewsArticle.title}
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 leading-relaxed mb-4">
              <p className="font-medium">{selectedNewsArticle.desc}</p>
              <p className="mt-2 text-slate-600">
                Đài Khí tượng Thủy văn tỉnh Phú Thọ và Trung tâm AI HAEWS-HVU cảnh báo nhân dân các xã vùng ven sông, sườn đồi dốc nâng cao cảnh giác, theo dõi sát mực nước và tuân thủ tuyệt đối phương án sơ tán của lực lượng PCTT địa phương.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedNewsArticle(null);
                  onEnterWarRoom();
                }}
                className="flex-1 bg-[#005BAC] hover:bg-[#004b8d] text-white font-bold py-2 rounded-xl text-xs transition text-center"
              >
                Xem Vùng Cảnh Báo Trên Bản Đồ
              </button>
              <button
                onClick={() => setSelectedNewsArticle(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 5: ĐỘNG ĐẤT & SÓNG THẦN (EARTHQUAKE & TSUNAMI SUBSYSTEM)
          ======================================================== */}
      <EarthquakeTsunamiModal
        isOpen={showEarthquakeModal}
        onClose={() => setShowEarthquakeModal(false)}
        onSelectOnMap={(lat, lng) => {
          if (mapInstanceRef.current && typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
            mapInstanceRef.current.setView([lat, lng], 9);
            const mapElem = document.getElementById('section-map');
            if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* ========================================================
          MODAL 6: DANH SÁCH CẢNH BÁO KHẨN CẤP THỜI GIAN THỰC
          ======================================================== */}
      {showActiveAlertsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 text-slate-800 relative max-h-[88vh] flex flex-col">
            <button
              onClick={() => setShowActiveAlertsModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shadow-inner shrink-0">
                <AlertOctagon className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900 leading-tight">
                  Danh Sách Cảnh Báo Thiên Tai Thời Gian Thực
                </h3>
                <p className="text-xs text-slate-500">
                  Địa bàn: <b>{currentProvince.name}</b> • Cập nhật lúc {currentTimeStr}
                </p>
              </div>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-3.5">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold w-full sm:w-auto">
                <button
                  onClick={() => setAlertsFilterLevel('ALL')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    alertsFilterLevel === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tất cả ({warningCounts.emergency + warningCounts.danger + warningCounts.monitor})
                </button>
                <button
                  onClick={() => setAlertsFilterLevel('EMERGENCY')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    alertsFilterLevel === 'EMERGENCY' ? 'bg-red-600 text-white shadow-xs' : 'text-red-700 hover:bg-red-50'
                  }`}
                >
                  Khẩn cấp ({warningCounts.emergency})
                </button>
                <button
                  onClick={() => setAlertsFilterLevel('DANGER')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    alertsFilterLevel === 'DANGER' ? 'bg-orange-500 text-white shadow-xs' : 'text-orange-700 hover:bg-orange-50'
                  }`}
                >
                  Nguy hiểm ({warningCounts.danger})
                </button>
                <button
                  onClick={() => setAlertsFilterLevel('MONITOR')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    alertsFilterLevel === 'MONITOR' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  Theo dõi ({warningCounts.monitor})
                </button>
              </div>

              <div className="relative w-full sm:w-48">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm xã, huyện..."
                  value={alertsSearchQuery}
                  onChange={(e) => setAlertsSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005BAC]"
                />
              </div>
            </div>

            {/* Warning List Scroll */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[50vh]">
              {[
                {
                  id: 'w1',
                  commune: 'Xã Thu Cúc, Huyện Tân Sơn',
                  riskType: 'Lũ quét & Sạt lở đồi dốc',
                  level: 'Khẩn cấp',
                  levelNum: 5,
                  rain24h: '142 mm',
                  saturation: '94%',
                  population: '4.820 người',
                  advice: 'Khẩn trương sơ tán các hộ dân ven suối và chân taluy dốc sang Trường Tiểu học Thu Cúc 1.',
                  lat: 21.192,
                  lng: 105.012
                },
                {
                  id: 'w2',
                  commune: 'Xã Xuân Đài, Huyện Tân Sơn',
                  riskType: 'Sạt lở đất đá & Ngập cục bộ',
                  level: 'Khẩn cấp',
                  levelNum: 5,
                  rain24h: '128 mm',
                  saturation: '91%',
                  population: '3.650 người',
                  advice: 'Cấm người và phương tiện qua các ngầm tràn đang có lũ xiết.',
                  lat: 21.155,
                  lng: 104.985
                },
                {
                  id: 'w3',
                  commune: 'Xã Đông Cửu, Huyện Thanh Sơn',
                  riskType: 'Sạt lở sườn đồi dốc',
                  level: 'Khẩn cấp',
                  levelNum: 5,
                  rain24h: '115 mm',
                  saturation: '89%',
                  population: '2.910 người',
                  advice: 'Chủ động di dời tài sản và vật nuôi lên cao ráo.',
                  lat: 21.121,
                  lng: 105.215
                },
                {
                  id: 'w4',
                  commune: 'Xã Văn Lương, Huyện Tam Nông',
                  riskType: 'Ngập lụt vùng trũng thấp ven sông',
                  level: 'Nguy hiểm',
                  levelNum: 4,
                  rain24h: '98 mm',
                  saturation: '82%',
                  population: '5.400 người',
                  advice: 'Theo dõi sát báo động lũ sông Bứa, kê cao đồ đạc.',
                  lat: 21.285,
                  lng: 105.289
                },
                {
                  id: 'w5',
                  commune: 'Xã Quân Khê, Huyện Hạ Hòa',
                  riskType: 'Lũ quét sườn núi Con Voi',
                  level: 'Nguy hiểm',
                  levelNum: 4,
                  rain24h: '92 mm',
                  saturation: '80%',
                  population: '3.120 người',
                  advice: 'Lực lượng xung kích túc trực 24/7 tại các điểm xung yếu.',
                  lat: 21.612,
                  lng: 105.025
                },
                {
                  id: 'w6',
                  commune: 'Phường Bạch Hạc, TP. Việt Trì',
                  riskType: 'Theo dõi mực nước ngã ba Sông Lô - Sông Hồng',
                  level: 'Theo dõi',
                  levelNum: 3,
                  rain24h: '65 mm',
                  saturation: '71%',
                  population: '8.900 người',
                  advice: 'Các bến đò ngang tạm ngừng hoạt động khi lưu tốc dòng chảy tăng cao.',
                  lat: 21.305,
                  lng: 105.445
                }
              ]
                .filter((item) => {
                  if (alertsFilterLevel === 'EMERGENCY' && item.levelNum !== 5) return false;
                  if (alertsFilterLevel === 'DANGER' && item.levelNum !== 4) return false;
                  if (alertsFilterLevel === 'MONITOR' && item.levelNum !== 3) return false;
                  if (alertsSearchQuery.trim() && !item.commune.toLowerCase().includes(alertsSearchQuery.toLowerCase())) return false;
                  return true;
                })
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-slate-50 hover:bg-sky-50/70 border border-slate-200/80 rounded-2xl transition space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md font-black text-[10px] uppercase text-white ${
                            item.levelNum === 5 ? 'bg-red-600' : item.levelNum === 4 ? 'bg-orange-500' : 'bg-amber-500'
                          }`}
                        >
                          {item.level}
                        </span>
                        <h4 className="font-extrabold text-xs text-slate-900">{item.commune}</h4>
                      </div>

                      <button
                        onClick={() => {
                          setShowActiveAlertsModal(false);
                          setMapEngineMode('gis');
                          if (mapInstanceRef.current) {
                            mapInstanceRef.current.flyTo([item.lat, item.lng], 13, { duration: 1.2 });
                            const mapElem = document.getElementById('section-map');
                            if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="bg-[#005BAC] hover:bg-[#003B73] text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition shrink-0 flex items-center gap-1 shadow-2xs"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>Xem bản đồ</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-700 font-medium">
                      Nguy cơ: <b>{item.riskType}</b> • {item.advice}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-600 pt-1 border-t border-slate-200/50">
                      <span>🌧️ Mưa 24h: <b>{item.rain24h}</b></span>
                      <span>•</span>
                      <span>💧 Độ ẩm đất: <b>{item.saturation}</b></span>
                      <span>•</span>
                      <span>👥 Dân cư: <b>{item.population}</b></span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 7: MẠNG LƯỚI TRẠM ĐO MƯA & KTTV IOT TỰ ĐỘNG
          ======================================================== */}
      {showStationsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 text-slate-800 relative max-h-[88vh] flex flex-col">
            <button
              onClick={() => setShowStationsModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 shadow-inner shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900 leading-tight">
                  Mạng Lưới Trạm Đo Mưa Tự Động & Thủy Văn (IoT Realtime)
                </h3>
                <p className="text-xs text-slate-500">
                  Hệ thống 12 Trạm Cảm biến IoT kết nối trực tiếp Trung tâm AI HVU • 100% Online
                </p>
              </div>
            </div>

            {/* Station Grid Scroll */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pr-1 max-h-[55vh]">
              {[
                { name: 'Trạm Đo Mưa ĐH Hùng Vương (HVU)', loc: 'TP. Việt Trì', rainNow: '1.2 mm', rain24h: '18.4 mm', status: 'ONLINE', waterLevel: '12.4m', battery: '98%', lat: 21.338, lng: 105.385 },
                { name: 'Trạm Khí tượng Thủy văn Việt Trì', loc: 'Ngã ba Sông Hạc', rainNow: '2.5 mm', rain24h: '28.6 mm', status: 'ONLINE', waterLevel: '14.8m (BĐ 1: 15.0m)', battery: '100%', lat: 21.305, lng: 105.445 },
                { name: 'Trạm Đo Mưa Tân Sơn', loc: 'Xã Thu Cúc, Tân Sơn', rainNow: '14.8 mm', rain24h: '142.5 mm', status: 'ONLINE', waterLevel: 'Mưa rất to', battery: '92%', lat: 21.192, lng: 105.012 },
                { name: 'Trạm Đo Mưa Thanh Sơn', loc: 'Thị trấn Thanh Sơn', rainNow: '8.4 mm', rain24h: '98.2 mm', status: 'ONLINE', waterLevel: 'Sông Bứa dâng', battery: '95%', lat: 21.185, lng: 105.215 },
                { name: 'Trạm Thủy văn Đoan Hùng', loc: 'Sông Lô, Đoan Hùng', rainNow: '3.6 mm', rain24h: '45.0 mm', status: 'ONLINE', waterLevel: '18.2m', battery: '96%', lat: 21.625, lng: 105.185 },
                { name: 'Trạm Đo Mưa Hạ Hòa', loc: 'Hạ Hòa, Phú Thọ', rainNow: '6.2 mm', rain24h: '78.5 mm', status: 'ONLINE', waterLevel: 'Sông Thao', battery: '94%', lat: 21.585, lng: 105.025 },
                { name: 'Trạm Đo Mưa Cẩm Khê', loc: 'Thị trấn Sông Thao', rainNow: '4.1 mm', rain24h: '52.0 mm', status: 'ONLINE', waterLevel: 'Bình thường', battery: '99%', lat: 21.412, lng: 105.155 },
                { name: 'Trạm Đo Mưa Thanh Ba', loc: 'Huyện Thanh Ba', rainNow: '3.0 mm', rain24h: '38.2 mm', status: 'ONLINE', waterLevel: 'Bình thường', battery: '97%', lat: 21.455, lng: 105.225 }
              ].map((st, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2 hover:border-[#005BAC] transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900">{st.name}</h4>
                      <p className="text-[10px] text-slate-500">{st.loc}</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 font-extrabold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>{st.status}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-white p-2 rounded-xl border border-slate-200/60 font-mono">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Mưa hiện tại:</span>
                      <span className="font-black text-sky-700">{st.rainNow}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Tích lũy 24h:</span>
                      <span className="font-black text-blue-700">{st.rain24h}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Mực nước / Tình trạng:</span>
                      <span className="font-bold text-slate-800">{st.waterLevel}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Pin & Sóng:</span>
                      <span className="font-bold text-emerald-700">🔋 {st.battery} • 4G</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowStationsModal(false);
                      setMapEngineMode('gis');
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.flyTo([st.lat, st.lng], 13, { duration: 1 });
                        const mapElem = document.getElementById('section-map');
                        if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full text-center text-xs font-bold text-[#005BAC] hover:underline pt-1"
                  >
                    Xem vị trí trạm trên bản đồ →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 8: DIỄN BIẾN SỰ CỐ & TÁC CHIẾN HIỆN TRƯỜNG
          ======================================================== */}
      {showIncidentsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 text-slate-800 relative max-h-[88vh] flex flex-col">
            <button
              onClick={() => setShowIncidentsModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shadow-inner shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900 leading-tight">
                  Diễn Biến Sự Cố & Tác Chiến Hiện Trường
                </h3>
                <p className="text-xs text-slate-500">
                  Nhật ký trực ban PCTT tỉnh Phú Thọ • Đang xử lý 3 sự cố
                </p>
              </div>
            </div>

            {/* Incidents List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[55vh]">
              {[
                {
                  id: 'inc-1',
                  title: 'Sạt lở taluy dương đường tỉnh ĐT.316 đoạn qua xã Xuân Đài',
                  time: '16:20 - Hôm nay',
                  status: 'Đang xử lý',
                  statusColor: 'bg-amber-100 text-amber-800',
                  desc: 'Khoảng 450m³ đất đá tràn xuống mặt đường gây ách tắc giao thông cục bộ. Hạt Giao thông Tân Sơn đã điều động 2 máy xúc và 4 xe tải giải phóng mặt đường.',
                  action: 'Đã cắm biển cảnh báo và phân luồng xe máy qua đường tránh.'
                },
                {
                  id: 'inc-2',
                  title: 'Ngập úng ngầm tràn xóm Thung, xã Thu Cúc (mức ngập 0.8m)',
                  time: '15:40 - Hôm nay',
                  status: 'Đang cô lập',
                  statusColor: 'bg-red-100 text-red-800',
                  desc: 'Nước lũ từ thượng nguồn dâng nhanh làm ngập sâu ngầm tràn chia cắt 45 hộ dân xóm Thung.',
                  action: 'Lực lượng Công an xã và Dân quân tự vệ trực chốt 2 đầu ngầm, kiên quyết không để người dân tự ý lội qua.'
                },
                {
                  id: 'inc-3',
                  title: 'Cây gãy đổ đè đường dây hạ thế tại thị trấn Thanh Sơn',
                  time: '14:10 - Hôm nay',
                  status: 'Đã khắc phục xong',
                  statusColor: 'bg-emerald-100 text-emerald-800',
                  desc: 'Gió giật mạnh làm đổ 1 cây xà cừ đè vào đường dây điện hạ thế gây mất điện khu 3.',
                  action: 'Điện lực Thanh Sơn đã cắt tỉa cây và khôi phục cấp điện lúc 15:30.'
                }
              ].map((inc) => (
                <div
                  key={inc.id}
                  className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-extrabold text-xs text-slate-900">{inc.title}</h4>
                    <span className={`px-2 py-0.5 rounded font-black text-[10px] whitespace-nowrap ${inc.statusColor}`}>
                      {inc.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{inc.desc}</p>
                  <div className="bg-white p-2 rounded-xl border border-slate-200/60 text-[11px] text-slate-800 font-medium">
                    🛡️ Biện pháp xử lý: {inc.action}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Ghi nhận lúc: {inc.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTON: Quick Citizen Disaster Report */}
      <button
        onClick={() => setShowCitizenReportModal(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 hover:scale-105 transition-all border-2 border-white/80 cursor-pointer"
        title="Gửi phản ánh khẩn cấp về sạt lở, lũ lụt, ngập úng tại vị trí của bạn"
      >
        <div className="p-1 rounded-full bg-white/20">
          <ShieldAlert className="w-4 h-4 text-white animate-pulse" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider">Báo Cáo Sự Cố 🚨</span>
      </button>

      {/* Citizen Disaster Report Modal (Dexuat 07-CITIZEN) */}
      <CitizenReportModal
        isOpen={showCitizenReportModal}
        onClose={() => setShowCitizenReportModal(false)}
        onReportSubmitted={(newRep) => {
          setCitizenReportsList([newRep, ...citizenReportsList]);
        }}
        initialProvinceName={VIETNAM_PROVINCES.find((p) => p.id === selectedProvinceId)?.name || 'Lào Cai'}
      />
    </div>
  );
};
