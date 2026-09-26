-- ==========================================================
-- 010_hardening_fixes.sql
-- NAAGRIK PLATFORM - SEARCH PATH HARDENING, UNINDEXED FK COVERAGE,
-- DETERMINISTIC TIE-BREAKING, MOBILE MONETIZATION & RPC LOCKDOWN
-- ==========================================================

-- 1. COVER UNINDEXED FOREIGN KEYS (Linter finding 0001)
CREATE INDEX IF NOT EXISTS idx_content_likes_user_id 
ON public.content_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_content_saves_user_id 
ON public.content_saves(user_id);

-- 2. HARDEN SEARCH_PATH ON HELPER & STORED PROCEDURES (Linter finding 0011)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = (SELECT auth.uid()) AND role = 'ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_current_creator_id()
RETURNS UUID AS $$
    SELECT id FROM public.creators WHERE user_id = (SELECT auth.uid()) LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- 3. HARDEN & UPDATE track_video_view RPC
-- Corrects mobile consumer monetization: In a credential-free NO SIGNUP / NO LOGIN
-- consumer mobile app, valid device IDs qualify for creator earnings under the 3-view ceiling.
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
    v_is_valid_device BOOLEAN := FALSE;
BEGIN
    -- Derive authenticated caller identity from JWT if present
    v_auth_user_id := auth.uid();
    v_device_id := NULLIF(TRIM(COALESCE(p_device_id, '')), '');

    -- Validate device identity for anonymous mobile consumers
    IF v_device_id IS NOT NULL 
       AND v_device_id NOT IN ('unknown_device', 'anonymous_device', 'anon_client', '') 
       AND LENGTH(v_device_id) >= 6 THEN
        v_is_valid_device := TRUE;
    END IF;

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

    -- Check existing view record for this viewer (user_id if authenticated, device_id for mobile consumers)
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
            -- Monetization eligibility: Authenticated user OR verified persistent mobile device ID
            IF v_auth_user_id IS NOT NULL OR v_is_valid_device THEN
                v_is_eligible := TRUE;
            END IF;
        END IF;

        INSERT INTO public.video_views (user_id, device_id, video_id, counted_view_count, last_viewed_at)
        VALUES (v_auth_user_id, v_device_id, p_video_id, v_counted_views, NOW());
    ELSE
        v_counted_views := COALESCE(v_view_record.counted_view_count, 0);
        IF v_counted_views < v_max_views THEN
            v_counted_views := v_counted_views + 1;
            IF v_auth_user_id IS NOT NULL OR v_is_valid_device THEN
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
        'counted_as_monetized', v_is_eligible,
        'currentCountedViews', v_counted_views,
        'counted_views_for_viewer', v_counted_views,
        'max_allowed', v_max_views,
        'totalViews', v_current_views,
        'eligibleViews', v_current_eligible
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.track_video_view TO anon, authenticated, service_role;

-- 4. HARDEN get_personalized_feed WITH DETERMINISTIC TIE-BREAKING
-- Guarantees stable cursor pagination when items share identical score and microsecond timestamp
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
    -- Deterministic order tie-breaker: final_rank_score DESC, published_at DESC, id DESC
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

                -- Window functions for Feed Diversification & Anti-Repetition with ID tie-breaking
                ROW_NUMBER() OVER (
                    PARTITION BY sc.creator_id 
                    ORDER BY (sc.location_score + sc.freshness_score + sc.quality_score + sc.engagement_score) DESC, sc.published_at DESC, sc.id DESC
                ) AS rank_by_creator,

                ROW_NUMBER() OVER (
                    PARTITION BY sc.category_id 
                    ORDER BY (sc.location_score + sc.freshness_score + sc.quality_score + sc.engagement_score) DESC, sc.published_at DESC, sc.id DESC
                ) AS rank_by_category,

                ROW_NUMBER() OVER (
                    PARTITION BY COALESCE(sc.location_village, sc.location->>'area', sc.location_district, sc.location->>'city')
                    ORDER BY (sc.location_score + sc.freshness_score + sc.quality_score + sc.engagement_score) DESC, sc.published_at DESC, sc.id DESC
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
        ORDER BY final_rank_score DESC, published_at DESC, id DESC
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

-- 5. OPTIMIZE search_content (ELIMINATE REDUNDANT DOUBLE JOIN)
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
        SELECT c.*
        FROM public.contents c
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
        ORDER BY c.published_at DESC, c.id DESC
        LIMIT 50
    ) c
    JOIN public.creators cr ON c.creator_id = cr.id
    JOIN public.users u ON cr.user_id = u.id;

    RETURN jsonb_build_object('success', TRUE, 'contents', v_results);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.search_content TO anon, authenticated, service_role;

