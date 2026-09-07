import pg from 'pg';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const { Client } = pg;

async function testSpatialRefSysFixes() {
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

  console.log('Testing approaches to resolve spatial_ref_sys...');

  // 1. Try revoking API access
  try {
    await client.query(`REVOKE ALL ON TABLE public.spatial_ref_sys FROM anon, authenticated;`);
    console.log('✅ Revoked anon and authenticated from public.spatial_ref_sys');
  } catch (e: any) {
    console.log('Revoke note:', e.message);
  }

  // 2. Check owner
  const ownerRes = await client.query(`
    SELECT t.table_name, t.table_schema, r.rolname as owner
    FROM information_schema.tables t
    JOIN pg_class c ON c.relname = t.table_name
    JOIN pg_roles r ON r.oid = c.relowner
    WHERE t.table_name = 'spatial_ref_sys';
  `);
  console.log('spatial_ref_sys owner info:', ownerRes.rows);

  await client.end();
}

testSpatialRefSysFixes();
