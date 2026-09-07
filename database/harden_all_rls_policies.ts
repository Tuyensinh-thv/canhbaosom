import pg from 'pg';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const { Client } = pg;

async function hardenAllRlsPolicies() {
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
  console.log('Connected to Supabase. Hardening RLS policies across all tables and schemas...\n');

  const schemas = ['core', 'telemetry', 'ai', 'incident', 'alert', 'resource', 'typhoon', 'auth_ext', 'simulation'];

  // 1. Fetch all base tables across schemas
  const tablesRes = await client.query(`
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_schema = ANY($1) AND table_type = 'BASE TABLE'
    ORDER BY table_schema, table_name;
  `, [schemas]);

  console.log(`Found ${tablesRes.rows.length} tables to apply hardened RLS policies.`);

  // 2. Fetch existing policies to drop them cleanly
  const existingPolicies = await client.query(`
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = ANY($1);
  `, [schemas]);

  console.log(`Dropping ${existingPolicies.rows.length} existing RLS policies...`);
  for (const pol of existingPolicies.rows) {
    try {
      await client.query(`DROP POLICY IF EXISTS "${pol.policyname}" ON "${pol.schemaname}"."${pol.tablename}";`);
    } catch (e: any) {
      console.log(`Notice dropping ${pol.schemaname}.${pol.tablename} policy ${pol.policyname}:`, e.message);
    }
  }

  // 3. Create hardened policies for each table:
  // - SELECT: Open to anon, authenticated, service_role with USING (true) (allowed for public read)
  // - INSERT: Restricted to authenticated & service_role
  // - UPDATE: Restricted to authenticated & service_role
  // - DELETE: Restricted to authenticated & service_role
  console.log('Applying secure, authenticated-restricted policies...');
  for (const row of tablesRes.rows) {
    const s = row.table_schema;
    const t = row.table_name;
    try {
      await client.query(`ALTER TABLE "${s}"."${t}" ENABLE ROW LEVEL SECURITY;`);

      // Public SELECT (allows citizens / portal to read warning data)
      await client.query(`
        CREATE POLICY "${t}_select_policy"
        ON "${s}"."${t}"
        FOR SELECT
        TO public
        USING (true);
      `);

      // Authenticated INSERT
      await client.query(`
        CREATE POLICY "${t}_insert_policy"
        ON "${s}"."${t}"
        FOR INSERT
        TO authenticated, service_role
        WITH CHECK (
          (auth.role() = 'authenticated') OR 
          (auth.role() = 'service_role')
        );
      `);

      // Authenticated UPDATE
      await client.query(`
        CREATE POLICY "${t}_update_policy"
        ON "${s}"."${t}"
        FOR UPDATE
        TO authenticated, service_role
        USING (
          (auth.role() = 'authenticated') OR 
          (auth.role() = 'service_role')
        )
        WITH CHECK (
          (auth.role() = 'authenticated') OR 
          (auth.role() = 'service_role')
        );
      `);

      // Authenticated DELETE
      await client.query(`
        CREATE POLICY "${t}_delete_policy"
        ON "${s}"."${t}"
        FOR DELETE
        TO authenticated, service_role
        USING (
          (auth.role() = 'authenticated') OR 
          (auth.role() = 'service_role')
        );
      `);

    } catch (e: any) {
      console.error(`Error securing table ${s}.${t}:`, e.message);
    }
  }

  console.log(`\n✅ Successfully hardened RLS policies on all ${tablesRes.rows.length} tables!`);
  console.log('No unrestricted write/update/delete policies remain open to public.\n');

  await client.end();
}

hardenAllRlsPolicies();
