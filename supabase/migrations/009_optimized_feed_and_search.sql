-- ==========================================================
-- 009_optimized_feed_and_search.sql
-- NAAGRIK PLATFORM - FEED, SEARCH, TRGM INDEXES & IDEMPOTENCY
-- ==========================================================

-- 1. TRIGRAM SEARCH EXTENSION & INDEXES
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_contents_title_trgm 
ON public.contents USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_contents_desc_trgm 
ON public.contents USING gin (description gin_trgm_ops);

-- 2. ATOMIC IDEMPOTENT LIKES AND SAVES TABLES
CREATE TABLE IF NOT EXISTS public.content_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    device_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_content_likes_user UNIQUE (content_id, user_id),
    CONSTRAINT uq_content_likes_device UNIQUE (content_id, device_id),
    CONSTRAINT chk_content_likes_identity CHECK (user_id IS NOT NULL OR (device_id IS NOT NULL AND device_id <> ''))
);

CREATE TABLE IF NOT EXISTS public.content_saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    device_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_content_saves_user UNIQUE (content_id, user_id),
    CONSTRAINT uq_content_saves_device UNIQUE (content_id, device_id),
    CONSTRAINT chk_content_saves_identity CHECK (user_id IS NOT NULL OR (device_id IS NOT NULL AND device_id <> ''))
);

CREATE INDEX IF NOT EXISTS idx_content_likes_content ON public.content_likes(content_id);
CREATE INDEX IF NOT EXISTS idx_content_saves_content ON public.content_saves(content_id);

ALTER TABLE public.content_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_saves ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read own likes" ON public.content_likes;
CREATE POLICY "Allow read own likes" ON public.content_likes FOR SELECT
USING (user_id = (SELECT auth.uid()) OR device_id IS NOT NULL);

DROP POLICY IF EXISTS "Allow read own saves" ON public.content_saves;
CREATE POLICY "Allow read own saves" ON public.content_saves FOR SELECT
USING (user_id = (SELECT auth.uid()) OR device_id IS NOT NULL);

