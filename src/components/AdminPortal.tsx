import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Server,
  Radio,
  MapPin,
  FileText,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  Download,
  Flame,
  Layers,
  Battery,
  Phone,
  Mail,
  Building,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Settings,
  Sliders,
  LayoutGrid,
  Save,
  RotateCcw,
  Sparkles,
  Globe,
  Compass,
  Eye,
  ListFilter
} from 'lucide-react';
import {
  RainfallStation,
  SpatialZone,
  EmergencyDispatch,
  AdminUser,
  AdminAuditLog,
  RiskLevel,
  ProvinceAlertControl
} from '../types';
import { VIETNAM_PROVINCES, NATIONAL_ADMIN_TOTALS } from '../data/provinces';
import { VIETNAM_COMMUNES_DIRECTORY, NATIONAL_COMMUNES_STATS, getOfficialProvinceCommunesCount } from '../data/communes_directory';
import { safeFetchJson } from '../utils/apiClient';
import {
  getSavedNavigationMenus,
  saveNavigationMenus,
  resetNavigationMenusToDefault,
  NavigationMenuItem
} from '../data/navigationMenu';

interface AdminPortalProps {
  onBackToMap: () => void;
  onOpenThresholds: () => void;
  onOpenDataQuality: () => void;
  defaultProvince?: string;
  onUpdateDefaultProvince?: (provId: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onBackToMap,
  onOpenThresholds,
  onOpenDataQuality,
  defaultProvince: initialDefaultProvince = 'phu_tho',
  onUpdateDefaultProvince
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stations' | 'provinces' | 'communes' | 'zones' | 'dispatches' | 'duty' | 'logs' | 'settings' | 'menus'>('overview');
  
  // Navigation Menus Management State
  const [menusList, setMenusList] = useState<NavigationMenuItem[]>(() => getSavedNavigationMenus());
  const [editingMenuItem, setEditingMenuItem] = useState<{
    isOpen: boolean;
    isSubmenu: boolean;
    parentId?: string;
    item: Partial<NavigationMenuItem>;
  }>({
    isOpen: false,
    isSubmenu: false,
    item: { title: '', targetTab: 'HOME', enabled: true, order: 1 }
  });

  // App-Wide System Settings State
  const [defaultProvince, setDefaultProvince] = useState<string>(() => {
    try {
      return localStorage.getItem('haews_default_province') || initialDefaultProvince || 'phu_tho';
    } catch {
      return 'phu_tho';
    }
  });
  const [communeDisplayMode, setCommuneDisplayMode] = useState<'ACCORDION_ABC' | 'FLAT_CARDS'>(() => {
    try {
      return (localStorage.getItem('haews_commune_display_mode') as any) || 'ACCORDION_ABC';
    } catch {
      return 'ACCORDION_ABC';
    }
  });
  const [autoExpandCritical, setAutoExpandCritical] = useState<boolean>(true);
  const [defaultInitialView, setDefaultInitialView] = useState<'PORTAL' | 'MAP'>('PORTAL');
  const [defaultWeatherOverlay, setDefaultWeatherOverlay] = useState<'rain' | 'wind' | 'satellite' | 'lightning'>('rain');
  const [telemetryRefreshInterval, setTelemetryRefreshInterval] = useState<number>(60);
  const [provinceSearchQuery, setProvinceSearchQuery] = useState<string>('');
  const [provinceRegionFilter, setProvinceRegionFilter] = useState<string>('ALL');

  // Communes Tab States (10,598 communes database)
  const [communeTabSearchQuery, setCommuneTabSearchQuery] = useState<string>('');
  const [communeTabProvinceFilter, setCommuneTabProvinceFilter] = useState<string>('ALL');
  const [communeTabTypeFilter, setCommuneTabTypeFilter] = useState<string>('ALL');
  const [communeTabRiskFilter, setCommuneTabRiskFilter] = useState<string>('ALL');
  const [communeTabPage, setCommuneTabPage] = useState<number>(1);
  const [communeItems, setCommuneItems] = useState<any[]>([]);
  const [communeTotal, setCommuneTotal] = useState<number>(10598);
  const [communeLoading, setCommuneLoading] = useState<boolean>(false);

  // Data States
  const [stations, setStations] = useState<RainfallStation[]>([]);
  const [provinces, setProvinces] = useState<ProvinceAlertControl[]>([]);
  const [zones, setZones] = useState<SpatialZone[]>([]);
  const [dispatches, setDispatches] = useState<EmergencyDispatch[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState<string>('all');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');
  const [isSyncingOpenData, setIsSyncingOpenData] = useState<boolean>(false);

  // Station Modal State
  const [editingStation, setEditingStation] = useState<Partial<RainfallStation> | null>(null);
  const [showStationModal, setShowStationModal] = useState<boolean>(false);

  // Dispatch Create Modal State
  const [showDispatchModal, setShowDispatchModal] = useState<boolean>(false);
  const [newDispatch, setNewDispatch] = useState<Partial<EmergencyDispatch>>({
    dispatch_number: '11/CĐ-PCTT',
    title: 'CÔNG ĐIỆN KHẨN: Chủ động sơ tán dân phòng chống lũ quét cục bộ',
    issuer: 'Ban Chỉ huy PCTT & TKCN Tỉnh Lào Cai',
    signer: 'Nguyễn Văn Anh - Chỉ huy trưởng',
    urgency_level: 'KHAN',
    risk_level: 4,
    affected_provinces: ['Tỉnh Lào Cai'],
    affected_districts: ['Huyện Bảo Yên'],
    affected_zones: ['Làng Nủ - Xã Phúc Khánh'],
    content: 'Yêu cầu UBND các huyện, thị xã khẩn trương rà soát các điểm dân cư ven sông suối, sườn đồi dốc có nguy cơ cao xảy ra lũ quét, sạt lở đất; kiên quyết tổ chức sơ tán người dân đến nơi an toàn.',
    evacuation_instructions: 'Sơ tán khẩn cấp người già và trẻ nhỏ về nhà văn hóa thôn trước 17h00.',
    sms_broadcast_text: '[PCTT KHẨN CẤP] Cảnh báo mưa lớn nguy cơ lũ quét cao. Đề nghị người dân theo dõi sát thông báo sơ tán của chính quyền xã.',
    broadcast_channels: ['SMS_BROADCAST', 'RADIO_VNA', 'ZALO_OA']
  });

  // Zone Edit Modal State
  const [editingZone, setEditingZone] = useState<Partial<SpatialZone> | null>(null);
  const [showZoneModal, setShowZoneModal] = useState<boolean>(false);

  // Success Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync Open Meteorological Data from Open-Meteo & Public Radar Network
  const handleSyncOpenData = async () => {
    setIsSyncingOpenData(true);
    try {
      const res = await fetch('/api/v1/stations/sync-live-public', { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        showToast(result.message);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
      showToast('Đã kích hoạt đồng bộ dữ liệu quan trắc khí tượng mở.');
    } finally {
      setIsSyncingOpenData(false);
    }
  };

  // Fetch all admin data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [staJson, provJson, zoneJson, dispJson, userJson, logJson] = await Promise.all([
        safeFetchJson<{ data?: RainfallStation[] }>('/api/v1/admin/stations'),
        safeFetchJson<{ data?: ProvinceAlertControl[] }>('/api/v1/admin/provinces'),
        safeFetchJson<{ data?: SpatialZone[] }>('/api/v1/admin/zones'),
        safeFetchJson<{ data?: EmergencyDispatch[] }>('/api/v1/admin/dispatches'),
        safeFetchJson<{ data?: AdminUser[] }>('/api/v1/admin/users'),
        safeFetchJson<{ data?: AdminAuditLog[] }>('/api/v1/admin/audit-logs')
      ]);

      if (staJson?.data) setStations(staJson.data);
      if (provJson?.data) setProvinces(provJson.data);
      if (zoneJson?.data) setZones(zoneJson.data);
      if (dispJson?.data) setDispatches(dispJson.data);
      if (userJson?.data) setUsers(userJson.data);
      if (logJson?.data) setAuditLogs(logJson.data);
    } catch (err) {
      console.warn('Notice fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch Communes List from 10,598 database
  const fetchCommunesList = async () => {
    setCommuneLoading(true);
    try {
      const params = new URLSearchParams();
      if (communeTabSearchQuery.trim()) params.set('q', communeTabSearchQuery.trim());
      if (communeTabProvinceFilter !== 'ALL') params.set('province_id', communeTabProvinceFilter);
      if (communeTabTypeFilter !== 'ALL') params.set('type', communeTabTypeFilter);
      if (communeTabRiskFilter === 'HOTSPOT') params.set('is_hotspot', 'true');
      if (communeTabRiskFilter === 'NORMAL') params.set('is_hotspot', 'false');
      params.set('page', String(communeTabPage));
      params.set('limit', '25');

      const res = await safeFetchJson<{ success: boolean; total: number; items: any[] }>(`/api/v1/communes/search?${params.toString()}`);
      if (res?.success) {
        setCommuneItems(res.items || []);
        setCommuneTotal(res.total || 0);
      }
    } catch (err) {
      console.warn('Notice fetching communes:', err);
    } finally {
      setCommuneLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'communes') {
      fetchCommunesList();
    }
  }, [activeTab, communeTabSearchQuery, communeTabProvinceFilter, communeTabTypeFilter, communeTabRiskFilter, communeTabPage]);

  // Station Actions
  const handleSaveStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStation?.station_code || !editingStation?.station_name) return;

    try {
      const result = await safeFetchJson<{ success?: boolean; message?: string }>('/api/v1/admin/stations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStation)
      });
      if (result?.success) {
        showToast(result.message || 'Đã lưu trạm quan trắc thành công!');
        setShowStationModal(false);
        setEditingStation(null);
        fetchAllData();
      }
    } catch (err) {
      console.warn('Notice saving station:', err);
    }
  };

  const handleDeleteStation = async (id: string, name: string) => {
    if (!window.confirm(`Xác nhận xóa trạm quan trắc "${name}" khỏi hệ thống?`)) return;
    try {
      const result = await safeFetchJson<{ success?: boolean }>(`/api/v1/admin/stations/${id}`, { method: 'DELETE' });
      if (result?.success) {
        showToast('Đã xóa trạm thành công');
        fetchAllData();
      }
    } catch (err) {
      console.warn('Notice deleting station:', err);
    }
  };

  // Dispatch Actions
  const handleSaveDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await safeFetchJson<{ success?: boolean }>('/api/v1/admin/dispatches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDispatch)
      });
      if (result?.success) {
        showToast('Đã tạo công điện khẩn cấp thành công!');
        setShowDispatchModal(false);
        fetchAllData();
      }
    } catch (err) {
      console.warn('Notice saving dispatch:', err);
    }
  };

  const handleBroadcastDispatch = async (id: string) => {
    if (!window.confirm('XÁC NHẬN PHÁT LỆNH TRUYỀN TIN KHẨN CẤP ĐA KÊNH (SMS/Loa/Zalo) ĐẾN TOÀN BỘ NGƯỜI DÂN & CƠ QUAN ĐỊA PHƯƠNG?')) return;
    try {
      const result = await safeFetchJson<{ success?: boolean }>(`/api/v1/admin/dispatches/${id}/broadcast`, { method: 'POST' });
      if (result?.success) {
        showToast('ĐÃ PHÁT LỆNH TRUYỀN TIN KHẨN CẤP THÀNH CÔNG!');
        fetchAllData();
      }
    } catch (err) {
      console.warn('Notice broadcasting dispatch:', err);
    }
  };

  // Zone Actions
  const handleSaveZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingZone?.id) return;
    try {
      const result = await safeFetchJson<{ success?: boolean }>(`/api/v1/admin/zones/${editingZone.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingZone)
      });
      if (result?.success) {
        showToast('Đã cập nhật thông số không gian địa bàn thành công!');
        setShowZoneModal(false);
        setEditingZone(null);
        fetchAllData();
      }
    } catch (err) {
      console.warn('Notice saving zone:', err);
    }
  };

  // Province Warning Toggle Action
  const handleToggleProvinceWarning = async (provinceName: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      const result = await safeFetchJson<{ success?: boolean; message?: string }>('/api/v1/admin/provinces/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          province_name: provinceName,
          enabled: newStatus,
          note: `Thay đổi trực tiếp bởi Quản trị viên lúc ${new Date().toLocaleTimeString('vi-VN')}`,
          operator_name: 'Quản trị viên Hệ thống HAEWS'
        })
      });
      if (result?.success) {
        showToast(result.message || 'Đã cập nhật trạng thái');
        fetchAllData();
      }
    } catch (err) {
      console.warn('Notice toggling province warning:', err);
    }
  };

  // --- NAVIGATION MENU MANAGEMENT ACTIONS ---
  const handleToggleMenu = (menuId: string, parentId?: string) => {
    const updated = menusList.map((menu) => {
      if (parentId && menu.id === parentId) {
        return {
          ...menu,
          children: menu.children?.map((sub) =>
            sub.id === menuId ? { ...sub, enabled: !sub.enabled } : sub
          ),
        };
      }
      if (menu.id === menuId) {
        return { ...menu, enabled: !menu.enabled };
      }
      return menu;
    });
    setMenusList(updated);
    saveNavigationMenus(updated);
    showToast('Đã cập nhật trạng thái hiển thị menu!');
  };

  const handleDeleteMenu = (menuId: string, parentId?: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mục menu này không?')) return;
    let updated: NavigationMenuItem[];
    if (parentId) {
      updated = menusList.map((menu) =>
        menu.id === parentId
          ? { ...menu, children: menu.children?.filter((sub) => sub.id !== menuId) }
          : menu
      );
    } else {
      updated = menusList.filter((m) => m.id !== menuId);
    }
    setMenusList(updated);
    saveNavigationMenus(updated);
    showToast('Đã xóa mục menu thành công!');
  };

  const handleMoveMenu = (menuId: string, direction: 'UP' | 'DOWN', parentId?: string) => {
    if (parentId) {
      const parent = menusList.find((m) => m.id === parentId);
      if (!parent || !parent.children) return;
      const subs = [...parent.children];
      const idx = subs.findIndex((s) => s.id === menuId);
      if (idx === -1) return;
      const targetIdx = direction === 'UP' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= subs.length) return;
      const temp = subs[idx];
      subs[idx] = subs[targetIdx];
      subs[targetIdx] = temp;
      subs.forEach((s, i) => (s.order = i + 1));
      const updated = menusList.map((m) => (m.id === parentId ? { ...m, children: subs } : m));
      setMenusList(updated);
      saveNavigationMenus(updated);
    } else {
      const menus = [...menusList];
      const idx = menus.findIndex((m) => m.id === menuId);
      if (idx === -1) return;
      const targetIdx = direction === 'UP' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= menus.length) return;
      const temp = menus[idx];
      menus[idx] = menus[targetIdx];
      menus[targetIdx] = temp;
      menus.forEach((m, i) => (m.order = i + 1));
      setMenusList(menus);
      saveNavigationMenus(menus);
    }
  };

  const handleSaveMenuItemModal = (e: React.FormEvent) => {
    e.preventDefault();
    const { item, isSubmenu, parentId } = editingMenuItem;
    if (!item.title?.trim()) return;

    if (item.id) {
      let updated: NavigationMenuItem[];
      if (isSubmenu && parentId) {
        updated = menusList.map((m) => {
          if (m.id === parentId) {
            return {
              ...m,
              children: m.children?.map((sub) =>
                sub.id === item.id ? { ...sub, ...item } as NavigationMenuItem : sub
              ),
            };
          }
          return m;
        });
      } else {
        updated = menusList.map((m) =>
          m.id === item.id ? { ...m, ...item } as NavigationMenuItem : m
        );
      }
      setMenusList(updated);
      saveNavigationMenus(updated);
      showToast('Đã lưu thay đổi mục menu!');
    } else {
      const newId = `nav-${Date.now()}`;
      const newItem: NavigationMenuItem = {
        id: newId,
        title: item.title,
        targetTab: item.targetTab || 'HOME',
        url: item.url || '',
        badge: item.badge || '',
        badgeColor: item.badgeColor || 'blue',
        enabled: item.enabled ?? true,
        order: item.order || 99,
        children: isSubmenu ? undefined : [],
      };

      let updated: NavigationMenuItem[];
      if (isSubmenu && parentId) {
        updated = menusList.map((m) => {
          if (m.id === parentId) {
            const currentSubs = m.children || [];
            return {
              ...m,
              children: [...currentSubs, { ...newItem, order: currentSubs.length + 1 }],
            };
          }
          return m;
        });
      } else {
        updated = [...menusList, { ...newItem, order: menusList.length + 1 }];
      }
      setMenusList(updated);
      saveNavigationMenus(updated);
      showToast('Đã thêm mục menu mới thành công!');
    }

    setEditingMenuItem({ isOpen: false, isSubmenu: false, item: {} });
  };

  const handleResetNavigationMenus = () => {
    if (!confirm('Khôi phục danh sách menu về mặc định ban đầu?')) return;
    const defaults = resetNavigationMenusToDefault();
    setMenusList(defaults);
    showToast('Đã khôi phục danh mục menu về mặc định!');
  };

  // Duty Status Change
  const handleToggleDuty = async (user: AdminUser) => {
    const newStatus = user.shift_status === 'ON_DUTY' ? 'STANDBY' : 'ON_DUTY';
    try {
      const result = await safeFetchJson<{ success?: boolean }>('/api/v1/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, shift_status: newStatus })
      });
      if (result?.success) {
        showToast(`Đã chuyển trạng thái trực của ${user.full_name} sang: ${newStatus}`);
        fetchAllData();
      }
    } catch (err) {
      console.warn('Notice toggling duty:', err);
    }
  };

  // Filtered Stations
  const filteredStations = stations.filter((s) => {
    const matchesSearch =
      s.station_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.station_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.province && s.province.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.wmo_index && s.wmo_index.includes(searchTerm));

    const matchesProvince = selectedProvinceFilter === 'all' || s.province === selectedProvinceFilter;
    const matchesSource =
      selectedSourceFilter === 'all' ||
      s.source === selectedSourceFilter ||
      (selectedSourceFilter === 'VNMHA' && s.source === 'VNMHA_NATIONAL') ||
      (selectedSourceFilter === 'VRAIN' && s.source === 'VRAIN_WATEC') ||
      (selectedSourceFilter === 'HYDRO' && s.source === 'HYDRO_POWER');

    return matchesSearch && matchesProvince && matchesSource;
  });

  return (
    <div id="admin-portal" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-2xl border border-emerald-400/30 text-sm font-semibold animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Navigation */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <Server className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-wide text-white">TRUNG TÂM QUẢN TRỊ & ĐIỀU HÀNH HAEWS v2.0</h1>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Operations & Admin Portal
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Quản lý Mạng lưới trạm viễn thám, Cấu hình địa bàn, Phát hành Công điện & Phân công kíp trực
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAllData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Làm mới</span>
          </button>
          
          <button
            onClick={onBackToMap}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold shadow-md shadow-rose-950/40 transition"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Quay lại Bản đồ Tác chiến WebGIS</span>
          </button>
        </div>
      </div>

      {/* Main Admin Tab Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-6">
        <div className="flex items-center gap-1 overflow-x-auto py-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Tổng quan Điều hành</span>
          </button>

          <button
            onClick={() => setActiveTab('stations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'stations'
                ? 'bg-indigo-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Mạng lưới Trạm Quan trắc ({stations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('provinces')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'provinces'
                ? 'bg-indigo-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Bật/Tắt Cảnh Báo Tỉnh ({provinces.filter(p => p.warning_enabled).length}/{provinces.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('communes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'communes'
                ? 'bg-emerald-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Building className="w-4 h-4 text-emerald-400" />
            <span>CSDL 10.598 Xã / Phường (100% Cấp Xã Toàn Quốc)</span>
          </button>

          <button
            onClick={() => setActiveTab('zones')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'zones'
                ? 'bg-indigo-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Địa bàn & Vùng Nguy cơ ({zones.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('dispatches')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'dispatches'
                ? 'bg-indigo-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Công điện & Bản tin Khẩn ({dispatches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('duty')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'duty'
                ? 'bg-indigo-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kíp trực & Phân quyền ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'logs'
                ? 'bg-indigo-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Nhật ký Vận hành ({auditLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('menus')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'menus'
                ? 'bg-indigo-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-cyan-400" />
            <span>Quản lý Menu ({menusList.length})</span>
          </button>

          <button
            id="btn-admin-settings-tab"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Cấu hình Hệ thống (Settings)</span>
          </button>
        </div>
      </div>

      {/* Content Canvas */}
      <div className="flex-1 p-6 max-w-[1800px] w-full mx-auto">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Trạm Đo Mưa Hoạt động</p>
                  <p className="text-2xl font-extrabold text-emerald-400 mt-1">
                    {stations.filter((s) => s.status === 'ONLINE').length} / {stations.length}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Tỷ lệ trực tuyến 100%</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Radio className="w-6 h-6 text-emerald-400" />
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Vùng Nguy cơ Giám sát</p>
                  <p className="text-2xl font-extrabold text-amber-400 mt-1">{zones.length} Xã/Điểm</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Phủ 7 tỉnh miền núi phía Bắc</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-amber-400" />
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Công điện Đã Phát hành</p>
                  <p className="text-2xl font-extrabold text-rose-400 mt-1">{dispatches.length} Bản tin</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {dispatches.reduce((sum, d) => sum + (d.recipients_count || 0), 0).toLocaleString()} người tiếp nhận
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-rose-400" />
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Cán bộ Đang Trực ban</p>
                  <p className="text-2xl font-extrabold text-indigo-400 mt-1">
                    {users.filter((u) => u.shift_status === 'ON_DUTY').length} / {users.length}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Trực 24/7 theo quy định PCTT</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-2">
                    <Radio className="w-4 h-4" />
                    <span>Quản lý Thiết bị Viễn thám</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Thêm trạm quan trắc tự động mới, cấu hình tọa độ GPS, hiệu chuẩn tần suất truyền dữ liệu (10p/30p/60p) và đặt chế độ kiểm tra pin.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingStation({
                      id: `sta-${Date.now()}`,
                      station_code: `VNA-LCA0${stations.length + 1}`,
                      station_name: 'Trạm Quan trắc Tự động Mới',
                      latitude: 22.3,
                      longitude: 104.1,
                      elevation: 450,
                      status: 'ONLINE',
                      source: 'VNA_TELEMETRY',
                      battery_level: 98,
                      quality_flag: 'VALID',
                      current_rainfall_1h: 0,
                      current_rainfall_3h: 0,
                      current_rainfall_6h: 0,
                      current_rainfall_24h: 0
                    });
                    setShowStationModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Trạm Quan trắc Mới</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-2">
                    <Send className="w-4 h-4" />
                    <span>Phát hành Công điện Hỏa tốc</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Tạo văn bản công điện khẩn cấp, đóng dấu điện tử và phát lệnh truyền tin SMS Broadcast / Đài phát thanh xã đến các hộ dân vùng rủi ro cấp 4-5.
                  </p>
                </div>
                <button
                  onClick={() => setShowDispatchModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition"
                >
                  <FileText className="w-4 h-4" />
                  <span>Soạn & Phát hành Công điện</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
                    <Layers className="w-4 h-4" />
                    <span>Hiệu chỉnh Ngưỡng & Kiểm định</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Truy cập nhanh mô-đun cấu hình ngưỡng cảnh báo vật lý và nhật ký kiểm định dữ liệu thời gian thực (Range/Spike/Jump validation).
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onOpenThresholds}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition"
                  >
                    Ngưỡng Vật lý
                  </button>
                  <button
                    onClick={onOpenDataQuality}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition"
                  >
                    Kiểm định Dữ liệu
                  </button>
                </div>
              </div>
            </div>

            {/* Live System Status Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Trạng thái Mạng lưới Quan trắc Khí tượng Trực tuyến</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/50">
                      <th className="py-2.5 px-3">Mã trạm</th>
                      <th className="py-2.5 px-3">Tên trạm quan trắc</th>
                      <th className="py-2.5 px-3">Tọa độ (Lat, Lng)</th>
                      <th className="py-2.5 px-3">Mưa 1h / 24h</th>
                      <th className="py-2.5 px-3">Dung lượng Pin</th>
                      <th className="py-2.5 px-3">Chất lượng Dữ liệu</th>
                      <th className="py-2.5 px-3">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {stations.slice(0, 6).map((st) => (
                      <tr key={st.id} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 font-bold text-indigo-300">{st.station_code}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-200">{st.station_name}</td>
                        <td className="py-2.5 px-3 text-slate-400">{st.latitude.toFixed(3)}, {st.longitude.toFixed(3)}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-amber-300">{st.current_rainfall_1h} mm</span>
                          <span className="text-slate-500 text-[11px]"> / {st.current_rainfall_24h} mm</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            st.battery_level > 70 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {st.battery_level}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {st.quality_flag}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {st.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STATIONS MANAGEMENT */}
        {activeTab === 'stations' && (
          <div className="space-y-4">
            {/* Filter & Action Toolbar */}
            <div className="flex flex-col gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Tìm theo tên, mã trạm, WMO, tỉnh..."
                      className="pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 w-64"
                    />
                  </div>

                  {/* Province Filter */}
                  <select
                    value={selectedProvinceFilter}
                    onChange={(e) => setSelectedProvinceFilter(e.target.value)}
                    className="py-1.5 px-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">-- Tất cả Tỉnh / Thành --</option>
                    <option value="Lào Cai">Lào Cai</option>
                    <option value="Yên Bái">Yên Bái</option>
                    <option value="Hà Giang">Hà Giang</option>
                    <option value="Cao Bằng">Cao Bằng</option>
                    <option value="Lai Châu">Lai Châu</option>
                    <option value="Điện Biên">Điện Biên</option>
                    <option value="Sơn La">Sơn La</option>
                    <option value="Tuyên Quang">Tuyên Quang</option>
                    <option value="Bắc Kạn">Bắc Kạn</option>
                    <option value="Lạng Sơn">Lạng Sơn</option>
                    <option value="Phú Thọ">Phú Thọ</option>
                    <option value="Hòa Bình">Hòa Bình</option>
                  </select>

                  <span className="text-xs text-slate-400">
                    Hiển thị: <strong className="text-indigo-400">{filteredStations.length}</strong> / {stations.length} trạm
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSyncOpenData}
                    disabled={isSyncingOpenData}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold transition disabled:opacity-50 shadow"
                    title="Đồng bộ lượng mưa thời gian thực từ Mạng lưới Khí tượng Mở & Radar QPE"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncingOpenData ? 'animate-spin' : ''}`} />
                    <span>{isSyncingOpenData ? 'Đang đồng bộ...' : 'Đồng bộ Dữ liệu Mở KTTV'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingStation({
                        id: `sta-${Date.now()}`,
                        station_code: `VNA-STA0${stations.length + 1}`,
                        station_name: 'Trạm Quan trắc Mới',
                        latitude: 22.35,
                        longitude: 104.2,
                        elevation: 500,
                        status: 'ONLINE',
                        source: 'VNA_TELEMETRY',
                        province: 'Lào Cai',
                        provider_network: 'Mạng lưới Vrain (Cục QL Đê điều & PCTT)',
                        battery_level: 100,
                        quality_flag: 'VALID',
                        current_rainfall_1h: 0,
                        current_rainfall_3h: 0,
                        current_rainfall_6h: 0,
                        current_rainfall_24h: 0
                      });
                      setShowStationModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Trạm Mới</span>
                  </button>
                </div>
              </div>

              {/* Source/Network Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400 text-[11px] font-medium">Nguồn dữ liệu:</span>
                {[
                  { key: 'all', label: 'Tất cả Nguồn' },
                  { key: 'VNMHA', label: '🏛️ Tổng cục KTTV Quốc gia (VNMHA)' },
                  { key: 'VRAIN', label: '📡 Mạng Đo Mưa Vrain' },
                  { key: 'HYDRO', label: '⚡ Lưu vực Hồ Thủy điện (EVN)' },
                  { key: 'RADAR_ESTIMATE', label: '🛰️ Ước lượng Radar QPE' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setSelectedSourceFilter(item.key)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                      selectedSourceFilter === item.key
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stations List Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950">
                    <th className="py-3 px-3">Mã trạm / WMO</th>
                    <th className="py-3 px-3">Tên trạm quan trắc</th>
                    <th className="py-3 px-3">Tỉnh / Khu vực</th>
                    <th className="py-3 px-3">Tọa độ GPS</th>
                    <th className="py-3 px-3">Cao độ</th>
                    <th className="py-3 px-3">Mạng lưới / Nguồn</th>
                    <th className="py-3 px-3">Mưa (1h / 24h)</th>
                    <th className="py-3 px-3">Pin</th>
                    <th className="py-3 px-3">Trạng thái</th>
                    <th className="py-3 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {filteredStations.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3">
                        <span className="font-bold text-indigo-300 block">{st.station_code}</span>
                        {st.wmo_index && (
                          <span className="text-[10px] text-amber-400 font-mono">WMO: {st.wmo_index}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-200 font-medium">{st.station_name}</td>
                      <td className="py-3 px-3 font-sans">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                          {st.province || 'Bắc Bộ'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400">{st.latitude.toFixed(3)}, {st.longitude.toFixed(3)}</td>
                      <td className="py-3 px-3 text-slate-300">{st.elevation} m</td>
                      <td className="py-3 px-3 font-sans">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                          st.source === 'VNMHA_NATIONAL'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : st.source === 'VRAIN_WATEC'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : st.source === 'HYDRO_POWER'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        }`}>
                          {st.source === 'VNMHA_NATIONAL'
                            ? 'VNMHA Quốc Gia'
                            : st.source === 'VRAIN_WATEC'
                            ? 'Vrain PCTT'
                            : st.source === 'HYDRO_POWER'
                            ? 'Thủy điện'
                            : st.source}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-amber-300">{st.current_rainfall_1h} mm</span>
                        <span className="text-slate-500 text-[11px]"> / {st.current_rainfall_24h} mm</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <Battery className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-bold text-slate-200">{st.battery_level}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          st.status === 'ONLINE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.status === 'ONLINE' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                          {st.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingStation(st);
                              setShowStationModal(true);
                            }}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-400 transition"
                            title="Sửa trạm"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStation(st.id, st.station_name)}
                            className="p-1.5 rounded bg-slate-800 hover:bg-rose-900/50 text-rose-400 transition"
                            title="Xóa trạm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: PROVINCE ALERT CONTROLS */}
        {activeTab === 'provinces' && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Điều Hành & Quản Lý Bật/Tắt Cảnh Báo Sớm Theo Từng Tỉnh Thành (Toàn Quốc)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Cho phép Ban Chỉ huy PCTT & TKCN chủ động kích hoạt hoặc vô hiệu hóa các thuật toán AI cảnh báo và phát lệnh sơ tán theo từng tỉnh thành.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    // Turn all on
                    for (const p of provinces) {
                      if (!p.warning_enabled) {
                        await fetch('/api/v1/admin/provinces/toggle', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ province_name: p.province_name, enabled: true, note: 'Bật đồng loạt toàn quốc' })
                        });
                      }
                    }
                    showToast('Đã kích hoạt cảnh báo cho toàn bộ các tỉnh thành');
                    fetchAllData();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  Bật Toàn Bộ Tỉnh
                </button>
                <button
                  onClick={async () => {
                    // Turn all off
                    if (!window.confirm('CẢNH BÁO: Tắt cảnh báo toàn quốc sẽ tạm ngưng phát tín hiệu rủi ro. Bạn có chắc chắn?')) return;
                    for (const p of provinces) {
                      if (p.warning_enabled) {
                        await fetch('/api/v1/admin/provinces/toggle', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ province_name: p.province_name, enabled: false, note: 'Tắt đồng loạt khẩn cấp' })
                        });
                      }
                    }
                    showToast('Đã tạm dừng cảnh báo cho toàn bộ các tỉnh thành');
                    fetchAllData();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <X className="w-3.5 h-3.5" />
                  Tắt Toàn Bộ Tỉnh
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {provinces.map((prov) => {
                const isEnabled = prov.warning_enabled;
                const provZones = zones.filter((z) => z.province_name.toLowerCase().includes(prov.province_name.toLowerCase()));
                const provStations = stations.filter((s) => s.province && s.province.toLowerCase().includes(prov.province_name.toLowerCase()));

                return (
                  <div
                    key={prov.province_name}
                    className={`p-4 rounded-xl border transition-all ${
                      isEnabled
                        ? 'bg-slate-900/90 border-slate-700/80 shadow-md'
                        : 'bg-slate-950/60 border-slate-800/50 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">Tỉnh {prov.province_name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            prov.region === 'BAC_BO' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                            prov.region === 'TRUNG_BO' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          }`}>
                            {prov.region === 'BAC_BO' ? 'Bắc Bộ' : prov.region === 'TRUNG_BO' ? 'Trung Bộ' : 'Tây Nguyên / Nam Bộ'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{prov.note || 'Địa bàn giám sát thiên tai trọng điểm'}</p>
                      </div>

                      {/* Toggle Switch */}
                      <button
                        onClick={() => handleToggleProvinceWarning(prov.province_name, isEnabled)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                        }`}
                        title={isEnabled ? 'Bấm để TẮT cảnh báo' : 'Bấm để BẬT cảnh báo'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                          <strong className="text-white">{provZones.length || prov.total_zones}</strong> vùng rủi ro
                        </span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <Radio className="w-3.5 h-3.5 text-sky-400" />
                          <strong className="text-white">{provStations.length || prov.total_stations}</strong> trạm đo
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className={`inline-block w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                        <span className={`text-[11px] font-bold ${isEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {isEnabled ? 'Đang Phát Cảnh Báo' : 'Đã Tắt Cảnh Báo'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: CSDL 10,598 XÃ / PHƯỜNG / THỊ TRẤN TOÀN QUỐC */}
        {activeTab === 'communes' && (
          <div className="space-y-6">
            {/* National Administrative KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Tổng ĐVHC Cấp Xã</span>
                <p className="text-xl font-extrabold text-emerald-400 mt-1">10.598</p>
                <span className="text-[10px] text-emerald-500/80 font-medium">100% Cả nước (GSO)</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Xã (Nông thôn)</span>
                <p className="text-xl font-extrabold text-sky-400 mt-1">8.297</p>
                <span className="text-[10px] text-slate-500 font-medium">78.3% cơ cấu</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Phường (Đô thị)</span>
                <p className="text-xl font-extrabold text-indigo-400 mt-1">1.687</p>
                <span className="text-[10px] text-slate-500 font-medium">15.9% cơ cấu</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Thị trấn (Huyện lỵ)</span>
                <p className="text-xl font-extrabold text-amber-400 mt-1">614</p>
                <span className="text-[10px] text-slate-500 font-medium">5.8% cơ cấu</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Xã Nguy cơ Sạt lở</span>
                <p className="text-xl font-extrabold text-rose-400 mt-1">3.842</p>
                <span className="text-[10px] text-rose-400/80 font-medium">Vùng núi & trung du</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Tỉnh / Thành phố</span>
                <p className="text-xl font-extrabold text-purple-400 mt-1">63 / 63</p>
                <span className="text-[10px] text-purple-400/80 font-medium">Chính quyền 2 cấp</span>
              </div>
            </div>

            {/* Explorer Toolbar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Building className="w-5 h-5 text-emerald-400" />
                    <span>Tra Cứu & Quản Trị Cơ Sở Dữ Liệu 10.598 Đơn Vị Hành Chính Cấp Xã</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Hệ thống tích hợp đầy đủ 10.598 xã, phường, thị trấn thuộc 63 tỉnh/thành phố phục vụ mô hình chính quyền 2 cấp và bản đồ viễn thám cảnh báo lũ quét, sạt lở đất.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const csvHeader = 'Ma_GSO,Ten_Xa,Loai_Hinh,Quan_Huyen,Tinh_Thanh,Kinh_Do,Vi_Do,Cao_Do_m,Do_Doc_deg,Nguy_Co_Sat_Lo\n';
                      const csvRows = communeItems.map(c => 
                        `"${c.gso_code || ''}","${c.name}","${c.type}","${c.district_name}","${c.province_name}",${c.coordinates?.[1] || 0},${c.coordinates?.[0] || 0},${c.elevation_m || 0},${c.slope_degrees || 0},"${c.is_landslide_hotspot ? 'CAO' : 'TRUNG_BINH'}"`
                      ).join('\n');
                      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `haews_csdl_xa_phuong_page_${communeTabPage}.csv`;
                      a.click();
                      showToast('Đã xuất dữ liệu trang hiện tại ra file CSV!');
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition"
                  >
                    <Download className="w-4 h-4 text-sky-400" />
                    <span>Xuất CSV</span>
                  </button>

                  <button
                    onClick={() => fetchCommunesList()}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition shadow-md shadow-emerald-950"
                  >
                    <RefreshCw className={`w-4 h-4 ${communeLoading ? 'animate-spin' : ''}`} />
                    <span>Làm Mới</span>
                  </button>
                </div>
              </div>

              {/* Filters Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
                {/* Search Text Input */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Tìm tên xã, huyện, mã GSO..."
                    value={communeTabSearchQuery}
                    onChange={(e) => {
                      setCommuneTabSearchQuery(e.target.value);
                      setCommuneTabPage(1);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                {/* Province Select */}
                <div>
                  <select
                    value={communeTabProvinceFilter}
                    onChange={(e) => {
                      setCommuneTabProvinceFilter(e.target.value);
                      setCommuneTabPage(1);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="ALL">Tất cả 63 Tỉnh / Thành phố</option>
                    {VIETNAM_PROVINCES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.total_communes || 50} xã/phường)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <select
                    value={communeTabTypeFilter}
                    onChange={(e) => {
                      setCommuneTabTypeFilter(e.target.value);
                      setCommuneTabPage(1);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="ALL">Tất cả Loại hình (Xã, Phường, TT)</option>
                    <option value="xa">Chỉ Xã (Nông thôn & Miền núi)</option>
                    <option value="phuong">Chỉ Phường (Đô thị)</option>
                    <option value="thi_tran">Chỉ Thị trấn (Huyện lỵ)</option>
                  </select>
                </div>

                {/* Risk Filter */}
                <div>
                  <select
                    value={communeTabRiskFilter}
                    onChange={(e) => {
                      setCommuneTabRiskFilter(e.target.value);
                      setCommuneTabPage(1);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="ALL">Tất cả Mức độ Rủi ro Địa chất</option>
                    <option value="HOTSPOT">⚠️ Trọng điểm Nguy cơ Sạt lở / Lũ quét</option>
                    <option value="NORMAL">✅ Vùng rủi ro Bình thường / Đô thị</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/80">
                        <th className="p-3 w-16 text-center">Mã GSO</th>
                        <th className="p-3">Tên Xã / Phường / TT</th>
                        <th className="p-3">Loại hình</th>
                        <th className="p-3">Quận / Huyện</th>
                        <th className="p-3">Tỉnh / Thành phố</th>
                        <th className="p-3">Tọa độ GPS</th>
                        <th className="p-3 text-center">Cao độ / Độ dốc</th>
                        <th className="p-3 text-center">Nguy cơ Thiên tai</th>
                        <th className="p-3 text-center">Giám sát</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {communeLoading ? (
                        <tr>
                          <td colSpan={9} className="p-12 text-center text-slate-400 font-sans">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                              <span>Đang tải danh sách xã/phường từ cơ sở dữ liệu 10.598 đơn vị...</span>
                            </div>
                          </td>
                        </tr>
                      ) : communeItems.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-slate-500 font-sans">
                            Không tìm thấy xã/phường nào phù hợp với bộ lọc tìm kiếm.
                          </td>
                        </tr>
                      ) : (
                        communeItems.map((c, idx) => {
                          const isHotspot = c.is_landslide_hotspot;
                          const lat = c.coordinates?.[0] ?? c.latitude ?? 21.0;
                          const lng = c.coordinates?.[1] ?? c.longitude ?? 105.0;

                          return (
                            <tr key={c.id || idx} className="hover:bg-slate-900/60 transition">
                              <td className="p-3 text-center text-slate-400 font-bold">
                                <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                  {c.gso_code || c.id?.replace(/[^0-9]/g, '').slice(0, 5) || '10' + String(idx).padStart(3, '0')}
                                </span>
                              </td>
                              <td className="p-3 font-sans font-bold text-white">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  <span>{c.name}</span>
                                </div>
                              </td>
                              <td className="p-3 font-sans">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  c.type === 'phuong'
                                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                    : c.type === 'thi_tran'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                }`}>
                                  {c.type === 'phuong' ? 'Phường' : c.type === 'thi_tran' ? 'Thị trấn' : 'Xã'}
                                </span>
                              </td>
                              <td className="p-3 font-sans text-slate-300">
                                {c.district_name || 'Huyện trung tâm'}
                              </td>
                              <td className="p-3 font-sans text-slate-200 font-medium">
                                {c.province_name || 'Phú Thọ'}
                              </td>
                              <td className="p-3 text-slate-400 text-[11px]">
                                {Number(lat).toFixed(4)}°N, {Number(lng).toFixed(4)}°E
                              </td>
                              <td className="p-3 text-center text-slate-300">
                                {c.elevation_m || 150}m / {c.slope_degrees || 18}°
                              </td>
                              <td className="p-3 text-center font-sans">
                                {isHotspot ? (
                                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold inline-flex items-center gap-1">
                                    <Flame className="w-3 h-3" />
                                    Nguy Cơ Cao
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-medium">
                                    Bình Thường
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center font-sans">
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  Kích Hoạt
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-3.5 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                  <div>
                    Hiển thị <strong className="text-white">{(communeTabPage - 1) * 25 + 1} - {Math.min(communeTabPage * 25, communeTotal)}</strong> trong tổng số <strong className="text-emerald-400 font-bold">{communeTotal.toLocaleString()}</strong> đơn vị cấp xã
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCommuneTabPage(1)}
                      disabled={communeTabPage === 1}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800 font-mono transition"
                    >
                      « Đầu
                    </button>
                    <button
                      onClick={() => setCommuneTabPage((p) => Math.max(1, p - 1))}
                      disabled={communeTabPage === 1}
                      className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800 font-mono transition"
                    >
                      ‹ Trước
                    </button>

                    <span className="px-3 py-1 bg-slate-950 border border-emerald-500/50 rounded-lg text-emerald-300 font-mono font-bold">
                      Trang {communeTabPage} / {Math.max(1, Math.ceil(communeTotal / 25))}
                    </span>

                    <button
                      onClick={() => setCommuneTabPage((p) => Math.min(Math.ceil(communeTotal / 25), p + 1))}
                      disabled={communeTabPage >= Math.ceil(communeTotal / 25)}
                      className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800 font-mono transition"
                    >
                      Sau ›
                    </button>
                    <button
                      onClick={() => setCommuneTabPage(Math.ceil(communeTotal / 25))}
                      disabled={communeTabPage >= Math.ceil(communeTotal / 25)}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800 font-mono transition"
                    >
                      Cuối »
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ZONES MANAGEMENT */}
        {activeTab === 'zones' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Cơ sở Dữ liệu Không gian Vùng Nguy cơ Sạt lở & Lũ quét</h3>
                <p className="text-xs text-slate-400">Điều chỉnh các thông số địa chất, độ dốc sườn đồi và dân số bị ảnh hưởng</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950">
                    <th className="py-3 px-4">Tên Vùng / Điểm Nguy cơ</th>
                    <th className="py-3 px-4">Huyện / Tỉnh</th>
                    <th className="py-3 px-4">Lưu vực sông suối</th>
                    <th className="py-3 px-4">Độ dốc (° / %)</th>
                    <th className="py-3 px-4">Độ nhạy Địa chất</th>
                    <th className="py-3 px-4">Thổ nhưỡng</th>
                    <th className="py-3 px-4">Dân số Dễ tổn thương</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {zones.map((z) => (
                    <tr key={z.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-bold text-slate-100">{z.zone_name}</td>
                      <td className="py-3 px-4 text-slate-300">{z.district_name}, {z.province_name}</td>
                      <td className="py-3 px-4 text-indigo-300 font-mono">{z.basin_name}</td>
                      <td className="py-3 px-4 text-amber-300 font-mono font-bold">{z.slope}° / {z.channel_gradient}%</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          z.geology_sensitivity === 'VERY_HIGH'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {z.geology_sensitivity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{z.soil_type}</td>
                      <td className="py-3 px-4 font-mono font-bold text-rose-300">
                        {z.vulnerable_population.toLocaleString()} người
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setEditingZone(z);
                            setShowZoneModal(true);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-xs font-semibold transition"
                        >
                          Hiệu chỉnh
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: EMERGENCY DISPATCHES */}
        {activeTab === 'dispatches' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-400" />
                  <span>Trung tâm Soạn thảo & Phát hành Công điện / Bản tin Cảnh báo Khẩn cấp</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Tích hợp truyền tin đa kênh qua SMS Broadcast, Hệ thống Loa truyền thanh số VNA và Zalo OA
                </p>
              </div>

              <button
                onClick={() => setShowDispatchModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-rose-950/40 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Soạn Công điện Mới</span>
              </button>
            </div>

            {/* Dispatches List */}
            <div className="grid grid-cols-1 gap-4">
              {dispatches.map((disp) => (
                <div key={disp.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          {disp.urgency_level}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-300">{disp.dispatch_number}</span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-400">{new Date(disp.issue_date).toLocaleString('vi-VN')}</span>
                      </div>
                      <h4 className="text-base font-bold text-white">{disp.title}</h4>
                      <p className="text-xs text-slate-400 font-mono">
                        Cơ quan phát hành: <strong className="text-slate-200">{disp.issuer}</strong> | Người ký: <strong className="text-slate-200">{disp.signer}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {disp.status === 'TRANSMITTED' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <Check className="w-3.5 h-3.5" />
                          ĐÃ TRUYỀN TIN ({disp.recipients_count?.toLocaleString()} THUÊ BAO)
                        </span>
                      ) : (
                        <button
                          onClick={() => handleBroadcastDispatch(disp.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-rose-900/40 transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>PHÁT LỆNH TRUYỀN TIN KHẨN CẤP</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <p className="font-semibold text-slate-200 mb-1">Nội dung chỉ đạo:</p>
                    <p>{disp.content}</p>
                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-rose-300 font-semibold">
                      <span>Chỉ dẫn sơ tán: {disp.evacuation_instructions}</span>
                      <span className="text-slate-400 font-mono text-[11px]">Khu vực: {disp.affected_zones.join(', ')}</span>
                    </div>
                  </div>

                  {/* SMS Broadcast Preview */}
                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between gap-4 text-xs font-mono">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Radio className="w-4 h-4 shrink-0" />
                      <span className="text-slate-300 font-mono text-[11px] truncate">SMS Broadcast: "{disp.sms_broadcast_text}"</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {disp.broadcast_channels.map((ch) => (
                        <span key={ch} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DUTY ROSTER & USERS */}
        {activeTab === 'duty' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Danh sách Kíp trực Ban Chỉ huy PCTT & Phân quyền Hệ thống</h3>
                <p className="text-xs text-slate-400">Ghi nhận cán bộ trực ban, chuyên gia thủy văn và kỹ thuật viên hệ thống</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {users.map((u) => (
                <div key={u.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        u.shift_status === 'ON_DUTY'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {u.shift_status === 'ON_DUTY' ? 'ĐANG TRỰC BAN' : 'DỰ PHÒNG'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{u.role}</span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white">{u.full_name}</h4>
                      <p className="text-xs text-indigo-400 font-medium">{u.role_label}</p>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{u.department}</span>
                      </p>
                    </div>

                    <div className="space-y-1 text-xs text-slate-400 pt-2 border-t border-slate-800 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{u.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate">{u.email}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleDuty(u)}
                    className={`w-full py-2 rounded-lg text-xs font-bold transition ${
                      u.shift_status === 'ON_DUTY'
                        ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {u.shift_status === 'ON_DUTY' ? 'Chuyển sang Dự phòng' : 'Bàn giao Ca Trực ban'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Nhật ký Vận hành & Lịch sử Thao tác Quản trị (Audit Trail)</h3>
                <p className="text-xs text-slate-400">Toàn bộ thao tác thay đổi thông số, hiệu chỉnh trạm và phát lệnh khẩn cấp</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950">
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4">Cán bộ thực hiện</th>
                    <th className="py-3 px-4">Hành động</th>
                    <th className="py-3 px-4">Đối tượng</th>
                    <th className="py-3 px-4">Chi tiết thao tác</th>
                    <th className="py-3 px-4">Địa chỉ IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 text-slate-400">{new Date(log.timestamp).toLocaleString('vi-VN')}</td>
                      <td className="py-3 px-4 font-sans font-bold text-slate-200">
                        {log.user_name}
                        <span className="block text-[10px] text-slate-500 font-normal">{log.user_role}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {log.action_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-amber-300 font-semibold">{log.target}</td>
                      <td className="py-3 px-4 font-sans text-slate-300">{log.details}</td>
                      <td className="py-3 px-4 text-slate-500">{log.ip_address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: SYSTEM SETTINGS (CẤU HÌNH HỆ THỐNG & TỈNH MẶC ĐỊNH) */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header / Intro Card */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 shadow-lg">
                    <Settings className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <span>Cấu Hình Hệ Thống & Tham Số Mặc Định</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase">
                        HAEWS v2.0 Settings
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Thiết lập Tỉnh/Thành phố trọng điểm mặc định, cơ chế hiển thị danh mục Xã/Phường theo ABC, giao diện khởi động và các chế độ tích hợp.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    id="btn-reset-default-settings"
                    onClick={() => {
                      setDefaultProvince('phu_tho');
                      setCommuneDisplayMode('ACCORDION_ABC');
                      setAutoExpandCritical(true);
                      setDefaultInitialView('PORTAL');
                      setDefaultWeatherOverlay('rain');
                      setTelemetryRefreshInterval(60);

                      localStorage.setItem('haews_default_province', 'phu_tho');
                      localStorage.setItem('haews_commune_display_mode', 'ACCORDION_ABC');
                      localStorage.setItem('haews_auto_expand_critical', 'true');
                      localStorage.setItem('haews_default_initial_view', 'PORTAL');
                      localStorage.setItem('haews_default_weather_overlay', 'rain');
                      localStorage.setItem('haews_telemetry_refresh_interval', '60');

                      if (onUpdateDefaultProvince) {
                        onUpdateDefaultProvince('phu_tho');
                      }

                      showToast('Đã khôi phục cài đặt mặc định: Tỉnh Phú Thọ (Thu gọn Accordion ABC)');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Khôi phục Mặc định (Phú Thọ)</span>
                  </button>

                  <button
                    id="btn-save-all-settings"
                    onClick={() => {
                      localStorage.setItem('haews_default_province', defaultProvince);
                      localStorage.setItem('haews_commune_display_mode', communeDisplayMode);
                      localStorage.setItem('haews_auto_expand_critical', String(autoExpandCritical));
                      localStorage.setItem('haews_default_initial_view', defaultInitialView);
                      localStorage.setItem('haews_default_weather_overlay', defaultWeatherOverlay);
                      localStorage.setItem('haews_telemetry_refresh_interval', String(telemetryRefreshInterval));

                      if (onUpdateDefaultProvince) {
                        onUpdateDefaultProvince(defaultProvince);
                      }

                      const provObj = VIETNAM_PROVINCES.find((p) => p.id === defaultProvince);
                      showToast(`Đã lưu cấu hình hệ thống thành công! Tỉnh mặc định: ${provObj?.name || defaultProvince}`);
                    }}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu Cấu Hình Mặc Định</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 1: PROVINCE SELECTION & DEFAULT PROVINCE */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-sky-400" />
                    <span>1. Thiết Lập Tỉnh / Thành Phố Mặc Định Cho Hệ Thống</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tỉnh mặc định sẽ được chọn tự động khi công dân và cán bộ chỉ huy mở ứng dụng, bao gồm cả Cổng thông tin dân sinh và Bản đồ WebGIS.
                  </p>
                </div>

                {/* Quick Button to set Phu Tho */}
                <button
                  id="btn-quick-set-phu-tho"
                  onClick={() => {
                    setDefaultProvince('phu_tho');
                    localStorage.setItem('haews_default_province', 'phu_tho');
                    if (onUpdateDefaultProvince) {
                      onUpdateDefaultProvince('phu_tho');
                    }
                    showToast('Đã thiết lập Tỉnh Phú Thọ làm Tỉnh Mặc Định của toàn bộ hệ thống!');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md ${
                    defaultProvince === 'phu_tho'
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/50'
                      : 'bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{defaultProvince === 'phu_tho' ? '✓ Đang là Tỉnh Phú Thọ Mặc Định' : '🏛️ Thiết Lập Tỉnh Phú Thọ Làm Mặc Định'}</span>
                </button>
              </div>

              {/* Current Selected Default Province Hero Banner */}
              {(() => {
                const activeProvObj = VIETNAM_PROVINCES.find((p) => p.id === defaultProvince) || VIETNAM_PROVINCES[0];
                const communesCount = activeProvObj.total_communes || getOfficialProvinceCommunesCount(activeProvObj.id);

                return (
                  <div className="bg-gradient-to-r from-slate-950 via-sky-950/40 to-slate-950 border border-sky-500/40 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-sky-600/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-sky-400 font-bold uppercase tracking-wider">Tỉnh Mặc Định Đang Áp Dụng:</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                            ĐANG HOẠT ĐỘNG
                          </span>
                        </div>
                        <h4 className="text-lg font-extrabold text-white mt-0.5">
                          {activeProvObj.name} ({activeProvObj.short_name})
                        </h4>
                        <p className="text-xs text-slate-400">
                          {activeProvObj.region_label} • Tọa độ trung tâm: [{activeProvObj.center[0].toFixed(2)}°N, {activeProvObj.center[1].toFixed(2)}°E] • Zoom: {activeProvObj.zoom}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div className="bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Quy mô xã/phường:</span>
                        <b className="text-sky-300 font-bold text-sm">{communesCount} Xã / Phường / TT</b>
                      </div>
                      <div className="bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Cơ chế quản lý:</span>
                        <b className="text-emerald-300 font-bold text-sm">Chính quyền 2 cấp</b>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Province Picker Filter & Grid */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm trong 63 Tỉnh / Thành phố Việt Nam..."
                      value={provinceSearchQuery}
                      onChange={(e) => setProvinceSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Region Filter Buttons */}
                  <div className="flex items-center gap-1 overflow-x-auto text-xs py-1">
                    {[
                      { id: 'ALL', label: 'Tất cả (63)' },
                      { id: 'BAC_BO', label: 'Bắc Bộ' },
                      { id: 'BAC_TRUNG_BO', label: 'Bắc Trung Bộ' },
                      { id: 'NAM_TRUNG_BO', label: 'Nam Trung Bộ' },
                      { id: 'TAY_NGUYEN', label: 'Tây Nguyên' },
                      { id: 'NAM_BO', label: 'Nam Bộ' }
                    ].map((reg) => (
                      <button
                        key={reg.id}
                        onClick={() => setProvinceRegionFilter(reg.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                          provinceRegionFilter === reg.id
                            ? 'bg-indigo-600 text-white shadow'
                            : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {reg.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 63 Provinces Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {VIETNAM_PROVINCES.filter((p) => {
                    const matchesSearch =
                      !provinceSearchQuery.trim() ||
                      p.name.toLowerCase().includes(provinceSearchQuery.toLowerCase()) ||
                      p.short_name.toLowerCase().includes(provinceSearchQuery.toLowerCase());
                    const matchesRegion = provinceRegionFilter === 'ALL' || p.region === provinceRegionFilter;
                    return matchesSearch && matchesRegion;
                  }).map((p) => {
                    const isSelected = defaultProvince === p.id;
                    const communeCount = p.total_communes || getOfficialProvinceCommunesCount(p.id);

                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setDefaultProvince(p.id);
                          localStorage.setItem('haews_default_province', p.id);
                          if (onUpdateDefaultProvince) {
                            onUpdateDefaultProvince(p.id);
                          }
                          showToast(`Đã chọn ${p.name} làm Tỉnh Mặc Định!`);
                        }}
                        className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-indigo-950/70 border-indigo-500 shadow-md ring-2 ring-indigo-500/50'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <span className="font-bold text-xs text-white block">{p.name}</span>
                            <span className="text-[10px] text-slate-400">{p.region_label.split('(')[0]}</span>
                          </div>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              MẶC ĐỊNH
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/80">
                          <span>{communeCount} xã/phường</span>
                          <span className={isSelected ? 'text-indigo-300 font-bold' : 'text-slate-500'}>
                            {isSelected ? '✓ Đang chọn' : 'Nhấp để chọn'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION 2: COMMUNE DIRECTORY COLLAPSE & ABC DISPLAY OPTIONS */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="border-b border-slate-800/80 pb-4">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-emerald-400" />
                  <span>2. Cấu Hình Hiển Thị Danh Mục Xã / Phường (Khung Bên Phải)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tùy chỉnh chế độ hiển thị danh sách xã phường theo dạng thu gọn Accordion sắp xếp theo bảng chữ cái ABC để hiển thị gọn gàng và chứa được nhiều xã phường.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option A: Collapsible ABC Accordion */}
                <div
                  onClick={() => {
                    setCommuneDisplayMode('ACCORDION_ABC');
                    localStorage.setItem('haews_commune_display_mode', 'ACCORDION_ABC');
                    showToast('Đã bật chế độ: Thu gọn Accordion sắp xếp theo ABC (Khuyên dùng)');
                  }}
                  className={`p-4 rounded-xl border transition cursor-pointer space-y-3 ${
                    communeDisplayMode === 'ACCORDION_ABC'
                      ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                        A-Z
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">Dạng Thu Gọn Accordion theo ABC (Khuyên Dùng)</h4>
                        <span className="text-[10px] text-emerald-400 font-semibold">Tối ưu không gian • Sắp xếp A ➔ Z</span>
                      </div>
                    </div>
                    {communeDisplayMode === 'ACCORDION_ABC' && (
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Gom nhóm xã phường theo các ký tự chữ cái (A, B, C, D, Đ, G, H, K, L, M, N, P, Q, S, T, V, X, Y), cho phép mở/đóng từng nhóm hoặc mở tất cả. Giúp cán bộ và người dân theo dõi toàn bộ 50+ xã phường trên một màn hình mà không bị tràn trang.
                  </p>
                </div>

                {/* Option B: Flat Cards View */}
                <div
                  onClick={() => {
                    setCommuneDisplayMode('FLAT_CARDS');
                    localStorage.setItem('haews_commune_display_mode', 'FLAT_CARDS');
                    showToast('Đã chọn chế độ: Danh sách thẻ mở rộng (Flat Cards)');
                  }}
                  className={`p-4 rounded-xl border transition cursor-pointer space-y-3 ${
                    communeDisplayMode === 'FLAT_CARDS'
                      ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">
                        ☰
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">Dạng Thẻ Đầy Đủ (Flat Cards)</h4>
                        <span className="text-[10px] text-indigo-400 font-semibold">Hiển thị thẻ độc lập liên tục</span>
                      </div>
                    </div>
                    {communeDisplayMode === 'FLAT_CARDS' && (
                      <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Hiển thị các xã phường dưới dạng các khối thẻ riêng lẻ trải dài từ trên xuống dưới, phù hợp khi muốn đọc tuần tự từng thẻ.
                  </p>
                </div>
              </div>

              {/* Behavior Toggles */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">
                      Tự động mở rộng nhóm chữ cái có Xã/Phường Cảnh báo Cấp 4 & Cấp 5
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Khi phát hiện có điểm báo động khẩn cấp, hệ thống tự động mở sẵn các nhóm ABC chứa xã đó để chỉ huy nhận biết ngay.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoExpandCritical}
                    onChange={(e) => setAutoExpandCritical(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              </div>
            </div>

            {/* SECTION 3: APPLICATION STARTUP & TELEMETRY */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="border-b border-slate-800/80 pb-4">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-400" />
                  <span>3. Cấu Hình Khởi Động & Môi Trường Vận Hành Mặc Định</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Thiết lập giao diện mặc định, tần suất cập nhật dữ liệu tự động và lớp hiển thị khí tượng viễn thám.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Initial View */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5">Giao diện Khởi động Ban đầu</label>
                  <select
                    value={defaultInitialView}
                    onChange={(e) => setDefaultInitialView(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sky-300 font-semibold focus:outline-none focus:border-sky-500"
                  >
                    <option value="PORTAL">Cổng Thông Tin Đại Chúng Dân Sinh (Public Portal)</option>
                    <option value="MAP">Phòng Tác Chiến Chỉ Huy WebGIS (War Room)</option>
                  </select>
                </div>

                {/* Weather Overlay */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5">Lớp Khí Tượng Viễn Thám Mặc Định</label>
                  <select
                    value={defaultWeatherOverlay}
                    onChange={(e) => setDefaultWeatherOverlay(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="rain">Mưa & Radar Thời Gian Thực (Rain & Radar)</option>
                    <option value="satellite">Mây Vệ Tinh Viễn Thám (Satellite Cloud)</option>
                    <option value="wind">Gió & Bão ECMWF (Wind Streamlines)</option>
                    <option value="lightning">Dông Sét & Đối Lưu Cực Đoan (Thunder & Lightning)</option>
                  </select>
                </div>

                {/* Refresh Interval */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5">Tần Suất Tự Động Làm Mới Dữ Liệu</label>
                  <select
                    value={telemetryRefreshInterval}
                    onChange={(e) => setTelemetryRefreshInterval(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-semibold focus:outline-none focus:border-amber-500"
                  >
                    <option value={30}>30 giây / lần</option>
                    <option value={60}>1 phút / lần (Khuyên dùng)</option>
                    <option value={120}>2 phút / lần</option>
                    <option value={300}>5 phút / lần</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MENUS MANAGEMENT */}
        {activeTab === 'menus' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header & Quick Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-cyan-400" />
                  <span>Quản Trị Menu & Điều Hướng Đa Cấp (Navigation Menus)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Tùy chỉnh bật/tắt, đổi tên, thêm/bớt các mục menu và menu con đa cấp hiển thị trên Cổng thông tin công cộng.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetNavigationMenus}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                  title="Khôi phục về cấu hình menu mặc định ban đầu"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Mặc định</span>
                </button>

                <button
                  onClick={() =>
                    setEditingMenuItem({
                      isOpen: true,
                      isSubmenu: false,
                      item: { title: '', targetTab: 'HOME', enabled: true, order: menusList.length + 1 }
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Menu Chính</span>
                </button>
              </div>
            </div>

            {/* Menu Tree List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="space-y-3">
                {menusList
                  .sort((a, b) => a.order - b.order)
                  .map((menu, menuIndex) => (
                    <div
                      key={menu.id}
                      className={`border rounded-xl p-4 transition ${
                        menu.enabled
                          ? 'bg-slate-950/80 border-slate-800'
                          : 'bg-slate-950/40 border-slate-800/50 opacity-60'
                      }`}
                    >
                      {/* Menu Level 1 Row */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Reorder buttons */}
                          <div className="flex flex-col gap-0.5">
                            <button
                              disabled={menuIndex === 0}
                              onClick={() => handleMoveMenu(menu.id, 'UP')}
                              className="p-1 hover:bg-slate-800 rounded text-slate-400 disabled:opacity-20 text-[10px]"
                              title="Chuyển lên"
                            >
                              ▲
                            </button>
                            <button
                              disabled={menuIndex === menusList.length - 1}
                              onClick={() => handleMoveMenu(menu.id, 'DOWN')}
                              className="p-1 hover:bg-slate-800 rounded text-slate-400 disabled:opacity-20 text-[10px]"
                              title="Chuyển xuống"
                            >
                              ▼
                            </button>
                          </div>

                          {/* Title & Target */}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{menu.title}</span>
                              {menu.badge && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-600/30 text-cyan-300 border border-cyan-500/40">
                                  {menu.badge}
                                </span>
                              )}
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                                Target: {menu.targetTab}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Thứ tự: {menu.order} • {menu.children?.length || 0} mục menu con
                            </div>
                          </div>
                        </div>

                        {/* Level 1 Actions */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                          {/* Enable / Disable Toggle */}
                          <button
                            onClick={() => handleToggleMenu(menu.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                              menu.enabled
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${menu.enabled ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                            <span>{menu.enabled ? 'Đang BẬT' : 'Đã TẮT'}</span>
                          </button>

                          {/* Add Submenu Button */}
                          <button
                            onClick={() =>
                              setEditingMenuItem({
                                isOpen: true,
                                isSubmenu: true,
                                parentId: menu.id,
                                item: { title: '', targetTab: 'MAP', enabled: true }
                              })
                            }
                            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-cyan-400 transition"
                            title="Thêm mục menu con"
                          >
                            <Plus className="w-4 h-4" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() =>
                              setEditingMenuItem({
                                isOpen: true,
                                isSubmenu: false,
                                item: { ...menu }
                              })
                            }
                            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-indigo-400 transition"
                            title="Chỉnh sửa menu này"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteMenu(menu.id)}
                            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition"
                            title="Xóa menu này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Submenu Level 2 Items */}
                      {menu.children && menu.children.length > 0 && (
                        <div className="mt-3 pl-6 border-l-2 border-slate-800 space-y-2">
                          {menu.children
                            .sort((a, b) => a.order - b.order)
                            .map((sub, subIndex) => (
                              <div
                                key={sub.id}
                                className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition ${
                                  sub.enabled
                                    ? 'bg-slate-900/90 border-slate-800/80 text-slate-200'
                                    : 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-60'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-500">↳</span>
                                  <span className="font-semibold">{sub.title}</span>
                                  {sub.badge && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                                      {sub.badge}
                                    </span>
                                  )}
                                  <span className="text-[10px] px-1 py-0.5 rounded bg-slate-950 text-slate-500 font-mono">
                                    {sub.targetTab}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  {/* Reorder sub item */}
                                  <button
                                    disabled={subIndex === 0}
                                    onClick={() => handleMoveMenu(sub.id, 'UP', menu.id)}
                                    className="p-1 hover:bg-slate-800 rounded text-slate-400 disabled:opacity-20 text-[9px]"
                                  >
                                    ▲
                                  </button>
                                  <button
                                    disabled={subIndex === (menu.children?.length || 0) - 1}
                                    onClick={() => handleMoveMenu(sub.id, 'DOWN', menu.id)}
                                    className="p-1 hover:bg-slate-800 rounded text-slate-400 disabled:opacity-20 text-[9px]"
                                  >
                                    ▼
                                  </button>

                                  {/* Toggle Sub item */}
                                  <button
                                    onClick={() => handleToggleMenu(sub.id, menu.id)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      sub.enabled
                                        ? 'bg-emerald-500/20 text-emerald-300'
                                        : 'bg-rose-500/20 text-rose-300'
                                    }`}
                                  >
                                    {sub.enabled ? 'Bật' : 'Tắt'}
                                  </button>

                                  {/* Edit Sub item */}
                                  <button
                                    onClick={() =>
                                      setEditingMenuItem({
                                        isOpen: true,
                                        isSubmenu: true,
                                        parentId: menu.id,
                                        item: { ...sub }
                                      })
                                    }
                                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-indigo-400"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete Sub item */}
                                  <button
                                    onClick={() => handleDeleteMenu(sub.id, menu.id)}
                                    className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-rose-400"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD/EDIT STATION */}
      {showStationModal && editingStation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-indigo-400" />
                <span>{editingStation.id ? 'Cấu hình Trạm Quan trắc Viễn thám' : 'Thêm Trạm Quan trắc Mới'}</span>
              </h3>
              <button
                onClick={() => {
                  setShowStationModal(false);
                  setEditingStation(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStation} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Mã trạm</label>
                  <input
                    type="text"
                    required
                    value={editingStation.station_code || ''}
                    onChange={(e) => setEditingStation({ ...editingStation, station_code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Tên trạm quan trắc</label>
                  <input
                    type="text"
                    required
                    value={editingStation.station_name || ''}
                    onChange={(e) => setEditingStation({ ...editingStation, station_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Vĩ độ (Lat)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={editingStation.latitude || 0}
                    onChange={(e) => setEditingStation({ ...editingStation, latitude: parseFloat(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Kinh độ (Lng)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={editingStation.longitude || 0}
                    onChange={(e) => setEditingStation({ ...editingStation, longitude: parseFloat(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Cao độ (m)</label>
                  <input
                    type="number"
                    value={editingStation.elevation || 0}
                    onChange={(e) => setEditingStation({ ...editingStation, elevation: parseInt(e.target.value, 10) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Nguồn dữ liệu / Mạng lưới</label>
                  <select
                    value={editingStation.source || 'VNMHA_NATIONAL'}
                    onChange={(e) => setEditingStation({ ...editingStation, source: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="VNMHA_NATIONAL">🏛️ Tổng cục KTTV Quốc gia (VNMHA / WMO)</option>
                    <option value="VRAIN_WATEC">📡 Mạng Đo Mưa Tự Động Vrain</option>
                    <option value="HYDRO_POWER">⚡ Lưu vực Hồ Thủy điện (EVN)</option>
                    <option value="RADAR_ESTIMATE">🛰️ Ước lượng Radar QPE & Viễn thám</option>
                    <option value="AUTOMATIC_RAIN_GAUGE">📟 Trạm Tự Động Địa Phương (AWS)</option>
                    <option value="VNA_TELEMETRY">📡 Trạm Telemetry Dã chiến</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Tỉnh / Thành phố</label>
                  <select
                    value={editingStation.province || 'Lào Cai'}
                    onChange={(e) => setEditingStation({ ...editingStation, province: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Lào Cai">Lào Cai</option>
                    <option value="Yên Bái">Yên Bái</option>
                    <option value="Hà Giang">Hà Giang</option>
                    <option value="Cao Bằng">Cao Bằng</option>
                    <option value="Lai Châu">Lai Châu</option>
                    <option value="Điện Biên">Điện Biên</option>
                    <option value="Sơn La">Sơn La</option>
                    <option value="Tuyên Quang">Tuyên Quang</option>
                    <option value="Bắc Kạn">Bắc Kạn</option>
                    <option value="Lạng Sơn">Lạng Sơn</option>
                    <option value="Phú Thọ">Phú Thọ</option>
                    <option value="Hòa Bình">Hòa Bình</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Mã WMO Index (Tùy chọn)</label>
                  <input
                    type="text"
                    placeholder="VD: 48806"
                    value={editingStation.wmo_index || ''}
                    onChange={(e) => setEditingStation({ ...editingStation, wmo_index: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Đơn vị Quản lý / Mạng lưới</label>
                  <input
                    type="text"
                    placeholder="VD: Trung tâm KTTV Quốc gia"
                    value={editingStation.provider_network || ''}
                    onChange={(e) => setEditingStation({ ...editingStation, provider_network: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Trạng thái trạm</label>
                  <select
                    value={editingStation.status || 'ONLINE'}
                    onChange={(e) => setEditingStation({ ...editingStation, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="ONLINE">ONLINE (Hoạt động tốt)</option>
                    <option value="WARNING">WARNING (Cảnh báo pin/tín hiệu)</option>
                    <option value="OFFLINE">OFFLINE (Bảo dưỡng)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Dung lượng Pin (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingStation.battery_level || 100}
                    onChange={(e) => setEditingStation({ ...editingStation, battery_level: parseInt(e.target.value, 10) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowStationModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow"
                >
                  Lưu Trạm Quan trắc
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE EMERGENCY DISPATCH */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-400" />
                <span>Soạn thảo Công điện / Bản tin Cảnh báo Khẩn cấp</span>
              </h3>
              <button
                onClick={() => setShowDispatchModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDispatch} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Số hiệu Công điện</label>
                  <input
                    type="text"
                    required
                    value={newDispatch.dispatch_number || ''}
                    onChange={(e) => setNewDispatch({ ...newDispatch, dispatch_number: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Mức độ Khẩn</label>
                  <select
                    value={newDispatch.urgency_level || 'KHAN'}
                    onChange={(e) => setNewDispatch({ ...newDispatch, urgency_level: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
                  >
                    <option value="HOA_TOC">HỎA TỐC (Cấp 5 - Khẩn cấp cực kỳ nguy hiểm)</option>
                    <option value="KHAN">KHẨN (Cấp 4 - Nguy cơ rất lớn)</option>
                    <option value="THUONG">THƯỜNG (Cấp 2-3 - Cảnh báo chủ động)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Tiêu đề Công điện</label>
                <input
                  type="text"
                  required
                  value={newDispatch.title || ''}
                  onChange={(e) => setNewDispatch({ ...newDispatch, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Nội dung chỉ đạo ứng phó</label>
                <textarea
                  rows={4}
                  required
                  value={newDispatch.content || ''}
                  onChange={(e) => setNewDispatch({ ...newDispatch, content: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Chỉ dẫn Sơ tán & Bảo vệ Nhân dân</label>
                <input
                  type="text"
                  required
                  value={newDispatch.evacuation_instructions || ''}
                  onChange={(e) => setNewDispatch({ ...newDispatch, evacuation_instructions: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-rose-300 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Nội dung Tin nhắn SMS Broadcast gửi người dân (Không dấu)</label>
                <textarea
                  rows={2}
                  required
                  value={newDispatch.sms_broadcast_text || ''}
                  onChange={(e) => setNewDispatch({ ...newDispatch, sms_broadcast_text: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-300 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold shadow"
                >
                  Lưu & Phê duyệt Công điện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT ZONE */}
      {showZoneModal && editingZone && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span>Hiệu chỉnh Thông số Địa bàn: {editingZone.zone_name}</span>
              </h3>
              <button
                onClick={() => {
                  setShowZoneModal(false);
                  setEditingZone(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveZone} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Dân số dễ bị tổn thương (người)</label>
                <input
                  type="number"
                  required
                  value={editingZone.vulnerable_population || 0}
                  onChange={(e) => setEditingZone({ ...editingZone, vulnerable_population: parseInt(e.target.value, 10) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Độ dốc sườn đồi (°)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editingZone.slope || 0}
                    onChange={(e) => setEditingZone({ ...editingZone, slope: parseFloat(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Độ nhạy Địa chất</label>
                  <select
                    value={editingZone.geology_sensitivity || 'HIGH'}
                    onChange={(e) => setEditingZone({ ...editingZone, geology_sensitivity: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="LOW">LOW (Thấp)</option>
                    <option value="MEDIUM">MEDIUM (Trung bình)</option>
                    <option value="HIGH">HIGH (Cao)</option>
                    <option value="VERY_HIGH">VERY_HIGH (Rất cao)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowZoneModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold shadow"
                >
                  Cập nhật Địa bàn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL: ADD / EDIT NAVIGATION MENU ITEM */}
      {editingMenuItem.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-cyan-400" />
                <span>
                  {editingMenuItem.item.id
                    ? `Chỉnh sửa ${editingMenuItem.isSubmenu ? 'Menu con' : 'Menu chính'}`
                    : `Thêm mới ${editingMenuItem.isSubmenu ? 'Menu con' : 'Menu chính'}`}
                </span>
              </h3>
              <button
                onClick={() => setEditingMenuItem({ isOpen: false, isSubmenu: false, item: {} })}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMenuItemModal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Tên mục Menu hiển thị *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Giám sát & Cảnh báo"
                  value={editingMenuItem.item.title || ''}
                  onChange={(e) =>
                    setEditingMenuItem({
                      ...editingMenuItem,
                      item: { ...editingMenuItem.item, title: e.target.value }
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Mục tiêu điều hướng (Target)</label>
                  <select
                    value={editingMenuItem.item.targetTab || 'HOME'}
                    onChange={(e) =>
                      setEditingMenuItem({
                        ...editingMenuItem,
                        item: { ...editingMenuItem.item, targetTab: e.target.value }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="HOME">Trang chủ (HOME)</option>
                    <option value="MAP">Bản đồ Nguy cơ (MAP)</option>
                    <option value="ALERTS">Cảnh báo Khẩn (ALERTS)</option>
                    <option value="SENSORS">Trạm Quan trắc (SENSORS)</option>
                    <option value="SHELTERS">Điểm Sơ tán (SHELTERS)</option>
                    <option value="TYPHOON_MODAL">Bão Biển Đông (TYPHOON)</option>
                    <option value="EARTHQUAKE_MODAL">Động đất & Sóng thần (EARTHQUAKE)</option>
                    <option value="WAR_ROOM">Bản đồ Tác chiến (WAR_ROOM)</option>
                    <option value="GUIDE">Cẩm nang An toàn (GUIDE)</option>
                    <option value="NEWS">Bản tin KTTV (NEWS)</option>
                    <option value="CONTACT">Liên hệ / Hotline (CONTACT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Badge phụ (Tùy chọn)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 3, Mới, HOT"
                    value={editingMenuItem.item.badge || ''}
                    onChange={(e) =>
                      setEditingMenuItem({
                        ...editingMenuItem,
                        item: { ...editingMenuItem.item, badge: e.target.value }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="chk-menu-enabled"
                  checked={editingMenuItem.item.enabled !== false}
                  onChange={(e) =>
                    setEditingMenuItem({
                      ...editingMenuItem,
                      item: { ...editingMenuItem.item, enabled: e.target.checked }
                    })
                  }
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-600 focus:ring-cyan-500"
                />
                <label htmlFor="chk-menu-enabled" className="text-xs font-semibold text-slate-300 cursor-pointer">
                  Kích hoạt hiển thị mục menu này ngay trên Cổng thông tin
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingMenuItem({ isOpen: false, isSubmenu: false, item: {} })}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shadow-lg"
                >
                  Lưu mục Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
