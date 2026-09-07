/**
 * HAEWS v3.0 — Seed Core & Telemetry Data
 * Populates Supabase with existing provinces, zones, stations, and threshold profiles
 * 
 * Usage: npx tsx database/seeds/seed_all_data.ts
 */

import pg from 'pg';
import path from 'path';
import dotenv from 'dotenv';
import { NORTHERN_VIETNAM_ZONES } from '../../server/data/northern_vietnam_zones';
import { RAINFALL_STATIONS } from '../../server/data/stations';
import { DEFAULT_THRESHOLD_PROFILES } from '../../server/data/thresholds';
import { OFFICIAL_34_PROVINCES_QD19 } from '../../server/data/decision_19_provinces';
import { INITIAL_INCIDENTS } from '../../src/data/incidentsData';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const { Client } = pg;

function parseSafeTimestamp(input: string | undefined | null): string {
  if (!input) return new Date().toISOString();
  if (input.includes('T') && input.endsWith('Z')) return input;
  if (/^\d{4}-\d{2}-\d{2}/.test(input)) {
    return new Date(input.replace(' ', 'T') + (input.length <= 19 ? 'Z' : '')).toISOString();
  }
  if (/^\d{2}:\d{2}/.test(input)) {
    return new Date(`2026-08-24T${input.length === 5 ? input + ':00' : input}Z`).toISOString();
  }
  return new Date().toISOString();
}

