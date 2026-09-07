import {
  ModelConfidence,
  QualityFlag,
  RiskLevel,
  RiskType,
  SpatialZone,
  ThresholdProfile,
  TriggerType,
  ZoneRiskAssessment
} from '../../src/types';
import { flashFloodAiEngine } from '../ai/flash_flood_engine';
import { landslideAiEngine } from '../ai/landslide_engine';
import { physicalRulesEngine } from '../rules/physical_rules';
import { featureEngineeringService } from './feature_engineering';

export const RISK_LEVEL_COLORS: Record<RiskLevel, string> = {
  1: '#87CEEB', // Cấp 1: Rủi ro thấp (Sky blue)
  2: '#FFFF00', // Cấp 2: Rủi ro trung bình (Yellow)
  3: '#FFA500', // Cấp 3: Rủi ro lớn (Orange)
  4: '#FF0000', // Cấp 4: Rủi ro rất lớn (Red)
  5: '#800080'  // Cấp 5: Thảm họa (Purple)
};

export class HybridRiskEngine {
  public assessZone(
    zone: SpatialZone,
    rainfall_1h: number,
    rainfall_3h: number,
    rainfall_6h: number,
    rainfall_24h: number,
    thresholdProfiles: ThresholdProfile[],
    dataQualityFlag: QualityFlag = 'VALID'
  ): ZoneRiskAssessment {
    // 1. Feature Engineering
    const features = featureEngineeringService.computeFeatures(
      zone,
      rainfall_1h,
      rainfall_3h,
      rainfall_6h,
      rainfall_24h
    );

    // 2. Run Landslide AI & Physical Rules
    const lsAi = landslideAiEngine.predict(zone, features);
    const lsRules = physicalRulesEngine.evaluateRules(features, 'landslide', thresholdProfiles);

    let lsFinalLevel: RiskLevel = lsAi.ai_level;
    let lsTriggerType: TriggerType = 'AI_MODEL';
    let lsTriggerDetail = `AI Model xác định xác suất P(sạt lở)=${lsAi.probability}`;

    if (lsRules.triggered && lsRules.highest_rule_level > lsAi.ai_level) {
      lsFinalLevel = lsRules.highest_rule_level;
      lsTriggerType = 'PHYSICAL_RULE';
      lsTriggerDetail = lsRules.trigger_detail;
    } else if (lsRules.triggered) {
      lsTriggerType = 'HYBRID_OVERRIDE';
      lsTriggerDetail = `${lsRules.trigger_detail} + AI (${lsAi.probability})`;
    }

    // 3. Run Flash Flood AI & Physical Rules
    const ffAi = flashFloodAiEngine.predict(zone, features);
    const ffRules = physicalRulesEngine.evaluateRules(features, 'flash_flood', thresholdProfiles);

    let ffFinalLevel: RiskLevel = ffAi.ai_level;
    let ffTriggerType: TriggerType = 'AI_MODEL';
    let ffTriggerDetail = `AI Model xác định xác suất P(lũ quét)=${ffAi.probability}`;

    if (ffRules.triggered && ffRules.highest_rule_level > ffAi.ai_level) {
      ffFinalLevel = ffRules.highest_rule_level;
      ffTriggerType = 'PHYSICAL_RULE';
      ffTriggerDetail = ffRules.trigger_detail;
    } else if (ffRules.triggered) {
      ffTriggerType = 'HYBRID_OVERRIDE';
      ffTriggerDetail = `${ffRules.trigger_detail} + AI (${ffAi.probability})`;
    }

    // 4. Risk Fusion (PRD Section 12)
    let overall_risk_level: RiskLevel = Math.max(lsFinalLevel, ffFinalLevel) as RiskLevel;
    let overall_risk_type: RiskType = 'combined';

    if (lsFinalLevel > ffFinalLevel) {
      overall_risk_type = 'landslide';
    } else if (ffFinalLevel > lsFinalLevel) {
      overall_risk_type = 'flash_flood';
    } else {
      overall_risk_type = overall_risk_level >= 3 ? 'combined' : 'landslide';
    }

    const overall_probability = Math.max(lsAi.probability, ffAi.probability);

    let trigger_type: TriggerType = 'AI_MODEL';
    let trigger_detail = '';

    if (overall_risk_type === 'landslide') {
      trigger_type = lsTriggerType;
      trigger_detail = lsTriggerDetail;
    } else if (overall_risk_type === 'flash_flood') {
      trigger_type = ffTriggerType;
      trigger_detail = ffTriggerDetail;
    } else {
      trigger_type = lsRules.triggered || ffRules.triggered ? 'PHYSICAL_RULE' : 'AI_MODEL';
      trigger_detail = `Nguy cơ kép: Lũ quét (${ffTriggerDetail}) & Sạt lở (${lsTriggerDetail})`;
    }

    // Adjust confidence if data quality was degraded
    let confidence_score = Math.round((lsAi.confidence_score + ffAi.confidence_score) / 2);
    if (dataQualityFlag === 'WARNING') confidence_score -= 15;
    if (dataQualityFlag === 'INVALID' || dataQualityFlag === 'MISSING') confidence_score -= 35;

    let model_confidence: ModelConfidence = 'HIGH';
    if (confidence_score < 65) model_confidence = 'LOW';
    else if (confidence_score < 80) model_confidence = 'MEDIUM';

    // 5. Early Warning Lead Time & Scenario Projection (PRD Section 15)
    let projected_level_30m: RiskLevel = overall_risk_level;
    let projected_level_60m: RiskLevel = overall_risk_level;
    let lead_time_status = 'Xu thế rủi ro ổn định';

    if (features.rainfall_trend === 'RISING_SHARP') {
      projected_level_30m = Math.min(5, overall_risk_level + (rainfall_1h > 65 ? 1 : 0)) as RiskLevel;
      projected_level_60m = Math.min(5, projected_level_30m + 1) as RiskLevel;
      lead_time_status = `DỰ KIẾN CẤP ${projected_level_60m} trong 30–60 phút tới do mưa dồn dập ${rainfall_1h}mm/h`;
    } else if (features.rainfall_trend === 'RISING') {
      projected_level_60m = Math.min(5, overall_risk_level + 1) as RiskLevel;
      lead_time_status = `Xu thế tăng lên Cấp ${projected_level_60m} nếu mưa duy trì`;
    } else if (features.rainfall_trend === 'DECREASING' && overall_risk_level > 2) {
      lead_time_status = 'Mưa giảm dần, tuy nhiên đất bão hòa nước cần tiếp tục đề phòng trượt trễ';
    }

    // 6. Contributing Factors & XAI Explanation Generation (PRD Section 13)
    const factorContributions = featureEngineeringService.extractFeatureContributions(
      zone,
      features,
      overall_risk_type === 'flash_flood' ? 'flash_flood' : 'landslide'
    );

    const triggered_rules = [...lsRules.triggered_rules, ...ffRules.triggered_rules];

    const explanation_summary = this.generateExplanation(
      zone,
      overall_risk_level,
      overall_risk_type,
      features,
      trigger_type,
      trigger_detail,
      overall_probability,
      model_confidence
    );

    const geological_factors = `Địa hình sườn dốc ${zone.slope}°, độ cao ${zone.elevation}m. Địa chất ${zone.geology_sensitivity} (${zone.soil_type}), độ bão hòa nước ước tính đạt ${features.soil_saturation_est}%.`;
    const meteorological_factors = `Cường độ mưa 1h: ${rainfall_1h} mm/h, 3h: ${rainfall_3h} mm, 24h: ${rainfall_24h} mm. Chỉ số mưa tiền tích lũy API = ${features.antecedent_precip_index} mm.`;

    const safety_recommendations = this.generateSafetyRecommendations(overall_risk_level, overall_risk_type, zone);

    return {
      zone_id: zone.id,
      zone_name: zone.zone_name,
      district_name: zone.district_name,
      province_name: zone.province_name,
      timestamp: new Date().toISOString(),

      rainfall_1h,
      rainfall_3h,
      rainfall_6h,
      rainfall_24h,
      rainfall_trend: features.rainfall_trend,
      antecedent_precip_index: features.antecedent_precip_index,
      soil_saturation_percent: features.soil_saturation_est,

      landslide_ai_probability: lsAi.probability,
      landslide_rule_triggered: lsRules.triggered,
      landslide_rule_level: lsRules.highest_rule_level,
      landslide_final_level: lsFinalLevel,

      flash_flood_ai_probability: ffAi.probability,
      flash_flood_rule_triggered: ffRules.triggered,
      flash_flood_rule_level: ffRules.highest_rule_level,
      flash_flood_final_level: ffFinalLevel,

      overall_risk_level,
      overall_risk_type,
      overall_probability,
      model_confidence,
      confidence_score,
      color: RISK_LEVEL_COLORS[overall_risk_level],

      trigger_type,
      trigger_detail,
      physical_rule_active: lsRules.triggered || ffRules.triggered,
      triggered_rules,

      projected_level_30m,
      projected_level_60m,
      lead_time_status,

      contributing_factors: factorContributions,
      explanation_summary,
      geological_factors,
      meteorological_factors,
      safety_recommendations,

      model_version: `HAEWS-v2.0 (LS:${lsAi.model_version} | FF:${ffAi.model_version})`,
      data_quality_flag: dataQualityFlag
    };
  }

