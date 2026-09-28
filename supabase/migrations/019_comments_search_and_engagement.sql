-- ============================================================================
-- Migration 019: Real Comments, Smart Search, and Engagement Tracking
-- Description: Adds comments table, automated sync triggers, RLS policies,
--              smart search RPC supporting keywords and category slugs, and 
--              engagement increment procedures.
-- ============================================================================

-- 1. Ensure comments_count on contents table
ALTER TABLE public.contents 
ADD COLUMN IF NOT EXISTS comments_count INTEGER NOT NULL DEFAULT 0;

-- 2. Create public.comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    device_id TEXT,
    author_name TEXT NOT NULL DEFAULT 'Citizen',
    author_avatar TEXT,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_content_id ON public.comments(content_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);

-- 3. Trigger for comments_count sync
CREATE OR REPLACE FUNCTION public.sync_content_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.contents
        SET comments_count = (
            SELECT COUNT(*)::int FROM public.comments WHERE content_id = NEW.content_id
        ),
        updated_at = NOW()
        WHERE id = NEW.content_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.contents
        SET comments_count = (
            SELECT COUNT(*)::int FROM public.comments WHERE content_id = OLD.content_id
        ),
        updated_at = NOW()
        WHERE id = OLD.content_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_sync_content_comments_count ON public.comments;
CREATE TRIGGER trigger_sync_content_comments_count
AFTER INSERT OR DELETE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.sync_content_comments_count();

-- 4. Enable RLS on comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view comments on published content" ON public.comments;
CREATE POLICY "Anyone can view comments on published content"
ON public.comments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.contents c
        WHERE c.id = comments.content_id
          AND c.moderation_status = 'APPROVED'
          AND c.publication_status = 'PUBLISHED'
    )
);

DROP POLICY IF EXISTS "Users can insert comments" ON public.comments;
CREATE POLICY "Users can insert comments"
ON public.comments FOR INSERT
WITH CHECK (
    text IS NOT NULL AND LENGTH(TRIM(text)) > 0
);

-- 5. RPC get_content_comments
CREATE OR REPLACE FUNCTION public.get_content_comments(
    p_content_id UUID,
    p_limit INT DEFAULT 50,
    p_offset INT DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_results JSONB;
    v_total INT;
BEGIN
    SELECT COUNT(*) INTO v_total
    FROM public.comments
    WHERE content_id = p_content_id;

    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', cm.id,
        'contentId', cm.content_id,
        'author', jsonb_build_object(
            'id', COALESCE(cm.user_id::text, cm.device_id, 'anon'),
            'name', COALESCE(u.name, cm.author_name, 'Citizen'),
            'profileImage', COALESCE(u.profile_image, cm.author_avatar),
            'isVerified', CASE WHEN u.role IN ('CREATOR', 'ADMIN') THEN TRUE ELSE FALSE END
        ),
        'text', cm.text,
        'createdAt', cm.created_at,
        'updatedAt', cm.updated_at
    )), '[]'::jsonb)
    INTO v_results
    FROM (
        SELECT *
        FROM public.comments
        WHERE content_id = p_content_id
        ORDER BY created_at DESC
        LIMIT LEAST(GREATEST(p_limit, 1), 100)
        OFFSET GREATEST(p_offset, 0)
    ) cm
    LEFT JOIN public.users u ON cm.user_id = u.id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'total', v_total,
        'comments', v_results
    );
END;
$$;

-- 6. RPC add_content_comment
CREATE OR REPLACE FUNCTION public.add_content_comment(
    p_content_id UUID,
    p_text TEXT,
    p_author_name TEXT DEFAULT NULL,
    p_device_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_user_name TEXT;
    v_user_avatar TEXT;
    v_is_verified BOOLEAN := FALSE;
    v_new_comment RECORD;
    v_comments_count INT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.contents WHERE id = p_content_id) THEN
        RETURN jsonb_build_object('success', FALSE, 'error', 'Content not found');
    END IF;

    IF p_text IS NULL OR LENGTH(TRIM(p_text)) = 0 THEN
        RETURN jsonb_build_object('success', FALSE, 'error', 'Comment text cannot be empty');
    END IF;

    v_user_id := auth.uid();
    IF v_user_id IS NOT NULL THEN
        SELECT name, profile_image, (role IN ('CREATOR', 'ADMIN'))
        INTO v_user_name, v_user_avatar, v_is_verified
        FROM public.users WHERE id = v_user_id;
    END IF;

    v_user_name := COALESCE(v_user_name, NULLIF(TRIM(p_author_name), ''), 'Citizen');

    INSERT INTO public.comments (
        content_id,
        user_id,
        device_id,
        author_name,
        author_avatar,
        text
    ) VALUES (
        p_content_id,
        v_user_id,
        NULLIF(TRIM(p_device_id), ''),
        v_user_name,
        v_user_avatar,
        TRIM(p_text)
    )
    RETURNING * INTO v_new_comment;

    SELECT comments_count INTO v_comments_count
    FROM public.contents WHERE id = p_content_id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'commentsCount', COALESCE(v_comments_count, 0),
        'comment', jsonb_build_object(
            'id', v_new_comment.id,
            'contentId', v_new_comment.content_id,
            'author', jsonb_build_object(
                'id', COALESCE(v_user_id::text, v_new_comment.device_id, 'anon'),
                'name', v_new_comment.author_name,
                'profileImage', v_new_comment.author_avatar,
                'isVerified', v_is_verified
            ),
            'text', v_new_comment.text,
            'createdAt', v_new_comment.created_at,
            'updatedAt', v_new_comment.updated_at
        )
    );
END;
$$;

