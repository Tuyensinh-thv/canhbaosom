import { EarthquakeEvent, TsunamiAlert, FaultLine } from '../types';

/**
 * Danh mục các đới đứt gãy kiến tạo chính tại Việt Nam và khu vực Biển Đông
 */
export const VIETNAM_FAULT_LINES: FaultLine[] = [
  {
    id: 'fault-red-river',
    name: 'Đới đứt gãy Sông Hồng (Red River Fault)',
    category: 'STRIKE_SLIP',
    length_km: 1000,
    max_potential_magnitude: 6.8,
    activity_level: 'ACTIVE',
    description: 'Đới trượt bằng quy mô lớn chạy từ Vân Nam (Trung Quốc) qua Lào Cai, Yên Bái, Phú Thọ, Hà Nội ra vịnh Bắc Bộ.',
    coordinates: [
      [103.85, 22.50],
      [104.40, 21.90],
      [105.10, 21.45],
      [105.80, 21.05],
      [106.50, 20.60],
      [107.20, 20.10]
    ]
  },
  {
    id: 'fault-dien-bien',
    name: 'Đới đứt gãy Điện Biên - Lai Châu',
    category: 'STRIKE_SLIP',
    length_km: 350,
    max_potential_magnitude: 6.9,
    activity_level: 'VERY_ACTIVE',
    description: 'Khu vực có hoạt động địa chấn mạnh nhất Tây Bắc, từng xảy ra trận động đất Điện Biên năm 1935 (M=6.75) và Tuần Giáo năm 1983 (M=6.8).',
    coordinates: [
      [102.80, 22.40],
      [103.00, 21.80],
      [103.05, 21.38],
      [103.25, 20.80]
    ]
  },
  {
    id: 'fault-song-ma',
    name: 'Đới đứt gãy Sông Mã - Sông Cả',
    category: 'THRUST',
    length_km: 450,
    max_potential_magnitude: 6.0,
    activity_level: 'MODERATE',
    description: 'Chạy dọc biên giới Việt - Lào qua Sơn La, Thanh Hóa, Nghệ An, Hà Tĩnh.',
    coordinates: [
      [103.50, 21.20],
      [104.80, 20.30],
      [105.40, 19.40],
      [105.90, 18.50]
    ]
  },
  {
    id: 'fault-rao-coi',
    name: 'Đới đứt gãy Rào Cỏ & Duyên Hải Nam Trung Bộ',
    category: 'STRIKE_SLIP',
    length_km: 520,
    max_potential_magnitude: 5.8,
    activity_level: 'ACTIVE',
    description: 'Khu vực đới đứt gãy kích thích tại Kon Tum (Kon Plông), Quảng Nam, Quảng Ngãi và thềm lục địa miền Trung.',
    coordinates: [
      [106.20, 17.80],
      [107.50, 16.50],
      [108.20, 15.50],
      [108.80, 14.50],
      [109.10, 13.50]
    ]
  },
  {
    id: 'fault-manila-trench',
    name: 'Đới hút chìm Rãnh Manila (Manila Trench - Nguồn phát sinh Sóng Thần)',
    category: 'SUBDUCTION_ZONE',
    length_km: 900,
    max_potential_magnitude: 8.5,
    activity_level: 'VERY_ACTIVE',
    description: 'Đới hút chìm kiến tạo phía Tây Philippines trên Biển Đông; nguồn rủi ro sóng thần nguy hiểm nhất ảnh hưởng tới toàn bộ bờ biển miền Trung Việt Nam (thời gian truyền sóng từ 2.0 - 2.5 giờ).',
    coordinates: [
      [119.20, 19.80],
      [119.10, 18.00],
      [119.30, 16.00],
      [119.50, 14.00],
      [119.80, 12.50]
    ]
  }
];

/**
 * Danh sách sự kiện địa chấn quan trắc mẫu và cập nhật thực
 */
