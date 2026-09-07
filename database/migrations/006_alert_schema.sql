-- =============================================
-- HAEWS v3.0 — Migration 006: Alert Schema
-- Warning events, alert dispatches, broadcasts, geofencing, citizen reports
-- =============================================

-- ========================
-- Warning Events (sự kiện cảnh báo)
-- ========================
CREATE TABLE IF NOT EXISTS alert.warning_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  zone_id UUID,
  zone_name VARCHAR(200),
  district_name VARCHAR(100),
  province_name VARCHAR(100),
  
  -- Warning Details
  risk_type risk_type_enum NOT NULL,
  risk_level INTEGER NOT NULL CHECK (risk_level BETWEEN 1 AND 5),
  risk_probability NUMERIC(5,4),
  model_confidence model_confidence_enum,
  
  -- Trigger
  trigger_type trigger_type_enum DEFAULT 'AI_MODEL',
  trigger_detail TEXT,
  
  -- Rainfall at time of warning
  rainfall_1h NUMERIC(8,2),
  rainfall_3h NUMERIC(8,2),
  rainfall_6h NUMERIC(8,2),
  rainfall_24h NUMERIC(8,2),
  
  -- Message
  warning_message TEXT NOT NULL,
  model_version VARCHAR(50),
  
  -- Status
  active BOOLEAN DEFAULT TRUE,
  evacuation_advised BOOLEAN DEFAULT FALSE,
  
  -- Linked incident
  incident_id UUID,
  
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancelled_by VARCHAR(200),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Alert Dispatches (công điện khẩn cấp)
-- ========================
CREATE TABLE IF NOT EXISTS alert.alert_dispatches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  dispatch_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. "09/CĐ-PCTT"
  title VARCHAR(500) NOT NULL,
  
  -- Authority
  issuer VARCHAR(200) NOT NULL,
  signer VARCHAR(200),
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Urgency
  urgency_level urgency_level_enum DEFAULT 'THUONG',
  risk_level INTEGER NOT NULL CHECK (risk_level BETWEEN 1 AND 5),
  
  -- Scope
  affected_provinces TEXT[],
  affected_districts TEXT[],
  affected_zones TEXT[],
  
  -- Content
  content TEXT NOT NULL,
  evacuation_instructions TEXT,
  sms_broadcast_text VARCHAR(500),
  
  -- Channels
  broadcast_channels broadcast_channel_enum[],
  
  -- Status
  status dispatch_status_enum DEFAULT 'DRAFT',
  recipients_count INTEGER DEFAULT 0,
  
  -- Linked
  incident_id UUID,
  warning_event_id UUID,
  
  -- Approval
  approved_by VARCHAR(200),
  approved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Broadcast Logs (log phát tin đa kênh)
-- ========================
CREATE TABLE IF NOT EXISTS alert.broadcast_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispatch_id UUID REFERENCES alert.alert_dispatches(id) ON DELETE CASCADE,
  
  channel broadcast_channel_enum NOT NULL,
  channel_label VARCHAR(100),
  
  -- Target
  target_zone_name VARCHAR(200),
  target_province VARCHAR(100),
  target_recipients_est INTEGER DEFAULT 0,
  
  -- Delivery
  successful_deliveries INTEGER DEFAULT 0,
  failed_deliveries INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'QUEUED', -- TRANSMITTING, COMPLETED, QUEUED, FAILED
  
  transmitted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  latency_ms INTEGER,
  
  -- Content
  sample_message TEXT,
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Broadcast Channel Status (trạng thái kênh phát)
-- ========================
CREATE TABLE IF NOT EXISTS alert.broadcast_channel_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  channel broadcast_channel_enum UNIQUE NOT NULL,
  channel_name VARCHAR(100) NOT NULL,
  
  -- Capacity
  total_subscribers INTEGER DEFAULT 0,
  online_devices INTEGER DEFAULT 0,
  coverage_percent NUMERIC(5,2) DEFAULT 0,
  
  -- Status
  is_ready BOOLEAN DEFAULT TRUE,
  last_test_at TIMESTAMPTZ,
  last_test_result VARCHAR(20),
  
  -- Config
  config JSONB DEFAULT '{}',
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default channel status
INSERT INTO alert.broadcast_channel_status (channel, channel_name, total_subscribers, online_devices, is_ready) VALUES
  ('CELL_BROADCAST', 'Cell Broadcast (BTS)', 0, 245, TRUE),
  ('SMS', 'SMS Broadcast', 125000, 0, TRUE),
  ('ZALO_OA', 'Zalo Official Account', 85000, 0, TRUE),
  ('EMERGENCY_SIREN', 'Còi báo động khẩn cấp', 0, 48, TRUE),
  ('COMMUNE_RADIO', 'Loa truyền thanh xã', 0, 3200, TRUE),
  ('TV_BROADCAST', 'Truyền hình VTV/TTXVN', 0, 0, TRUE),
  ('MOBILE_APP', 'Ứng dụng di động HAEWS', 15000, 0, TRUE),
  ('EMAIL', 'Email thông báo', 5000, 0, TRUE)
