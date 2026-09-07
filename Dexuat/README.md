# HAEWS v3.0 — Technical Specification Pack

## Hybrid AI Early Warning System

Bộ đặc tả kỹ thuật cho nền tảng giám sát, cảnh báo sớm và hỗ trợ điều hành ứng phó thiên tai đa nguy cơ.

### Chuỗi mục tiêu
`PHÁT HIỆN → NHẬN BIẾT → ĐÁNH GIÁ → QUYẾT ĐỊNH → HÀNH ĐỘNG → CẢNH BÁO → HỌC`

### Cấu trúc
- `00-VISION`: tầm nhìn, phạm vi, KPI.
- `01-ARCHITECTURE`: kiến trúc hệ thống, dữ liệu, event.
- `02-DATA`: data catalog, ingestion, quality, governance.
- `03-GIS`: GIS/WebGIS.
- `04-AI`: hazard, observation, fusion, impact, model governance.
- `05-INCIDENT`: incident, situation awareness, alerts.
- `06-COMMAND-CENTER`: command/operation center, resources, routes, actions.
- `07-CITIZEN`: cảnh báo và báo cáo người dân.
- `08-AI-AGENTS`: agent architecture, orchestrator, governance.
- `09-KNOWLEDGE`: KB, RAG, SOP.
- `10-SIMULATION`: what-if, replay, digital twin.
- `11-BACKEND`: API, DB, auth, security.
- `12-FRONTEND`: UI.
- `13-IMPLEMENTATION`: coding, testing, observability, deployment.
- `14-ROADMAP`: roadmap, sprint, acceptance.
- `15-AI-CODING`: prompt cho coding agents.

### Thứ tự triển khai
Foundation → Data → GIS → Observation → Hazard AI → Impact → Incident → Command Center → Citizen → AI Agents → Simulation → Digital Twin.

> Không triển khai AI Agent trước khi có dữ liệu, API, quyền truy cập và audit rõ ràng.
