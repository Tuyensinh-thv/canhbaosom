-- =============================================
-- HAEWS v3.0 — Migration 003: Telemetry Schema
-- Rainfall stations, hydro stations, radar, satellite, IoT, camera
-- =============================================

-- ========================
-- Rainfall Stations (trạm đo mưa)
-- ========================
CREATE TABLE IF NOT EXISTS telemetry.rainfall_stations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  station_code VARCHAR(30) UNIQUE NOT NULL,
  station_name VARCHAR(200) NOT NULL,
  
  -- Location (PostGIS Point)
  latitude NUMERIC(10,7) NOT NULL,
  longitude NUMERIC(10,7) NOT NULL,
  elevation NUMERIC(8,2) DEFAULT 0,
  location_point GEOMETRY(Point, 4326),
  
  -- Status
  status station_status_enum DEFAULT 'ONLINE',
  source VARCHAR(50) NOT NULL, -- VNA_TELEMETRY, AUTOMATIC_RAIN_GAUGE, etc.
  country VARCHAR(30) DEFAULT 'VIETNAM',
  province VARCHAR(100),
  wmo_index VARCHAR(20),
  provider_network VARCHAR(100),
  
  -- Current Readings (cached latest values)
  last_reading_time TIMESTAMPTZ,
  current_rainfall_1h NUMERIC(8,2) DEFAULT 0,
  current_rainfall_3h NUMERIC(8,2) DEFAULT 0,
  current_rainfall_6h NUMERIC(8,2) DEFAULT 0,
  current_rainfall_24h NUMERIC(8,2) DEFAULT 0,
  quality_flag quality_flag_enum DEFAULT 'VALID',
  battery_level NUMERIC(5,2) DEFAULT 100,
  
  -- Extended Sensors
  discharge_m3s NUMERIC(10,3),
  water_level_m NUMERIC(8,3),
  upstream_basin VARCHAR(100),
  wind_speed_kmh NUMERIC(6,2),
  wind_direction VARCHAR(10),
  atmospheric_pressure_hpa NUMERIC(7,2),
  sea_temperature_c NUMERIC(5,2),
  wave_height_m NUMERIC(5,2),
  radar_reflectivity_dbz NUMERIC(6,2),
  
  -- Tags
  region_tag VARCHAR(30),
  zone_id UUID,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Rainfall Logs (time-series dữ liệu mưa)
-- ========================
CREATE TABLE IF NOT EXISTS telemetry.rainfall_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  station_id UUID NOT NULL REFERENCES telemetry.rainfall_stations(id) ON DELETE CASCADE,
  station_code VARCHAR(30) NOT NULL,
  
  recorded_at TIMESTAMPTZ NOT NULL,
  
  rainfall_1h NUMERIC(8,2) DEFAULT 0,
  rainfall_3h NUMERIC(8,2) DEFAULT 0,
  rainfall_6h NUMERIC(8,2) DEFAULT 0,
  rainfall_24h NUMERIC(8,2) DEFAULT 0,
  rainfall_cumulative NUMERIC(10,2) DEFAULT 0,
  
  quality_flag quality_flag_enum DEFAULT 'VALID',
  source VARCHAR(50),
  anomaly_note TEXT,
  
  raw_value NUMERIC(8,2),
  adjusted_value NUMERIC(8,2),
  adjustment_method VARCHAR(50),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Hydro Stations (trạm thủy văn)
-- ========================
CREATE TABLE IF NOT EXISTS telemetry.hydro_stations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  station_code VARCHAR(30) UNIQUE NOT NULL,
  station_name VARCHAR(200) NOT NULL,
  
  latitude NUMERIC(10,7) NOT NULL,
  longitude NUMERIC(10,7) NOT NULL,
  location_point GEOMETRY(Point, 4326),
  
  river_name VARCHAR(100),
  basin_id UUID,
  province VARCHAR(100),
  
  -- Alert Levels (m)
  alarm_level_1_m NUMERIC(6,2), -- Báo động 1
  alarm_level_2_m NUMERIC(6,2), -- Báo động 2
  alarm_level_3_m NUMERIC(6,2), -- Báo động 3
  
  -- Current
  current_water_level_m NUMERIC(8,3),
  current_discharge_m3s NUMERIC(10,3),
  current_alarm_level INTEGER DEFAULT 0,
  
  status station_status_enum DEFAULT 'ONLINE',
  last_reading_time TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Hydro Logs (time-series thủy văn)
-- ========================
CREATE TABLE IF NOT EXISTS telemetry.hydro_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  station_id UUID NOT NULL REFERENCES telemetry.hydro_stations(id) ON DELETE CASCADE,
  station_code VARCHAR(30) NOT NULL,
  
  recorded_at TIMESTAMPTZ NOT NULL,
  water_level_m NUMERIC(8,3),
  discharge_m3s NUMERIC(10,3),
  water_temperature_c NUMERIC(5,2),
  turbidity_ntu NUMERIC(8,2),
  alarm_level INTEGER DEFAULT 0,
  
  quality_flag quality_flag_enum DEFAULT 'VALID',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Radar Sweeps (quét radar Doppler)
