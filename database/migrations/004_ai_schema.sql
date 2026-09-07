-- =============================================
-- HAEWS v3.0 — Migration 004: AI Schema
-- AI predictions, model registry, feature store, evidence fusion, knowledge base
-- =============================================

-- ========================
-- AI Model Registry (đăng ký mô hình)
-- ========================
CREATE TABLE IF NOT EXISTS ai.model_registry (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_code VARCHAR(50) UNIQUE NOT NULL,
  model_name VARCHAR(200) NOT NULL,
  model_type VARCHAR(50) NOT NULL, -- FLASH_FLOOD, LANDSLIDE, OBSERVATION, SITUATION, TYPHOON_TRACK
  algorithm VARCHAR(100), -- XGBoost, LightGBM, LSTM, CNN, Transformer, Ensemble
  version VARCHAR(30) NOT NULL,
  
  -- Performance Metrics
  accuracy NUMERIC(5,4),
  f1_score NUMERIC(5,4),
  precision_score NUMERIC(5,4),
  recall_score NUMERIC(5,4),
  auc_roc NUMERIC(5,4),
  
  -- Configuration
  feature_count INTEGER,
  training_samples INTEGER,
  training_date DATE,
  hyperparameters JSONB DEFAULT '{}',
  
  is_active BOOLEAN DEFAULT TRUE,
  is_production BOOLEAN DEFAULT FALSE,
  description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default models
INSERT INTO ai.model_registry (model_code, model_name, model_type, algorithm, version, accuracy, f1_score, is_active, is_production, description) VALUES
  ('xgb-landslide-v2', 'XGBoost Landslide Predictor', 'LANDSLIDE', 'XGBoost', 'v2.0.4', 0.8850, 0.8720, TRUE, TRUE, 'Gradient Boosted Trees cho dự báo sạt lở đất vùng núi Bắc Bộ'),
  ('lgbm-flashflood-v2', 'LightGBM Flash Flood Predictor', 'FLASH_FLOOD', 'LightGBM', 'v2.0.4', 0.9020, 0.8890, TRUE, TRUE, 'LightGBM cho dự báo lũ quét lưu vực nhỏ'),
  ('lstm-hydro-v1', 'LSTM Streamflow Forecaster', 'FLASH_FLOOD', 'LSTM', 'v1.3.0', 0.8700, 0.8550, TRUE, FALSE, 'LSTM mạng neural cho dự báo lưu lượng dòng chảy 24h'),
  ('cnn-observation-v1', 'CNN Hazard Observation', 'OBSERVATION', 'CNN-ResNet50', 'v1.0.0', 0.8200, 0.8000, TRUE, FALSE, 'Computer Vision nhận diện nguy cơ từ ảnh/video camera'),
  ('gemini-situation-v1', 'Gemini Situation Analyst', 'SITUATION', 'Gemini-Pro', 'v1.0.0', NULL, NULL, TRUE, TRUE, 'LLM phân tích tình huống và tư vấn chiến thuật')
ON CONFLICT (model_code) DO NOTHING;

-- ========================
-- AI Predictions (kết quả dự báo)
-- ========================
CREATE TABLE IF NOT EXISTS ai.predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID REFERENCES ai.model_registry(id),
  model_code VARCHAR(50),
  
  zone_id UUID NOT NULL,
  zone_code VARCHAR(30),
  zone_name VARCHAR(200),
  district_name VARCHAR(100),
  province_name VARCHAR(100),
  
  predicted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  prediction_horizon_minutes INTEGER DEFAULT 0, -- 0 = nowcast, 30, 60, 120, 360
  
  -- Risk Assessment
  risk_type risk_type_enum NOT NULL,
  risk_level INTEGER NOT NULL CHECK (risk_level BETWEEN 1 AND 5),
  probability NUMERIC(5,4) NOT NULL CHECK (probability BETWEEN 0 AND 1),
  confidence model_confidence_enum DEFAULT 'MEDIUM',
  confidence_score NUMERIC(5,2) DEFAULT 0,
  
  -- Input Features (snapshot)
  rainfall_1h NUMERIC(8,2),
  rainfall_3h NUMERIC(8,2),
  rainfall_6h NUMERIC(8,2),
  rainfall_24h NUMERIC(8,2),
  rainfall_trend rainfall_trend_enum,
  soil_saturation_pct NUMERIC(5,2),
  antecedent_precip_index NUMERIC(8,2),
  
  -- Trigger
  trigger_type trigger_type_enum DEFAULT 'AI_MODEL',
  trigger_detail TEXT,
  
  -- Explainability
  contributing_factors JSONB DEFAULT '[]',
  explanation_summary TEXT,
  shap_values JSONB DEFAULT '{}',
  
  -- Projection
  projected_level_30m INTEGER,
  projected_level_60m INTEGER,
  
  -- Quality
  data_quality_flag quality_flag_enum DEFAULT 'VALID',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Feature Store (engineering cache)
-- ========================
CREATE TABLE IF NOT EXISTS ai.feature_store (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id UUID NOT NULL,
  zone_code VARCHAR(30),
  
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Engineered Features
  elevation_norm NUMERIC(5,4),
  slope_deg NUMERIC(6,2),
  slope_factor NUMERIC(5,4),
  geology_score NUMERIC(5,2),
  soil_saturation_est NUMERIC(5,2),
  rainfall_1h NUMERIC(8,2),
  rainfall_3h NUMERIC(8,2),
  rainfall_6h NUMERIC(8,2),
  rainfall_24h NUMERIC(8,2),
  rainfall_trend rainfall_trend_enum,
  rainfall_intensity_ratio NUMERIC(5,4),
  antecedent_precip_index NUMERIC(8,2),
  basin_stream_gradient NUMERIC(6,3),
  basin_accumulation_factor NUMERIC(5,4),
  
  -- Extra features
  ndvi_current NUMERIC(5,4),
  ndvi_anomaly_pct NUMERIC(6,2),
  sar_displacement_mm NUMERIC(8,3),
  soil_moisture_m3m3 NUMERIC(5,4),
  
  features_json JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Evidence Fusions (tổng hợp bằng chứng đa nguồn)
-- ========================
CREATE TABLE IF NOT EXISTS ai.evidence_fusions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id UUID NOT NULL,
  zone_name VARCHAR(200),
  
  fused_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Individual Source Scores
  telemetry_score NUMERIC(5,2), -- Score from station data
  satellite_score NUMERIC(5,2), -- Score from satellite analysis
  radar_score NUMERIC(5,2), -- Score from radar nowcast
  social_score NUMERIC(5,2), -- Score from social media intel
  iot_score NUMERIC(5,2), -- Score from IoT sensors
  camera_score NUMERIC(5,2), -- Score from camera AI
  historical_score NUMERIC(5,2), -- Score from historical pattern matching
  
  -- Fusion Result
  fused_risk_level INTEGER NOT NULL CHECK (fused_risk_level BETWEEN 1 AND 5),
  fused_probability NUMERIC(5,4),
  fused_confidence model_confidence_enum,
  fusion_method VARCHAR(50) DEFAULT 'BAYESIAN_WEIGHTED', -- BAYESIAN_WEIGHTED, DEMPSTER_SHAFER, ENSEMBLE_VOTE
  
  -- Evidence Details
  evidence_sources INTEGER DEFAULT 0,
  conflicting_sources TEXT[],
  dominant_evidence TEXT,
  narrative TEXT,
  
  -- Risk Amplification
  risk_amplification_factor NUMERIC(5,3) DEFAULT 1.0,
  lead_time_enhancement_minutes INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Situation Analyses (AI phân tích tình huống - Gemini)
-- ========================
CREATE TABLE IF NOT EXISTS ai.situation_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  analysis_scope VARCHAR(50) NOT NULL, -- ZONE, DISTRICT, PROVINCE, NATIONAL
  scope_id UUID, -- zone_id or province_id
  scope_name VARCHAR(200),
  
  analyzed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  model_used VARCHAR(50) DEFAULT 'gemini-pro',
  
  -- Analysis Content
  situation_summary TEXT NOT NULL,
  risk_narrative TEXT,
  meteorological_assessment TEXT,
  geological_assessment TEXT,
  hydrological_assessment TEXT,
  
  -- Recommendations
  priority_actions TEXT[],
  resource_requirements TEXT[],
  evacuation_recommendation TEXT,
  
  -- Scoring
  overall_threat_level INTEGER CHECK (overall_threat_level BETWEEN 1 AND 5),
  urgency_score NUMERIC(5,2),
  
  -- Metadata
  input_data_summary JSONB DEFAULT '{}',
  token_usage INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Knowledge Base (cơ sở tri thức)
-- ========================
CREATE TABLE IF NOT EXISTS ai.knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  category VARCHAR(50) NOT NULL, -- REGULATION, PROCEDURE, HISTORICAL_EVENT, TECHNICAL_GUIDE, LESSON_LEARNED, FAQ
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  
  -- Metadata
  source VARCHAR(200),
  document_code VARCHAR(100), -- e.g. "QD-19/2021/QD-TTg"
  effective_date DATE,
  region region_enum,
  hazard_types risk_type_enum[],
  
  -- Search
  tags TEXT[],
  language VARCHAR(10) DEFAULT 'vi',
  
  -- Vector Embedding (for RAG)
  -- Note: pgvector extension needed for vector type
  -- embedding vector(1536), -- OpenAI ada-002 dimension
  embedding_model VARCHAR(50),
  embedding_updated_at TIMESTAMPTZ,
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Knowledge Embeddings (vector search cho RAG)
-- ========================
CREATE TABLE IF NOT EXISTS ai.knowledge_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  knowledge_id UUID REFERENCES ai.knowledge_base(id) ON DELETE CASCADE,
  
  chunk_index INTEGER DEFAULT 0,
  chunk_text TEXT NOT NULL,
  chunk_tokens INTEGER,
  
  -- Store embedding as JSONB since pgvector may not be available
  embedding JSONB, -- Array of floats
  embedding_model VARCHAR(50),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- Earth AI Analysis (Google Earth AI integration)
-- ========================
CREATE TABLE IF NOT EXISTS ai.earth_ai_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id UUID NOT NULL,
  zone_name VARCHAR(200),
  district_name VARCHAR(100),
  province_name VARCHAR(100),
  region region_enum,
  
  analysis_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  foundation_model_version VARCHAR(50),
  
  -- SAR Deformation
  sar_subsidence_rate_mm_year NUMERIC(8,3),
  sar_displacement_mm NUMERIC(8,3),
  tension_cracks_detected BOOLEAN DEFAULT FALSE,
  tension_crack_count INTEGER DEFAULT 0,
  crack_severity VARCHAR(20) DEFAULT 'NONE', -- NONE, LOW, MEDIUM, CRITICAL
  coherence_loss_index NUMERIC(5,4),
  
  -- Multispectral
  ndvi_current NUMERIC(5,4),
  ndvi_anomaly_pct NUMERIC(6,2),
  bare_soil_exposure_pct NUMERIC(5,2),
  vegetation_stress_index VARCHAR(20) DEFAULT 'NORMAL',
  canopy_water_content NUMERIC(6,4),
  
  -- Hydrology & Moisture
  volumetric_soil_moisture NUMERIC(5,4),
  pore_water_pressure_kpa NUMERIC(8,2),
  root_zone_saturation_pct NUMERIC(5,2),
  groundwater_table_depth_m NUMERIC(6,2),
  
  -- Debris Runout Model
  debris_source_volume_m3 NUMERIC(10,2),
  debris_max_runout_m NUMERIC(8,2),
  debris_peak_velocity_ms NUMERIC(6,2),
  debris_arrival_minutes NUMERIC(6,1),
  debris_impact_radius_m NUMERIC(8,2),
  debris_blocked_roads TEXT[],
  
  -- Cross-Modal Reasoning
  deep_narrative TEXT,
  satellite_insight TEXT,
  risk_amplification_factor NUMERIC(5,3),
  priority_action_steps TEXT[],
  
  source VARCHAR(50) DEFAULT 'GEOSPATIAL_SIMULATOR',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
