-- ==========================================================
-- 002_postgis_and_spatial.sql
-- NAAGRIK PLATFORM - POSTGIS GEOSPATIAL RADAR EXTENSION
-- ==========================================================

-- 1. Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Add spatial columns to contents and locations
ALTER TABLE contents 
ADD COLUMN IF NOT EXISTS coordinates_geo geography(Point, 4326);

ALTER TABLE locations 
ADD COLUMN IF NOT EXISTS coordinates_geo geography(Point, 4326);

-- 3. Create Spatial GIST Indexes for sub-millisecond proximity queries
CREATE INDEX IF NOT EXISTS idx_contents_coordinates_geo 
ON contents USING GIST (coordinates_geo);

CREATE INDEX IF NOT EXISTS idx_locations_coordinates_geo 
ON locations USING GIST (coordinates_geo);

-- 4. Trigger Function: Automatically sync coordinates_geo from JSONB location coordinates
CREATE OR REPLACE FUNCTION sync_content_coordinates_geo()
RETURNS TRIGGER AS $$
DECLARE
    lat DOUBLE PRECISION;
    lng DOUBLE PRECISION;
BEGIN
    IF NEW.location IS NOT NULL THEN
        -- Try reading coordinates as JSON object { "coordinates": { "latitude": ..., "longitude": ... } }
        -- or direct { "latitude": ..., "longitude": ... }
        lat := COALESCE(
            (NEW.location->'coordinates'->>'latitude')::DOUBLE PRECISION,
            (NEW.location->>'latitude')::DOUBLE PRECISION
        );
        lng := COALESCE(
            (NEW.location->'coordinates'->>'longitude')::DOUBLE PRECISION,
            (NEW.location->>'longitude')::DOUBLE PRECISION
        );

        IF lat IS NOT NULL AND lng IS NOT NULL AND lat BETWEEN -90 AND 90 AND lng BETWEEN -180 AND 180 THEN
            NEW.coordinates_geo := ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_content_coordinates_geo ON contents;
CREATE TRIGGER trg_sync_content_coordinates_geo
BEFORE INSERT OR UPDATE OF location ON contents
FOR EACH ROW
EXECUTE FUNCTION sync_content_coordinates_geo();

-- Trigger for locations table
CREATE OR REPLACE FUNCTION sync_location_coordinates_geo()
RETURNS TRIGGER AS $$
DECLARE
    lat DOUBLE PRECISION;
    lng DOUBLE PRECISION;
BEGIN
    IF NEW.coordinates IS NOT NULL THEN
        lat := (NEW.coordinates->>'latitude')::DOUBLE PRECISION;
        lng := (NEW.coordinates->>'longitude')::DOUBLE PRECISION;

        IF lat IS NOT NULL AND lng IS NOT NULL AND lat BETWEEN -90 AND 90 AND lng BETWEEN -180 AND 180 THEN
            NEW.coordinates_geo := ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_location_coordinates_geo ON locations;
CREATE TRIGGER trg_sync_location_coordinates_geo
BEFORE INSERT OR UPDATE OF coordinates ON locations
FOR EACH ROW
EXECUTE FUNCTION sync_location_coordinates_geo();
