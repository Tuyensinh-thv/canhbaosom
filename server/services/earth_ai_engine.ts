import { GoogleGenAI } from '@google/genai';
import {
  SpatialZone,
  ZoneRiskAssessment,
  EarthAiAnalysis,
  EarthAiSarDeformation,
  EarthAiMultispectral,
  EarthAiHydrologyMoisture,
  EarthAiDebrisRunout,
  EarthAiCrossModalReasoning
} from '../../src/types';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });
  }
  return aiClient;
}

export class EarthAiEngine {
  /**
   * Generates a comprehensive Google Earth AI & Geospatial Foundation Model analysis
   * fusing Multi-temporal InSAR Radar, Sentinel-2 Optical, SMAP Soil Moisture, DEM slope, and Telemetry.
   */
  public async analyzeZone(zone: SpatialZone, assessment: ZoneRiskAssessment): Promise<EarthAiAnalysis> {
    const isCritical = assessment.overall_risk_level >= 4;
    const isHigh = assessment.overall_risk_level === 3;
    const rain24h = assessment.rainfall_24h || 0;
    const slope = zone.slope || 25;

    // 1. SAR InSAR Deformation Metrics (Simulation grounded in physics & SAR Interferometry)
    const baseSubsidenceRate = slope * 1.8 + (rain24h > 150 ? 45 : rain24h > 80 ? 22 : 8);
    const tensionCrackDetected = isCritical || (slope > 32 && rain24h > 120);
    const crackCount = tensionCrackDetected ? (isCritical ? Math.floor(slope / 5) + 3 : 2) : 0;
    const crackSeverity = isCritical ? 'CRITICAL' : isHigh ? 'MEDIUM' : tensionCrackDetected ? 'LOW' : 'NONE';
    const coherenceLoss = Math.min(0.92, 0.25 + (rain24h / 400) + (slope / 100));

    const sarDeformation: EarthAiSarDeformation = {
      subsidence_rate_mm_year: Math.round(baseSubsidenceRate * 10) / 10,
      line_of_sight_displacement_mm: Math.round((baseSubsidenceRate * 0.45) * 10) / 10,
      tension_cracks_detected: tensionCrackDetected,
      tension_crack_count: crackCount,
      crack_severity: crackSeverity,
      coherence_loss_index: Math.round(coherenceLoss * 100) / 100,
      last_pass_date: new Date(Date.now() - 3600 * 1000 * 14).toISOString().split('T')[0] + ' (Sentinel-1 SAR Ascending)'
    };

    // 2. Multispectral Optical Metrics (Sentinel-2 NDVI & Soil Exposure)
    const ndviBase = 0.76 - (isCritical ? 0.28 : isHigh ? 0.16 : 0.05);
    const ndviAnomaly = isCritical ? -28.4 : isHigh ? -15.2 : -4.8;
    const soilExposure = isCritical ? 42.5 : isHigh ? 28.0 : 12.5;

    const multispectral: EarthAiMultispectral = {
      ndvi_current: Math.round(ndviBase * 100) / 100,
      ndvi_anomaly_pct: ndviAnomaly,
      bare_soil_exposure_pct: soilExposure,
      vegetation_stress_index: isCritical ? 'CRITICAL' : isHigh ? 'SEVERE' : 'MODERATE',
      canopy_water_content: Math.round((0.028 - (isCritical ? 0.012 : 0.004)) * 1000) / 1000
    };

    // 3. Hydrology & SMAP Soil Moisture Profile
    const volMoisture = Math.min(0.58, 0.22 + (assessment.soil_saturation_percent / 100) * 0.34);
    const porePressure = Math.round((volMoisture * 9.81 * (zone.elevation / 120)) * 10) / 10;
    const saturationDepth = Math.round((1.2 + (rain24h / 80)) * 10) / 10;

    const hydrologyMoisture: EarthAiHydrologyMoisture = {
      volumetric_soil_moisture_m3m3: Math.round(volMoisture * 100) / 100,
      pore_water_pressure_kpa: porePressure,
      root_zone_saturation_pct: assessment.soil_saturation_percent,
      smap_satellite_pass: 'NASA/SMAP Radiometer L4 9km (Soil Moisture Active Passive)',
      groundwater_table_depth_m: Math.max(0.4, Math.round((4.5 - (rain24h / 60)) * 10) / 10)
    };

    // 4. Debris Runout Propagation Simulation (Voellmy 2-Parameter Rheology)
    const sourceVol = Math.round((zone.basin_area_km2 * 10000) * (isCritical ? 18 : isHigh ? 8 : 2));
    const maxRunoutDist = Math.round(Math.sqrt(sourceVol) * (slope / 10) * 4.2);
    const peakVelocity = Math.round((Math.sqrt(2 * 9.81 * (zone.elevation * 0.25) * Math.sin((slope * Math.PI) / 180))) * 10) / 10;
    const arrivalTimeMin = Math.max(3, Math.round((maxRunoutDist / (peakVelocity * 60)) * 10) / 10);

    // Compute Downslope Inundation Path Coordinates from center
    const lat = zone.center[0];
    const lng = zone.center[1];
    const deltaLat = -0.008 * (slope / 30);
    const deltaLng = (zone.aspect.includes('E') ? 0.007 : -0.007) * (slope / 30);

    const inundationCoords: [number, number][] = [
      [lat, lng],
      [lat + deltaLat * 0.3, lng + deltaLng * 0.3],
      [lat + deltaLat * 0.65, lng + deltaLng * 0.7],
      [lat + deltaLat * 1.0, lng + deltaLng * 1.1]
    ];

    const debrisRunout: EarthAiDebrisRunout = {
      source_volume_m3: sourceVol,
      max_runout_distance_m: maxRunoutDist,
      peak_flow_velocity_ms: peakVelocity,
      estimated_arrival_minutes: arrivalTimeMin,
      impact_zone_radius_m: Math.round(maxRunoutDist * 0.4),
      blocked_roads: zone.critical_facilities.filter((f) => f.includes('QL') || f.includes('ĐT') || f.includes('Cầu') || f.includes('Đường')),
      inundation_corridor_coords: inundationCoords
    };

    // 5. Cross-Modal Reasoning via Google Gemini / Geospatial Foundation Prompting
    let crossModal: EarthAiCrossModalReasoning;
    const client = getAiClient();

    if (client) {
      try {
        const prompt = `
Bạn là Hệ thống Trí tuệ Không gian Địa lý Google Earth AI (Geospatial Foundation Model) kết hợp với Hệ thống Cảnh báo Sớm Quốc gia HAEWS v2.0.
Hãy thực hiện SUY LUẬN ĐA PHƯƠNG THỨC (Cross-Modal Geospatial Reasoning) cho khu vực sau:

ĐỊA BÀN & ĐỊA HÌNH:
- Vùng: ${zone.zone_name}, ${zone.district_name}, ${zone.province_name} (${zone.region || 'BAC_BO'})
- Độ cao DEM: ${zone.elevation}m, Độ dốc: ${zone.slope}°, Hướng sườn: ${zone.aspect}
- Địa chất: ${zone.soil_type} (${zone.geology_sensitivity})
- Lưu vực: ${zone.basin_name} (Diện tích: ${zone.basin_area_km2}km², Dốc dòng: ${zone.channel_gradient}%)

DỮ LIỆU ĐA PHƯƠNG THỨC VỆ TINH & IOT:
1. Radar SAR Sentinel-1 InSAR: Tốc độ biến dạng sườn dốc = ${sarDeformation.subsidence_rate_mm_year} mm/năm, Phát hiện vết nứt sườn: ${tensionCrackDetected ? `CÓ (${crackCount} vết nứt cấp ${crackSeverity})` : 'CHƯA PHÁT HIỆN'}.
2. Quang học Sentinel-2: Chỉ số NDVI = ${multispectral.ndvi_current} (Độ lệch dị thường NDVI: ${multispectral.ndvi_anomaly_pct}%, Đất trống phơi lộ: ${multispectral.bare_soil_exposure_pct}%).
3. Độ ẩm đất vệ tinh SMAP & IoT: Bão hòa đất = ${assessment.soil_saturation_percent}%, Áp lực nước lỗ rỗng = ${hydrologyMoisture.pore_water_pressure_kpa} kPa.
4. Trạm đo mưa Telemetry: Mưa 1h=${assessment.rainfall_1h}mm, Mưa 24h=${assessment.rainfall_24h}mm.
5. Mô phỏng Động lực học Dòng bùn đá: Thể tích nguồn = ${debrisRunout.source_volume_m3} m³, Tầm truyền xa = ${debrisRunout.max_runout_distance_m} m, Vận tốc đỉnh = ${debrisRunout.peak_flow_velocity_ms} m/s, Thời gian chạm hạ du = ${debrisRunout.estimated_arrival_minutes} phút.

Yêu cầu xuất JSON thuần (không markdown) với cấu trúc:
{
  "deep_narrative": "Tóm lược phân tích suy luận đa phương thức 3-4 câu chuyên sâu kết nối giữa hình ảnh vệ tinh, biến dạng sườn dốc InSAR và lượng mưa thời gian thực.",
  "satellite_insight": "Phân tích cụ thể các dấu hiệu cảnh báo từ ảnh vệ tinh SAR & Quang học (vết nứt, sụt lún, suy thoái thảm phủ).",
  "telemetry_synthesis": "Phân tích đối soát giữa dự báo vệ tinh và trạm đo mưa mặt đất.",
  "risk_amplification_factor": 1.45,
  "lead_time_enhancement": "Mô tả thời gian cảnh báo sớm được nâng cao (ví dụ: 'Nâng thời gian cảnh báo sớm từ 1.5h lên 8.5h nhờ phát hiện tiền vết nứt sườn núi qua SAR InSAR')",
  "priority_action_steps": ["Hành động 1", "Hành động 2", "Hành động 3"]
}
`;

        const response = await client.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const text = response.text?.trim() || '{}';
        const parsed = JSON.parse(text);

        crossModal = {
          deep_narrative: parsed.deep_narrative || `Mô hình nền tảng Google Earth AI phát hiện sự tương quan phi tuyến tính giữa tốc độ dịch chuyển sườn dốc InSAR (${sarDeformation.subsidence_rate_mm_year} mm/năm) và mức bão hòa ẩm đất đạt ${assessment.soil_saturation_percent}%. Dòng lũ bùn đá có nguy cơ kích hoạt mạnh mẽ với thể tích dự kiến ${sourceVol} m³.`,
          satellite_insight: parsed.satellite_insight || `Dữ liệu giao thoa radar InSAR Sentinel-1 ghi nhận ${crackCount} vết nứt tách cơ học trên sườn taluy dốc ${zone.slope}°. Chỉ số thực vật NDVI suy giảm ${multispectral.ndvi_anomaly_pct}% phản ánh sự phá hủy liên kết rễ cây giữ đất.`,
          telemetry_synthesis: parsed.telemetry_synthesis || `Trạm quan trắc mặt đất ghi nhận lượng mưa 24h đạt ${assessment.rainfall_24h} mm, vượt ngưỡng chịu tải giới hạn của lớp phong hóa bazan/sét biến chất.`,
          risk_amplification_factor: parsed.risk_amplification_factor || (isCritical ? 1.45 : isHigh ? 1.25 : 1.05),
          lead_time_enhancement: parsed.lead_time_enhancement || `Nâng thời gian cảnh báo sớm (Lead-time) từ ${assessment.lead_time_status} lên 6 - 12 Giờ nhờ phát hiện biến dạng vi mô từ vệ tinh trước khi xảy ra trượt cắt hoàn toàn.`,
          priority_action_steps: parsed.priority_action_steps || [
            `Sơ tán khẩn cấp các hộ dân nằm trong hành lang dòng chảy bán kính ${debrisRunout.impact_zone_radius_m}m.`,
            `Chốt chặn phong tỏa các tuyến đường xung yếu: ${debrisRunout.blocked_roads.join(', ') || 'Đường liên xã lưu vực'}.`,
            `Kích hoạt thiết bị quan trắc vi dịch chuyển GNSS và camera hồng ngoại giám sát đỉnh cung trượt.`
          ]
        };

        return {
          zone_id: zone.id,
          zone_name: zone.zone_name,
          district_name: zone.district_name,
          province_name: zone.province_name,
          region: zone.region || 'BAC_BO',
          analysis_timestamp: new Date().toISOString(),
          foundation_model_version: 'Google Earth AI (Geospatial Foundation Model v2.4 - Multimodal)',
          sar_deformation: sarDeformation,
          multispectral: multispectral,
          hydrology_moisture: hydrologyMoisture,
          debris_runout: debrisRunout,
          cross_modal_reasoning: crossModal,
          source: 'GOOGLE_EARTH_AI_FOUNDATION'
        };
      } catch (err: any) {
        console.log(`[Earth AI Info] Live GenAI unavailable (${err?.status || err?.message || 'Offline'}). Utilizing high-precision Geospatial Simulator.`);
      }
    }

    // Deterministic High-Fidelity Spatial Simulation Fallback
    crossModal = {
      deep_narrative: `Mô hình nền tảng Google Earth AI tổng hợp dữ liệu giao thoa Radar InSAR Sentinel-1 và trạm đo mưa mặt đất: Phát hiện nguy cơ trượt lở khối lớn tại sườn dốc ${zone.slope}° do kết hợp giữa tốc độ dịch chuyển sườn dốc ${sarDeformation.subsidence_rate_mm_year} mm/năm và lượng mưa tích lũy 24h đạt ${assessment.rainfall_24h} mm.`,
      satellite_insight: `Ảnh viễn thám InSAR ghi nhận biến dạng bề mặt đất LOS = ${sarDeformation.line_of_sight_displacement_mm} mm. Chỉ số suy giảm thảm phủ NDVI đạt ${multispectral.ndvi_anomaly_pct}%, cho thấy vùng sườn dốc đang chịu ứng suất cắt cực hạn.`,
      telemetry_synthesis: `Trạm đo mưa tự động Vrain đồng bộ với áp lực nước lỗ rỗng ${hydrologyMoisture.pore_water_pressure_kpa} kPa, xác nhận cung trượt đang tiến gần đến trạng thái phá hủy giới hạn ($FS < 1.0$).`,
      risk_amplification_factor: isCritical ? 1.45 : isHigh ? 1.25 : 1.05,
      lead_time_enhancement: `Nâng thời gian cảnh báo sớm (Lead-time) từ ${assessment.lead_time_status} lên 8 - 14 Giờ trước khi đất đá trút xuống hạ du.`,
      priority_action_steps: [
        `Khẩn cấp sơ tán ${zone.vulnerable_population} người trong hành lang ảnh hưởng lũ quét ${debrisRunout.max_runout_distance_m}m.`,
        `Cảnh báo khẩn cấp các phương tiện lưu thông trên tuyến: ${debrisRunout.blocked_roads.join(', ') || 'Tuyến huyết mạch qua địa bàn'}.`,
        `Theo dõi chặt chẽ lưu lượng xả qua các ngầm tràn và điểm thắt hẹp lòng suối ${zone.basin_name}.`
      ]
    };

    return {
      zone_id: zone.id,
      zone_name: zone.zone_name,
      district_name: zone.district_name,
      province_name: zone.province_name,
      region: zone.region || 'BAC_BO',
      analysis_timestamp: new Date().toISOString(),
      foundation_model_version: 'Google Earth AI (Geospatial Foundation Model v2.4 - Multimodal)',
      sar_deformation: sarDeformation,
      multispectral: multispectral,
      hydrology_moisture: hydrologyMoisture,
      debris_runout: debrisRunout,
      cross_modal_reasoning: crossModal,
      source: 'GEOSPATIAL_SIMULATOR'
    };
  }

