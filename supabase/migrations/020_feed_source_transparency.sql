-- ==========================================================
-- 020: FEED AND SEARCH SOURCE TRANSPARENCY ENHANCEMENT
-- Projects author_name, source_name, source_url, media_attribution,
-- is_original, correction_note, correction_status, and updated_at
-- into get_personalized_feed and search_content JSON payloads.
-- ==========================================================

-- 1. UPDATE get_personalized_feed WITH COMPLETE SOURCE TRANSPARENCY
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
    v_clean_pincode TEXT;
    v_clean_area TEXT;
    v_clean_city TEXT;
    v_clean_district TEXT;
    v_clean_state TEXT;
    v_limit INT;
    v_offset INT;
    v_total_items INT := 0;
    v_total_pages INT := 0;
    v_item RECORD;
    v_result_items JSONB := '[]'::jsonb;
    v_has_more BOOLEAN := FALSE;
    v_next_cursor TEXT := NULL;
    v_ad_frequency INT := 5;
    v_item_counter INT := 0;
    v_ad_idx INT := 0;
    v_ads JSONB := '[]'::jsonb;
    v_ads_count INT := 0;
BEGIN
    v_limit := LEAST(GREATEST(COALESCE(p_limit, 20), 1), 50);

    IF p_cursor IS NOT NULL AND p_cursor ~ '^\d+$' THEN
        v_offset := p_cursor::INT;
    ELSE
        v_offset := (GREATEST(COALESCE(p_page, 1), 1) - 1) * v_limit;
    END IF;

    IF p_lat IS NOT NULL AND p_lng IS NOT NULL AND p_lat <> 0 AND p_lng <> 0 THEN
        v_user_pt := ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography;
    END IF;

    v_clean_pincode := NULLIF(TRIM(p_pincode), '');
    v_clean_area := NULLIF(LOWER(TRIM(COALESCE(p_area, ''))), '');
    v_clean_city := NULLIF(LOWER(TRIM(COALESCE(p_city, ''))), '');
    v_clean_district := NULLIF(LOWER(TRIM(COALESCE(p_district, ''))), '');
    v_clean_state := NULLIF(LOWER(TRIM(COALESCE(p_state, ''))), '');

    -- Retrieve active advertisements
    SELECT COALESCE(jsonb_agg(row_to_json(a)), '[]'::jsonb)
    INTO v_ads
    FROM (
        SELECT id, campaign_name, title, body, media_url, click_url, target_url, 
               placement, ad_format, creative_type, is_active
        FROM public.advertisements
        WHERE is_active = TRUE 
          AND (start_date IS NULL OR start_date <= NOW())
          AND (end_date IS NULL OR end_date >= NOW())
        ORDER BY priority ASC, created_at DESC
        LIMIT 10
    ) a;
    v_ads_count := jsonb_array_length(v_ads);

    -- Calculate total matching approved content count
    SELECT COUNT(*) INTO v_total_items
    FROM public.contents c
    WHERE c.moderation_status = 'APPROVED'
      AND c.publication_status = 'PUBLISHED'
      AND (p_content_type IS NULL OR p_content_type = '' OR c.type = p_content_type)
      AND (p_category_id IS NULL OR c.category_id = p_category_id);

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
                    WHEN (p_local_body_code IS NOT NULL AND c.local_body_code = p_local_body_code)
                         OR (v_clean_pincode IS NOT NULL AND c.location_pincode = v_clean_pincode)
                         OR (v_clean_area IS NOT NULL AND (
                             LOWER(COALESCE(c.location_village, '')) = v_clean_area 
                             OR LOWER(COALESCE(c.location->>'area', '')) = v_clean_area
                         )) THEN 100.0

                    WHEN (p_subdistrict_code IS NOT NULL AND c.subdistrict_code = p_subdistrict_code
                          AND c.local_body_code IS NOT NULL AND c.local_body_code IS DISTINCT FROM p_local_body_code)
                         OR (v_clean_area IS NOT NULL AND (
                             (c.location_village IS NOT NULL AND LOWER(c.location_village) LIKE '%' || v_clean_area || '%' AND LOWER(c.location_village) <> v_clean_area)
                             OR (c.location->>'area' IS NOT NULL AND LOWER(c.location->>'area') LIKE '%' || v_clean_area || '%' AND LOWER(c.location->>'area') <> v_clean_area)
                         )) THEN 85.0

                    WHEN (p_subdistrict_code IS NOT NULL AND c.subdistrict_code = p_subdistrict_code)
                         OR (v_clean_area IS NOT NULL AND LOWER(COALESCE(c.location_subdistrict, '')) = v_clean_area) THEN 75.0

                    WHEN (p_district_code IS NOT NULL AND c.district_code = p_district_code
                          AND c.subdistrict_code IS NOT NULL AND c.subdistrict_code <> p_subdistrict_code) THEN 60.0

                    WHEN (p_district_code IS NOT NULL AND c.district_code = p_district_code)
                         OR (v_clean_district IS NOT NULL AND (
                             LOWER(COALESCE(c.location_district, '')) = v_clean_district
                             OR LOWER(COALESCE(c.location->>'city', '')) = v_clean_district
                         ))
                         OR (v_clean_city IS NOT NULL AND (
                             LOWER(COALESCE(c.location_district, '')) = v_clean_city
                             OR LOWER(COALESCE(c.location->>'city', '')) = v_clean_city
                         )) THEN 50.0

                    WHEN (p_state_code IS NOT NULL AND c.state_code = p_state_code
                          AND (c.district_code IS DISTINCT FROM p_district_code)) THEN 40.0

                    WHEN (p_state_code IS NOT NULL AND c.state_code = p_state_code)
                         OR (v_clean_state IS NOT NULL AND LOWER(COALESCE(c.location->>'state', '')) = v_clean_state) THEN 25.0

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
                GREATEST(COALESCE(cs.spatial_score, 0.0), COALESCE(cs.admin_score, 10.0)) AS location_score,
                CASE 
                    WHEN GREATEST(COALESCE(cs.spatial_score, 0.0), COALESCE(cs.admin_score, 10.0)) >= 85.0 THEN 'HYPERLOCAL'
                    WHEN GREATEST(COALESCE(cs.spatial_score, 0.0), COALESCE(cs.admin_score, 10.0)) >= 60.0 THEN 'SUBDISTRICT'
                    WHEN GREATEST(COALESCE(cs.spatial_score, 0.0), COALESCE(cs.admin_score, 10.0)) >= 50.0 THEN 'DISTRICT'
                    WHEN GREATEST(COALESCE(cs.spatial_score, 0.0), COALESCE(cs.admin_score, 10.0)) >= 35.0 THEN 'NEARBY_DISTRICT'
                    WHEN GREATEST(COALESCE(cs.spatial_score, 0.0), COALESCE(cs.admin_score, 10.0)) >= 20.0 THEN 'STATE'
                    ELSE 'NATIONAL'
                END AS location_tier,

                CASE 
                    WHEN cs.age_hours < 1.0 THEN 50.0
                    WHEN cs.age_hours < 6.0 THEN 35.0
                    WHEN cs.age_hours < 24.0 THEN 20.0
                    WHEN cs.age_hours < 72.0 THEN 10.0
                    WHEN cs.age_hours >= 168.0 THEN 0.0
                    ELSE GREATEST(0.0, 10.0 * (1.0 - (cs.age_hours - 72.0) / 96.0))
                END AS freshness_score,

                CASE 
                    WHEN cs.verification_status = 'VERIFIED' THEN 10.0
                    WHEN cs.verification_status = 'PENDING' THEN 3.0
                    ELSE 0.0
                END AS quality_score,

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

        IF v_item_counter > v_limit THEN
            v_has_more := TRUE;
            EXIT;
        END IF;

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
                    'categorySlug', v_item.category_slug,
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
                    'commentsCount', COALESCE(v_item.comments_count, 0),
                    'comments_count', COALESCE(v_item.comments_count, 0),
                    'publishedAt', v_item.published_at,
                    'published_at', v_item.published_at,
                    'createdAt', v_item.created_at,
                    'updatedAt', v_item.updated_at,
                    'updated_at', v_item.updated_at,
                    -- Source Transparency & Editorial Provenance
                    'authorName', v_item.author_name,
                    'author_name', v_item.author_name,
                    'sourceName', v_item.source_name,
                    'source_name', v_item.source_name,
                    'sourceUrl', v_item.source_url,
                    'source_url', v_item.source_url,
                    'mediaAttribution', v_item.media_attribution,
                    'media_attribution', v_item.media_attribution,
                    'isOriginal', COALESCE(v_item.is_original, true),
                    'is_original', COALESCE(v_item.is_original, true),
                    'correctionNote', v_item.correction_note,
                    'correction_note', v_item.correction_note,
                    'correctionStatus', COALESCE(v_item.correction_status, 'NONE'),
                    'correction_status', COALESCE(v_item.correction_status, 'NONE'),
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
        'page', (v_offset / v_limit) + 1,
        'limit', v_limit,
        'totalItems', v_total_items,
        'totalPages', v_total_pages,
        'hasMore', v_has_more,
        'nextCursor', v_next_cursor,
        'items', v_result_items
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_personalized_feed TO anon, authenticated, service_role;