export const SAMPLE_EARTHQUAKE_EVENTS: EarthquakeEvent[] = [
  {
    id: 'eq-2026-0822-01',
    source: 'VAST_IGP',
    event_code: 'EQ_KP_20260822_01',
    timestamp: '2026-08-22T21:05:00.000Z',
    magnitude: 4.8,
    depth_km: 8.2,
    latitude: 14.782,
    longitude: 108.265,
    location_name: 'Huyện Kon Plông, Tỉnh Kon Tum',
    province: 'Kon Tum',
    intensity_mmi: 'V - Trung bình',
    p_wave_radius_km: 145,
    s_wave_radius_km: 85,
    alert_level: 'YELLOW',
    aftershock_probability: 78,
    tsunami_potential: false,
    affected_districts: ['Kon Plông', 'Ba Tơ', 'Sơn Tây', 'Nam Trà My'],
    fault_system: 'Đới đứt gãy Rào Cỏ - Kon Tum',
    felt_reports_count: 142,
    guidance_summary: 'Rung lắc cảm nhận rõ trong bán kính 60km. Người dân kiểm tra kết cấu nhà cửa, đề phòng sạt lở đất đá sườn dốc sau rung chấn kết hợp mưa ẩm.'
  },
  {
    id: 'eq-2026-0822-02',
    source: 'USGS',
    event_code: 'EQ_DB_20260820_02',
    timestamp: '2026-08-20T14:22:00.000Z',
    magnitude: 4.2,
    depth_km: 12.0,
    latitude: 21.650,
    longitude: 103.120,
    location_name: 'Huyện Mường Chà, Tỉnh Điện Biên',
    province: 'Điện Biên',
    intensity_mmi: 'IV - Nhẹ',
    p_wave_radius_km: 110,
    s_wave_radius_km: 60,
    alert_level: 'GREEN',
    aftershock_probability: 35,
    tsunami_potential: false,
    affected_districts: ['Mường Chà', 'Mường Lay', 'Nậm Pồ'],
    fault_system: 'Đới đứt gãy Điện Biên - Lai Châu',
    felt_reports_count: 48,
    guidance_summary: 'Rung lắc nhẹ đối với các tầng nhà cao tầng, không gây thiệt hại về người và công trình kiên cố.'
  },
  {
    id: 'eq-2026-0818-03',
    source: 'VAST_IGP',
    event_code: 'EQ_PT_20260818_03',
    timestamp: '2026-08-18T06:15:00.000Z',
    magnitude: 3.4,
    depth_km: 10.5,
    latitude: 21.285,
    longitude: 105.150,
    location_name: 'Huyện Thanh Sơn, Tỉnh Phú Thọ',
    province: 'Phú Thọ',
    intensity_mmi: 'III - Yếu',
    p_wave_radius_km: 70,
    s_wave_radius_km: 35,
    alert_level: 'GREEN',
    aftershock_probability: 12,
    tsunami_potential: false,
    affected_districts: ['Thanh Sơn', 'Tân Sơn', 'Yên Lập'],
    fault_system: 'Đới đứt gãy Sông Hồng - Sông Đà',
    felt_reports_count: 22,
    guidance_summary: 'Địa chấn nhỏ không gây nguy hiểm, các trạm quan trắc tự động vẫn duy trì giám sát liên tục.'
  },
  {
    id: 'eq-2026-0815-04',
    source: 'USGS',
    event_code: 'EQ_MNL_20260815_04',
    timestamp: '2026-08-15T03:40:00.000Z',
    magnitude: 6.7,
    depth_km: 25.0,
    latitude: 16.450,
    longitude: 119.400,
    location_name: 'Tây Bắc Đảo Luzon, Rãnh Manila (Biển Đông)',
    province: 'Biển Đông',
    intensity_mmi: 'VII - Rất mạnh',
    p_wave_radius_km: 650,
    s_wave_radius_km: 380,
    alert_level: 'ORANGE',
    aftershock_probability: 88,
    tsunami_potential: true,
    affected_districts: ['Quần đảo Hoàng Sa', 'Vùng biển Miền Trung'],
    fault_system: 'Rãnh hút chìm Manila',
    felt_reports_count: 310,
    guidance_summary: 'Kích hoạt mô hình dự báo sóng thần Biển Đông; theo dõi độ cao sóng tại các trạm phao hải dương DART.'
  }
];

/**
 * Cảnh báo Sóng thần mẫu & kịch bản mô phỏng lan truyền
 */