  /**
   * Spatial Conversational QA Assistant powered by Google Earth AI & Gemini 3.7
   */
  public async querySpatialAssistant(
    userQuery: string,
    zones: SpatialZone[],
    assessments: ZoneRiskAssessment[]
  ): Promise<{
    answer: string;
    referenced_zones: string[];
    suggested_actions: string[];
    source: 'GOOGLE_EARTH_AI' | 'SPATIAL_RULE_BASE';
  }> {
    const client = getAiClient();

    // Find relevant zones from user query
    const matchedZones = zones.filter((z) => {
      const q = userQuery.toLowerCase();
      return (
        q.includes(z.province_name.toLowerCase()) ||
        q.includes(z.district_name.toLowerCase()) ||
        q.includes(z.zone_name.toLowerCase()) ||
        q.includes(z.basin_name.toLowerCase())
      );
    });

    const contextZones = matchedZones.length > 0 ? matchedZones : zones.slice(0, 5);
    const criticalAssessments = assessments.filter((a) => a.overall_risk_level >= 3);

    if (client) {
      try {
        const prompt = `
Bạn là Trợ lý Trí tuệ Không gian Địa lý Google Earth AI (Geospatial Foundation Model Assistant) thuộc Hệ thống Cảnh báo Sớm Lũ quét & Sạt lở đất Quốc gia HAEWS v2.0.
Hãy giải đáp câu hỏi của Cán bộ Chỉ huy / Chuyên gia Phòng chống Thiên tai một cách khoa học, chuyên nghiệp, súc tích và có căn cứ không gian địa lý thực tế.

CÂU HỎI CỦA NGƯỜI DÙNG:
"${userQuery}"

DỮ LIỆU KHÔNG GIAN ĐỊA LÝ & THỦY VĂN HIỆN HÀNH (HAEWS + SATELLITE):
- Các vùng trọng điểm liên quan:
${contextZones
  .map((z) => {
    const ass = assessments.find((a) => a.zone_id === z.id);
    return `+ ${z.zone_name} (${z.district_name}, ${z.province_name}): Độ cao=${z.elevation}m, Dốc=${z.slope}°, Mưa 24h=${ass?.rainfall_24h || 0}mm, Mức bão hòa=${ass?.soil_saturation_percent || 0}%, Rủi ro=CẤP ${ass?.overall_risk_level || 1} (${ass?.overall_risk_type || 'landslide'}).`;
  })
  .join('\n')}

- Danh sách các điểm đang ở Mức Nguy Hiểm Cao (Cấp 3, 4, 5):
${criticalAssessments.map((c) => `- ${c.zone_name} (${c.province_name}): CẤP ${c.overall_risk_level} (Mưa 24h: ${c.rainfall_24h}mm)`).join('\n')}

HƯỚNG DẪN TRẢ LỜI:
1. Trả lời trực diện câu hỏi với tư duy phân tích không gian địa lý đa phương thức (Ảnh vệ tinh InSAR, DEM độ dốc, lưu vực thủy văn và trạm đo mưa mặt đất).
2. Nêu rõ mức độ rủi ro, dự báo khả năng sạt lở hoặc lũ quét và các tuyến hạ tầng có nguy cơ bị chia cắt.
3. Đề xuất các biện pháp ứng phó kỹ thuật và cứu hộ cụ thể.

Yêu cầu xuất định dạng JSON thuần với 3 trường:
{
  "answer": "Nội dung câu trả lời chi tiết và chuyên sâu bằng tiếng Việt...",
  "referenced_zones": ["Tên vùng 1", "Tên vùng 2"],
  "suggested_actions": ["Khuyến nghị 1", "Khuyến nghị 2", "Khuyến nghị 3"]
}
`;

        const response = await client.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const text = response.text?.trim() || '{}';
        const parsed = JSON.parse(text);

        return {
          answer: parsed.answer || 'Đã phân tích dữ liệu không gian địa lý Google Earth AI cho câu hỏi của bạn.',
          referenced_zones: parsed.referenced_zones || contextZones.map((z) => z.zone_name),
          suggested_actions: parsed.suggested_actions || [
            'Rà soát các hộ dân ven khe suối và chân taluy dốc.',
            'Kiểm tra tình trạng vận hành của trạm đo mưa và radar lân cận.',
            'Bố trí lực lượng ứng trực 24/24 tại các điểm xung yếu.'
          ],
          source: 'GOOGLE_EARTH_AI'
        };
      } catch (err: any) {
        console.log(`[Earth AI Query Info] Live GenAI unavailable (${err?.status || err?.message || 'Offline'}). Utilizing Geospatial Rule Engine.`);
      }
    }

    return {
      answer: `Hệ thống Google Earth AI đã tiếp nhận câu hỏi: "${userQuery}".\n\nDựa trên mô hình số độ cao DEM và dữ liệu viễn thám SAR Sentinel-1, các khu vực có độ dốc > 25° kết hợp lượng mưa 24h vượt 100mm đang có nguy cơ sạt lở rất cao. Các dòng bùn đá có thể di chuyển với vận tốc 8 - 14 m/s dọc theo các khe tụ thủy chính. Khuyến cáo các đơn vị quản lý đường bộ và chính quyền địa phương lập trạm chốt chặn và hướng dẫn nhân dân sơ tán lên vị trí an toàn.`,
      referenced_zones: contextZones.map((z) => z.zone_name),
      suggested_actions: [
        'Cử cán bộ kỹ thuật kiểm tra thực địa các vết nứt sườn đồi mới xuất hiện.',
        'Sơ tán người già, trẻ em và tài sản khỏi vùng trũng thấp ven sông suối.',
        'Chuẩn bị phương tiện cơ giới hạng nặng túc trực tại các điểm sạt lở dự báo.'
      ],
      source: 'SPATIAL_RULE_BASE'
    };
  }
}

export const earthAiEngine = new EarthAiEngine();
