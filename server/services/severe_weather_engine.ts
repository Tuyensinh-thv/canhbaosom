import {
  SevereWeatherOverview,
  SevereWeatherAlert,
  LightningStrikePoint,
  UrbanFloodHotspot
} from '../../src/types';

export class SevereWeatherEngine {
  private alerts: SevereWeatherAlert[] = [
    {
      id: 'SVR-001',
      hazard_type: 'THUNDERSTORM_LIGHTNING',
      hazard_name: 'Giông Lốc Sấm Sét Cực Đoan & Phóng Điện Tầng Thấp',
      severity_level: 'CRITICAL',
      province: 'Lào Cai & Yên Bái',
      district_communes: ['Huyện Bảo Yên (Phố Ràng, Phúc Khánh)', 'Huyện Văn Bàn', 'Huyện Lục Yên'],
      issued_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      valid_until: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
      description: 'Khối mây đối lưu siêu phát triển (C-band 58 dBZ) đang phóng điện liên tục xuống các sườn núi dốc và thung lũng tụ thủy, nguy cơ sét đánh tử vong ngoài đồng trống và phóng điện gián tiếp qua dây dẫn.',
      key_metrics: {
        lightning_flash_rate_per_min: 142,
        wind_gust_kmh: 88,
        hail_prob_pct: 75,
        max_hail_diameter_cm: 2.5
      },
      radar_cell_ref: 'RAD-CELL-01',
      safety_instructions: [
        'Người dân tuyệt đối không trú mưa dưới gốc cây to, cột điện, chòi canh ngoài đồng.',
        'Ngắt toàn bộ cầu dao điện chính và ngắt kết nối ăng-ten, thiết bị viễn thông trong nhà.',
        'Tránh xa các vùng nước trũng, khe suối hẹp vì có nguy cơ dẫn điện sét lan truyền.'
      ],
      safe_shelters_count: 18
    },
    {
      id: 'SVR-002',
      hazard_type: 'HAIL_STORM',
      hazard_name: 'Mưa Đá Kích Thước Lớn Kèm Gió Giật Siêu Cấp',
      severity_level: 'VERY_HIGH',
      province: 'Hà Giang & Cao Bằng',
      district_communes: ['Đồng Văn', 'Mèo Vạc', 'Hà Quảng', 'Trùng Khánh'],
      issued_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      valid_until: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      description: 'Dòng thăng thẳng đứng mạnh đẩy hạt băng lên tầng đối lưu cao hình thành mưa đá đường kính 2 - 4.5cm, có khả năng chọc thủng mái tôn pro-ximăng, hủy hoại hoa màu và hoa quả ôn đới.',
      key_metrics: {
        hail_prob_pct: 88,
        max_hail_diameter_cm: 3.8,
        wind_gust_kmh: 95
      },
      radar_cell_ref: 'RAD-CELL-03',
      safety_instructions: [
        'Gia cố ngay mái chuồng trại gia súc bằng lưới thép hoặc phủ bạt dày/cành lá.',
        'Tìm nơi trú ẩn có kết cấu bê tông kiên cố; đội mũ bảo hiểm nếu bắt buộc phải di chuyển ngoài trời.',
        'Đưa ô tô, xe máy vào gara có mái che cứng hoặc trùm chăn bông/đệm dày chống vỡ kính.'
      ],
      safe_shelters_count: 14
    },
    {
      id: 'SVR-003',
      hazard_type: 'TORNADO_SQUALL',
      hazard_name: 'Lốc Xoáy & Gió Giật Cực Bộ Cấp 10-11',
      severity_level: 'VERY_HIGH',
      province: 'Nghệ An & Thanh Hóa',
      district_communes: ['Huyện Kỳ Sơn', 'Huyện Tương Dương', 'Huyện Quan Hóa'],
      issued_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      valid_until: new Date(Date.now() + 2.5 * 3600 * 1000).toISOString(),
      description: 'Hiện tượng đứt gió tầng thấp (Low-level wind shear) tạo thành luồng xoáy cục bộ quét qua các thung lũng hẹp, có khả năng tốc mái nhà kiên cố, quật đổ cây cổ thụ và cột điện trung thế.',
      key_metrics: {
        wind_gust_kmh: 112,
        lightning_flash_rate_per_min: 96
      },
      safety_instructions: [
        'Đóng chặt toàn bộ cửa sổ sổ gỗ/kính và cửa chính; chằng néo góc nhà theo hướng vuông góc với gió.',
        'Di chuyển người già và trẻ nhỏ vào phòng kín kiên cố nhất trong nhà (phòng vệ sinh, gầm cầu thang).',
        'Cảnh giác với mái tôn, biển quảng cáo và vật thể bay trong không khí.'
      ],
      safe_shelters_count: 22
    },
    {
      id: 'SVR-004',
      hazard_type: 'URBAN_FLASH_FLOOD',
      hazard_name: 'Ngập Lụt Đô Thị Cực Đoan & Ngập Điểm Trũng Thấp',
      severity_level: 'CRITICAL',
      province: 'TP. Lào Cai, Yên Bái, Hà Nội',
      district_communes: ['TP. Yên Bái (Khu vực Đề Thám, Ga Yên Bái)', 'TP. Lào Cai (Phường Kim Tân, Cốc Lếu)', 'Hà Nội (Khu vực Đại lộ Thăng Long, Cầu Giấy)'],
      issued_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      valid_until: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
      description: 'Lượng mưa tức thời vượt quá 85mm/h vượt quá 320% công suất tiêu thoát của hệ thống cống ngầm, gây ngập sâu từ 0.5m đến 1.4m tại các nút giao trũng thấp, tê liệt giao thông.',
      key_metrics: {
        flood_depth_cm: 115,
        water_flow_speed_ms: 1.8,
        inundation_area_ha: 340
      },
      safety_instructions: [
        'Tuyệt đối không điều khiển phương tiện (ô tô, xe máy) đi vào vùng nước ngập quá 20cm hoặc nước đang chảy xiết.',
        'Kê cao tài sản, chuyển hàng hóa lên tầng 2 hoặc khu vực cao ráo; đặt tấm chắn nước ngập trước cửa hầm/nhà.',
        'Cắt nguồn điện các ổ cắm tầng 1 để phòng ngừa chập điện rò rỉ dưới nước ngập.'
      ],
      safe_shelters_count: 36
    }
  ];

