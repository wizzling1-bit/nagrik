-- ==========================================================
-- 008_security_hardening_and_indexes.sql
-- NAAGRIK PLATFORM - PRODUCTION SECURITY HARDENING & COVERING INDEXES
-- ==========================================================

-- 1. DROP DUPLICATE INDEX (fixes duplicate index advisory)
DROP INDEX IF EXISTS public.idx_contents_feed_ranking;

-- 2. ADD COVERING B-TREE INDEXES FOR UNINDEXED FOREIGN KEYS
CREATE INDEX IF NOT EXISTS idx_contents_district_code 
ON public.contents(district_code);

CREATE INDEX IF NOT EXISTS idx_contents_subdistrict_code 
ON public.contents(subdistrict_code);

CREATE INDEX IF NOT EXISTS idx_video_views_video_id 
ON public.video_views(video_id);

CREATE INDEX IF NOT EXISTS idx_reports_reporter_id 
ON public.reports(reporter_id);

CREATE INDEX IF NOT EXISTS idx_payout_requests_payout_method_id 
ON public.payout_requests(payout_method_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id 
ON public.audit_logs(actor_id);

CREATE INDEX IF NOT EXISTS idx_advertisements_target_category 
ON public.advertisements(target_category);

-- 3. NOTE ON spatial_ref_sys:
-- spatial_ref_sys is an internal PostGIS extension system catalog table owned by the extension superuser.


-- 4. CLEAN UP INSECURE "API backend access" WILDCARD PERMISSIVE POLICIES
DROP POLICY IF EXISTS "API backend access advertisements" ON public.advertisements;
DROP POLICY IF EXISTS "API backend access audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "API backend access categories" ON public.categories;
DROP POLICY IF EXISTS "API backend access cms_pages" ON public.cms_pages;
DROP POLICY IF EXISTS "API backend access contents" ON public.contents;
DROP POLICY IF EXISTS "API backend access creators" ON public.creators;
DROP POLICY IF EXISTS "API backend access locations" ON public.locations;
DROP POLICY IF EXISTS "API backend access notifications" ON public.notifications;
DROP POLICY IF EXISTS "API backend access payout_methods" ON public.payout_methods;
DROP POLICY IF EXISTS "API backend access payout_requests" ON public.payout_requests;
DROP POLICY IF EXISTS "API backend access reports" ON public.reports;
DROP POLICY IF EXISTS "API backend access system_settings" ON public.system_settings;
DROP POLICY IF EXISTS "API backend access users" ON public.users;
DROP POLICY IF EXISTS "API backend access video_views" ON public.video_views;

-- 5. CLEAN UP DUPLICATE SERVICE ROLE POLICIES ON LGD TABLES THAT WERE GRANTED TO PUBLIC
DROP POLICY IF EXISTS "Allow service role full access on lgd_districts" ON public.lgd_districts;
DROP POLICY IF EXISTS "Allow service role full access on lgd_local_bodies" ON public.lgd_local_bodies;
DROP POLICY IF EXISTS "Allow service role full access on lgd_states" ON public.lgd_states;
DROP POLICY IF EXISTS "Allow service role full access on lgd_subdistricts" ON public.lgd_subdistricts;

-- Ensure LGD tables have clean read policy
DROP POLICY IF EXISTS "Allow public read access on lgd_districts" ON public.lgd_districts;
CREATE POLICY "Allow public read access on lgd_districts" 
ON public.lgd_districts FOR SELECT TO PUBLIC USING (true);

DROP POLICY IF EXISTS "Allow public read access on lgd_local_bodies" ON public.lgd_local_bodies;
CREATE POLICY "Allow public read access on lgd_local_bodies" 
ON public.lgd_local_bodies FOR SELECT TO PUBLIC USING (true);

DROP POLICY IF EXISTS "Allow public read access on lgd_states" ON public.lgd_states;
CREATE POLICY "Allow public read access on lgd_states" 
ON public.lgd_states FOR SELECT TO PUBLIC USING (true);

DROP POLICY IF EXISTS "Allow public read access on lgd_subdistricts" ON public.lgd_subdistricts;
CREATE POLICY "Allow public read access on lgd_subdistricts" 
ON public.lgd_subdistricts FOR SELECT TO PUBLIC USING (true);

-- 6. REMEDIATE USERS TABLE DATA LEAK
-- Ensure helper functions use (SELECT auth.uid()) and STABLE execution plan caching
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) AND role = 'ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_creator()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.creators 
        WHERE user_id = (SELECT auth.uid())
    ) OR EXISTS (
        SELECT 1 FROM public.users
        WHERE id = (SELECT auth.uid()) AND role IN ('CREATOR', 'PUBLISHER')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_current_creator_id()
RETURNS UUID AS $$
    SELECT id FROM public.creators WHERE user_id = (SELECT auth.uid()) LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Drop all old user policies
DROP POLICY IF EXISTS "Public can view basic author profiles" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile info" ON public.users;
DROP POLICY IF EXISTS "Users can view their own record" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile info only" ON public.users;
DROP POLICY IF EXISTS "Admins have full access to users" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins full manage users" ON public.users;

-- Restrict direct users access: Only self or admin
CREATE POLICY "Users can view own profile"
ON public.users FOR SELECT
USING (id = (SELECT auth.uid()) OR (SELECT public.is_admin()));

CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE
USING (id = (SELECT auth.uid()) OR (SELECT public.is_admin()))
WITH CHECK (
    (SELECT public.is_admin()) OR (
        id = (SELECT auth.uid())
        AND role = (SELECT role FROM public.users WHERE id = (SELECT auth.uid()))
        AND status = (SELECT status FROM public.users WHERE id = (SELECT auth.uid()))
    )
);

CREATE POLICY "Admins full manage users"
ON public.users FOR ALL
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- Create Security Barrier View for Public Author Profiles (Zero leak of email/phone/password)
CREATE OR REPLACE VIEW public.public_author_profiles WITH (security_barrier = true) AS
SELECT 
    c.id AS creator_id,
    c.user_id,
    u.name,
    u.profile_image,
    c.verification_status,
    c.bio,
    c.created_at
FROM public.creators c
JOIN public.users u ON c.user_id = u.id
WHERE u.status = 'ACTIVE';

GRANT SELECT ON public.public_author_profiles TO anon, authenticated;

-- 7. CLEAN & SCOPED RLS FOR CREATORS
DROP POLICY IF EXISTS "Public can view verified creators" ON public.creators;
DROP POLICY IF EXISTS "Creators can view and update their own creator profile" ON public.creators;
DROP POLICY IF EXISTS "Creators can update own bio" ON public.creators;
DROP POLICY IF EXISTS "Admins have full access to creators" ON public.creators;

CREATE POLICY "Public read verified creators"
ON public.creators FOR SELECT
USING (verification_status = 'VERIFIED' OR user_id = (SELECT auth.uid()) OR (SELECT public.is_admin()));

CREATE POLICY "Creators update own bio"
ON public.creators FOR UPDATE
USING (user_id = (SELECT auth.uid()) OR (SELECT public.is_admin()))
WITH CHECK (user_id = (SELECT auth.uid()) OR (SELECT public.is_admin()));

CREATE POLICY "Admins full manage creators"
ON public.creators FOR ALL
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- 8. CLEAN & SCOPED RLS FOR CONTENTS
DROP POLICY IF EXISTS "Creator manage own content" ON public.contents;
DROP POLICY IF EXISTS "Public read published content" ON public.contents;
DROP POLICY IF EXISTS "Creators can insert own content as draft" ON public.contents;
DROP POLICY IF EXISTS "Creators can update own non-published content" ON public.contents;
DROP POLICY IF EXISTS "Public can view approved and published contents" ON public.contents;
DROP POLICY IF EXISTS "Creators can insert own content" ON public.contents;
DROP POLICY IF EXISTS "Creators can update own content" ON public.contents;
DROP POLICY IF EXISTS "Creators can delete own content" ON public.contents;
DROP POLICY IF EXISTS "Admins full manage content" ON public.contents;

CREATE POLICY "Public read published content"
ON public.contents FOR SELECT
USING (
    (moderation_status = 'APPROVED' AND publication_status = 'PUBLISHED')
    OR (creator_id = (SELECT public.get_current_creator_id()))
    OR (SELECT public.is_admin())
);

CREATE POLICY "Creators insert own draft content"
ON public.contents FOR INSERT
WITH CHECK (
    (SELECT public.is_admin()) OR (
        creator_id = (SELECT public.get_current_creator_id())
        AND moderation_status IN ('DRAFT', 'PENDING_REVIEW')
        AND publication_status IN ('DRAFT', 'PUBLISHED')
        AND COALESCE(views, 0) = 0
        AND COALESCE(eligible_views, 0) = 0
    )
);

CREATE POLICY "Creators update own content"
ON public.contents FOR UPDATE
USING (creator_id = (SELECT public.get_current_creator_id()) OR (SELECT public.is_admin()))
WITH CHECK (
    (SELECT public.is_admin()) OR (
        creator_id = (SELECT public.get_current_creator_id())
        AND moderation_status IN ('DRAFT', 'PENDING_REVIEW')
    )
);

CREATE POLICY "Creators delete own content"
ON public.contents FOR DELETE
USING (creator_id = (SELECT public.get_current_creator_id()) OR (SELECT public.is_admin()));

CREATE POLICY "Admins full manage content"
ON public.contents FOR ALL
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- 9. REVOKE DIRECT TABLE INSERT FROM CLIENTS FOR SENSITIVE TRANSACTION TABLES
-- (video_views, reports, audit_logs, payout_requests must mutate strictly via RPCs)

-- video_views
DROP POLICY IF EXISTS "Public and anonymous consumers can register video views" ON public.video_views;
DROP POLICY IF EXISTS "View records are viewable by owner or admin" ON public.video_views;
CREATE POLICY "Views read by owner or admin"
ON public.video_views FOR SELECT
USING (user_id = (SELECT auth.uid()) OR (SELECT public.is_admin()));

-- reports
DROP POLICY IF EXISTS "Public can submit content reports" ON public.reports;
DROP POLICY IF EXISTS "Admins have full access to reports" ON public.reports;
CREATE POLICY "Admins manage reports"
ON public.reports FOR ALL
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- audit_logs
DROP POLICY IF EXISTS "System can record audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins read audit logs"
ON public.audit_logs FOR SELECT
USING ((SELECT public.is_admin()));

-- payout_requests
DROP POLICY IF EXISTS "Creators can submit payout requests" ON public.payout_requests;
DROP POLICY IF EXISTS "Creators can view their own payout requests" ON public.payout_requests;
DROP POLICY IF EXISTS "Creator manage payout requests" ON public.payout_requests;
DROP POLICY IF EXISTS "Admins can update payout requests" ON public.payout_requests;

CREATE POLICY "Creators view own payout requests"
ON public.payout_requests FOR SELECT
USING (creator_id = (SELECT public.get_current_creator_id()) OR (SELECT public.is_admin()));

CREATE POLICY "Admins update payout requests"
ON public.payout_requests FOR UPDATE
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- 10. CLEAN POLICIES ON REMAINING TABLES
-- categories
DROP POLICY IF EXISTS "Public read active categories" ON public.categories;
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
DROP POLICY IF EXISTS "Admins have full access to categories" ON public.categories;

CREATE POLICY "Public read active categories"
ON public.categories FOR SELECT
USING (status = 'ACTIVE' OR (SELECT public.is_admin()));

CREATE POLICY "Admins manage categories"
ON public.categories FOR ALL
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- cms_pages
DROP POLICY IF EXISTS "Public read published cms pages" ON public.cms_pages;
DROP POLICY IF EXISTS "Public can view published CMS pages" ON public.cms_pages;
DROP POLICY IF EXISTS "Admins have full access to CMS pages" ON public.cms_pages;

CREATE POLICY "Public read published cms pages"
ON public.cms_pages FOR SELECT
USING (is_published = true OR (SELECT public.is_admin()));

CREATE POLICY "Admins manage cms pages"
ON public.cms_pages FOR ALL
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- locations
DROP POLICY IF EXISTS "Public read locations" ON public.locations;
DROP POLICY IF EXISTS "Public can view locations" ON public.locations;
DROP POLICY IF EXISTS "Admins have full access to locations" ON public.locations;

CREATE POLICY "Public read locations"
ON public.locations FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Admins manage locations"
ON public.locations FOR ALL
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- system_settings
DROP POLICY IF EXISTS "Public read system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Public can view system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can update system settings" ON public.system_settings;

CREATE POLICY "Public read system settings"
ON public.system_settings FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Admins manage system settings"
ON public.system_settings FOR ALL
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- advertisements
DROP POLICY IF EXISTS "Public read active advertisements" ON public.advertisements;
DROP POLICY IF EXISTS "Public can view active advertisements" ON public.advertisements;
DROP POLICY IF EXISTS "Admins have full access to advertisements" ON public.advertisements;

CREATE POLICY "Public read active advertisements"
ON public.advertisements FOR SELECT
USING ((status = 'ACTIVE' AND NOW() BETWEEN start_date AND end_date) OR (SELECT public.is_admin()));

CREATE POLICY "Admins manage advertisements"
ON public.advertisements FOR ALL
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- payout_methods
DROP POLICY IF EXISTS "Creator manage payout methods" ON public.payout_methods;
DROP POLICY IF EXISTS "Creators can manage their own payout methods" ON public.payout_methods;

CREATE POLICY "Creators manage own payout methods"
ON public.payout_methods FOR ALL
USING (creator_id = (SELECT public.get_current_creator_id()) OR (SELECT public.is_admin()))
WITH CHECK (creator_id = (SELECT public.get_current_creator_id()) OR (SELECT public.is_admin()));

-- notifications
DROP POLICY IF EXISTS "Users can view and manage their own notifications" ON public.notifications;

CREATE POLICY "Users manage own notifications"
ON public.notifications FOR ALL
USING (user_id = (SELECT auth.uid()) OR (SELECT public.is_admin()))
WITH CHECK (user_id = (SELECT auth.uid()) OR (SELECT public.is_admin()));

-- 11. ADD REALTIME PUBLICATION FOR REALTIME MODERATION & NOTIFICATIONS
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'contents'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE contents;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'reports'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE reports;
    END IF;
END $$;
