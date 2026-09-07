export type RiskLevel = 1 | 2 | 3 | 4 | 5;

export type RiskType = 'flash_flood' | 'landslide' | 'combined';

export type QualityFlag = 'VALID' | 'WARNING' | 'INVALID' | 'MISSING';

export type ModelConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export type TriggerType = 'AI_MODEL' | 'PHYSICAL_RULE' | 'HYBRID_OVERRIDE' | 'MANUAL_OVERRIDE';

export type SystemMode = 'REAL_TIME' | 'DEMO' | 'HISTORICAL_REPLAY';

export interface RealtimeWeatherFeedStatus {
  mode: SystemMode;
  provider: string;
  last_synced_at: string;
  is_syncing: boolean;
  total_stations_synced: number;
  total_zones_synced: number;
  data_quality: 'EXCELLENT' | 'GOOD' | 'DEGRADED';
  satellite_sync_status: 'ACTIVE_GPM_IMERG' | 'STANDBY';
  radar_doppler_status: 'ACTIVE_DOPPLER_NETWORK' | 'STANDBY';
  current_system_lead_time: string;
  active_warnings_count: {
    level_5: number;
    level_4: number;
    level_3: number;
    total_critical: number;
  };
  weather_summary: string;
}

export type RegionScope = 'ALL' | 'BAC_BO' | 'TRUNG_BO' | 'TAY_NGUYEN' | 'NAM_BO';

export interface SpatialZone {
  id: string;
  zone_code: string;
  zone_name: string;
  district_name: string;
  province_name: string;
  region?: 'BAC_BO' | 'TRUNG_BO' | 'TAY_NGUYEN' | 'NAM_BO';
  coordinates: [number, number][][]; // GeoJSON Polygon coordinates [lng, lat]
  center: [number, number]; // [lat, lng]
  elevation: number; // meters
  slope: number; // degrees
  aspect: string; // N, NE, E, SE, S, SW, W, NW
  soil_type: string;
  geology_sensitivity: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  basin_id: string;
  basin_name: string;
  basin_area_km2: number;
  channel_gradient: number; // %
  vulnerable_population: number;
  critical_facilities: string[];
  warning_enabled?: boolean; // Toggle alert per zone
}

export interface ProvinceAlertControl {
  province_name: string;
  region: 'BAC_BO' | 'TRUNG_BO' | 'TAY_NGUYEN' | 'NAM_BO';
  warning_enabled: boolean;
  total_zones: number;
  total_stations: number;
  updated_at: string;
  updated_by?: string;
  note?: string;
}

export interface RainfallStation {
  id: string;
  station_code: string;
  station_name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  status: 'ONLINE' | 'WARNING' | 'OFFLINE';
  source:
    | 'VNA_TELEMETRY'
    | 'AUTOMATIC_RAIN_GAUGE'
    | 'SYNTHETIC'
    | 'RADAR_ESTIMATE'
    | 'VNMHA_NATIONAL'
    | 'VRAIN_WATEC'
    | 'HYDRO_POWER'
    | 'CROSS_BORDER_MEKONG'
    | 'CROSS_BORDER_RED_RIVER'
    | 'CROSS_BORDER_LAOS'
    | 'CROSS_BORDER_HAINAN'
    | 'CROSS_BORDER_PHILIPPINES'
    | 'CROSS_BORDER_TAIWAN'
    | 'CROSS_BORDER_GUANGZHOU'
    | 'REGIONAL_MARITIME';
  country?: 'VIETNAM' | 'CHINA' | 'LAOS' | 'CAMBODIA' | 'THAILAND' | 'PHILIPPINES' | 'TAIWAN' | 'INTERNATIONAL';
  province?: string;
  wmo_index?: string;
  provider_network?: string;
  last_reading_time: string;
  current_rainfall_1h: number;
  current_rainfall_3h: number;
  current_rainfall_6h: number;
  current_rainfall_24h: number;
  quality_flag: QualityFlag;
  battery_level: number; // %
  discharge_m3s?: number; // Lưu lượng dòng chảy xả (m3/s)
  water_level_m?: number; // Mực nước thượng lưu (m)
  upstream_basin?: string; // Tên lưu vực thượng nguồn
  wind_speed_kmh?: number; // Tốc độ gió tức thời (km/h)
  wind_direction?: string; // Hướng gió
  atmospheric_pressure_hpa?: number; // Khí áp mặt biển (hPa)
  sea_temperature_c?: number; // Nhiệt độ nước biển (°C)
  wave_height_m?: number; // Chiều cao sóng biển (m)
  radar_reflectivity_dbz?: number; // Phản hồi vô tuyến radar (dBZ)
  region_tag?: 'HAINAN' | 'PHILIPPINES' | 'TAIWAN' | 'GUANGZHOU' | 'MEKONG' | 'RED_RIVER' | 'LAOS' | 'VIETNAM_INLAND';
}

export interface RainfallLog {
  id: string;
  station_id: string;
  station_code: string;
  timestamp: string;
  rainfall_1h: number;
  rainfall_3h: number;
  rainfall_6h: number;
  rainfall_24h: number;
  quality_flag: QualityFlag;
  source: string;
  anomaly_note?: string;
}

export interface ThresholdProfile {
  id: string;
  region_code: string;
  region_name: string;
  risk_type: 'flash_flood' | 'landslide';
  rainfall_1h_threshold: number; // mm
  rainfall_3h_threshold: number; // mm
  rainfall_6h_threshold: number; // mm
  rainfall_24h_threshold: number; // mm
  soil_saturation_threshold?: number; // %
  level: RiskLevel;
  source: string;
  effective_date: string;
  active: boolean;
}

export interface RiskFeatureContribution {
  feature_name: string;
  feature_label: string;
  value: number | string;
  unit?: string;
  contribution_percent: number;
  impact: 'POSITIVE_RISK' | 'NEUTRAL' | 'PROTECTIVE';
}

export interface ZoneRiskAssessment {
  zone_id: string;
  zone_name: string;
  district_name: string;
  province_name: string;
  timestamp: string;

  // Rainfall features
  rainfall_1h: number;
  rainfall_3h: number;
  rainfall_6h: number;
  rainfall_24h: number;
  rainfall_trend: 'RISING_SHARP' | 'RISING' | 'STABLE' | 'DECREASING';
  antecedent_precip_index: number; // API (mm)
  soil_saturation_percent: number; // %

