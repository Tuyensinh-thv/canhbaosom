import pg from 'pg';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const { Client } = pg;

async function checkAndFixSecurityAdvisor() {
  const host = process.env.SUPABASE_DB_HOST || 'aws-0-ap-northeast-2.pooler.supabase.com';
  const port = parseInt(process.env.SUPABASE_DB_PORT || '6543');
  const database = process.env.SUPABASE_DB_NAME || 'postgres';
  const user = process.env.SUPABASE_DB_USER || 'postgres.orzefhjdpqijmrheobld';
  const password = process.env.SUPABASE_DB_PASSWORD || 'Phutho2024@!';

  const client = new Client({
    host, port, database, user, password,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 30000,
  });

  await client.connect();
  console.log('Inspecting Supabase linter / security advisor issues...\n');

  // Supabase linter uses queries on functions, tables, and extensions.
  // 1. Function search_path check: All functions in public, core, telemetry, ai, incident, alert, resource, typhoon, auth_ext, simulation
  const mutableFunctions = await client.query(`
    SELECT n.nspname as schema_name, p.proname as function_name, pg_get_function_identity_arguments(p.oid) as args, p.prosecdef
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname IN ('public', 'core', 'telemetry', 'ai', 'incident', 'alert', 'resource', 'typhoon', 'auth_ext', 'simulation')
      AND NOT (p.proconfig IS NOT NULL AND array_to_string(p.proconfig, ',') LIKE '%search_path%');
  `);
  console.log(`Found ${mutableFunctions.rows.length} functions without explicit search_path.`);

  // Fix custom schema functions first (only our custom ones, skip PostGIS builtins if they error)
  let fixedFuncs = 0;
  for (const f of mutableFunctions.rows) {
    if (f.schema_name !== 'public') {
      try {
        await client.query(`ALTER FUNCTION "${f.schema_name}"."${f.function_name}"(${f.args}) SET search_path = public, core, telemetry, ai, incident, alert, resource, typhoon, auth_ext, simulation;`);
        fixedFuncs++;
      } catch (e: any) {
        // skip if internal
      }
    }
  }
  console.log(`✅ Set search_path on ${fixedFuncs} custom functions.`);

  // 2. PostgREST exposed schemas
  // In Supabase, if a custom schema is NOT exposed to PostgREST in api settings (only 'public' is exposed by default),
  // Supabase Security Advisor checks schemas that are in db_pre_request or PostgREST schema list.
  
  // 3. Let's check RLS on all tables in public & custom schemas
  const rlsCheck = await client.query(`
    SELECT schemaname, tablename, rowsecurity
    FROM pg_tables
    WHERE schemaname IN ('public', 'core', 'telemetry', 'ai', 'incident', 'alert', 'resource', 'typhoon', 'auth_ext', 'simulation')
    ORDER BY schemaname, tablename;
  `);

  console.log(`\nRLS Status for all ${rlsCheck.rows.length} tables:`);
  let disabledRls = rlsCheck.rows.filter((r: any) => !r.rowsecurity);
  console.log(`Tables with RLS DISABLED: ${disabledRls.length}`);
  for (const t of disabledRls) {
    console.log(`   - ${t.schemaname}.${t.tablename}`);
  }

  // 4. Try enabling RLS on spatial_ref_sys with superuser / postgres grant
  try {
    await client.query(`ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;`);
    console.log('✅ spatial_ref_sys RLS enabled!');
  } catch (e: any) {
    console.log('spatial_ref_sys RLS error:', e.message);
  }

  // 5. Check if extensions in public is causing warnings
  const extCheck = await client.query(`
    SELECT extname, nspname as schema_name
    FROM pg_extension e
    JOIN pg_namespace n ON e.extnamespace = n.oid
    WHERE n.nspname = 'public';
  `);
  console.log(`\nExtensions in public schema (${extCheck.rows.length}):`);
  for (const e of extCheck.rows) {
    console.log(`   - ${e.extname}`);
  }

  await client.end();
}

checkAndFixSecurityAdvisor().catch(console.error);
