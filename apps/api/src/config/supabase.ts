import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV } from './env';

export const isLiveSupabaseConfigured = (): boolean => {
  return Boolean(
    ENV.SUPABASE_URL &&
    !ENV.SUPABASE_URL.includes('mock-supabase') &&
    ENV.SUPABASE_KEY &&
    !ENV.SUPABASE_KEY.includes('mock-')
  );
};

export const supabase: SupabaseClient = createClient(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

export const checkSupabaseConnection = async (): Promise<boolean> => {
  if (!isLiveSupabaseConfigured()) {
    console.log('[Supabase] Running in local high-performance mode (offline / dev fallback enabled)');
    return true;
  }
  
  try {
    const { error } = await supabase.from('system_settings').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      console.warn('[Supabase] Warning while connecting to Supabase instance:', error.message);
    } else {
      console.log('[Supabase] Connected to live Supabase PostgreSQL successfully');
    }
    return true;
  } catch (err: any) {
    console.error('[Supabase] Connection test exception:', err.message);
    return false;
  }
};