-- 7. RPC increment_content_share
CREATE OR REPLACE FUNCTION public.increment_content_share(
    p_content_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_shares INT;
BEGIN
    UPDATE public.contents
    SET shares = COALESCE(shares, 0) + 1, updated_at = NOW()
    WHERE id = p_content_id
    RETURNING shares INTO v_shares;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', FALSE, 'error', 'Content not found');
    END IF;

    RETURN jsonb_build_object(
        'success', TRUE,
        'shares', COALESCE(v_shares, 0)
    );
END;
$$;

-- 8. Smart and flexible search_content
DROP FUNCTION IF EXISTS public.search_content(text, uuid, text, text);
DROP FUNCTION IF EXISTS public.search_content(text, text, text, text);

CREATE OR REPLACE FUNCTION public.search_content(
    p_query TEXT DEFAULT NULL,
    p_category_id TEXT DEFAULT NULL,
    p_city TEXT DEFAULT NULL,
    p_type TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_results JSONB;
    v_clean_q TEXT := NULLIF(TRIM(LOWER(COALESCE(p_query, ''))), '');
    v_clean_city TEXT := NULLIF(TRIM(LOWER(COALESCE(p_city, ''))), '');
    v_clean_cat TEXT := NULLIF(TRIM(LOWER(COALESCE(p_category_id, ''))), '');
    v_clean_type TEXT := NULLIF(TRIM(UPPER(COALESCE(p_type, ''))), '');
    v_cat_uuid UUID := NULL;
BEGIN
    IF v_clean_cat IS NOT NULL AND v_clean_cat ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
        v_cat_uuid := v_clean_cat::UUID;
    END IF;

    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', c.id,
        '_id', c.id,
        'type', c.type,
        'title', c.title,
        'description', c.description,
        'mediaUrl', c.media_url,
        'media_url', c.media_url,
        'thumbnailUrl', c.thumbnail_url,
        'thumbnail_url', c.thumbnail_url,
        'city', COALESCE(c.location_city, c.location->>'city', ''),
        'area', COALESCE(c.location_village, c.location_area, c.location->>'area', ''),
        'location', c.location,
        'categoryId', c.category_id,
        'category_id', c.category_id,
        'categoryName', cat.name,
        'categorySlug', cat.slug,
        'views', c.views,
        'eligibleViews', c.eligible_views,
        'likes', c.likes,
        'shares', c.shares,
        'saves', c.saves,
        'commentsCount', COALESCE(c.comments_count, 0),
        'comments_count', COALESCE(c.comments_count, 0),
        'publishedAt', c.published_at,
        'published_at', c.published_at,
        'createdAt', c.created_at,
        'creator', jsonb_build_object(
            'id', cr.id,
            'name', u.name,
            'profileImage', u.profile_image,
            'verificationStatus', cr.verification_status
        ),
        'creatorId', jsonb_build_object(
            'id', cr.id,
            'name', u.name,
            'profileImage', u.profile_image,
            'verificationStatus', cr.verification_status
        )
    )), '[]'::jsonb)
    INTO v_results
    FROM (
        SELECT 
            c.*,
            CASE 
                WHEN v_clean_q IS NULL THEN 1.0
                WHEN LOWER(c.title) = v_clean_q THEN 100.0
                WHEN LOWER(c.title) LIKE v_clean_q || '%' THEN 50.0
                WHEN LOWER(c.title) LIKE '%' || v_clean_q || '%' THEN 25.0
                WHEN LOWER(c.description) LIKE '%' || v_clean_q || '%' THEN 10.0
                WHEN LOWER(COALESCE(c.location_city, c.location->>'city', '')) LIKE '%' || v_clean_q || '%' THEN 8.0
                WHEN LOWER(COALESCE(c.location_village, c.location_area, c.location->>'area', '')) LIKE '%' || v_clean_q || '%' THEN 5.0
                ELSE 1.0
            END +
            CASE 
                WHEN v_clean_city IS NOT NULL AND LOWER(COALESCE(c.location_city, c.location->>'city', '')) = v_clean_city THEN 15.0
                ELSE 0.0
            END AS search_rank
        FROM public.contents c
        LEFT JOIN public.categories cat ON c.category_id = cat.id
        WHERE c.moderation_status = 'APPROVED'
          AND c.publication_status = 'PUBLISHED'
          AND (
              v_clean_type IS NULL 
              OR c.type = v_clean_type
          )
          AND (
              v_clean_cat IS NULL
              OR (v_cat_uuid IS NOT NULL AND c.category_id = v_cat_uuid)
              OR (cat.slug IS NOT NULL AND LOWER(cat.slug) = v_clean_cat)
              OR (cat.name IS NOT NULL AND LOWER(cat.name) = v_clean_cat)
          )
          AND (
              v_clean_q IS NULL 
              OR c.title ILIKE '%' || v_clean_q || '%' 
              OR c.description ILIKE '%' || v_clean_q || '%'
              OR COALESCE(c.location_village, c.location_area, c.location->>'area', '') ILIKE '%' || v_clean_q || '%'
              OR COALESCE(c.location_city, c.location->>'city', '') ILIKE '%' || v_clean_q || '%'
              OR COALESCE(c.location_state, c.location->>'state', '') ILIKE '%' || v_clean_q || '%'
              OR COALESCE(cat.name, '') ILIKE '%' || v_clean_q || '%'
              OR COALESCE(cat.slug, '') ILIKE '%' || v_clean_q || '%'
          )
        ORDER BY search_rank DESC, c.published_at DESC, c.id DESC
        LIMIT 50
    ) c
    JOIN public.creators cr ON c.creator_id = cr.id
    JOIN public.users u ON cr.user_id = u.id
    LEFT JOIN public.categories cat ON c.category_id = cat.id;

    RETURN jsonb_build_object('success', TRUE, 'contents', v_results);
END;
$$;
