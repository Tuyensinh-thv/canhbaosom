-- =============================================
-- HAEWS v3.0 — Migration 009: Auth Extended Schema
-- User profiles, roles, permissions, audit logs, sessions
-- =============================================

-- ========================
-- User Profiles (mở rộng Supabase Auth)
-- ========================
CREATE TABLE IF NOT EXISTS auth_ext.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- auth_user_id UUID UNIQUE, -- Link to Supabase auth.users if available
  
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(200),
  phone VARCHAR(20),
  avatar_url TEXT,
  
  -- Role & Organization
  role user_role_enum NOT NULL DEFAULT 'VIEWER',
  role_label VARCHAR(100),
  department VARCHAR(200),
  position_title VARCHAR(200),
  
  -- Assignment
  assigned_province VARCHAR(100),
  assigned_district VARCHAR(100),
  assigned_zone_ids UUID[],
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  shift_status VARCHAR(20) DEFAULT 'OFF_DUTY', -- ON_DUTY, OFF_DUTY, STANDBY
  last_login_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ,
  
  -- Security
  password_hash TEXT, -- bcrypt hash
  failed_login_count INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  
  -- Preferences
  preferences JSONB DEFAULT '{}',
  notification_channels broadcast_channel_enum[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default users
INSERT INTO auth_ext.user_profiles (username, full_name, role, role_label, department, phone, email, shift_status, password_hash, is_active) VALUES
  ('admin', 'Quản trị viên Hệ thống', 'SUPER_ADMIN', 'Quản trị viên', 'Trung tâm CNTT', '0912000001', 'admin@haews.vn', 'ON_DUTY',
   crypt('admin123', gen_salt('bf')), TRUE),
  ('commander_lc', 'Nguyễn Trần Quốc Toản', 'PROVINCE_COMMANDER', 'Trưởng Ban PCTT Tỉnh', 'Ban Chỉ huy PCTT & TKCN Tỉnh Lào Cai', '0912000002', 'toan.nguyen@laocai.gov.vn', 'ON_DUTY',
   crypt('cmd123', gen_salt('bf')), TRUE),
  ('operator_binh', 'Trần Thị Bình', 'OPERATION_OFFICER', 'Chuyên gia Thủy văn', 'Phòng Dự báo KTTV', '0912000003', 'binh.tran@kttv.gov.vn', 'ON_DUTY',
   crypt('op123', gen_salt('bf')), TRUE),
  ('field_hung', 'Lê Quang Cường', 'COMMUNE_FIELD_OFFICER', 'Cán bộ PCTT Xã', 'UBND Xã Phúc Khánh', '0912000004', 'cuong.le@phuckhanh.gov.vn', 'STANDBY',
   crypt('field123', gen_salt('bf')), TRUE),
  ('rescue_alpha', 'Đại úy Phạm Văn Mạnh', 'RESCUE_TEAM', 'Chỉ huy Đội CNCH', 'Đội CNCH Quân khu 2', '0912000005', 'manh.pham@qk2.mil.vn', 'STANDBY',
   crypt('rescue123', gen_salt('bf')), TRUE),
  ('viewer_public', 'Người xem công khai', 'VIEWER', 'Người xem', 'Công chúng', '0912000006', 'viewer@haews.vn', 'OFF_DUTY',
   crypt('view123', gen_salt('bf')), TRUE)
ON CONFLICT (username) DO NOTHING;

-- ========================
-- Role Permissions
-- ========================
CREATE TABLE IF NOT EXISTS auth_ext.role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role user_role_enum NOT NULL,
  
  permission_code VARCHAR(100) NOT NULL,
  permission_name VARCHAR(200) NOT NULL,
  
  -- Scope
  resource_type VARCHAR(50), -- INCIDENT, ALERT, ZONE, STATION, TEAM, REPORT, SYSTEM
  allowed_actions TEXT[], -- CREATE, READ, UPDATE, DELETE, APPROVE, DISPATCH, OVERRIDE
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(role, permission_code)
);

