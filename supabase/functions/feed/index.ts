import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-device-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const city = url.searchParams.get("city") || undefined;
    const area = url.searchParams.get("area") || undefined;
    const district = url.searchParams.get("district") || undefined;
    const state = url.searchParams.get("state") || undefined;
    const contentType = url.searchParams.get("contentType") || undefined;
    const categoryId = url.searchParams.get("categoryId") || undefined;
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const cursor = url.searchParams.get("cursor") || undefined;
    const lat = url.searchParams.get("lat") ? parseFloat(url.searchParams.get("lat")!) : undefined;
    const lng = url.searchParams.get("lng") ? parseFloat(url.searchParams.get("lng")!) : undefined;
    const stateCode = url.searchParams.get("stateCode") ? parseInt(url.searchParams.get("stateCode")!, 10) : undefined;
    const districtCode = url.searchParams.get("districtCode") ? parseInt(url.searchParams.get("districtCode")!, 10) : undefined;
    const subdistrictCode = url.searchParams.get("subdistrictCode") ? parseInt(url.searchParams.get("subdistrictCode")!, 10) : undefined;
    const localBodyCode = url.searchParams.get("localBodyCode") ? parseInt(url.searchParams.get("localBodyCode")!, 10) : undefined;

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { data, error } = await supabase.rpc("get_personalized_feed", {
      p_lat: lat,
      p_lng: lng,
      p_state_code: stateCode,
      p_district_code: districtCode,
      p_subdistrict_code: subdistrictCode,
      p_local_body_code: localBodyCode,
      p_area: area,
      p_city: city,
      p_district: district,
      p_state: state,
      p_content_type: contentType,
      p_category_id: categoryId,
      p_page: page,
      p_limit: limit,
      p_cursor: cursor
    });

    if (error) {
      throw error;
    }

    // Cloudflare Edge & Browser Caching headers for regional feed responses
    const cacheHeaders = {
      'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=120'
    };

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, ...cacheHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Error fetching feed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
