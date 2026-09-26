-- ==========================================================
-- NAAGRIK PLATFORM - UNIFIED SUPABASE POSTGRESQL SCHEMA
-- Includes: Relational Tables, PostGIS Geospatial Extension,
-- Row Level Security (RLS) Policies, Atomic Stored Procedures,
-- and Supabase Auth Event Triggers.
-- ==========================================================

-- Enable Core Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ==========================================================
-- 1. TABLE DEFINITIONS
-- ==========================================================

-- 1.1 USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'CREATOR', 'ADMIN')),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT,
    profile_image TEXT,
    location JSONB DEFAULT '{"country": "India", "state": "Bihar", "city": "Patna", "area": "Kankarbagh"}'::jsonb,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED')),
    saved_content_ids UUID[] DEFAULT '{}',
    fcm_tokens TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 1.2 CREATORS TABLE
CREATE TABLE IF NOT EXISTS creators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    verification_status TEXT NOT NULL DEFAULT 'UNVERIFIED' CHECK (verification_status IN ('UNVERIFIED', 'PENDING', 'VERIFIED')),
    total_eligible_views BIGINT NOT NULL DEFAULT 0,
    available_balance NUMERIC(12, 6) NOT NULL DEFAULT 0.000000,
    lifetime_earnings NUMERIC(12, 6) NOT NULL DEFAULT 0.000000,
    total_paid NUMERIC(12, 6) NOT NULL DEFAULT 0.000000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_creators_user_id ON creators(user_id);
CREATE INDEX IF NOT EXISTS idx_creators_verification ON creators(verification_status);

-- 1.3 CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 1.4 LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country TEXT NOT NULL DEFAULT 'India',
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    area TEXT NOT NULL,
    coordinates JSONB,
    coordinates_geo geography(Point, 4326),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_locations_city_area ON locations(city, area);
CREATE INDEX IF NOT EXISTS idx_locations_coordinates_geo ON locations USING GIST (coordinates_geo);

-- 1.5 CONTENTS TABLE (News Articles & Eye-witness Byte Videos)
CREATE TABLE IF NOT EXISTS contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('ARTICLE', 'VIDEO')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    media_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    location JSONB NOT NULL DEFAULT '{"country": "India", "state": "Bihar", "city": "Patna", "area": "Kankarbagh"}'::jsonb,
    coordinates_geo geography(Point, 4326),
    moderation_status TEXT NOT NULL DEFAULT 'PENDING_REVIEW' CHECK (moderation_status IN ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'FLAGGED', 'PUBLISHED', 'ARCHIVED')),
    rejection_reason TEXT,
    publication_status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (publication_status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    views BIGINT NOT NULL DEFAULT 0,
    eligible_views BIGINT NOT NULL DEFAULT 0,
    likes INT NOT NULL DEFAULT 0,
    shares INT NOT NULL DEFAULT 0,
    saves INT NOT NULL DEFAULT 0,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_contents_feed ON contents(moderation_status, publication_status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_contents_creator ON contents(creator_id);
CREATE INDEX IF NOT EXISTS idx_contents_category ON contents(category_id);
CREATE INDEX IF NOT EXISTS idx_contents_coordinates_geo ON contents USING GIST (coordinates_geo);

-- 1.6 VIDEO VIEWS TABLE (Enforces max 3 monetized views ceiling rule)
CREATE TABLE IF NOT EXISTS video_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_id TEXT,
    video_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    counted_view_count INT NOT NULL DEFAULT 0 CHECK (counted_view_count >= 0 AND counted_view_count <= 3),
    last_viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_video_views_viewer CHECK (user_id IS NOT NULL OR device_id IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS idx_video_views_lookup ON video_views(video_id, COALESCE(user_id::text, device_id));

-- 1.7 ADVERTISEMENTS TABLE
CREATE TABLE IF NOT EXISTS advertisements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('BANNER', 'VIDEO', 'SPONSORED')),
    media_url TEXT NOT NULL,
    target_location JSONB,
    target_category UUID REFERENCES categories(id) ON DELETE SET NULL,
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ NOT NULL,
    frequency INT NOT NULL DEFAULT 4,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'EXPIRED')),
    clicks INT NOT NULL DEFAULT 0,
    impressions INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ads_status_dates ON advertisements(status, start_date, end_date);

-- 1.8 PAYOUT METHODS TABLE
CREATE TABLE IF NOT EXISTS payout_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('BANK', 'UPI')),
    bank_details JSONB,
    upi_id TEXT,
    is_default BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payout_methods_creator ON payout_methods(creator_id);

-- 1.9 PAYOUT REQUESTS TABLE (Enforces >= $10.00 minimum payout)
CREATE TABLE IF NOT EXISTS payout_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 10.00),
    payout_method_id UUID NOT NULL REFERENCES payout_methods(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'PAID', 'REJECTED', 'FAILED')),
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    transaction_reference TEXT,
    admin_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payout_requests_creator ON payout_requests(creator_id);
CREATE INDEX IF NOT EXISTS idx_payout_requests_status ON payout_requests(status);

-- 1.10 SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL DEFAULT 'DEFAULT',
    min_payout_amount NUMERIC(10, 2) NOT NULL DEFAULT 10.00,
    earning_rate_per_1000_views NUMERIC(10, 4) NOT NULL DEFAULT 1.0000,
    max_counted_views_per_video INT NOT NULL DEFAULT 3,
    ad_feed_frequency INT NOT NULL DEFAULT 4,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1.11 REPORTS TABLE
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reporter_device_id TEXT,
    content_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RESOLVED', 'DISMISSED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reports_content ON reports(content_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- 1.12 AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_email TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    metadata JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- 1.13 NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'GENERAL',
    read BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read);

-- 1.14 CMS LEGAL & EDITORIAL PAGES TABLE
CREATE TABLE IF NOT EXISTS cms_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON cms_pages(slug);

-- ==========================================================
-- 2. AUTOMATIC POSTGIS COORDINATES SYNC TRIGGERS
-- ==========================================================

CREATE OR REPLACE FUNCTION sync_content_coordinates_geo()
RETURNS TRIGGER AS $$
DECLARE
    lat DOUBLE PRECISION;
    lng DOUBLE PRECISION;