-- 6. HARDEN ADMIN RPCS & REVOKE ANONYMOUS EXECUTE (Linter finding 0028)
REVOKE EXECUTE ON FUNCTION public.get_admin_dashboard_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_stats() TO authenticated, service_role;

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

    SELECT * INTO v_content FROM public.contents WHERE id = p_content_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Content not found: %', p_content_id;
    END IF;

    IF p_admin_id IS NOT NULL THEN
        SELECT email INTO v_admin_email FROM public.users WHERE id = p_admin_id;
    ELSE
        SELECT email INTO v_admin_email FROM public.users WHERE id = auth.uid();
    END IF;

    UPDATE public.contents
    SET moderation_status = p_moderation_status,
        publication_status = CASE WHEN v_is_approved THEN 'PUBLISHED' ELSE 'DRAFT' END,
        published_at = CASE WHEN v_is_approved THEN NOW() ELSE published_at END,
        rejection_reason = CASE WHEN NOT v_is_approved THEN p_rejection_reason ELSE NULL END,
        updated_at = NOW()
    WHERE id = p_content_id
    RETURNING * INTO v_content;

    -- Record Audit Log
    INSERT INTO public.audit_logs (actor_id, actor_email, actor_role, action, entity, entity_id, metadata)
    VALUES (
        COALESCE(p_admin_id, auth.uid()),
        COALESCE(v_admin_email, 'admin@nagrik.news'),
        'ADMIN',
        'CONTENT_MODERATION_' || p_moderation_status,
        'Content',
        p_content_id::text,
        jsonb_build_object('status', p_moderation_status, 'rejectionReason', p_rejection_reason)
    );

    RETURN to_jsonb(v_content);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.admin_moderate_content(UUID, TEXT, TEXT, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_moderate_content(UUID, TEXT, TEXT, UUID) TO authenticated, service_role;

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

    SELECT * INTO v_request FROM public.payout_requests WHERE id = p_payout_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payout request not found: %', p_payout_id;
    END IF;

    IF p_admin_id IS NOT NULL THEN
        SELECT email INTO v_admin_email FROM public.users WHERE id = p_admin_id;
    ELSE
        SELECT email INTO v_admin_email FROM public.users WHERE id = auth.uid();
    END IF;

    UPDATE public.payout_requests
    SET status = p_status,
        transaction_reference = COALESCE(p_transaction_reference, transaction_reference),
        admin_note = COALESCE(p_admin_note, admin_note),
        processed_at = CASE WHEN p_status IN ('PAID', 'REJECTED') THEN NOW() ELSE processed_at END,
        updated_at = NOW()
    WHERE id = p_payout_id
    RETURNING * INTO v_request;

    -- Record Audit Log
    INSERT INTO public.audit_logs (actor_id, actor_email, actor_role, action, entity, entity_id, metadata)
    VALUES (
        COALESCE(p_admin_id, auth.uid()),
        COALESCE(v_admin_email, 'admin@nagrik.news'),
        'ADMIN',
        'PAYOUT_' || p_status,
        'PayoutRequest',
        p_payout_id::text,
        jsonb_build_object('status', p_status, 'transactionReference', p_transaction_reference, 'note', p_admin_note)
    );

    RETURN to_jsonb(v_request);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.admin_process_payout(UUID, TEXT, TEXT, TEXT, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_process_payout(UUID, TEXT, TEXT, TEXT, UUID) TO authenticated, service_role;

-- Hardening remaining RPCs with SET search_path = public
CREATE OR REPLACE FUNCTION public.get_creator_dashboard_stats(p_creator_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_creator RECORD;
    v_total_content BIGINT := 0;
    v_total_views BIGINT := 0;
    v_total_eligible_views BIGINT := 0;
BEGIN
    SELECT * INTO v_creator FROM public.creators WHERE id = p_creator_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Creator not found: %', p_creator_id;
    END IF;

    SELECT 
        COUNT(*),
        COALESCE(SUM(views), 0),
        COALESCE(SUM(eligible_views), 0)
    INTO 
        v_total_content,
        v_total_views,
        v_total_eligible_views
    FROM public.contents
    WHERE creator_id = p_creator_id;

    RETURN jsonb_build_object(
        'totalContent', v_total_content,
        'totalViews', v_total_views,
        'totalEligibleViews', v_total_eligible_views,
        'availableBalance', COALESCE(v_creator.available_balance, 0),
        'lifetimeEarnings', COALESCE(v_creator.lifetime_earnings, 0),
        'totalPaid', COALESCE(v_creator.total_paid, 0),
        'verificationStatus', v_creator.verification_status
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.request_payout(
    p_creator_id UUID,
    p_amount NUMERIC,
    p_payout_method_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_creator RECORD;
    v_settings RECORD;
    v_payout_request RECORD;
    v_min_payout NUMERIC := 10.0;
BEGIN
    SELECT * INTO v_settings FROM public.system_settings WHERE key = 'DEFAULT' LIMIT 1;
    IF FOUND THEN
        v_min_payout := COALESCE(v_settings.min_payout_amount, 10.0);
    END IF;

    IF p_amount < v_min_payout THEN
        RAISE EXCEPTION 'Requested amount (%) is less than the minimum payout threshold (%)', p_amount, v_min_payout;
    END IF;

    SELECT * INTO v_creator FROM public.creators WHERE id = p_creator_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Creator not found: %', p_creator_id;
    END IF;

    IF COALESCE(v_creator.available_balance, 0) < p_amount THEN
        RAISE EXCEPTION 'Insufficient balance: available %, requested %', v_creator.available_balance, p_amount;
    END IF;

    UPDATE public.creators
    SET available_balance = v_creator.available_balance - p_amount,
        updated_at = NOW()
    WHERE id = p_creator_id;

    INSERT INTO public.payout_requests (creator_id, amount, payout_method_id, status)
    VALUES (p_creator_id, p_amount, p_payout_method_id, 'PENDING')
    RETURNING * INTO v_payout_request;

    RETURN to_jsonb(v_payout_request);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.report_content(
    p_content_id UUID,
    p_reason TEXT,
    p_device_id TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_report RECORD;
BEGIN
    INSERT INTO public.reports (content_id, reporter_id, reason, device_id, status)
    VALUES (p_content_id, auth.uid(), p_reason, p_device_id, 'PENDING')
    RETURNING * INTO v_report;

    RETURN jsonb_build_object('success', TRUE, 'reportId', v_report.id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.report_content TO anon, authenticated, service_role;
