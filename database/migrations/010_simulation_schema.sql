-- =============================================
-- HAEWS v3.0 — Migration 010: Simulation Schema
-- What-if scenarios, scenario results, historical events, digital twin
-- =============================================

-- ========================
-- Simulation Scenarios (kịch bản What-if)
-- ========================
CREATE TABLE IF NOT EXISTS simulation.scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_code VARCHAR(30) UNIQUE NOT NULL,
  scenario_name VARCHAR(500) NOT NULL,
  description TEXT,
  
  -- Type
  scenario_type VARCHAR(30) NOT NULL DEFAULT 'WHAT_IF', -- WHAT_IF, HISTORICAL_REPLAY, TRAINING_DRILL, STRESS_TEST
  
  -- Input Parameters
  target_zone_ids UUID[],
  target_provinces TEXT[],
  
  -- Rainfall scenario
  rainfall_1h NUMERIC(8,2),
  rainfall_3h NUMERIC(8,2),
  rainfall_6h NUMERIC(8,2),
  rainfall_24h NUMERIC(8,2),
  rainfall_trend rainfall_trend_enum,
  soil_saturation_modifier NUMERIC(5,2), -- e.g. +20%
  
  -- Additional params
  params JSONB DEFAULT '{}',
  
  -- Results summary
  affected_zones_count INTEGER DEFAULT 0,
  level_5_count INTEGER DEFAULT 0,
  level_4_count INTEGER DEFAULT 0,
  level_3_count INTEGER DEFAULT 0,
  level_2_count INTEGER DEFAULT 0,
  level_1_count INTEGER DEFAULT 0,
  cascade_warning TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, RUNNING, COMPLETED, FAILED
  executed_at TIMESTAMPTZ,
  execution_time_ms INTEGER,
  
  created_by VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Scenario Results (kết quả chi tiết từng zone)
-- ========================
CREATE TABLE IF NOT EXISTS simulation.scenario_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id UUID NOT NULL REFERENCES simulation.scenarios(id) ON DELETE CASCADE,
  
  zone_id UUID NOT NULL,
  zone_name VARCHAR(200),
  province_name VARCHAR(100),
  
  -- Risk Assessment Results
  risk_level INTEGER CHECK (risk_level BETWEEN 1 AND 5),
  risk_probability NUMERIC(5,4),
  risk_type risk_type_enum,
  
  -- Input features used
  rainfall_1h NUMERIC(8,2),
  rainfall_3h NUMERIC(8,2),
  rainfall_6h NUMERIC(8,2),
  rainfall_24h NUMERIC(8,2),
  soil_saturation_pct NUMERIC(5,2),
  
  -- Impact
  exposed_population INTEGER,
  
  -- Explanation
  explanation TEXT,
  contributing_factors JSONB DEFAULT '[]',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Historical Events (sự kiện lịch sử cho replay)
-- ========================
CREATE TABLE IF NOT EXISTS simulation.historical_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_code VARCHAR(30) UNIQUE NOT NULL,
  event_name VARCHAR(500) NOT NULL,
  
  -- Era classification
  era VARCHAR(20), -- 1900_1970, 1971_2000, 2001_2015, 2016_2026
  era_label VARCHAR(100),
  event_year INTEGER,
  
  -- Date range
  start_date DATE,
  end_date DATE,
  date_range_display VARCHAR(100),
  
  -- Context
  meteorological_cause TEXT,
  historical_significance TEXT,
  description TEXT,
  
  -- Impact summary
  total_casualties INTEGER,
  total_displaced INTEGER,
  total_damage_billion_vnd NUMERIC(12,2),
  affected_provinces TEXT[],
  
  -- Replay data
  total_frames INTEGER DEFAULT 0,
  frame_interval_minutes INTEGER DEFAULT 60,
  
  -- Media
  thumbnail_url TEXT,
  event_references TEXT[],
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Historical Replay Frames (khung hình replay)
-- ========================
CREATE TABLE IF NOT EXISTS simulation.replay_frames (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES simulation.historical_events(id) ON DELETE CASCADE,
  
  frame_index INTEGER NOT NULL,
  frame_timestamp TIMESTAMPTZ NOT NULL,
  
  event_title VARCHAR(500),
  event_description TEXT,
  
  -- Station readings at this time
  station_readings JSONB DEFAULT '{}', -- {station_code: {r1h, r3h, r6h, r24h}}
  
  -- Warning summary
  level_5_count INTEGER DEFAULT 0,
  level_4_count INTEGER DEFAULT 0,
  level_3_count INTEGER DEFAULT 0,
  level_2_count INTEGER DEFAULT 0,
  level_1_count INTEGER DEFAULT 0,
  
  -- Zone assessments at this time
  zone_assessments JSONB DEFAULT '[]',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(event_id, frame_index)
);

-- ========================
-- Digital Twin Snapshots
-- ========================
CREATE TABLE IF NOT EXISTS simulation.digital_twin_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  snapshot_name VARCHAR(200),
  snapshot_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Type
  snapshot_type VARCHAR(30) DEFAULT 'AUTO', -- AUTO, MANUAL, PRE_EVENT, POST_EVENT
  
  -- State
  system_mode system_mode_enum,
  
  -- Aggregated metrics
  total_stations_online INTEGER,
  total_zones_assessed INTEGER,
  total_active_warnings INTEGER,
  total_active_incidents INTEGER,
  
  -- Risk distribution
  level_5_zones INTEGER DEFAULT 0,
  level_4_zones INTEGER DEFAULT 0,
  level_3_zones INTEGER DEFAULT 0,
  level_2_zones INTEGER DEFAULT 0,
  level_1_zones INTEGER DEFAULT 0,
  
  -- Full state (large JSONB)
  zone_states JSONB DEFAULT '[]',
  station_states JSONB DEFAULT '[]',
  incident_states JSONB DEFAULT '[]',
  weather_conditions JSONB DEFAULT '{}',
  
  -- Linked
  linked_event_id UUID,
  linked_incident_id UUID,
  
  notes TEXT,
  created_by VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Training Drill Records
-- ========================
CREATE TABLE IF NOT EXISTS simulation.training_drills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  drill_code VARCHAR(30) UNIQUE NOT NULL,
  drill_name VARCHAR(500) NOT NULL,
  
  -- Schedule
  planned_start TIMESTAMPTZ,
  planned_end TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  
  -- Scope
  drill_type VARCHAR(30), -- TABLE_TOP, FUNCTIONAL, FULL_SCALE
  scenario_id UUID REFERENCES simulation.scenarios(id),
  target_provinces TEXT[],
  
  -- Participants
  total_participants INTEGER DEFAULT 0,
  participating_units TEXT[],
  exercise_director VARCHAR(200),
  
  -- Evaluation
  objectives TEXT[],
  lessons_learned TEXT[],
  performance_score NUMERIC(5,2), -- 0-100
  after_action_report_url TEXT,
  
  status VARCHAR(20) DEFAULT 'PLANNED', -- PLANNED, IN_PROGRESS, COMPLETED, CANCELLED
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
