-- 016: Add demo_payouts and show_demo_payouts to system_settings
ALTER TABLE public.system_settings 
ADD COLUMN IF NOT EXISTS demo_payouts JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS show_demo_payouts BOOLEAN DEFAULT true;

-- RPC to manage demo payouts (used by Admin Panel)
CREATE OR REPLACE FUNCTION public.admin_manage_demo_payouts(
    p_demo_payouts JSONB,
    p_show_demo_payouts BOOLEAN DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_updated RECORD;
BEGIN
    UPDATE public.system_settings
    SET 
        demo_payouts = COALESCE(p_demo_payouts, demo_payouts),
        show_demo_payouts = COALESCE(p_show_demo_payouts, show_demo_payouts),
        updated_at = NOW()
    WHERE key = 'DEFAULT'
    RETURNING demo_payouts, show_demo_payouts INTO v_updated;

    RETURN jsonb_build_object(
        'success', true,
        'demo_payouts', v_updated.demo_payouts,
        'show_demo_payouts', v_updated.show_demo_payouts
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.admin_manage_demo_payouts(JSONB, BOOLEAN) TO anon, authenticated, service_role;

