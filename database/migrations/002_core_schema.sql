-- =============================================
-- HAEWS v3.0 — Migration 002: Core Schema
-- Spatial zones, provinces, communes, basins, fault lines, thresholds
-- =============================================

-- ========================
-- Provinces (63 tỉnh/TP)
-- ========================
CREATE TABLE IF NOT EXISTS core.provinces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  province_code VARCHAR(10) UNIQUE NOT NULL,
  province_name VARCHAR(100) NOT NULL,
  region region_enum NOT NULL,
  area_km2 NUMERIC(10,2),
  population INTEGER,
  capital_city VARCHAR(100),
  warning_enabled BOOLEAN DEFAULT TRUE,
  total_zones INTEGER DEFAULT 0,
  total_stations INTEGER DEFAULT 0,
  note TEXT,
  geom GEOMETRY(MultiPolygon, 4326),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by VARCHAR(100)
);

-- ========================
-- Districts (quận/huyện)
-- ========================
CREATE TABLE IF NOT EXISTS core.districts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  district_code VARCHAR(10) UNIQUE NOT NULL,
  district_name VARCHAR(100) NOT NULL,
  province_id UUID REFERENCES core.provinces(id) ON DELETE CASCADE,
  province_name VARCHAR(100),
  region region_enum,
  area_km2 NUMERIC(10,2),
  population INTEGER,
  geom GEOMETRY(MultiPolygon, 4326),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Communes (xã/phường/TT)
-- ========================
CREATE TABLE IF NOT EXISTS core.communes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commune_code VARCHAR(10) UNIQUE NOT NULL,
  commune_name VARCHAR(150) NOT NULL,
  district_id UUID REFERENCES core.districts(id) ON DELETE CASCADE,
  district_name VARCHAR(100),
  province_name VARCHAR(100),
  region region_enum,
  commune_type VARCHAR(20) DEFAULT 'XA', -- XA, PHUONG, THI_TRAN
  area_km2 NUMERIC(10,2),
  population INTEGER,
  elevation_avg_m NUMERIC(8,2),
  geom GEOMETRY(MultiPolygon, 4326),
  centroid GEOMETRY(Point, 4326),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- River Basins (lưu vực sông)
-- ========================
CREATE TABLE IF NOT EXISTS core.basins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  basin_code VARCHAR(20) UNIQUE NOT NULL,
  basin_name VARCHAR(150) NOT NULL,
  basin_name_en VARCHAR(150),
  river_system VARCHAR(100), -- RED_RIVER, MEKONG, MA_CA, DONG_NAI, etc.
  area_km2 NUMERIC(12,2),
  main_river_length_km NUMERIC(8,2),
  avg_gradient_percent NUMERIC(6,3),
  countries TEXT[], -- {'VIETNAM', 'CHINA', 'LAOS'}
  description TEXT,
  geom GEOMETRY(MultiPolygon, 4326),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Spatial Warning Zones (vùng cảnh báo)
