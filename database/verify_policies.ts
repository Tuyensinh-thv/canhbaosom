import pg from 'pg';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const { Client } = pg;

async function verify() {
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
    SELECT schemaname, tablename, cmd, policyname, roles
    FROM pg_policies
    WHERE tablename = 'earth_ai_analyses';
  `);
  console.log('Policies on earth_ai_analyses:');
  console.table(res.rows);

  const totalCount = await client.query(`
    SELECT count(*) as total_policies FROM pg_policies;
  `);
  console.log('Total hardened policies in database:', totalCount.rows[0].total_policies);

  await client.end();
}

verify();
