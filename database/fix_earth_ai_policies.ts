import pg from 'pg';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const { Client } = pg;

async function fixDuplicatePolicies() {
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
  console.log('Inspecting policies on ai.earth_ai_analyses...');

  const polRes = await client.query(`
    SELECT schemaname, tablename, policyname, permissive, cmd, qual, with_check
    FROM pg_policies
    WHERE tablename = 'earth_ai_analyses';
  `);

  console.log('Current policies on earth_ai_analyses:', polRes.rows.map(r => r.policyname));

  // Drop all old policies
  for (const r of polRes.rows) {
    try {
      await client.query(`DROP POLICY IF EXISTS "${r.policyname}" ON "${r.schemaname}"."${r.tablename}";`);
      console.log(`Dropped policy: ${r.policyname}`);
    } catch (e: any) {
      console.log(`Could not drop ${r.policyname}:`, e.message);
    }
  }

  // Create clean single unified policies
  await client.query(`ALTER TABLE "ai"."earth_ai_analyses" ENABLE ROW LEVEL SECURITY;`);
  await client.query(`CREATE POLICY "earth_ai_select" ON "ai"."earth_ai_analyses" FOR SELECT USING (true);`);
  await client.query(`CREATE POLICY "earth_ai_insert" ON "ai"."earth_ai_analyses" FOR INSERT WITH CHECK (true);`);
  await client.query(`CREATE POLICY "earth_ai_update" ON "ai"."earth_ai_analyses" FOR UPDATE USING (true);`);
  await client.query(`CREATE POLICY "earth_ai_delete" ON "ai"."earth_ai_analyses" FOR DELETE USING (true);`);

  console.log('✅ Replaced with single unified policies on ai.earth_ai_analyses!');

  await client.end();
}

fixDuplicatePolicies();
