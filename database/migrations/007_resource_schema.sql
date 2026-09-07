-- =============================================
-- HAEWS v3.0 — Migration 007: Resource Schema
-- Evacuation shelters, safe routes, response teams, equipment, supplies
-- =============================================

-- ========================
-- Evacuation Shelters (điểm sơ tán)
-- ========================
CREATE TABLE IF NOT EXISTS resource.evacuation_shelters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shelter_code VARCHAR(30) UNIQUE NOT NULL,
  shelter_name VARCHAR(200) NOT NULL,
  
  -- Location
  zone_id UUID,
  commune_name VARCHAR(150),
  district_name VARCHAR(100),
  province_name VARCHAR(100),
  address TEXT,
  latitude NUMERIC(10,7) NOT NULL,
  longitude NUMERIC(10,7) NOT NULL,
  location_point GEOMETRY(Point, 4326),
  elevation_m NUMERIC(8,2),
  
  -- Capacity
  capacity_people INTEGER NOT NULL DEFAULT 0,
  current_occupants INTEGER DEFAULT 0,
  
  -- Distance from hazard
  distance_km_from_hazard NUMERIC(8,2),
  
  -- Contact
  contact_person VARCHAR(200),
  contact_phone VARCHAR(20),
  
  -- Facilities
  has_power_generator BOOLEAN DEFAULT FALSE,
  has_clean_water BOOLEAN DEFAULT FALSE,
  has_medical_firstaid BOOLEAN DEFAULT FALSE,
  has_telecom_signal BOOLEAN DEFAULT TRUE,
  food_rations_days INTEGER DEFAULT 0,
  has_sanitation BOOLEAN DEFAULT FALSE,
  has_cooking_facility BOOLEAN DEFAULT FALSE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'SAFE_OPEN', -- SAFE_OPEN, NEAR_CAPACITY, FULL, ISOLATED, DAMAGED
  last_inspection_date DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Safe Routes (tuyến đường an toàn sơ tán)
-- ========================
CREATE TABLE IF NOT EXISTS resource.safe_routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_code VARCHAR(30) UNIQUE NOT NULL,
  
  -- From → To
  from_area VARCHAR(200) NOT NULL,
  from_zone_id UUID,
  to_shelter_id UUID REFERENCES resource.evacuation_shelters(id),
  to_shelter_name VARCHAR(200),
  
  -- Route Details
  distance_km NUMERIC(8,2),
  estimated_travel_minutes INTEGER,
  
  -- Geometry
  route_geom GEOMETRY(LineString, 4326),
  
  -- Status
  status VARCHAR(30) DEFAULT 'SAFE', -- SAFE, WARNING_WATERLOGGED, DANGER_EROSION, SEVERED_BLOCKED
  choke_points TEXT[],
  safe_for_vehicles BOOLEAN DEFAULT TRUE,
  alternative_route_notes TEXT,
  
  -- Monitoring
  last_inspected_at TIMESTAMPTZ,
  inspected_by VARCHAR(200),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Response Teams (đội ứng cứu)
-- ========================
CREATE TABLE IF NOT EXISTS resource.response_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_code VARCHAR(30) UNIQUE NOT NULL,
  team_name VARCHAR(200) NOT NULL,
  
  -- Organization
  team_type VARCHAR(50) NOT NULL, -- SEARCH_RESCUE, MEDICAL, ENGINEERING, LOGISTICS, VOLUNTEER, MILITARY
  parent_unit VARCHAR(200),
  province VARCHAR(100),
  district VARCHAR(100),
  
  -- Contact
  commander_name VARCHAR(200),
  commander_phone VARCHAR(20),
  deputy_name VARCHAR(200),
  
  -- Capacity
  total_personnel INTEGER DEFAULT 0,
  available_personnel INTEGER DEFAULT 0,
  
  -- Location
  base_latitude NUMERIC(10,7),
  base_longitude NUMERIC(10,7),
  base_point GEOMETRY(Point, 4326),
  current_latitude NUMERIC(10,7),
  current_longitude NUMERIC(10,7),
  current_point GEOMETRY(Point, 4326),
  
  -- Status
  deployment_status VARCHAR(30) DEFAULT 'STANDBY', -- STANDBY, DEPLOYED, RETURNING, MAINTENANCE
  assigned_incident_id UUID,
  assigned_zone_id UUID,
  
  -- Capabilities
  capabilities TEXT[], -- e.g. {'SWIFT_WATER_RESCUE', 'MOUNTAIN_RESCUE', 'MEDICAL_EVAC', 'ENGINEERING'}
  vehicles TEXT[], -- e.g. {'BOAT_4', 'TRUCK_2', 'AMBULANCE_1'}
  
  last_deployment_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Equipment Inventory (trang thiết bị)
