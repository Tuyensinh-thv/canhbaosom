import { SpatialZone, RiskFeatureContribution } from '../../src/types';

export interface EngineeredFeatures {
  zone_id: string;
  elevation_norm: number; // 0..1
  slope_deg: number;
  slope_factor: number; // 0..1 non-linear steepness risk
  geology_score: number; // 1..4 (LOW=1, VERY_HIGH=4)
  soil_saturation_est: number; // 0..100 (%)
  rainfall_1h: number; // mm
  rainfall_3h: number; // mm
  rainfall_6h: number; // mm
  rainfall_24h: number; // mm
  rainfall_trend: 'RISING_SHARP' | 'RISING' | 'STABLE' | 'DECREASING';
  rainfall_intensity_ratio: number; // r1h / r24h
  antecedent_precip_index: number; // API (mm)
  basin_stream_gradient: number; // %
  basin_accumulation_factor: number; // 0..1
}

export class FeatureEngineeringService {
  // Antecedent Precipitation Index decay constant k (typically 0.85 in tropical mountain hydrometeorology)
  private readonly API_DECAY_K = 0.85;

  public computeFeatures(
    zone: SpatialZone,
    rainfall_1h: number,
    rainfall_3h: number,
    rainfall_6h: number,
    rainfall_24h: number,
    previous_days_rain?: number[]
  ): EngineeredFeatures {
    // 1. Slope risk non-linear factor: slopes > 30 deg significantly increase landslide shear stress
    const slope_factor = Math.min(1.0, Math.max(0.0, (zone.slope - 15) / 35));

    // 2. Geology sensitivity numerical encoding
    const geologyMap: Record<string, number> = {
      LOW: 1.0,
      MEDIUM: 2.0,
      HIGH: 3.2,
      VERY_HIGH: 4.0
    };
    const geology_score = geologyMap[zone.geology_sensitivity] || 2.5;

    // 3. Antecedent Precipitation Index (API) = sum(k^t * P_t)
    // If not provided, realistic antecedent rain scales with recent 24h rain
    const pastDays = previous_days_rain && previous_days_rain.length > 0
      ? previous_days_rain
      : [
          Math.max(0, Number((rainfall_24h * 0.5).toFixed(1))),
          Math.max(0, Number((rainfall_24h * 0.3).toFixed(1))),
          Math.max(0, Number((rainfall_24h * 0.15).toFixed(1))),
          Math.max(0, Number((rainfall_24h * 0.05).toFixed(1)))
        ];

    let api = rainfall_24h;
    pastDays.forEach((p, idx) => {
      api += Math.pow(this.API_DECAY_K, idx + 1) * p;
    });

    // 4. Soil Saturation Estimate (% based on API, soil type and slope drainage)
    // Normal dry baseline soil moisture ~ 20-35%. Heavy saturation (80-100%) occurs only when accumulated rain > 200mm
    const baseRetention = zone.geology_sensitivity === 'VERY_HIGH' ? 1.12 : 1.0;
    const soil_saturation_est = Math.min(100, Math.max(15, Math.round((20 + (api / 220) * 80) * baseRetention)));

    // 5. Rainfall Trend & Intensity Ratio
    let rainfall_trend: 'RISING_SHARP' | 'RISING' | 'STABLE' | 'DECREASING' = 'STABLE';
    if (rainfall_1h > 60 || (rainfall_1h > 35 && rainfall_1h * 3 > rainfall_3h * 1.3)) {
      rainfall_trend = 'RISING_SHARP';
    } else if (rainfall_1h * 3 > rainfall_3h) {
      rainfall_trend = 'RISING';
    } else if (rainfall_1h < 10 && rainfall_24h > 100) {
      rainfall_trend = 'DECREASING';
    }

    const rainfall_intensity_ratio = rainfall_24h > 0 ? Number((rainfall_1h / rainfall_24h).toFixed(2)) : 0;

    // 6. Basin accumulation factor for Flash Flood
    // High channel gradient + high basin area concentration
    const basin_accumulation_factor = Math.min(
      1.0,
      (zone.basin_area_km2 / 100) * 0.4 + (zone.channel_gradient / 30) * 0.6
    );

    return {
      zone_id: zone.id,
      elevation_norm: Math.min(1.0, zone.elevation / 2500),
      slope_deg: zone.slope,
      slope_factor,
      geology_score,
      soil_saturation_est,
      rainfall_1h,
      rainfall_3h,
      rainfall_6h,
      rainfall_24h,
      rainfall_trend,
      rainfall_intensity_ratio,
      antecedent_precip_index: Math.round(api),
      basin_stream_gradient: zone.channel_gradient,
      basin_accumulation_factor
    };
  }