  // Landslide Assessment
  landslide_ai_probability: number;
  landslide_rule_triggered: boolean;
  landslide_rule_level: RiskLevel;
  landslide_final_level: RiskLevel;

  // Flash Flood Assessment
  flash_flood_ai_probability: number;
  flash_flood_rule_triggered: boolean;
  flash_flood_rule_level: RiskLevel;
  flash_flood_final_level: RiskLevel;

  // Overall Fusion
  overall_risk_level: RiskLevel;
  overall_risk_type: RiskType;
  overall_probability: number;
  model_confidence: ModelConfidence;
  confidence_score: number; // 0..100
  color: string;

  // Rule & Trigger
  trigger_type: TriggerType;
  trigger_detail: string;
  physical_rule_active: boolean;
  triggered_rules: string[];

  // Lead Time / Projection
  projected_level_30m: RiskLevel;
  projected_level_60m: RiskLevel;
  lead_time_status: string;

  // Explainability
  contributing_factors: RiskFeatureContribution[];
  explanation_summary: string;
  geological_factors: string;
  meteorological_factors: string;
  safety_recommendations: string[];

  // Metadata
  model_version: string;
  data_quality_flag: QualityFlag;
}

export interface WarningEvent {
  id: string;
  timestamp: string;
  zone_id: string;
  zone_name: string;
  district_name: string;
  province_name: string;
  risk_type: RiskType;
  risk_level: RiskLevel;
  risk_probability: number;
  model_confidence: ModelConfidence;
  rainfall_1h: number;
  rainfall_3h: number;
  rainfall_6h: number;
  rainfall_24h: number;
  trigger_type: TriggerType;
  trigger_detail: string;
  warning_message: string;
  model_version: string;
  created_at: string;
  active: boolean;
  evacuation_advised: boolean;
}

export interface GeoJsonFeatureProperties extends ZoneRiskAssessment {
  center: [number, number];
  elevation: number;
  slope: number;
  aspect: string;
  soil_type: string;
  geology_sensitivity: string;
  basin_name: string;
  vulnerable_population: number;
}

export interface GeoJsonWarningMap {
  type: 'FeatureCollection';
  features: {
    type: 'Feature';
    id: string;
    geometry: {
      type: 'Polygon';
      coordinates: [number, number][][];
    };
    properties: GeoJsonFeatureProperties;
  }[];
  metadata: {
    generated_at: string;
    total_zones: number;
    level_counts: {
      level_1: number;
      level_2: number;
      level_3: number;
      level_4: number;
      level_5: number;
    };
    system_mode: SystemMode;
    model_version: string;
  };
}

export interface DataQualityAuditRecord {
  id: string;
  timestamp: string;
  station_code: string;
  check_type: 'MISSING' | 'DUPLICATE' | 'RANGE_OUTLIER' | 'TEMPORAL_JUMP' | 'NEGATIVE_VALUE' | 'SENSOR_OFFLINE';
  status: QualityFlag;
  raw_value: number;
  adjusted_value?: number;
  details: string;
  action_taken: string;
}

export interface SimulationScenarioInput {
  zone_ids?: string[];
  rainfall_1h: number;
  rainfall_3h: number;
  rainfall_6h: number;
  rainfall_24h: number;
  soil_saturation_modifier: number; // e.g. +20%
  rainfall_trend: 'RISING_SHARP' | 'RISING' | 'STABLE' | 'DECREASING';
}

export interface SimulationResult {
  simulation_id: string;
  executed_at: string;
  scenario_params: SimulationScenarioInput;
  affected_zones_count: number;
  impact_summary: {
    level_5_count: number;
    level_4_count: number;
    level_3_count: number;
    level_2_count: number;
    level_1_count: number;
  };
  results: ZoneRiskAssessment[];
  cascade_warning: string;
}

export interface HistoricalReplayFrame {
  frame_index: number;
  timestamp: string;
  event_title: string;
  event_description: string;
  station_readings: Record<string, { r1h: number; r3h: number; r6h: number; r24h: number }>;
  warning_summary: {
    level_5: number;
    level_4: number;
    level_3: number;
    level_2: number;
    level_1: number;
  };
}

export interface HistoricalScenarioMetadata {
  id: string;
  name: string;
  era: '1900_1970' | '1971_2000' | '2001_2015' | '2016_2024';
  era_label: string;
  year: number;
  description: string;
  date_range: string;
  meteorological_cause?: string;
  historical_significance?: string;
  total_frames: number;
}

export interface SystemObservability {
  status: 'HEALTHY' | 'DEGRADED' | 'MAINTENANCE';
  database: 'ONLINE' | 'OFFLINE';
  api_service: 'ONLINE' | 'OFFLINE';
  ai_engine_landslide: 'ONLINE' | 'OFFLINE';
  ai_engine_flashflood: 'ONLINE' | 'OFFLINE';
  data_quality_engine: 'ONLINE' | 'OFFLINE';
  active_stations_count: number;
  total_stations_count: number;
  quality_valid_percentage: number;
  last_model_run: string;
  last_rainfall_update: string;
  active_warnings_count: number;
  uptime_seconds: number;
  landslide_model_version: string;
  flashflood_model_version: string;
}

export interface EmergencyDispatch {
  id: string;
  dispatch_number: string; // e.g. "08/CĐ-PCTT"
  title: string;
  issuer: string; // e.g. "Ban Chỉ huy PCTT & TKCN Tỉnh Lào Cai"
  signer: string; // e.g. "Nguyễn Văn Hùng - Phó Trưởng Ban"
  issue_date: string;
  urgency_level: 'HOA_TOC' | 'KHAN' | 'THUONG';
  risk_level: RiskLevel;
  affected_provinces: string[];
  affected_districts: string[];
  affected_zones: string[];
  content: string;
  evacuation_instructions: string;
  sms_broadcast_text: string;
  broadcast_channels: ('SMS_BROADCAST' | 'RADIO_VNA' | 'ZALO_OA' | 'EMERGENCY_SIREN')[];
  status: 'DRAFT' | 'APPROVED' | 'TRANSMITTED';
  recipients_count: number;
  created_at: string;
}

