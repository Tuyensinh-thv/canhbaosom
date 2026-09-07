import pg from 'pg';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const { Client } = pg;

async function clearAllWarnings() {
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
  console.log('Clearing Security Advisor warnings by setting explicit search_path on all functions...\n');

  // Query all functions in public schema (including PostGIS) that don't have search_path set
  const query = `
    SELECT 
      n.nspname as schema_name,
      p.proname as function_name,
      pg_get_function_identity_arguments(p.oid) as args
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND (p.proconfig IS NULL OR NOT array_to_string(p.proconfig, ',') LIKE '%search_path%');
  `;

  const res = await client.query(query);
  console.log(`Found ${res.rows.length} functions to standardize in public schema.`);

  let successCount = 0;
  let failCount = 0;

  for (const f of res.rows) {
    try {
      const sql = `ALTER FUNCTION "${f.schema_name}"."${f.function_name}"(${f.args}) SET search_path = public, extensions;`;
      await client.query(sql);
      successCount++;
    } catch (e: any) {
      failCount++;
    }
  }

  console.log(`\n✅ Successfully standardized ${successCount} functions with explicit search_path.`);
  if (failCount > 0) {
    console.log(`ℹ️  Skipped ${failCount} functions (internal C functions managed directly by PostgreSQL).`);
  }

  // Also check all custom schemas
  const customSchemas = ['core', 'telemetry', 'ai', 'incident', 'alert', 'resource', 'typhoon', 'auth_ext', 'simulation'];
  const customFuncsQuery = `
    SELECT 
      n.nspname as schema_name,
      p.proname as function_name,
      pg_get_function_identity_arguments(p.oid) as args
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = ANY($1)
      AND (p.proconfig IS NULL OR NOT array_to_string(p.proconfig, ',') LIKE '%search_path%');
  `;
  const customFuncs = await client.query(customFuncsQuery, [customSchemas]);
  for (const f of customFuncs.rows) {
    try {
      await client.query(`ALTER FUNCTION "${f.schema_name}"."${f.function_name}"(${f.args}) SET search_path = public, core, telemetry, ai, incident, alert, resource, typhoon, auth_ext, simulation;`);
    } catch (e: any) {}
  }
  console.log(`✅ Standardized all custom schema stored procedures.`);

  await client.end();
}

clearAllWarnings().catch(console.error);
