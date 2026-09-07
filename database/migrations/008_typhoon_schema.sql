-- =============================================
-- HAEWS v3.0 — Migration 008: Typhoon Schema
-- Storms, track points, model forecasts, impact zones, cross-border reservoirs
-- =============================================

-- ========================
-- Typhoon Storms (cơn bão & ATNĐ)
-- ========================
CREATE TABLE IF NOT EXISTS typhoon.storms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  storm_code VARCHAR(30) UNIQUE NOT NULL, -- e.g. "TY-2024-03"
  
  international_name VARCHAR(50), -- e.g. "YAGI"
  vietnam_number VARCHAR(50), -- e.g. "Bão số 3 (2024)"
  season_year INTEGER,
  is_historical BOOLEAN DEFAULT FALSE,
  
  -- Current State
  status typhoon_status_enum DEFAULT 'ACTIVE_DANGEROUS',
  current_category typhoon_intensity_enum,
  current_category_label VARCHAR(100),
  
  -- Current Position
  current_lat NUMERIC(10,7),
  current_lng NUMERIC(10,7),
  current_point GEOMETRY(Point, 4326),
  
  -- Current Metrics
  current_wind_speed_kmh NUMERIC(6,2),
  current_wind_gust_kmh NUMERIC(6,2),
  current_pressure_hpa NUMERIC(7,2),
  beaufort_scale_str VARCHAR(100),
  
  -- Movement
  moving_direction VARCHAR(100),
  moving_speed_kmh NUMERIC(6,2),
  distance_to_mainland_km NUMERIC(8,2),
  
  -- Landfall
  estimated_landfall_time TIMESTAMPTZ,
  estimated_landfall_area VARCHAR(200),
  
  -- Wave & Surge
  sea_wave_height_m VARCHAR(50),
  storm_surge_height_m VARCHAR(50),
  
  -- Cone of Uncertainty
  cone_of_uncertainty GEOMETRY(Polygon, 4326),
  
  -- Impact
  coastal_danger_zones TEXT[],
  
  -- Bulletin
  synoptic_summary TEXT,
  official_bulletin_number VARCHAR(50),
  issuer VARCHAR(200),
  safety_instructions TEXT[],
  
  last_updated_time TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Typhoon Track Points (quỹ đạo bão)
-- ========================
CREATE TABLE IF NOT EXISTS typhoon.track_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  storm_id UUID NOT NULL REFERENCES typhoon.storms(id) ON DELETE CASCADE,
  
  point_time TIMESTAMPTZ NOT NULL,
  time_display VARCHAR(50),
  
  -- Position
  latitude NUMERIC(10,7) NOT NULL,
  longitude NUMERIC(10,7) NOT NULL,
  track_point GEOMETRY(Point, 4326),
  
  -- Intensity
  intensity typhoon_intensity_enum,
  intensity_label_vn VARCHAR(100),
  wind_speed_kmh NUMERIC(6,2),
  wind_speed_kts NUMERIC(6,2),
  wind_gust_kmh NUMERIC(6,2),
  beaufort_level VARCHAR(100),
  central_pressure_hpa NUMERIC(7,2),
  
  -- Movement
  moving_direction VARCHAR(100),
  moving_speed_kmh NUMERIC(6,2),
  
  -- Wind Radii
  radius_gale_km_lv6 NUMERIC(6,2),
  radius_storm_km_lv10 NUMERIC(6,2),
  radius_destructive_km_lv12 NUMERIC(6,2),
  
  -- Classification
  is_forecast BOOLEAN DEFAULT FALSE,
  forecast_agency VARCHAR(30), -- NCHMF_VIETNAM, JTWC_USA, JMA_JAPAN, ECMWF_EUROPE, CONSENSUS
  
  distance_to_vietnam_coast_km NUMERIC(8,2),
  
  point_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Multi-Model Forecast Comparison
-- ========================
CREATE TABLE IF NOT EXISTS typhoon.model_forecasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  storm_id UUID NOT NULL REFERENCES typhoon.storms(id) ON DELETE CASCADE,
  
  agency_id VARCHAR(20) NOT NULL, -- NCHMF, JTWC, JMA, ECMWF
  agency_name VARCHAR(100) NOT NULL,
  country VARCHAR(50),
  
  last_run_time TIMESTAMPTZ,
  
  -- Predicted Landfall
  predicted_landfall_time TIMESTAMPTZ,
  predicted_landfall_location VARCHAR(200),
  predicted_landfall_intensity VARCHAR(100),
  
  -- Track forecast points
  forecast_points JSONB DEFAULT '[]', -- Array of {hour_offset, coords, wind_speed, pressure}
  
  -- Track geometry
  forecast_track_geom GEOMETRY(LineString, 4326),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Typhoon Impact Zones