-- 3. IDEMPOTENT LIKE TOGGLE RPC
CREATE OR REPLACE FUNCTION public.toggle_content_like(
    p_content_id UUID,
    p_device_id TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_device_id TEXT;
    v_existing RECORD;
    v_likes INT;
    v_is_liked BOOLEAN;
BEGIN
    v_user_id := auth.uid();
    v_device_id := NULLIF(TRIM(COALESCE(p_device_id, '')), '');

    IF v_user_id IS NULL AND v_device_id IS NULL THEN
        v_device_id := 'anon_client';
    END IF;

    -- Check if content exists
    IF NOT EXISTS (SELECT 1 FROM public.contents WHERE id = p_content_id) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Content not found');
    END IF;

    -- Check existing like
    IF v_user_id IS NOT NULL THEN
        SELECT * INTO v_existing FROM public.content_likes 
        WHERE content_id = p_content_id AND user_id = v_user_id LIMIT 1;
    ELSE
        SELECT * INTO v_existing FROM public.content_likes 
        WHERE content_id = p_content_id AND device_id = v_device_id LIMIT 1;
    END IF;

    IF FOUND THEN
        -- Unlike
        DELETE FROM public.content_likes WHERE id = v_existing.id;
        UPDATE public.contents 
        SET likes = GREATEST(0, COALESCE(likes, 1) - 1), updated_at = NOW()
        WHERE id = p_content_id
        RETURNING likes INTO v_likes;
        v_is_liked := FALSE;
    ELSE
        -- Like
        INSERT INTO public.content_likes (content_id, user_id, device_id)
        VALUES (p_content_id, v_user_id, v_device_id)
        ON CONFLICT DO NOTHING;

        UPDATE public.contents 
        SET likes = COALESCE(likes, 0) + 1, updated_at = NOW()
        WHERE id = p_content_id
        RETURNING likes INTO v_likes;
        v_is_liked := TRUE;
    END IF;

    RETURN jsonb_build_object(
        'success', TRUE,
        'isLiked', v_is_liked,
        'likes', COALESCE(v_likes, 0)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.toggle_content_like TO anon, authenticated, service_role;

-- 4. IDEMPOTENT SAVE TOGGLE RPC
CREATE OR REPLACE FUNCTION public.toggle_content_save(
    p_content_id UUID,
    p_device_id TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_device_id TEXT;
    v_existing RECORD;
    v_saves INT;
    v_is_saved BOOLEAN;
BEGIN
    v_user_id := auth.uid();
    v_device_id := NULLIF(TRIM(COALESCE(p_device_id, '')), '');

    IF v_user_id IS NULL AND v_device_id IS NULL THEN
        v_device_id := 'anon_client';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.contents WHERE id = p_content_id) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Content not found');
    END IF;

    IF v_user_id IS NOT NULL THEN
        SELECT * INTO v_existing FROM public.content_saves 
        WHERE content_id = p_content_id AND user_id = v_user_id LIMIT 1;
    ELSE
        SELECT * INTO v_existing FROM public.content_saves 
        WHERE content_id = p_content_id AND device_id = v_device_id LIMIT 1;
    END IF;

    IF FOUND THEN
        -- Unsave
        DELETE FROM public.content_saves WHERE id = v_existing.id;
        UPDATE public.contents 
        SET saves = GREATEST(0, COALESCE(saves, 1) - 1), updated_at = NOW()
        WHERE id = p_content_id
        RETURNING saves INTO v_saves;
        v_is_saved := FALSE;
    ELSE
        -- Save
        INSERT INTO public.content_saves (content_id, user_id, device_id)
        VALUES (p_content_id, v_user_id, v_device_id)
        ON CONFLICT DO NOTHING;

        UPDATE public.contents 
        SET saves = COALESCE(saves, 0) + 1, updated_at = NOW()
        WHERE id = p_content_id
        RETURNING saves INTO v_saves;
        v_is_saved := TRUE;
    END IF;

    RETURN jsonb_build_object(
        'success', TRUE,
        'isSaved', v_is_saved,
        'saves', COALESCE(v_saves, 0)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.toggle_content_save TO anon, authenticated, service_role;

-- 5. HARDENED SERVER-AUTHORITATIVE track_video_view RPC
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
    v_auth_user_id UUID;
    v_device_id TEXT;
BEGIN
    -- Derive authenticated caller identity directly from JWT (never trust client parameter)
    v_auth_user_id := auth.uid();
    v_device_id := NULLIF(TRIM(COALESCE(p_device_id, '')), '');

    -- Lock and retrieve video record
    SELECT * INTO v_video FROM public.contents WHERE id = p_video_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Video content not found: %', p_video_id;
    END IF;

    -- Increment raw views count
    v_current_views := COALESCE(v_video.views, 0) + 1;
    v_current_eligible := COALESCE(v_video.eligible_views, 0);

    UPDATE public.contents 
    SET views = v_current_views, updated_at = NOW() 
    WHERE id = p_video_id;

    -- Retrieve system monetization settings
    SELECT * INTO v_settings FROM public.system_settings WHERE key = 'DEFAULT' LIMIT 1;
    IF FOUND THEN
        v_max_views := COALESCE(v_settings.max_counted_views_per_video, 3);
        v_rate_per_1000 := COALESCE(v_settings.earning_rate_per_1000_views, 1.0000);
    END IF;

    -- Check existing view record for this viewer
    SELECT * INTO v_view_record 
    FROM public.video_views 
    WHERE video_id = p_video_id 
      AND (
          (v_auth_user_id IS NOT NULL AND user_id = v_auth_user_id)
          OR (v_auth_user_id IS NULL AND v_device_id IS NOT NULL AND device_id = v_device_id)
      )
    FOR UPDATE;

    IF NOT FOUND THEN
        IF v_counted_views < v_max_views THEN
            v_counted_views := 1;
            -- Anti-fraud: Only authenticated users qualify views for creator monetization.
            -- Anonymous device rotations are tracked for engagement metrics but do not credit financial balance.
            IF v_auth_user_id IS NOT NULL THEN
                v_is_eligible := TRUE;
            END IF;
        END IF;

        INSERT INTO public.video_views (user_id, device_id, video_id, counted_view_count, last_viewed_at)
        VALUES (v_auth_user_id, v_device_id, p_video_id, v_counted_views, NOW());
    ELSE
        v_counted_views := COALESCE(v_view_record.counted_view_count, 0);
        IF v_counted_views < v_max_views THEN
            v_counted_views := v_counted_views + 1;
            IF v_auth_user_id IS NOT NULL THEN
                v_is_eligible := TRUE;
            END IF;

            UPDATE public.video_views 
            SET counted_view_count = v_counted_views, 
                last_viewed_at = NOW(),
                updated_at = NOW()
            WHERE id = v_view_record.id;
        ELSE
            UPDATE public.video_views 
            SET last_viewed_at = NOW(),
                updated_at = NOW()
            WHERE id = v_view_record.id;
        END IF;
    END IF;

    -- If view is eligible under ceiling, credit creator
    IF v_is_eligible THEN
        v_current_eligible := v_current_eligible + 1;
        UPDATE public.contents 
        SET eligible_views = v_current_eligible 
        WHERE id = p_video_id;

        v_view_earning := (v_rate_per_1000 / 1000.0);

        -- Lock and credit creator record
        SELECT * INTO v_creator FROM public.creators WHERE id = v_video.creator_id FOR UPDATE;
        IF FOUND THEN
            UPDATE public.creators 
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.track_video_view TO anon, authenticated, service_role;

-- 6. HIGH-PERFORMANCE TRIGRAM SEARCH RPC WITH STRICT LIMIT
CREATE OR REPLACE FUNCTION public.search_content(
    p_query TEXT,
    p_category_id UUID DEFAULT NULL,
    p_city TEXT DEFAULT NULL,
    p_type TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_results JSONB;
    v_clean_q TEXT := NULLIF(TRIM(LOWER(COALESCE(p_query, ''))), '');
    v_clean_city TEXT := NULLIF(TRIM(LOWER(COALESCE(p_city, ''))), '');
BEGIN
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
        'categoryId', c.category_id,
        'category_id', c.category_id,
        'views', c.views,
        'likes', c.likes,
        'publishedAt', c.published_at,
        'published_at', c.published_at,
        'creator', jsonb_build_object(
            'id', cr.id,
            'name', u.name,
            'profileImage', u.profile_image,
            'verificationStatus', cr.verification_status
        )
    )), '[]'::jsonb)
    INTO v_results
    FROM (
        SELECT c.*, cr.id as cr_id, cr.verification_status, u.name as u_name, u.profile_image as u_profile_image
        FROM public.contents c
        JOIN public.creators cr ON c.creator_id = cr.id
        JOIN public.users u ON cr.user_id = u.id
        WHERE c.moderation_status = 'APPROVED'
          AND c.publication_status = 'PUBLISHED'
          AND (p_category_id IS NULL OR c.category_id = p_category_id)
          AND (p_type IS NULL OR p_type = '' OR c.type = p_type)
          AND (v_clean_city IS NULL OR LOWER(COALESCE(c.location_city, c.location->>'city', '')) = v_clean_city)
          AND (
              v_clean_q IS NULL 
              OR c.title ILIKE '%' || v_clean_q || '%' 
              OR c.description ILIKE '%' || v_clean_q || '%'
              OR COALESCE(c.location_village, c.location_area, c.location->>'area', '') ILIKE '%' || v_clean_q || '%'
          )
        ORDER BY c.published_at DESC
        LIMIT 50
    ) c
    JOIN public.creators cr ON c.creator_id = cr.id
    JOIN public.users u ON cr.user_id = u.id;

    RETURN jsonb_build_object('success', TRUE, 'contents', v_results);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.search_content TO anon, authenticated, service_role;

-- 7. AGGREGATED ADMIN DASHBOARD STATS RPC (Database-side aggregation)
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS JSONB AS $$
DECLARE
    v_total_users BIGINT := 0;
    v_total_creators BIGINT := 0;
    v_active_creators BIGINT := 0;
    v_total_contents BIGINT := 0;
    v_published_content BIGINT := 0;
    v_pending_moderation BIGINT := 0;
    v_flagged_moderation BIGINT := 0;
    v_total_views BIGINT := 0;
    v_total_eligible_views BIGINT := 0;
    v_total_paid_out NUMERIC(14, 2) := 0;
    v_pending_payouts NUMERIC(14, 2) := 0;
    v_pending_payouts_count BIGINT := 0;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Only administrators can view dashboard metrics';
    END IF;

    SELECT COUNT(*) INTO v_total_users FROM public.users;
    SELECT COUNT(*), COUNT(*) FILTER (WHERE verification_status = 'VERIFIED') 
    INTO v_total_creators, v_active_creators FROM public.creators;

    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE moderation_status = 'APPROVED' AND publication_status = 'PUBLISHED'),
        COUNT(*) FILTER (WHERE moderation_status = 'PENDING_REVIEW'),
        COUNT(*) FILTER (WHERE moderation_status = 'FLAGGED'),
        COALESCE(SUM(views), 0),
        COALESCE(SUM(eligible_views), 0)
    INTO 
        v_total_contents,
        v_published_content,
        v_pending_moderation,
        v_flagged_moderation,
        v_total_views,
        v_total_eligible_views
    FROM public.contents;

    SELECT 
        COALESCE(SUM(amount) FILTER (WHERE status = 'PAID'), 0),
        COALESCE(SUM(amount) FILTER (WHERE status = 'PENDING'), 0),
        COUNT(*) FILTER (WHERE status = 'PENDING')
    INTO 
        v_total_paid_out,
        v_pending_payouts,
        v_pending_payouts_count
    FROM public.payout_requests;

    RETURN jsonb_build_object(
        'totalUsers', v_total_users,
        'totalCreators', v_total_creators,
        'activeCreators', v_active_creators,
        'totalReports', v_total_contents,
        'publishedContent', v_published_content,
        'pendingModeration', v_pending_moderation,
        'flaggedModeration', v_flagged_moderation,
        'totalViews', v_total_views,
        'totalEligibleViews', v_total_eligible_views,
        'totalPaidOut', v_total_paid_out,
        'pendingPayouts', v_pending_payouts,
        'pendingPayoutsCount', v_pending_payouts_count
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_stats TO authenticated, service_role;

-- 8. OPTIMIZED KEYSET & OFFSET CURSOR-BASED FEED RPC
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
    v_offset INT;
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
    v_next_cursor TEXT := NULL;
    v_has_more BOOLEAN := FALSE;
BEGIN
    -- Keyset cursor vs page offset calculation
    IF p_cursor IS NOT NULL AND p_cursor ~ '^[0-9]+$' THEN
        v_offset := p_cursor::int;
    ELSE
        v_offset := (GREATEST(COALESCE(p_page, 1), 1) - 1) * v_limit;
    END IF;

    -- 1. Read system settings for ad interleaving
    SELECT * INTO v_settings FROM public.system_settings WHERE key = 'DEFAULT' LIMIT 1;
    IF FOUND THEN
        v_ad_frequency := COALESCE(v_settings.ad_feed_frequency, 4);
    END IF;

    -- 2. Fetch active ads for interleaving
    SELECT COALESCE(jsonb_agg(to_jsonb(a)), '[]'::jsonb), COUNT(*)
    INTO v_ads, v_ads_count
    FROM public.advertisements a
    WHERE a.status = 'ACTIVE' AND NOW() BETWEEN a.start_date AND a.end_date;

    -- 3. Construct user geography point if coordinates supplied
    IF p_lat IS NOT NULL AND p_lng IS NOT NULL 
       AND p_lat BETWEEN -90 AND 90 AND p_lng BETWEEN -180 AND 180 THEN
        v_user_pt := ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography;
    END IF;

    -- 4. Count total eligible candidates
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
                'cursor', NULL,
                'hasMore', FALSE
            )
        );
    END IF;

    -- 5. Main ranking query with PostGIS distance, LGD hierarchy, Freshness decay, Quality boost, Engagement, and Diversity
    -- Fetch v_limit + 1 to authoritatively determine hasMore without redundant COUNT
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

                -- A. PostGIS Distance (in km)
                CASE 
                    WHEN v_user_pt IS NOT NULL AND c.coordinates_geo IS NOT NULL THEN
                        ST_Distance(c.coordinates_geo, v_user_pt) / 1000.0
                    ELSE NULL
                END AS dist_km,

                -- B. Spatial Score
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

                -- C. LGD Administrative Score
                CASE 
                    -- 1. Exact Village / Local Body / Exact Area match (100)
                    WHEN (p_local_body_code IS NOT NULL AND c.local_body_code = p_local_body_code)
                         OR (v_clean_pincode IS NOT NULL AND c.location_pincode = v_clean_pincode)
                         OR (v_clean_area IS NOT NULL AND (
                             LOWER(COALESCE(c.location_village, '')) = v_clean_area 
                             OR LOWER(COALESCE(c.location->>'area', '')) = v_clean_area
                         )) THEN 100.0

                    -- 2. Nearby Area in same Sub-District (85)
                    WHEN (p_subdistrict_code IS NOT NULL AND c.subdistrict_code = p_subdistrict_code
                          AND c.local_body_code IS NOT NULL AND c.local_body_code IS DISTINCT FROM p_local_body_code)
                         OR (v_clean_area IS NOT NULL AND (
                             (c.location_village IS NOT NULL AND LOWER(c.location_village) LIKE '%' || v_clean_area || '%' AND LOWER(c.location_village) <> v_clean_area)
                             OR (c.location->>'area' IS NOT NULL AND LOWER(c.location->>'area') LIKE '%' || v_clean_area || '%' AND LOWER(c.location->>'area') <> v_clean_area)
                         )) THEN 85.0

                    -- 3. Same Sub-District (75)
                    WHEN (p_subdistrict_code IS NOT NULL AND c.subdistrict_code = p_subdistrict_code)
                         OR (v_clean_area IS NOT NULL AND LOWER(COALESCE(c.location_subdistrict, '')) = v_clean_area) THEN 75.0

                    -- 4. Nearby Sub-District within same District (60)
                    WHEN (p_district_code IS NOT NULL AND c.district_code = p_district_code
                          AND c.subdistrict_code IS NOT NULL AND c.subdistrict_code <> p_subdistrict_code) THEN 60.0

                    -- 5. Same District (50)
                    WHEN (p_district_code IS NOT NULL AND c.district_code = p_district_code)
                         OR (v_clean_district IS NOT NULL AND (
                             LOWER(COALESCE(c.location_district, '')) = v_clean_district
                             OR LOWER(COALESCE(c.location->>'city', '')) = v_clean_district
                         ))
                         OR (v_clean_city IS NOT NULL AND (
                             LOWER(COALESCE(c.location_district, '')) = v_clean_city
                             OR LOWER(COALESCE(c.location->>'city', '')) = v_clean_city
                         )) THEN 50.0

                    -- 6. Nearby District / Same State vicinity (40)
                    WHEN (p_state_code IS NOT NULL AND c.state_code = p_state_code
                          AND (c.district_code IS DISTINCT FROM p_district_code)) THEN 40.0

                    -- 7. Same State (25)
                    WHEN (p_state_code IS NOT NULL AND c.state_code = p_state_code)
                         OR (v_clean_state IS NOT NULL AND LOWER(COALESCE(c.location->>'state', '')) = v_clean_state) THEN 25.0

                    -- 8. Wider / National News (10)
                    ELSE 10.0
                END AS admin_score,

                -- D. Age in hours
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
                
                -- Location Score = Max(Spatial Score, LGD Admin Score)
                GREATEST(COALESCE(cs.spatial_score, 0.0), COALESCE(cs.admin_score, 10.0)) AS location_score,

                -- Location Tier Label
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

                -- Freshness Boost
                CASE 
                    WHEN cs.age_hours < 1.0 THEN 50.0
                    WHEN cs.age_hours < 6.0 THEN 35.0
                    WHEN cs.age_hours < 24.0 THEN 20.0
                    WHEN cs.age_hours < 72.0 THEN 10.0
                    WHEN cs.age_hours >= 168.0 THEN 0.0
                    ELSE GREATEST(0.0, 10.0 * (1.0 - (cs.age_hours - 72.0) / 96.0))
                END AS freshness_score,

                -- Quality Boost (Verified Creator = +10, Pending = +3)
                CASE 
                    WHEN cs.verification_status = 'VERIFIED' THEN 10.0
                    WHEN cs.verification_status = 'PENDING' THEN 3.0
                    ELSE 0.0
                END AS quality_score,

                -- Engagement Score (Likes, Shares, Saves, Views)
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

                -- Window functions for Feed Diversification & Anti-Repetition
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
        LIMIT (v_limit + 1) OFFSET v_offset
    LOOP
        v_item_counter := v_item_counter + 1;

        -- If this is the extra (limit + 1) item, record hasMore = TRUE and exit loop
        IF v_item_counter > v_limit THEN
            v_has_more := TRUE;
            EXIT;
        END IF;

        -- Format content object with creator and ranking metadata
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

        -- Interleave active advertisement every v_ad_frequency items
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
    IF v_has_more THEN
        v_next_cursor := (v_offset + v_limit)::text;
    END IF;

    RETURN jsonb_build_object(
        'success', TRUE,
        'items', v_result_items,
        'pagination', jsonb_build_object(
            'page', p_page,
            'limit', v_limit,
            'totalItems', v_total_items,
            'totalPages', v_total_pages,
            'cursor', v_next_cursor,
            'hasMore', v_has_more
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_personalized_feed TO anon, authenticated, service_role;