-- ========================
CREATE TABLE IF NOT EXISTS core.spatial_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_code VARCHAR(30) UNIQUE NOT NULL,
  zone_name VARCHAR(200) NOT NULL,
  district_name VARCHAR(100),
  province_name VARCHAR(100),
  region region_enum,
  
  -- Geography
  center_lat NUMERIC(10,7),
  center_lng NUMERIC(10,7),
  center_point GEOMETRY(Point, 4326),
  elevation NUMERIC(8,2) DEFAULT 0, -- meters
  slope NUMERIC(6,2) DEFAULT 0, -- degrees
  aspect VARCHAR(10), -- N, NE, E, SE, S, SW, W, NW
  
  -- Geology & Soil
  soil_type VARCHAR(100),
  geology_sensitivity geology_sensitivity_enum DEFAULT 'MEDIUM',
  
  -- Hydrology
  basin_id UUID REFERENCES core.basins(id),
  basin_name VARCHAR(150),
  basin_area_km2 NUMERIC(10,2),
  channel_gradient NUMERIC(6,3) DEFAULT 0, -- %
  
  -- Population & Infrastructure
  vulnerable_population INTEGER DEFAULT 0,
  total_households INTEGER DEFAULT 0,
  critical_facilities TEXT[],
  
  -- Control
  warning_enabled BOOLEAN DEFAULT TRUE,
  monitoring_priority VARCHAR(20) DEFAULT 'NORMAL', -- CRITICAL, HIGH, NORMAL, LOW
  
  -- PostGIS polygon geometry (WGS84)
  geom GEOMETRY(Polygon, 4326),
  
  -- Foreign keys
  province_id UUID REFERENCES core.provinces(id),
  district_id UUID REFERENCES core.districts(id),
  commune_id UUID REFERENCES core.communes(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Fault Lines (đới đứt gãy kiến tạo)
-- ========================
CREATE TABLE IF NOT EXISTS core.fault_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fault_code VARCHAR(30) UNIQUE NOT NULL,
  fault_name VARCHAR(200) NOT NULL,
  fault_name_en VARCHAR(200),
  category VARCHAR(30) NOT NULL, -- STRIKE_SLIP, NORMAL, THRUST, SUBDUCTION_ZONE
  length_km NUMERIC(8,2),
  max_potential_magnitude NUMERIC(4,2),
  activity_level VARCHAR(20) DEFAULT 'MODERATE', -- VERY_ACTIVE, ACTIVE, MODERATE, LOW
  description TEXT,
  affected_provinces TEXT[],
  geom GEOMETRY(LineString, 4326),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Threshold Profiles (ngưỡng cảnh báo)
-- ========================
CREATE TABLE IF NOT EXISTS core.threshold_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  region_code VARCHAR(20) NOT NULL,
  region_name VARCHAR(100) NOT NULL,
  risk_type VARCHAR(20) NOT NULL, -- flash_flood, landslide
  
  -- Rainfall thresholds (mm)
  rainfall_1h_threshold NUMERIC(8,2) DEFAULT 0,
  rainfall_3h_threshold NUMERIC(8,2) DEFAULT 0,
  rainfall_6h_threshold NUMERIC(8,2) DEFAULT 0,
  rainfall_24h_threshold NUMERIC(8,2) DEFAULT 0,
  
  -- Soil
  soil_saturation_threshold NUMERIC(5,2), -- %
  
  -- Level & Status
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 5),
  source VARCHAR(100),
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(region_code, risk_type, level)
);

-- ========================
-- Data Ingestion Registry (đăng ký nguồn dữ liệu)
-- ========================
CREATE TABLE IF NOT EXISTS core.data_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_code VARCHAR(50) UNIQUE NOT NULL,
  source_name VARCHAR(200) NOT NULL,
  source_type VARCHAR(50) NOT NULL, -- SATELLITE, RADAR, IOT, SOCIAL_MEDIA, GIS, SEISMIC, MARITIME, TYPHOON, HISTORICAL, API
  provider VARCHAR(200),
  api_endpoint TEXT,
  data_format VARCHAR(50), -- JSON, GeoJSON, NetCDF, GRIB2, CSV, BUFR
  update_frequency VARCHAR(50), -- REALTIME, 5MIN, 15MIN, HOURLY, DAILY
  is_active BOOLEAN DEFAULT TRUE,
  last_sync_at TIMESTAMPTZ,
  total_records_ingested BIGINT DEFAULT 0,
  quality_score NUMERIC(5,2),
  description TEXT,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- System Configuration
-- ========================
CREATE TABLE IF NOT EXISTS core.system_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value TEXT NOT NULL,
  config_type VARCHAR(20) DEFAULT 'STRING', -- STRING, NUMBER, BOOLEAN, JSON
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by VARCHAR(100)
);

-- Insert default system config
INSERT INTO core.system_config (config_key, config_value, config_type, description) VALUES
  ('system_mode', 'REAL_TIME', 'STRING', 'Chế độ hoạt động hệ thống'),
  ('model_version', 'HAEWS-v3.0-hybrid', 'STRING', 'Phiên bản mô hình AI'),
  ('auto_alert_level', '3', 'NUMBER', 'Cấp cảnh báo tự động phát (không cần duyệt)'),
  ('human_approval_level', '4', 'NUMBER', 'Cấp cảnh báo yêu cầu duyệt thủ công'),
  ('data_retention_days', '365', 'NUMBER', 'Thời gian lưu trữ dữ liệu chi tiết (ngày)'),
  ('max_lead_time_hours', '6', 'NUMBER', 'Thời gian dự báo tối đa (giờ)'),
  ('default_region', 'BAC_BO', 'STRING', 'Vùng mặc định hiển thị')
ON CONFLICT (config_key) DO NOTHING;