-- Insert default permissions
INSERT INTO auth_ext.role_permissions (role, permission_code, permission_name, resource_type, allowed_actions) VALUES
  -- SUPER_ADMIN: Full access
  ('SUPER_ADMIN', 'FULL_ACCESS', 'Toàn quyền hệ thống', NULL, ARRAY['CREATE','READ','UPDATE','DELETE','APPROVE','DISPATCH','OVERRIDE']),
  
  -- PROVINCE_COMMANDER
  ('PROVINCE_COMMANDER', 'INCIDENT_MANAGE', 'Quản lý sự cố', 'INCIDENT', ARRAY['CREATE','READ','UPDATE','APPROVE']),
  ('PROVINCE_COMMANDER', 'ALERT_APPROVE', 'Phê duyệt cảnh báo cấp 4-5', 'ALERT', ARRAY['READ','APPROVE','DISPATCH']),
  ('PROVINCE_COMMANDER', 'ORDER_ISSUE', 'Ban hành lệnh tác chiến', 'TACTICAL_ORDER', ARRAY['CREATE','READ','APPROVE']),
  ('PROVINCE_COMMANDER', 'TEAM_DISPATCH', 'Điều động lực lượng', 'TEAM', ARRAY['READ','UPDATE','DISPATCH']),
  ('PROVINCE_COMMANDER', 'ZONE_OVERRIDE', 'Override cảnh báo AI', 'ZONE', ARRAY['READ','UPDATE','OVERRIDE']),
  
  -- OPERATION_OFFICER
  ('OPERATION_OFFICER', 'STATION_MANAGE', 'Quản lý trạm quan trắc', 'STATION', ARRAY['CREATE','READ','UPDATE']),
  ('OPERATION_OFFICER', 'THRESHOLD_UPDATE', 'Điều chỉnh ngưỡng cảnh báo', 'THRESHOLD', ARRAY['READ','UPDATE']),
  ('OPERATION_OFFICER', 'ALERT_DRAFT', 'Soạn thảo cảnh báo', 'ALERT', ARRAY['CREATE','READ','UPDATE']),
  ('OPERATION_OFFICER', 'REPORT_CREATE', 'Tạo báo cáo tình huống', 'REPORT', ARRAY['CREATE','READ','UPDATE']),
  
  -- COMMUNE_FIELD_OFFICER
  ('COMMUNE_FIELD_OFFICER', 'TASK_UPDATE', 'Cập nhật nhiệm vụ hiện trường', 'TASK', ARRAY['READ','UPDATE']),
  ('COMMUNE_FIELD_OFFICER', 'CITIZEN_REPORT', 'Tiếp nhận báo cáo công dân', 'CITIZEN_REPORT', ARRAY['CREATE','READ']),
  ('COMMUNE_FIELD_OFFICER', 'SHELTER_UPDATE', 'Cập nhật tình trạng điểm sơ tán', 'SHELTER', ARRAY['READ','UPDATE']),
  
  -- RESCUE_TEAM
  ('RESCUE_TEAM', 'TASK_EXECUTE', 'Thực hiện nhiệm vụ CNCH', 'TASK', ARRAY['READ','UPDATE']),
  ('RESCUE_TEAM', 'GPS_REPORT', 'Báo cáo vị trí GPS', 'GPS', ARRAY['CREATE','READ']),
  
  -- VIEWER
  ('VIEWER', 'PUBLIC_VIEW', 'Xem bản đồ công khai', 'PUBLIC', ARRAY['READ'])
ON CONFLICT (role, permission_code) DO NOTHING;

-- ========================
-- Audit Logs (nhật ký kiểm toán)
-- ========================
CREATE TABLE IF NOT EXISTS auth_ext.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Who
  user_id UUID,
  user_name VARCHAR(200),
  user_role VARCHAR(50),
  
  -- What
  action_type VARCHAR(50) NOT NULL,
  -- UPDATE_THRESHOLD, ADD_STATION, EDIT_STATION, DELETE_STATION,
  -- DISPATCH_EMERGENCY, ZONE_OVERRIDE, SYSTEM_CONFIG,
  -- LOGIN, LOGOUT, APPROVE_ALERT, ISSUE_ORDER, ASSIGN_TASK
  
  target_type VARCHAR(50), -- STATION, ZONE, THRESHOLD, DISPATCH, INCIDENT, ORDER, SYSTEM
  target_id UUID,
  target_name VARCHAR(200),
  
  -- Details
  description TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  
  -- Context
  ip_address VARCHAR(45),
  user_agent TEXT,
  session_id VARCHAR(100),
  
  -- Severity
  severity VARCHAR(20) DEFAULT 'INFO', -- INFO, WARNING, CRITICAL, SECURITY
  
  -- Immutable timestamp
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Do NOT allow updates or deletes on audit logs
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Active Sessions
-- ========================
CREATE TABLE IF NOT EXISTS auth_ext.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth_ext.user_profiles(id) ON DELETE CASCADE,
  
  session_token TEXT UNIQUE NOT NULL,
  
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_type VARCHAR(30), -- DESKTOP, MOBILE, TABLET
  
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Notification Preferences
-- ========================
CREATE TABLE IF NOT EXISTS auth_ext.notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth_ext.user_profiles(id) ON DELETE CASCADE,
  
  -- What to receive
  min_alert_level INTEGER DEFAULT 3, -- Only receive alerts >= this level
  hazard_types risk_type_enum[], -- Filter by hazard type
  provinces TEXT[], -- Filter by province
  
  -- How to receive
  enable_push BOOLEAN DEFAULT TRUE,
  enable_sms BOOLEAN DEFAULT TRUE,
  enable_email BOOLEAN DEFAULT FALSE,
  enable_sound BOOLEAN DEFAULT TRUE,
  
  -- Quiet Hours
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  override_for_level_5 BOOLEAN DEFAULT TRUE, -- Always notify for Level 5
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
