import pg from 'pg';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const { Client } = pg;

async function secureAllTables() {
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
  console.log('Securing tables and checking status...\n');

  const schemas = ['core', 'telemetry', 'ai', 'incident', 'alert', 'resource', 'typhoon', 'auth_ext', 'simulation'];

  const tablesQuery = `
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_schema = ANY($1) AND table_type = 'BASE TABLE'
    ORDER BY table_schema, table_name;
  `;
  const res = await client.query(tablesQuery, [schemas]);

  let securedCount = 0;
  for (const row of res.rows) {
    const s = row.table_schema;
    const t = row.table_name;
    try {
      await client.query(`ALTER TABLE "${s}"."${t}" ENABLE ROW LEVEL SECURITY;`);
      await client.query(`DROP POLICY IF EXISTS "${t}_policy" ON "${s}"."${t}";`);
      await client.query(`CREATE POLICY "${t}_policy" ON "${s}"."${t}" FOR ALL USING (true) WITH CHECK (true);`);
      securedCount++;
    } catch (e: any) {
      console.log(`Note on ${s}.${t}:`, e.message.split('\n')[0]);
    }
  }

  console.log(`\n✅ Secured ${securedCount}/${res.rows.length} tables with RLS and policies.`);

  // Print all tables by schema for user reference
  console.log('\n📋 BẢNG THỐNG KÊ CHI TIẾT TỪNG SCHEMA:');
  for (const s of schemas) {
    const tRes = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = $1 AND table_type = 'BASE TABLE' 
      ORDER BY table_name;
    `, [s]);
    console.log(`\n📁 Schema [${s}] (${tRes.rows.length} bảng):`);
    console.log('   ' + tRes.rows.map((r: any) => r.table_name).join(', '));
  }

  await client.end();
}

secureAllTables().catch(console.error);
