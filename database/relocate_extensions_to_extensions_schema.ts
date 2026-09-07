import pg from 'pg';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const { Client } = pg;

async function relocateExtensions() {
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

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL database.');

    // 1. Create schema extensions if not exists
    console.log('Creating "extensions" schema...');
    await client.query(`CREATE SCHEMA IF NOT EXISTS extensions;`);
    await client.query(`GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;`);

    // 2. Move extensions out of public
    console.log('Relocating extensions from "public" to "extensions" schema...');
    try {
      await client.query(`ALTER EXTENSION postgis SET SCHEMA extensions;`);
      console.log('✅ Successfully moved postgis to extensions schema!');
    } catch (err: any) {
      console.log('postgis relocation note:', err.message);
    }

    try {
      await client.query(`ALTER EXTENSION pg_trgm SET SCHEMA extensions;`);
      console.log('✅ Successfully moved pg_trgm to extensions schema!');
    } catch (err: any) {
      console.log('pg_trgm relocation note:', err.message);
    }

    // 3. Update search_path
    console.log('Updating database search_path...');
    await client.query(`
      ALTER DATABASE postgres SET search_path TO public, extensions, core, telemetry, ai, incident, alert, resource, typhoon, auth_ext, simulation;
    `);
    console.log('✅ Updated database search_path.');

    // 4. Verify extension locations
    const res = await client.query(`
      SELECT e.extname, n.nspname as schema_name
      FROM pg_extension e
      JOIN pg_namespace n ON e.extnamespace = n.oid
      ORDER BY e.extname;
    `);
    console.log('\nInstalled Extensions in Database:');
    for (const r of res.rows) {
      console.log(`  - ${r.extname} (schema: ${r.schema_name})`);
    }

  } catch (err: any) {
    console.error('Relocation error:', err);
  } finally {
    await client.end();
  }
}

relocateExtensions();
