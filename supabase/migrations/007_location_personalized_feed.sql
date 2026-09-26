-- ==========================================================
-- 007_location_personalized_feed.sql
-- LOCATION-PRIORITY PERSONALIZED NEWS FEED WITH POSTGIS & LGD HIERARCHY
-- ==========================================================

-- 1. Ensure PostGIS and GiST indexes exist for high-speed spatial radar queries
CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE INDEX IF NOT EXISTS idx_contents_coordinates_geo 
ON public.contents USING GIST (coordinates_geo);

CREATE INDEX IF NOT EXISTS idx_contents_feed_ranking
ON public.contents(moderation_status, publication_status, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_contents_lgd_composite
ON public.contents(state_code, district_code, subdistrict_code, local_body_code);

-- 2. Stored Procedure: public.get_personalized_feed
-- Multi-signal ranking:
-- Score = Location Relevance + Freshness Decay + Quality Boost + Engagement Score - Diversity Penalty
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
    v_offset INT := (GREATEST(COALESCE(p_page, 1), 1) - 1) * v_limit;
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
BEGIN
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
                'cursor', NULL
            )
        );
    END IF;

    -- 5. Main ranking query with PostGIS distance, LGD hierarchy, Freshness decay, Quality boost, Engagement, and Diversity
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
            -- Apply diversity penalty to stagger repeated creators, categories, and areas
            ROUND((
                pr.raw_rank_score 
                - (pr.rank_by_creator - 1) * 8.0 
                - (pr.rank_by_category - 1) * 3.0 
                - (pr.rank_by_area - 1) * 4.0
            )::numeric, 2) AS final_rank_score
        FROM pre_ranked pr
        ORDER BY final_rank_score DESC, published_at DESC
        LIMIT v_limit OFFSET v_offset
    LOOP
        v_item_counter := v_item_counter + 1;

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

    RETURN jsonb_build_object(
        'success', TRUE,
        'items', v_result_items,
        'pagination', jsonb_build_object(
            'page', p_page,
            'limit', v_limit,
            'totalItems', v_total_items,
            'totalPages', v_total_pages,
            'cursor', CASE 
                WHEN v_item_counter > 0 THEN (p_page * v_limit)::text 
                ELSE NULL 
            END
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execute permissions to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.get_personalized_feed TO anon, authenticated, service_role;
