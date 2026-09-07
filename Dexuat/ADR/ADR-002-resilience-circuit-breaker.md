# ADR-002: Cơ chế Chống sập Circuit Breaker & Graceful Degradation

- **Trạng thái**: `ACCEPTED`
- **Ngày quyết định**: 2026-08
- **Tác giả**: HAEWS Core Architecture Team
- **Tham chiếu**: *Awesome Architecture - Chương 12: 为失败而设计·韧性工程*

---

## 1. Bối cảnh (Context)
Trong các đợt thiên tai quy mô lớn (siêu bão, mưa lũ cực đoan), hệ thống HAEWS phải đối mặt với các nguy cơ:
1. Các API bên ngoài (dữ liệu radar vệ tinh quốc tế, API dự báo bão JTWC, Gemini LLM API) bị chậm, timeout hoặc quá hạn mức (Rate-limit 429).
2. Lưu lượng truy cập đột biến từ người dân có thể gây hiệu ứng sập dây chuyền (Cascading Failures) nếu máy chủ bị tắc nghẽn ở các kết nối chờ API ngoại vi.
3. Trung tâm điều hành khẩn cấp không được phép xuất hiện màn hình trắng (Blank Screen) hoặc lỗi hệ thống nghiêm trọng.

## 2. Các phương án cân nhắc (Considered Options)
1. **Option 1: Thử lại vô hạn (Infinite Retry)** -> *Rủi ro: Làm tràn hàng đợi socket, cạn kiệt tài nguyên máy chủ.*
2. **Option 2: Chỉ dùng try/catch đơn giản tại từng view** -> *Rủi ro: Không có cơ chế tự ngắt mạch khi upstream server bị down liên tục.*
3. **Option 3: Mô hình Circuit Breaker + Exponential Backoff with Jitter + Graceful Fallback Cache**

## 3. Quyết định (Decision Outcome)
**Chọn Option 3: Hiện thực lớp Circuit Breaker chuyên dụng (`src/utils/resilience.ts`)**.

### Chi tiết kiến trúc:
- **3 Trạng thái Circuit Breaker**:
  - `CLOSED` (Bình thường): Mọi request thông suốt.
  - `OPEN` (Ngắt mạch): Khi có $\ge 3$ lỗi liên tiếp, lập tức Fast-Fail và trả về dữ liệu dự phòng (Fallback) trong 15 giây mà không làm nghẽn mạng.
  - `HALF_OPEN` (Thăm dò): Sau 15 giây, gửi thử 1 request kiểm tra. Nếu thành công liên tiếp 2 lần $\to$ chuyển về `CLOSED`.
- **Phân tách Breaker theo từng dịch vụ (Bulkhead Isolation)**:
  - `circuitBreakers.geo`: Dành riêng cho GIS / Bản đồ.
  - `circuitBreakers.ai`: Dành cho Gemini AI Copilot & Earth AI (Timeout dài hơn 12s, Threshold = 2).
  - `circuitBreakers.broadcast`: Dành cho cổng phát lệnh khẩn cấp.
- **Graceful Fallback**: Luôn có bộ dữ liệu Baseline tĩnh (`createFallbackWarningMap()`) sẵn sàng hiển thị khi mạng mất hoàn toàn.

## 4. Hệ quả & Đánh đổi (Consequences & Trade-offs)
- **Tích cực**:
  - Đảm bảo độ sẵn sàng của Dashboard tác chiến đạt mức tối đa ngay cả trong điều kiện mạng bão lũ khắc nghiệt.
  - Bảo vệ hạ tầng khỏi hiện tượng "Thundering Herd" nhờ Full Jitter Backoff.
- **Đánh đổi cần quản lý**:
  - Dữ liệu hiển thị trong lúc Circuit Breaker ở trạng thái `OPEN` là dữ liệu dự phòng/bộ đệm, cần có thông báo rõ ràng cho người điều hành biết hệ thống đang chạy ở chế độ Fallback Cache.
