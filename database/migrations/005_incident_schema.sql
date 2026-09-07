-- =============================================
-- HAEWS v3.0 — Migration 005: Incident Schema
-- Incident management, response tasks, tactical orders, timeline
-- =============================================

-- ========================
-- Disaster Incidents (sự cố thiên tai)
-- ========================
CREATE TABLE IF NOT EXISTS incident.incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_code VARCHAR(30) UNIQUE NOT NULL, -- e.g. "SL-0824-001"
  
  name VARCHAR(500) NOT NULL,
  description TEXT,
  
  -- Classification
  risk_type risk_type_enum NOT NULL,
  risk_level INTEGER NOT NULL CHECK (risk_level BETWEEN 1 AND 5),
  risk_score_pct NUMERIC(5,2) DEFAULT 0,
  confidence_pct NUMERIC(5,2) DEFAULT 0,
  risk_trend VARCHAR(20) DEFAULT 'STABLE', -- RISING_FAST, RISING, STABLE, DECREASING
  
  -- Location
  zone_id UUID,
  zone_name VARCHAR(200),
  district_name VARCHAR(100),
  province_name VARCHAR(100),
  specific_location TEXT,
  coordinates_lat NUMERIC(10,7),
  coordinates_lng NUMERIC(10,7),
  location_point GEOMETRY(Point, 4326),
  affected_area GEOMETRY(Polygon, 4326),
  
  -- Lifecycle
  status incident_status_enum NOT NULL DEFAULT 'DETECTED',
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  alert_issued_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  
  -- Timing
  time_to_critical_threshold_min INTEGER,
  lead_time_status TEXT,
  
  -- Impact Assessment
  exposed_population INTEGER DEFAULT 0,
  exposed_households INTEGER DEFAULT 0,
  elderly_children_count INTEGER DEFAULT 0,
  schools_count INTEGER DEFAULT 0,
  medical_clinics_count INTEGER DEFAULT 0,
  vulnerable_roads_count INTEGER DEFAULT 0,
  blocked_road_names TEXT[],
  bridges_at_risk_count INTEGER DEFAULT 0,
  critical_facilities TEXT[],
  affected_area_km2 NUMERIC(10,2),
  estimated_economic_exposure_billion_vnd NUMERIC(12,2),
  
  -- AI Analysis
  ai_recommendation TEXT,
  decision_required TEXT,
  explainable_factors JSONB DEFAULT '[]',
  
  -- Audit
  created_by VARCHAR(100),
  verified_by VARCHAR(100),
  resolved_by VARCHAR(100),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Incident Timeline (dòng thời gian sự cố)
-- ========================
CREATE TABLE IF NOT EXISTS incident.incident_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID NOT NULL REFERENCES incident.incidents(id) ON DELETE CASCADE,
  
  event_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  stage incident_status_enum,
  
  actor VARCHAR(200), -- User or system name
  actor_role VARCHAR(50),
  description TEXT NOT NULL,
  
  -- Evidence
  evidence_type VARCHAR(30), -- PHOTO, VIDEO, DOCUMENT, SENSOR_DATA, AI_REPORT
  evidence_url TEXT,
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Response Tasks (nhiệm vụ ứng phó)
-- ========================
CREATE TABLE IF NOT EXISTS incident.response_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID NOT NULL REFERENCES incident.incidents(id) ON DELETE CASCADE,
  
  task_code VARCHAR(30) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  
  -- Assignment
  assigned_unit VARCHAR(200),
  assignee_name VARCHAR(200),
  assignee_phone VARCHAR(20),
  assigned_by VARCHAR(200),
  
  -- Priority & Deadline
  priority task_priority_enum DEFAULT 'MEDIUM',
  deadline TIMESTAMPTZ,
  
  -- Status Tracking
  status task_status_enum DEFAULT 'UNASSIGNED',
  
  -- Evidence
  evidence_photos TEXT[],
  field_notes TEXT,
  gps_lat NUMERIC(10,7),
  gps_lng NUMERIC(10,7),
  gps_point GEOMETRY(Point, 4326),
  
  -- Timestamps
  assigned_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  verified_by VARCHAR(200),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Tactical Orders (lệnh tác chiến)
-- ========================
CREATE TABLE IF NOT EXISTS incident.tactical_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID REFERENCES incident.incidents(id),
  
  order_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. "LỆNH-0824/BCH-PCTT"
  order_type order_type_enum NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  
  -- Target
  target_area TEXT,
  target_zone_id UUID,
  affected_population INTEGER DEFAULT 0,
  assigned_units TEXT[],
  
  -- Authority
  issued_by VARCHAR(200) NOT NULL,
  issued_by_role VARCHAR(100),
  approved_by VARCHAR(200),
  
  -- Timing
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effective_until TIMESTAMPTZ,
  
  -- Status
  status order_status_enum DEFAULT 'PENDING_APPROVAL',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Situation Reports (báo cáo tình huống)
-- ========================
CREATE TABLE IF NOT EXISTS incident.situation_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID REFERENCES incident.incidents(id),
  
  report_number INTEGER NOT NULL,
  report_title VARCHAR(500) NOT NULL,
  
  -- Content
  executive_summary TEXT NOT NULL,
  current_situation TEXT,
  weather_forecast TEXT,
  response_actions TEXT,
  resource_deployment TEXT,
  recommendations TEXT,
  
  -- Metrics
  casualties INTEGER DEFAULT 0,
  missing_persons INTEGER DEFAULT 0,
  injured_persons INTEGER DEFAULT 0,
  evacuated_households INTEGER DEFAULT 0,
  destroyed_houses INTEGER DEFAULT 0,
  damaged_infrastructure TEXT[],
  
  -- Metadata
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  prepared_by VARCHAR(200),
  approved_by VARCHAR(200),
  distribution_list TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Damage Assessments (đánh giá thiệt hại)
-- ========================
CREATE TABLE IF NOT EXISTS incident.damage_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID REFERENCES incident.incidents(id),
  
  assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  assessor_name VARCHAR(200),
  assessor_role VARCHAR(100),
  
  -- Location
  zone_id UUID,
  commune_name VARCHAR(150),
  district_name VARCHAR(100),
  province_name VARCHAR(100),
  
  -- Human Impact
  deaths INTEGER DEFAULT 0,
  missing INTEGER DEFAULT 0,
  injured INTEGER DEFAULT 0,
  displaced_people INTEGER DEFAULT 0,
  affected_households INTEGER DEFAULT 0,
  
  -- Infrastructure
  houses_destroyed INTEGER DEFAULT 0,
  houses_damaged INTEGER DEFAULT 0,
  roads_damaged_km NUMERIC(8,2) DEFAULT 0,
  bridges_damaged INTEGER DEFAULT 0,
  schools_damaged INTEGER DEFAULT 0,
  hospitals_damaged INTEGER DEFAULT 0,
  
  -- Agriculture
  crop_area_damaged_ha NUMERIC(10,2) DEFAULT 0,
  livestock_lost INTEGER DEFAULT 0,
  aquaculture_area_damaged_ha NUMERIC(10,2) DEFAULT 0,
  
  -- Economic
  total_damage_billion_vnd NUMERIC(12,2) DEFAULT 0,
  
  -- Evidence
  photos TEXT[],
  report_document_url TEXT,
  
  verified BOOLEAN DEFAULT FALSE,
  verified_by VARCHAR(200),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
