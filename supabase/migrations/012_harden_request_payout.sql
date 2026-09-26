-- ======================================================================
-- MIGRATION 012: HARDEN REQUEST_PAYOUT WITH CALLER IDENTITY & REVOKE PUBLIC
-- ======================================================================

CREATE OR REPLACE FUNCTION public.request_payout(
    p_creator_id UUID,
    p_amount NUMERIC,
    p_payout_method_id UUID
)
RETURNS JSONB 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
    v_creator RECORD;
    v_method RECORD;
    v_settings RECORD;
    v_min_payout NUMERIC := 10.0;
    v_payout_request RECORD;
    v_current_creator_id UUID;
BEGIN
    -- 1. Strictly require authenticated user session
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication required to request payouts';
    END IF;

    -- 2. Verify caller ownership: caller must own p_creator_id or be an ADMIN
    v_current_creator_id := public.get_current_creator_id();
    IF (v_current_creator_id IS NULL OR v_current_creator_id <> p_creator_id) AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: cannot request payouts for another creator';
    END IF;

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

    SELECT * INTO v_method FROM public.payout_methods WHERE id = p_payout_method_id;
    IF NOT FOUND OR v_method.creator_id <> p_creator_id THEN
        RAISE EXCEPTION 'Invalid payout method: %', p_payout_method_id;
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
$$;

-- Revoke from PUBLIC and anon, permit authenticated only
REVOKE EXECUTE ON FUNCTION public.request_payout(uuid, numeric, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.request_payout(uuid, numeric, uuid) TO authenticated;
