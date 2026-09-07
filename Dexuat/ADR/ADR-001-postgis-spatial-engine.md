# ADR-001: Sử dụng PostgreSQL + PostGIS làm Động cơ Không gian Cốt lõi

- **Trạng thái**: `ACCEPTED`
- **Ngày quyết định**: 2026-08
- **Tác giả**: HAEWS Core Architecture Team

---

## 1. Bối cảnh (Context)
Hệ thống Cảnh báo sớm HAEWS v2.0 quản lý hàng ngàn lưu vực sông, điểm nguy cơ trượt lở, tọa độ trạm đo mưa tự động (Vrain), radar thời tiết và vùng dân cư xung yếu tại các tỉnh miền núi phía Bắc.
Hệ thống cần thực hiện các bài toán không gian với tần suất cao:
1. Xác định nhanh các trạm quan trắc hoặc điểm dân cư nằm trong bán kính ảnh hưởng của tâm bão / tâm lũ (`ST_DWithin` trên hệ tọa độ cầu WGS84 EPSG:4326).
2. Cắt ghép giao thoa đa giác nguy cơ sạt lở với ranh giới hành chính xã/huyện (`ST_Intersects`).
3. Truy vấn nhanh với độ trễ < 50ms khi tải đồng thời từ hàng chục ngàn người dùng và cán bộ điều hành.

## 2. Các phương án cân nhắc (Considered Options)
1. **Option 1: PostgreSQL + PostGIS Engine**
2. **Option 2: MongoDB GeoJSON Queries ($geoWithin, $nearSphere)**
3. **Option 3: Tính toán hình học thuần túy trên Node.js Memory (Turf.js / Haversine formula)**

## 3. Quyết định (Decision Outcome)
**Chọn Option 1: PostgreSQL + PostGIS**.

### Lý do lựa chọn:
- **Chuẩn công nghiệp OGC**: PostGIS là tiêu chuẩn số 1 thế giới về GIS, hỗ trợ các hàm không gian đa chiều, lập chỉ mục không gian chuyên dụng **R-Tree / GIST Index**, cho phép tìm kiếm hàng triệu điểm trong vài mili-giây.
- **Hệ thống RLS (Row-Level Security)**: Tích hợp bảo mật phân quyền dữ liệu cấp độ dòng cho từng cấp Tỉnh/Huyện/Xã.
- **Dễ dàng tích hợp Supabase / PgBouncer**: Giúp tối ưu hóa Connection Pooling và đồng bộ thời gian thực qua WebSockets (Postgres Changes CDC).

## 4. Hệ quả & Đánh đổi (Consequences & Trade-offs)
- **Tích cực**:
  - Tốc độ truy vấn không gian cực nhanh (`< 20ms` với GIST index).
  - Tương thích 100% với chuẩn định dạng GeoJSON chuẩn hóa cho Leaflet / OpenLayers / Mapbox.
  - Hỗ trợ lưu trữ độ dốc (Slope), độ cao (Elevation) từ dữ liệu mô hình số độ cao DEM (Digital Elevation Model).
- **Đánh đổi cần quản lý**:
  - Cần cấu hình đúng SRID (EPSG:4326 cho WGS84 và EPSG:3857 hoặc VN-2000 cho đo khoảng cách mét chính xác).
  - Đòi hỏi database migration scripts quản lý nghiêm ngặt (sử dụng script migration idempotent).