-- ========================
CREATE TABLE IF NOT EXISTS telemetry.radar_stations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  station_code VARCHAR(30) UNIQUE NOT NULL,
  station_name VARCHAR(200) NOT NULL,
  location_name VARCHAR(200),
  
  latitude NUMERIC(10,7) NOT NULL,
  longitude NUMERIC(10,7) NOT NULL,
  location_point GEOMETRY(Point, 4326),
  
  range_km NUMERIC(6,2) DEFAULT 200,
  band VARCHAR(20), -- C-Band, S-Band, X-Band
  status station_status_enum DEFAULT 'ONLINE',
  
  last_sweep_time TIMESTAMPTZ,
  max_reflectivity_dbz NUMERIC(6,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS telemetry.radar_sweeps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radar_station_id UUID REFERENCES telemetry.radar_stations(id),
  
  sweep_time TIMESTAMPTZ NOT NULL,
  max_reflectivity_dbz NUMERIC(6,2),
  convective_cells_count INTEGER DEFAULT 0,
  
  -- Composite data stored as JSONB for flexibility
  cells_data JSONB DEFAULT '[]',
  coverage_summary TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Satellite Passes (ảnh vệ tinh)
-- ========================
CREATE TABLE IF NOT EXISTS telemetry.satellite_passes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  satellite_name VARCHAR(50) NOT NULL, -- GPM, IMERG, Sentinel-1, Landsat-8/9, SMAP
  pass_time TIMESTAMPTZ NOT NULL,
  
  product_type VARCHAR(50), -- PRECIPITATION, SAR, OPTICAL, SOIL_MOISTURE
  resolution_km NUMERIC(6,3),
  coverage_bbox GEOMETRY(Polygon, 4326),
  
  -- Data
  data_url TEXT,
  thumbnail_url TEXT,
  processing_status VARCHAR(20) DEFAULT 'RAW', -- RAW, PROCESSED, ANALYZED
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- IoT Sensors (cảm biến IoT đa năng)
-- ========================
CREATE TABLE IF NOT EXISTS telemetry.iot_sensors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sensor_code VARCHAR(30) UNIQUE NOT NULL,
  sensor_name VARCHAR(200) NOT NULL,
  sensor_type VARCHAR(50) NOT NULL, -- SOIL_MOISTURE, WATER_LEVEL, VIBRATION, TILT, DISPLACEMENT, WEATHER
  
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  location_point GEOMETRY(Point, 4326),
  
  zone_id UUID,
  province VARCHAR(100),
  installation_date DATE,
  
  -- Current reading
  current_value NUMERIC(12,4),
  current_unit VARCHAR(20),
  battery_percent NUMERIC(5,2),
  signal_strength_dbm INTEGER,
  
  status station_status_enum DEFAULT 'ONLINE',
  last_reading_time TIMESTAMPTZ,
  
  -- Thresholds
  threshold_warning NUMERIC(12,4),
  threshold_critical NUMERIC(12,4),
  
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS telemetry.iot_sensor_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sensor_id UUID NOT NULL REFERENCES telemetry.iot_sensors(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ NOT NULL,
  value NUMERIC(12,4),
  unit VARCHAR(20),
  quality_flag quality_flag_enum DEFAULT 'VALID',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Camera Feeds (camera giám sát)
-- ========================
CREATE TABLE IF NOT EXISTS telemetry.camera_feeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  camera_code VARCHAR(30) UNIQUE NOT NULL,
  camera_name VARCHAR(200) NOT NULL,
  
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  location_point GEOMETRY(Point, 4326),
  
  zone_id UUID,
  province VARCHAR(100),
  stream_url TEXT,
  snapshot_url TEXT,
  
  -- AI Analysis
  last_analysis_time TIMESTAMPTZ,
  ai_detected_hazards TEXT[],
  ai_confidence NUMERIC(5,2),
  
  status station_status_enum DEFAULT 'ONLINE',
  is_ptz BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Station Health Monitoring
-- ========================
CREATE TABLE IF NOT EXISTS telemetry.station_health (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  station_type VARCHAR(30) NOT NULL, -- RAINFALL, HYDRO, RADAR, IOT, CAMERA
  station_id UUID NOT NULL,
  station_code VARCHAR(30),
  
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status station_status_enum,
  battery_level NUMERIC(5,2),
  signal_strength INTEGER,
  last_data_age_seconds INTEGER,
  error_message TEXT,
  
  -- Data Quality
  check_type VARCHAR(30), -- MISSING, DUPLICATE, RANGE_OUTLIER, TEMPORAL_JUMP, NEGATIVE_VALUE, SENSOR_OFFLINE
  quality_flag quality_flag_enum DEFAULT 'VALID',
  raw_value NUMERIC(12,4),
  adjusted_value NUMERIC(12,4),
  details TEXT,
  action_taken TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
