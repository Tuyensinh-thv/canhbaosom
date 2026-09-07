import { SimulationResult, SimulationScenarioInput, SpatialZone, ThresholdProfile } from '../../src/types';
import { NORTHERN_VIETNAM_ZONES } from '../data/northern_vietnam_zones';
import { hybridRiskEngine } from './hybrid_risk';

export class SimulationEngine {
  public runSimulation(
    input: SimulationScenarioInput,
    thresholdProfiles: ThresholdProfile[]
  ): SimulationResult {
    const targetZones: SpatialZone[] = input.zone_ids && input.zone_ids.length > 0
      ? NORTHERN_VIETNAM_ZONES.filter((z) => input.zone_ids!.includes(z.id))
      : NORTHERN_VIETNAM_ZONES;

    const assessments = targetZones.map((zone) => {
      // Apply local modifier to rainfall based on zone elevation and aspect
      const elevationFactor = 1 + (zone.elevation / 2000) * 0.15;
      const r1h = Number((input.rainfall_1h * elevationFactor).toFixed(1));
      const r3h = Number((input.rainfall_3h * elevationFactor).toFixed(1));
      const r6h = Number((input.rainfall_6h * elevationFactor).toFixed(1));
      const r24h = Number((input.rainfall_24h * elevationFactor).toFixed(1));

      return hybridRiskEngine.assessZone(
        zone,
        r1h,
        r3h,
        r6h,
        r24h,
        thresholdProfiles,
        'VALID'
      );
    });

    const level_5_count = assessments.filter((a) => a.overall_risk_level === 5).length;
    const level_4_count = assessments.filter((a) => a.overall_risk_level === 4).length;
    const level_3_count = assessments.filter((a) => a.overall_risk_level === 3).length;
    const level_2_count = assessments.filter((a) => a.overall_risk_level === 2).length;
    const level_1_count = assessments.filter((a) => a.overall_risk_level === 1).length;

    let cascade_warning = 'Kịch bản không gây đột biến thảm họa trên diện rộng.';
    if (level_5_count > 0 || level_4_count >= 3) {
      cascade_warning = `CẢNH BÁO KỊCH BẢN THẢM HỌA: Kịch bản mô phỏng tạo ra ${level_5_count} vùng Cấp 5 và ${level_4_count} vùng Cấp 4. Nguy cơ tắc nghẽn giao thông huyết mạch và vỡ hồ đập nhỏ lưu vực suối!`;
    } else if (level_4_count > 0 || level_3_count >= 4) {
      cascade_warning = `Kịch bản kích hoạt ${level_4_count} điểm rủi ro rất lớn (Cấp 4). Cần kích hoạt phương án 4 tại chỗ cấp huyện.`;
    }

    return {
      simulation_id: `sim-${Date.now()}`,
      executed_at: new Date().toISOString(),
      scenario_params: input,
      affected_zones_count: assessments.filter((a) => a.overall_risk_level >= 3).length,
      impact_summary: {
        level_5_count,
        level_4_count,
        level_3_count,
        level_2_count,
        level_1_count
      },
      results: assessments,
      cascade_warning
    };
  }
}

export const simulationEngine = new SimulationEngine();
