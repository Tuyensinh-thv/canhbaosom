import { GoogleGenAI } from '@google/genai';
import { SpatialZone, ZoneRiskAssessment } from '../../src/types';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });
  }
  return aiClient;
}

export async function generateDeepTacticalConsultation(
  zone: SpatialZone,
  assessment: ZoneRiskAssessment
): Promise<{
  tactical_analysis: string;
  evacuation_plan: string;
  infrastructure_protection: string;
  source: 'GEMINI_AI' | 'DETERMINISTIC_EXPERT_SYSTEM';
}> {
  const client = getAiClient();

  if (client) {
    try {
      const prompt = `
Bạn là Chuyên gia Cao cấp về Cảnh báo Sớm Thiên tai & Chỉ huy Cứu hộ Cứu nạn thuộc Ban Chỉ đạo Quốc gia về Phòng chống Thiên tai (Việt Nam).
Hãy phân tích tình huống khẩn cấp sau đây từ Hệ thống AI Lai HAEWS v2.0:

THÔNG TIN VÙNG NGUY CƠ:
- Địa bàn: ${zone.zone_name}, ${zone.district_name}, ${zone.province_name}
- Độ cao: ${zone.elevation}m, Độ dốc: ${zone.slope}°, Hướng sườn: ${zone.aspect}
- Địa chất: ${zone.geology_sensitivity} (${zone.soil_type})
- Lưu vực: ${zone.basin_name} (Diện tích: ${zone.basin_area_km2}km², Độ dốc lòng suối: ${zone.channel_gradient}%)
- Dân số có nguy cơ: ${zone.vulnerable_population} người
- Hạ tầng trọng yếu: ${zone.critical_facilities.join(', ')}

DỮ LIỆU THỦY VĂN & ĐÁNH GIÁ RỦI RO HAEWS:
- Lượng mưa: 1h=${assessment.rainfall_1h}mm/h, 3h=${assessment.rainfall_3h}mm, 24h=${assessment.rainfall_24h}mm
- Mức bão hòa đất: ${assessment.soil_saturation_percent}%
- Nguy cơ tổng hợp: CẤP ${assessment.overall_risk_level} (${assessment.overall_risk_type})
- Cơ chế kích hoạt: ${assessment.trigger_type} (${assessment.trigger_detail})
- Lead-time 30-60m: ${assessment.lead_time_status}

Yêu cầu xuất định dạng JSON thuần với 3 trường:
1. "tactical_analysis": Đánh giá động lực học dòng chảy lũ bùn đá hoặc trượt trượt đất, nguy cơ tắc nghẽn khe tụ thủy, khả năng vỡ túi nước trên đỉnh núi.
2. "evacuation_plan": Lộ trình và phương án sơ tán ${zone.vulnerable_population} nhân khẩu, thứ tự ưu tiên, điểm tập kết an toàn tránh sạt taluy âm/dương.
3. "infrastructure_protection": Hướng dẫn kỹ thuật bảo vệ các công trình trọng yếu (${zone.critical_facilities.join(', ')}), kiểm soát ngầm tràn và an toàn điện lưới.
Chỉ trả về chuỗi JSON hợp lệ, không bọc markdown.
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
        tactical_analysis: parsed.tactical_analysis || assessment.explanation_summary,
        evacuation_plan: parsed.evacuation_plan || assessment.safety_recommendations.join('\n'),
        infrastructure_protection: parsed.infrastructure_protection || `Bảo vệ ${zone.critical_facilities.join(', ')}`,
        source: 'GEMINI_AI'
      };
    } catch (err: any) {
      console.log(`[Gemini Consult Info] Live GenAI unavailable (${err?.status || err?.message || 'Offline'}). Utilizing Expert Decision Matrix.`);
    }
  }

  // Deterministic Fallback Expert Response
  return {
    tactical_analysis: `Phân tích Động lực học: Với lượng mưa 24h đạt ${assessment.rainfall_24h}mm và sườn núi dốc ${zone.slope}°, lớp đất phong hóa sét biến chất bão hòa ${assessment.soil_saturation_percent}% đã mất liên kết chịu cắt. Nguy cơ hình thành khối trượt trượt sâu từ độ cao ${zone.elevation}m đè dồn xuống lòng suối với vận tốc dòng chảy lũ quét ước tính 6-12 m/s.`,
    evacuation_plan: `Kế hoạch Sơ tán: 1. Khẩn cấp di dời ${zone.vulnerable_population} người theo sườn núi thoải ngược hướng dốc tụ thủy; 2. Tập kết tại điểm cao ráo không nằm dưới chân vách đá; 3. Tổ chức đội xung kích kiểm đếm danh sách từng hộ dân trước khi bóng tối buông xuống.`,
    infrastructure_protection: `Bảo vệ Hạ tầng: 1. Phong tỏa tuyệt đối 2 đầu cầu/đường: ${zone.critical_facilities.join('; ')}; 2. Cắt điện các trạm biến áp hạ thế trong phạm vi bán kính ngập 200m; 3. Cắm cọc tiêu đo mớn nước tại các ngầm tràn dân sinh.`,
    source: 'DETERMINISTIC_EXPERT_SYSTEM'
  };
}

export async function askWarRoomCopilot(
  query: string,
  systemContext: {
    total_active_warnings: number;
    level_5_zones: string[];
    level_4_zones: string[];
    max_rainfall_24h: number;
    highest_risk_station: string;
    critical_reservoirs: string[];
  }
): Promise<{
  reply: string;
  suggested_actions: string[];
  bulletin_draft?: string;
  source: 'GEMINI_AI' | 'DETERMINISTIC_EXPERT_SYSTEM';
}> {
  const client = getAiClient();

  if (client) {
    try {
      const prompt = `
Bạn là Trợ lý AI Tham mưu Tác chiến Cao cấp (HAEWS AI War Room Copilot) phục vụ Trưởng Ban Chỉ huy Phòng thủ Dân sự & Phòng chống Thiên tai Việt Nam.

HIỆN TRẠNG HỆ THỐNG CẢNH BÁO THỜI GIAN THỰC (HAEWS v2.0):
- Tổng số điểm cảnh báo nguy cấp (Cấp 3-5): ${systemContext.total_active_warnings}
- Các vùng Báo động Đỏ Thảm Họa Cấp 5: ${systemContext.level_5_zones.join(', ') || 'Không có'}
- Các vùng Nguy cơ Rất Lớn Cấp 4: ${systemContext.level_4_zones.join(', ') || 'Không có'}
- Lượng mưa 24h kỷ lục ghi nhận: ${systemContext.max_rainfall_24h} mm (tại ${systemContext.highest_risk_station})
- Hồ chứa & Thủy điện trọng điểm đang giám sát: ${systemContext.critical_reservoirs.join(', ')}

CÂU HỎI / YÊU CẦU CỦA CHỈ HUY:
"${query}"

Hãy đóng vai chuyên gia chỉ huy tác chiến thực địa:
1. Đưa ra phản hồi súc tích, đanh thép, chuẩn ngôn ngữ quân sự/phòng chống thiên tai Việt Nam.
2. Nêu rõ các hành động tác chiến cần triển khai ngay lập tức theo phương châm "4 tại chỗ".
3. Nếu người dùng yêu cầu soạn công điện/bản tin khẩn, hãy đính kèm dự thảo văn bản chuẩn thể thức Ban Chỉ đạo.

Xuất định dạng JSON thuần:
{
  "reply": "Nội dung phân tích & giải đáp chi tiết bằng tiếng Việt...",
  "suggested_actions": ["Hành động 1...", "Hành động 2...", "Hành động 3..."],
  "bulletin_draft": "Dự thảo Công điện khẩn cấp (nếu có, hoặc để trống)"
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
        reply: parsed.reply || 'Đã tiếp nhận yêu cầu tác chiến. Hệ thống đang rà soát dữ liệu toàn tuyến.',
        suggested_actions: parsed.suggested_actions || [
          'Kích hoạt phương án ứng phó cấp tỉnh',
          'Sơ tán dân cư vùng trũng thấp ven suối',
          'Cắt cử lực lượng canh gác ngầm tràn 24/24'
        ],
        bulletin_draft: parsed.bulletin_draft,
        source: 'GEMINI_AI'
      };
    } catch (err: any) {
      console.log(`[Copilot AI Info] Live GenAI unavailable (${err?.status || err?.message}). Using Tactical Fallback.`);
    }
  }

  // Fallback Response
  return {
    reply: `BÁO CÁO THAM MƯU TÁC CHIẾN HAEWS: Hiện tại trên toàn tuyến miền núi phía Bắc đang có ${systemContext.total_active_warnings} điểm nguy cơ cao, trong đó trọng điểm là ${systemContext.level_5_zones.join(', ') || systemContext.level_4_zones.join(', ') || 'các sườn dốc Hoàng Liên Sơn & Thượng nguồn Sông Chảy'}. Lượng mưa 24h lớn nhất đo được là ${systemContext.max_rainfall_24h}mm. Khuyến nghị Ban Chỉ huy triển khai ngay các tổ tuần tra sườn đồi và chốt chặn ngầm tràn xung yếu.`,
    suggested_actions: [
      `1. Phát lệnh sơ tán khẩn cấp các hộ dân có nhà ở chân taluy âm/dương tại ${systemContext.level_5_zones[0] || 'vùng tâm mưa'}`,
      '2. Điều tiết xả tràn chủ động tại các hồ thủy điện nhỏ, tuyệt đối không để xảy ra sự cố vỡ đập dây chuyền',
      '3. Cấm tuyệt đối người dân và phương tiện qua lại các ngầm tràn, khe suối khi nước đang dâng cao'
    ],
    bulletin_draft: `CÔNG ĐIỆN HỎA TỐC\nBan Chỉ huy PCTT & TKCN\nKính gửi: UBND các Huyện trọng điểm thiên tai\nYêu cầu huy động tối đa lực lượng xung kích ứng phó đợt mưa lũ cực đoan, bảo đảm an toàn tính mạng người dân lên trên hết.`,
    source: 'DETERMINISTIC_EXPERT_SYSTEM'
  };
}