export interface AdminUser {
  id: string;
  username: string;
  full_name: string;
  role: 'COMMANDER' | 'HYDRO_SPECIALIST' | 'TELEMETRY_ENGINEER' | 'ADMIN';
  role_label: string;
  department: string;
  phone: string;
  email: string;
  last_login: string;
  is_active: boolean;
  shift_status: 'ON_DUTY' | 'OFF_DUTY' | 'STANDBY';
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  user_name: string;
  user_role: string;
  action_type: 'UPDATE_THRESHOLD' | 'ADD_STATION' | 'EDIT_STATION' | 'DELETE_STATION' | 'DISPATCH_EMERGENCY' | 'ZONE_OVERRIDE' | 'SYSTEM_CONFIG';
  target: string;
  details: string;
  ip_address: string;
}

// ==========================================
// GOOGLE EARTH AI INTEGRATION TYPES
// ==========================================

export interface EarthAiSarDeformation {
  subsidence_rate_mm_year: number;
  line_of_sight_displacement_mm: number;
  tension_cracks_detected: boolean;
  tension_crack_count: number;
  crack_severity: 'NONE' | 'LOW' | 'MEDIUM' | 'CRITICAL';
  coherence_loss_index: number; // 0..1
  last_pass_date: string;
}

export interface EarthAiMultispectral {
  ndvi_current: number; // e.g. 0.58
  ndvi_anomaly_pct: number; // e.g. -19.5%
  bare_soil_exposure_pct: number; // e.g. 34%
  vegetation_stress_index: 'NORMAL' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
  canopy_water_content: number; // g/cm²
}

export interface EarthAiHydrologyMoisture {
  volumetric_soil_moisture_m3m3: number; // 0.1 .. 0.55
  pore_water_pressure_kpa: number; // kPa
  root_zone_saturation_pct: number; // %
  smap_satellite_pass: string;
  groundwater_table_depth_m: number;
}

export interface EarthAiDebrisRunout {
  source_volume_m3: number;
  max_runout_distance_m: number;
  peak_flow_velocity_ms: number;
  estimated_arrival_minutes: number;
  impact_zone_radius_m: number;
  blocked_roads: string[];
  inundation_corridor_coords: [number, number][]; // [lat, lng] points along flow path
}

export interface EarthAiCrossModalReasoning {
  deep_narrative: string;
  satellite_insight: string;
  telemetry_synthesis: string;
  risk_amplification_factor: number; // e.g. 1.45
  lead_time_enhancement: string;
  priority_action_steps: string[];
}

export interface EarthAiAnalysis {
  zone_id: string;
  zone_name: string;
  district_name: string;
  province_name: string;
  region: 'BAC_BO' | 'TRUNG_BO' | 'TAY_NGUYEN' | 'NAM_BO';
  analysis_timestamp: string;
  foundation_model_version: string;
  sar_deformation: EarthAiSarDeformation;
  multispectral: EarthAiMultispectral;
  hydrology_moisture: EarthAiHydrologyMoisture;
  debris_runout: EarthAiDebrisRunout;
  cross_modal_reasoning: EarthAiCrossModalReasoning;
  source: 'GOOGLE_EARTH_AI_FOUNDATION' | 'GEOSPATIAL_SIMULATOR';
}

// ==========================================
// 1. LSTM STREAMFLOW HYDROGRAPH TYPES
// ==========================================
export interface LstmHydrographPoint {
  hour_offset: number; // -24 to +24
  timestamp: string;
  rainfall_mm: number;
  observed_discharge_m3s: number | null; // For past hours
  predicted_discharge_m3s: number; // For past and future
  upper_bound_m3s: number; // 90% confidence
  lower_bound_m3s: number; // 10% confidence
  soil_moisture_saturation_pct: number;
  warning_stage_level: 0 | 1 | 2 | 3; // 0: Normal, 1: BD1, 2: BD2, 3: BD3
}

export interface LstmHydrographAnalysis {
  zone_id: string;
  zone_name: string;
  basin_name: string;
  basin_area_km2: number;
  current_discharge_m3s: number;
  peak_discharge_m3s: number;
  peak_time_offset_hours: number;
  peak_timestamp: string;
  time_to_peak_hours: number;
  warning_level_current: 0 | 1 | 2 | 3;
  warning_level_peak: 0 | 1 | 2 | 3;
  alarm_levels: {
    bd1_m3s: number; // Báo động 1
    bd2_m3s: number; // Báo động 2
    bd3_m3s: number; // Báo động 3
  };
  lstm_internals: {
    cell_state_retention: number; // 0..1 (Dung lượng trữ nước lưu vực)
    forget_gate_rate: number; // Tốc độ thoát nước ngầm
    input_gate_activation: number; // Độ nhạy với mưa bổ sung
    model_architecture: string;
  };
  hydrograph_points: LstmHydrographPoint[];
}

// ==========================================
// 2. RADAR DOPPLER NOWCASTING TYPES
// ==========================================
export interface RadarStationInfo {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  range_km: number;
  band: 'C-Band' | 'S-Band' | 'X-Band';
  status: 'ONLINE' | 'STANDBY' | 'CALIBRATING';
  last_sweep_time: string;
  max_reflectivity_dbz: number;
}

export interface RadarNowcastCell {
  id: string;
  name: string;
  center: [number, number]; // [lat, lng]
  reflectivity_dbz: number; // 35..65+ dBZ
  rainfall_rate_mmh: number; // Marshall-Palmer Z=200R^1.6
  echo_top_km: number; // 8..16 km
  vil_kg_m2: number; // Vertically Integrated Liquid
  velocity_kmh: number;
  direction_bearing_deg: number; // 0..360
  projected_impact_zones: string[];
  estimated_arrival_minutes: number;
  severity: 'MODERATE' | 'HEAVY' | 'EXTREME_CONVECTIVE';
}

export interface RadarNowcastMosaic {
  timestamp: string;
  total_active_radars: number;
  convective_cells_count: number;
  highest_reflectivity_dbz: number;
  radar_stations: RadarStationInfo[];
  convective_cells: RadarNowcastCell[];
  composite_sweep_coverage: string;
}

