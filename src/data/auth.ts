export type UserRole = 'COMMANDER' | 'HYDRO_SPECIALIST' | 'TELEMETRY_ENGINEER' | 'LOCAL_OFFICER' | 'ADMIN';

export interface AuthSession {
  user: {
    id: string;
    username: string;
    full_name: string;
    role: UserRole;
    role_label: string;
    department: string;
    email: string;
    permissions: string[];
  } | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, { label: string; badgeColor: string; description: string; permissions: string[] }> = {
  COMMANDER: {
    label: 'Chỉ huy trưởng Ban PCTT & TKCN',
    badgeColor: 'bg-rose-900/60 text-rose-300 border-rose-600',
    description: 'Toàn quyền ra lệnh sơ tán dân cư Cấp 5, duyệt công điện hỏa tốc, phát sóng SMS/Loa/Zalo diện rộng.',
    permissions: ['VIEW_GIS', 'TRIGGER_EVACUATION', 'DISPATCH_BROADCAST', 'OVERRIDE_AI', 'EDIT_THRESHOLDS', 'MANAGE_STATIONS', 'VIEW_AUDIT_LOGS', 'MANAGE_USERS']
  },
  HYDRO_SPECIALIST: {
    label: 'Chuyên gia Dự báo KTTV & AI',
    badgeColor: 'bg-indigo-900/60 text-indigo-300 border-indigo-600',
    description: 'Phân tích viễn thám Earth AI, thủy đồ LSTM, radar Nowcasting, hiệu chỉnh trọng số vật lý & ngưỡng mưa.',
    permissions: ['VIEW_GIS', 'VIEW_EARTH_AI', 'VIEW_LSTM', 'VIEW_RADAR', 'EDIT_THRESHOLDS', 'RUN_SIMULATION']
  },
  TELEMETRY_ENGINEER: {
    label: 'Kỹ sư Viễn thám & Mạng IoT',
    badgeColor: 'bg-emerald-900/60 text-emerald-300 border-emerald-600',
    description: 'Giám sát trạm đo mưa VNA/VNMHA, hiệu chuẩn cảm biến Tipping Bucket, kiểm soát chất lượng dữ liệu (DQ Engine).',
    permissions: ['VIEW_GIS', 'MANAGE_STATIONS', 'DATA_QUALITY_AUDIT', 'OBSERVABILITY']
  },
  LOCAL_OFFICER: {
    label: 'Cán bộ Chỉ huy Địa phương (Tỉnh/Xã)',
    badgeColor: 'bg-amber-900/60 text-amber-300 border-amber-600',
    description: 'Tiếp nhận lệnh ứng cứu tại chỗ, báo cáo thực địa xã/bản, kích hoạt lực lượng xung kích PCTT cơ sở.',
    permissions: ['VIEW_GIS', 'REPORT_DISASTER', 'VIEW_DISPATCHES']
  },
  ADMIN: {
    label: 'Quản trị viên Hệ thống Toàn diện',
    badgeColor: 'bg-purple-900/60 text-purple-300 border-purple-600',
    description: 'Quản trị phân quyền tài khoản, phân phối máy chủ, giám sát an toàn hệ thống và nhật ký kiểm toán.',
    permissions: ['VIEW_GIS', 'TRIGGER_EVACUATION', 'DISPATCH_BROADCAST', 'OVERRIDE_AI', 'EDIT_THRESHOLDS', 'MANAGE_STATIONS', 'VIEW_AUDIT_LOGS', 'MANAGE_USERS', 'OBSERVABILITY']
  }
};

export const DEMO_ACCOUNTS = [
  {
    username: 'commander.pctt',
    password: '123',
    full_name: 'Đại tá Nguyễn Văn Anh',
    role: 'COMMANDER' as UserRole,
    role_label: 'Chỉ huy trưởng Ban PCTT Quốc Gia',
    department: 'Cục Quản lý Đê điều & PCTT',
    email: 'anh.nv@pctt.gov.vn'
  },
  {
    username: 'expert.hydro',
    password: '123',
    full_name: 'TS. Trần Thị Bình',
    role: 'HYDRO_SPECIALIST' as UserRole,
    role_label: 'Chuyên gia Trưởng KTTV & AI',
    department: 'Viện Khoa học Khí tượng Thủy văn',
    email: 'binh.tt@kttv.gov.vn'
  },
  {
    username: 'engineer.iot',
    password: '123',
    full_name: 'Kỹ sư Lê Quang Cường',
    role: 'TELEMETRY_ENGINEER' as UserRole,
    role_label: 'Kỹ sư Mạng lưới Trạm Viễn thám',
    department: 'Trung tâm Dữ liệu IoT Quốc Gia',
    email: 'cuong.lq@telemetry.vn'
  },
  {
    username: 'officer.laocai',
    password: '123',
    full_name: 'Hoàng Văn Minh',
    role: 'LOCAL_OFFICER' as UserRole,
    role_label: 'Trực ban PCTT Tỉnh Lào Cai',
    department: 'Ban Chỉ huy PCTT Tỉnh Lào Cai',
    email: 'minh.hv@laocai.gov.vn'
  },
  {
    username: 'admin.haews',
    password: '123',
    full_name: 'Ban Quản trị Kỹ thuật HAEWS',
    role: 'ADMIN' as UserRole,
    role_label: 'Quản trị viên Hệ thống Toàn diện',
    department: 'Trung tâm Hạ tầng Số & An ninh Mạng',
    email: 'admin@haews.vn'
  }
];
