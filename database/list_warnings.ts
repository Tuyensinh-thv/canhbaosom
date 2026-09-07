import pg from 'pg';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const { Client } = pg;

async function listWarningFunctions() {
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

  const res = await client.query(`
    SELECT 
      p.proname as function_name,
      pg_get_function_identity_arguments(p.oid) as arguments,
      e.extname as belonging_extension
    FROM pg_proc p
    JOIN pg_depend d ON d.objid = p.oid
    JOIN pg_extension e ON d.refobjid = e.oid
    WHERE p.pronamespace = 'public'::regnamespace
      AND e.extname IN ('postgis', 'postgis_topology', 'pg_trgm')
    ORDER BY p.proname
    LIMIT 20;
  `);

  console.log('Sample functions that trigger the 214 warnings:');
  console.table(res.rows);

  await client.end();
}

listWarningFunctions().catch(console.error);