// ==========================================
// 3. MULTI-CHANNEL EMERGENCY DISPATCH TYPES
// ==========================================
export interface BroadcastTransmissionLog {
  id: string;
  dispatch_id: string;
  channel: 'CELL_BROADCAST' | 'SMS' | 'ZALO_OA' | 'EMERGENCY_SIREN' | 'COMMUNE_RADIO';
  channel_label: string;
  target_zone_name: string;
  target_province: string;
  target_recipients_est: number;
  successful_deliveries: number;
  failed_deliveries: number;
  status: 'TRANSMITTING' | 'COMPLETED' | 'QUEUED' | 'FAILED';
  transmitted_at: string;
  latency_ms: number;
  sample_message: string;
}

export interface BroadcastChannelOverview {
  cell_broadcast_bts_count: number;
  total_sms_subscribers: number;
  zalo_oa_followers_active: number;
  emergency_sirens_online: number;
  radio_speakers_online: number;
  system_ready: boolean;
}

// ==========================================
// 4. CROWDSOURCED SOCIAL MEDIA AI INTEL TYPES
// ==========================================
export interface SocialMediaPost {
  id: string;
  platform: 'FACEBOOK' | 'TIKTOK' | 'ZALO' | 'YOUTUBE';
  author_handle: string;
  author_badge?: 'LOCAL_RESIDENT' | 'COMMUNE_OFFICER' | 'TOURIST' | 'VOLUNTEER';
  original_text: string;
  extracted_location: {
    village_or_poi: string;
    commune_district: string;
    province: string;
    coords_estimated: [number, number]; // [lat, lng]
    zone_id_matched?: string;
  };
  event_category: 'TURBID_WATER_SURGE' | 'SLOPE_FISSURE_EXPLOSION' | 'ROAD_BRIDGE_WASHOUT' | 'TORRENTIAL_RAIN' | 'HOUSE_INUNDATION';
  event_category_label: string;
  evidence_media: {
    type: 'IMAGE' | 'VIDEO' | 'AUDIO_REPORT';
    media_url: string;
    cv_detected_features: string[]; // e.g. ["Dòng nước đục ngầu cuồn cuộn", "Sạt lở sườn taluy âm", "Cây đổ chắn ngang suối"]
    turbidity_index: number; // 0..1
  };
  posted_at: string;
  likes_shares_count: number;
  ai_confidence_score: number; // 0..100%
  verification_status: 'VERIFIED_BY_STATION' | 'CROSS_CORROBORATED' | 'PENDING_TRIAGE' | 'FALSE_POSITIVE';
  lead_time_gain_minutes: number; // Lead time gain e.g. 45 - 120 min before gauge threshold
}

export interface SocialIntelCluster {
  id: string;
  zone_id: string;
  zone_name: string;
  province_name: string;
  total_reports: number;
  dominant_hazard: string;
  urgency_score: number; // 0..100
  first_report_time: string;
  latest_report_time: string;
  key_evidence_summary: string;
  cross_validation_with_telemetry: string;
  suggested_commander_action: string;
  posts: SocialMediaPost[];
}

export interface SocialSensorOverview {
  total_scanned_posts_24h: number;
  actionable_alerts_count: number;
  active_clusters_count: number;
  average_lead_time_gain_minutes: number;
  clusters: SocialIntelCluster[];
  recent_live_feed: SocialMediaPost[];
}

// ==========================================
// THIÊN TAI KHÍ TƯỢNG CỰC ĐOAN (GIÔNG, SẤM SÉT, LỐC TỐ, MƯA ĐÁ, NGẬP LỤT ĐÔ THỊ & VEN SÔNG)
// ==========================================

export type SevereHazardType =
  | 'THUNDERSTORM_LIGHTNING' // Giông lốc & Sét đánh
  | 'TORNADO_SQUALL'         // Lốc xoáy, gió giật cục bộ
  | 'HAIL_STORM'             // Mưa đá kích thước lớn
  | 'URBAN_FLASH_FLOOD'      // Ngập lụt đô thị & điểm trũng thấp
  | 'RIVER_PONDING'          // Tràn đê bối & ngập hạ lưu;

export interface LightningStrikePoint {
  id: string;
  timestamp: string;
  coords: [number, number]; // [lat, lng]
  current_ka: number; // Cường độ dòng sét (kA), ví dụ -45.2 kA
  type: 'CLOUD_TO_GROUND' | 'INTRA_CLOUD'; // Sét đánh xuống đất vs Sét trong mây
  location_name: string;
  risk_level: 'EXTREME' | 'HIGH' | 'MODERATE';
}

export interface SevereWeatherAlert {
  id: string;
  hazard_type: SevereHazardType;
  hazard_name: string;
  severity_level: 'CRITICAL' | 'VERY_HIGH' | 'HIGH' | 'MODERATE';
  province: string;
  district_communes: string[];
  issued_at: string;
  valid_until: string;
  description: string;
  key_metrics: {
    wind_gust_kmh?: number;          // Tốc độ gió giật (km/h) - lốc xoáy
    hail_prob_pct?: number;          // Xác suất mưa đá (%)
    max_hail_diameter_cm?: number;   // Đường kính viên đá dự kiến (cm)
    lightning_flash_rate_per_min?: number; // Tần suất phóng điện sét (lần/phút)
    flood_depth_cm?: number;         // Độ sâu ngập lụt dự kiến (cm)
    inundation_area_ha?: number;     // Diện tích vùng ngập (ha)
    water_flow_speed_ms?: number;    // Vận tốc dòng nước tràn (m/s)
  };
  radar_cell_ref?: string;
  safety_instructions: string[];
  safe_shelters_count: number;
}

export interface UrbanFloodHotspot {
  id: string;
  name: string;
  city_province: string;
  district: string;
  current_depth_cm: number;
  projected_peak_depth_cm: number;
  peak_time_offset_min: number;
  drainage_capacity_pct: number; // Khả năng tiêu thoát nước hiện tại (%)
  traffic_status: 'PASSABLE' | 'RESTRICTED' | 'IMPASSABLE'; // Tình trạng giao thông
  pump_stations_active: number;
  historical_max_depth_cm: number;
  alert_level: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4';
}