-- ========================
CREATE TABLE IF NOT EXISTS typhoon.impact_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  storm_id UUID NOT NULL REFERENCES typhoon.storms(id) ON DELETE CASCADE,
  
  province VARCHAR(100) NOT NULL,
  expected_rainfall_mm VARCHAR(50),
  landslide_flashflood_risk VARCHAR(20), -- EXTREME, VERY_HIGH, HIGH, MODERATE
  key_districts TEXT[],
  
  -- Impact metrics
  estimated_affected_population INTEGER,
  estimated_damage_billion_vnd NUMERIC(12,2),
  
  impact_geom GEOMETRY(Polygon, 4326),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Cross-Border Reservoirs (hồ chứa xuyên biên giới)
-- ========================
CREATE TABLE IF NOT EXISTS typhoon.cross_border_reservoirs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservoir_code VARCHAR(30) UNIQUE NOT NULL,
  reservoir_name VARCHAR(200) NOT NULL,
  
  country VARCHAR(30) NOT NULL, -- CHINA, LAOS, CAMBODIA
  river_system VARCHAR(50), -- RED_RIVER_BASIN, MEKONG_BASIN, MA_CA_RIVER_BASIN
  location_name VARCHAR(200),
  
  -- Position
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  location_point GEOMETRY(Point, 4326),
  
  -- Capacity
  capacity_million_m3 NUMERIC(12,2),
  max_water_level_m NUMERIC(8,2),
  
  -- Current State
  current_water_level_m NUMERIC(8,3),
  current_discharge_m3s NUMERIC(10,3),
  discharge_status VARCHAR(30) DEFAULT 'NORMAL', -- NORMAL, WARNING_INCREASING, EMERGENCY_SPILLWAY
  
  -- Impact
  flow_travel_time_to_vietnam_hours NUMERIC(6,2),
  downstream_vietnam_entry_point VARCHAR(200),
  impact_risk VARCHAR(20) DEFAULT 'LOW', -- CRITICAL, HIGH, MEDIUM, LOW
  
  last_notified_time TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Transboundary Basin Overview
-- ========================
CREATE TABLE IF NOT EXISTS typhoon.transboundary_basin_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  basin_name VARCHAR(100) UNIQUE NOT NULL, -- RED_RIVER, MEKONG, MA_CA
  
  total_upstream_stations INTEGER DEFAULT 0,
  online_stations INTEGER DEFAULT 0,
  total_monitored_reservoirs INTEGER DEFAULT 0,
  emergency_spillway_reservoirs INTEGER DEFAULT 0,
  
  inflow_m3s NUMERIC(10,3),
  flood_trend VARCHAR(30) DEFAULT 'STABLE', -- RISING_RAPIDLY, STABLE, RECEDING
  
  -- International Protocols
  protocols JSONB DEFAULT '[]',
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default basin status
INSERT INTO typhoon.transboundary_basin_status (basin_name, total_upstream_stations, total_monitored_reservoirs) VALUES
  ('RED_RIVER', 12, 8),
  ('MEKONG', 15, 12),
  ('MA_CA', 6, 4)
ON CONFLICT (basin_name) DO NOTHING;

-- ========================
-- Earthquake Events
-- ========================
CREATE TABLE IF NOT EXISTS typhoon.earthquake_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  source VARCHAR(30) NOT NULL, -- VAST_IGP, USGS, GFZ, JMA, SIMULATED_TEST
  event_code VARCHAR(50) UNIQUE NOT NULL,
  
  event_time TIMESTAMPTZ NOT NULL,
  magnitude NUMERIC(4,2) NOT NULL,
  depth_km NUMERIC(6,2),
  
  latitude NUMERIC(10,7) NOT NULL,
  longitude NUMERIC(10,7) NOT NULL,
  epicenter_point GEOMETRY(Point, 4326),
  
  location_name VARCHAR(200),
  province VARCHAR(100),
  intensity_mmi VARCHAR(50),
  
  p_wave_radius_km NUMERIC(8,2),
  s_wave_radius_km NUMERIC(8,2),
  
  alert_level earthquake_alert_enum DEFAULT 'GREEN',
  aftershock_probability NUMERIC(5,2),
  tsunami_potential BOOLEAN DEFAULT FALSE,
  
  affected_districts TEXT[],
  fault_system VARCHAR(200),
  felt_reports_count INTEGER DEFAULT 0,
  
  guidance_summary TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Tsunami Alerts
-- ========================
CREATE TABLE IF NOT EXISTS typhoon.tsunami_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  bulletin_no VARCHAR(50) UNIQUE NOT NULL,
  earthquake_id UUID REFERENCES typhoon.earthquake_events(id),
  
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source VARCHAR(30), -- IGP_VIETNAM, PTWC_PACIFIC, NWPTAC_JMA, SIMULATED_MODEL
  
  epicenter_location VARCHAR(200),
  earthquake_magnitude NUMERIC(4,2),
  threat_level tsunami_threat_enum DEFAULT 'NO_THREAT',
  
  is_active BOOLEAN DEFAULT TRUE,
  affected_coastal_provinces TEXT[],
  
  -- Coastal forecasts stored as JSONB
  forecasts JSONB DEFAULT '[]',
  
  evacuation_order TEXT,
  propagation_map_available BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