  private generateExplanation(
    zone: SpatialZone,
    level: RiskLevel,
    riskType: RiskType,
    features: any,
    triggerType: TriggerType,
    triggerDetail: string,
    probability: number,
    confidence: ModelConfidence
  ): string {
    const levelNames: Record<RiskLevel, string> = {
      1: 'CẤP 1 – RỦI RO THẤP',
      2: 'CẤP 2 – RỦI RO TRUNG BÌNH',
      3: 'CẤP 3 – RỦI RO LỚN',
      4: 'CẤP 4 – RỦI RO RẤT LỚN',
      5: 'CẤP 5 – THẢM HỌA'
    };

    const typeNames: Record<RiskType, string> = {
      flash_flood: 'LŨ QUÉT',
      landslide: 'SẠT LỞ ĐẤT',
      combined: 'LŨ QUÉT & SẠT LỞ ĐẤT ĐỒNG THỜI'
    };

    return `${levelNames[level]} (${typeNames[riskType]}). Vùng ${zone.zone_name} ghi nhận lượng mưa 24h đạt ${features.rainfall_24h}mm kết hợp cường độ 1h đạt ${features.rainfall_1h}mm/h trên sườn dốc ${zone.slope}°. Đất bão hòa ${features.soil_saturation_est}%. Kích hoạt: ${triggerDetail}. Độ tin cậy mô hình: ${confidence} (Xác suất AI: ${(probability * 100).toFixed(0)}%).`;
  }

