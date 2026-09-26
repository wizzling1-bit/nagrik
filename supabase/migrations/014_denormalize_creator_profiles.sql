-- ======================================================================
-- MIGRATION 014: DENORMALIZE PUBLIC CREATOR PROFILES & SECURITY TUNING
-- 1. Revoke privileges on spatial_ref_sys from anon and authenticated
-- 2. Add display_name and avatar_url to creators table
-- 3. Populate existing creator records from users table
-- 4. Establish sync triggers from users to creators
-- 5. Recreate public_author_profiles with security_invoker = true
--    eliminating the security_definer_view advisor finding
-- ======================================================================

-- 1. REVOKE SPATIAL_REF_SYS API EXPOSURE
REVOKE ALL ON TABLE public.spatial_ref_sys FROM anon, authenticated, PUBLIC;

-- 2. DENORMALIZE PUBLIC CREATOR PROFILE FIELDS ONTO creators
ALTER TABLE public.creators 
    ADD COLUMN IF NOT EXISTS display_name TEXT,
    ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 3. POPULATE INITIAL DATA FROM AUTHORITATIVE users TABLE
UPDATE public.creators c
SET display_name = COALESCE(c.display_name, u.name),
    avatar_url = COALESCE(c.avatar_url, u.profile_image)
FROM public.users u
WHERE c.user_id = u.id;

-- 4. SAFE DATABASE SYNC TRIGGERS
-- 4.1 Update sync: When authoritative user updates name/profile_image, sync to creators
CREATE OR REPLACE FUNCTION public.sync_user_to_creator_profile()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
    IF (OLD.name IS DISTINCT FROM NEW.name) OR (OLD.profile_image IS DISTINCT FROM NEW.profile_image) THEN
        UPDATE public.creators
        SET display_name = NEW.name,
            avatar_url = NEW.profile_image,
            updated_at = NOW()
        WHERE user_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_user_to_creator ON public.users;
CREATE TRIGGER trg_sync_user_to_creator
AFTER UPDATE OF name, profile_image ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_to_creator_profile();

-- 4.2 Insert sync: When a creator profile is created, auto-populate display_name and avatar_url
CREATE OR REPLACE FUNCTION public.sync_new_creator_profile()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
    IF NEW.display_name IS NULL OR NEW.avatar_url IS NULL THEN
        SELECT name, profile_image 
        INTO NEW.display_name, NEW.avatar_url
        FROM public.users 
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_new_creator ON public.creators;
CREATE TRIGGER trg_sync_new_creator
BEFORE INSERT ON public.creators
FOR EACH ROW
EXECUTE FUNCTION public.sync_new_creator_profile();

-- 5. UPDATE RLS POLICY ON creators TO ALLOW OWN PROFILE UPDATES
DROP POLICY IF EXISTS "Creators update own bio" ON public.creators;
DROP POLICY IF EXISTS "Creators update own profile" ON public.creators;
CREATE POLICY "Creators update own profile" ON public.creators
    FOR UPDATE 
    TO authenticated 
    USING (user_id = (SELECT auth.uid())) 
    WITH CHECK (user_id = (SELECT auth.uid()));

-- 6. RECREATE public_author_profiles WITH security_invoker = true
-- This queries ONLY the creators table and eliminates the security_definer_view finding.
DROP VIEW IF EXISTS public.public_author_profiles;
CREATE VIEW public.public_author_profiles 
WITH (security_barrier = true, security_invoker = true) AS
SELECT 
    c.id AS creator_id,
    c.user_id,
    COALESCE(c.display_name, 'Nagrik Creator') AS name,
    c.avatar_url AS profile_image,
    c.verification_status,
    c.bio,
    c.created_at
FROM public.creators c
WHERE c.verification_status = 'VERIFIED';

GRANT SELECT ON public.public_author_profiles TO anon, authenticated;

-- 7. REVOKE DIRECT RPC EXECUTE ON TRIGGER FUNCTIONS
REVOKE EXECUTE ON FUNCTION public.sync_new_creator_profile() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.sync_user_to_creator_profile() FROM anon, authenticated, PUBLIC;
