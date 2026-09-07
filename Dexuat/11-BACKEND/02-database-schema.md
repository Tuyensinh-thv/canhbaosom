# Database Schema

Core: administrative_units, spatial_grid, watersheds, rivers, roads, bridges, critical_facilities, evacuation_points; rainfall_stations/logs, river_stations/logs, weather_observations, camera_sources, iot_sensors; model_registry, model_runs, prediction_logs, feature_snapshots; risk_assessments, warning_events, risk_timelines; impact_assessments, affected_population/buildings/roads/facilities; incidents, incident_evidence, incident_status_history, incident_assignments; response_teams, vehicles, equipment, supplies, resource_locations, resource_assignments; citizen_reports, citizen_alerts, notification_logs; users, roles, permissions, audit_logs; sop_documents, knowledge_documents.

Rules: UUID; created_at/updated_at; soft delete where audit needs; FKs; constraints; spatial/time indexes; migration versioning.