  private generateSafetyRecommendations(level: RiskLevel, riskType: RiskType, zone: SpatialZone): string[] {
    const recs: string[] = [];

    if (level >= 4) {
      recs.push(`Khẩn cấp: Tổ chức sơ tán ngay ${zone.vulnerable_population} người dân khỏi các triền đồi dốc dốc >30° và ven lòng suối.`);
      recs.push(`Lực lượng xung kích cơ động cắm biển cấm đường, lập chốt chặn 24/24 tại: ${zone.critical_facilities.join(', ')}.`);
      recs.push('Sẵn sàng phương tiện cứu nạn cứu hộ tại vị trí cao ráo, ngắt điện các trạm hạ thế có nguy cơ ngập sạt.');
    } else if (level === 3) {
      recs.push(`Cảnh báo cao: Kiểm tra khẩn cấp các vết nứt, khe nứt sườn đồi, hiện tượng nước suối đổi màu đục ngầu.`);
      recs.push('Chuẩn bị sẵn phương án di dời người già, trẻ nhỏ và gia súc đến điểm tập kết an toàn.');
      recs.push('Nghiêm cấm người dân vớt củi, bắt cá hoặc đi qua ngầm tràn khi có dòng chảy xiết.');
    } else if (level === 2) {
      recs.push('Duy trì trực ban theo dõi bản tin khí tượng thủy văn và lượng mưa tự động.');
      recs.push('Thông báo qua loa truyền thanh xã cho các thôn bản vùng trũng thấp chủ động chằng chống nhà cửa.');
    } else {
      recs.push('Trạng thái an toàn. Tiếp tục vận hành quan trắc tự động định kỳ.');
    }

    return recs;
  }
}

export const hybridRiskEngine = new HybridRiskEngine();
