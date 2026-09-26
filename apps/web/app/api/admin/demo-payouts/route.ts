import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('demo_payouts, show_demo_payouts')
      .eq('key', 'DEFAULT')
      .maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      demoPayouts: data?.demo_payouts || [],
      showDemoPayouts: data?.show_demo_payouts ?? true,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, demoPayouts, showDemoPayouts } = body;

    // Call RPC admin_manage_demo_payouts
    const { data, error } = await supabase.rpc('admin_manage_demo_payouts', {
      p_demo_payouts: demoPayouts !== undefined ? demoPayouts : null,
      p_show_demo_payouts: showDemoPayouts !== undefined ? showDemoPayouts : null,
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