-- 2. UPDATE search_content WITH COMPLETE SOURCE TRANSPARENCY
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
        'updatedAt', c.updated_at,
        'updated_at', c.updated_at,
        -- Source Transparency & Editorial Provenance
        'authorName', c.author_name,
        'author_name', c.author_name,
        'sourceName', c.source_name,
        'source_name', c.source_name,
        'sourceUrl', c.source_url,
        'source_url', c.source_url,
        'mediaAttribution', c.media_attribution,
        'media_attribution', c.media_attribution,
        'isOriginal', COALESCE(c.is_original, true),
        'is_original', COALESCE(c.is_original, true),
        'correctionNote', c.correction_note,
        'correction_note', c.correction_note,
        'correctionStatus', COALESCE(c.correction_status, 'NONE'),
        'correction_status', COALESCE(c.correction_status, 'NONE'),
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
        LEFT JOIN public.creators cr ON c.creator_id = cr.id
        LEFT JOIN public.users u ON cr.user_id = u.id
        WHERE c.moderation_status = 'APPROVED'
          AND c.publication_status = 'PUBLISHED'
          AND (
              v_clean_type IS NULL 
              OR c.type = v_clean_type
          )
          AND (
              v_cat_uuid IS NULL 
              OR c.category_id = v_cat_uuid
              OR LOWER(COALESCE(cat.slug, '')) = v_clean_cat
          )
          AND (
              v_clean_city IS NULL 
              OR LOWER(COALESCE(c.location_city, c.location->>'city', '')) = v_clean_city
              OR LOWER(COALESCE(c.location_district, c.location->>'district', '')) = v_clean_city
          )
          AND (
              v_clean_q IS NULL 
              OR LOWER(c.title) LIKE '%' || v_clean_q || '%'
              OR LOWER(c.description) LIKE '%' || v_clean_q || '%'
              OR LOWER(COALESCE(c.location_village, c.location_area, c.location->>'area', '')) LIKE '%' || v_clean_q || '%'
              OR LOWER(COALESCE(c.location_city, c.location->>'city', '')) LIKE '%' || v_clean_q || '%'
              OR LOWER(COALESCE(cat.name, '')) LIKE '%' || v_clean_q || '%'
          )
        ORDER BY search_rank DESC, c.published_at DESC, c.id DESC
        LIMIT 50
    ) c
    LEFT JOIN public.categories cat ON c.category_id = cat.id
    LEFT JOIN public.creators cr ON c.creator_id = cr.id
    LEFT JOIN public.users u ON cr.user_id = u.id;

    RETURN v_results;
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_content(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;