export interface SevereWeatherOverview {
  active_alerts_count: number;
  total_lightning_strikes_1h: number;
  lightning_network_sensors_online: number;
  urban_flood_points_active: number;
  hail_risk_zones_count: number;
  tornado_risk_zones_count: number;
  alerts: SevereWeatherAlert[];
  recent_lightning_strikes: LightningStrikePoint[];
  urban_flood_hotspots: UrbanFloodHotspot[];
  lightning_density_grid: {
    lat: number;
    lng: number;
    intensity: number; // 0..1
    strikes_count: number;
  }[];
}

// ==========================================
// THÔNG TIN THỦY VĂN XUYÊN BIÊN GIỚI (CROSS-BORDER TRANSBOUNDARY HYDROLOGY)
// ==========================================

export interface CrossBorderReservoir {
  id: string;
  name: string;
  country: 'CHINA' | 'LAOS' | 'CAMBODIA';
  river_system: 'RED_RIVER_BASIN' | 'MEKONG_BASIN' | 'MA_CA_RIVER_BASIN';
  location_name: string;
  capacity_million_m3: number;
  current_water_level_m: number;
  max_water_level_m: number;
  current_discharge_m3s: number;
  discharge_status: 'NORMAL' | 'WARNING_INCREASING' | 'EMERGENCY_SPILLWAY';
  flow_travel_time_to_vietnam_hours: number;
  downstream_vietnam_entry_point: string;
  impact_risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  last_notified_time: string;
}

export interface TransboundaryBasinOverview {
  total_upstream_stations: number;
  online_stations: number;
  total_monitored_reservoirs: number;
  emergency_spillway_reservoirs: number;
  red_river_inflow_m3s: number;
  red_river_flood_trend: 'RISING_RAPIDLY' | 'STABLE' | 'RECEDING';
  mekong_inflow_m3s: number;
  mekong_flood_trend: 'RISING_RAPIDLY' | 'STABLE' | 'RECEDING';
  international_protocols: {
    protocol_name: string;
    bilateral_partner: string;
    frequency_sync: string;
    last_packet_received: string;
    status: 'ACTIVE' | 'DELAYED';
  }[];
  reservoirs: CrossBorderReservoir[];
  key_upstream_stations: RainfallStation[];
}

// ==========================================
// THÔNG TIN BÃO & ÁP THẤP NHIỆT ĐỚI BIỂN ĐÔNG (TYPHOON & TROPICAL CYCLONE LIVE TRACKER)
// ==========================================

export type TyphoonIntensityGrade =
  | 'SUPER_TYPHOON'           // Siêu bão cấp 16+ (≥185 km/h)
  | 'VIOLENT_TYPHOON'         // Bão rất mạnh cấp 14 - 15 (150 - 183 km/h)
  | 'TYPHOON'                 // Bão mạnh cấp 12 - 13 (118 - 149 km/h)
  | 'SEVERE_TROPICAL_STORM'   // Bão nhiệt đới dữ dội cấp 10 - 11 (89 - 117 km/h)
  | 'TROPICAL_STORM'          // Bão nhiệt đới cấp 8 - 9 (62 - 88 km/h)
  | 'TROPICAL_DEPRESSION'     // Áp thấp nhiệt đới cấp 6 - 7 (39 - 61 km/h)
  | 'TROPICAL_DISTURBANCE';   // Vùng áp thấp / nhiễu động nhiệt đới (<39 km/h)

export interface TyphoonTrackPoint {
  time_iso: string;
  time_display: string;
  coords: [number, number]; // [lat, lng]
  intensity: TyphoonIntensityGrade;
  intensity_label_vn: string;
  wind_speed_kmh: number;
  wind_speed_kts: number;
  wind_gust_kmh: number;
  beaufort_level: string; // e.g. "Cấp 14 (150-166 km/h), Giật cấp 17"
  central_pressure_hpa: number;
  moving_direction: string; // e.g. "Tây Tây Bắc (WNW - 290°)"
  moving_speed_kmh: number; // e.g. 15-20 km/h
  radius_gale_km_lv6: number; // Bán kính gió mạnh cấp 6 (≥39 km/h) ~ 250 - 350 km
  radius_storm_km_lv10: number; // Bán kính gió bão cấp 10 (≥89 km/h) ~ 120 - 180 km
  radius_destructive_km_lv12: number; // Bán kính gió bão cực mạnh cấp 12 (≥118 km/h) ~ 60 - 90 km
  is_forecast: boolean;
  forecast_agency?: 'NCHMF_VIETNAM' | 'JTWC_USA' | 'JMA_JAPAN' | 'ECMWF_EUROPE' | 'CONSENSUS';
  distance_to_vietnam_coast_km?: number;
}

export interface MultiModelForecastComparison {
  agency_id: 'NCHMF' | 'JTWC' | 'JMA' | 'ECMWF';
  agency_name: string;
  country: string;
  last_run_time: string;
  predicted_landfall_time: string;
  predicted_landfall_location: string;
  predicted_landfall_intensity: string;
  track_points: {
    hour_offset: number; // +12h, +24h, +36h, +48h, +72h
    coords: [number, number];
    wind_speed_kmh: number;
    central_pressure_hpa: number;
  }[];
}

export interface TyphoonStorm {
  id: string;
  storm_code: string; // e.g. "TY-2024-03" / "TY-2026-05"
  international_name: string; // e.g. "YAGI", "TRAMI", "KONG-REY"
  vietnam_number: string; // e.g. "Bão số 3 (2024)", "Bão số 5 (2026)"
  is_historical?: boolean; // True nếu là bão lưu trữ điển hình / diễn tập
  season_year?: number; // Ví dụ 2026 (hiện tại) hoặc 2024 (lịch sử)
  status: 'ACTIVE_DANGEROUS' | 'LANDFALL_IMMINENT' | 'WEAKENING_INLAND' | 'TROPICAL_DEPRESSION' | 'HISTORICAL_REFERENCE';
  current_category: TyphoonIntensityGrade;
  current_category_label: string;
  current_coords: [number, number]; // [lat, lng]
  current_wind_speed_kmh: number;
  current_wind_gust_kmh: number;
  current_pressure_hpa: number;
  beaufort_scale_str: string;
  moving_direction: string;
  moving_speed_kmh: number;
  distance_to_mainland_km: number;
  estimated_landfall_time: string;
  estimated_landfall_area: string;
  