-- ========================
CREATE TABLE IF NOT EXISTS resource.equipment_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_code VARCHAR(30) UNIQUE NOT NULL,
  equipment_name VARCHAR(200) NOT NULL,
  
  category VARCHAR(50) NOT NULL, -- BOAT, VEHICLE, COMMUNICATION, MEDICAL, PUMP, GENERATOR, TENT, TOOL
  
  -- Quantity
  total_quantity INTEGER DEFAULT 0,
  available_quantity INTEGER DEFAULT 0,
  deployed_quantity INTEGER DEFAULT 0,
  
  -- Location
  storage_location VARCHAR(200),
  province VARCHAR(100),
  
  -- Assignment
  assigned_team_id UUID REFERENCES resource.response_teams(id),
  
  -- Status
  condition VARCHAR(20) DEFAULT 'GOOD', -- GOOD, FAIR, NEEDS_REPAIR, DECOMMISSIONED
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  
  -- Details
  specifications JSONB DEFAULT '{}',
  unit_cost_vnd NUMERIC(14,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Supply Depot (kho vật tư cứu trợ)
-- ========================
CREATE TABLE IF NOT EXISTS resource.supply_depot (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  depot_code VARCHAR(30) UNIQUE NOT NULL,
  depot_name VARCHAR(200) NOT NULL,
  
  -- Location
  address TEXT,
  province VARCHAR(100),
  district VARCHAR(100),
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  location_point GEOMETRY(Point, 4326),
  
  -- Contact
  manager_name VARCHAR(200),
  manager_phone VARCHAR(20),
  
  -- Status
  is_operational BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resource.supply_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  depot_id UUID REFERENCES resource.supply_depot(id) ON DELETE CASCADE,
  
  item_name VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL, -- FOOD, WATER, MEDICINE, BLANKET, TENT, CLOTHING, TOOL, FUEL
  unit VARCHAR(20) NOT NULL, -- KG, LITER, PIECE, BOX, SET, UNIT
  
  quantity_in_stock NUMERIC(12,2) DEFAULT 0,
  quantity_reserved NUMERIC(12,2) DEFAULT 0,
  minimum_stock_level NUMERIC(12,2) DEFAULT 0,
  
  expiry_date DATE,
  batch_number VARCHAR(50),
  
  -- Status
  is_below_minimum BOOLEAN GENERATED ALWAYS AS (quantity_in_stock < minimum_stock_level) STORED,
  
  last_restocked_at TIMESTAMPTZ,
  last_dispatched_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Resource Dispatch Logs
-- ========================
CREATE TABLE IF NOT EXISTS resource.dispatch_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- What was dispatched
  resource_type VARCHAR(30) NOT NULL, -- TEAM, EQUIPMENT, SUPPLY
  resource_id UUID NOT NULL,
  resource_name VARCHAR(200),
  
  -- Where
  from_location VARCHAR(200),
  to_location VARCHAR(200),
  to_incident_id UUID,
  to_zone_id UUID,
  
  -- Details
  quantity INTEGER DEFAULT 1,
  dispatched_by VARCHAR(200),
  
  -- Status
  status VARCHAR(20) DEFAULT 'DISPATCHED', -- DISPATCHED, IN_TRANSIT, ARRIVED, RETURNED
  dispatched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  arrived_at TIMESTAMPTZ,
  returned_at TIMESTAMPTZ,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
