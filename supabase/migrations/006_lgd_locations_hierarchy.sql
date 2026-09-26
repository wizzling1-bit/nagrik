-- ==========================================================
-- 006_lgd_locations_hierarchy.sql
-- OFFICIAL LOCAL GOVERNMENT DIRECTORY (LGD) GEOGRAPHIC HIERARCHY
-- State -> District -> Sub-District -> Village/Local Body
-- ==========================================================

-- 1. LGD STATES TABLE (36 States & Union Territories)
CREATE TABLE IF NOT EXISTS public.lgd_states (
    state_code INT PRIMARY KEY,
    state_name TEXT NOT NULL,
    state_name_local TEXT,
    census_2011_code TEXT,
    state_or_ut VARCHAR(2) NOT NULL DEFAULT 'S',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. LGD DISTRICTS TABLE (785 Districts)
CREATE TABLE IF NOT EXISTS public.lgd_districts (
    district_code INT PRIMARY KEY,
    state_code INT NOT NULL REFERENCES public.lgd_states(state_code) ON DELETE CASCADE,
    district_name TEXT NOT NULL,
    district_name_local TEXT,
    census_2011_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. LGD SUB-DISTRICTS TABLE (7,151 Tehsils / Taluks / Mandals / Blocks)
CREATE TABLE IF NOT EXISTS public.lgd_subdistricts (
    subdistrict_code INT PRIMARY KEY,
    district_code INT NOT NULL REFERENCES public.lgd_districts(district_code) ON DELETE CASCADE,
    state_code INT NOT NULL REFERENCES public.lgd_states(state_code) ON DELETE CASCADE,
    subdistrict_name TEXT NOT NULL,
    subdistrict_name_local TEXT,
    census_2011_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. LGD LOCAL BODIES & VILLAGES TABLE (7,411 Local Bodies / Municipalities / Panchayats with PIN Codes)
CREATE TABLE IF NOT EXISTS public.lgd_local_bodies (
    id BIGSERIAL PRIMARY KEY,
    local_body_code INT NOT NULL,
    local_body_name TEXT NOT NULL,
    local_body_type TEXT,
    pincode VARCHAR(10) NOT NULL,
    state_code INT NOT NULL REFERENCES public.lgd_states(state_code) ON DELETE CASCADE,
    district_code INT REFERENCES public.lgd_districts(district_code) ON DELETE SET NULL,
    subdistrict_code INT REFERENCES public.lgd_subdistricts(subdistrict_code) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_lgd_local_body_pincode UNIQUE (local_body_code, pincode)
);

-- 5. Add granular LGD references to contents table (100% backward compatible)
ALTER TABLE public.contents 
ADD COLUMN IF NOT EXISTS location_district TEXT,
ADD COLUMN IF NOT EXISTS location_subdistrict TEXT,
ADD COLUMN IF NOT EXISTS location_village TEXT,
ADD COLUMN IF NOT EXISTS location_pincode VARCHAR(10),
ADD COLUMN IF NOT EXISTS state_code INT REFERENCES public.lgd_states(state_code) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS district_code INT REFERENCES public.lgd_districts(district_code) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS subdistrict_code INT REFERENCES public.lgd_subdistricts(subdistrict_code) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS local_body_code INT;

-- 6. Indexes for lightning-fast cascading dropdown lookups and full-text search
CREATE INDEX IF NOT EXISTS idx_lgd_districts_state_code ON public.lgd_districts(state_code);
CREATE INDEX IF NOT EXISTS idx_lgd_subdistricts_district_code ON public.lgd_subdistricts(district_code);
CREATE INDEX IF NOT EXISTS idx_lgd_subdistricts_state_code ON public.lgd_subdistricts(state_code);
CREATE INDEX IF NOT EXISTS idx_lgd_local_bodies_state_code ON public.lgd_local_bodies(state_code);
CREATE INDEX IF NOT EXISTS idx_lgd_local_bodies_district_code ON public.lgd_local_bodies(district_code);
CREATE INDEX IF NOT EXISTS idx_lgd_local_bodies_subdistrict_code ON public.lgd_local_bodies(subdistrict_code);
CREATE INDEX IF NOT EXISTS idx_lgd_local_bodies_pincode ON public.lgd_local_bodies(pincode);

-- Case-insensitive search indexes
CREATE INDEX IF NOT EXISTS idx_lgd_states_name_lower ON public.lgd_states(LOWER(state_name));
CREATE INDEX IF NOT EXISTS idx_lgd_districts_name_lower ON public.lgd_districts(LOWER(district_name));
CREATE INDEX IF NOT EXISTS idx_lgd_subdistricts_name_lower ON public.lgd_subdistricts(LOWER(subdistrict_name));
CREATE INDEX IF NOT EXISTS idx_lgd_local_bodies_name_lower ON public.lgd_local_bodies(LOWER(local_body_name));

-- Contents location lookup indexes
CREATE INDEX IF NOT EXISTS idx_contents_location_state ON public.contents(location_state);
CREATE INDEX IF NOT EXISTS idx_contents_location_district ON public.contents(location_district);
CREATE INDEX IF NOT EXISTS idx_contents_location_pincode ON public.contents(location_pincode);

-- 7. Row Level Security: Allow public read access to all official geographic boundaries
ALTER TABLE public.lgd_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lgd_districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lgd_subdistricts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lgd_local_bodies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on lgd_states" ON public.lgd_states;
CREATE POLICY "Allow public read access on lgd_states" ON public.lgd_states FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on lgd_districts" ON public.lgd_districts;
CREATE POLICY "Allow public read access on lgd_districts" ON public.lgd_districts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on lgd_subdistricts" ON public.lgd_subdistricts;
CREATE POLICY "Allow public read access on lgd_subdistricts" ON public.lgd_subdistricts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on lgd_local_bodies" ON public.lgd_local_bodies;
CREATE POLICY "Allow public read access on lgd_local_bodies" ON public.lgd_local_bodies FOR SELECT USING (true);

-- Allow service_role / postgres full insert/update rights
DROP POLICY IF EXISTS "Allow service role full access on lgd_states" ON public.lgd_states;
CREATE POLICY "Allow service role full access on lgd_states" ON public.lgd_states FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role full access on lgd_districts" ON public.lgd_districts;
CREATE POLICY "Allow service role full access on lgd_districts" ON public.lgd_districts FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role full access on lgd_subdistricts" ON public.lgd_subdistricts;
CREATE POLICY "Allow service role full access on lgd_subdistricts" ON public.lgd_subdistricts FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role full access on lgd_local_bodies" ON public.lgd_local_bodies;
CREATE POLICY "Allow service role full access on lgd_local_bodies" ON public.lgd_local_bodies FOR ALL TO service_role USING (true) WITH CHECK (true);