  // Wave & Surge
  sea_wave_height_m: string; // e.g. "7.0 - 9.0m (Biển động dữ dội)"
  storm_surge_height_m: string; // e.g. "1.5 - 2.8m (Nguy cơ ngập đê biển)"
  
  // Track data
  past_track: TyphoonTrackPoint[];
  forecast_track: TyphoonTrackPoint[];
  cone_of_uncertainty: [number, number][][]; // Polygon coordinates
  
  // Impact Zones
  coastal_danger_zones: string[]; // e.g. ["Vùng biển Vịnh Bắc Bộ (Bạch Long Vĩ, Cô Tô)", "Quảng Ninh - Hải Phòng", "Thái Bình - Nam Định - Ninh Bình"]
  inland_torrential_rain_risk_zones: {
    province: string;
    expected_rainfall_mm: string;
    landslide_flashflood_risk: 'EXTREME' | 'VERY_HIGH' | 'HIGH';
    key_districts: string[];
  }[];
  
  // Multi-agency track comparison
  model_comparisons: MultiModelForecastComparison[];
  
  // Synoptic advisories
  synoptic_summary: string;
  official_bulletin_number: string;
  issuer: string;
  last_updated_time: string;
  safety_instructions: string[];
}

export interface TyphoonTrackingOverview {
  active_storms_count: number;
  tropical_depressions_count: number;
  highest_threat_storm_id: string;
  sea_surface_temperature_east_sea: number; // e.g. 30.2 °C
  basin_status_description: string;
  last_satellite_pass_time: string;
  storms: TyphoonStorm[];
}

// ==========================================
// HAEWS-HVU v2.0 DECISION SUPPORT & WAR ROOM
// ==========================================

export type OperationalViewMode = 'COMMANDER' | 'OPERATION' | 'FIELD' | 'INCIDENT';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'PROVINCE_COMMANDER'
  | 'OPERATION_OFFICER'
  | 'COMMUNE_FIELD_OFFICER'
  | 'RESCUE_TEAM'
  | 'VIEWER';

export type IncidentLifecycleStatus =
  | 'DETECTED'          // AI / Trạm phát hiện
  | 'AI_ANALYZED'       // AI phân tích nguyên nhân & chấm điểm
  | 'VERIFIED'          // Trực ban / chuyên môn xác nhận
  | 'ALERT_ISSUED'      // Đã ban hành cảnh báo
  | 'TASK_DISPATCHED'   // Đã giao nhiệm vụ ứng phó
  | 'RESPONDING'        // Lực lượng đang triển khai hiện trường
  | 'RESOLVED'          // Hoàn thành xử lý / an toàn
  | 'POST_AUDITED';     // Đã hậu kiểm & đánh giá rút kinh nghiệm

export type ResponseTaskPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ResponseTaskStatus =
  | 'UNASSIGNED'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'PENDING_VERIFICATION'
  | 'COMPLETED'
  | 'OVERDUE'
  | 'CANCELLED';

export interface ResponseTask {
  id: string;
  incidentId: string;
  title: string;
  description: string;
  assignedUnit: string;
  assigneeName: string;
  assigneePhone: string;
  priority: ResponseTaskPriority;
  deadline: string;
  status: ResponseTaskStatus;
  evidencePhotos: string[];
  fieldNotes: string;
  gpsLocation?: [number, number];
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  verifiedBy?: string;
}

export interface ExplainableFactor {
  key: string;
  name: string;
  value: string | number;
  unit?: string;
  scorePercent: number; // 0 - 100%
  weight: number; // weight in AI ensemble
  contribution: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';
  explanation: string;
}

export interface EvacuationShelter {
  id: string;
  name: string;
  zoneId: string;
  communeName: string;
  districtName: string;
  provinceName: string;
  coordinates: [number, number];
  capacityPeople: number;
  currentOccupants: number;
  elevationMeters: number;
  distanceKmFromHazard: number;
  contactPerson: string;
  contactPhone: string;
  facilities: {
    powerGenerator: boolean;
    cleanWaterSupply: boolean;
    medicalFirstAid: boolean;
    telecomSignal: boolean;
    foodRationsDays: number;
  };
  status: 'SAFE_OPEN' | 'NEAR_CAPACITY' | 'FULL' | 'ISOLATED';
}

export interface SafeRoute {
  id: string;
  fromArea: string;
  toShelterId: string;
  toShelterName: string;
  distanceKm: number;
  estimatedTravelMinutes: number;
  status: 'SAFE' | 'WARNING_WATERLOGGED' | 'DANGER_EROSION' | 'SEVERED_BLOCKED';
  chokePoints: string[];
  safeForVehicles: boolean;
  alternativeRouteNotes?: string;
}

export interface IncidentImpactAssessment {
  exposedPopulation: number;
  exposedHouseholds: number;
  elderlyAndChildrenCount: number;
  schoolsCount: number;
  medicalClinicsCount: number;
  vulnerableRoadsCount: number;
  blockedRoadNames: string[];
  bridgesAtRiskCount: number;
  criticalFacilities: string[];
  affectedAreaKm2: number;
  estimatedEconomicExposureBillionVND: number;
}

export interface TacticalOrder {
  id: string;
  orderNumber: string; // e.g. "LỆNH-0821/BCH-PCTT"
  type: 'EVACUATION' | 'ROAD_BLOCKADE' | 'FORCE_MOBILIZATION' | 'ALERT_BROADCAST' | 'RESERVOIR_DISCHARGE_ALERT' | 'RELIEF_DISPATCH';
  title: string;
  targetArea: string;
  issuedBy: string;
  issuedByRole: string;
  issuedAt: string;
  effectiveUntil: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'EXECUTING' | 'COMPLETED' | 'REVOKED';
  content: string;
  affectedPopulation: number;
  assignedUnits: string[];
}

export interface DisasterIncident {
  id: string; // e.g. "INC-SL-0821"
  incidentCode: string; // e.g. "SL-0821"
  name: string; // e.g. "Nguy cơ Sạt lở đất nghiêm trọng tại Xã La Pán Tẩn"
  type: RiskType;
  level: RiskLevel;
  riskScorePercent: number; // e.g. 86%
  confidencePercent: number; // e.g. 92%
  riskTrend: 'RISING_FAST' | 'RISING' | 'STABLE' | 'DECREASING';
  