  private lightningStrikes: LightningStrikePoint[] = [
    {
      id: 'LT-001',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      coords: [22.385, 104.345],
      current_ka: -68.4,
      type: 'CLOUD_TO_GROUND',
      location_name: 'Xã Phúc Khánh, Huyện Bảo Yên (Khu Làng Nủ)',
      risk_level: 'EXTREME'
    },
    {
      id: 'LT-002',
      timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      coords: [22.412, 104.312],
      current_ka: -52.1,
      type: 'CLOUD_TO_GROUND',
      location_name: 'Đồi Bản Cái, Huyện Bắc Hà',
      risk_level: 'EXTREME'
    },
    {
      id: 'LT-003',
      timestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
      coords: [22.321, 103.854],
      current_ka: 41.5,
      type: 'INTRA_CLOUD',
      location_name: 'Dãy Hoàng Liên Sơn (Sa Pa)',
      risk_level: 'HIGH'
    },
    {
      id: 'LT-004',
      timestamp: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
      coords: [21.724, 104.912],
      current_ka: -82.7,
      type: 'CLOUD_TO_GROUND',
      location_name: 'Khu vực Suối Thia, TX. Nghĩa Lộ (Yên Bái)',
      risk_level: 'EXTREME'
    },
    {
      id: 'LT-005',
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      coords: [19.421, 104.182],
      current_ka: -49.0,
      type: 'CLOUD_TO_GROUND',
      location_name: 'Thung lũng Tà Cạ, Huyện Kỳ Sơn (Nghệ An)',
      risk_level: 'HIGH'
    },
    {
      id: 'LT-006',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      coords: [23.184, 105.124],
      current_ka: -74.2,
      type: 'CLOUD_TO_GROUND',
      location_name: 'Cao nguyên Đồng Văn (Hà Giang)',
      risk_level: 'EXTREME'
    }
  ];

