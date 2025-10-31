// web/pages/api/supabaseAdmin.mjs
import { createClient } from '@supabase/supabase-js';

let adminClient;

/**
 * Returns a singleton Supabase admin client.
 * Requires env vars:
 *  - NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL
 *  - SUPABASE_SERVICE_ROLE_KEY (recommended) or SUPABASE_SERVICE_KEY
 */
export function getSupabaseAdmin() {
  if (!adminClient) {
    const url =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

    if (!url || !serviceRoleKey) {
      throw new Error(
        'Missing Supabase admin env vars (URL or SERVICE_ROLE_KEY).'
      );
    }

    adminClient = createClient(url, serviceRoleKey, {
      auth: { persistSession: false },
    });
  }
  return adminClient;
}