  public extractFeatureContributions(
    zone: SpatialZone,
    features: EngineeredFeatures,
    riskType: 'landslide' | 'flash_flood'
  ): RiskFeatureContribution[] {
    if (riskType === 'landslide') {
      const rainWeight = Math.min(45, (features.rainfall_24h / 250) * 45);
      const slopeWeight = Math.min(30, (features.slope_deg / 45) * 30);
      const satWeight = Math.min(25, (features.soil_saturation_est / 100) * 25);
      const geoWeight = features.geology_score * 5;

      const total = rainWeight + slopeWeight + satWeight + geoWeight;

      return [
        {
          feature_name: 'rainfall_24h',
          feature_label: 'Lượng mưa tích lũy 24h',
          value: `${features.rainfall_24h} mm`,
          unit: 'mm',
          contribution_percent: Math.round((rainWeight / total) * 100),
          impact: features.rainfall_24h > 150 ? 'POSITIVE_RISK' : 'NEUTRAL'
        },
        {
          feature_name: 'slope',
          feature_label: 'Độ dốc sườn núi',
          value: `${zone.slope}°`,
          unit: 'độ',
          contribution_percent: Math.round((slopeWeight / total) * 100),
          impact: zone.slope > 30 ? 'POSITIVE_RISK' : 'NEUTRAL'
        },
        {
          feature_name: 'soil_saturation',
          feature_label: 'Độ bão hòa nước trong đất',
          value: `${features.soil_saturation_est}%`,
          unit: '%',
          contribution_percent: Math.round((satWeight / total) * 100),
          impact: features.soil_saturation_est > 75 ? 'POSITIVE_RISK' : 'NEUTRAL'
        },
        {
          feature_name: 'geology',
          feature_label: 'Độ nhạy cảm địa chất công trình',
          value: zone.geology_sensitivity,
          contribution_percent: Math.round((geoWeight / total) * 100),
          impact: zone.geology_sensitivity === 'VERY_HIGH' || zone.geology_sensitivity === 'HIGH' ? 'POSITIVE_RISK' : 'NEUTRAL'
        }
      ];
    } else {
      const r1hWeight = Math.min(40, (features.rainfall_1h / 70) * 40);
      const r3hWeight = Math.min(25, (features.rainfall_3h / 120) * 25);
      const basinGradientWeight = Math.min(20, (zone.channel_gradient / 25) * 20);
      const basinAreaWeight = Math.min(15, (zone.basin_area_km2 / 60) * 15);

      const total = r1hWeight + r3hWeight + basinGradientWeight + basinAreaWeight;

      return [
        {
          feature_name: 'rainfall_1h',
          feature_label: 'Cường độ mưa cực đại 1h',
          value: `${features.rainfall_1h} mm/h`,
          unit: 'mm/h',
          contribution_percent: Math.round((r1hWeight / total) * 100),
          impact: features.rainfall_1h > 50 ? 'POSITIVE_RISK' : 'NEUTRAL'
        },
        {
          feature_name: 'rainfall_3h',
          feature_label: 'Mưa dồn dập 3h',
          value: `${features.rainfall_3h} mm/3h`,
          unit: 'mm',
          contribution_percent: Math.round((r3hWeight / total) * 100),
          impact: features.rainfall_3h > 90 ? 'POSITIVE_RISK' : 'NEUTRAL'
        },
        {
          feature_name: 'channel_gradient',
          feature_label: 'Độ dốc lòng dẫn khe suối',
          value: `${zone.channel_gradient}%`,
          unit: '%',
          contribution_percent: Math.round((basinGradientWeight / total) * 100),
          impact: zone.channel_gradient > 18 ? 'POSITIVE_RISK' : 'NEUTRAL'
        },
        {
          feature_name: 'basin_area',
          feature_label: 'Diện tích lưu vực thu nước',
          value: `${zone.basin_area_km2} km²`,
          unit: 'km²',
          contribution_percent: Math.round((basinAreaWeight / total) * 100),
          impact: zone.basin_area_km2 > 30 ? 'POSITIVE_RISK' : 'NEUTRAL'
        }
      ];
    }
  }
}

export const featureEngineeringService = new FeatureEngineeringService();