  private urbanFloodHotspots: UrbanFloodHotspot[] = [
    {
      id: 'UF-01',
      name: 'Đoạn Trũng Ngã Tư Đề Thám - Ga Yên Bái',
      city_province: 'Yên Bái',
      district: 'TP. Yên Bái',
      current_depth_cm: 85,
      projected_peak_depth_cm: 120,
      peak_time_offset_min: 45,
      drainage_capacity_pct: 25,
      traffic_status: 'IMPASSABLE',
      pump_stations_active: 3,
      historical_max_depth_cm: 180,
      alert_level: 'LEVEL_4'
    },
    {
      id: 'UF-02',
      name: 'Đường Kim Tân - Dọc Bờ Sông Hồng',
      city_province: 'Lào Cai',
      district: 'TP. Lào Cai',
      current_depth_cm: 65,
      projected_peak_depth_cm: 90,
      peak_time_offset_min: 30,
      drainage_capacity_pct: 35,
      traffic_status: 'IMPASSABLE',
      pump_stations_active: 2,
      historical_max_depth_cm: 140,
      alert_level: 'LEVEL_3'
    },
    {
      id: 'UF-03',
      name: 'Ngầm Tràn Thị Trấn Mường Xén',
      city_province: 'Nghệ An',
      district: 'Huyện Kỳ Sơn',
      current_depth_cm: 110,
      projected_peak_depth_cm: 145,
      peak_time_offset_min: 20,
      drainage_capacity_pct: 10,
      traffic_status: 'IMPASSABLE',
      pump_stations_active: 0,
      historical_max_depth_cm: 220,
      alert_level: 'LEVEL_4'
    },
    {
      id: 'UF-04',
      name: 'Hầm Chui Dân Sinh Số 3 & 5 (Đại Lộ Thăng Long)',
      city_province: 'Hà Nội',
      district: 'Huyện Hoài Đức',
      current_depth_cm: 45,
      projected_peak_depth_cm: 75,
      peak_time_offset_min: 60,
      drainage_capacity_pct: 48,
      traffic_status: 'RESTRICTED',
      pump_stations_active: 4,
      historical_max_depth_cm: 110,
      alert_level: 'LEVEL_2'
    },
    {
      id: 'UF-05',
      name: 'Tuyến Đường Hùng Vương - Chợ Trung Tâm Sa Pa',
      city_province: 'Lào Cai',
      district: 'TX. Sa Pa',
      current_depth_cm: 40,
      projected_peak_depth_cm: 55,
      peak_time_offset_min: 25,
      drainage_capacity_pct: 55,
      traffic_status: 'RESTRICTED',
      pump_stations_active: 1,
      historical_max_depth_cm: 95,
      alert_level: 'LEVEL_2'
    }
  ];

  public getSevereOverview(): SevereWeatherOverview {
    return {
      active_alerts_count: this.alerts.length,
      total_lightning_strikes_1h: 3840,
      lightning_network_sensors_online: 18,
      urban_flood_points_active: this.urbanFloodHotspots.length,
      hail_risk_zones_count: 2,
      tornado_risk_zones_count: 2,
      alerts: this.alerts,
      recent_lightning_strikes: this.lightningStrikes,
      urban_flood_hotspots: this.urbanFloodHotspots,
      lightning_density_grid: [
        { lat: 22.4, lng: 104.3, intensity: 0.95, strikes_count: 420 },
        { lat: 22.3, lng: 103.9, intensity: 0.82, strikes_count: 290 },
        { lat: 21.7, lng: 104.9, intensity: 0.78, strikes_count: 245 },
        { lat: 23.2, lng: 105.1, intensity: 0.88, strikes_count: 360 },
        { lat: 19.4, lng: 104.2, intensity: 0.72, strikes_count: 190 },
        { lat: 21.0, lng: 105.8, intensity: 0.65, strikes_count: 155 }
      ]
    };
  }

  public reportSevereEvent(alertData: Partial<SevereWeatherAlert>): SevereWeatherAlert {
    const newAlert: SevereWeatherAlert = {
      id: `SVR-${Date.now()}`,
      hazard_type: alertData.hazard_type || 'THUNDERSTORM_LIGHTNING',
      hazard_name: alertData.hazard_name || 'Cảnh báo Giông Sét & Thời Tiết Nguy Hiểm',
      severity_level: alertData.severity_level || 'VERY_HIGH',
      province: alertData.province || 'Lào Cai',
      district_communes: alertData.district_communes || ['Khu vực trọng điểm'],
      issued_at: new Date().toISOString(),
      valid_until: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
      description: alertData.description || 'Ghi nhận hiện tượng khí tượng thủy văn cực đoan qua cảm biến.',
      key_metrics: alertData.key_metrics || {},
      safety_instructions: alertData.safety_instructions || [
        'Người dân chủ động phòng ngừa theo phương châm 4 tại chỗ.',
        'Theo dõi liên tục bản tin dự báo trên cổng cảnh báo quốc gia.'
      ],
      safe_shelters_count: 10
    };

    this.alerts.unshift(newAlert);
    return newAlert;
  }
}

export const severeWeatherEngine = new SevereWeatherEngine();
