export interface NavigationMenuItem {
  id: string;
  title: string;
  targetTab?: string;
  url?: string;
  enabled: boolean;
  order: number;
  badge?: string;
  badgeColor?: 'red' | 'blue' | 'amber' | 'emerald';
  children?: NavigationMenuItem[];
}

export const DEFAULT_NAVIGATION_MENUS: NavigationMenuItem[] = [
  {
    id: 'nav-home',
    title: 'Trang chủ',
    targetTab: 'HOME',
    enabled: true,
    order: 1,
  },
  {
    id: 'nav-monitoring',
    title: 'Giám sát & Cảnh báo',
    targetTab: 'MAP',
    enabled: true,
    order: 2,
    children: [
      {
        id: 'nav-sub-map',
        title: 'Bản đồ Nguy cơ Thiên tai',
        targetTab: 'MAP',
        enabled: true,
        order: 1,
      },
      {
        id: 'nav-sub-alerts',
        title: 'Danh sách Cảnh báo Khẩn cấp',
        targetTab: 'ALERTS',
        badge: '3',
        badgeColor: 'red',
        enabled: true,
        order: 2,
      },
      {
        id: 'nav-sub-typhoon',
        title: 'Bão & Áp thấp Biển Đông',
        targetTab: 'TYPHOON_MODAL',
        enabled: true,
        order: 3,
      },
      {
        id: 'nav-sub-earthquake',
        title: 'Động đất & Sóng thần',
        targetTab: 'EARTHQUAKE_MODAL',
        enabled: true,
        order: 4,
      },
      {
        id: 'nav-sub-stations',
        title: 'Mạng lưới Trạm Đo mưa & KTTV',
        targetTab: 'SENSORS',
        enabled: true,
        order: 5,
      },
    ],
  },
  {
    id: 'nav-response',
    title: 'Sự cố & Ứng phó',
    targetTab: 'ALERTS',
    enabled: true,
    order: 3,
    children: [
      {
        id: 'nav-sub-incidents',
        title: 'Diễn biến Sự cố Hiện trường',
        targetTab: 'ALERTS',
        enabled: true,
        order: 1,
      },
      {
        id: 'nav-sub-shelters',
        title: 'Điểm Sơ tán & Tránh trú An toàn',
        targetTab: 'SHELTERS',
        enabled: true,
        order: 2,
      },
      {
        id: 'nav-sub-warroom',
        title: 'Trung tâm Chỉ huy Tác chiến (War Room)',
        targetTab: 'WAR_ROOM',
        badge: 'Chỉ huy',
        badgeColor: 'amber',
        enabled: true,
        order: 3,
      },
    ],
  },
  {
    id: 'nav-guide',
    title: 'Cẩm nang Phòng chống',
    targetTab: 'GUIDE',
    enabled: true,
    order: 4,
    children: [
      {
        id: 'nav-sub-guide-flood',
        title: 'Kỹ năng ứng phó Lũ quét & Sạt lở đất',
        targetTab: 'GUIDE',
        enabled: true,
        order: 1,
      },
      {
        id: 'nav-sub-guide-typhoon',
        title: 'Kỹ năng chủ động Phòng chống Bão',
        targetTab: 'GUIDE',
        enabled: true,
        order: 2,
      },
      {
        id: 'nav-sub-guide-lightning',
        title: 'Kỹ năng an toàn khi Giông sét',
        targetTab: 'GUIDE',
        enabled: true,
        order: 3,
      },
    ],
  },
  {
    id: 'nav-news',
    title: 'Bản tin KTTV',
    targetTab: 'NEWS',
    enabled: true,
    order: 5,
    children: [
      {
        id: 'nav-sub-news-bulletin',
        title: 'Bản tin Dự báo Khí tượng Thủy văn',
        targetTab: 'NEWS',
        enabled: true,
        order: 1,
      },
      {
        id: 'nav-sub-news-research',
        title: 'Nghiên cứu & Chuyển đổi số HVU',
        targetTab: 'NEWS',
        enabled: true,
        order: 2,
      },
    ],
  },
  {
    id: 'nav-contact',
    title: 'Liên hệ',
    targetTab: 'CONTACT',
    enabled: true,
    order: 6,
  },
];

const STORAGE_KEY = 'haews_navigation_menus_v3';

export function getSavedNavigationMenus(): NavigationMenuItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_NAVIGATION_MENUS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.warn('Error reading navigation menus from localStorage:', e);
  }
  return DEFAULT_NAVIGATION_MENUS;
}

export function saveNavigationMenus(menus: NavigationMenuItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(menus));
    window.dispatchEvent(new CustomEvent('haews-navigation-updated', { detail: menus }));
  } catch (e) {
    console.error('Error saving navigation menus to localStorage:', e);
  }
}

export function resetNavigationMenusToDefault(): NavigationMenuItem[] {
  saveNavigationMenus(DEFAULT_NAVIGATION_MENUS);
  return DEFAULT_NAVIGATION_MENUS;
}
