-- =============================================
-- HAEWS v3.0 — Migration 012: Indexes & Functions
-- Spatial indexes, time-series indexes, stored procedures, views
-- =============================================

-- ========================
-- SPATIAL INDEXES (PostGIS GIST)
-- ========================

-- Core spatial
CREATE INDEX IF NOT EXISTS idx_spatial_zones_geom ON core.spatial_zones USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_spatial_zones_center ON core.spatial_zones USING GIST (center_point);
CREATE INDEX IF NOT EXISTS idx_provinces_geom ON core.provinces USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_districts_geom ON core.districts USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_communes_geom ON core.communes USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_communes_centroid ON core.communes USING GIST (centroid);
CREATE INDEX IF NOT EXISTS idx_basins_geom ON core.basins USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_fault_lines_geom ON core.fault_lines USING GIST (geom);

-- Telemetry spatial
CREATE INDEX IF NOT EXISTS idx_rainfall_stations_point ON telemetry.rainfall_stations USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_hydro_stations_point ON telemetry.hydro_stations USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_radar_stations_point ON telemetry.radar_stations USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_iot_sensors_point ON telemetry.iot_sensors USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_camera_feeds_point ON telemetry.camera_feeds USING GIST (location_point);

-- Alert spatial
CREATE INDEX IF NOT EXISTS idx_geofence_zones_geom ON alert.geofence_zones USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_point ON alert.citizen_reports USING GIST (location_point);

-- Resource spatial
CREATE INDEX IF NOT EXISTS idx_shelters_point ON resource.evacuation_shelters USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_safe_routes_geom ON resource.safe_routes USING GIST (route_geom);
CREATE INDEX IF NOT EXISTS idx_teams_base_point ON resource.response_teams USING GIST (base_point);
CREATE INDEX IF NOT EXISTS idx_teams_current_point ON resource.response_teams USING GIST (current_point);

-- Typhoon spatial
CREATE INDEX IF NOT EXISTS idx_storms_current_point ON typhoon.storms USING GIST (current_point);
CREATE INDEX IF NOT EXISTS idx_storms_cone ON typhoon.storms USING GIST (cone_of_uncertainty);
CREATE INDEX IF NOT EXISTS idx_track_points_point ON typhoon.track_points USING GIST (track_point);
CREATE INDEX IF NOT EXISTS idx_earthquake_epicenter ON typhoon.earthquake_events USING GIST (epicenter_point);
CREATE INDEX IF NOT EXISTS idx_reservoirs_point ON typhoon.cross_border_reservoirs USING GIST (location_point);

-- Incident spatial
CREATE INDEX IF NOT EXISTS idx_incidents_point ON incident.incidents USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_incidents_area ON incident.incidents USING GIST (affected_area);

-- ========================
-- TIME-SERIES INDEXES (BTREE)
-- ========================

