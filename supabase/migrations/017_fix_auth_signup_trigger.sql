-- ==========================================================
-- 017_fix_auth_signup_trigger.sql
-- FIX SUPABASE AUTH SIGNUP TRIGGER & PASSWORD_HASH NULLABILITY
-- ==========================================================

-- 1. Ensure password_hash is nullable (Supabase Auth manages user credentials)
ALTER TABLE public.users ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE public.users ALTER COLUMN password_hash SET DEFAULT NULL;

-- 2. Update handle_new_auth_user function with correct column names for users and creators
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
    v_role TEXT;
    v_name TEXT;
    v_user_id UUID := NEW.id;
BEGIN
    -- Extract role from metadata: strictly allow only 'USER' or 'CREATOR'.
    -- ADMIN role can never be self-assigned via client-provided user_metadata.
    v_role := UPPER(COALESCE(NEW.raw_user_meta_data->>'role', 'CREATOR'));
    IF v_role NOT IN ('USER', 'CREATOR') THEN
        v_role := 'CREATOR';
    END IF;

    -- Extract name, defaulting to email prefix
    v_name := COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));

    -- Upsert public.users record
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

    -- If role is CREATOR, ensure a creator profile is auto-created
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

-- 3. Recreate trigger on auth.users
DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_auth_user();
