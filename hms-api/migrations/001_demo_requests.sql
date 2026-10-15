-- Migration 001: Demo Requests Table & Limited Application Role

CREATE TABLE IF NOT EXISTS demo_requests (
  id BIGSERIAL PRIMARY KEY,
  request_id TEXT GENERATED ALWAYS AS ('HOSPAI-DEMO-' || lpad(id::text, 5, '0')) STORED,
  full_name TEXT NOT NULL,
  work_email TEXT NOT NULL,
  phone TEXT NOT NULL,
  hospital_name TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  designation TEXT,
  location TEXT,
  bed_count TEXT,
  message TEXT,
  interests TEXT[] NOT NULL DEFAULT '{}',
  preferred_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on (status, created_at DESC)
CREATE INDEX IF NOT EXISTS idx_demo_requests_status_created_at
  ON demo_requests (status, created_at DESC);

-- Unique index on request_id for fast lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_demo_requests_request_id
  ON demo_requests (request_id);

-- ============================================================================
-- Security: Limited Role 'hms_api'
-- Never use the postgres superuser in app code.
-- The API only needs SELECT, INSERT, and UPDATE(status).
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'hms_api') THEN
    CREATE ROLE hms_api WITH LOGIN PASSWORD 'change_this_hms_api_password';
  END IF;
END
$$;

DO $$
DECLARE
  db_name text;
BEGIN
  SELECT current_database() INTO db_name;
  EXECUTE format('GRANT CONNECT ON DATABASE %I TO hms_api', db_name);
END
$$;

GRANT USAGE ON SCHEMA public TO hms_api;
GRANT SELECT, INSERT, UPDATE (status) ON TABLE demo_requests TO hms_api;
GRANT USAGE, SELECT ON SEQUENCE demo_requests_id_seq TO hms_api;