ON CONFLICT (channel) DO NOTHING;

-- ========================
-- Geofence Zones (vùng cảnh báo địa lý)
-- ========================
CREATE TABLE IF NOT EXISTS alert.geofence_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  geofence_name VARCHAR(200) NOT NULL,
  geofence_type VARCHAR(30) NOT NULL, -- DANGER_ZONE, EVACUATION_ZONE, MONITORING_ZONE, EXCLUSION_ZONE
  
  -- Geometry
  geom GEOMETRY(Polygon, 4326) NOT NULL,
  radius_km NUMERIC(8,2),
  center_lat NUMERIC(10,7),
  center_lng NUMERIC(10,7),
  
  -- Linked
  incident_id UUID,
  zone_id UUID,
  
  -- Alert config
  alert_message TEXT,
  alert_channels broadcast_channel_enum[],
  risk_level INTEGER CHECK (risk_level BETWEEN 1 AND 5),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  activated_at TIMESTAMPTZ DEFAULT NOW(),
  deactivated_at TIMESTAMPTZ,
  
  -- Activation rules
  auto_activate_on_level INTEGER, -- Auto-activate when zone reaches this risk level
  
  created_by VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Citizen Reports (báo cáo từ công dân)
-- ========================
CREATE TABLE IF NOT EXISTS alert.citizen_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Reporter
  reporter_name VARCHAR(200),
  reporter_phone VARCHAR(20),
  reporter_type VARCHAR(30), -- LOCAL_RESIDENT, COMMUNE_OFFICER, TOURIST, VOLUNTEER
  
  -- Location
  location_description TEXT,
  commune_name VARCHAR(150),
  district_name VARCHAR(100),
  province_name VARCHAR(100),
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  location_point GEOMETRY(Point, 4326),
  
  -- Report
  hazard_type risk_type_enum,
  severity_reported VARCHAR(20), -- MINOR, MODERATE, SEVERE, CRITICAL
  description TEXT NOT NULL,
  
  -- Evidence
  photo_urls TEXT[],
  video_urls TEXT[],
  audio_urls TEXT[],
  
  -- AI Processing
  ai_category VARCHAR(50), -- TURBID_WATER_SURGE, SLOPE_FISSURE, ROAD_WASHOUT, TORRENTIAL_RAIN, HOUSE_INUNDATION
  ai_confidence NUMERIC(5,2),
  ai_verified BOOLEAN DEFAULT FALSE,
  
  -- Verification
  verification_status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, VERIFIED, FALSE_POSITIVE, DUPLICATE
  verified_by VARCHAR(200),
  verified_at TIMESTAMPTZ,
  
  -- Linked
  matched_zone_id UUID,
  linked_incident_id UUID,
  
  -- Social media source
  social_platform VARCHAR(30), -- FACEBOOK, TIKTOK, ZALO, YOUTUBE, DIRECT
  social_post_url TEXT,
  
  reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Social Media Intelligence Clusters
-- ========================
CREATE TABLE IF NOT EXISTS alert.social_intel_clusters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  zone_id UUID,
  zone_name VARCHAR(200),
  province_name VARCHAR(100),
  
  total_reports INTEGER DEFAULT 0,
  dominant_hazard VARCHAR(100),
  urgency_score NUMERIC(5,2) DEFAULT 0,
  
  first_report_time TIMESTAMPTZ,
  latest_report_time TIMESTAMPTZ,
  
  key_evidence_summary TEXT,
  cross_validation_with_telemetry TEXT,
  suggested_commander_action TEXT,
  
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
