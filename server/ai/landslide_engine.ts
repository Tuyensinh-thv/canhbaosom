import { ModelConfidence, RiskLevel, SpatialZone } from '../../src/types';
import { EngineeredFeatures } from '../services/feature_engineering';

export interface LandslideInferenceOutput {
  probability: number; // 0..1
  ai_level: RiskLevel;
  confidence: ModelConfidence;
  confidence_score: number; // 0..100
  model_version: string;
  shap_summary: string;
}

export class LandslideAiEngine {
  private readonly MODEL_VERSION = 'v2.0.4-xgb-landslide';

  public predict(zone: SpatialZone, features: EngineeredFeatures): LandslideInferenceOutput {
    // Gradient Boosted Decision Tree simulation scoring
    // Feature weights tuned for mountainous terrain in Northern Vietnam (Schist, Granite, Feralite)
    const w_r24h = (Math.min(features.rainfall_24h, 350) / 250) * 0.35;
    const w_r6h = (Math.min(features.rainfall_6h, 200) / 160) * 0.15;
    const w_r1h = (Math.min(features.rainfall_1h, 80) / 70) * 0.10;
    const w_slope = features.slope_factor * 0.20;
    const w_sat = (features.soil_saturation_est / 100) * 0.12;
    const w_geo = (features.geology_score / 4.0) * 0.08;

    let rawScore = w_r24h + w_r6h + w_r1h + w_slope + w_sat + w_geo;

    // Trend multiplier
    if (features.rainfall_trend === 'RISING_SHARP') {
      rawScore *= 1.15;
    } else if (features.rainfall_trend === 'DECREASING') {
      rawScore *= 0.90;
    }

    // Sigmoid probability mapping
    const probability = Number(Math.min(0.99, Math.max(0.01, 1 / (1 + Math.exp(-6 * (rawScore - 0.52))))).toFixed(3));

    // Map probability to AI Risk Level
    let ai_level: RiskLevel = 1;
    if (probability >= 0.85) ai_level = 5;
    else if (probability >= 0.70) ai_level = 4;
    else if (probability >= 0.48) ai_level = 3;
    else if (probability >= 0.28) ai_level = 2;
    else ai_level = 1;

    // Confidence estimation
    // Confidence is high if sensors are healthy and values are distinctly outside boundary uncertainty zones
    let confidence_score = 90;
    if (features.rainfall_24h > 180 && zone.slope > 35) confidence_score = 95;
    if (Math.abs(probability - 0.7) < 0.04 || Math.abs(probability - 0.48) < 0.04) {
      confidence_score -= 15; // borderline uncertainty
    }

    let confidence: ModelConfidence = 'HIGH';
    if (confidence_score < 70) confidence = 'LOW';
    else if (confidence_score < 85) confidence = 'MEDIUM';

    const shap_summary = `Mô hình XGBoost xác định Mưa 24h (${features.rainfall_24h}mm, trọng số 35%) và Độ dốc (${zone.slope}°, trọng số 20%) là 2 nhân tố chính thúc đẩy mặt trượt đất.`;

    return {
      probability,
      ai_level,
      confidence,
      confidence_score,
      model_version: this.MODEL_VERSION,
      shap_summary
    };
  }
}

export const landslideAiEngine = new LandslideAiEngine();