async function seedAll() {
  const host = process.env.SUPABASE_DB_HOST || 'aws-0-ap-northeast-2.pooler.supabase.com';
  const port = parseInt(process.env.SUPABASE_DB_PORT || '6543');
  const database = process.env.SUPABASE_DB_NAME || 'postgres';
  const user = process.env.SUPABASE_DB_USER || 'postgres.orzefhjdpqijmrheobld';
  const password = process.env.SUPABASE_DB_PASSWORD || 'Phutho2024@!';

  console.log('═══════════════════════════════════════════════════════════');
  console.log('  🌱 HAEWS v3.0 — Database Data Seeder');
  console.log('═══════════════════════════════════════════════════════════\n');

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
    console.log('🔌 Connected to Supabase PostgreSQL.\n');

    // 1. Seed Provinces
    console.log('1️⃣ Seeding Provinces...');
    const provinces = [
      { code: 'LCA', name: 'Lào Cai', region: 'BAC_BO' },
      { code: 'YBI', name: 'Yên Bái', region: 'BAC_BO' },
      { code: 'HGI', name: 'Hà Giang', region: 'BAC_BO' },
      { code: 'CBA', name: 'Cao Bằng', region: 'BAC_BO' },
      { code: 'LCH', name: 'Lai Châu', region: 'BAC_BO' },
      { code: 'DBI', name: 'Điện Biên', region: 'BAC_BO' },
      { code: 'PTO', name: 'Phú Thọ', region: 'BAC_BO' },
      { code: 'SLA', name: 'Sơn La', region: 'BAC_BO' },
      { code: 'HNI', name: 'Hà Nội', region: 'BAC_BO' },
      { code: 'HPG', name: 'Hải Phòng', region: 'BAC_BO' },
      { code: 'HBH', name: 'Hòa Bình', region: 'BAC_BO' },
      { code: 'QNH', name: 'Quảng Ninh', region: 'BAC_BO' },
      { code: 'TNN', name: 'Thái Nguyên', region: 'BAC_BO' },
      { code: 'BKG', name: 'Bắc Kạn', region: 'BAC_BO' },
      { code: 'LSN', name: 'Lạng Sơn', region: 'BAC_BO' },
      { code: 'TTH', name: 'Thừa Thiên Huế', region: 'TRUNG_BO' },
      { code: 'QNM', name: 'Quảng Nam', region: 'TRUNG_BO' },
      { code: 'QTI', name: 'Quảng Trị', region: 'TRUNG_BO' },
      { code: 'NAN', name: 'Nghệ An', region: 'TRUNG_BO' },
      { code: 'QBH', name: 'Quảng Bình', region: 'TRUNG_BO' },
      { code: 'DNA', name: 'Đà Nẵng', region: 'TRUNG_BO' },
      { code: 'KHA', name: 'Khánh Hòa', region: 'TRUNG_BO' },
      { code: 'LDG', name: 'Lâm Đồng', region: 'TAY_NGUYEN' },
      { code: 'KTM', name: 'Kon Tum', region: 'TAY_NGUYEN' },
      { code: 'GLI', name: 'Gia Lai', region: 'TAY_NGUYEN' },
      { code: 'DKN', name: 'Đắk Nông', region: 'TAY_NGUYEN' },
      { code: 'DKL', name: 'Đắk Lắk', region: 'TAY_NGUYEN' },
      { code: 'HCM', name: 'TP. Hồ Chí Minh', region: 'NAM_BO' },
      { code: 'AGG', name: 'An Giang', region: 'NAM_BO' },
      { code: 'DTP', name: 'Đồng Tháp', region: 'NAM_BO' },
      { code: 'CTO', name: 'Cần Thơ', region: 'NAM_BO' },
      { code: 'CMU', name: 'Cà Mau', region: 'NAM_BO' },
    ];

    for (const p of provinces) {
      await client.query(`
        INSERT INTO core.provinces (province_code, province_name, region, warning_enabled)
        VALUES ($1, $2, $3, true)
        ON CONFLICT (province_code) DO UPDATE 
        SET province_name = EXCLUDED.province_name, region = EXCLUDED.region;
      `, [p.code, p.name, p.region]);
    }
    console.log(`   ✅ Seeded ${provinces.length} provinces.`);

    // 2. Seed Threshold Profiles
    console.log('\n2️⃣ Seeding Threshold Profiles...');
    for (const tp of DEFAULT_THRESHOLD_PROFILES) {
      await client.query(`
        INSERT INTO core.threshold_profiles (
          region_code, region_name, risk_type,
          rainfall_1h_threshold, rainfall_3h_threshold, rainfall_6h_threshold, rainfall_24h_threshold,
          soil_saturation_threshold, level, source, active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (region_code, risk_type, level) DO UPDATE
        SET rainfall_1h_threshold = EXCLUDED.rainfall_1h_threshold,
            rainfall_3h_threshold = EXCLUDED.rainfall_3h_threshold,
            rainfall_6h_threshold = EXCLUDED.rainfall_6h_threshold,
            rainfall_24h_threshold = EXCLUDED.rainfall_24h_threshold,
            soil_saturation_threshold = EXCLUDED.soil_saturation_threshold;
      `, [
        tp.region_code, tp.region_name, tp.risk_type,
        tp.rainfall_1h_threshold, tp.rainfall_3h_threshold, tp.rainfall_6h_threshold, tp.rainfall_24h_threshold,
        tp.soil_saturation_threshold || null, tp.level, tp.source, tp.active
      ]);
    }
    console.log(`   ✅ Seeded ${DEFAULT_THRESHOLD_PROFILES.length} threshold profiles.`);

    // 3. Seed Spatial Zones (with PostGIS geometry)
    console.log('\n3️⃣ Seeding Spatial Warning Zones (with PostGIS Polygons)...');
    let zoneCount = 0;
    for (const z of NORTHERN_VIETNAM_ZONES) {
      const coords = z.coordinates[0]; // Ring coordinates: [[lng, lat], ...]
      // Ensure polygon is closed
      const ring = [...coords];
      if (ring.length > 0 && (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1])) {
        ring.push(ring[0]);
      }
      const wktPolygon = `POLYGON((${ring.map(c => `${c[0]} ${c[1]}`).join(', ')}))`;
      const wktPoint = `POINT(${z.center[1]} ${z.center[0]})`; // center: [lat, lng] -> POINT(lng lat)

      await client.query(`
        INSERT INTO core.spatial_zones (
          zone_code, zone_name, district_name, province_name, region,
          center_lat, center_lng, center_point, elevation, slope, aspect,
          soil_type, geology_sensitivity, basin_name, basin_area_km2, channel_gradient,
          vulnerable_population, critical_facilities, warning_enabled, geom
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, ST_GeomFromText($8, 4326), $9, $10, $11,
          $12, $13, $14, $15, $16,
          $17, $18, $19, ST_GeomFromText($20, 4326)
        )
        ON CONFLICT (zone_code) DO UPDATE
        SET zone_name = EXCLUDED.zone_name,
            elevation = EXCLUDED.elevation,
            slope = EXCLUDED.slope,
            geology_sensitivity = EXCLUDED.geology_sensitivity,
            vulnerable_population = EXCLUDED.vulnerable_population,
            geom = EXCLUDED.geom,
            center_point = EXCLUDED.center_point;
      `, [
        z.zone_code, z.zone_name, z.district_name, z.province_name, z.region || 'BAC_BO',
        z.center[0], z.center[1], wktPoint, z.elevation, z.slope, z.aspect,
        z.soil_type, z.geology_sensitivity, z.basin_name, z.basin_area_km2, z.channel_gradient,
        z.vulnerable_population, z.critical_facilities, z.warning_enabled !== false, wktPolygon
      ]);
      zoneCount++;
    }
    console.log(`   ✅ Seeded ${zoneCount} spatial warning zones.`);

    // 4. Seed Rainfall Stations (with PostGIS Points)
    console.log('\n4️⃣ Seeding Rainfall & Telemetry Stations (with PostGIS Points)...');
    let staCount = 0;
    for (const sta of RAINFALL_STATIONS) {
      const wktPoint = `POINT(${sta.longitude} ${sta.latitude})`;

      await client.query(`
        INSERT INTO telemetry.rainfall_stations (
          station_code, station_name, latitude, longitude, elevation, location_point,
          status, source, country, province, provider_network,
          last_reading_time, current_rainfall_1h, current_rainfall_3h, current_rainfall_6h, current_rainfall_24h,
          quality_flag, battery_level, discharge_m3s, water_level_m, upstream_basin,
          wind_speed_kmh, wind_direction, atmospheric_pressure_hpa, sea_temperature_c, wave_height_m,
          radar_reflectivity_dbz, region_tag
        ) VALUES (
          $1, $2, $3, $4, $5, ST_GeomFromText($6, 4326),
          $7, $8, $9, $10, $11,
          $12, $13, $14, $15, $16,
          $17, $18, $19, $20, $21,
          $22, $23, $24, $25, $26,
          $27, $28
        )
        ON CONFLICT (station_code) DO UPDATE
        SET station_name = EXCLUDED.station_name,
            current_rainfall_1h = EXCLUDED.current_rainfall_1h,
            current_rainfall_3h = EXCLUDED.current_rainfall_3h,
            current_rainfall_6h = EXCLUDED.current_rainfall_6h,
            current_rainfall_24h = EXCLUDED.current_rainfall_24h,
            status = EXCLUDED.status,
            quality_flag = EXCLUDED.quality_flag,
            location_point = EXCLUDED.location_point;
      `, [
        sta.station_code, sta.station_name, sta.latitude, sta.longitude, sta.elevation, wktPoint,
        sta.status, sta.source, sta.country || 'VIETNAM', sta.province || null, sta.provider_network || null,
        sta.last_reading_time, sta.current_rainfall_1h, sta.current_rainfall_3h, sta.current_rainfall_6h, sta.current_rainfall_24h,
        sta.quality_flag, sta.battery_level, sta.discharge_m3s || null, sta.water_level_m || null, sta.upstream_basin || null,
        sta.wind_speed_kmh || null, sta.wind_direction || null, sta.atmospheric_pressure_hpa || null, sta.sea_temperature_c || null,
        sta.wave_height_m || null, sta.radar_reflectivity_dbz || null, sta.region_tag || null
      ]);
      staCount++;
    }
    console.log(`   ✅ Seeded ${staCount} rainfall stations.`);

    // 5. Seed Radar Stations
    console.log('\n5️⃣ Seeding Radar Doppler Stations...');
    const radarStations = [
      { code: 'RAD-PL', name: 'Radar Phù Liễn (Hải Phòng)', lat: 20.803, lng: 106.634, range: 250, band: 'C-Band' },
      { code: 'RAD-VT', name: 'Radar Việt Trì (Phú Thọ)', lat: 21.322, lng: 105.401, range: 200, band: 'C-Band' },
      { code: 'RAD-VN', name: 'Radar Vinh (Nghệ An)', lat: 18.673, lng: 105.681, range: 250, band: 'C-Band' },
      { code: 'RAD-DN', name: 'Radar Tam Kỳ / Đà Nẵng', lat: 16.038, lng: 108.188, range: 300, band: 'S-Band' },
      { code: 'RAD-QN', name: 'Radar Quy Nhơn (Bình Định)', lat: 13.782, lng: 109.219, range: 250, band: 'C-Band' },
      { code: 'RAD-NB', name: 'Radar Nhà Bè (TP.HCM)', lat: 10.686, lng: 106.745, range: 250, band: 'C-Band' },
    ];
    for (const r of radarStations) {
      const wkt = `POINT(${r.lng} ${r.lat})`;
      await client.query(`
        INSERT INTO telemetry.radar_stations (
          station_code, station_name, latitude, longitude, location_point, range_km, band, status, max_reflectivity_dbz
        ) VALUES ($1, $2, $3, $4, ST_GeomFromText($5, 4326), $6, $7, 'ONLINE', 58.5)
        ON CONFLICT (station_code) DO NOTHING;
      `, [r.code, r.name, r.lat, r.lng, wkt, r.range, r.band]);
    }
    console.log(`   ✅ Seeded ${radarStations.length} radar stations.`);

    // 6. Seed Incidents & Operations
    console.log('\n6️⃣ Seeding Disaster Incidents...');
    let incCount = 0;
    for (const inc of INITIAL_INCIDENTS) {
      const lat = inc.coordinates[0];
      const lng = inc.coordinates[1];
      const wktPoint = `POINT(${lng} ${lat})`;

      const detectedAtIso = parseSafeTimestamp(inc.detectedAt);
      const res = await client.query(`
        INSERT INTO incident.incidents (
          incident_code, name, description, risk_type, risk_level, risk_score_pct,
          confidence_pct, risk_trend, zone_name, district_name, province_name,
          specific_location, coordinates_lat, coordinates_lng, location_point,
          status, detected_at, time_to_critical_threshold_min, lead_time_status,
          exposed_population, exposed_households, elderly_children_count,
          schools_count, medical_clinics_count, vulnerable_roads_count, blocked_road_names,
          bridges_at_risk_count, critical_facilities, affected_area_km2,
          estimated_economic_exposure_billion_vnd, ai_recommendation, decision_required,
          explainable_factors
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11,
          $12, $13, $14, ST_GeomFromText($15, 4326),
          $16, $17, $18, $19,
          $20, $21, $22,
          $23, $24, $25, $26,
          $27, $28, $29,
          $30, $31, $32,
          $33
        )
        ON CONFLICT (incident_code) DO UPDATE
        SET name = EXCLUDED.name,
            risk_level = EXCLUDED.risk_level,
            status = EXCLUDED.status,
            exposed_population = EXCLUDED.exposed_population,
            ai_recommendation = EXCLUDED.ai_recommendation
        RETURNING id;
      `, [
        inc.incidentCode, inc.name, `Sự cố rủi ro ${inc.type} tại ${inc.specificLocation}`, inc.type, inc.level, inc.riskScorePercent,
        inc.confidencePercent, inc.riskTrend, inc.zoneName, inc.districtName, inc.provinceName,
        inc.specificLocation, lat, lng, wktPoint,
        inc.status, detectedAtIso, inc.timeToCriticalThresholdMinutes, inc.leadTimeStatus,
        inc.impact.exposedPopulation, inc.impact.exposedHouseholds, inc.impact.elderlyAndChildrenCount,
        inc.impact.schoolsCount, inc.impact.medicalClinicsCount, inc.impact.vulnerableRoadsCount, inc.impact.blockedRoadNames,
        inc.impact.bridgesAtRiskCount, inc.impact.criticalFacilities, inc.impact.affectedAreaKm2,
        inc.impact.estimatedEconomicExposureBillionVND, inc.aiRecommendation, inc.decisionRequired,
        JSON.stringify(inc.explainableFactors)
      ]);
      const incidentId = res.rows[0].id;

      // Seed Response Tasks for this incident
      for (const t of inc.tasks) {
        const taskCreatedAtIso = parseSafeTimestamp(t.createdAt);
        await client.query(`
          INSERT INTO incident.response_tasks (
            incident_id, task_code, title, description, assigned_unit, assignee_name, assignee_phone,
            priority, status, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (task_code) DO NOTHING;
        `, [
          incidentId, t.id, t.title, t.description, t.assignedUnit, t.assigneeName, t.assigneePhone,
          t.priority, t.status, taskCreatedAtIso
        ]);
      }

      // Seed Shelters
      for (const s of inc.shelters) {
        const shelterWkt = `POINT(${s.coordinates[1]} ${s.coordinates[0]})`;
        await client.query(`
          INSERT INTO resource.evacuation_shelters (
            shelter_code, shelter_name, commune_name, district_name, province_name,
            latitude, longitude, location_point, elevation_m, capacity_people, current_occupants,
            distance_km_from_hazard, contact_person, contact_phone,
            has_power_generator, has_clean_water, has_medical_firstaid, has_telecom_signal, food_rations_days,
            status
          ) VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, ST_GeomFromText($8, 4326), $9, $10, $11,
            $12, $13, $14,
            $15, $16, $17, $18, $19,
            $20
          )
          ON CONFLICT (shelter_code) DO NOTHING;
        `, [
          s.id, s.name, s.communeName, s.districtName, s.provinceName,
          s.coordinates[0], s.coordinates[1], shelterWkt, s.elevationMeters, s.capacityPeople, s.currentOccupants,
          s.distanceKmFromHazard, s.contactPerson, s.contactPhone,
          s.facilities.powerGenerator, s.facilities.cleanWaterSupply, s.facilities.medicalFirstAid, s.facilities.telecomSignal, s.facilities.foodRationsDays,
          s.status
        ]);
      }

      // Seed Timeline
      for (const tl of inc.timeline) {
        const tlTimeIso = parseSafeTimestamp(tl.time);
        await client.query(`
          INSERT INTO incident.incident_timeline (
            incident_id, event_time, stage, actor, description
          ) VALUES ($1, $2, $3, $4, $5);
        `, [incidentId, tlTimeIso, tl.stage, tl.actor, tl.description]);
      }

      incCount++;
    }
    console.log(`   ✅ Seeded ${incCount} incidents with full tasks, shelters, and timeline.`);

    // 7. Seed Typhoon Storm (Yagi & Trami)
    console.log('\n7️⃣ Seeding Typhoon Storms...');
    await client.query(`
      INSERT INTO typhoon.storms (
        storm_code, international_name, vietnam_number, season_year, is_historical,
        status, current_category, current_category_label, current_lat, current_lng,
        current_wind_speed_kmh, current_wind_gust_kmh, current_pressure_hpa, beaufort_scale_str,
        moving_direction, moving_speed_kmh, distance_to_mainland_km,
        sea_wave_height_m, storm_surge_height_m, synoptic_summary
      ) VALUES (
        'TY-2024-03', 'YAGI', 'Bão số 3 (2024)', 2024, true,
        'HISTORICAL_REFERENCE', 'SUPER_TYPHOON', 'Siêu bão cấp 16 (≥185 km/h)', 20.4, 107.8,
        205.0, 240.0, 915.0, 'Cấp 16 (184-201 km/h), Giật trên cấp 17',
        'Tây Tây Bắc (WNW - 290°)', 20.0, 120.0,
        '7.0 - 9.0m (Biển động dữ dội)', '1.5 - 2.8m (Nguy cơ ngập đê biển)',
        'Siêu bão YAGI là một trong những cơn bão mạnh nhất lịch sử đổ bộ Bắc Bộ gây mưa lũ lịch sử và sạt lở đồi nghiêm trọng.'
      ) ON CONFLICT (storm_code) DO NOTHING;
    `);
    console.log('   ✅ Seeded Typhoon Yagi.');

    // 8. Seed Emergency Dispatches
    console.log('\n8️⃣ Seeding Emergency Dispatches...');
    await client.query(`
      INSERT INTO alert.alert_dispatches (
        dispatch_number, title, issuer, signer, urgency_level, risk_level,
        affected_provinces, content, evacuation_instructions, sms_broadcast_text,
        broadcast_channels, status, recipients_count
      ) VALUES (
        '09/CĐ-PCTT',
        'CÔNG ĐIỆN HỎA TỐC: Ứng phó lũ bùn đá và sạt lở đồi Làng Nủ, Phúc Khánh',
        'Ban Chỉ huy PCTT & TKCN Tỉnh Lào Cai',
        'Trần Quốc Toản - Phó Trưởng Ban PCTT Tỉnh',
        'HOA_TOC', 5,
        ARRAY['Lào Cai', 'Yên Bái', 'Hà Giang'],
        'Yêu cầu UBND huyện Bảo Yên và các lực lượng vũ trang triển khai ngay phương án sơ tán khẩn cấp toàn bộ các hộ dân thuộc khu vực chân đồi Làng Nủ.',
        'Sơ tán 100% người già, phụ nữ, trẻ em về điểm trường Mầm non và Nhà văn hóa Phúc Khánh.',
        'CANH BAO HOA TOC: Nguy co lu bun da cuc ky nguy hiem tai Lang Nu - Phuc Khanh. So tan ngay theo huong dan cua chinh quyen!',
        ARRAY['SMS'::broadcast_channel_enum, 'COMMUNE_RADIO'::broadcast_channel_enum, 'ZALO_OA'::broadcast_channel_enum, 'EMERGENCY_SIREN'::broadcast_channel_enum],
        'TRANSMITTED', 1420
      ) ON CONFLICT (dispatch_number) DO NOTHING;
    `);
    console.log('   ✅ Seeded Emergency Dispatches.');

    // 9. Quick Row Count Summary
    console.log('\n───────────────────────────────────────────────────────────');
    console.log('📊 Supabase Database Seeding Summary:');
    const tables = [
      'core.provinces', 'core.spatial_zones', 'core.threshold_profiles',
      'telemetry.rainfall_stations', 'telemetry.radar_stations',
      'incident.incidents', 'incident.response_tasks', 'resource.evacuation_shelters',
      'incident.incident_timeline', 'typhoon.storms', 'alert.alert_dispatches',
      'auth_ext.user_profiles', 'auth_ext.role_permissions'
    ];

    for (const t of tables) {
      const res = await client.query(`SELECT COUNT(*) as count FROM ${t}`);
      console.log(`   ${t.padEnd(32)} ${res.rows[0].count} rows`);
    }

    console.log('───────────────────────────────────────────────────────────\n');
    console.log('🎉 ALL DATA SEEDED SUCCESSFULLY INTO SUPABASE POSTGRESQL!\n');

  } catch (err: any) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedAll().catch(console.error);
