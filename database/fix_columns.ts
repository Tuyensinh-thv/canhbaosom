import pg from 'pg';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const { Client } = pg;

async function fixColumnLengths() {
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
  console.log('Altering column lengths on telemetry.rainfall_stations...');

  await client.query(`
    ALTER TABLE telemetry.rainfall_stations ALTER COLUMN wind_direction TYPE VARCHAR(100);
    ALTER TABLE telemetry.rainfall_stations ALTER COLUMN source TYPE VARCHAR(100);
    ALTER TABLE telemetry.rainfall_stations ALTER COLUMN region_tag TYPE VARCHAR(100);
    ALTER TABLE telemetry.rainfall_stations ALTER COLUMN country TYPE VARCHAR(100);
    ALTER TABLE telemetry.rainfall_stations ALTER COLUMN provider_network TYPE VARCHAR(200);
    ALTER TABLE telemetry.rainfall_stations ALTER COLUMN wmo_index TYPE VARCHAR(100);
    ALTER TABLE telemetry.rainfall_stations ALTER COLUMN upstream_basin TYPE VARCHAR(200);
    ALTER TABLE telemetry.rainfall_stations ALTER COLUMN province TYPE VARCHAR(200);
  `);

  console.log('✅ Columns enlarged successfully.');
  await client.end();
}

fixColumnLengths().catch(console.error);
