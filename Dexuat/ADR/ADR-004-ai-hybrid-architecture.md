# ADR-004: Kiến trúc AI Mô hình Lai (Gemini LLM + Deep Learning LSTM + Vật lý thủy văn) kèm Guardrails

- **Trạng thái**: `ACCEPTED`
- **Ngày quyết định**: 2026-08
- **Tác giả**: HAEWS Core Architecture Team
- **Tham chiếu**: *Awesome Architecture - Chương 17: 大模型时代的架构判断 & Chương 22: AI原生系统设计*

---

## 1. Bối cảnh (Context)
Trong công tác phòng chống thiên tai, tính chính xác và kịp thời là yếu tố sống còn:
1. Các mô hình vật lý thủy văn truyền thống có độ chính xác cao dựa trên công thức cơ bản nhưng tính toán chậm và khó thích ứng với biến đổi khí hậu cực đoan cục bộ.
2. Các mô hình Deep Learning (LSTM, Nowcasting Radar) xử lý chuỗi thời gian cực nhanh nhưng thiếu khả năng diễn giải ngữ nghĩa cho người chỉ huy.
3. Các mô hình Large Language Models (Gemini 2.0 Flash) có năng lực tổng hợp, suy luận tình huống và lập công điện tác chiến rất mạnh, nhưng có rủi ro ảo giác (Hallucination) nếu để tự suy diễn số liệu mưa hoặc ngưỡng an toàn.

## 2. Các phương án cân nhắc (Considered Options)
1. **Option 1: Chỉ sử dụng mô hình AI LLM sinh toàn bộ kết luận và số liệu** -> *Rủi ro nghiêm trọng về ảo giác.*
2. **Option 2: Chỉ dùng luật vật lý cổ điển** -> *Kém linh hoạt, chậm trễ trong việc đưa ra khuyến cáo tổng hợp.*
3. **Option 3: Kiến trúc AI Lai 3 Lớp (Hybrid Tri-Layer AI Architecture) có Guardrails và Fallback**

## 3. Quyết định (Decision Outcome)
**Chọn Option 3: Kiến trúc AI Lai 3 Lớp**.

```
  [ LỚP 1: QUAN TRẮC VẬT LÝ & IOT ]
   ├─ Mưa tích lũy 1h/3h/6h/24h (Vrain)
   ├─ Độ ẩm bão hòa đất (Soil Moisture Satellite)
   └─ Độ dốc sườn núi (DEM Slope)
                │
                ▼
  [ LỚP 2: DEEP LEARNING & VẬT LÝ THỦY VĂN ]
   ├─ Mô hình LSTM dự báo mực nước thủy văn & lưu lượng đỉnh lũ
   ├─ Mô hình Nowcasting Radar phản hồi vô tuyến 15-60 phút
   └─ Physical Threshold Overrides: Ngưỡng mưa cực đoan (>50mm/1h hoặc bão hòa >85%)
                │
                ▼
  [ LỚP 3: AI REASONING & DISPATCH GENERATOR (Gemini 2.0) ]
   ├─ RAG Grounding: Chỉ được suy luận dựa trên dữ liệu đã chuẩn hóa từ Lớp 1 & Lớp 2
   ├─ Output Guardrails: Khóa chặt định dạng JSON / Báo cáo chuẩn thể thức PCTT
   └─ AI Copilot: Trả lời câu hỏi tham mưu tác chiến cho sở chỉ huy 24/7
```

## 4. Hệ quả & Đánh đổi (Consequences & Trade-offs)
- **Tích cực**:
  - Loại bỏ hoàn toàn rủi ro bị ảo giác số liệu mưa hoặc cấp độ rủi ro thiên tai.
  - Tận dụng tối đa thế mạnh xử lý ngôn ngữ và lập luận tình huống khẩn cấp của Gemini 2.0 Flash.
  - Phù hợp với chuẩn hướng dẫn AI-native của *Awesome Architecture*.
- **Đánh đổi cần quản lý**:
  - Cần duy trì schema kiểm tra định dạng dữ liệu đầu ra nghiêm ngặt (Strict Schema Validation).
