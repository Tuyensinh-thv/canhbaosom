import { SpatialZone } from '../../src/types';

export const NORTHERN_VIETNAM_ZONES: SpatialZone[] = [
  // =========================================================================
  // I. TỈNH LÀO CAI (TOÀN BỘ CÁC XÃ/PHƯỜNG TRỌNG ĐIỂM)
  // =========================================================================
  {
    id: 'zone-lca-01',
    zone_code: 'LCA_BY_PHUCKHANH',
    zone_name: 'Xã Phúc Khánh (Làng Nủ)',
    district_name: 'Huyện Bảo Yên',
    province_name: 'Tỉnh Lào Cai',
    region: 'BAC_BO',
    coordinates: [
      [[104.312, 22.254], [104.348, 22.268], [104.365, 22.242], [104.335, 22.221], [104.305, 22.235], [104.312, 22.254]]
    ],
    center: [22.245, 104.332],
    elevation: 480,
    slope: 38.5,
    aspect: 'NE',
    soil_type: 'Đất Feralit đỏ vàng trên đá biến chất, tầng dày yếu',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-song-chay-01',
    basin_name: 'Lưu vực Suối Nủ - Thượng nguồn Sông Chảy',
    basin_area_km2: 24.8,
    channel_gradient: 18.2,
    vulnerable_population: 760,
    critical_facilities: ['Điểm trường Làng Nủ', 'Cầu tràn dân sinh Phúc Khánh', 'Trạm biến áp T1']
  },
  {
    id: 'zone-lca-02',
    zone_code: 'LCA_SP_TRUNGCHAI',
    zone_name: 'Xã Trung Chải (Dãy Hoàng Liên)',
    district_name: 'Thị xã Sa Pa',
    province_name: 'Tỉnh Lào Cai',
    region: 'BAC_BO',
    coordinates: [
      [[103.854, 22.378], [103.892, 22.395], [103.918, 22.365], [103.882, 22.342], [103.845, 22.355], [103.854, 22.378]]
    ],
    center: [22.367, 103.878],
    elevation: 1420,
    slope: 42.0,
    aspect: 'E',
    soil_type: 'Đất mùn vàng đỏ trên núi cao granit phong hóa sâu',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-suoi-muong-hoa',
    basin_name: 'Lưu vực Suối Mường Hoa - Suối Hồ',
    basin_area_km2: 41.5,
    channel_gradient: 24.6,
    vulnerable_population: 1450,
    critical_facilities: ['Quốc lộ 4D Km 112', 'Trường PTDTBT TH Trung Chải', 'Trạm y tế xã Trung Chải']
  },
  {
    id: 'zone-lca-03',
    zone_code: 'LCA_BX_ALU',
    zone_name: 'Xã A Lù (Ngải Thầu)',
    district_name: 'Huyện Bát Xát',
    province_name: 'Tỉnh Lào Cai',
    region: 'BAC_BO',
    coordinates: [
      [[103.621, 22.612], [103.665, 22.635], [103.682, 22.598], [103.642, 22.575], [103.608, 22.589], [103.621, 22.612]]
    ],
    center: [22.602, 103.644],
    elevation: 1650,
    slope: 44.5,
    aspect: 'NW',
    soil_type: 'Đất feralit đỏ nâu trên đá macma kiềm, độ bở rời cao',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-suoi-lung-po',
    basin_name: 'Lưu vực Suối Lũng Pô - Thượng nguồn Sông Hồng',
    basin_area_km2: 32.0,
    channel_gradient: 21.0,
    vulnerable_population: 920,
    critical_facilities: ['Tỉnh lộ 156B Km 45', 'Trường Tiểu học A Lù', 'Đồn biên phòng Y Tý']
  },
  {
    id: 'zone-lca-04',
    zone_code: 'LCA_BH_NAMDEC',
    zone_name: 'Xã Nậm Đét & Bản Phố',
    district_name: 'Huyện Bắc Hà',
    province_name: 'Tỉnh Lào Cai',
    region: 'BAC_BO',
    coordinates: [
      [[104.251, 22.482], [104.295, 22.505], [104.318, 22.468], [104.275, 22.445], [104.238, 22.458], [104.251, 22.482]]
    ],
    center: [22.471, 104.275],
    elevation: 1050,
    slope: 39.0,
    aspect: 'SW',
    soil_type: 'Đá biến chất xen kẹp đá vôi karst phong hóa',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-nam-mon',
    basin_name: 'Lưu vực Suối Nậm Mòn - Bắc Hà',
    basin_area_km2: 36.5,
    channel_gradient: 19.0,
    vulnerable_population: 1180,
    critical_facilities: ['Tỉnh lộ 153', 'UBND xã Bản Phố', 'Trường THCS Nậm Đét']
  },
  {
    id: 'zone-lca-05',
    zone_code: 'LCA_BH_COCLAU',
    zone_name: 'Xã Cốc Lầu (Thôn Kho Vàng)',
    district_name: 'Huyện Bắc Hà',
    province_name: 'Tỉnh Lào Cai',
    region: 'BAC_BO',
    coordinates: [
      [[104.185, 22.385], [104.225, 22.408], [104.252, 22.368], [104.208, 22.345], [104.172, 22.358], [104.185, 22.385]]
    ],
    center: [22.374, 104.205],
    elevation: 620,
    slope: 41.5,
    aspect: 'N',
    soil_type: 'Tầng đá phong hóa dày nứt nẻ sườn núi dốc đứng',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-song-chay-cl',
    basin_name: 'Lưu vực Sông Chảy - Cốc Lầu',
    basin_area_km2: 29.0,
    channel_gradient: 20.5,
    vulnerable_population: 890,
    critical_facilities: ['Điểm dân cư Kho Vàng', 'Cầu treo Cốc Lầu', 'Đường tuần tra rừng']
  },
  {
    id: 'zone-lca-06',
    zone_code: 'LCA_SP_TAVAN',
    zone_name: 'Xã Tả Van & Hầu Thào',
    district_name: 'Thị xã Sa Pa',
    province_name: 'Tỉnh Lào Cai',
    region: 'BAC_BO',
    coordinates: [
      [[103.882, 22.305], [103.925, 22.328], [103.948, 22.288], [103.905, 22.265], [103.868, 22.278], [103.882, 22.305]]
    ],
    center: [22.294, 103.905],
    elevation: 1250,
    slope: 37.0,
    aspect: 'SE',
    soil_type: 'Đất phù sa cổ xen đá tảng lăn suối Mường Hoa',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-muong-hoa-ha',
    basin_name: 'Thung lũng Mường Hoa',
    basin_area_km2: 45.0,
    channel_gradient: 17.5,
    vulnerable_population: 2100,
    critical_facilities: ['Cầu mây Tả Van', 'Khu du lịch Bản Cát Cát - Tả Van', 'Trạm y tế Tả Van']
  },

  // =========================================================================
  // II. TỈNH YÊN BÁI (TOÀN BỘ CÁC XÃ/PHƯỜNG TRỌNG ĐIỂM)
  // =========================================================================
  {
    id: 'zone-ybi-01',
    zone_code: 'YBI_MCC_KHAUPHA',
    zone_name: 'Đèo Khau Phạ - Xã Cao Phạ',
    district_name: 'Huyện Mù Cang Chải',
    province_name: 'Tỉnh Yên Bái',
    region: 'BAC_BO',
    coordinates: [
      [[104.225, 21.782], [104.268, 21.805], [104.292, 21.765], [104.255, 21.745], [104.218, 21.758], [104.225, 21.782]]
    ],
    center: [21.771, 104.252],
    elevation: 1280,
    slope: 41.2,
    aspect: 'SW',
    soil_type: 'Đá phiến sét phong hóa nứt nẻ mạnh, trượt cung tròn',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-nam-kim',
    basin_name: 'Lưu vực Nậm Kim - Ngòi Thia',
    basin_area_km2: 55.4,
    channel_gradient: 19.5,
    vulnerable_population: 1120,
    critical_facilities: ['Quốc lộ 32 đoạn đèo Khau Phạ Km 265-274', 'Điểm dù lượn Khau Phạ']
  },
  {
    id: 'zone-ybi-02',
    zone_code: 'YBI_VC_SUOIGIANG',
    zone_name: 'Xã Suối Giàng & Bản Pang',
    district_name: 'Huyện Văn Chấn',
    province_name: 'Tỉnh Yên Bái',
    region: 'BAC_BO',
    coordinates: [
      [[104.535, 21.615], [104.578, 21.638], [104.602, 21.598], [104.565, 21.575], [104.528, 21.588], [104.535, 21.615]]
    ],
    center: [21.604, 104.562],
    elevation: 980,
    slope: 36.8,
    aspect: 'SE',
    soil_type: 'Đất Feralit vàng đỏ trên đá gơnai, nứt tách bề mặt lớn',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-ngoi-thia-vc',
    basin_name: 'Lưu vực Thượng nguồn Ngòi Thia - Suối Giàng',
    basin_area_km2: 38.6,
    channel_gradient: 16.4,
    vulnerable_population: 850,
    critical_facilities: ['Tỉnh lộ Suối Giàng', 'Vùng chè Shan Tuyết cổ thụ Bản Pang']
  },
  {
    id: 'zone-ybi-03',
    zone_code: 'YBI_MCC_LAPANTA',
    zone_name: 'Xã La Pán Tẩn & Chế Cu Nha',
    district_name: 'Huyện Mù Cang Chải',
    province_name: 'Tỉnh Yên Bái',
    region: 'BAC_BO',
    coordinates: [
      [[104.145, 21.825], [104.195, 21.848], [104.222, 21.808], [104.178, 21.785], [104.132, 21.798], [104.145, 21.825]]
    ],
    center: [21.814, 104.172],
    elevation: 1350,
    slope: 43.0,
    aspect: 'W',
    soil_type: 'Địa hình ruộng bậc thang dốc đứng, nguy cơ đứt gãy sạt bờ ruộng',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-mcc-ruong-bac-thang',
    basin_name: 'Lưu vực Thượng nguồn Nậm Có',
    basin_area_km2: 46.0,
    channel_gradient: 22.0,
    vulnerable_population: 1320,
    critical_facilities: ['Di tích Danh thắng Ruộng bậc thang Quốc gia', 'Trường Tiểu học La Pán Tẩn']
  },
  {
    id: 'zone-ybi-04',
    zone_code: 'YBI_MCC_HOBON',
    zone_name: 'Xã Hồ Bốn & Lao Chải',
    district_name: 'Huyện Mù Cang Chải',
    province_name: 'Tỉnh Yên Bái',
    region: 'BAC_BO',
    coordinates: [
      [[104.055, 21.905], [104.105, 21.928], [104.132, 21.888], [104.088, 21.865], [104.042, 21.878], [104.055, 21.905]]
    ],
    center: [21.894, 104.085],
    elevation: 1100,
    slope: 40.0,
    aspect: 'NW',
    soil_type: 'Đá phiến sét biến chất kết hợp lũ ống dòng suối cạn',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-suoi-ho-bon',
    basin_name: 'Lưu vực Suối Hồ Bốn - Nậm Kim',
    basin_area_km2: 51.0,
    channel_gradient: 23.5,
    vulnerable_population: 1650,
    critical_facilities: ['Quốc lộ 32 đoạn Hồ Bốn', 'Trạm Y tế xã Hồ Bốn', 'Trường Phổ thông Dân tộc Bán trú Hồ Bốn']
  },

  // =========================================================================
  // III. TỈNH HÀ GIANG
  // =========================================================================
  {
    id: 'zone-hgi-01',
    zone_code: 'HGI_HSP_TAYCONLINH',
    zone_name: 'Xã Thông Nguyên (Dãy Tây Côn Lĩnh)',
    district_name: 'Huyện Hoàng Su Phì',
    province_name: 'Tỉnh Hà Giang',
    region: 'BAC_BO',
    coordinates: [
      [[104.725, 22.615], [104.768, 22.638], [104.792, 22.598], [104.755, 22.575], [104.718, 22.588], [104.725, 22.615]]
    ],
    center: [22.604, 104.752],
    elevation: 1150,
    slope: 43.8,
    aspect: 'NW',
    soil_type: 'Khối Granit nứt nẻ sâu, đất phủ bão hòa nước nhanh',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-song-chay-hgi',
    basin_name: 'Lưu vực Sông Chảy - Hoàng Su Phì',
    basin_area_km2: 64.2,
    channel_gradient: 22.8,
    vulnerable_population: 1350,
    critical_facilities: ['Tỉnh lộ 177 Km 32', 'UBND xã Thông Nguyên', 'Trường THCS Thông Nguyên']
  },
  {
    id: 'zone-hgi-02',
    zone_code: 'HGI_XM_XINMAN',
    zone_name: 'Xã Pờ Ly Ngài & Nàn Ma',
    district_name: 'Huyện Xín Mần',
    province_name: 'Tỉnh Hà Giang',
    region: 'BAC_BO',
    coordinates: [
      [[104.485, 22.685], [104.535, 22.708], [104.562, 22.668], [104.518, 22.645], [104.472, 22.658], [104.485, 22.685]]
    ],
    center: [22.674, 104.512],
    elevation: 1420,
    slope: 42.5,
    aspect: 'N',
    soil_type: 'Đất núi cao đá vôi phong hóa, vết nứt đỉnh đồi lớn',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-song-chay-xm',
    basin_name: 'Lưu vực Thượng nguồn Sông Chảy',
    basin_area_km2: 48.0,
    channel_gradient: 21.0,
    vulnerable_population: 980,
    critical_facilities: ['Tỉnh lộ 178', 'Điểm trường Pờ Ly Ngài', 'Khu tái định cư Nàn Ma']
  },
  {
    id: 'zone-hgi-03',
    zone_code: 'HGI_MV_PAPVI',
    zone_name: 'Xã Pải Lủng & Pả Vi (Đèo Mã Pí Lèng)',
    district_name: 'Huyện Mèo Vạc',
    province_name: 'Tỉnh Hà Giang',
    region: 'BAC_BO',
    coordinates: [
      [[105.385, 23.215], [105.435, 23.238], [105.462, 23.198], [105.418, 23.175], [105.372, 23.188], [105.385, 23.215]]
    ],
    center: [23.204, 105.412],
    elevation: 1200,
    slope: 48.0,
    aspect: 'E',
    soil_type: 'Hẻm vực đá vôi Tu Sản dốc đứng, sạt lở đá lăn',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-song-nho-que',
    basin_name: 'Hẻm vực Sông Nho Quế',
    basin_area_km2: 52.0,
    channel_gradient: 26.0,
    vulnerable_population: 1420,
    critical_facilities: ['Đường Hạnh Phúc (QL4C) Đèo Mã Pí Lèng', 'Bến thuyền Sông Nho Quế']
  },

  // =========================================================================
  // IV. TỈNH CAO BẰNG
  // =========================================================================
  {
    id: 'zone-cbo-01',
    zone_code: 'CBO_NB_CATHANH',
    zone_name: 'Xóm Lũng Lỳ - Xã Ca Thành',
    district_name: 'Huyện Nguyên Bình',
    province_name: 'Tỉnh Cao Bằng',
    region: 'BAC_BO',
    coordinates: [
      [[105.785, 22.715], [105.828, 22.738], [105.852, 22.698], [105.815, 22.675], [105.778, 22.688], [105.785, 22.715]]
    ],
    center: [22.704, 105.812],
    elevation: 920,
    slope: 39.5,
    aspect: 'E',
    soil_type: 'Đá vôi xen kẹp phiến sét phong hóa mạnh, nguy cơ sập trượt karst',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-song-hien-cbo',
    basin_name: 'Lưu vực Suối Ca Thành - Sông Hiến',
    basin_area_km2: 28.5,
    channel_gradient: 17.5,
    vulnerable_population: 620,
    critical_facilities: ['Quốc lộ 34 đoạn Nguyên Bình - Bảo Lạc Km 180', 'Điểm dân cư Lũng Lỳ']
  },
  {
    id: 'zone-cbo-02',
    zone_code: 'CBO_BL_HUYGIAP',
    zone_name: 'Xã Huy Giáp & Cô Ba',
    district_name: 'Huyện Bảo Lạc',
    province_name: 'Tỉnh Cao Bằng',
    region: 'BAC_BO',
    coordinates: [
      [[105.655, 22.885], [105.705, 22.908], [105.732, 22.868], [105.688, 22.845], [105.642, 22.858], [105.655, 22.885]]
    ],
    center: [22.874, 105.682],
    elevation: 850,
    slope: 38.0,
    aspect: 'NE',
    soil_type: 'Đất sườn dốc sông Gâm, lũ quét cục bộ dồn dập',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-song-gam-cbo',
    basin_name: 'Lưu vực Sông Gâm - Bảo Lạc',
    basin_area_km2: 60.0,
    channel_gradient: 18.0,
    vulnerable_population: 1100,
    critical_facilities: ['Quốc lộ 34', 'Cầu treo Sông Gâm', 'Trường THCS Huy Giáp']
  },

  // =========================================================================
  // V. TỈNH SƠN LA
  // =========================================================================
  {
    id: 'zone-sla-01',
    zone_code: 'SLA_ML_NAMPAM',
    zone_name: 'Suối Nặm Păm - Thị trấn Ít Ong',
    district_name: 'Huyện Mường La',
    province_name: 'Tỉnh Sơn La',
    region: 'BAC_BO',
    coordinates: [
      [[103.955, 21.545], [104.005, 21.568], [104.032, 21.528], [103.988, 21.505], [103.942, 21.518], [103.955, 21.545]]
    ],
    center: [21.533, 103.985],
    elevation: 640,
    slope: 39.0,
    aspect: 'NE',
    soil_type: 'Đất sườn dốc đá biến chất, lòng suối dốc đứng tích tụ đá tảng',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-nam-pam-sla',
    basin_name: 'Lưu vực Suối Nặm Păm - Thủy điện Sơn La',
    basin_area_km2: 52.0,
    channel_gradient: 22.0,
    vulnerable_population: 1420,
    critical_facilities: ['Tỉnh lộ 109', 'Khu tái định cư Nặm Păm', 'Cầu Nặm Păm']
  },
  {
    id: 'zone-sla-02',
    zone_code: 'SLA_MC_CHIENGSON',
    zone_name: 'Xã Chiềng Sơn & Lóng Luông',
    district_name: 'Huyện Mộc Châu',
    province_name: 'Tỉnh Sơn La',
    region: 'BAC_BO',
    coordinates: [
      [[104.755, 20.785], [104.805, 20.808], [104.832, 20.768], [104.788, 20.745], [104.742, 20.758], [104.755, 20.785]]
    ],
    center: [20.774, 104.782],
    elevation: 1050,
    slope: 32.0,
    aspect: 'SE',
    soil_type: 'Cao nguyên đá vôi kết hợp đất mùn đỏ, trượt ta-luy đường',
    geology_sensitivity: 'MEDIUM',
    basin_id: 'basin-song-ma-sla',
    basin_name: 'Lưu vực Thượng nguồn Sông Mã',
    basin_area_km2: 70.0,
    channel_gradient: 14.0,
    vulnerable_population: 1950,
    critical_facilities: ['Quốc lộ 6 đoạn đèo Pha Đin / Mộc Châu', 'Cửa khẩu Lóng Sập']
  },

  // =========================================================================
  // VI. TỈNH LAI CHÂU & ĐIỆN BIÊN
  // =========================================================================
  {
    id: 'zone-lcu-01',
    zone_code: 'LCU_SH_SINHO',
    zone_name: 'Thị trấn Sìn Hồ & Đèo Tả Ngảo',
    district_name: 'Huyện Sìn Hồ',
    province_name: 'Tỉnh Lai Châu',
    region: 'BAC_BO',
    coordinates: [
      [[103.225, 22.345], [103.268, 22.368], [103.292, 22.328], [103.255, 22.305], [103.218, 22.318], [103.225, 22.345]]
    ],
    center: [22.334, 103.252],
    elevation: 1510,
    slope: 40.5,
    aspect: 'W',
    soil_type: 'Đất Feralit mùn núi cao ngậm nước, sườn dốc trượt bạt ta-luy',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-nam-mu-lcu',
    basin_name: 'Lưu vực Nậm Mạ - Sông Đà',
    basin_area_km2: 48.0,
    channel_gradient: 20.2,
    vulnerable_population: 1890,
    critical_facilities: ['Tỉnh lộ 128 đoạn Chăn Nưa - Sìn Hồ', 'Bệnh viện Đa khoa huyện Sìn Hồ']
  },
  {
    id: 'zone-dbi-01',
    zone_code: 'DBI_ML_LAYNUA',
    zone_name: 'Phường Na Lay & Xã Lay Nưa',
    district_name: 'Thị xã Mường Lay',
    province_name: 'Tỉnh Điện Biên',
    region: 'BAC_BO',
    coordinates: [
      [[103.115, 22.045], [103.165, 22.068], [103.192, 22.028], [103.148, 22.005], [103.102, 22.018], [103.115, 22.045]]
    ],
    center: [22.033, 103.145],
    elevation: 320,
    slope: 34.2,
    aspect: 'W',
    soil_type: 'Vùng trũng lòng hồ kết hợp sườn đồi dốc trượt phiến sét',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-song-da-laynua',
    basin_name: 'Lưu vực Suối Nậm Lay - Sông Đà',
    basin_area_km2: 92.0,
    channel_gradient: 14.8,
    vulnerable_population: 1750,
    critical_facilities: ['Quốc lộ 12 nối Điện Biên - Lai Châu', 'Cầu Cơ Khí Mường Lay', 'Bến đò Lay Nưa']
  },
  {
    id: 'zone-dbi-02',
    zone_code: 'DBI_MP_MUONGPON',
    zone_name: 'Xã Mường Pồn & Hua Thanh',
    district_name: 'Huyện Điện Biên',
    province_name: 'Tỉnh Điện Biên',
    region: 'BAC_BO',
    coordinates: [
      [[102.985, 21.585], [103.035, 21.608], [103.062, 21.568], [103.018, 21.545], [102.972, 21.558], [102.985, 21.585]]
    ],
    center: [21.574, 103.012],
    elevation: 580,
    slope: 41.0,
    aspect: 'N',
    soil_type: 'Lũ bùn đá nghẽn dòng suối Nậm Pồn, thềm đất bở rời',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-nam-rom-db',
    basin_name: 'Lưu vực Nậm Pồn - Sông Nậm Rốm',
    basin_area_km2: 44.0,
    channel_gradient: 24.0,
    vulnerable_population: 1250,
    critical_facilities: ['Quốc lộ 12 đoạn Mường Pồn Km 170-175', 'Trường Tiểu học Mường Pồn']
  },

  // =========================================================================
  // VII. TỈNH HÒA BÌNH & PHÚ THỌ & QUẢNG NINH
  // =========================================================================
  {
    id: 'zone-hbh-01',
    zone_code: 'HBH_MC_THUNGKHE',
    zone_name: 'Đèo Thung Khe - Xã Tòng Đậu',
    district_name: 'Huyện Mai Châu',
    province_name: 'Tỉnh Hòa Bình',
    region: 'BAC_BO',
    coordinates: [
      [[105.115, 20.685], [105.165, 20.708], [105.192, 20.668], [105.148, 20.645], [105.102, 20.658], [105.115, 20.685]]
    ],
    center: [20.674, 105.142],
    elevation: 820,
    slope: 38.0,
    aspect: 'E',
    soil_type: 'Sườn vách đá vôi nứt nẻ, đá tảng lăn ta-luy Quốc lộ 6',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-song-da-hbh',
    basin_name: 'Lưu vực Thượng nguồn Sông Đà - Mai Châu',
    basin_area_km2: 58.0,
    channel_gradient: 16.0,
    vulnerable_population: 1680,
    critical_facilities: ['Quốc lộ 6 đoạn Đèo Thung Khe (Đèo Đá Trắng)', 'Trạm biến áp 110kV Mai Châu']
  },
  // =========================================================================
  // VII. TỈNH PHÚ THỌ (ĐẦY ĐỦ CÁC XÃ/PHƯỜNG THEO CHÍNH QUYỀN ĐỊA PHƯƠNG)
  // =========================================================================
  {
    id: 'zone-pto-01',
    zone_code: 'PTO_TS_XUANSON',
    zone_name: 'Xã Xuân Sơn (VQG Xuân Sơn - Bản Cỏi - Hang Lạng)',
    district_name: 'Huyện Tân Sơn',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[104.912, 21.135], [104.965, 21.158], [104.992, 21.118], [104.958, 21.085], [104.908, 21.098], [104.912, 21.135]]
    ],
    center: [21.120, 104.940],
    elevation: 520,
    slope: 36.5,
    aspect: 'S',
    soil_type: 'Đất Feralit mùn núi cao trên đá vôi karst nứt nẻ, hang ngầm dâng lũ tức thời',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-suoi-lap-pto',
    basin_name: 'Lưu vực Suối Lấp - Thượng nguồn Sông Bùi',
    basin_area_km2: 67.5,
    channel_gradient: 22.0,
    vulnerable_population: 2900,
    critical_facilities: ['Trụ sở Vườn Quốc gia Xuân Sơn', 'Bản Cỏi', 'Điểm trường Mầm non Xuân Sơn', 'Cầu ngầm Lạng']
  },
  {
    id: 'zone-pto-02',
    zone_code: 'PTO_TS_THUCUC',
    zone_name: 'Xã Thu Cúc (Đèo Cón - Ngã Ba QL32 & QL32B)',
    district_name: 'Huyện Tân Sơn',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[104.852, 21.245], [104.915, 21.268], [104.942, 21.228], [104.898, 21.195], [104.848, 21.208], [104.852, 21.245]]
    ],
    center: [21.220, 104.880],
    elevation: 410,
    slope: 32.0,
    aspect: 'NW',
    soil_type: 'Khối magma xâm nhập phong hóa sét sỏi, nguy cơ trượt ta-luy đèo Cón',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-song-bua-thucuc',
    basin_name: 'Thượng nguồn Sông Bứa - Ngã ba Thu Cúc',
    basin_area_km2: 98.2,
    channel_gradient: 18.5,
    vulnerable_population: 11200,
    critical_facilities: ['Đèo Cón QL32 Km 182-188', 'Ngã ba QL32B đi Phù Yên Sơn La', 'Trạm Y tế xã Thu Cúc']
  },
  {
    id: 'zone-pto-03',
    zone_code: 'PTO_TS_LONGCOC',
    zone_name: 'Xã Long Cốc & Văn Luông (Đồi Chè Long Cốc)',
    district_name: 'Huyện Tân Sơn',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[105.012, 21.215], [105.065, 21.238], [105.092, 21.198], [105.048, 21.165], [104.998, 21.178], [105.012, 21.215]]
    ],
    center: [21.190, 105.040],
    elevation: 340,
    slope: 28.0,
    aspect: 'E',
    soil_type: 'Đồi bát úp đất đỏ vàng, tầng canh tác chè dễ trượt bạt khi bão hòa nước',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-suoi-longcoc',
    basin_name: 'Lưu vực Suối Long Cốc - Sông Bứa',
    basin_area_km2: 45.0,
    channel_gradient: 14.2,
    vulnerable_population: 7800,
    critical_facilities: ['Tuyến đường du lịch Đồi chè Long Cốc', 'UBND xã Long Cốc', 'Trường Tiểu học Long Cốc']
  },
  {
    id: 'zone-pto-04',
    zone_code: 'PTO_TS_XUANDAI',
    zone_name: 'Xã Xuân Đài & Xã Kim Thượng',
    district_name: 'Huyện Tân Sơn',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[104.952, 21.185], [105.005, 21.208], [105.032, 21.168], [104.988, 21.135], [104.938, 21.148], [104.952, 21.185]]
    ],
    center: [21.160, 104.980],
    elevation: 380,
    slope: 33.0,
    aspect: 'SE',
    soil_type: 'Đá biến chất schist và đá vôi xen kẽ, dòng suối dốc tụ thủy',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-suoi-benthan',
    basin_name: 'Lưu vực Suối Bến Thân - Xuân Đài',
    basin_area_km2: 56.0,
    channel_gradient: 19.0,
    vulnerable_population: 8500,
    critical_facilities: ['Tỉnh lộ 316 đoạn Tân Sơn - Thanh Sơn', 'Cầu Suối Bến Thân', 'Trạm Y tế xã Kim Thượng']
  },
  {
    id: 'zone-pto-05',
    zone_code: 'PTO_TS_VOMIEU',
    zone_name: 'Xã Võ Miếu & Tân Lập (Sườn Đồi Sông Bứa)',
    district_name: 'Huyện Thanh Sơn',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[105.152, 21.165], [105.215, 21.188], [105.242, 21.148], [105.198, 21.115], [105.138, 21.128], [105.152, 21.165]]
    ],
    center: [21.140, 105.180],
    elevation: 180,
    slope: 26.5,
    aspect: 'NE',
    soil_type: 'Đất Feralit đồi núi thấp phong hóa sâu, sạt lở ven sông Bứa',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-song-bua-vomieu',
    basin_name: 'Hạ lưu Sông Bứa - Võ Miếu',
    basin_area_km2: 82.0,
    channel_gradient: 12.0,
    vulnerable_population: 13500,
    critical_facilities: ['Đường liên xã Võ Miếu - Cự Thắng', 'Cầu tràn Tân Lập', 'Trường THCS Võ Miếu']
  },
  {
    id: 'zone-pto-06',
    zone_code: 'PTO_TS_KHACUU',
    zone_name: 'Xã Khả Cửu & Thượng Cửu',
    district_name: 'Huyện Thanh Sơn',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[105.092, 21.075], [105.165, 21.098], [105.192, 21.058], [105.148, 21.025], [105.088, 21.038], [105.092, 21.075]]
    ],
    center: [21.060, 105.140],
    elevation: 290,
    slope: 29.0,
    aspect: 'E',
    soil_type: 'Thung lũng lòng chảo kẹp giữa dãy núi cao, lũ quét nghẽn suối dồn dập',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-suoi-kha-thanhson',
    basin_name: 'Lưu vực Suối Khả - Suối Khoang',
    basin_area_km2: 64.0,
    channel_gradient: 21.5,
    vulnerable_population: 8900,
    critical_facilities: ['Tuyến đường liên thôn Khe Đương - Khả Cửu', 'Cầu tràn Thượng Cửu']
  },
  {
    id: 'zone-pto-07',
    zone_code: 'PTO_TS_TT_THANHSON',
    zone_name: 'Thị trấn Thanh Sơn & Xã Cự Thắng - Hương Cần',
    district_name: 'Huyện Thanh Sơn',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[105.232, 21.235], [105.295, 21.258], [105.322, 21.218], [105.278, 21.185], [105.218, 21.198], [105.232, 21.235]]
    ],
    center: [21.210, 105.270],
    elevation: 45,
    slope: 12.0,
    aspect: 'SE',
    soil_type: 'Vùng trũng phù sa ven sông Vàng và sông Bứa, ngập lụt kết hợp xói lở bờ sông',
    geology_sensitivity: 'MEDIUM',
    basin_id: 'basin-song-vang-ts',
    basin_name: 'Lưu vực Sông Vàng - Thanh Sơn',
    basin_area_km2: 110.0,
    channel_gradient: 6.5,
    vulnerable_population: 24500,
    critical_facilities: ['Quốc lộ 32 đoạn qua TT Thanh Sơn', 'Bệnh viện Đa khoa Thanh Sơn', 'Cầu Vàng']
  },
  {
    id: 'zone-pto-08',
    zone_code: 'PTO_YL_TRUNGSON',
    zone_name: 'Xã Trung Sơn & Lòng Hồ Thủy Lợi Ngòi Giành',
    district_name: 'Huyện Yên Lập',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[104.982, 21.335], [105.045, 21.358], [105.072, 21.318], [105.028, 21.285], [104.968, 21.298], [104.982, 21.335]]
    ],
    center: [21.310, 105.020],
    elevation: 290,
    slope: 31.0,
    aspect: 'E',
    soil_type: 'Sườn núi Tháp Quả đá phiến biến chất ngậm nước, sạt lở ven lòng hồ',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-ngoi-gianh-yl',
    basin_name: 'Lưu vực Hồ Ngòi Giành - Yên Lập',
    basin_area_km2: 78.4,
    channel_gradient: 18.0,
    vulnerable_population: 6800,
    critical_facilities: ['Đập Thủy lợi Hồ Ngòi Giành', 'Tuyến đường tuần tra hồ', 'UBND xã Trung Sơn']
  },
  {
    id: 'zone-pto-09',
    zone_code: 'PTO_YL_TT_YENLAP',
    zone_name: 'Thị trấn Yên Lập & Xã Mỹ Lung - Phúc Khánh',
    district_name: 'Huyện Yên Lập',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[105.092, 21.375], [105.165, 21.398], [105.192, 21.358], [105.148, 21.325], [105.078, 21.338], [105.092, 21.375]]
    ],
    center: [21.360, 105.150],
    elevation: 95,
    slope: 19.0,
    aspect: 'SE',
    soil_type: 'Đất Feralit đồi núi trung bình, nguy cơ sạt trượt ta-luy Tỉnh lộ 313',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-ngoi-me-yl',
    basin_name: 'Lưu vực Ngòi Me - Hồ Ly',
    basin_area_km2: 85.0,
    channel_gradient: 11.0,
    vulnerable_population: 18600,
    critical_facilities: ['Tỉnh lộ 313C', 'Trung tâm Y tế huyện Yên Lập', 'Hồ Ly Yên Lập']
  },
  {
    id: 'zone-pto-10',
    zone_code: 'PTO_VT_DENHUNG',
    zone_name: 'Khu Di Tích Đền Hùng (Xã Hy Cương & Kim Đức - Chu Hóa)',
    district_name: 'Thành phố Việt Trì',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[105.322, 21.385], [105.375, 21.408], [105.398, 21.368], [105.358, 21.335], [105.308, 21.348], [105.322, 21.385]]
    ],
    center: [21.365, 105.345],
    elevation: 110,
    slope: 16.5,
    aspect: 'E',
    soil_type: 'Đồi bát úp Đền Hùng đất Feralit nâu vàng, rừng quốc gia bảo tồn',
    geology_sensitivity: 'MEDIUM',
    basin_id: 'basin-den-hung-vt',
    basin_name: 'Lưu vực Ngòi Trang - Khu Di tích Đền Hùng',
    basin_area_km2: 32.5,
    channel_gradient: 7.5,
    vulnerable_population: 24300,
    critical_facilities: ['Khu Di tích Lịch sử Quốc gia Đặc biệt Đền Hùng', 'Bảo tàng Hùng Vương', 'Quốc lộ 32C']
  },
  {
    id: 'zone-pto-11',
    zone_code: 'PTO_VT_DOTHITRUNGTHAM',
    zone_name: 'Trung Tâm TP Việt Trì (Phường Gia Cẩm, Tiên Cát, Nông Trang, Tân Dân, Vân Phú)',
    district_name: 'Thành phố Việt Trì',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[105.362, 21.345], [105.425, 21.368], [105.448, 21.318], [105.398, 21.295], [105.348, 21.308], [105.362, 21.345]]
    ],
    center: [21.325, 105.402],
    elevation: 20,
    slope: 3.5,
    aspect: 'SE',
    soil_type: 'Đồng bằng phù sa cổ sông Lô - sông Hồng, tiêu thoát nước đô thị',
    geology_sensitivity: 'LOW',
    basin_id: 'basin-song-lo-viettri',
    basin_name: 'Hạ lưu Sông Lô - Công viên Văn Lang',
    basin_area_km2: 45.0,
    channel_gradient: 1.8,
    vulnerable_population: 98000,
    critical_facilities: ['Công viên Văn Lang', 'UBND Tỉnh Phú Thọ', 'Bệnh viện Đa khoa Tỉnh Phú Thọ', 'Cầu Việt Trì']
  },
  {
    id: 'zone-pto-12',
    zone_code: 'PTO_VT_BACHAC',
    zone_name: 'Phường Bạch Hạc & Bến Gót (Ngã Ba Hạc - Hợp Lưu 3 Dòng Sông)',
    district_name: 'Thành phố Việt Trì',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[105.412, 21.315], [105.465, 21.338], [105.478, 21.288], [105.428, 21.265], [105.398, 21.278], [105.412, 21.315]]
    ],
    center: [21.298, 105.441],
    elevation: 15,
    slope: 1.5,
    aspect: 'S',
    soil_type: 'Bãi bồi ngã ba sông giao thoa Sông Lô, Sông Hồng và Sông Đà, nguy cơ lũ sông lớn',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-nga-ba-hac',
    basin_name: 'Ngã ba Sông Hạc - Điểm hợp lưu Sông Hồng, Sông Lô, Sông Đà',
    basin_area_km2: 120.0,
    channel_gradient: 1.2,
    vulnerable_population: 24000,
    critical_facilities: ['Cảng sông Bạch Hạc - Bến Gót', 'Đền Tam Giang', 'Cầu Hạc Trì (QL2)', 'Đê Tả Thao']
  },
  {
    id: 'zone-pto-13',
    zone_code: 'PTO_TX_PHUTHO',
    zone_name: 'Thị Xã Phú Thọ (Phường Âu Cơ, Phong Châu, Hùng Vương, Phú Hộ)',
    district_name: 'Thị xã Phú Thọ',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[105.182, 21.425], [105.265, 21.458], [105.288, 21.398], [105.228, 21.375], [105.168, 21.388], [105.182, 21.425]]
    ],
    center: [21.402, 105.221],
    elevation: 25,
    slope: 4.5,
    aspect: 'E',
    soil_type: 'Đồi lượn sóng kết hợp ven Sông Thao, xói lở bãi bồi ven sông',
    geology_sensitivity: 'MEDIUM',
    basin_id: 'basin-tx-phutho',
    basin_name: 'Lưu vực Sông Thao - Thị xã Phú Thọ',
    basin_area_km2: 64.5,
    channel_gradient: 3.2,
    vulnerable_population: 68000,
    critical_facilities: ['Đền Mẫu Âu Cơ', 'Cầu Ngọc Tháp', 'Viện Nghiên cứu Chè Phú Hộ', 'Bệnh viện TX Phú Thọ']
  },
  {
    id: 'zone-pto-14',
    zone_code: 'PTO_TN_CAUPHONGCHAU',
    zone_name: 'Xã Vạn Xuân & Bắc Sơn (Khu Vực Cầu Phong Châu - Sông Thao)',
    district_name: 'Huyện Tam Nông',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[105.212, 21.335], [105.285, 21.358], [105.308, 21.308], [105.258, 21.285], [105.198, 21.298], [105.212, 21.335]]
    ],
    center: [21.320, 105.250],
    elevation: 24,
    slope: 4.0,
    aspect: 'SE',
    soil_type: 'Vùng bãi bồi phù sa sông Thao, lòng sông biến đổi sâu do dòng chảy lũ xiết',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-phongchau-tamnong',
    basin_name: 'Lưu vực Sông Thao - Cầu Phong Châu (QL32C)',
    basin_area_km2: 95.0,
    channel_gradient: 2.8,
    vulnerable_population: 32000,
    critical_facilities: ['Vị trí Cầu Phong Châu huyết mạch (QL32C)', 'Bến phà Vạn Xuân', 'Trạm biến áp 110kV Tam Nông', 'Đê tả hữu Sông Thao']
  },
  {
    id: 'zone-pto-15',
    zone_code: 'PTO_DH_CHIDAM',
    zone_name: 'Xã Chí Đám & Chân Mộng (Hợp Lưu Sông Lô - Sông Chảy)',
    district_name: 'Huyện Đoan Hùng',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[105.162, 21.615], [105.245, 21.648], [105.268, 21.588], [105.208, 21.555], [105.148, 21.568], [105.162, 21.615]]
    ],
    center: [21.590, 105.200],
    elevation: 65,
    slope: 14.5,
    aspect: 'E',
    soil_type: 'Đồi gò sỏi cuội bãi bồi ngã ba Sông Lô và Sông Chảy, ngập lũ & xói mòn',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-doanhung-songlo',
    basin_name: 'Ngã ba Sông Lô - Sông Chảy Đoan Hùng',
    basin_area_km2: 130.0,
    channel_gradient: 5.5,
    vulnerable_population: 26000,
    critical_facilities: ['Cầu Đoan Hùng QL2', 'Tuyến cao tốc Tuyên Quang - Phú Thọ', 'Đập Thủy điện Sông Chảy']
  },
  {
    id: 'zone-pto-16',
    zone_code: 'PTO_HH_AOCHAU',
    zone_name: 'Xã Văn Lang & Đại Phạm (Đầm Ao Châu & Đan Thượng)',
    district_name: 'Huyện Hạ Hòa',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[104.942, 21.645], [105.025, 21.678], [105.058, 21.618], [104.998, 21.585], [104.928, 21.598], [104.942, 21.645]]
    ],
    center: [21.620, 104.980],
    elevation: 60,
    slope: 15.0,
    aspect: 'SE',
    soil_type: 'Đầm Ao Châu hồ tự nhiên 99 ngách nước, vùng trũng ven sông Thao tiếp giáp Yên Bái',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-ao-chau-hahoa',
    basin_name: 'Lưu vực Đầm Ao Châu - Thượng Sông Thao',
    basin_area_km2: 115.0,
    channel_gradient: 4.8,
    vulnerable_population: 21500,
    critical_facilities: ['Đầm sinh thái Ao Châu', 'Đền Mẫu Âu Cơ Hiền Lương', 'Quốc lộ 32C đoạn Hạ Hòa', 'Ga xe lửa Hạ Hòa']
  },
  {
    id: 'zone-pto-17',
    zone_code: 'PTO_CK_DIEULUONG',
    zone_name: 'Xã Điêu Lương & Đồng Lương - TT Cẩm Khê',
    district_name: 'Huyện Cẩm Khê',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[105.042, 21.445], [105.125, 21.478], [105.158, 21.418], [105.098, 21.385], [105.028, 21.398], [105.042, 21.445]]
    ],
    center: [21.430, 105.080],
    elevation: 48,
    slope: 9.5,
    aspect: 'E',
    soil_type: 'Vùng đồi thấp ven sông Thao, hệ thống tiêu úng đồng chiêm trũng',
    geology_sensitivity: 'MEDIUM',
    basin_id: 'basin-camkhe-ngoi-me',
    basin_name: 'Lưu vực Ngòi Me - Cẩm Khê',
    basin_area_km2: 90.0,
    channel_gradient: 3.5,
    vulnerable_population: 29000,
    critical_facilities: ['Hồ chứa Tuy Lộc', 'Trung tâm Y tế Cẩm Khê', 'Đê Sông Thao Cẩm Khê']
  },
  {
    id: 'zone-pto-18',
    zone_code: 'PTO_LT_HUNGSON',
    zone_name: 'Thị trấn Hùng Sơn & Lâm Thao - Xã Bản Nguyên',
    district_name: 'Huyện Lâm Thao',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[105.282, 21.355], [105.355, 21.378], [105.378, 21.328], [105.328, 21.305], [105.268, 21.318], [105.282, 21.355]]
    ],
    center: [21.340, 105.310],
    elevation: 26,
    slope: 3.0,
    aspect: 'S',
    soil_type: 'Đồng bằng phù sa châu thổ tiếp giáp chân núi Hùng, trọng điểm nông nghiệp lúa nước',
    geology_sensitivity: 'LOW',
    basin_id: 'basin-lamthao-songthao',
    basin_name: 'Hạ lưu Sông Thao - Lâm Thao',
    basin_area_km2: 55.0,
    channel_gradient: 1.5,
    vulnerable_population: 48000,
    critical_facilities: ['Khu công nghiệp Supe Phốt phát Lâm Thao', 'Đê Tả Thao Lâm Thao', 'Trường THPT Phong Châu']
  },
  {
    id: 'zone-pto-19',
    zone_code: 'PTO_PN_PHONGCHAU',
    zone_name: 'Thị trấn Phong Châu & Xã Tiên Du - Phú Nham',
    district_name: 'Huyện Phù Ninh',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[105.282, 21.465], [105.365, 21.498], [105.388, 21.438], [105.328, 21.405], [105.268, 21.418], [105.282, 21.465]]
    ],
    center: [21.450, 105.330],
    elevation: 35,
    slope: 6.0,
    aspect: 'E',
    soil_type: 'Đồi gò bát úp ven Sông Lô, nguy cơ xói lở chân bờ sông mùa xả lũ thủy điện Tuyên Quang',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-phuninh-songlo',
    basin_name: 'Lưu vực Sông Lô - Phù Ninh',
    basin_area_km2: 72.0,
    channel_gradient: 2.5,
    vulnerable_population: 36000,
    critical_facilities: ['Nhà máy Giấy Bãi Bằng', 'Cụm công nghiệp Tử Đà', 'Cảng sông An Đạo', 'Quốc lộ 2']
  },
  {
    id: 'zone-pto-20',
    zone_code: 'PTO_TT_BAOYEN',
    zone_name: 'Thị trấn Thanh Thủy & Xã Bảo Yên - Đồng Trung (Hạ Lưu Sông Đà)',
    district_name: 'Huyện Thanh Thủy',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[105.272, 21.165], [105.345, 21.188], [105.368, 21.128], [105.318, 21.105], [105.258, 21.118], [105.272, 21.165]]
    ],
    center: [21.140, 105.310],
    elevation: 22,
    slope: 4.5,
    aspect: 'E',
    soil_type: 'Bãi bồi phù sa và mạch khoáng ngầm Sông Đà, nguy cơ lũ dâng khi Thủy điện Hòa Bình mở cửa xả đáy',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-thanhthuy-songda',
    basin_name: 'Hạ lưu Sông Đà - Khu suối khoáng nóng Thanh Thủy',
    basin_area_km2: 68.0,
    channel_gradient: 1.8,
    vulnerable_population: 34000,
    critical_facilities: ['Cầu Đồng Quang nối Ba Vì Hà Nội', 'Khu Du lịch Nghỉ dưỡng Khoáng nóng Thanh Thủy', 'Đê Sông Đà']
  },
  {
    id: 'zone-pto-21',
    zone_code: 'PTO_TB_THANHBA',
    zone_name: 'Thị trấn Thanh Ba & Xã Đông Thành - Hoàng Cương',
    district_name: 'Huyện Thanh Ba',
    province_name: 'Tỉnh Phú Thọ',
    region: 'BAC_BO',
    coordinates: [
      [[105.142, 21.515], [105.215, 21.538], [105.238, 21.488], [105.188, 21.455], [105.128, 21.468], [105.142, 21.515]]
    ],
    center: [21.490, 105.180],
    elevation: 42,
    slope: 8.0,
    aspect: 'E',
    soil_type: 'Đồi gò thấp trung du xen thung lũng lúa và hồ đầm tự nhiên',
    geology_sensitivity: 'MEDIUM',
    basin_id: 'basin-thanhba-ngoi-gianh',
    basin_name: 'Lưu vực Ngòi Giành - Thanh Ba',
    basin_area_km2: 75.0,
    channel_gradient: 4.0,
    vulnerable_population: 31000,
    critical_facilities: ['Nhà máy Xi măng Hữu Nghị Thanh Ba', 'Tỉnh lộ 314', 'Hồ Láng Én', 'Trung tâm Y tế huyện Thanh Ba']
  },
  {
    id: 'zone-qnh-01',
    zone_code: 'QNH_CP_MONGDUONG',
    zone_name: 'Phường Mông Dương & Cao Thắng',
    district_name: 'Thành phố Cẩm Phả / TP Hạ Long',
    province_name: 'Tỉnh Quảng Ninh',
    region: 'BAC_BO',
    coordinates: [
      [[107.315, 21.045], [107.365, 21.068], [107.392, 21.028], [107.348, 21.005], [107.302, 21.018], [107.315, 21.045]]
    ],
    center: [21.034, 107.342],
    elevation: 120,
    slope: 28.0,
    aspect: 'SE',
    soil_type: 'Bãi thải mỏ than đất đá bở rời ngậm nước, sạt lở bùn than',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-song-dien-vong',
    basin_name: 'Lưu vực Sông Diễn Vọng - Vịnh Bái Tử Long',
    basin_area_km2: 65.0,
    channel_gradient: 11.0,
    vulnerable_population: 3400,
    critical_facilities: ['Quốc lộ 18A đoạn Cẩm Phả - Mông Dương', 'Nhà máy Nhiệt điện Mông Dương', 'Tuyến đường sắt mỏ than']
  },

  // =========================================================================
  // VIII. KHU VỰC MIỀN TRUNG (THỪA THIÊN HUẾ, QUẢNG NAM, QUẢNG TRỊ, NGHỆ AN)
  // =========================================================================
  {
    id: 'zone-hue-01',
    zone_code: 'HUE_PD_RAOTRANG',
    zone_name: 'Lưu vực Rào Trăng 3 - Xã Phong Xuân',
    district_name: 'Huyện Phong Điền',
    province_name: 'Tỉnh Thừa Thiên Huế',
    region: 'TRUNG_BO',
    coordinates: [
      [[107.215, 16.385], [107.275, 16.415], [107.312, 16.368], [107.265, 16.335], [107.202, 16.352], [107.215, 16.385]]
    ],
    center: [16.375, 107.255],
    elevation: 480,
    slope: 41.5,
    aspect: 'E',
    soil_type: 'Khối Granit nứt nẻ mạnh, tầng phủ phong hóa sét bở bão hòa nước bão',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-song-bo-raotrang',
    basin_name: 'Lưu vực Sông Rào Trăng - Thượng nguồn Sông Bồ',
    basin_area_km2: 44.5,
    channel_gradient: 23.4,
    vulnerable_population: 450,
    critical_facilities: ['Nhà máy Thủy điện Rào Trăng 3 & 4', 'Tuyến đường 71 nối TL11B', 'Trạm kiểm lâm Tiểu khu 67']
  },
  {
    id: 'zone-hue-02',
    zone_code: 'HUE_PL_HAIVAN',
    zone_name: 'Đèo Hải Vân - Bắc Hải Vân',
    district_name: 'Huyện Phú Lộc',
    province_name: 'Tỉnh Thừa Thiên Huế',
    region: 'TRUNG_BO',
    coordinates: [
      [[108.085, 16.215], [108.135, 16.238], [108.162, 16.198], [108.118, 16.175], [108.072, 16.188], [108.085, 16.215]]
    ],
    center: [16.204, 108.112],
    elevation: 490,
    slope: 38.0,
    aspect: 'NE',
    soil_type: 'Sườn đá Granit biển dốc đứng, nguy cơ sạt ta-luy đường đèo',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-langco-haivan',
    basin_name: 'Lưu vực Ven Biển Lăng Cô - Hải Vân',
    basin_area_km2: 26.0,
    channel_gradient: 19.5,
    vulnerable_population: 890,
    critical_facilities: ['Quốc lộ 1A đường đèo Hải Vân', 'Đường sắt Bắc Nam ga Hải Vân Bắc', 'Hầm đường bộ Hải Vân 1 & 2']
  },
  {
    id: 'zone-qnm-01',
    zone_code: 'QNM_NTM_TRALENG',
    zone_name: 'Xã Trà Leng (Nóc Ông Đề)',
    district_name: 'Huyện Nam Trà My',
    province_name: 'Tỉnh Quảng Nam',
    region: 'TRUNG_BO',
    coordinates: [
      [[108.035, 15.185], [108.095, 15.215], [108.132, 15.168], [108.085, 15.135], [108.022, 15.152], [108.035, 15.185]]
    ],
    center: [15.175, 108.075],
    elevation: 850,
    slope: 44.0,
    aspect: 'NE',
    soil_type: 'Đất Feralit đỏ vàng trên đá biến chất dốc đứng, nứt tách sườn đỉnh núi',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-song-leng-vuagia',
    basin_name: 'Lưu vực Sông Leng - Thượng nguồn Sông Thu Bồn',
    basin_area_km2: 58.0,
    channel_gradient: 25.0,
    vulnerable_population: 980,
    critical_facilities: ['Quốc lộ 40B nối Kon Tum - Quảng Nam', 'Khu tái định cư Bằng La', 'Trường PTDTBT TH Trà Leng']
  },
  {
    id: 'zone-qnm-02',
    zone_code: 'QNM_PS_PHUOCTHANH',
    zone_name: 'Xã Phước Thành & Phước Lộc',
    district_name: 'Huyện Phước Sơn',
    province_name: 'Tỉnh Quảng Nam',
    region: 'TRUNG_BO',
    coordinates: [
      [[107.825, 15.345], [107.875, 15.368], [107.902, 15.328], [107.858, 15.305], [107.812, 15.318], [107.825, 15.345]]
    ],
    center: [15.334, 107.852],
    elevation: 790,
    slope: 40.2,
    aspect: 'SW',
    soil_type: 'Khối biến chất xen đá phiến sạt trượt cô lập giao thông',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-song-thanh-ps',
    basin_name: 'Lưu vực Sông Thanh - Phước Sơn',
    basin_area_km2: 62.0,
    channel_gradient: 21.8,
    vulnerable_population: 1250,
    critical_facilities: ['Đường Hồ Chí Minh nhánh Tây Km 420-435', 'UBND xã Phước Thành', 'Trạm y tế xã Phước Thành']
  },
  {
    id: 'zone-qti-01',
    zone_code: 'QTI_HH_HUONGPHUNG',
    zone_name: 'Xã Hướng Phùng (Đèo Sa Mù)',
    district_name: 'Huyện Hướng Hóa',
    province_name: 'Tỉnh Quảng Trị',
    region: 'TRUNG_BO',
    coordinates: [
      [[106.585, 16.715], [106.635, 16.738], [106.662, 16.698], [106.618, 16.675], [106.572, 16.688], [106.585, 16.715]]
    ],
    center: [16.704, 106.612],
    elevation: 720,
    slope: 37.5,
    aspect: 'NW',
    soil_type: 'Đất đỏ Bazan xen đá phun trào bở rời nứt toác',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-se-bang-hien',
    basin_name: 'Lưu vực Sê Băng Hiêng - Hướng Hóa',
    basin_area_km2: 54.0,
    channel_gradient: 18.5,
    vulnerable_population: 1100,
    critical_facilities: ['Đường Hồ Chí Minh Tây đoạn Khe Sanh - Hướng Lập', 'Doanh trại Đoàn KTQP 337']
  },
  {
    id: 'zone-nan-01',
    zone_code: 'NAN_KS_TACA',
    zone_name: 'Xã Tà Cạ & TT Mường Xén',
    district_name: 'Huyện Kỳ Sơn',
    province_name: 'Tỉnh Nghệ An',
    region: 'TRUNG_BO',
    coordinates: [
      [[104.135, 19.415], [104.185, 19.438], [104.212, 19.398], [104.168, 19.375], [104.122, 19.388], [104.135, 19.415]]
    ],
    center: [19.404, 104.162],
    elevation: 460,
    slope: 42.0,
    aspect: 'E',
    soil_type: 'Đá cát kết phiến sét sườn dốc gom dòng lũ ống cuồn cuộn đất đá',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-nam-mo-ky-son',
    basin_name: 'Lưu vực Suối Huồi Giảng - Sông Nậm Mộ',
    basin_area_km2: 68.0,
    channel_gradient: 26.0,
    vulnerable_population: 2300,
    critical_facilities: ['Quốc lộ 7A qua Thị trấn Mường Xén', 'Trường THPT Kỳ Sơn', 'Cầu treo Bản Hòa Sơn']
  },
  {
    id: 'zone-knh-01',
    zone_code: 'KNH_KV_KHANHLE',
    zone_name: 'Đèo Khánh Lê (QL27C Khánh Vĩnh)',
    district_name: 'Huyện Khánh Vĩnh',
    province_name: 'Tỉnh Khánh Hòa',
    region: 'TRUNG_BO',
    coordinates: [
      [[108.755, 12.285], [108.805, 12.308], [108.832, 12.268], [108.788, 12.245], [108.742, 12.258], [108.755, 12.285]]
    ],
    center: [12.274, 108.782],
    elevation: 1100,
    slope: 45.0,
    aspect: 'E',
    soil_type: 'Khối Granit vách đứng, sạt trượt đá tảng ta-luy âm dương',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-song-cai-nhatrang',
    basin_name: 'Lưu vực Thượng nguồn Sông Cái Nha Trang',
    basin_area_km2: 36.0,
    channel_gradient: 28.0,
    vulnerable_population: 420,
    critical_facilities: ['Quốc lộ 27C nối Nha Trang - Đà Lạt Km 56-65', 'Trạm biến áp truyền tải 220kV']
  },

  // =========================================================================
  // IX. KHU VỰC TÂY NGUYÊN (LÂM ĐỒNG, KON TUM, ĐẮK NÔNG, GIA LAI)
  // =========================================================================
  {
    id: 'zone-ldo-01',
    zone_code: 'LDO_BL_BAOLOC',
    zone_name: 'Đèo Bảo Lộc (Xã Đại Lào)',
    district_name: 'Thành phố Bảo Lộc',
    province_name: 'Tỉnh Lâm Đồng',
    region: 'TAY_NGUYEN',
    coordinates: [
      [[107.725, 11.485], [107.775, 11.508], [107.802, 11.468], [107.758, 11.445], [107.712, 11.458], [107.725, 11.485]]
    ],
    center: [11.474, 107.752],
    elevation: 750,
    slope: 39.5,
    aspect: 'S',
    soil_type: 'Đất Bazan thoái hóa dốc đứng ngậm nước nặng, trượt lở ta-luy dương',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-song-dong-nai-bl',
    basin_name: 'Lưu vực Thượng nguồn Sông Đa Huoai - Sông Đồng Nai',
    basin_area_km2: 42.0,
    channel_gradient: 20.5,
    vulnerable_population: 860,
    critical_facilities: ['Quốc lộ 20 đoạn đèo Bảo Lộc Km 98-108', 'Trạm CSGT Madagui đèo Bảo Lộc']
  },
  {
    id: 'zone-ldo-02',
    zone_code: 'LDO_DL_PRENN',
    zone_name: 'Đèo Prenn & Phường 3 TP Đà Lạt',
    district_name: 'Thành phố Đà Lạt',
    province_name: 'Tỉnh Lâm Đồng',
    region: 'TAY_NGUYEN',
    coordinates: [
      [[108.425, 11.905], [108.475, 11.928], [108.502, 11.888], [108.458, 11.865], [108.412, 11.878], [108.425, 11.905]]
    ],
    center: [11.894, 108.452],
    elevation: 1450,
    slope: 36.0,
    aspect: 'SE',
    soil_type: 'Sườn đồi đất đỏ sét biến chất kết hợp kè bê tông tải trọng cao',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-suoi-camly',
    basin_name: 'Lưu vực Suối Cam Ly - Hồ Tuyền Lâm',
    basin_area_km2: 34.0,
    channel_gradient: 17.0,
    vulnerable_population: 2800,
    critical_facilities: ['Quốc lộ 20 cửa ngõ TP Đà Lạt', 'Đoạn đường đèo Mimosa', 'Khu dân cư đường Hoàng Hoa Thám']
  },
  {
    id: 'zone-ktm-01',
    zone_code: 'KTM_DG_LOXO',
    zone_name: 'Đèo Lò Xo (Xã Đắk Man)',
    district_name: 'Huyện Đắk Glei',
    province_name: 'Tỉnh Kon Tum',
    region: 'TAY_NGUYEN',
    coordinates: [
      [[107.685, 15.285], [107.735, 15.308], [107.762, 15.268], [107.718, 15.245], [107.672, 15.258], [107.685, 15.285]]
    ],
    center: [15.274, 107.712],
    elevation: 980,
    slope: 41.0,
    aspect: 'NE',
    soil_type: 'Đá biến chất phong hóa bở rời dọc đường phân thủy Trường Sơn',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-po-ko-ktm',
    basin_name: 'Lưu vực Sông Pô Kô - Thượng nguồn Sông Sê San',
    basin_area_km2: 56.0,
    channel_gradient: 22.5,
    vulnerable_population: 650,
    critical_facilities: ['Đường Hồ Chí Minh (QL14) đoạn đèo Lò Xo Km 1405-1425', 'Trạm y tế xã Đắk Man']
  },
  {
    id: 'zone-dno-01',
    zone_code: 'DNO_DR_KIENDUC',
    zone_name: 'Khu sạt trượt TT Kiến Đức & Quảng Tín',
    district_name: 'Huyện Đắk R’Lấp',
    province_name: 'Tỉnh Đắk Nông',
    region: 'TAY_NGUYEN',
    coordinates: [
      [[107.455, 11.985], [107.505, 12.008], [107.532, 11.968], [107.488, 11.945], [107.442, 11.958], [107.455, 11.985]]
    ],
    center: [11.974, 107.482],
    elevation: 680,
    slope: 28.5,
    aspect: 'W',
    soil_type: 'Tầng Feralit Bazan dày trên 20m trượt ngầm do mạch nước ngầm dâng',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-song-be-dno',
    basin_name: 'Lưu vực Thượng nguồn Sông Bé',
    basin_area_km2: 60.0,
    channel_gradient: 12.0,
    vulnerable_population: 1800,
    critical_facilities: ['Quốc lộ 14 đoạn qua TT Kiến Đức', 'Khu tái định cư Đắk R’Lấp']
  },

  // =========================================================================
  // X. KHU VỰC NAM BỘ & ĐỒNG BẰNG SÔNG CỬU LONG
  // =========================================================================
  {
    id: 'zone-agi-01',
    zone_code: 'AGI_CM_CHOMOI',
    zone_name: 'Thị trấn Chợ Mới & Xã Mỹ Hiệp',
    district_name: 'Huyện Chợ Mới',
    province_name: 'Tỉnh An Giang',
    region: 'NAM_BO',
    coordinates: [
      [[105.485, 10.485], [105.535, 10.508], [105.562, 10.468], [105.518, 10.445], [105.472, 10.458], [105.485, 10.485]]
    ],
    center: [10.474, 105.512],
    elevation: 4,
    slope: 12.0,
    aspect: 'E',
    soil_type: 'Đất phù sa bở rời ven sông chịu tác động xói ngầm thủy triều dòng chảy xiết',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-song-tien-agi',
    basin_name: 'Lưu vực Hạ lưu Sông Tiền',
    basin_area_km2: 75.0,
    channel_gradient: 2.0,
    vulnerable_population: 3200,
    critical_facilities: ['Tỉnh lộ 942', 'Cụm dân cư bờ sông Chợ Mới', 'Bến phà Thuận Giang']
  },
  {
    id: 'zone-dth-01',
    zone_code: 'DTH_HN_HONGNGU',
    zone_name: 'Phường An Lộc & Xã Long Thuận',
    district_name: 'Thành phố Hồng Ngự',
    province_name: 'Tỉnh Đồng Tháp',
    region: 'NAM_BO',
    coordinates: [
      [[105.285, 10.785], [105.335, 10.808], [105.362, 10.768], [105.318, 10.745], [105.272, 10.758], [105.285, 10.785]]
    ],
    center: [10.774, 105.312],
    elevation: 3,
    slope: 10.5,
    aspect: 'NW',
    soil_type: 'Đất bùn sét phù sa mềm yếu, dòng chảy xoáy mùa lũ đầu nguồn Mekong',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-song-tien-dth',
    basin_name: 'Lưu vực Đầu nguồn Sông Tiền - Đồng Tháp',
    basin_area_km2: 88.0,
    channel_gradient: 1.5,
    vulnerable_population: 2600,
    critical_facilities: ['Quốc lộ 30 nối cửa khẩu Dinh Bà', 'Cụm trường THCS Long Thuận', 'Kè chống sạt lở TP Hồng Ngự']
  },
  {
    id: 'zone-cth-01',
    zone_code: 'CTH_BT_CONKHUONG',
    zone_name: 'Phường Cái Khế & Cồn Khương',
    district_name: 'Quận Ninh Kiều / Bình Thủy',
    province_name: 'Thành phố Cần Thơ',
    region: 'NAM_BO',
    coordinates: [
      [[105.745, 10.045], [105.795, 10.068], [105.822, 10.028], [105.778, 10.005], [105.732, 10.018], [105.745, 10.045]]
    ],
    center: [10.034, 105.772],
    elevation: 2,
    slope: 8.0,
    aspect: 'NE',
    soil_type: 'Đất bồi tích phù sa hiện đại, xói mòn chân kè kết hợp triều cường cực đoan',
    geology_sensitivity: 'HIGH',
    basin_id: 'basin-song-hau-cth',
    basin_name: 'Lưu vực Hạ lưu Sông Hậu',
    basin_area_km2: 65.0,
    channel_gradient: 1.0,
    vulnerable_population: 4100,
    critical_facilities: ['Đường Bùi Hữu Nghĩa', 'Khu dân cư Cồn Khương', 'Bến phà Bình Thủy']
  },
  {
    id: 'zone-cmu-01',
    zone_code: 'CMU_NH_DATMUI',
    zone_name: 'Xã Đất Mũi & TT Rạch Gốc',
    district_name: 'Huyện Ngọc Hiển',
    province_name: 'Tỉnh Cà Mau',
    region: 'NAM_BO',
    coordinates: [
      [[104.715, 8.585], [104.765, 8.608], [104.792, 8.568], [104.748, 8.545], [104.702, 8.558], [104.715, 8.585]]
    ],
    center: [8.574, 104.742],
    elevation: 1,
    slope: 5.0,
    aspect: 'SW',
    soil_type: 'Đất bùn lầy ngập mặn chịu sóng biển Tây và triều cường dâng',
    geology_sensitivity: 'VERY_HIGH',
    basin_id: 'basin-bien-tay-cmu',
    basin_name: 'Vùng Biển Tây & Rừng ngập mặn Mũi Cà Mau',
    basin_area_km2: 95.0,
    channel_gradient: 0.5,
    vulnerable_population: 1900,
    critical_facilities: ['Đường Hồ Chí Minh điểm cuối Cà Mau Km 2436', 'Khu du lịch Quốc gia Mũi Cà Mau', 'Trạm biên phòng Đất Mũi']
  },
  {
    id: 'zone-hno-01',
    zone_code: 'HNO_BV_YENBAI',
    zone_name: 'Xã Ba Vì & Xã Yên Bài',
    district_name: 'Huyện Ba Vì',
    province_name: 'Thành phố Hà Nội',
    region: 'BAC_BO',
    coordinates: [
      [[105.345, 21.085], [105.395, 21.108], [105.422, 21.068], [105.378, 21.045], [105.332, 21.058], [105.345, 21.085]]
    ],
    center: [21.074, 105.372],
    elevation: 450,
    slope: 31.0,
    aspect: 'E',
    soil_type: 'Đất feralit đỏ vàng sườn núi Ba Vì phong hóa, nguy cơ trượt đất cục bộ',
    geology_sensitivity: 'MEDIUM',
    basin_id: 'basin-song-da-bavi',
    basin_name: 'Lưu vực Sông Đà - Núi Ba Vì',
    basin_area_km2: 50.0,
    channel_gradient: 15.0,
    vulnerable_population: 1520,
    critical_facilities: ['Tỉnh lộ 87A', 'Trạm Khí tượng Thủy văn Ba Vì', 'Khu du lịch VQG Ba Vì']
  }
];

export const VIETNAM_NATIONWIDE_ZONES = NORTHERN_VIETNAM_ZONES;