  // Location
  zoneId: string;
  zoneName: string;
  districtName: string;
  provinceName: string;
  specificLocation: string; // e.g. "Thôn Trống Páo Sang & Km 285 QL32"
  coordinates: [number, number]; // [lat, lng]
  
  // Timeline & Status
  status: IncidentLifecycleStatus;
  detectedAt: string;
  timeToCriticalThresholdMinutes: number; // Countdown to threshold (e.g. 85 min = 1h25)
  leadTimeStatus: string;
  
  // 4 Core Dimensions: Risk - Time - Impact - Action
  impact: IncidentImpactAssessment;
  explainableFactors: ExplainableFactor[];
  aiRecommendation: string;
  decisionRequired: string; // Vấn đề Lãnh đạo cần quyết định
  
  // Operations & Response
  tasks: ResponseTask[];
  tacticalOrders: TacticalOrder[];
  shelters: EvacuationShelter[];
  safeRoutes: SafeRoute[];
  
  // Audit Timeline
  timeline: {
    time: string;
    stage: IncidentLifecycleStatus;
    actor: string;
    description: string;
  }[];
}

export interface MultiTierKPIs {
  // Commander View KPIs
  commander: {
    criticalIncidentsCount: number;
    highRiskZonesCount: number;
    monitoringZonesCount: number;
    totalExposedPopulation: number;
    totalExposedHouseholds: number;
    schoolsAtRisk: number;
    clinicsAtRisk: number;
    severedRoadsCount: number;
    overdueTasksCount: number;
    pendingDecisionsCount: number;
  };
  // Operation View KPIs
  operation: {
    onlineStationsRatio: string;
    dataQualityPercent: number;
    avgConfidenceScore: number;
    activeRadarEchoes: number;
    activeWarningsIssued: number;
    activeTasksInProgress: number;
  };
  // Field View KPIs
  field: {
    assignedCommuneTasks: number;
    completedCommuneTasks: number;
    evacuatedHouseholdsProgress: string; // e.g. "62/87"
    activeSheltersReady: number;
    supportRequestsPending: number;
  };
}

// ==========================================
// EARTHQUAKE & TSUNAMI WARNING SUBSYSTEM
// ==========================================

export type EarthquakeAlertLevel = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
export type TsunamiThreatLevel = 'NO_THREAT' | 'INFORMATION' | 'WATCH' | 'WARNING' | 'MAJOR_WARNING';

export interface EarthquakeEvent {
  id: string;
  source: 'VAST_IGP' | 'USGS' | 'GFZ' | 'JMA' | 'SIMULATED_TEST';
  event_code: string;
  timestamp: string;
  magnitude: number; // Richter / Mw (e.g. 5.4)
  depth_km: number; // Độ sâu chấn tiêu (km)
  latitude: number;
  longitude: number;
  location_name: string; // e.g. "Huyện Kon Plông, Kon Tum"
  province: string;
  intensity_mmi: string; // Thang đo MMI (e.g. "VI - Mạnh")
  p_wave_radius_km: number; // Bán kính sóng dọc P (km)
  s_wave_radius_km: number; // Bán kính sóng ngang S (km)
  alert_level: EarthquakeAlertLevel;
  aftershock_probability: number; // % (0-100)
  tsunami_potential: boolean;
  affected_districts: string[];
  fault_system?: string; // Tên đới đứt gãy kiến tạo liên quan
  felt_reports_count: number;
  official_bulletin_url?: string;
  guidance_summary: string;
}

export interface CoastalTsunamiForecast {
  coastal_station_code: string;
  coastal_station_name: string; // e.g. "Trạm Cửa Lò - Nghệ An", "Trạm Đà Nẵng", "Trạm Quy Nhơn"
  province: string;
  lat: number;
  lng: number;
  estimated_arrival_time: string; // e.g. "22:45, 22/08/2026"
  lead_time_minutes: number;
  max_wave_height_meters: number; // Chiều cao sóng cực đại (m)
  threat_level: TsunamiThreatLevel;
  evacuation_zone_elevation_m: number; // Ngưỡng sơ tán tối thiểu (m)
  status: 'PENDING' | 'ARRIVED' | 'PASSED';
}

export interface TsunamiAlert {
  id: string;
  bulletin_no: string;
  originating_earthquake_id: string;
  issued_at: string;
  source: 'IGP_VIETNAM' | 'PTWC_PACIFIC' | 'NWPTAC_JMA' | 'SIMULATED_MODEL';
  epicenter_location: string;
  earthquake_magnitude: number;
  threat_level: TsunamiThreatLevel;
  is_active: boolean;
  affected_coastal_provinces: string[];
  forecasts: CoastalTsunamiForecast[];
  evacuation_order: string;
  propagation_map_available: boolean;
}

export interface FaultLine {
  id: string;
  name: string; // e.g. "Đới đứt gãy Sông Hồng", "Đới đứt gãy Điện Biên - Lai Châu"
  category: 'STRIKE_SLIP' | 'NORMAL' | 'THRUST' | 'SUBDUCTION_ZONE';
  length_km: number;
  max_potential_magnitude: number;
  activity_level: 'VERY_ACTIVE' | 'ACTIVE' | 'MODERATE' | 'LOW';
  description: string;
  coordinates: [number, number][]; // LineString coords [lng, lat]
}

// -------------------------------------------------------------
// CITIZEN CROWDSOURCING & EVIDENCE FUSION TYPES (Dexuat 04-AI & 07-CITIZEN)
// -------------------------------------------------------------

export type CitizenHazardCategory =
  | 'LANDSLIDE_TALUY'     // Sạt lở taluy dương / taluy âm
  | 'FLASH_FLOOD_DEBRIS'  // Lũ quét, lũ bùn đá
  | 'INUNDATION_DEEP'     // Ngập sâu, cô lập
  | 'ROAD_BLOCKED'        // Tắc nghẽn / đứt gãy giao thông
  | 'SLOPE_CRACK'         // Vết nứt sườn đồi, nguy cơ sụt trượt
  | 'OVERFLOW_BRIDGE'     // Cầu tràn nước xiết nguy hiểm
  | 'RIVER_BANK_EROSION'; // Sạt lở bờ sông, bờ suối

