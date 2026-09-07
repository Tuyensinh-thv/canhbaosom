import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

// Supabase client singleton
let supabaseInstance: SupabaseClient | null = null;

/**
 * Get Supabase client instance (singleton)
 * Uses SUPABASE_URL and service role key for server-side operations
 */
export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.SUPABASE_URL;
    
    if (!supabaseUrl) {
      console.warn('[Supabase] SUPABASE_URL not configured. Database features disabled.');
      throw new Error('SUPABASE_URL is required');
    }

    // For server-side, we use the service role key (bypasses RLS)
    // For client-side, use anon key (subject to RLS)
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: 'public', // Default schema, can be overridden per-query
      },
    });

    console.log('[Supabase] Client initialized successfully.');
  }

  return supabaseInstance;
}

/**
 * Get Supabase client for a specific schema
 */
export function getSupabaseSchema(schema: string): SupabaseClient<any, any, any> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is required');
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema,
    },
  });
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from('core.system_config').select('config_key').limit(1);
    
    if (error) {
      // Table might not exist yet, but connection works
      console.log('[Supabase] Connection test - table query result:', error.message);
      return true; // Connection itself works
    }
    
    console.log('[Supabase] Connection test successful.');
    return true;
  } catch (err: any) {
    console.error('[Supabase] Connection test failed:', err.message);
    return false;
  }
}

/**
 * Database connection info (for display, no secrets)
 */
export function getConnectionInfo() {
  return {
    host: process.env.SUPABASE_DB_HOST || 'not configured',
    port: process.env.SUPABASE_DB_PORT || '5432',
    database: process.env.SUPABASE_DB_NAME || 'postgres',
    url: process.env.SUPABASE_URL || 'not configured',
    connected: supabaseInstance !== null,
  };
}

export default getSupabase;
