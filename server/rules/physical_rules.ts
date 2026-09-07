import { RiskLevel, ThresholdProfile } from '../../src/types';
import { EngineeredFeatures } from '../services/feature_engineering';

export interface PhysicalRuleEvaluationResult {
  triggered: boolean;
  highest_rule_level: RiskLevel;
  triggered_rules: string[];
  trigger_detail: string;
  rule_descriptions: string[];
}

export class PhysicalRulesEngine {
  public evaluateRules(
    features: EngineeredFeatures,
    riskType: 'flash_flood' | 'landslide',
    thresholdProfiles: ThresholdProfile[]
  ): PhysicalRuleEvaluationResult {
    // Filter active profiles for this risk type sorted descending by level (5 -> 4 -> 3 -> 2)
    const profiles = thresholdProfiles
      .filter((p) => p.active && p.risk_type === riskType)
      .sort((a, b) => b.level - a.level);

    const triggeredRules: string[] = [];
    const ruleDescriptions: string[] = [];
    let highestLevel: RiskLevel = 1;
    let primaryTriggerDetail = '';

    for (const p of profiles) {
      const r1hExceeded = features.rainfall_1h >= p.rainfall_1h_threshold;
      const r3hExceeded = features.rainfall_3h >= p.rainfall_3h_threshold;
      const r6hExceeded = features.rainfall_6h >= p.rainfall_6h_threshold;
      const r24hExceeded = features.rainfall_24h >= p.rainfall_24h_threshold;
      const soilSatExceeded =
        p.soil_saturation_threshold && features.soil_saturation_est >= p.soil_saturation_threshold;

      if (r1hExceeded || r3hExceeded || r6hExceeded || r24hExceeded || soilSatExceeded) {
        if (p.level > highestLevel) {
          highestLevel = p.level;
        }

        const violatedConditions: string[] = [];
        if (r1hExceeded) violatedConditions.push(`R1h (${features.rainfall_1h}mm ≥ ${p.rainfall_1h_threshold}mm)`);
        if (r3hExceeded) violatedConditions.push(`R3h (${features.rainfall_3h}mm ≥ ${p.rainfall_3h_threshold}mm)`);
        if (r6hExceeded) violatedConditions.push(`R6h (${features.rainfall_6h}mm ≥ ${p.rainfall_6h_threshold}mm)`);
        if (r24hExceeded) violatedConditions.push(`R24h (${features.rainfall_24h}mm ≥ ${p.rainfall_24h_threshold}mm)`);
        if (soilSatExceeded) violatedConditions.push(`Bão hòa đất (${features.soil_saturation_est}% ≥ ${p.soil_saturation_threshold}%)`);

        const ruleId = `RULE_${riskType.toUpperCase()}_L${p.level}`;
        triggeredRules.push(ruleId);

        const desc = `Kích hoạt Quy tắc Vật lý Cấp ${p.level}: ${violatedConditions.join(', ')}`;
        ruleDescriptions.push(desc);

        if (!primaryTriggerDetail) {
          primaryTriggerDetail = `Vượt ngưỡng vật lý Cấp ${p.level}: ${violatedConditions.slice(0, 2).join(' & ')}`;
        }
      }
    }

    return {
      triggered: triggeredRules.length > 0,
      highest_rule_level: highestLevel,
      triggered_rules: triggeredRules,
      trigger_detail: primaryTriggerDetail || 'Không vi phạm ngưỡng vật lý tĩnh',
      rule_descriptions: ruleDescriptions
    };
  }
}

export const physicalRulesEngine = new PhysicalRulesEngine();
