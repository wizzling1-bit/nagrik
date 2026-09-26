-- ==========================================================
-- 004_stored_procedures.sql
-- NAAGRIK PLATFORM - ATOMIC STORED PROCEDURES & BUSINESS RPCS
-- ==========================================================

-- 1. TRACK VIDEO VIEW (Enforces strict 3-view monetization ceiling & calculates creator earnings)
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
    v_viewer_id TEXT;
BEGIN
    -- Determine viewer identifier (user_id takes precedence over device_id)
    v_viewer_id := COALESCE(p_user_id::text, p_device_id);
    IF v_viewer_id IS NULL OR v_viewer_id = '' THEN
        v_viewer_id := 'anonymous_device';
    END IF;

    -- Lock and retrieve video record
    SELECT * INTO v_video FROM contents WHERE id = p_video_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Video content not found: %', p_video_id;
    END IF;

    -- Increment raw views count
    v_current_views := COALESCE(v_video.views, 0) + 1;
    v_current_eligible := COALESCE(v_video.eligible_views, 0);

    UPDATE contents 
    SET views = v_current_views, updated_at = NOW() 
    WHERE id = p_video_id;

    -- Retrieve system monetization settings
    SELECT * INTO v_settings FROM system_settings WHERE key = 'DEFAULT' LIMIT 1;
    IF FOUND THEN
        v_max_views := COALESCE(v_settings.max_counted_views_per_video, 3);
        v_rate_per_1000 := COALESCE(v_settings.earning_rate_per_1000_views, 1.0000);
    END IF;

    -- Check existing view record for this viewer
    SELECT * INTO v_view_record 
    FROM video_views 
    WHERE video_id = p_video_id 
      AND (
          (p_user_id IS NOT NULL AND user_id = p_user_id)
          OR (p_user_id IS NULL AND device_id = p_device_id)
      )
    FOR UPDATE;

    IF NOT FOUND THEN
        IF v_counted_views < v_max_views THEN
            v_counted_views := 1;
            -- Anti-fraud: Only authenticated users can qualify views for creator monetization.
            -- Anonymous device rotations are tracked for engagement metrics but do not credit financial balance.
            IF p_user_id IS NOT NULL THEN
                v_is_eligible := TRUE;
            END IF;
        END IF;

        INSERT INTO video_views (user_id, device_id, video_id, counted_view_count, last_viewed_at)
        VALUES (p_user_id, p_device_id, p_video_id, v_counted_views, NOW());
    ELSE
        v_counted_views := COALESCE(v_view_record.counted_view_count, 0);
        IF v_counted_views < v_max_views THEN
            v_counted_views := v_counted_views + 1;
            IF p_user_id IS NOT NULL THEN
                v_is_eligible := TRUE;
            END IF;

            UPDATE video_views 
            SET counted_view_count = v_counted_views, 
                last_viewed_at = NOW(),
                updated_at = NOW()
            WHERE id = v_view_record.id;
        ELSE
            UPDATE video_views 
            SET last_viewed_at = NOW(),
                updated_at = NOW()
            WHERE id = v_view_record.id;
        END IF;
    END IF;

    -- If view is eligible under ceiling, credit creator
    IF v_is_eligible THEN
        v_current_eligible := v_current_eligible + 1;
        UPDATE contents 
        SET eligible_views = v_current_eligible 
        WHERE id = p_video_id;

        v_view_earning := (v_rate_per_1000 / 1000.0);

        -- Lock and credit creator record
        SELECT * INTO v_creator FROM creators WHERE id = v_video.creator_id FOR UPDATE;
        IF FOUND THEN
            UPDATE creators 
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. REQUEST PAYOUT (Atomic balance deduction, threshold check, and ownership enforcement)
CREATE OR REPLACE FUNCTION public.request_payout(
    p_creator_id UUID,
    p_amount NUMERIC,
    p_payout_method_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_creator RECORD;
    v_method RECORD;
    v_settings RECORD;
    v_min_amount NUMERIC := 10.00;
    v_payout_request RECORD;
BEGIN
    -- Verify caller ownership: caller must own p_creator_id or be an ADMIN
    IF p_creator_id <> public.get_current_creator_id() AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: cannot request payouts for another creator';
    END IF;

    SELECT * INTO v_settings FROM system_settings WHERE key = 'DEFAULT' LIMIT 1;
    IF FOUND THEN
        v_min_amount := COALESCE(v_settings.min_payout_amount, 10.00);
    END IF;

    IF p_amount < v_min_amount THEN
        RAISE EXCEPTION 'Requested payout amount $% is below minimum threshold of $%', p_amount, v_min_amount;
    END IF;

    SELECT * INTO v_creator FROM creators WHERE id = p_creator_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Creator profile not found: %', p_creator_id;
    END IF;

    IF COALESCE(v_creator.available_balance, 0) < p_amount THEN
        RAISE EXCEPTION 'Insufficient available balance ($%). Cannot request $%', v_creator.available_balance, p_amount;
    END IF;

    SELECT * INTO v_method FROM payout_methods WHERE id = p_payout_method_id;
    IF NOT FOUND OR v_method.creator_id <> p_creator_id THEN
        RAISE EXCEPTION 'Invalid payout method: %', p_payout_method_id;
    END IF;

    -- Deduct balance
    UPDATE creators 
    SET available_balance = ROUND(available_balance - p_amount, 6),
        updated_at = NOW()
    WHERE id = p_creator_id;

    -- Create request
    INSERT INTO payout_requests (creator_id, amount, payout_method_id, status, requested_at)
    VALUES (p_creator_id, p_amount, p_payout_method_id, 'PENDING', NOW())
    RETURNING * INTO v_payout_request;

    RETURN to_jsonb(v_payout_request);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. ADMIN MODERATE CONTENT
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

    SELECT * INTO v_content FROM contents WHERE id = p_content_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Content not found: %', p_content_id;
    END IF;

    IF p_admin_id IS NOT NULL THEN
        SELECT email INTO v_admin_email FROM users WHERE id = p_admin_id;
    END IF;

    UPDATE contents
    SET moderation_status = p_moderation_status,
        publication_status = CASE WHEN v_is_approved THEN 'PUBLISHED' ELSE 'DRAFT' END,
        published_at = CASE WHEN v_is_approved THEN NOW() ELSE published_at END,
        rejection_reason = CASE WHEN NOT v_is_approved THEN p_rejection_reason ELSE NULL END,
        updated_at = NOW()
    WHERE id = p_content_id
    RETURNING * INTO v_content;

    -- Record Audit Log
    INSERT INTO audit_logs (actor_id, actor_email, actor_role, action, entity, entity_id, metadata)
    VALUES (
        COALESCE(p_admin_id, auth.uid()),
        v_admin_email,
        'ADMIN',
        'CONTENT_MODERATION_' || p_moderation_status,
        'Content',
        p_content_id::text,
        jsonb_build_object('status', p_moderation_status, 'rejectionReason', p_rejection_reason)
    );

    RETURN to_jsonb(v_content);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. ADMIN PROCESS PAYOUT
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

    SELECT * INTO v_request FROM payout_requests WHERE id = p_payout_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payout request not found: %', p_payout_id;
    END IF;

    IF v_request.status = 'PAID' THEN
        RAISE EXCEPTION 'Payout request is already PAID';
    END IF;

    IF p_status = 'PAID' AND (p_transaction_reference IS NULL OR trim(p_transaction_reference) = '') THEN
        RAISE EXCEPTION 'Transaction reference / UTR is required when marking as PAID';
    END IF;

    IF p_status = 'PAID' THEN
        UPDATE payout_requests
        SET status = 'PAID',
            transaction_reference = p_transaction_reference,
            admin_note = p_admin_note,
            processed_at = NOW(),
            updated_at = NOW()
        WHERE id = p_payout_id;

        -- Update creator total paid
        UPDATE creators 
        SET total_paid = ROUND(COALESCE(total_paid, 0) + v_request.amount, 6),
            updated_at = NOW()
        WHERE id = v_request.creator_id;

    ELSIF p_status = 'REJECTED' THEN
        UPDATE payout_requests
        SET status = 'REJECTED',
            admin_note = COALESCE(p_admin_note, 'Rejected by platform admin'),
            processed_at = NOW(),
            updated_at = NOW()
        WHERE id = p_payout_id;

        -- Refund held funds to creator
        UPDATE creators 
        SET available_balance = ROUND(COALESCE(available_balance, 0) + v_request.amount, 6),
            updated_at = NOW()
        WHERE id = v_request.creator_id;
    ELSE
        UPDATE payout_requests
        SET status = p_status,
            admin_note = p_admin_note,
            updated_at = NOW()
        WHERE id = p_payout_id;
    END IF;

    -- Audit Log
    INSERT INTO audit_logs (actor_id, actor_email, actor_role, action, entity, entity_id, metadata)
    VALUES (
        COALESCE(p_admin_id, auth.uid()),
        v_admin_email,
        'ADMIN',
        'PAYOUT_REQUEST_' || p_status,
        'PayoutRequest',
        p_payout_id::text,
        jsonb_build_object('amount', v_request.amount, 'status', p_status, 'transactionReference', p_transaction_reference)
    );

    SELECT * INTO v_request FROM payout_requests WHERE id = p_payout_id;
    RETURN to_jsonb(v_request);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. GET CREATOR DASHBOARD STATS
CREATE OR REPLACE FUNCTION public.get_creator_dashboard_stats(p_creator_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_creator RECORD;
    v_total_views BIGINT := 0;
    v_total_eligible_views BIGINT := 0;
    v_total_contents BIGINT := 0;
    v_approved_contents BIGINT := 0;
    v_pending_contents BIGINT := 0;
    v_rejected_contents BIGINT := 0;
    v_settings RECORD;
    v_earning_rate NUMERIC(10, 4) := 1.5000;
BEGIN
    SELECT * INTO v_creator FROM public.creators 
    WHERE id = p_creator_id OR user_id = p_creator_id 
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Creator not found');
    END IF;

    SELECT earning_rate_per_1000_views INTO v_settings FROM public.system_settings LIMIT 1;
    IF FOUND AND v_settings.earning_rate_per_1000_views IS NOT NULL THEN
        v_earning_rate := v_settings.earning_rate_per_1000_views;
    END IF;

    SELECT 
        COALESCE(SUM(views), 0),
        COALESCE(SUM(eligible_views), 0),
        COUNT(*),
        COUNT(*) FILTER (WHERE moderation_status = 'APPROVED'),
        COUNT(*) FILTER (WHERE moderation_status = 'PENDING_REVIEW'),
        COUNT(*) FILTER (WHERE moderation_status = 'REJECTED')
    INTO 
        v_total_views,
        v_total_eligible_views,
        v_total_contents,
        v_approved_contents,
        v_pending_contents,
        v_rejected_contents
    FROM public.contents
    WHERE creator_id = v_creator.id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'creator_id', v_creator.id,
        'user_id', v_creator.user_id,
        'available_balance', v_creator.available_balance,
        'lifetime_earnings', v_creator.lifetime_earnings,
        'total_paid', v_creator.total_paid,
        'total_views', v_total_views,
        'total_eligible_views', v_total_eligible_views,
        'total_reports', v_total_contents,
        'approved_reports', v_approved_contents,
        'pending_reports', v_pending_contents,
        'rejected_reports', v_rejected_contents,
        'earning_rate_per_1000_views', v_earning_rate,
        'cpm_inr', round(v_earning_rate * 86.5, 2)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 6. GET FEED (Location-prioritized or 5km radar with interleaved ads matching mobile contract)
CREATE OR REPLACE FUNCTION public.get_feed(
    p_city TEXT DEFAULT NULL,
    p_area TEXT DEFAULT NULL,
    p_state TEXT DEFAULT NULL,
    p_country TEXT DEFAULT NULL,
    p_content_type TEXT DEFAULT NULL,
    p_lat DOUBLE PRECISION DEFAULT NULL,
    p_lng DOUBLE PRECISION DEFAULT NULL,
    p_radius_km DOUBLE PRECISION DEFAULT 5.0,
    p_page INT DEFAULT 1,
    p_limit INT DEFAULT 20
)
RETURNS JSONB AS $$
DECLARE
    v_offset INT := (GREATEST(p_page, 1) - 1) * p_limit;
    v_total_items INT := 0;
    v_total_pages INT := 1;
    v_items JSONB := '[]'::jsonb;
    v_ads JSONB := '[]'::jsonb;
    v_result_items JSONB := '[]'::jsonb;
    v_ad_frequency INT := 4;
    v_settings RECORD;
    v_item RECORD;
    v_ad_idx INT := 0;
    v_ads_count INT := 0;
    v_item_counter INT := 0;
    v_point geography;
BEGIN
    SELECT * INTO v_settings FROM system_settings WHERE key = 'DEFAULT' LIMIT 1;
    IF FOUND THEN
        v_ad_frequency := COALESCE(v_settings.ad_feed_frequency, 4);
    END IF;

    -- Fetch active ads for interleaving
    SELECT COALESCE(jsonb_agg(to_jsonb(a)), '[]'::jsonb), COUNT(*)
    INTO v_ads, v_ads_count
    FROM advertisements a
    WHERE a.status = 'ACTIVE' AND NOW() BETWEEN a.start_date AND a.end_date;

    IF p_lat IS NOT NULL AND p_lng IS NOT NULL THEN
        v_point := ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography;

        -- Count total items within radius
        SELECT COUNT(*) INTO v_total_items
        FROM contents c
        WHERE c.moderation_status = 'APPROVED'
          AND c.publication_status = 'PUBLISHED'
          AND (p_content_type IS NULL OR c.type = p_content_type)
          AND (c.coordinates_geo IS NOT NULL AND ST_DWithin(c.coordinates_geo, v_point, p_radius_km * 1000));

        -- If radar yields results, sort by distance, else fall back to normal
        IF v_total_items > 0 THEN
            FOR v_item IN
                SELECT c.*, 
                       ST_Distance(c.coordinates_geo, v_point) AS distance_meters,
                       jsonb_build_object('id', cr.id, 'name', u.name, 'profileImage', u.profile_image, 'verificationStatus', cr.verification_status) AS creator
                FROM contents c
                JOIN creators cr ON c.creator_id = cr.id
                JOIN users u ON cr.user_id = u.id
                WHERE c.moderation_status = 'APPROVED'
                  AND c.publication_status = 'PUBLISHED'
                  AND (p_content_type IS NULL OR c.type = p_content_type)
                  AND (c.coordinates_geo IS NOT NULL AND ST_DWithin(c.coordinates_geo, v_point, p_radius_km * 1000))
                ORDER BY c.published_at DESC
                LIMIT p_limit OFFSET v_offset
            LOOP
                v_item_counter := v_item_counter + 1;
                v_result_items := v_result_items || jsonb_build_array(jsonb_build_object('itemType', 'CONTENT', 'data', to_jsonb(v_item)));

                IF v_item_counter % v_ad_frequency = 0 AND v_ads_count > 0 THEN
                    v_result_items := v_result_items || jsonb_build_array(jsonb_build_object('itemType', 'ADVERTISEMENT', 'data', v_ads->(v_ad_idx % v_ads_count)));
                    v_ad_idx := v_ad_idx + 1;
                END IF;
            END LOOP;

            v_total_pages := CEIL(v_total_items::NUMERIC / p_limit::NUMERIC);
            RETURN jsonb_build_object(
                'success', TRUE,
                'items', v_result_items,
                'pagination', jsonb_build_object(
                    'page', p_page,
                    'limit', p_limit,
                    'totalItems', v_total_items,
                    'totalPages', v_total_pages
                )
            );
        END IF;
    END IF;

    -- Standard text/location filtered or global fallback query
    SELECT COUNT(*) INTO v_total_items
    FROM contents c
    WHERE c.moderation_status = 'APPROVED'
      AND c.publication_status = 'PUBLISHED'
      AND (p_content_type IS NULL OR c.type = p_content_type)
      AND (p_city IS NULL OR p_city = '' OR c.location->>'city' ILIKE '%' || p_city || '%')
      AND (p_area IS NULL OR p_area = '' OR c.location->>'area' ILIKE '%' || p_area || '%');

    FOR v_item IN
        SELECT c.*,
               jsonb_build_object('id', cr.id, 'name', u.name, 'profileImage', u.profile_image, 'verificationStatus', cr.verification_status) AS creator
        FROM contents c
        JOIN creators cr ON c.creator_id = cr.id
        JOIN users u ON cr.user_id = u.id
        WHERE c.moderation_status = 'APPROVED'
          AND c.publication_status = 'PUBLISHED'
          AND (p_content_type IS NULL OR c.type = p_content_type)
          AND (p_city IS NULL OR p_city = '' OR c.location->>'city' ILIKE '%' || p_city || '%')
          AND (p_area IS NULL OR p_area = '' OR c.location->>'area' ILIKE '%' || p_area || '%')
        ORDER BY c.published_at DESC
        LIMIT p_limit OFFSET v_offset
    LOOP
        v_item_counter := v_item_counter + 1;
        v_result_items := v_result_items || jsonb_build_array(jsonb_build_object('itemType', 'CONTENT', 'data', to_jsonb(v_item)));

        IF v_item_counter % v_ad_frequency = 0 AND v_ads_count > 0 THEN
            v_result_items := v_result_items || jsonb_build_array(jsonb_build_object('itemType', 'ADVERTISEMENT', 'data', v_ads->(v_ad_idx % v_ads_count)));
            v_ad_idx := v_ad_idx + 1;
        END IF;
    END LOOP;

    v_total_pages := GREATEST(1, CEIL(v_total_items::NUMERIC / p_limit::NUMERIC));
    RETURN jsonb_build_object(
        'success', TRUE,
        'items', v_result_items,
        'pagination', jsonb_build_object(
            'page', p_page,
            'limit', p_limit,
            'totalItems', v_total_items,
            'totalPages', v_total_pages
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. INCREMENT LIKES / SHARES ATOMICALLY
CREATE OR REPLACE FUNCTION public.increment_like(p_content_id UUID)
RETURNS INT AS $$
DECLARE
    v_likes INT;
BEGIN
    UPDATE contents 
    SET likes = likes + 1, updated_at = NOW() 
    WHERE id = p_content_id
    RETURNING likes INTO v_likes;
    RETURN v_likes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_share(p_content_id UUID)
RETURNS INT AS $$
DECLARE
    v_shares INT;
BEGIN
    UPDATE contents 
    SET shares = shares + 1, updated_at = NOW() 
    WHERE id = p_content_id
    RETURNING shares INTO v_shares;
    RETURN v_shares;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
