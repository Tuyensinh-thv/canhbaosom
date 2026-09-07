/**
 * HAEWS v3.0 — PostGIS Spatial Query Verification
 * Tests spatial KNN queries, ST_DistanceSphere, ST_Contains, and GeoJSON generation
 * 
 * Usage: npx tsx database/test_spatial_query.ts
 */

import pg from 'pg';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const { Client } = pg;

async function testSpatial() {
  const host = process.env.SUPABASE_DB_HOST || 'aws-0-ap-northeast-2.pooler.supabase.com';
  const port = parseInt(process.env.SUPABASE_DB_PORT || '6543');
  const database = process.env.SUPABASE_DB_NAME || 'postgres';
  const user = process.env.SUPABASE_DB_USER || 'postgres.orzefhjdpqijmrheobld';
  const password = process.env.SUPABASE_DB_PASSWORD || 'Phutho2024@!';

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
    await client.connect();
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  📍 HAEWS v3.0 — PostGIS Spatial Verification Test');
    console.log('═══════════════════════════════════════════════════════════\n');

    // 1. PostGIS Version
    const vRes = await client.query('SELECT PostGIS_Full_Version()');
    console.log('1️⃣ PostGIS Details:');
    console.log(`   ${vRes.rows[0].postgis_full_version.split(' ')[0]} ${vRes.rows[0].postgis_full_version.split(' ')[1]}\n`);

    // 2. Spatial KNN Query: 3 Nearest Rainfall Stations to Làng Nủ (22.25, 104.38)
    console.log('2️⃣ Spatial KNN Query: 3 trạm đo mưa gần Làng Nủ nhất:');
    const knnRes = await client.query(`
      SELECT 
        station_code, station_name,
        ROUND((ST_DistanceSphere(location_point, ST_SetSRID(ST_MakePoint(104.38, 22.25), 4326)) / 1000.0)::numeric, 2) as distance_km,
        current_rainfall_1h, current_rainfall_24h, status
      FROM telemetry.rainfall_stations
      WHERE location_point IS NOT NULL
      ORDER BY location_point <-> ST_SetSRID(ST_MakePoint(104.38, 22.25), 4326)
      LIMIT 3;
    `);
    console.table(knnRes.rows);

    // 3. Stored Procedure: Find Nearest Stations function
    console.log('\n3️⃣ Stored Procedure: telemetry.find_nearest_stations(22.25, 104.38, 3, 100):');
    const procRes = await client.query(`
      SELECT * FROM telemetry.find_nearest_stations(22.25, 104.38, 3, 100);
    `);
    console.table(procRes.rows);

    // 4. Stored Procedure: GeoJSON generation for Phú Thọ zones
    console.log('\n4️⃣ Stored Procedure: core.zones_to_geojson():');
    const geoRes = await client.query(`
      SELECT core.zones_to_geojson('Phú Thọ') as geojson;
    `);
    const geojson = geoRes.rows[0].geojson;
    console.log(`   Type: ${geojson.type}`);
    console.log(`   Total Features: ${geojson.features.length}`);
    if (geojson.features.length > 0) {
      console.log(`   Sample Zone: ${geojson.features[0].properties.zone_name} (${geojson.features[0].properties.district_name})`);
    }

    // 5. System Observability function
    console.log('\n5️⃣ Stored Procedure: core.get_system_observability():');
    const obsRes = await client.query(`
      SELECT core.get_system_observability() as obs;
    `);
    console.log('   Observability State:', obsRes.rows[0].obs);

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  🎉 All PostGIS Spatial Tests PASSED Successfully!');
    console.log('═══════════════════════════════════════════════════════════\n');

  } finally {
    await client.end();
  }
}

testSpatial().catch(console.error);