export const SAMPLE_TSUNAMI_ALERT: TsunamiAlert = {
  id: 'tsunami-alert-2026-01',
  bulletin_no: 'BẢN TIN SỐNG THẦN SỐ 01/PTWC-HVU',
  originating_earthquake_id: 'eq-2026-0815-04',
  issued_at: '2026-08-22T21:15:00.000Z',
  source: 'IGP_VIETNAM',
  epicenter_location: 'Rãnh Manila, Biển Đông (16.45°N, 119.40°E)',
  earthquake_magnitude: 6.7,
  threat_level: 'WATCH',
  is_active: true,
  affected_coastal_provinces: ['Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa'],
  forecasts: [
    {
      coastal_station_code: 'VN-DN-01',
      coastal_station_name: 'Trạm Cảng Tiên Sa - TP. Đà Nẵng',
      province: 'Đà Nẵng',
      lat: 16.120,
      lng: 108.220,
      estimated_arrival_time: '23:30, 22/08/2026',
      lead_time_minutes: 135,
      max_wave_height_meters: 1.2,
      threat_level: 'WATCH',
      evacuation_zone_elevation_m: 5.0,
      status: 'PENDING'
    },
    {
      coastal_station_code: 'VN-QN-02',
      coastal_station_name: 'Trạm Cửa Đại - Hội An (Quảng Nam)',
      province: 'Quảng Nam',
      lat: 15.875,
      lng: 108.380,
      estimated_arrival_time: '23:25, 22/08/2026',
      lead_time_minutes: 130,
      max_wave_height_meters: 1.4,
      threat_level: 'WATCH',
      evacuation_zone_elevation_m: 5.0,
      status: 'PENDING'
    },
    {
      coastal_station_code: 'VN-QNG-03',
      coastal_station_name: 'Trạm Cảng Dung Quất (Quảng Ngãi)',
      province: 'Quảng Ngãi',
      lat: 15.410,
      lng: 108.800,
      estimated_arrival_time: '23:18, 22/08/2026',
      lead_time_minutes: 123,
      max_wave_height_meters: 1.6,
      threat_level: 'WATCH',
      evacuation_zone_elevation_m: 6.0,
      status: 'PENDING'
    },
    {
      coastal_station_code: 'VN-BD-04',
      coastal_station_name: 'Trạm Quy Nhơn (Bình Định)',
      province: 'Bình Định',
      lat: 13.770,
      lng: 109.240,
      estimated_arrival_time: '23:10, 22/08/2026',
      lead_time_minutes: 115,
      max_wave_height_meters: 1.8,
      threat_level: 'WATCH',
      evacuation_zone_elevation_m: 6.0,
      status: 'PENDING'
    }
  ],
  evacuation_order: 'Thông báo tàu thuyền đang hoạt động ngoài khơi di chuyển ra vùng nước sâu (>200m). Các hộ dân sinh sống sát mép nước bãi ngang chủ động sơ tán lên các cồn cát, nhà cao tầng kiên cố có cao độ > 5m.',
  propagation_map_available: true
};

export const EARTHQUAKE_ACTION_GUIDES = [
  {
    id: 'during_shaking',
    title: 'Khi Đang Xảy Ra Rung Chấn (Quy tắc DROP - COVER - HOLD ON)',
    subtitle: 'Hạ thấp - Che chắn - Giữ chặt trong 60 giây đầu tiên',
    steps: [
      'NẰM XUỐNG / HẠ THẤP: Nhanh chóng quỳ xuống sàn nhà để tránh bị quật ngã bởi lực quán tính rung chấn.',
      'CHỐN NẤU & CHE CHẮN: Chui ngay xuống gầm bàn kiên cố, bàn làm việc hoặc góc tường chịu lực. Dùng tay hoặc cặp sách che kín đầu và gáy.',
      'GIỮ CHẶT: Giữ chắc chân bàn cho đến khi rung lắc dừng hẳn.',
      'TRÁNH XA: Tránh xa cửa sổ kính lớn, tủ gương, kệ sách treo tường và đèn chùm trần nhà.',
      'NẾU Ở NGOÀI TRỜI: Tìm bãi đất trống, tránh xa cột điện cao thế, biển quảng cáo, tường bao cũ và chân taluy dốc.',
      'NẾU ĐANG LÁI XE: Tấp xe vào lề đường an toàn, dừng hẳn xe và ngồi yên bên trong cho đến khi hết rung chấn. Không dừng xe trên cầu hoặc dưới gầm cầu vượt.'
    ]
  },
  {
    id: 'tsunami_evac',
    title: 'Ứng Phó Khi Nhận Cảnh Báo Sóng Thần',
    subtitle: 'Hành động tức thì cứu tính mạng vùng ven biển',
    steps: [
      'NHẬN BIẾT DẤU HIỆU TỰ NHIÊN: Đất rung chuyển mạnh kéo dài hơn 20 giây; nước biển đột ngột rút cạn bất thường làm trơ đáy biển hoặc có tiếng gầm lớn như máy bay phản lực từ đại dương.',
      'SƠ TÁN NGAY LẬP TỨC: Không chờ thông báo chính thức nếu thấy nước biển rút; chạy ngay vào đất liền sâu hoặc di chuyển lên vùng đất cao trên 10-15 mét so với mực nước biển.',
      'TÀU THUYỀN TRÊN BIỂN: Nếu đang neo đậu ở cảng, khẩn trương đưa người lên bờ. Nếu đang ở vùng nước sâu ngoài khơi (>200m), không quay về bờ mà duy trì vị trí ngoài biển khơi an toàn.',
      'KHÔNG XEM SÓNG THẦN: Tuyệt đối không đứng lại bãi biển để quay phim, chụp ảnh vì sóng thần di chuyển với vận tốc 500-800 km/h ở đại dương và ồn ạt ập vào bờ.',
      'ĐỀ PHÒNG CÁC ĐỢT SÓNG SAU: Sóng thần bao gồm một chuỗi nhiều đợt sóng liên tiếp; đợt sóng đầu tiên thường chưa phải là đợt sóng lớn nhất.'
    ]
  }
];
