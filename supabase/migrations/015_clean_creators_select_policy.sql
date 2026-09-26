-- ======================================================================
-- MIGRATION 015: CLEAN UP CREATORS SELECT POLICY (SEPARATE ADMIN FROM PUBLIC)
-- Eliminates "permission denied for function is_admin" for anon callers
-- ======================================================================

DROP POLICY IF EXISTS "Public read verified creators" ON public.creators;
DROP POLICY IF EXISTS "Creators view own profile" ON public.creators;

-- 1. Anyone (including anonymous mobile users) can read VERIFIED creator profiles
CREATE POLICY "Public read verified creators" ON public.creators
    FOR SELECT 
    USING (verification_status = 'VERIFIED');

-- 2. Logged-in creators can view their own profile even if unverified/pending
CREATE POLICY "Creators view own profile" ON public.creators
    FOR SELECT 
    TO authenticated 
    USING (user_id = (SELECT auth.uid()));
