/**
 * HAEWS v3.0 — Database Migration Runner
 * Executes all SQL migration files against Supabase PostgreSQL
 * 
 * Usage: npx tsx database/run_migrations.ts
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const { Client } = pg;

async function runMigrations() {
  const host = process.env.SUPABASE_DB_HOST || 'aws-0-ap-northeast-2.pooler.supabase.com';
  const port = parseInt(process.env.SUPABASE_DB_PORT || '6543');
  const database = process.env.SUPABASE_DB_NAME || 'postgres';
  const user = process.env.SUPABASE_DB_USER || 'postgres.orzefhjdpqijmrheobld';
  const password = process.env.SUPABASE_DB_PASSWORD || 'Phutho2024@!';

  console.log('═══════════════════════════════════════════════════════════');
  console.log('  🏛️  HAEWS v3.0 — Database Migration Runner');
  console.log('  Trung Tâm Thông Minh Giám Sát & Cảnh Báo Sớm Thiên Tai');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`  Host:     ${host}:${port}`);
  console.log(`  Database: ${database}`);
  console.log(`  User:     ${user}\n`);

  const client = new Client({
    host,
    port,
    database,
    user,
    password,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 30000,
  });

  try {
    console.log('🔌 Connecting to Supabase PostgreSQL...');
    await client.connect();
    
    const versionResult = await client.query('SELECT version()');
    console.log(`✅ Connected! ${versionResult.rows[0].version.split(',')[0]}\n`);

    // Get migration files
    const migrationsDir = path.resolve(process.cwd(), 'database', 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`📁 Found ${files.length} migration files\n`);
    console.log('───────────────────────────────────────────────────────────');

    const results: { file: string; status: 'OK' | 'ERROR'; time: number; error?: string }[] = [];

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      const startTime = Date.now();

      process.stdout.write(`  🔄 ${file}...`);

      try {
        await client.query(sql);
        const elapsed = Date.now() - startTime;
        console.log(` ✅ (${elapsed}ms)`);
        results.push({ file, status: 'OK', time: elapsed });
      } catch (err: any) {
        const elapsed = Date.now() - startTime;
        console.log(` ❌ (${elapsed}ms)`);
        console.log(`     Error: ${err.message.split('\n')[0]}`);
        results.push({ file, status: 'ERROR', time: elapsed, error: err.message.split('\n')[0] });
      }
    }

    console.log('───────────────────────────────────────────────────────────\n');

    // Summary
    const successful = results.filter(r => r.status === 'OK');
    const failed = results.filter(r => r.status === 'ERROR');
    const totalTime = results.reduce((sum, r) => sum + r.time, 0);

    console.log('📊 Migration Summary:');
    console.log(`   ✅ Successful: ${successful.length}/${files.length}`);
    console.log(`   ❌ Failed:     ${failed.length}/${files.length}`);
    console.log(`   ⏱️  Total time: ${totalTime}ms\n`);

    if (failed.length > 0) {
      console.log('❌ Failed migrations:');
      failed.forEach(f => console.log(`   - ${f.file}: ${f.error}`));
      console.log('');
    }

    // Verify database objects
    console.log('🔍 Verifying database objects...\n');

    const schemaQuery = `
      SELECT schema_name, 
             (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = s.schema_name) as table_count
      FROM information_schema.schemata s
      WHERE schema_name IN ('core', 'telemetry', 'ai', 'incident', 'alert', 'resource', 'typhoon', 'auth_ext', 'simulation')
      ORDER BY schema_name;
    `;

    const schemas = await client.query(schemaQuery);
    console.log('   Schema                Tables');
    console.log('   ─────────────────────────────');
    let totalTables = 0;
    schemas.rows.forEach((row: any) => {
      console.log(`   ${row.schema_name.padEnd(20)} ${row.table_count}`);
      totalTables += parseInt(row.table_count);
    });
    console.log(`   ─────────────────────────────`);
    console.log(`   Total                 ${totalTables}\n`);

    // Check extensions
    try {
      const extQuery = `SELECT extname, extversion FROM pg_extension WHERE extname IN ('postgis', 'postgis_topology', 'uuid-ossp', 'pgcrypto', 'pg_trgm') ORDER BY extname;`;
      const extensions = await client.query(extQuery);
      console.log('   Extension             Version');
      console.log('   ─────────────────────────────');
      extensions.rows.forEach((row: any) => {
        console.log(`   ${row.extname.padEnd(20)} ${row.extversion}`);
      });
    } catch (e: any) {
      console.log('   Extensions query:', e.message);
    }

    // Check enum types
    try {
      const enumQuery = `SELECT typname FROM pg_type WHERE typtype = 'e' AND typname LIKE '%_enum' ORDER BY typname;`;
      const enums = await client.query(enumQuery);
      console.log(`\n   🏷️  Custom ENUM types: ${enums.rows.length}`);
    } catch (e: any) {}

    // Check spatial indexes
    try {
      const indexQuery = `SELECT COUNT(*) as cnt FROM pg_indexes WHERE indexdef LIKE '%USING gist%';`;
      const indexes = await client.query(indexQuery);
      console.log(`   📍 Spatial (GIST) indexes: ${indexes.rows[0].cnt}`);
    } catch (e: any) {}

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  🎉 Database migration completed!');
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (err: any) {
    console.error('\n❌ Fatal error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations().catch(console.error);
