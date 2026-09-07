import { RadarStationInfo, RadarNowcastCell, RadarNowcastMosaic } from '../../src/types';

export class RadarDopplerEngine {
  private radarStations: RadarStationInfo[] = [
    {
      id: 'RADAR-PDN',
      name: 'Radar Pha Đin (Điện Biên)',
      location: 'Đèo Pha Đin, Tủa Chùa, Điện Biên',
      latitude: 21.572,
      longitude: 103.525,
      range_km: 250,
      band: 'C-Band',
      status: 'ONLINE',
      last_sweep_time: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      max_reflectivity_dbz: 56.4
    },
    {
      id: 'RADAR-VTR',
      name: 'Radar Việt Trì (Phú Thọ)',
      location: 'Bạch Hạc, Việt Trì, Phú Thọ',
      latitude: 21.325,
      longitude: 105.412,
      range_km: 250,
      band: 'C-Band',
      status: 'ONLINE',
      last_sweep_time: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      max_reflectivity_dbz: 52.8
    },
    {
      id: 'RADAR-PLN',
      name: 'Radar Phù Liễn (Hải Phòng)',
      location: 'Kiến An, Hải Phòng',
      latitude: 20.803,
      longitude: 106.632,
      range_km: 250,
      band: 'S-Band',
      status: 'ONLINE',
      last_sweep_time: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      max_reflectivity_dbz: 48.2
    },
    {
      id: 'RADAR-TDO',
      name: 'Radar Tam Đảo (Vĩnh Phúc)',
      location: 'Đỉnh Tam Đảo, Vĩnh Phúc',
      latitude: 21.461,
      longitude: 105.648,
      range_km: 300,
      band: 'C-Band',
      status: 'ONLINE',
      last_sweep_time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      max_reflectivity_dbz: 54.0
    },
    {
      id: 'RADAR-VNH',
      name: 'Radar Vinh (Nghệ An)',
      location: 'Nghi Đức, TP Vinh, Nghệ An',
      latitude: 18.735,
      longitude: 105.672,
      range_km: 250,
      band: 'C-Band',
      status: 'ONLINE',
      last_sweep_time: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      max_reflectivity_dbz: 58.1
    },
    {
      id: 'RADAR-DHO',
      name: 'Radar Đồng Hới (Quảng Bình)',
      location: 'Bảo Ninh, Đồng Hới, Quảng Bình',
      latitude: 17.481,
      longitude: 106.625,
      range_km: 250,
      band: 'C-Band',
      status: 'ONLINE',
      last_sweep_time: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
      max_reflectivity_dbz: 55.6
    },
    {
      id: 'RADAR-PLK',
      name: 'Radar Pleiku (Gia Lai)',
      location: 'Biển Hồ, TP Pleiku, Gia Lai',
      latitude: 14.025,
      longitude: 108.012,
      range_km: 250,
      band: 'C-Band',
      status: 'ONLINE',
      last_sweep_time: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      max_reflectivity_dbz: 51.5
    },
    {
      id: 'RADAR-NBE',
      name: 'Radar Nhà Bè (TP Hồ Chí Minh)',
      location: 'Phú Xuân, Nhà Bè, TP.HCM',
      latitude: 10.665,
      longitude: 106.745,
      range_km: 250,
      band: 'S-Band',
      status: 'ONLINE',
      last_sweep_time: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      max_reflectivity_dbz: 49.0
    }
  ];

  public getNowcastMosaic(): RadarNowcastMosaic {
    const cells: RadarNowcastCell[] = [
      {
        id: 'CELL-CONV-01',
        name: 'Khối Mây Đối lưu Siêu bão Tích hợp (Tây Bắc Bộ)',
        center: [22.42, 104.28], // Near Lao Cai / Yen Bai
        reflectivity_dbz: 58.5,
        rainfall_rate_mmh: 78.4, // Marshall-Palmer Z=200R^1.6
        echo_top_km: 14.2,
        vil_kg_m2: 46.8,
        velocity_kmh: 32.5,
        direction_bearing_deg: 115, // ESE
        projected_impact_zones: ['Làng Nủ (Bảo Yên)', 'Mù Cang Chải (Yên Bái)', 'Bát Xát (Lào Cai)'],
        estimated_arrival_minutes: 25,
        severity: 'EXTREME_CONVECTIVE'
      },
      {
        id: 'CELL-CONV-02',
        name: 'Mây Đối lưu Sườn Tây Trường Sơn',
        center: [19.25, 104.88], // Nghe An / Ky Son
        reflectivity_dbz: 54.0,
        rainfall_rate_mmh: 52.1,
        echo_top_km: 12.8,
        vil_kg_m2: 38.2,
        velocity_kmh: 28.0,
        direction_bearing_deg: 95, // East
        projected_impact_zones: ['Kỳ Sơn (Nghệ An)', 'Tương Dương (Nghệ An)'],
        estimated_arrival_minutes: 40,
        severity: 'HEAVY'
      },
      {
        id: 'CELL-CONV-03',
        name: 'Dải Mây Thắt Hẹp Thượng Nguồn Sông Đà',
        center: [21.85, 103.82], // Son La
        reflectivity_dbz: 49.5,
        rainfall_rate_mmh: 36.8,
        echo_top_km: 11.5,
        vil_kg_m2: 29.5,
        velocity_kmh: 35.0,
        direction_bearing_deg: 130, // SE
        projected_impact_zones: ['Mường La (Sơn La)', 'Mai Châu (Hòa Bình)'],
        estimated_arrival_minutes: 55,
        severity: 'MODERATE'
      },
      {
        id: 'CELL-CONV-04',
        name: 'Khối Mây Đối lưu Đèo Ngang - Đèo Hải Vân',
        center: [15.82, 108.05], // Quang Nam
        reflectivity_dbz: 55.2,
        rainfall_rate_mmh: 56.4,
        echo_top_km: 13.5,
        vil_kg_m2: 41.0,
        velocity_kmh: 24.5,
        direction_bearing_deg: 80,
        projected_impact_zones: ['Nam Trà My (Quảng Nam)', 'Phước Sơn (Quảng Nam)'],
        estimated_arrival_minutes: 35,
        severity: 'HEAVY'
      }
    ];

    const maxDbz = Math.max(...cells.map((c) => c.reflectivity_dbz));

    return {
      timestamp: new Date().toISOString(),
      total_active_radars: this.radarStations.filter((r) => r.status === 'ONLINE').length,
      convective_cells_count: cells.length,
      highest_reflectivity_dbz: maxDbz,
      radar_stations: this.radarStations,
      convective_cells: cells,
      composite_sweep_coverage: 'Toàn bộ 10 trạm Radar Thời tiết Doppler Quốc gia (C-Band & S-Band QPE Mosaic)'
    };
  }
}

export const radarDopplerEngine = new RadarDopplerEngine();
