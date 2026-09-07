import { ThresholdProfile } from '../../src/types';

export const DEFAULT_THRESHOLD_PROFILES: ThresholdProfile[] = [
  // Cấp 5 - Thảm họa (Extremely Severe / Catastrophic)
  {
    id: 'thresh-l5-ff-north',
    region_code: 'NORTHERN_VIETNAM',
    region_name: 'Khu vực Miền núi Phía Bắc',
    risk_type: 'flash_flood',
    rainfall_1h_threshold: 80.0,
    rainfall_3h_threshold: 160.0,
    rainfall_6h_threshold: 220.0,
    rainfall_24h_threshold: 300.0,
    soil_saturation_threshold: 90.0,
    level: 5,
    source: 'Quy chuẩn QCVN & Bộ TN&MT / Viện KH Khí tượng Thủy văn',
    effective_date: '2024-01-01',
    active: true
  },
  {
    id: 'thresh-l5-ls-north',
    region_code: 'NORTHERN_VIETNAM',
    region_name: 'Khu vực Miền núi Phía Bắc',
    risk_type: 'landslide',
    rainfall_1h_threshold: 75.0,
    rainfall_3h_threshold: 150.0,
    rainfall_6h_threshold: 200.0,
    rainfall_24h_threshold: 280.0,
    soil_saturation_threshold: 88.0,
    level: 5,
    source: 'Quyết định số 18/2021/QĐ-TTg & Hướng dẫn Cục Địa chất',
    effective_date: '2024-01-01',
    active: true
  },

  // Cấp 4 - Rất lớn (Very High Risk)
  {
    id: 'thresh-l4-ff-north',
    region_code: 'NORTHERN_VIETNAM',
    region_name: 'Khu vực Miền núi Phía Bắc',
    risk_type: 'flash_flood',
    rainfall_1h_threshold: 60.0,
    rainfall_3h_threshold: 120.0,
    rainfall_6h_threshold: 160.0,
    rainfall_24h_threshold: 220.0,
    soil_saturation_threshold: 80.0,
    level: 4,
    source: 'Quy chuẩn QCVN & Bộ TN&MT / Viện KH Khí tượng Thủy văn',
    effective_date: '2024-01-01',
    active: true
  },
  {
    id: 'thresh-l4-ls-north',
    region_code: 'NORTHERN_VIETNAM',
    region_name: 'Khu vực Miền núi Phía Bắc',
    risk_type: 'landslide',
    rainfall_1h_threshold: 55.0,
    rainfall_3h_threshold: 105.0,
    rainfall_6h_threshold: 150.0,
    rainfall_24h_threshold: 200.0,
    soil_saturation_threshold: 78.0,
    level: 4,
    source: 'Quyết định số 18/2021/QĐ-TTg & Hướng dẫn Cục Địa chất',
    effective_date: '2024-01-01',
    active: true
  },

  // Cấp 3 - Lớn (High Risk)
  {
    id: 'thresh-l3-ff-north',
    region_code: 'NORTHERN_VIETNAM',
    region_name: 'Khu vực Miền núi Phía Bắc',
    risk_type: 'flash_flood',
    rainfall_1h_threshold: 40.0,
    rainfall_3h_threshold: 80.0,
    rainfall_6h_threshold: 110.0,
    rainfall_24h_threshold: 150.0,
    soil_saturation_threshold: 70.0,
    level: 3,
    source: 'Quy chuẩn QCVN & Bộ TN&MT / Viện KH Khí tượng Thủy văn',
    effective_date: '2024-01-01',
    active: true
  },
  {
    id: 'thresh-l3-ls-north',
    region_code: 'NORTHERN_VIETNAM',
    region_name: 'Khu vực Miền núi Phía Bắc',
    risk_type: 'landslide',
    rainfall_1h_threshold: 35.0,
    rainfall_3h_threshold: 70.0,
    rainfall_6h_threshold: 100.0,
    rainfall_24h_threshold: 140.0,
    soil_saturation_threshold: 68.0,
    level: 3,
    source: 'Quyết định số 18/2021/QĐ-TTg & Hướng dẫn Cục Địa chất',
    effective_date: '2024-01-01',
    active: true
  },

  // Cấp 2 - Trung bình (Medium Risk)
  {
    id: 'thresh-l2-ff-north',
    region_code: 'NORTHERN_VIETNAM',
    region_name: 'Khu vực Miền núi Phía Bắc',
    risk_type: 'flash_flood',
    rainfall_1h_threshold: 25.0,
    rainfall_3h_threshold: 50.0,
    rainfall_6h_threshold: 70.0,
    rainfall_24h_threshold: 90.0,
    soil_saturation_threshold: 55.0,
    level: 2,
    source: 'Quy chuẩn QCVN & Bộ TN&MT / Viện KH Khí tượng Thủy văn',
    effective_date: '2024-01-01',
    active: true
  },
  {
    id: 'thresh-l2-ls-north',
    region_code: 'NORTHERN_VIETNAM',
    region_name: 'Khu vực Miền núi Phía Bắc',
    risk_type: 'landslide',
    rainfall_1h_threshold: 20.0,
    rainfall_3h_threshold: 45.0,
    rainfall_6h_threshold: 65.0,
    rainfall_24h_threshold: 85.0,
    soil_saturation_threshold: 52.0,
    level: 2,
    source: 'Quyết định số 18/2021/QĐ-TTg & Hướng dẫn Cục Địa chất',
    effective_date: '2024-01-01',
    active: true
  }
];