-- Rainfall logs time-series
CREATE INDEX IF NOT EXISTS idx_rainfall_logs_time ON telemetry.rainfall_logs (recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_rainfall_logs_station_time ON telemetry.rainfall_logs (station_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_rainfall_logs_code_time ON telemetry.rainfall_logs (station_code, recorded_at DESC);

-- Hydro logs time-series
CREATE INDEX IF NOT EXISTS idx_hydro_logs_time ON telemetry.hydro_logs (recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_hydro_logs_station_time ON telemetry.hydro_logs (station_id, recorded_at DESC);

-- IoT sensor logs
CREATE INDEX IF NOT EXISTS idx_iot_logs_time ON telemetry.iot_sensor_logs (recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_iot_logs_sensor_time ON telemetry.iot_sensor_logs (sensor_id, recorded_at DESC);

-- Station health
CREATE INDEX IF NOT EXISTS idx_station_health_time ON telemetry.station_health (checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_station_health_station ON telemetry.station_health (station_id, checked_at DESC);

-- AI predictions
CREATE INDEX IF NOT EXISTS idx_predictions_time ON ai.predictions (predicted_at DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_zone_time ON ai.predictions (zone_id, predicted_at DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_level ON ai.predictions (risk_level DESC);

-- Feature store
CREATE INDEX IF NOT EXISTS idx_feature_store_zone_time ON ai.feature_store (zone_id, computed_at DESC);

-- Evidence fusions
CREATE INDEX IF NOT EXISTS idx_fusions_zone_time ON ai.evidence_fusions (zone_id, fused_at DESC);

-- Warning events
CREATE INDEX IF NOT EXISTS idx_warnings_time ON alert.warning_events (issued_at DESC);
CREATE INDEX IF NOT EXISTS idx_warnings_active ON alert.warning_events (active, risk_level DESC);
CREATE INDEX IF NOT EXISTS idx_warnings_zone ON alert.warning_events (zone_id, issued_at DESC);

-- Incidents
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incident.incidents (status);
CREATE INDEX IF NOT EXISTS idx_incidents_level ON incident.incidents (risk_level DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_time ON incident.incidents (detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_province ON incident.incidents (province_name);

-- Audit logs
CREATE INDEX IF NOT EXISTS idx_audit_time ON auth_ext.audit_logs (logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user ON auth_ext.audit_logs (user_name, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON auth_ext.audit_logs (action_type, logged_at DESC);

-- Typhoon track points
CREATE INDEX IF NOT EXISTS idx_track_storm_order ON typhoon.track_points (storm_id, point_order);

-- ========================
-- TEXT SEARCH INDEXES
-- ========================
CREATE INDEX IF NOT EXISTS idx_zones_name_trgm ON core.spatial_zones USING GIN (zone_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_communes_name_trgm ON core.communes USING GIN (commune_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_incidents_name_trgm ON incident.incidents USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_knowledge_title_trgm ON ai.knowledge_base USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_knowledge_content_trgm ON ai.knowledge_base USING GIN (content gin_trgm_ops);

-- ========================
-- STORED PROCEDURES & FUNCTIONS
-- ========================

-- Function: Find nearest stations to a zone center
CREATE OR REPLACE FUNCTION telemetry.find_nearest_stations(
  p_lat NUMERIC,
  p_lng NUMERIC,
  p_limit INTEGER DEFAULT 5,
  p_max_distance_km NUMERIC DEFAULT 50
) RETURNS TABLE (
  station_id UUID,
  station_code VARCHAR,
  station_name VARCHAR,
  distance_km NUMERIC,
  rainfall_1h NUMERIC,
  rainfall_3h NUMERIC,
  rainfall_6h NUMERIC,
  rainfall_24h NUMERIC,
  quality_flag quality_flag_enum,
  status station_status_enum
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.station_code,
    s.station_name,
    ROUND((ST_DistanceSphere(
      s.location_point,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)
    ) / 1000.0)::NUMERIC, 2) AS distance_km,
    s.current_rainfall_1h,
    s.current_rainfall_3h,
    s.current_rainfall_6h,
    s.current_rainfall_24h,
    s.quality_flag,
    s.status
  FROM telemetry.rainfall_stations s
  WHERE s.location_point IS NOT NULL
    AND ST_DWithin(
      s.location_point::geography,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
      p_max_distance_km * 1000
    )
  ORDER BY ST_DistanceSphere(
    s.location_point,
    ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)
  )
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function: Find zones within a radius
CREATE OR REPLACE FUNCTION core.find_zones_within_radius(
  p_lat NUMERIC,
  p_lng NUMERIC,
  p_radius_km NUMERIC DEFAULT 25
) RETURNS TABLE (
  zone_id UUID,
  zone_code VARCHAR,
  zone_name VARCHAR,
  distance_km NUMERIC,
  province_name VARCHAR,
  elevation NUMERIC,
  geology_sensitivity geology_sensitivity_enum
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    z.id,
    z.zone_code,
    z.zone_name,
    ROUND((ST_DistanceSphere(
      z.center_point,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)
    ) / 1000.0)::NUMERIC, 2) AS distance_km,
    z.province_name,
    z.elevation,
    z.geology_sensitivity
  FROM core.spatial_zones z
  WHERE z.center_point IS NOT NULL
    AND ST_DWithin(
      z.center_point::geography,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
      p_radius_km * 1000
    )
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;

-- Function: Check if a point is inside any active geofence
CREATE OR REPLACE FUNCTION alert.check_geofence(
  p_lat NUMERIC,
  p_lng NUMERIC
) RETURNS TABLE (
  geofence_id UUID,
  geofence_name VARCHAR,
  geofence_type VARCHAR,
  risk_level INTEGER,
  alert_message TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    g.id,
    g.geofence_name,
    g.geofence_type,
    g.risk_level,
    g.alert_message
  FROM alert.geofence_zones g
  WHERE g.is_active = TRUE
    AND ST_Contains(g.geom, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326));
END;
$$ LANGUAGE plpgsql;

-- Function: Generate GeoJSON FeatureCollection from zones
CREATE OR REPLACE FUNCTION core.zones_to_geojson(
  p_province VARCHAR DEFAULT NULL,
  p_region region_enum DEFAULT NULL,
  p_min_risk_level INTEGER DEFAULT 1
) RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'type', 'FeatureCollection',
    'features', COALESCE(jsonb_agg(
      jsonb_build_object(
        'type', 'Feature',
        'id', z.id,
        'geometry', ST_AsGeoJSON(z.geom)::jsonb,
        'properties', jsonb_build_object(
          'zone_code', z.zone_code,
          'zone_name', z.zone_name,
          'district_name', z.district_name,
          'province_name', z.province_name,
          'elevation', z.elevation,
          'slope', z.slope,
          'geology_sensitivity', z.geology_sensitivity,
          'vulnerable_population', z.vulnerable_population,
          'warning_enabled', z.warning_enabled
        )
      )
    ), '[]'::jsonb),
    'metadata', jsonb_build_object(
      'generated_at', NOW(),
      'total_zones', COUNT(*)
    )
  ) INTO v_result
  FROM core.spatial_zones z
  WHERE z.geom IS NOT NULL
    AND (p_province IS NULL OR z.province_name ILIKE '%' || p_province || '%')
    AND (p_region IS NULL OR z.region = p_region);
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Function: Get current system observability
CREATE OR REPLACE FUNCTION core.get_system_observability()
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_online_stations INTEGER;
  v_total_stations INTEGER;
  v_active_warnings INTEGER;
  v_active_incidents INTEGER;
BEGIN
  SELECT COUNT(*) FILTER (WHERE status = 'ONLINE'),
         COUNT(*)
  INTO v_online_stations, v_total_stations
  FROM telemetry.rainfall_stations;
  
  SELECT COUNT(*) INTO v_active_warnings
  FROM alert.warning_events WHERE active = TRUE;
  
  SELECT COUNT(*) INTO v_active_incidents
  FROM incident.incidents WHERE status NOT IN ('RESOLVED', 'POST_AUDITED');
  
  v_result := jsonb_build_object(
    'status', CASE 
      WHEN v_online_stations::FLOAT / GREATEST(v_total_stations, 1) >= 0.9 THEN 'HEALTHY'
      WHEN v_online_stations::FLOAT / GREATEST(v_total_stations, 1) >= 0.7 THEN 'DEGRADED'
      ELSE 'MAINTENANCE'
    END,
    'online_stations', v_online_stations,
    'total_stations', v_total_stations,
    'online_ratio', ROUND(v_online_stations::NUMERIC / GREATEST(v_total_stations, 1) * 100, 1),
    'active_warnings', v_active_warnings,
    'active_incidents', v_active_incidents,
    'checked_at', NOW()
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ========================
-- MATERIALIZED VIEWS (for dashboard performance)
-- ========================

-- Province risk summary (refreshed every cycle)
CREATE MATERIALIZED VIEW IF NOT EXISTS core.mv_province_risk_summary AS
SELECT
  z.province_name,
  z.region,
  COUNT(*) AS total_zones,
  COUNT(*) FILTER (WHERE z.warning_enabled = TRUE) AS enabled_zones,
  z.province_id
FROM core.spatial_zones z
GROUP BY z.province_name, z.region, z.province_id;

-- Active incident summary
CREATE MATERIALIZED VIEW IF NOT EXISTS incident.mv_active_incident_summary AS
SELECT
  i.province_name,
  i.risk_type,
  COUNT(*) AS incident_count,
  MAX(i.risk_level) AS max_risk_level,
  SUM(i.exposed_population) AS total_exposed_population
FROM incident.incidents i
WHERE i.status NOT IN ('RESOLVED', 'POST_AUDITED')
GROUP BY i.province_name, i.risk_type;

-- ========================
-- updated_at TRIGGER (auto-update timestamps)
-- ========================
CREATE OR REPLACE FUNCTION core.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT schemaname, tablename
    FROM pg_tables
    WHERE schemaname IN ('core', 'telemetry', 'ai', 'incident', 'alert', 'resource', 'typhoon', 'auth_ext', 'simulation')
  LOOP
    -- Check if the table has updated_at column
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = r.schemaname
        AND table_name = r.tablename
        AND column_name = 'updated_at'
    ) THEN
      EXECUTE format(
        'DROP TRIGGER IF EXISTS trigger_updated_at ON %I.%I; CREATE TRIGGER trigger_updated_at BEFORE UPDATE ON %I.%I FOR EACH ROW EXECUTE FUNCTION core.update_updated_at();',
        r.schemaname, r.tablename, r.schemaname, r.tablename
      );
    END IF;
  END LOOP;
END;
$$;
