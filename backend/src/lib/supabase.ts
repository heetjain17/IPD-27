import { createClient } from '@supabase/supabase-js';
import { getEnv } from '../utils/getEnv.js';

const SUPABASE_URL = getEnv('SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnv('SUPABASE_ANON_KEY');
const SUPABASE_SERVICE_ROLE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY');

// Public client (for client-side operations if needed)
export const supabasePublic = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Admin client (for server-side operations with elevated privileges)
// NEVER expose this to the client
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
