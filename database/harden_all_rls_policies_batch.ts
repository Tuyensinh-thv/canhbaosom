import pg from 'pg';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const { Client } = pg;

async function hardenBatch() {
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
  console.log('Connected to Supabase PostgreSQL database.');

  const schemas = ['core', 'telemetry', 'ai', 'incident', 'alert', 'resource', 'typhoon', 'auth_ext', 'simulation'];

  // 1. Fetch tables and existing policies
  const tablesRes = await client.query(`
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_schema = ANY($1) AND table_type = 'BASE TABLE'
    ORDER BY table_schema, table_name;
  `, [schemas]);

  const policiesRes = await client.query(`
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = ANY($1);
  `, [schemas]);

  console.log(`Securing ${tablesRes.rows.length} tables and replacing ${policiesRes.rows.length} policies in single batch...`);

  let sqlStatements: string[] = [];

  // Drop all existing
  for (const p of policiesRes.rows) {
    sqlStatements.push(`DROP POLICY IF EXISTS "${p.policyname}" ON "${p.schemaname}"."${p.tablename}";`);
  }

  // Create secure policies
  for (const t of tablesRes.rows) {
    const s = t.table_schema;
    const name = t.table_name;
    sqlStatements.push(`ALTER TABLE "${s}"."${name}" ENABLE ROW LEVEL SECURITY;`);
    sqlStatements.push(`
      CREATE POLICY "${name}_select" ON "${s}"."${name}"
      FOR SELECT TO public USING (true);
    `);
    sqlStatements.push(`
      CREATE POLICY "${name}_insert" ON "${s}"."${name}"
      FOR INSERT TO authenticated, service_role
      WITH CHECK (auth.role() IN ('authenticated', 'service_role'));
    `);
    sqlStatements.push(`
      CREATE POLICY "${name}_update" ON "${s}"."${name}"
      FOR UPDATE TO authenticated, service_role
      USING (auth.role() IN ('authenticated', 'service_role'))
      WITH CHECK (auth.role() IN ('authenticated', 'service_role'));
    `);
    sqlStatements.push(`
      CREATE POLICY "${name}_delete" ON "${s}"."${name}"
      FOR DELETE TO authenticated, service_role
      USING (auth.role() IN ('authenticated', 'service_role'));
    `);
  }

  const batchSql = sqlStatements.join('\n');
  await client.query(batchSql);

  console.log('✅ Successfully applied hardened RLS policies in 1 batch!');
  console.log('All tables have public SELECT and authenticated-only INSERT/UPDATE/DELETE.\n');

  await client.end();
}

hardenBatch();
