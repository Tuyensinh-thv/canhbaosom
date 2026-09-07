import pg from 'pg';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const { Client } = pg;

const projectRef = 'orzefhjdpqijmrheobld';
const password = process.env.SUPABASE_DB_PASSWORD || 'Phutho2024@!';

const regions = [
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-south-1',
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'sa-east-1',
  'ca-central-1',
];

async function findWorkingConnection() {
  console.log('Testing IPv6 direct host...');
  try {
    const client = new Client({
      host: '2406:da12:1f1:f800:82ba:d127:d85b:10b4',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: password,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    });
    await client.connect();
    console.log('✅ Connected via IPv6 direct address!');
    const res = await client.query('SELECT version()');
    console.log('Version:', res.rows[0].version);
    await client.end();
    return { host: '2406:da12:1f1:f800:82ba:d127:d85b:10b4', user: 'postgres', port: 5432 };
  } catch (err: any) {
    console.log('IPv6 direct failed:', err.message);
  }

  for (const reg of regions) {
    const host = `aws-0-${reg}.pooler.supabase.com`;
    process.stdout.write(`Testing region ${reg}... `);
    try {
      const client = new Client({
        host,
        port: 6543,
        database: 'postgres',
        user: `postgres.${projectRef}`,
        password: password,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 4000,
      });
      await client.connect();
      console.log(`\n🎉 FOUND WORKING POOLER REGION: ${reg} (port 6543)`);
      const res = await client.query('SELECT version()');
      console.log('Version:', res.rows[0].version);
      await client.end();
      return { host, user: `postgres.${projectRef}`, port: 6543, region: reg };
    } catch (e: any) {
      if (e.message.includes('password authentication failed') || e.message.includes('Tenant or user not found') || e.message.includes('ENOTFOUND') || e.message.includes('timeout')) {
        console.log(`❌ (${e.message.split('\n')[0].substring(0, 45)})`);
      } else {
        console.log(`❌ ${e.message.substring(0, 50)}`);
      }
    }
  }

  // Also test aws-0-*.pooler.supabase.com on port 5432
  for (const reg of ['ap-southeast-1', 'ap-northeast-1', 'us-east-1', 'ap-south-1', 'eu-central-1']) {
    const host = `aws-0-${reg}.pooler.supabase.com`;
    process.stdout.write(`Testing region ${reg} on port 5432... `);
    try {
      const client = new Client({
        host,
        port: 5432,
        database: 'postgres',
        user: `postgres.${projectRef}`,
        password: password,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 4000,
      });
      await client.connect();
      console.log(`\n🎉 FOUND WORKING POOLER REGION: ${reg} (port 5432)`);
      await client.end();
      return { host, user: `postgres.${projectRef}`, port: 5432, region: reg };
    } catch (e: any) {
      console.log(`❌ (${e.message.split('\n')[0].substring(0, 45)})`);
    }
  }

  return null;
}

findWorkingConnection().then(res => {
  console.log('\nResult:', res);
  process.exit(0);
});
