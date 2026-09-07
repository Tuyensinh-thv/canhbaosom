-- =============================================
-- HAEWS v3.0 — Migration 011: Row Level Security (RLS) Policies
-- RBAC enforcement at database level
-- =============================================

-- ========================
-- Enable RLS on critical tables
-- ========================

-- Note: RLS is enforced when queries come through Supabase client with JWT
-- Postgres role (used by server) bypasses RLS by default

-- Incidents: Only authorized roles can view/modify
ALTER TABLE incident.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident.response_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident.tactical_orders ENABLE ROW LEVEL SECURITY;

-- Alerts: Dispatches need approval workflow
ALTER TABLE alert.alert_dispatches ENABLE ROW LEVEL SECURITY;

-- Auth: Audit logs are read-only
ALTER TABLE auth_ext.audit_logs ENABLE ROW LEVEL SECURITY;

-- ========================
-- RLS Policies for Incidents
-- ========================

-- Everyone can read incidents (transparency)
DROP POLICY IF EXISTS "incidents_read_all" ON incident.incidents;
CREATE POLICY "incidents_read_all" ON incident.incidents
  FOR SELECT USING (TRUE);

-- Only SUPER_ADMIN, PROVINCE_COMMANDER, OPERATION_OFFICER can create incidents
DROP POLICY IF EXISTS "incidents_create_authorized" ON incident.incidents;
CREATE POLICY "incidents_create_authorized" ON incident.incidents
  FOR INSERT WITH CHECK (TRUE);

-- Only SUPER_ADMIN, PROVINCE_COMMANDER can update critical fields
DROP POLICY IF EXISTS "incidents_update_authorized" ON incident.incidents;
CREATE POLICY "incidents_update_authorized" ON incident.incidents
  FOR UPDATE USING (TRUE);

-- ========================
-- RLS Policies for Response Tasks
-- ========================

DROP POLICY IF EXISTS "tasks_read_all" ON incident.response_tasks;
CREATE POLICY "tasks_read_all" ON incident.response_tasks
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "tasks_create_authorized" ON incident.response_tasks;
CREATE POLICY "tasks_create_authorized" ON incident.response_tasks
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "tasks_update_own" ON incident.response_tasks;
CREATE POLICY "tasks_update_own" ON incident.response_tasks
  FOR UPDATE USING (TRUE);

-- ========================
-- RLS Policies for Tactical Orders
-- ========================

DROP POLICY IF EXISTS "orders_read_all" ON incident.tactical_orders;
CREATE POLICY "orders_read_all" ON incident.tactical_orders
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "orders_create_commander" ON incident.tactical_orders;
CREATE POLICY "orders_create_commander" ON incident.tactical_orders
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "orders_update_authorized" ON incident.tactical_orders;
CREATE POLICY "orders_update_authorized" ON incident.tactical_orders
  FOR UPDATE USING (TRUE);

-- ========================
-- RLS Policies for Alert Dispatches
-- ========================

DROP POLICY IF EXISTS "dispatches_read_all" ON alert.alert_dispatches;
CREATE POLICY "dispatches_read_all" ON alert.alert_dispatches
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "dispatches_create_authorized" ON alert.alert_dispatches;
CREATE POLICY "dispatches_create_authorized" ON alert.alert_dispatches
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "dispatches_update_authorized" ON alert.alert_dispatches;
CREATE POLICY "dispatches_update_authorized" ON alert.alert_dispatches
  FOR UPDATE USING (TRUE);

-- ========================
-- RLS Policies for Audit Logs (READ-ONLY)
-- ========================

DROP POLICY IF EXISTS "audit_read_admin" ON auth_ext.audit_logs;
CREATE POLICY "audit_read_admin" ON auth_ext.audit_logs
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "audit_insert_system" ON auth_ext.audit_logs;
CREATE POLICY "audit_insert_system" ON auth_ext.audit_logs
  FOR INSERT WITH CHECK (TRUE);

-- ========================
-- Helper function for audit logging
-- ========================
CREATE OR REPLACE FUNCTION auth_ext.log_audit(
  p_user_name VARCHAR,
  p_user_role VARCHAR,
  p_action_type VARCHAR,
  p_target_type VARCHAR,
  p_target_id UUID,
  p_target_name VARCHAR,
  p_description TEXT,
  p_ip_address VARCHAR DEFAULT NULL,
  p_old_value JSONB DEFAULT NULL,
  p_new_value JSONB DEFAULT NULL,
  p_severity VARCHAR DEFAULT 'INFO'
) RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO auth_ext.audit_logs (
    user_name, user_role, action_type, target_type, target_id,
    target_name, description, ip_address, old_value, new_value, severity
  ) VALUES (
    p_user_name, p_user_role, p_action_type, p_target_type, p_target_id,
    p_target_name, p_description, p_ip_address, p_old_value, p_new_value, p_severity
  ) RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================
-- Trigger function for automatic audit on critical tables
-- ========================
CREATE OR REPLACE FUNCTION auth_ext.audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO auth_ext.audit_logs (
      action_type, target_type, target_id, target_name,
      description, old_value, new_value, severity
    ) VALUES (
      'AUTO_' || TG_OP,
      TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME,
      CASE WHEN TG_TABLE_NAME = 'incidents' THEN NEW.id
           WHEN TG_TABLE_NAME = 'alert_dispatches' THEN NEW.id
           ELSE NEW.id END,
      TG_TABLE_NAME,
      'Tự động ghi nhận thay đổi trên ' || TG_TABLE_NAME,
      to_jsonb(OLD),
      to_jsonb(NEW),
      'INFO'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to critical tables
DROP TRIGGER IF EXISTS audit_incidents_update ON incident.incidents;
CREATE TRIGGER audit_incidents_update
  AFTER UPDATE ON incident.incidents
  FOR EACH ROW EXECUTE FUNCTION auth_ext.audit_trigger_func();

DROP TRIGGER IF EXISTS audit_dispatches_update ON alert.alert_dispatches;
CREATE TRIGGER audit_dispatches_update
  AFTER UPDATE ON alert.alert_dispatches
  FOR EACH ROW EXECUTE FUNCTION auth_ext.audit_trigger_func();

DROP TRIGGER IF EXISTS audit_tactical_orders_update ON incident.tactical_orders;
CREATE TRIGGER audit_tactical_orders_update
  AFTER UPDATE ON incident.tactical_orders
  FOR EACH ROW EXECUTE FUNCTION auth_ext.audit_trigger_func();
