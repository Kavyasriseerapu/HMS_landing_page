-- Migration 002: Add version column to demo_requests

ALTER TABLE demo_requests ADD COLUMN IF NOT EXISTS version TEXT;

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'hms_api') THEN
    GRANT UPDATE (version) ON TABLE demo_requests TO hms_api;
  END IF;
END
$$;
