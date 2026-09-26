-- ==========================================================
-- 003_rls_policies.sql
-- NAAGRIK PLATFORM - ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

-- 1. Helper Functions to identify Admin and Creator roles in SQL
-- NOTE: Never trust client-controlled user_metadata in JWT for authorization.
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

-- 2. Enable RLS on all 14 Tables
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

-- ==========================================================
-- 3. POLICIES PER TABLE
-- ==========================================================

-- ─── USERS ───
CREATE POLICY "Public can view basic author profiles"
ON users FOR SELECT
USING (status = 'ACTIVE');

CREATE POLICY "Users can view their own record"
ON users FOR SELECT
USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
USING (id = auth.uid())
WITH CHECK (
    id = auth.uid()
    AND role = (SELECT role FROM public.users WHERE id = auth.uid())
    AND status = (SELECT status FROM public.users WHERE id = auth.uid())
);

CREATE POLICY "Admins have full access to users"
ON users FOR ALL
USING (public.is_admin());

-- ─── CREATORS ───
CREATE POLICY "Public can view verified creators"
ON creators FOR SELECT
USING (verification_status = 'VERIFIED');

CREATE POLICY "Creators can view and update their own creator profile"
ON creators FOR SELECT
USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Creators can update own bio"
ON creators FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins have full access to creators"
ON creators FOR ALL
USING (public.is_admin());

-- ─── CATEGORIES ───
CREATE POLICY "Public can view active categories"
ON categories FOR SELECT
USING (status = 'ACTIVE' OR public.is_admin());

CREATE POLICY "Admins have full access to categories"
ON categories FOR ALL
USING (public.is_admin());

-- ─── LOCATIONS ───
CREATE POLICY "Public can view locations"
ON locations FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Admins have full access to locations"
ON locations FOR ALL
USING (public.is_admin());

-- ─── CONTENTS ───
CREATE POLICY "Public can view approved and published contents"
ON contents FOR SELECT
USING (
    (moderation_status = 'APPROVED' AND publication_status = 'PUBLISHED')
    OR (creator_id = public.get_current_creator_id())
    OR public.is_admin()
);

CREATE POLICY "Creators can insert own content"
ON contents FOR INSERT
WITH CHECK (
    public.is_admin() OR (
        creator_id = public.get_current_creator_id()
        AND moderation_status IN ('DRAFT', 'PENDING_REVIEW')
        AND publication_status IN ('DRAFT', 'PUBLISHED')
        AND COALESCE(views, 0) = 0
        AND COALESCE(eligible_views, 0) = 0
    )
);

CREATE POLICY "Creators can update own content"
ON contents FOR UPDATE
USING (creator_id = public.get_current_creator_id() OR public.is_admin())
WITH CHECK (
    public.is_admin() OR (
        creator_id = public.get_current_creator_id()
        AND moderation_status IN ('DRAFT', 'PENDING_REVIEW')
        AND views = (SELECT views FROM contents WHERE id = contents.id)
        AND eligible_views = (SELECT eligible_views FROM contents WHERE id = contents.id)
    )
);

CREATE POLICY "Creators can delete own content"
ON contents FOR DELETE
USING (creator_id = public.get_current_creator_id() OR public.is_admin());

-- ─── VIDEO VIEWS ───
CREATE POLICY "Public and anonymous consumers can register video views"
ON video_views FOR INSERT
TO PUBLIC
WITH CHECK (true);

CREATE POLICY "View records are viewable by owner or admin"
ON video_views FOR SELECT
USING (user_id = auth.uid() OR public.is_admin());

-- ─── ADVERTISEMENTS ───
CREATE POLICY "Public can view active advertisements"
ON advertisements FOR SELECT
USING (status = 'ACTIVE' AND NOW() BETWEEN start_date AND end_date OR public.is_admin());

CREATE POLICY "Admins have full access to advertisements"
ON advertisements FOR ALL
USING (public.is_admin());

-- ─── PAYOUT METHODS ───
CREATE POLICY "Creators can manage their own payout methods"
ON payout_methods FOR ALL
USING (creator_id = public.get_current_creator_id() OR public.is_admin())
WITH CHECK (creator_id = public.get_current_creator_id() OR public.is_admin());

-- ─── PAYOUT REQUESTS ───
CREATE POLICY "Creators can view their own payout requests"
ON payout_requests FOR SELECT
USING (creator_id = public.get_current_creator_id() OR public.is_admin());

CREATE POLICY "Creators can submit payout requests"
ON payout_requests FOR INSERT
WITH CHECK (creator_id = public.get_current_creator_id() OR public.is_admin());

CREATE POLICY "Admins can update payout requests"
ON payout_requests FOR UPDATE
USING (public.is_admin());

-- ─── SYSTEM SETTINGS ───
CREATE POLICY "Public can view system settings"
ON system_settings FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Admins can update system settings"
ON system_settings FOR ALL
USING (public.is_admin());

-- ─── REPORTS ───
CREATE POLICY "Public can submit content reports"
ON reports FOR INSERT
TO PUBLIC
WITH CHECK (true);

CREATE POLICY "Admins have full access to reports"
ON reports FOR ALL
USING (public.is_admin());

-- ─── AUDIT LOGS ───
CREATE POLICY "Admins can view audit logs"
ON audit_logs FOR SELECT
USING (public.is_admin());

CREATE POLICY "System can record audit logs"
ON audit_logs FOR INSERT
TO PUBLIC
WITH CHECK (true);

-- ─── NOTIFICATIONS ───
CREATE POLICY "Users can view and manage their own notifications"
ON notifications FOR ALL
USING (user_id = auth.uid() OR public.is_admin())
WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- ─── CMS PAGES ───
CREATE POLICY "Public can view published CMS pages"
ON cms_pages FOR SELECT
USING (published = true OR public.is_admin());

CREATE POLICY "Admins have full access to CMS pages"
ON cms_pages FOR ALL
USING (public.is_admin());
