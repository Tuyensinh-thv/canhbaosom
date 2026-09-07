-- =============================================
-- HAEWS v3.0 — Migration 001: Enable Extensions
-- Trung Tâm Thông Minh Giám Sát & Cảnh Báo Sớm Thiên Tai
-- =============================================

-- PostGIS: Spatial data types, geometry columns, spatial indexing
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- pgcrypto for secure hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- pg_trgm for text search fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create all schemas
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS telemetry;
CREATE SCHEMA IF NOT EXISTS ai;
CREATE SCHEMA IF NOT EXISTS incident;
CREATE SCHEMA IF NOT EXISTS alert;
CREATE SCHEMA IF NOT EXISTS resource;
CREATE SCHEMA IF NOT EXISTS typhoon;
CREATE SCHEMA IF NOT EXISTS auth_ext;
CREATE SCHEMA IF NOT EXISTS simulation;

-- Grant usage on schemas to postgres role
GRANT USAGE ON SCHEMA core TO postgres;
GRANT USAGE ON SCHEMA telemetry TO postgres;
GRANT USAGE ON SCHEMA ai TO postgres;
GRANT USAGE ON SCHEMA incident TO postgres;
GRANT USAGE ON SCHEMA alert TO postgres;
GRANT USAGE ON SCHEMA resource TO postgres;
GRANT USAGE ON SCHEMA typhoon TO postgres;
GRANT USAGE ON SCHEMA auth_ext TO postgres;
GRANT USAGE ON SCHEMA simulation TO postgres;

-- Grant all privileges on all tables in schemas
ALTER DEFAULT PRIVILEGES IN SCHEMA core GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA telemetry GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA ai GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA incident GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA alert GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA resource GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA typhoon GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth_ext GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA simulation GRANT ALL ON TABLES TO postgres;

-- Custom ENUM types used across schemas
DO $$ BEGIN
  CREATE TYPE risk_level_enum AS ENUM ('1', '2', '3', '4', '5');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE risk_type_enum AS ENUM ('flash_flood', 'landslide', 'combined', 'earthquake', 'tsunami', 'typhoon', 'urban_flood', 'tornado', 'hail', 'lightning');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE quality_flag_enum AS ENUM ('VALID', 'WARNING', 'INVALID', 'MISSING');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE model_confidence_enum AS ENUM ('HIGH', 'MEDIUM', 'LOW');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE trigger_type_enum AS ENUM ('AI_MODEL', 'PHYSICAL_RULE', 'HYBRID_OVERRIDE', 'MANUAL_OVERRIDE', 'SOCIAL_SENSOR', 'SATELLITE_DETECTION');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE system_mode_enum AS ENUM ('REAL_TIME', 'DEMO', 'HISTORICAL_REPLAY', 'SIMULATION', 'MAINTENANCE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE station_status_enum AS ENUM ('ONLINE', 'WARNING', 'OFFLINE', 'CALIBRATING', 'DECOMMISSIONED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE incident_status_enum AS ENUM (
    'DETECTED', 'AI_ANALYZED', 'VERIFIED', 'ALERT_ISSUED',
    'TASK_DISPATCHED', 'RESPONDING', 'RESOLVED', 'POST_AUDITED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE task_status_enum AS ENUM (
    'UNASSIGNED', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS',
    'PENDING_VERIFICATION', 'COMPLETED', 'OVERDUE', 'CANCELLED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE task_priority_enum AS ENUM ('URGENT', 'HIGH', 'MEDIUM', 'LOW');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE urgency_level_enum AS ENUM ('HOA_TOC', 'KHAN', 'THUONG');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE region_enum AS ENUM ('BAC_BO', 'TRUNG_BO', 'TAY_NGUYEN', 'NAM_BO');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE geology_sensitivity_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE user_role_enum AS ENUM (
    'SUPER_ADMIN', 'PROVINCE_COMMANDER', 'OPERATION_OFFICER',
    'COMMUNE_FIELD_OFFICER', 'RESCUE_TEAM', 'VIEWER'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE typhoon_intensity_enum AS ENUM (
    'SUPER_TYPHOON', 'VIOLENT_TYPHOON', 'TYPHOON',
    'SEVERE_TROPICAL_STORM', 'TROPICAL_STORM',
    'TROPICAL_DEPRESSION', 'TROPICAL_DISTURBANCE'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE typhoon_status_enum AS ENUM (
    'ACTIVE_DANGEROUS', 'LANDFALL_IMMINENT', 'WEAKENING_INLAND',
    'TROPICAL_DEPRESSION', 'HISTORICAL_REFERENCE', 'DISSIPATED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE broadcast_channel_enum AS ENUM (
    'CELL_BROADCAST', 'SMS', 'ZALO_OA', 'EMERGENCY_SIREN',
    'COMMUNE_RADIO', 'TV_BROADCAST', 'MOBILE_APP', 'EMAIL'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE dispatch_status_enum AS ENUM ('DRAFT', 'APPROVED', 'TRANSMITTED', 'RECALLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status_enum AS ENUM (
    'PENDING_APPROVAL', 'APPROVED', 'EXECUTING', 'COMPLETED', 'REVOKED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE order_type_enum AS ENUM (
    'EVACUATION', 'ROAD_BLOCKADE', 'FORCE_MOBILIZATION',
    'ALERT_BROADCAST', 'RESERVOIR_DISCHARGE_ALERT', 'RELIEF_DISPATCH'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE rainfall_trend_enum AS ENUM ('RISING_SHARP', 'RISING', 'STABLE', 'DECREASING');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE tsunami_threat_enum AS ENUM ('NO_THREAT', 'INFORMATION', 'WATCH', 'WARNING', 'MAJOR_WARNING');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE earthquake_alert_enum AS ENUM ('GREEN', 'YELLOW', 'ORANGE', 'RED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