BEGIN
    IF NEW.location IS NOT NULL THEN
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

-- ==========================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_creator()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.creators 
        WHERE user_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'CREATOR'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_current_creator_id()
RETURNS UUID AS $$
    SELECT id FROM creators WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;

-- Policies for Users
CREATE POLICY "Public can view basic author profiles" ON users FOR SELECT USING (status = 'ACTIVE');
CREATE POLICY "Users can view their own record" ON users FOR SELECT USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.users WHERE id = auth.uid()) AND status = (SELECT status FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Admins have full access to users" ON users FOR ALL USING (public.is_admin());

-- Policies for Creators
CREATE POLICY "Public can view verified creators" ON creators FOR SELECT USING (verification_status = 'VERIFIED');
CREATE POLICY "Creators can view and update their own creator profile" ON creators FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Creators can update own bio" ON creators FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins have full access to creators" ON creators FOR ALL USING (public.is_admin());

-- Policies for Categories
CREATE POLICY "Public can view active categories" ON categories FOR SELECT USING (status = 'ACTIVE' OR public.is_admin());
CREATE POLICY "Admins have full access to categories" ON categories FOR ALL USING (public.is_admin());

-- Policies for Locations
CREATE POLICY "Public can view locations" ON locations FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Admins have full access to locations" ON locations FOR ALL USING (public.is_admin());

-- Policies for Contents
CREATE POLICY "Public can view approved and published contents" ON contents FOR SELECT 
USING ((moderation_status = 'APPROVED' AND publication_status = 'PUBLISHED') OR (creator_id = public.get_current_creator_id()) OR public.is_admin());
CREATE POLICY "Creators can insert own content" ON contents FOR INSERT WITH CHECK (public.is_admin() OR (creator_id = public.get_current_creator_id() AND moderation_status IN ('DRAFT', 'PENDING_REVIEW') AND publication_status IN ('DRAFT', 'PUBLISHED') AND COALESCE(views, 0) = 0 AND COALESCE(eligible_views, 0) = 0));
CREATE POLICY "Creators can update own content" ON contents FOR UPDATE USING (creator_id = public.get_current_creator_id() OR public.is_admin()) WITH CHECK (public.is_admin() OR (creator_id = public.get_current_creator_id() AND moderation_status IN ('DRAFT', 'PENDING_REVIEW') AND views = (SELECT views FROM contents WHERE id = contents.id) AND eligible_views = (SELECT eligible_views FROM contents WHERE id = contents.id)));
CREATE POLICY "Creators can delete own content" ON contents FOR DELETE USING (creator_id = public.get_current_creator_id() OR public.is_admin());

-- Policies for Video Views
CREATE POLICY "Public and anonymous consumers can register video views" ON video_views FOR INSERT TO PUBLIC WITH CHECK (true);
CREATE POLICY "View records are viewable by owner or admin" ON video_views FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

-- Policies for Advertisements
CREATE POLICY "Public can view active advertisements" ON advertisements FOR SELECT USING (status = 'ACTIVE' AND NOW() BETWEEN start_date AND end_date OR public.is_admin());
CREATE POLICY "Admins have full access to advertisements" ON advertisements FOR ALL USING (public.is_admin());

-- Policies for Payout Methods
CREATE POLICY "Creators can manage their own payout methods" ON payout_methods FOR ALL USING (creator_id = public.get_current_creator_id() OR public.is_admin()) WITH CHECK (creator_id = public.get_current_creator_id() OR public.is_admin());

-- Policies for Payout Requests
CREATE POLICY "Creators can view their own payout requests" ON payout_requests FOR SELECT USING (creator_id = public.get_current_creator_id() OR public.is_admin());
CREATE POLICY "Creators can submit payout requests" ON payout_requests FOR INSERT WITH CHECK (creator_id = public.get_current_creator_id() OR public.is_admin());
CREATE POLICY "Admins can update payout requests" ON payout_requests FOR UPDATE USING (public.is_admin());

-- Policies for System Settings
CREATE POLICY "Public can view system settings" ON system_settings FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Admins can update system settings" ON system_settings FOR ALL USING (public.is_admin());

-- Policies for Reports
CREATE POLICY "Public can submit content reports" ON reports FOR INSERT TO PUBLIC WITH CHECK (true);
CREATE POLICY "Admins have full access to reports" ON reports FOR ALL USING (public.is_admin());

-- Policies for Audit Logs
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (public.is_admin());
CREATE POLICY "System can record audit logs" ON audit_logs FOR INSERT TO PUBLIC WITH CHECK (true);

-- Policies for Notifications
CREATE POLICY "Users can view and manage their own notifications" ON notifications FOR ALL USING (user_id = auth.uid() OR public.is_admin()) WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- Policies for CMS Pages
CREATE POLICY "Public can view published CMS pages" ON cms_pages FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "Admins have full access to CMS pages" ON cms_pages FOR ALL USING (public.is_admin());

-- ==========================================================
-- 4. ATOMIC STORED PROCEDURES & RPCS
-- ==========================================================

-- 4.1 TRACK VIDEO VIEW
CREATE OR REPLACE FUNCTION public.track_video_view(
    p_video_id UUID,
    p_user_id UUID DEFAULT NULL,
    p_device_id TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_video RECORD;
    v_creator RECORD;
    v_settings RECORD;
    v_view_record RECORD;
    v_max_views INT := 3;
    v_rate_per_1000 NUMERIC(10, 4) := 1.0000;
    v_is_eligible BOOLEAN := FALSE;
    v_counted_views INT := 0;
    v_current_views BIGINT;
    v_current_eligible BIGINT;
    v_view_earning NUMERIC(12, 6);
    v_viewer_id TEXT;
BEGIN
    v_viewer_id := COALESCE(p_user_id::text, p_device_id);
    IF v_viewer_id IS NULL OR v_viewer_id = '' THEN
        v_viewer_id := 'anonymous_device';
    END IF;

    SELECT * INTO v_video FROM contents WHERE id = p_video_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Video content not found: %', p_video_id;
    END IF;

    v_current_views := COALESCE(v_video.views, 0) + 1;
    v_current_eligible := COALESCE(v_video.eligible_views, 0);

    UPDATE contents 
    SET views = v_current_views, updated_at = NOW() 
    WHERE id = p_video_id;

    SELECT * INTO v_settings FROM system_settings WHERE key = 'DEFAULT' LIMIT 1;
    IF FOUND THEN
        v_max_views := COALESCE(v_settings.max_counted_views_per_video, 3);
        v_rate_per_1000 := COALESCE(v_settings.earning_rate_per_1000_views, 1.0000);
    END IF;

    SELECT * INTO v_view_record 
    FROM video_views 
    WHERE video_id = p_video_id 
      AND (
          (p_user_id IS NOT NULL AND user_id = p_user_id)
          OR (p_user_id IS NULL AND device_id = p_device_id)
      )
    FOR UPDATE;

    IF NOT FOUND THEN
        IF v_counted_views < v_max_views THEN
            v_counted_views := 1;
            -- Anti-fraud: Only authenticated users can qualify views for creator monetization.
            IF p_user_id IS NOT NULL THEN
                v_is_eligible := TRUE;
            END IF;
        END IF;

        INSERT INTO video_views (user_id, device_id, video_id, counted_view_count, last_viewed_at)
        VALUES (p_user_id, p_device_id, p_video_id, v_counted_views, NOW());
    ELSE
        v_counted_views := COALESCE(v_view_record.counted_view_count, 0);
        IF v_counted_views < v_max_views THEN
            v_counted_views := v_counted_views + 1;
            IF p_user_id IS NOT NULL THEN
                v_is_eligible := TRUE;
            END IF;

            UPDATE video_views 
            SET counted_view_count = v_counted_views, 
                last_viewed_at = NOW(),
                updated_at = NOW()
            WHERE id = v_view_record.id;
        ELSE
            UPDATE video_views 
            SET last_viewed_at = NOW(),
                updated_at = NOW()
            WHERE id = v_view_record.id;
        END IF;
    END IF;

    IF v_is_eligible THEN
        v_current_eligible := v_current_eligible + 1;
        UPDATE contents 
        SET eligible_views = v_current_eligible 
        WHERE id = p_video_id;

        v_view_earning := (v_rate_per_1000 / 1000.0);

        SELECT * INTO v_creator FROM creators WHERE id = v_video.creator_id FOR UPDATE;
        IF FOUND THEN
            UPDATE creators 
            SET total_eligible_views = COALESCE(total_eligible_views, 0) + 1,
                available_balance = ROUND(COALESCE(available_balance, 0) + v_view_earning, 6),
                lifetime_earnings = ROUND(COALESCE(lifetime_earnings, 0) + v_view_earning, 6),
                updated_at = NOW()
            WHERE id = v_creator.id;
        END IF;
    END IF;

    RETURN jsonb_build_object(
        'success', TRUE,
        'isEligibleView', v_is_eligible,
        'currentCountedViews', v_counted_views,
        'totalViews', v_current_views,
        'eligibleViews', v_current_eligible
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4.2 REQUEST PAYOUT
CREATE OR REPLACE FUNCTION public.request_payout(
    p_creator_id UUID,
    p_amount NUMERIC,
    p_payout_method_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_creator RECORD;
    v_method RECORD;
    v_settings RECORD;
    v_min_amount NUMERIC := 10.00;
    v_payout_request RECORD;
BEGIN
    -- Verify caller ownership: caller must own p_creator_id or be an ADMIN
    IF p_creator_id <> public.get_current_creator_id() AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: cannot request payouts for another creator';
    END IF;

    SELECT * INTO v_settings FROM system_settings WHERE key = 'DEFAULT' LIMIT 1;
    IF FOUND THEN
        v_min_amount := COALESCE(v_settings.min_payout_amount, 10.00);
    END IF;

    IF p_amount < v_min_amount THEN
        RAISE EXCEPTION 'Requested payout amount $% is below minimum threshold of $%', p_amount, v_min_amount;
    END IF;

    SELECT * INTO v_creator FROM creators WHERE id = p_creator_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Creator profile not found: %', p_creator_id;
    END IF;

    IF COALESCE(v_creator.available_balance, 0) < p_amount THEN
        RAISE EXCEPTION 'Insufficient available balance ($%). Cannot request $%', v_creator.available_balance, p_amount;
    END IF;

    SELECT * INTO v_method FROM payout_methods WHERE id = p_payout_method_id;
    IF NOT FOUND OR v_method.creator_id <> p_creator_id THEN
        RAISE EXCEPTION 'Invalid payout method: %', p_payout_method_id;
    END IF;

    UPDATE creators 
    SET available_balance = ROUND(available_balance - p_amount, 6),
        updated_at = NOW()
    WHERE id = p_creator_id;

    INSERT INTO payout_requests (creator_id, amount, payout_method_id, status, requested_at)
    VALUES (p_creator_id, p_amount, p_payout_method_id, 'PENDING', NOW())
    RETURNING * INTO v_payout_request;

    RETURN to_jsonb(v_payout_request);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4.3 ADMIN MODERATE CONTENT
CREATE OR REPLACE FUNCTION public.admin_moderate_content(
    p_content_id UUID,
    p_moderation_status TEXT,
    p_rejection_reason TEXT DEFAULT NULL,
    p_admin_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_content RECORD;
    v_admin_email TEXT := 'admin@nagrik.news';
    v_is_approved BOOLEAN := (p_moderation_status = 'APPROVED');
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: only platform admins can perform moderation';
    END IF;

    SELECT * INTO v_content FROM contents WHERE id = p_content_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Content not found: %', p_content_id;
    END IF;

    IF p_admin_id IS NOT NULL THEN
        SELECT email INTO v_admin_email FROM users WHERE id = p_admin_id;
    END IF;

    UPDATE contents
    SET moderation_status = p_moderation_status,
        publication_status = CASE WHEN v_is_approved THEN 'PUBLISHED' ELSE 'DRAFT' END,
        published_at = CASE WHEN v_is_approved THEN NOW() ELSE published_at END,
        rejection_reason = CASE WHEN NOT v_is_approved THEN p_rejection_reason ELSE NULL END,
        updated_at = NOW()
    WHERE id = p_content_id
    RETURNING * INTO v_content;

    INSERT INTO audit_logs (actor_id, actor_email, actor_role, action, entity, entity_id, metadata)
    VALUES (
        COALESCE(p_admin_id, auth.uid()),
        v_admin_email,
        'ADMIN',
        'CONTENT_MODERATION_' || p_moderation_status,
        'Content',
        p_content_id::text,
        jsonb_build_object('status', p_moderation_status, 'rejectionReason', p_rejection_reason)
    );

    RETURN to_jsonb(v_content);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4.4 ADMIN PROCESS PAYOUT
CREATE OR REPLACE FUNCTION public.admin_process_payout(
    p_payout_id UUID,
    p_status TEXT,
    p_transaction_reference TEXT DEFAULT NULL,
    p_admin_note TEXT DEFAULT NULL,
    p_admin_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_request RECORD;
    v_admin_email TEXT := 'admin@nagrik.news';
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: only platform admins can process payouts';
    END IF;

    SELECT * INTO v_request FROM payout_requests WHERE id = p_payout_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payout request not found: %', p_payout_id;
    END IF;

    IF v_request.status = 'PAID' THEN
        RAISE EXCEPTION 'Payout request is already PAID';
    END IF;

    IF p_status = 'PAID' AND (p_transaction_reference IS NULL OR trim(p_transaction_reference) = '') THEN
        RAISE EXCEPTION 'Transaction reference / UTR is required when marking as PAID';
    END IF;

    IF p_status = 'PAID' THEN
        UPDATE payout_requests
        SET status = 'PAID',
            transaction_reference = p_transaction_reference,
            admin_note = p_admin_note,
            processed_at = NOW(),
            updated_at = NOW()
        WHERE id = p_payout_id;

        UPDATE creators 
        SET total_paid = ROUND(COALESCE(total_paid, 0) + v_request.amount, 6),
            updated_at = NOW()
        WHERE id = v_request.creator_id;

    ELSIF p_status = 'REJECTED' THEN
        UPDATE payout_requests
        SET status = 'REJECTED',
            admin_note = COALESCE(p_admin_note, 'Rejected by platform admin'),
            processed_at = NOW(),
            updated_at = NOW()
        WHERE id = p_payout_id;

        UPDATE creators 
        SET available_balance = ROUND(COALESCE(available_balance, 0) + v_request.amount, 6),
            updated_at = NOW()
        WHERE id = v_request.creator_id;
    ELSE
        UPDATE payout_requests
        SET status = p_status,
            admin_note = p_admin_note,
            updated_at = NOW()
        WHERE id = p_payout_id;
    END IF;

    INSERT INTO audit_logs (actor_id, actor_email, actor_role, action, entity, entity_id, metadata)
    VALUES (
        COALESCE(p_admin_id, auth.uid()),
        v_admin_email,
        'ADMIN',
        'PAYOUT_REQUEST_' || p_status,
        'PayoutRequest',
        p_payout_id::text,
        jsonb_build_object('amount', v_request.amount, 'status', p_status, 'transactionReference', p_transaction_reference)
    );

    SELECT * INTO v_request FROM payout_requests WHERE id = p_payout_id;
    RETURN to_jsonb(v_request);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4.5 GET CREATOR DASHBOARD STATS
CREATE OR REPLACE FUNCTION public.get_creator_dashboard_stats(p_creator_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_creator RECORD;
    v_total_views BIGINT := 0;
    v_total_eligible_views BIGINT := 0;
    v_total_contents BIGINT := 0;
    v_approved_contents BIGINT := 0;
    v_pending_contents BIGINT := 0;
    v_rejected_contents BIGINT := 0;
    v_settings RECORD;
    v_earning_rate NUMERIC(10, 4) := 1.5000;
BEGIN
    SELECT * INTO v_creator FROM public.creators 
    WHERE id = p_creator_id OR user_id = p_creator_id 
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Creator not found');
    END IF;

    SELECT earning_rate_per_1000_views INTO v_settings FROM public.system_settings LIMIT 1;
    IF FOUND AND v_settings.earning_rate_per_1000_views IS NOT NULL THEN
        v_earning_rate := v_settings.earning_rate_per_1000_views;
    END IF;

    SELECT 
        COALESCE(SUM(views), 0),
        COALESCE(SUM(eligible_views), 0),
        COUNT(*),
        COUNT(*) FILTER (WHERE moderation_status = 'APPROVED'),
        COUNT(*) FILTER (WHERE moderation_status = 'PENDING_REVIEW'),
        COUNT(*) FILTER (WHERE moderation_status = 'REJECTED')
    INTO 
        v_total_views,
        v_total_eligible_views,
        v_total_contents,
        v_approved_contents,
        v_pending_contents,
        v_rejected_contents
    FROM public.contents
    WHERE creator_id = v_creator.id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'creator_id', v_creator.id,
        'user_id', v_creator.user_id,
        'available_balance', v_creator.available_balance,
        'lifetime_earnings', v_creator.lifetime_earnings,
        'total_paid', v_creator.total_paid,
        'total_views', v_total_views,
        'total_eligible_views', v_total_eligible_views,
        'total_reports', v_total_contents,
        'approved_reports', v_approved_contents,
        'pending_reports', v_pending_contents,
        'rejected_reports', v_rejected_contents,
        'earning_rate_per_1000_views', v_earning_rate,
        'cpm_inr', round(v_earning_rate * 86.5, 2)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4.6 GET FEED (Location-prioritized or 5km radar with interleaved ads matching mobile contract)
CREATE OR REPLACE FUNCTION public.get_feed(
    p_city TEXT DEFAULT NULL,
    p_area TEXT DEFAULT NULL,
    p_state TEXT DEFAULT NULL,
    p_country TEXT DEFAULT NULL,
    p_content_type TEXT DEFAULT NULL,
    p_lat DOUBLE PRECISION DEFAULT NULL,
    p_lng DOUBLE PRECISION DEFAULT NULL,
    p_radius_km DOUBLE PRECISION DEFAULT 5.0,
    p_page INT DEFAULT 1,
    p_limit INT DEFAULT 20
)
RETURNS JSONB AS $$
DECLARE
    v_offset INT := (GREATEST(p_page, 1) - 1) * p_limit;
    v_total_items INT := 0;
    v_total_pages INT := 1;
    v_items JSONB := '[]'::jsonb;
    v_ads JSONB := '[]'::jsonb;
    v_result_items JSONB := '[]'::jsonb;
    v_ad_frequency INT := 4;
    v_settings RECORD;
    v_item RECORD;
    v_ad_idx INT := 0;
    v_ads_count INT := 0;
    v_item_counter INT := 0;
    v_point geography;
BEGIN
    SELECT * INTO v_settings FROM system_settings WHERE key = 'DEFAULT' LIMIT 1;
    IF FOUND THEN
        v_ad_frequency := COALESCE(v_settings.ad_feed_frequency, 4);
    END IF;

    SELECT COALESCE(jsonb_agg(to_jsonb(a)), '[]'::jsonb), COUNT(*)
    INTO v_ads, v_ads_count
    FROM advertisements a
    WHERE a.status = 'ACTIVE' AND NOW() BETWEEN a.start_date AND a.end_date;

    IF p_lat IS NOT NULL AND p_lng IS NOT NULL THEN
        v_point := ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography;

        SELECT COUNT(*) INTO v_total_items
        FROM contents c
        WHERE c.moderation_status = 'APPROVED'
          AND c.publication_status = 'PUBLISHED'
          AND (p_content_type IS NULL OR c.type = p_content_type)
          AND (c.coordinates_geo IS NOT NULL AND ST_DWithin(c.coordinates_geo, v_point, p_radius_km * 1000));

        IF v_total_items > 0 THEN
            FOR v_item IN
                SELECT c.*, 
                       ST_Distance(c.coordinates_geo, v_point) AS distance_meters,
                       jsonb_build_object('id', cr.id, 'name', u.name, 'profileImage', u.profile_image, 'verificationStatus', cr.verification_status) AS creator
                FROM contents c
                JOIN creators cr ON c.creator_id = cr.id
                JOIN users u ON cr.user_id = u.id
                WHERE c.moderation_status = 'APPROVED'
                  AND c.publication_status = 'PUBLISHED'
                  AND (p_content_type IS NULL OR c.type = p_content_type)
                  AND (c.coordinates_geo IS NOT NULL AND ST_DWithin(c.coordinates_geo, v_point, p_radius_km * 1000))
                ORDER BY c.published_at DESC
                LIMIT p_limit OFFSET v_offset
            LOOP
                v_item_counter := v_item_counter + 1;
                v_result_items := v_result_items || jsonb_build_array(jsonb_build_object('itemType', 'CONTENT', 'data', to_jsonb(v_item)));

                IF v_item_counter % v_ad_frequency = 0 AND v_ads_count > 0 THEN
                    v_result_items := v_result_items || jsonb_build_array(jsonb_build_object('itemType', 'ADVERTISEMENT', 'data', v_ads->(v_ad_idx % v_ads_count)));
                    v_ad_idx := v_ad_idx + 1;
                END IF;
            END LOOP;

            v_total_pages := CEIL(v_total_items::NUMERIC / p_limit::NUMERIC);
            RETURN jsonb_build_object(
                'success', TRUE,
                'items', v_result_items,
                'pagination', jsonb_build_object(
                    'page', p_page,
                    'limit', p_limit,
                    'totalItems', v_total_items,
                    'totalPages', v_total_pages
                )
            );
        END IF;
    END IF;

    SELECT COUNT(*) INTO v_total_items
    FROM contents c
    WHERE c.moderation_status = 'APPROVED'
      AND c.publication_status = 'PUBLISHED'
      AND (p_content_type IS NULL OR c.type = p_content_type)
      AND (p_city IS NULL OR p_city = '' OR c.location->>'city' ILIKE '%' || p_city || '%')
      AND (p_area IS NULL OR p_area = '' OR c.location->>'area' ILIKE '%' || p_area || '%');

    FOR v_item IN
        SELECT c.*,
               jsonb_build_object('id', cr.id, 'name', u.name, 'profileImage', u.profile_image, 'verificationStatus', cr.verification_status) AS creator
        FROM contents c
        JOIN creators cr ON c.creator_id = cr.id
        JOIN users u ON cr.user_id = u.id
        WHERE c.moderation_status = 'APPROVED'
          AND c.publication_status = 'PUBLISHED'
          AND (p_content_type IS NULL OR c.type = p_content_type)
          AND (p_city IS NULL OR p_city = '' OR c.location->>'city' ILIKE '%' || p_city || '%')
          AND (p_area IS NULL OR p_area = '' OR c.location->>'area' ILIKE '%' || p_area || '%')
        ORDER BY c.published_at DESC
        LIMIT p_limit OFFSET v_offset
    LOOP
        v_item_counter := v_item_counter + 1;
        v_result_items := v_result_items || jsonb_build_array(jsonb_build_object('itemType', 'CONTENT', 'data', to_jsonb(v_item)));

        IF v_item_counter % v_ad_frequency = 0 AND v_ads_count > 0 THEN
            v_result_items := v_result_items || jsonb_build_array(jsonb_build_object('itemType', 'ADVERTISEMENT', 'data', v_ads->(v_ad_idx % v_ads_count)));
            v_ad_idx := v_ad_idx + 1;
        END IF;
    END LOOP;

    v_total_pages := GREATEST(1, CEIL(v_total_items::NUMERIC / p_limit::NUMERIC));
    RETURN jsonb_build_object(
        'success', TRUE,
        'items', v_result_items,
        'pagination', jsonb_build_object(
            'page', p_page,
            'limit', p_limit,
            'totalItems', v_total_items,
            'totalPages', v_total_pages
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4.7 ATOMIC INCREMENTS FOR LIKES AND SHARES
CREATE OR REPLACE FUNCTION public.increment_like(p_content_id UUID)
RETURNS INT AS $$
DECLARE
    v_likes INT;
BEGIN
    UPDATE contents 
    SET likes = likes + 1, updated_at = NOW() 
    WHERE id = p_content_id
    RETURNING likes INTO v_likes;
    RETURN v_likes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_share(p_content_id UUID)
RETURNS INT AS $$
DECLARE
    v_shares INT;
BEGIN
    UPDATE contents 
    SET shares = shares + 1, updated_at = NOW() 
    WHERE id = p_content_id
    RETURNING shares INTO v_shares;
    RETURN v_shares;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================================
-- 5. AUTH USER CREATION & SYNC TRIGGER
-- ==========================================================

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
    v_role TEXT;
    v_name TEXT;
    v_user_id UUID := NEW.id;
    -- Extract role from metadata: strictly allow only 'USER' or 'CREATOR'.
    -- ADMIN role can never be self-assigned via client-provided user_metadata.
    v_role := UPPER(COALESCE(NEW.raw_user_meta_data->>'role', 'CREATOR'));
    IF v_role NOT IN ('USER', 'CREATOR') THEN
        v_role := 'CREATOR';
    END IF;

    v_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));

    INSERT INTO public.users (
        id,
        email,
        name,
        role,
        profile_image,
        status,
        created_at,
        updated_at
    )
    VALUES (
        v_user_id,
        NEW.email,
        v_name,
        v_role,
        NEW.raw_user_meta_data->>'profile_image',
        'ACTIVE',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, users.name),
        role = users.role, -- Never overwrite existing role on user update
        updated_at = NOW();

    IF v_role = 'CREATOR' THEN
        INSERT INTO public.creators (
            user_id,
            bio,
            verification_status,
            created_at,
            updated_at
        )
        VALUES (
            v_user_id,
            COALESCE(NEW.raw_user_meta_data->>'bio', 'Independent Citizen Journalist on Nagrik'),
            'UNVERIFIED',
            NOW(),
            NOW()
        )
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_auth_user();

-- ==========================================================
-- 6. LOCATION-PRIORITY PERSONALIZED NEWS FEED WITH POSTGIS & LGD
-- ==========================================================

CREATE INDEX IF NOT EXISTS idx_contents_feed_ranking
ON public.contents(moderation_status, publication_status, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_contents_lgd_composite
ON public.contents(state_code, district_code, subdistrict_code, local_body_code);

CREATE OR REPLACE FUNCTION public.get_personalized_feed(
    p_lat DOUBLE PRECISION DEFAULT NULL,
    p_lng DOUBLE PRECISION DEFAULT NULL,
    p_state_code INT DEFAULT NULL,
    p_district_code INT DEFAULT NULL,
    p_subdistrict_code INT DEFAULT NULL,
    p_local_body_code INT DEFAULT NULL,
    p_pincode TEXT DEFAULT NULL,
    p_area TEXT DEFAULT NULL,
    p_city TEXT DEFAULT NULL,
    p_district TEXT DEFAULT NULL,
    p_state TEXT DEFAULT NULL,
    p_content_type TEXT DEFAULT NULL,
    p_category_id UUID DEFAULT NULL,
    p_page INT DEFAULT 1,
    p_limit INT DEFAULT 20,
    p_cursor TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_user_pt geography;
    v_limit INT := LEAST(GREATEST(COALESCE(p_limit, 20), 1), 50);
    v_offset INT := (GREATEST(COALESCE(p_page, 1), 1) - 1) * v_limit;
    v_settings RECORD;
    v_ad_frequency INT := 4;
    v_ads JSONB := '[]'::jsonb;
    v_ads_count INT := 0;
    v_total_items INT := 0;
    v_total_pages INT := 1;
    v_result_items JSONB := '[]'::jsonb;
    v_item RECORD;
    v_ad_idx INT := 0;
    v_item_counter INT := 0;
    v_clean_area TEXT := NULLIF(TRIM(LOWER(COALESCE(p_area, ''))), '');
    v_clean_city TEXT := NULLIF(TRIM(LOWER(COALESCE(p_city, ''))), '');
    v_clean_district TEXT := NULLIF(TRIM(LOWER(COALESCE(p_district, ''))), '');
    v_clean_state TEXT := NULLIF(TRIM(LOWER(COALESCE(p_state, ''))), '');
    v_clean_pincode TEXT := NULLIF(TRIM(COALESCE(p_pincode, '')), '');
BEGIN
    SELECT * INTO v_settings FROM public.system_settings WHERE key = 'DEFAULT' LIMIT 1;
    IF FOUND THEN
        v_ad_frequency := COALESCE(v_settings.ad_feed_frequency, 4);
    END IF;

    SELECT COALESCE(jsonb_agg(to_jsonb(a)), '[]'::jsonb), COUNT(*)
    INTO v_ads, v_ads_count
    FROM public.advertisements a
    WHERE a.status = 'ACTIVE' AND NOW() BETWEEN a.start_date AND a.end_date;

    IF p_lat IS NOT NULL AND p_lng IS NOT NULL 
       AND p_lat BETWEEN -90 AND 90 AND p_lng BETWEEN -180 AND 180 THEN
        v_user_pt := ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography;
    END IF;

    SELECT COUNT(*) INTO v_total_items
    FROM public.contents c
    WHERE c.moderation_status = 'APPROVED'
      AND c.publication_status = 'PUBLISHED'
      AND (p_content_type IS NULL OR p_content_type = '' OR c.type = p_content_type)
      AND (p_category_id IS NULL OR c.category_id = p_category_id);

    IF v_total_items = 0 THEN
        RETURN jsonb_build_object(
            'success', TRUE,
            'items', '[]'::jsonb,
            'pagination', jsonb_build_object(
                'page', p_page,
                'limit', v_limit,
                'totalItems', 0,
                'totalPages', 1,
                'cursor', NULL
            )
        );
    END IF;

    FOR v_item IN
        WITH candidate_scores AS (
            SELECT 
                c.*,
                cr.verification_status,
                cr.user_id AS creator_user_id,
                u.name AS creator_name,
                u.profile_image AS creator_profile_image,
                cat.name AS category_name,
                cat.slug AS category_slug,

                CASE 
                    WHEN v_user_pt IS NOT NULL AND c.coordinates_geo IS NOT NULL THEN
                        ST_Distance(c.coordinates_geo, v_user_pt) / 1000.0
                    ELSE NULL
                END AS dist_km,

                CASE 
                    WHEN v_user_pt IS NOT NULL AND c.coordinates_geo IS NOT NULL THEN
                        CASE 
                            WHEN ST_Distance(c.coordinates_geo, v_user_pt) <= 3000.0 THEN 100.0
                            WHEN ST_Distance(c.coordinates_geo, v_user_pt) <= 10000.0 THEN 85.0
                            WHEN ST_Distance(c.coordinates_geo, v_user_pt) <= 25000.0 THEN 75.0
                            WHEN ST_Distance(c.coordinates_geo, v_user_pt) <= 50000.0 THEN 60.0
                            WHEN ST_Distance(c.coordinates_geo, v_user_pt) <= 100000.0 THEN 50.0
                            WHEN ST_Distance(c.coordinates_geo, v_user_pt) <= 200000.0 THEN 40.0
                            WHEN ST_Distance(c.coordinates_geo, v_user_pt) <= 500000.0 THEN 25.0
                            ELSE 10.0
                        END
                    ELSE NULL
                END AS spatial_score,

                CASE 
                    WHEN (p_local_body_code IS NOT NULL AND c.local_body_code = p_local_body_code)
                         OR (v_clean_pincode IS NOT NULL AND c.location_pincode = v_clean_pincode)
                         OR (v_clean_area IS NOT NULL AND (
                             LOWER(COALESCE(c.location_village, '')) = v_clean_area 
                             OR LOWER(COALESCE(c.location->>'area', '')) = v_clean_area
                         )) THEN 100.0

                    WHEN (p_subdistrict_code IS NOT NULL AND c.subdistrict_code = p_subdistrict_code
                          AND c.local_body_code IS NOT NULL AND c.local_body_code IS DISTINCT FROM p_local_body_code)
                         OR (v_clean_area IS NOT NULL AND (
                             (c.location_village IS NOT NULL AND LOWER(c.location_village) LIKE '%' || v_clean_area || '%' AND LOWER(c.location_village) <> v_clean_area)
                             OR (c.location->>'area' IS NOT NULL AND LOWER(c.location->>'area') LIKE '%' || v_clean_area || '%' AND LOWER(c.location->>'area') <> v_clean_area)
                         )) THEN 85.0

                    WHEN (p_subdistrict_code IS NOT NULL AND c.subdistrict_code = p_subdistrict_code)
                         OR (v_clean_area IS NOT NULL AND LOWER(COALESCE(c.location_subdistrict, '')) = v_clean_area) THEN 75.0

                    WHEN (p_district_code IS NOT NULL AND c.district_code = p_district_code
                          AND c.subdistrict_code IS NOT NULL AND c.subdistrict_code <> p_subdistrict_code) THEN 60.0

                    WHEN (p_district_code IS NOT NULL AND c.district_code = p_district_code)
                         OR (v_clean_district IS NOT NULL AND (
                             LOWER(COALESCE(c.location_district, '')) = v_clean_district
                             OR LOWER(COALESCE(c.location->>'city', '')) = v_clean_district
                         ))
                         OR (v_clean_city IS NOT NULL AND (
                             LOWER(COALESCE(c.location_district, '')) = v_clean_city
                             OR LOWER(COALESCE(c.location->>'city', '')) = v_clean_city
                         )) THEN 50.0

                    WHEN (p_state_code IS NOT NULL AND c.state_code = p_state_code
                          AND (c.district_code IS DISTINCT FROM p_district_code)) THEN 40.0

                    WHEN (p_state_code IS NOT NULL AND c.state_code = p_state_code)
                         OR (v_clean_state IS NOT NULL AND LOWER(COALESCE(c.location->>'state', '')) = v_clean_state) THEN 25.0

                    ELSE 10.0
                END AS admin_score,

                GREATEST(0.0, EXTRACT(EPOCH FROM (NOW() - COALESCE(c.published_at, c.created_at))) / 3600.0) AS age_hours

            FROM public.contents c
            JOIN public.creators cr ON c.creator_id = cr.id
            JOIN public.users u ON cr.user_id = u.id
            LEFT JOIN public.categories cat ON c.category_id = cat.id
            WHERE c.moderation_status = 'APPROVED'
              AND c.publication_status = 'PUBLISHED'
              AND (p_content_type IS NULL OR p_content_type = '' OR c.type = p_content_type)
              AND (p_category_id IS NULL OR c.category_id = p_category_id)
        ),
        scored_candidates AS (
            SELECT 
                cs.*,
                
                GREATEST(COALESCE(cs.spatial_score, 0.0), COALESCE(cs.admin_score, 10.0)) AS location_score,

                CASE 
                    WHEN GREATEST(COALESCE(cs.spatial_score, 0.0), COALESCE(cs.admin_score, 10.0)) >= 95.0 THEN 'LOCAL_AREA'
                    WHEN GREATEST(COALESCE(cs.spatial_score, 0.0), COALESCE(cs.admin_score, 10.0)) >= 80.0 THEN 'NEARBY_AREA'
                    WHEN GREATEST(COALESCE(cs.spatial_score, 0.0), COALESCE(cs.admin_score, 10.0)) >= 70.0 THEN 'SUB_DISTRICT'
                    WHEN GREATEST(COALESCE(cs.spatial_score, 0.0), COALESCE(cs.admin_score, 10.0)) >= 55.0 THEN 'NEARBY_SUB_DISTRICT'
                    WHEN GREATEST(COALESCE(cs.spatial_score, 0.0), COALESCE(cs.admin_score, 10.0)) >= 45.0 THEN 'DISTRICT'
                    WHEN GREATEST(COALESCE(cs.spatial_score, 0.0), COALESCE(cs.admin_score, 10.0)) >= 35.0 THEN 'NEARBY_DISTRICT'
                    WHEN GREATEST(COALESCE(cs.spatial_score, 0.0), COALESCE(cs.admin_score, 10.0)) >= 20.0 THEN 'STATE'
                    ELSE 'NATIONAL'
                END AS location_tier,

                CASE 
                    WHEN cs.age_hours < 1.0 THEN 50.0
                    WHEN cs.age_hours < 6.0 THEN 35.0
                    WHEN cs.age_hours < 24.0 THEN 20.0
                    WHEN cs.age_hours < 72.0 THEN 10.0
                    WHEN cs.age_hours >= 168.0 THEN 0.0
                    ELSE GREATEST(0.0, 10.0 * (1.0 - (cs.age_hours - 72.0) / 96.0))
                END AS freshness_score,

                CASE 
                    WHEN cs.verification_status = 'VERIFIED' THEN 10.0
                    WHEN cs.verification_status = 'PENDING' THEN 3.0
                    ELSE 0.0
                END AS quality_score,

                LEAST(15.0, 
                    (COALESCE(cs.likes, 0) * 1.0 + 
                     COALESCE(cs.shares, 0) * 2.0 + 
                     COALESCE(cs.saves, 0) * 1.5 + 
                     LN(GREATEST(1.0, COALESCE(cs.views, 0)::FLOAT)) * 0.5)
                ) AS engagement_score

            FROM candidate_scores cs
        ),
        pre_ranked AS (
            SELECT 
                sc.*,
                (sc.location_score + sc.freshness_score + sc.quality_score + sc.engagement_score) AS raw_rank_score,

                ROW_NUMBER() OVER (
                    PARTITION BY sc.creator_id 
                    ORDER BY (sc.location_score + sc.freshness_score + sc.quality_score + sc.engagement_score) DESC, sc.published_at DESC
                ) AS rank_by_creator,

                ROW_NUMBER() OVER (
                    PARTITION BY sc.category_id 
                    ORDER BY (sc.location_score + sc.freshness_score + sc.quality_score + sc.engagement_score) DESC, sc.published_at DESC
                ) AS rank_by_category,

                ROW_NUMBER() OVER (
                    PARTITION BY COALESCE(sc.location_village, sc.location->>'area', sc.location_district, sc.location->>'city')
                    ORDER BY (sc.location_score + sc.freshness_score + sc.quality_score + sc.engagement_score) DESC, sc.published_at DESC
                ) AS rank_by_area

            FROM scored_candidates sc
        )
        SELECT 
            pr.*,
            ROUND((
                pr.raw_rank_score 
                - (pr.rank_by_creator - 1) * 8.0 
                - (pr.rank_by_category - 1) * 3.0 
                - (pr.rank_by_area - 1) * 4.0
            )::numeric, 2) AS final_rank_score
        FROM pre_ranked pr
        ORDER BY final_rank_score DESC, published_at DESC
        LIMIT v_limit OFFSET v_offset
    LOOP
        v_item_counter := v_item_counter + 1;

        v_result_items := v_result_items || jsonb_build_array(
            jsonb_build_object(
                'itemType', 'CONTENT',
                'data', jsonb_build_object(
                    'id', v_item.id,
                    '_id', v_item.id,
                    'creatorId', jsonb_build_object(
                        'id', v_item.creator_id,
                        'name', v_item.creator_name,
                        'profileImage', v_item.creator_profile_image,
                        'verificationStatus', v_item.verification_status
                    ),
                    'creator', jsonb_build_object(
                        'id', v_item.creator_id,
                        'name', v_item.creator_name,
                        'profileImage', v_item.creator_profile_image,
                        'verificationStatus', v_item.verification_status
                    ),
                    'type', v_item.type,
                    'title', v_item.title,
                    'description', v_item.description,
                    'mediaUrl', v_item.media_url,
                    'media_url', v_item.media_url,
                    'thumbnailUrl', v_item.thumbnail_url,
                    'thumbnail_url', v_item.thumbnail_url,
                    'categoryId', v_item.category_id,
                    'category_id', v_item.category_id,
                    'categoryName', v_item.category_name,
                    'location', v_item.location,
                    'location_village', v_item.location_village,
                    'location_subdistrict', v_item.location_subdistrict,
                    'location_district', v_item.location_district,
                    'location_pincode', v_item.location_pincode,
                    'state_code', v_item.state_code,
                    'district_code', v_item.district_code,
                    'subdistrict_code', v_item.subdistrict_code,
                    'local_body_code', v_item.local_body_code,
                    'moderationStatus', v_item.moderation_status,
                    'publicationStatus', v_item.publication_status,
                    'views', v_item.views,
                    'eligibleViews', v_item.eligible_views,
                    'likes', v_item.likes,
                    'shares', v_item.shares,
                    'saves', v_item.saves,
                    'publishedAt', v_item.published_at,
                    'published_at', v_item.published_at,
                    'createdAt', v_item.created_at,
                    'relevanceScore', v_item.final_rank_score,
                    'locationScore', v_item.location_score,
                    'freshnessScore', v_item.freshness_score,
                    'qualityScore', v_item.quality_score,
                    'engagementScore', v_item.engagement_score,
                    'locationTier', v_item.location_tier,
                    'distanceKm', CASE WHEN v_item.dist_km IS NOT NULL THEN ROUND(v_item.dist_km::numeric, 2) ELSE NULL END
                )
            )
        );

        IF v_item_counter % v_ad_frequency = 0 AND v_ads_count > 0 THEN
            v_result_items := v_result_items || jsonb_build_array(
                jsonb_build_object(
                    'itemType', 'ADVERTISEMENT',
                    'data', v_ads->(v_ad_idx % v_ads_count)
                )
            );
            v_ad_idx := v_ad_idx + 1;
        END IF;
    END LOOP;

    v_total_pages := GREATEST(1, CEIL(v_total_items::NUMERIC / v_limit::NUMERIC));

    RETURN jsonb_build_object(
        'success', TRUE,
        'items', v_result_items,
        'pagination', jsonb_build_object(
            'page', p_page,
            'limit', v_limit,
            'totalItems', v_total_items,
            'totalPages', v_total_pages,
            'cursor', CASE 
                WHEN v_item_counter > 0 THEN (p_page * v_limit)::text 
                ELSE NULL 
            END
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_personalized_feed TO anon, authenticated, service_role;

