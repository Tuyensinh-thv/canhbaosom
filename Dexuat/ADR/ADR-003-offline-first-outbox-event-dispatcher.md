# ADR-003: Triển khai Transactional Outbox & Idempotency trong Phát lệnh Cảnh báo và Báo cáo Hiện trường

- **Trạng thái**: `ACCEPTED`
- **Ngày quyết định**: 2026-08
- **Tác giả**: HAEWS Core Architecture Team
- **Tham chiếu**: *Awesome Architecture - Chương 11: 数据一致性工程 (Outbox & Idempotency)*

---

## 1. Bối cảnh (Context)
Lệnh cảnh báo thiên tai (Cell Broadcast BTS, SMS Brandname, Còi hú, Loa xã) và các Báo cáo hiện trường sạt lở từ cán bộ cơ sở có tính chất **sống còn (Mission-Critical)**:
1. Không được phép để mất lệnh do mạng 3G/4G chập chờn khi cán bộ đang tác chiến tại hiện trường.
2. Không được phép phát trùng lặp (Duplicate Broadcast) gây hoang mang trong nhân dân và lãng phí chi phí viễn thông khi người dùng nhấn nút nhiều lần (Double Click / Network Retries).

## 2. Các phương án cân nhắc (Considered Options)
1. **Option 1: Gửi trực tiếp qua HTTP POST thông thường** -> *Rủi ro: Mất lệnh nếu rớt mạng, hoặc gửi trùng nếu timeout nhưng máy chủ đã xử lý.*
2. **Option 2: Transactional Outbox Pattern + Client-Side Idempotency Keys + Auto-Sync Loop**

## 3. Quyết định (Decision Outcome)
**Chọn Option 2: Xây dựng `AlertOutboxManager` (`src/utils/alertQueue.ts`)**.

### Chi tiết kiến trúc:
1. **Mẫu Outbox Offline-First**:
   - Khi cán bộ bấm "Phát lệnh", thông điệp được tạo lập và lưu trữ ngay lập tức vào bộ nhớ bền vững (Local Persistence Outbox) với trạng thái `PENDING`.
   - Giao diện phản hồi ngay lập tức cho người dùng mà không cần chờ toàn bộ các kênh viễn thông phản hồi.
2. **Khóa chống trùng (Idempotency Key)**:
   - Mỗi lệnh được cấp một mã định danh duy nhất UUID v4 (`idempotency_key`) gắn vào Header `X-Idempotency-Key` và Payload.
   - Máy chủ kiểm tra khóa này: Nếu lệnh đã xử lý thành công trước đó, trả về kết quả ngay mà không kích hoạt gửi lại SMS/BTS lần thứ hai.
3. **Đồng bộ nền (Background Flush & Recovery)**:
   - Hệ thống lắng nghe sự kiện `window.addEventListener('online')` và định kỳ quét heartbeat 15 giây.
   - Khi có kết nối mạng ổn định trở lại, hàng đợi Outbox tự động truyền tải các bản tin tồn đọng theo thứ tự thời gian.

## 4. Hệ quả & Đánh đổi (Consequences & Trade-offs)
- **Tích cực**:
  - Đạt tiêu chuẩn **At-Least-Once Delivery** kết hợp **Idempotent Receiver** (tương đương chuẩn bảo toàn Exactly-Once về mặt nghiệp vụ).
  - Cán bộ hiện trường có thể soạn và phát lệnh ngay cả khi mất sóng, hệ thống sẽ tự động phát sóng ngay khi bắt được mạng.
- **Đánh đổi cần quản lý**:
  - Cần cơ chế dọn dẹp hàng đợi định kỳ (tự động xóa các mục đã hoàn tất sau 1 giờ) để tránh đầy bộ nhớ localStorage trình duyệt.
