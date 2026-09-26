-- ======================================================================
-- MIGRATION 011: SUPABASE ADVISOR SECURITY & PERFORMANCE TUNING
-- 1. Revoke sensitive creator/financial RPCs from anon
-- 2. Scope admin & creator policies TO authenticated to eliminate
--    multiple permissive policies overhead on public read paths
-- ======================================================================

-- 1. REVOKE SENSITIVE CREATOR / FINANCIAL RPCS FROM ANON
REVOKE EXECUTE ON FUNCTION public.request_payout(UUID, NUMERIC, UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.request_payout(UUID, NUMERIC, UUID) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_creator_dashboard_stats(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_creator_dashboard_stats(UUID) TO authenticated;

-- 2. SCOPE ADMIN POLICIES TO 'authenticated' TO PREVENT MULTIPLE PERMISSIVE POLICIES ON 'anon'

-- 2.1 Advertisements
DROP POLICY IF EXISTS "Admins manage advertisements" ON public.advertisements;
CREATE POLICY "Admins manage advertisements" ON public.advertisements
    FOR ALL 
    TO authenticated 
    USING (public.is_admin()) 
    WITH CHECK (public.is_admin());

-- 2.2 Categories
DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;
CREATE POLICY "Admins manage categories" ON public.categories
    FOR ALL 
    TO authenticated 
    USING (public.is_admin()) 
    WITH CHECK (public.is_admin());

-- 2.3 CMS Pages
DROP POLICY IF EXISTS "Admins manage cms pages" ON public.cms_pages;
CREATE POLICY "Admins manage cms pages" ON public.cms_pages
    FOR ALL 
    TO authenticated 
    USING (public.is_admin()) 
    WITH CHECK (public.is_admin());

-- 2.4 Locations
DROP POLICY IF EXISTS "Admins manage locations" ON public.locations;
CREATE POLICY "Admins manage locations" ON public.locations
    FOR ALL 
    TO authenticated 
    USING (public.is_admin()) 
    WITH CHECK (public.is_admin());

-- 2.5 System Settings
DROP POLICY IF EXISTS "Admins manage system settings" ON public.system_settings;
CREATE POLICY "Admins manage system settings" ON public.system_settings
    FOR ALL 
    TO authenticated 
    USING (public.is_admin()) 
    WITH CHECK (public.is_admin());

-- 2.6 Users
DROP POLICY IF EXISTS "Admins full manage users" ON public.users;
CREATE POLICY "Admins full manage users" ON public.users
    FOR ALL 
    TO authenticated 
    USING (public.is_admin()) 
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT 
    TO authenticated 
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = id) 
    WITH CHECK (auth.uid() = id);

-- 2.7 Creators
DROP POLICY IF EXISTS "Admins full manage creators" ON public.creators;
CREATE POLICY "Admins full manage creators" ON public.creators
    FOR ALL 
    TO authenticated 
    USING (public.is_admin()) 
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Creators update own bio" ON public.creators;
CREATE POLICY "Creators update own bio" ON public.creators
    FOR UPDATE 
    TO authenticated 
    USING (user_id = auth.uid()) 
    WITH CHECK (user_id = auth.uid());

-- 2.8 Contents
DROP POLICY IF EXISTS "Admins full manage content" ON public.contents;
CREATE POLICY "Admins full manage content" ON public.contents
    FOR ALL 
    TO authenticated 
    USING (public.is_admin()) 
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Creators insert own draft content" ON public.contents;
CREATE POLICY "Creators insert own draft content" ON public.contents
    FOR INSERT 
    TO authenticated 
    WITH CHECK (creator_id = public.get_current_creator_id());

DROP POLICY IF EXISTS "Creators update own content" ON contents;
CREATE POLICY "Creators update own content" ON public.contents
    FOR UPDATE 
    TO authenticated 
    USING (creator_id = public.get_current_creator_id()) 
    WITH CHECK (creator_id = public.get_current_creator_id());

DROP POLICY IF EXISTS "Creators delete own content" ON contents;
CREATE POLICY "Creators delete own content" ON public.contents
    FOR DELETE 
    TO authenticated 
    USING (creator_id = public.get_current_creator_id());
