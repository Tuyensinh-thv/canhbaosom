# Architecture Decision Records (ADR) - HAEWS v2.0

> **Dự án**: Hệ thống Cảnh báo sớm Thiên tai & Khẩn cấp (HAEWS)  
> **Quy chuẩn**: Dựa trên phương pháp luận *Architecture-First System Design* từ [Awesome Architecture](https://github.com/study8677/awesome-architecture) (Chương 08: 架构决策记录与演进 & Chương 23: 规格即架构).

---

## 🧭 Mục đích của kho tài liệu ADR

Tài liệu này ghi lại toàn bộ các **quyết định kiến trúc mang tính chiến lược**, bối cảnh kỹ thuật, các phương án cân nhắc, lý do lựa chọn và hệ quả (trade-offs) để đảm bảo hệ thống có thể mở rộng, bảo trì và chuyển giao lâu dài.

## 📑 Danh mục Hồ sơ Quyết định Kiến trúc

| Mã ADR | Tiêu đề quyết định | Trạng thái | Ngày duyệt | Tác động chính |
| :--- | :--- | :---: | :---: | :--- |
| **[ADR-001](ADR-001-postgis-spatial-engine.md)** | Sử dụng PostgreSQL + PostGIS làm Động cơ Không gian Cốt lõi | `ACCEPTED` | 2026-08 | Tối ưu hóa truy vấn bán kính rủi ro, phân tích đa giác lũ quét & sạt lở thời gian thực. |
| **[ADR-002](ADR-002-resilience-circuit-breaker.md)** | Cơ chế Chống sập Circuit Breaker & Graceful Degradation | `ACCEPTED` | 2026-08 | Ngăn chặn sập dây chuyền (Cascading Failure), chuyển đổi mượt sang dữ liệu Offline Fallback. |
| **[ADR-003](ADR-003-offline-first-outbox-event-dispatcher.md)** | Triển khai Transactional Outbox & Idempotency trong Phát lệnh | `ACCEPTED` | 2026-08 | Đảm bảo At-Least-Once Delivery, chống phát lặp tin nhắn khẩn cấp, hoạt động ngay cả khi mất mạng. |
| **[ADR-004](ADR-004-ai-hybrid-architecture.md)** | Kiến trúc AI Mô hình Lai (Gemini 2.0 + Deep Learning LSTM + Vật lý thủy văn) | `ACCEPTED` | 2026-08 | Kết hợp sức mạnh LLM reasoning và quy luật thủy văn chính xác, kiểm soát ảo giác (Hallucination). |

---

## 📐 Cấu trúc chuẩn của một bản ADR:
1. **Title & Status**: Mã số, tiêu đề, trạng thái (`PROPOSED`, `ACCEPTED`, `SUPERSEDED`, `DEPRECATED`).
2. **Context**: Bối cảnh, vấn đề cần giải quyết, các ràng buộc kỹ thuật.
3. **Decision Drivers**: Các yếu tố then chốt dẫn đến quyết định (SLO, độ trễ, tính bảo mật, chi phí).
4. **Considered Options**: Các phương án đã được đưa lên bàn cân.
5. **Decision Outcome**: Phương án được chọn và lý do chi tiết.
6. **Consequences & Trade-offs**: Mặt tích cực và các điểm đánh đổi cần quản lý.