export interface CitizenDisasterReport {
  id: string; // e.g. "CR-2026-0827-001"
  reporter_name?: string;
  reporter_phone?: string;
  hazard_category: CitizenHazardCategory;
  hazard_label: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  lat: number;
  lng: number;
  address_text: string;
  commune_name: string;
  district_name: string;
  province_name: string;
  description: string;
  estimated_affected_houses: number;
  has_casualties_or_trapped: boolean;
  images: string[];
  submitted_at: string;
  status: 'PENDING_AI_VERIFY' | 'VERIFIED_ACTIVE' | 'RESOLVED' | 'REJECTED';
  ai_credibility_score: number; // 0 - 100
  ai_verification_notes?: string;
  upvotes_count: number;
  offline_cached?: boolean;
}

export interface EvidenceItem {
  id: string;
  source_type: 'VRAIN_STATION' | 'SATELLITE_SOIL' | 'DEM_TOPOGRAPHY' | 'LSTM_RUNOFF' | 'CITIZEN_CROWD';
  source_label: string;
  evidence_title: string;
  value_display: string;
  weight_percent: number;
  confidence_level: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'ALERT_TRIGGERED' | 'WARNING' | 'NORMAL';
  provenance: string;
  timestamp: string;
}

// -------------------------------------------------------------
// GLOBAL DISASTER INTELLIGENCE & LANDSLIDE MONITOR TYPES
// -------------------------------------------------------------

export type GlobalDisasterCategory =
  | 'LANDSLIDE'
  | 'EARTHQUAKE'
  | 'CYCLONE'
  | 'FLOOD'
  | 'VOLCANO'
  | 'WILDFIRE'
  | 'SEVERE_STORM';

export type GlobalDisasterSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'ADVISORY';

export interface GlobalDisasterEvent {
  id: string;
  source_id?: string;
  source_provider: 'NASA_EONET' | 'USGS' | 'GDACS' | 'WMO' | 'GLOBAL_SEISMIC';
  title: string;
  title_vi: string;
  category: GlobalDisasterCategory;
  category_label_vi: string;
  severity: GlobalDisasterSeverity;
  status: 'ACTIVE' | 'ONGOING' | 'RESOLVED' | 'HISTORICAL';
  occurred_at: string;
  updated_at: string;
  lat: number;
  lng: number;
  country: string;
  location_name: string;
  magnitude_display?: string; // e.g. "M7.2", "Cat 5 (240km/h)", "Est. 2.5M m³"
  depth_km?: number;
  affected_population_est?: number;
  fatalities_est?: number;
  damage_summary_vi: string;
  description_en: string;
  satellite_evidence_url?: string;
  source_url?: string;
  ai_tactical_assessment_vi: string;
  lead_time_insight_vi?: string;
  affected_radius_km?: number;
}

export interface GlobalDisasterSummary {
  total_active_events: number;
  critical_events_count: number;
  landslides_count: number;
  earthquakes_count: number;
  cyclones_count: number;
  floods_count: number;
  last_synced_at: string;
  is_syncing: boolean;
  breaking_headline?: string;
  breaking_event?: GlobalDisasterEvent;
  events: GlobalDisasterEvent[];
}

// ==========================================
// GOOGLE DEEPMIND WEATHERNEXT 3 INTERFACES
// ==========================================

export interface WeatherNextHourlyPoint {
  hour_offset: number; // 0..24
  forecast_time: string;
  precipitation_mm: number;
  convective_rain_mm: number;
  convective_risk_index: number; // 0..100
  wind_speed_10m_kmh: number;
  wind_speed_100m_kmh: number; // 100m turbine height for energy & severe gust
  wind_direction_deg: number;
  temperature_c: number;
  relative_humidity: number;
  cloud_cover_percent: number;
  solar_radiation_wm2: number;
  severe_alert_flag: boolean;
  alert_level: 1 | 2 | 3 | 4 | 5;
}

export interface WeatherNextForecast {
  location_name: string;
  lat: number;
  lon: number;
  elevation_m: number;
  model_name: 'Google DeepMind WeatherNext 3';
  model_version: '3.0-Operational';
  spatial_resolution_km: 5;
  refresh_rate: '1 hour (Geostationary Satellite Ingested)';
  is_live_google_api: boolean;
  generated_at: string;
  hourly: WeatherNextHourlyPoint[];
  max_precip_1h: number;
  total_precip_24h: number;
  max_wind_100m_kmh: number;
  highest_convective_index: number;
  summary_vi: string;
}

export interface WeatherNextGridCell {
  cell_id: string;
  lat: number;
  lon: number;
  zone_name: string;
  province_name: string;
  elevation_m: number;
  precip_1h_mm: number;
  precip_3h_mm: number;
  precip_24h_mm: number;
  wind_100m_kmh: number;
  convective_score: number; // 0..100
  risk_level: 1 | 2 | 3 | 4 | 5;
  satellite_cloud_type: 'DEEP_CONVECTIVE' | 'STRATIFORM' | 'SCATTERED' | 'CLEAR';
}

export interface WeatherNextDiscrepancy {
  zone_id: string;
  zone_name: string;
  province_name: string;
  weathernext_rain_1h: number;
  openmeteo_rain_1h: number;
  rain_diff_mm: number;
  weathernext_risk_level: 1 | 2 | 3 | 4 | 5;
  openmeteo_risk_level: 1 | 2 | 3 | 4 | 5;
  applied_strategy: 'STRATEGY_A_WORST_CASE';
  applied_risk_level: 1 | 2 | 3 | 4 | 5;
  is_high_discrepancy: boolean;
  tactical_action_vi: string;
  reason_vi: string;
}

export interface WeatherNextStatus {
  service_status: 'ONLINE' | 'STANDBY' | 'DEGRADED';
  model_name: string;
  model_version: string;
  resolution_km: number;
  update_cadence: string;
  is_live_google_api: boolean;
  total_5km_cells_tracked: number;
  high_discrepancy_count: number;
  strategy_rule: string;
  last_updated_at: string;
  discrepancies: WeatherNextDiscrepancy[];
}



