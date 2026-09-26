-- ======================================================================
-- MIGRATION 013: OPTIMIZE RLS INITPLAN WITH (SELECT auth.uid())
-- Prevents per-row function re-evaluation on RLS checks
-- ======================================================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT 
    TO authenticated 
    USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE 
    TO authenticated 
    USING ((SELECT auth.uid()) = id) 
    WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Creators update own bio" ON public.creators;
CREATE POLICY "Creators update own bio" ON public.creators
    FOR UPDATE 
    TO authenticated 
    USING (user_id = (SELECT auth.uid())) 
    WITH CHECK (user_id = (SELECT auth.uid()));
