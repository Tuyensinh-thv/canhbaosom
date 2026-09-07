# HAEWS — IMPLEMENTATION MASTER PLAN
## Hybrid AI Early Warning System
### Implementation-Ready Specification v3.1

> **Status:** Implementation-ready baseline  
> **Primary MVP:** Flash Flood + Landslide  
> **Architecture:** Data + GIS + Hybrid AI + Incident + Command Center + Citizen + AI Agents + Simulation

---

## 1. MỤC TIÊU

HAEWS là hệ thống cảnh báo sớm lấy dữ liệu làm trung tâm, hướng tới một **trung tâm tác chiến thông minh** có khả năng:

- tiếp nhận dữ liệu gần thời gian thực;
- giám sát không gian bằng GIS;
- phát hiện bất thường;
- dự báo nguy cơ bằng Hybrid AI;
- hợp nhất bằng chứng đa nguồn;
- đánh giá tác động;
- quản lý sự cố;
- hỗ trợ ra quyết định;
- điều phối nguồn lực;
- phát cảnh báo;
- cung cấp thông tin cá nhân hóa cho người dân;
- replay/simulation để học từ sự kiện.

Luồng tổng thể:

```text
DATA
 ↓
GIS
 ↓
OBSERVATION
 ↓
HAZARD AI
 ↓
EVIDENCE FUSION
 ↓
IMPACT
 ↓
INCIDENT
 ↓
SITUATION AWARENESS
 ↓
COMMAND CENTER
 ↓
DECISION SUPPORT
 ↓
CITIZEN ALERT
 ↓
RESPONSE
 ↓
LEARNING
```

> Các ngưỡng trong MVP chỉ là cấu hình kỹ thuật/tham chiếu. Không được coi là ngưỡng vận hành chính thức nếu chưa được cơ quan chuyên môn phê duyệt và hiệu chuẩn.

---

## 2. NGUYÊN TẮC KIẾN TRÚC

### 2.1 Data-first

Không bắt đầu bằng AI Agent. Phải xây nền dữ liệu, GIS, risk engine và incident trước.

### 2.2 AI không thay thế dữ liệu

Mọi AI output phải có:

```text
source
timestamp
quality_state
provenance
model_version
```

### 2.3 Phân biệt thông tin

```text
FACT
OBSERVATION
PREDICTION
INFERENCE
RECOMMENDATION
SIMULATION
```

### 2.4 Human-in-the-loop

AI được phép:

- phát hiện;
- phân tích;
- dự báo;
- xếp hạng;
- đề xuất.

Các hành động nhạy cảm phải có authorization và/hoặc human approval theo policy.

---

## 3. TECHNOLOGY STACK

| Layer | Technology |
|---|---|
| Backend | Python 3.11+ |
| API | FastAPI |
| Database | PostgreSQL 16+ |
| Spatial | PostGIS |
| GIS | GeoPandas, Shapely, Rasterio |
| ML | XGBoost, Scikit-learn |
| Cache | Redis |
| Worker | Celery/RQ hoặc async worker |
| Frontend MVP | HTML/CSS/JavaScript |
| WebGIS | Leaflet |
| API | JSON + GeoJSON |
| Auth | OAuth2/OIDC hoặc JWT |
| Container | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Storage | S3-compatible object storage |

Production phải pin version và không dùng image/package `latest`.

---

## 4. SOURCE TREE

```text
haews/
├── README.md
├── .env.example
├── docker-compose.yml
├── Makefile
├── docs/
│   ├── architecture/
│   ├── adr/
│   ├── api/
│   ├── data/
│   ├── models/
│   └── operations/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── engines/
│   │   ├── workers/
│   │   └── integrations/
│   ├── migrations/
│   ├── tests/
│   └── Dockerfile
├── frontend/
├── data/
│   ├── raw/
│   ├── processed/
│   ├── samples/
│   └── mock/
├── models/
│   ├── registry/
│   ├── artifacts/
│   └── evaluation/
├── scripts/
│   ├── init_db.py
│   ├── seed_demo.py
│   └── mock_rain_generator.py
└── .github/workflows/
```

---

## 5. ENVIRONMENT

```env
APP_ENV=development
APP_NAME=haews
APP_VERSION=0.1.0

DATABASE_URL=postgresql+psycopg://haews:change_me@db:5432/haews
REDIS_URL=redis://redis:6379/0

JWT_SECRET=change_me
JWT_ALGORITHM=HS256

CORS_ORIGINS=http://localhost:5173,http://localhost:8000

LOG_LEVEL=INFO
MODEL_DIR=/app/models
DATA_DIR=/app/data

ENABLE_MOCK_DATA=true
ENABLE_AI=false
ENABLE_NOTIFICATIONS=false
```

Không commit `.env`.

---

## 6. DOCKER BASELINE

Services:

```text
db
redis
backend
worker
frontend
```

Database:

```yaml
services:
  db:
    image: postgis/postgis:16-3.4
    environment:
      POSTGRES_DB: haews
      POSTGRES_USER: haews
      POSTGRES_PASSWORD: change_me
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

---

## 7. DATABASE CORE

### Extensions

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### Spatial Grid

```sql
CREATE TABLE spatial_grid (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grid_code VARCHAR(100) UNIQUE NOT NULL,
    elevation_m DOUBLE PRECISION,
    slope_deg DOUBLE PRECISION,
    aspect_deg DOUBLE PRECISION,
    soil_type VARCHAR(100),
    geological_sensitivity DOUBLE PRECISION,
    geom geometry(Polygon, 4326) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_spatial_grid_geom
ON spatial_grid USING GIST (geom);
```

### Rainfall Stations

```sql
CREATE TABLE rainfall_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255),
    geom geometry(Point, 4326) NOT NULL,
    elevation_m DOUBLE PRECISION,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    expected_interval_seconds INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rainfall_stations_geom
ON rainfall_stations USING GIST (geom);
```

### Rainfall Logs

```sql
CREATE TABLE rainfall_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id UUID NOT NULL REFERENCES rainfall_stations(id),
    observed_at TIMESTAMPTZ NOT NULL,
    rainfall_1h_mm DOUBLE PRECISION,
    rainfall_3h_mm DOUBLE PRECISION,
    rainfall_6h_mm DOUBLE PRECISION,
    rainfall_24h_mm DOUBLE PRECISION,
    quality_state VARCHAR(20) NOT NULL DEFAULT 'VALID',
    source VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rainfall_logs_station_time
ON rainfall_logs(station_id, observed_at DESC);
```

### Risk Assessments

```sql
CREATE TABLE risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grid_id UUID NOT NULL REFERENCES spatial_grid(id),
    hazard_type VARCHAR(50) NOT NULL,
    assessed_at TIMESTAMPTZ NOT NULL,
    probability DOUBLE PRECISION,
    risk_level INTEGER NOT NULL,
    confidence DOUBLE PRECISION,
    model_version VARCHAR(100),
    rules_version VARCHAR(100),
    evidence_count INTEGER DEFAULT 0,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_risk_grid_time
ON risk_assessments(grid_id, assessed_at DESC);
```

### Incidents

```sql
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_type VARCHAR(50) NOT NULL,
    severity INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DETECTED',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    confidence DOUBLE PRECISION,
    geom geometry(Point, 4326),
    detected_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_incidents_geom
ON incidents USING GIST (geom);
```

### Audit

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    before_data JSONB,
    after_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 8. DATA CONTRACT

### Observation

```json
{
  "event_id": "uuid",
  "source_id": "rain-station-001",
  "source_type": "rainfall",
  "observed_at": "2026-08-25T10:00:00Z",
  "location": {"lat": 21.0, "lon": 104.0},
  "payload": {
    "rainfall_1h_mm": 42.3,
    "rainfall_3h_mm": 75.1,
    "rainfall_24h_mm": 121.4
  },
  "quality_state": "VALID"
}
```

### Risk

```json
{
  "risk_id": "uuid",
  "grid_id": "uuid",
  "hazard_type": "LANDSLIDE",
  "assessed_at": "ISO-8601",
  "probability": 0.83,
  "risk_level": 4,
  "confidence": 0.79,
  "model_version": "landslide-xgb-0.1.0",
  "rules_version": "rules-0.1.0",
  "evidence": []
}
```

### Incident

```json
{
  "incident_id": "uuid",
  "incident_type": "LANDSLIDE",
  "severity": 4,
  "status": "DETECTED",
  "location": {},
  "confidence": 0.88,
  "evidence_ids": []
}
```

---

## 9. DATA INGESTION

```text
SOURCE
 ↓
ADAPTER
 ↓
AUTHENTICATION
 ↓
RAW STORAGE
 ↓
SCHEMA VALIDATION
 ↓
QUALITY CHECK
 ↓
NORMALIZATION
 ↓
DATABASE
 ↓
EVENT
 ↓
RISK ENGINE
```

Adapter:

```python
class DataAdapter(Protocol):
    def fetch(self) -> list[dict]:
        ...

    def normalize(self, payload: dict) -> dict:
        ...

    def health(self) -> dict:
        ...
```

Adapters:

```text
MockRainAdapter
RainGaugeAdapter
RiverGaugeAdapter
WeatherAdapter
RadarAdapter
SatelliteAdapter
CameraAdapter
IoTAdapter
CitizenAdapter
```

---

## 10. MOCK REALTIME

MVP:

- 10 trạm;
- interval cấu hình được;
- max rainfall cấu hình được;
- random seed;
- normal/storm scenario;
- graceful shutdown.

```bash
python scripts/mock_rain_generator.py   --stations 10   --interval 10   --max-rain 80   --seed 42
```

Mock data không được dùng trong production.

---

## 11. FEATURE ENGINEERING

Static:

```text
elevation
slope
aspect
soil_type
geological_sensitivity
distance_to_river
drainage_density
```

Dynamic:

```text
R1h
R3h
R6h
R24h
rainfall_rate_change
rainfall_acceleration
river_level
river_rate_of_rise
```

Temporal:

```text
hour
day
season
rolling_mean
rolling_max
rolling_sum
```

Mỗi feature phải có:

```text
name
type
unit
source
calculation
missing_policy
range
version
```

---

## 12. HYBRID AI

```text
Rainfall + Terrain
        ↓
   XGBoost Model
        ↓
   Probability
        +
Physical / Domain Rules
        ↓
 Evidence Fusion
        ↓
   Risk Level
```

Output:

```python
@dataclass
class RiskPrediction:
    probability: float
    confidence: float
    risk_level: int
    model_version: str
    evidence: list
```

Rules phải cấu hình được:

```yaml
rules:
  rainfall_1h:
    warning_threshold: configurable
  rainfall_3h:
    warning_threshold: configurable
  rainfall_24h:
    warning_threshold: configurable
```

Không hard-code threshold trong Python.

---

## 13. RISK ENGINE

```text
Input
 ↓
Validate
 ↓
Feature extraction
 ↓
ML prediction
 ↓
Physical rule evaluation
 ↓
Evidence fusion
 ↓
Risk classification
 ↓
Persist
 ↓
Publish RiskLevelChanged
```

Output:

```json
{
  "hazard_type": "LANDSLIDE",
  "probability": 0.83,
  "risk_level": 4,
  "confidence": 0.81,
  "explanation": [
    "rainfall_24h_high",
    "slope_high",
    "geological_sensitivity_high"
  ]
}
```

MVP risk levels:

```text
1 Low
2 Moderate
3 High
4 Very High
5 Catastrophic
```

Mapping chính thức phải được xác nhận trước production.

---

## 14. EVIDENCE FUSION

Nguồn:

```text
Rainfall
River
Radar
Satellite
Camera
AI model
Citizen report
Historical event
Expert verification
```

```python
@dataclass
class Evidence:
    id: str
    type: str
    source_id: str
    observed_at: datetime
    confidence: float
    quality_state: str
    location: object
    payload_ref: str
```

Fusion phải version hóa:

```text
fusion_method
fusion_version
inputs
output
```

Không cộng confidence một cách cơ học.

---

## 15. IMPACT ENGINE

Framework:

```text
IMPACT
=
HAZARD
×
EXPOSURE
×
VULNERABILITY
×
ACCESSIBILITY
```

Exposure:

```text
population
households
schools
hospitals
roads
bridges
utilities
critical facilities
```

Output:

```json
{
  "population_at_risk": 1250,
  "households_at_risk": 320,
  "roads_affected_km": 8.2,
  "schools_at_risk": 3,
  "health_facilities_at_risk": 1,
  "priority_score": 0.88
}
```

Framework cần hiệu chuẩn trước khi dùng cho quyết định thực tế.

---

## 16. INCIDENT ENGINE

Sources:

```text
Risk threshold crossed
AI observation
Citizen report
Operator input
External alert
```

Deduplication:

```text
spatial overlap
+
temporal distance
+
hazard type
```

Lifecycle:

```text
DETECTED
 ↓
TRIAGED
 ↓
VERIFIED
 ↓
ACTIVE
 ↓
RESPONDING
 ↓
RESOLVED
 ↓
CLOSED
```

Mọi transition phải audit.

---

## 17. COMMAND CENTER

### Executive Dashboard

```text
┌────────────────────────────────────────────┐
│ SYSTEM HEALTH | TIME | DATA FRESHNESS      │
├──────┬──────┬──────┬──────┬───────────────┤
│ CRIT │ INC  │ PPL  │ ROAD │ RESOURCES     │
├──────┴──────┴──────┴──────┴───────────────┤
│                 WEB GIS                    │
├────────────────────┬───────────────────────┤
│ ACTIVE INCIDENTS   │ AI SITUATION          │
├────────────────────┼───────────────────────┤
│ TIMELINE           │ RECOMMENDATIONS       │
└────────────────────┴───────────────────────┘
```

Operation Center:

```text
See
→ Verify
→ Assign
→ Track
→ Resolve
```

Resource states:

```text
AVAILABLE
ASSIGNED
EN_ROUTE
ON_SCENE
UNAVAILABLE
```

---

## 18. API

Base:

```text
/api/v1
```

```http
GET /health
GET /health/dependencies

GET /stations
GET /stations/{id}
GET /stations/{id}/observations

GET /risk/map
GET /risk/{grid_id}
GET /risk/timeline

GET /incidents
POST /incidents
GET /incidents/{id}
PATCH /incidents/{id}

GET /impact/{zone_id}

GET /resources
GET /resources/available
POST /resources/{id}/assign

GET /alerts
POST /alerts
POST /alerts/{id}/approve
POST /alerts/{id}/issue

POST /citizen/reports
GET /citizen/alerts

POST /ai/risk-assessment
POST /ai/situation-summary
POST /ai/recommendation
```

---

## 19. GEOJSON

`GET /api/v1/risk/map`

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": []
      },
      "properties": {
        "grid_id": "G001",
        "risk_level": 4,
        "probability": 0.83,
        "confidence": 0.81,
        "rainfall_1h": 65.2,
        "rainfall_24h": 185.2,
        "model_version": "landslide-xgb-0.1.0",
        "assessed_at": "ISO-8601"
      }
    }
  ]
}
```

---

## 20. WEBGIS

Layers:

```text
Base map
Risk polygons
Rain stations
Incidents
Evacuation points
Critical facilities
Roads
```

Interactions:

- zoom/pan;
- layer toggle;
- time slider;
- risk filter;
- incident filter;
- source filter;
- polygon popup;
- station popup;
- incident drill-down.

MVP có thể polling 10 giây. Khi scale tăng dùng WebSocket/SSE.

---

## 21. CITIZEN PLATFORM

Người dân phải có thể trả lời 5 câu hỏi:

```text
Tôi đang ở đâu?
Tôi có nguy cơ không?
Nguy cơ gì?
Tôi phải làm gì?
Đi đâu an toàn?
```

Chức năng:

```text
Personalized risk
Geo-fence warning
Map
Citizen report
Evacuation point
Safe route
Emergency contact
```

Privacy-by-design: không lưu vị trí liên tục nếu không cần.

---

## 22. NOTIFICATION ENGINE

Channels:

```text
Web
Push
SMS
Email
Mobile App
Public display
Loudspeaker
External APIs
```

Delivery:

```text
QUEUED
SENT
DELIVERED
FAILED
ACKNOWLEDGED
EXPIRED
```

Escalation policy phải cấu hình và phê duyệt.

---

## 23. AI AGENTS

Hierarchy:

```text
                 ORCHESTRATOR
                       │
      ┌────────────────┼────────────────┐
      ↓                ↓                ↓
 Situation          Hazard           Impact
      │                │                │
      └────────────────┼────────────────┘
                       ↓
                 Response Agent
                       ↓
                 Human Approval
                       ↓
                     Action
```

Allowlisted tools:

```text
get_current_risk()
get_recent_observations()
get_incidents()
get_impact()
get_resources()
search_sop()
calculate_route()
create_draft_alert()
```

Không cho Agent tự ý thực hiện action nhạy cảm nếu chưa có authorization.

---

## 24. SITUATION AGENT

Input:

```text
current_time
risk_map
active_incidents
rainfall
river
forecast
impact
resources
recent_changes
```

Output:

```json
{
  "summary": "...",
  "changes": [],
  "priority_incidents": [],
  "forecast_concerns": [],
  "recommendations": [],
  "evidence": [],
  "confidence": 0.82,
  "generated_at": "ISO-8601"
}
```

Nếu thiếu dữ liệu phải nói rõ:

```text
Không đủ dữ liệu để kết luận.
```

---

## 25. KNOWLEDGE + RAG

```text
PDF/DOCX
 ↓
Parser
 ↓
Metadata
 ↓
Chunk
 ↓
Embedding
 ↓
Vector index
 ↓
Retriever
 ↓
Reranker
 ↓
LLM
 ↓
Citation
```

Metadata:

```text
document_id
title
version
effective_date
issuer
jurisdiction
status
classification
```

Chỉ tài liệu `ACTIVE` được dùng làm SOP mặc định.

---

## 26. SOP ENGINE

```yaml
sop_id:
trigger:
severity:
preconditions:
actions:
responsible_role:
approval_required:
deadline:
escalation:
evidence_required:
```

Ví dụ:

```yaml
sop_id: FLOOD-001
trigger: "river_rate_of_rise > configured_threshold"
severity: 3
responsible_role: OPERATOR
approval_required: true
actions:
  - verify_sensor
  - inspect_downstream_area
  - prepare_warning
```

Không hard-code SOP trong prompt Agent.

---

## 27. SIMULATION / WHAT-IF

Input:

```text
rainfall +20%
rainfall +50%
river +1m
road closure
bridge failure
resource shortage
```

Output:

```text
risk change
impact change
population affected
resource demand
response time
recommended action
```

Scenario phải lưu:

```text
scenario_id
created_by
created_at
assumptions
model_versions
data_snapshot
```

Simulation state tách khỏi live state.

---

## 28. OBSERVABILITY

Metrics:

```text
api_request_latency
api_error_rate
database_latency
queue_lag
data_freshness
model_inference_latency
model_error_rate
risk_assessment_count
active_incidents
alert_delivery_rate
notification_failure_rate
agent_tool_calls
agent_latency
```

Correlation ID:

```text
Source
 → Ingestion
 → Risk
 → Incident
 → Agent
 → Alert
 → User
```

---

## 29. SECURITY

Mandatory:

- TLS;
- secret management;
- RBAC;
- validation;
- rate limit;
- audit logs;
- backup;
- dependency scan;
- container scan;
- security headers;
- least privilege.

AI security:

```text
Prompt injection
Tool abuse
Data exfiltration
Unauthorized action
Untrusted citizen content
Malicious documents
Model poisoning
```

---

## 30. BACKUP / DR

MVP:

```text
Daily full backup
+
Point-in-time recovery where supported
+
Off-site copy
```

Initial target:

```text
RPO ≤ 24h
RTO ≤ 4h
```

Backup phải được kiểm thử restore.

---

## 31. TEST STRATEGY

Unit:

```text
risk rules
feature calculations
validators
serializers
```

Integration:

```text
database
PostGIS
API
worker
model service
```

E2E:

```text
Mock rainfall
 ↓
Risk
 ↓
Incident
 ↓
Impact
 ↓
Recommendation
 ↓
Alert draft
 ↓
Approval
 ↓
Notification
```

Failure tests:

```text
Database down
Redis down
AI unavailable
Source unavailable
Stale sensor
Invalid GPS
Duplicate event
Conflicting evidence
Notification failure
```

---

## 32. AI MODEL EVALUATION

Metrics:

```text
Precision
Recall
F1
ROC-AUC
PR-AUC
Brier Score
Calibration
Lead Time
False Alarm Rate
Miss Rate
```

Operational KPI:

```text
Warning Lead Time
Time to Verify
Time to Alert
Time to Response
```

---

## 33. PERFORMANCE

MVP targets:

```text
API p95 < 500 ms
Risk calculation < 2 s / batch
Dashboard initial load < 3 s
Data ingestion success > 99%
```

Spatial optimization:

```text
bbox filtering
pagination
simplification
clustering
vector tiles
server-side aggregation
```

---

# 34. IMPLEMENTATION PHASES

## PHASE 0 — FOUNDATION

```text
P0-01 Repository
P0-02 Docker
P0-03 PostgreSQL/PostGIS
P0-04 FastAPI skeleton
P0-05 Frontend skeleton
P0-06 Health API
P0-07 CI
P0-08 Environment config
```

Acceptance:

```text
docker compose up
→ DB healthy
→ API healthy
→ /docs accessible
→ frontend accessible
```

## PHASE 1 — DATA PLATFORM

```text
P1-01 spatial_grid
P1-02 rainfall_stations
P1-03 rainfall_logs
P1-04 seed data
P1-05 mock rain generator
P1-06 quality engine
P1-07 source health
```

## PHASE 2 — GIS

```text
P2-01 PostGIS spatial queries
P2-02 GeoJSON
P2-03 risk grid
P2-04 Leaflet
P2-05 station layer
P2-06 legend
P2-07 time filter
```

## PHASE 3 — HYBRID AI

```text
P3-01 feature pipeline
P3-02 training dataset
P3-03 baseline model
P3-04 model registry
P3-05 physical rules
P3-06 hybrid engine
P3-07 explanation
P3-08 evaluation
```

## PHASE 4 — INCIDENT + IMPACT

```text
P4-01 impact engine
P4-02 incident
P4-03 evidence
P4-04 state machine
P4-05 deduplication
P4-06 timeline
```

## PHASE 5 — COMMAND CENTER

```text
P5-01 executive dashboard
P5-02 operation center
P5-03 resource registry
P5-04 resource assignment
P5-05 route engine
P5-06 recommendation engine
```

## PHASE 6 — CITIZEN

```text
P6-01 citizen portal
P6-02 geofence
P6-03 alerts
P6-04 report
P6-05 evacuation points
P6-06 safe route
```

## PHASE 7 — AI AGENTS

```text
P7-01 tool registry
P7-02 orchestrator
P7-03 situation agent
P7-04 knowledge agent
P7-05 response agent
P7-06 approval workflow
P7-07 agent audit
```

## PHASE 8 — SIMULATION

```text
P8-01 snapshot
P8-02 what-if
P8-03 replay
P8-04 scenario comparison
P8-05 training mode
```

---

## 35. SPRINT TEMPLATE

Mỗi Sprint:

```text
1. Objective
2. Inputs
3. Specification files
4. Tasks
5. Files to create
6. Files to modify
7. Database migration
8. API changes
9. Tests
10. Demo
11. Risks
12. Acceptance criteria
```

---

## 36. AI CODING AGENT WORKFLOW

```text
Read README
 ↓
Read MASTER PLAN
 ↓
Read relevant specs
 ↓
Identify Sprint
 ↓
Plan
 ↓
Code
 ↓
Test
 ↓
Lint / Type / Security
 ↓
Update docs
 ↓
Report
```

Report:

```text
IMPLEMENTED
FILES CREATED
FILES MODIFIED
MIGRATIONS
TESTS
RISKS
NEXT TASK
```

Không triển khai toàn bộ roadmap trong một lần.

---

## 37. MASTER PROMPT CHO ANTIGRAVITY

```text
Bạn là Principal Software Engineer xây dựng HAEWS.

Mục tiêu:
Xây dựng Hybrid AI Early Warning System theo
HAEWS-IMPLEMENTATION-MASTER-PLAN.md.

QUY TẮC:

1. Đọc specification trước khi code.
2. Không tự ý thay đổi architecture.
3. Không hard-code operational thresholds.
4. Không bịa dữ liệu.
5. Phân biệt live/mock/historical/simulation.
6. Mọi AI output phải có provenance.
7. Mọi model phải có version.
8. Mọi action nhạy cảm phải có authorization.
9. Không commit secrets.
10. Mọi feature phải có test.
11. Mọi migration phải an toàn.
12. Mọi operational event phải audit.
13. Nếu specification thiếu, ghi ASSUMPTION.
14. Không xóa code/dữ liệu cũ nếu chưa đánh giá impact.
15. Không coi AI prediction là sự thật.

WORKFLOW:
A. Đọc README.md.
B. Đọc HAEWS-IMPLEMENTATION-MASTER-PLAN.md.
C. Đọc specification liên quan.
D. Xác định sprint/task.
E. Lập plan.
F. Thực hiện từng task.
G. Test.
H. Security check.
I. Database/API compatibility check.
J. Cập nhật docs.
K. Báo cáo.

KHÔNG làm toàn bộ roadmap trong một lần.
```

---

## 38. SPRINT PROMPTS

### Sprint 0

```text
Triển khai PHASE 0.

Tạo:
- repository structure
- docker-compose
- PostgreSQL/PostGIS
- FastAPI
- /health
- frontend skeleton
- .env.example
- migrations
- tests
- README local setup

Không tạo AI model.

Acceptance:
DB healthy
API healthy
GET /health = 200
/docs hoạt động
frontend hoạt động.
```

### Sprint 1

```text
Triển khai PHASE 1 — DATA PLATFORM.

Tạo:
- spatial_grid
- rainfall_stations
- rainfall_logs
- migrations
- seed_demo.py
- mock_rain_generator.py
- data quality service
- source health
- tests

10 mock stations.
Không dùng mock data trong production.
```

### Sprint 2

```text
Triển khai PHASE 2 — GIS.

Tạo:
- spatial queries
- GeoJSON endpoint
- Leaflet dashboard
- station layer
- grid layer
- legend
- risk filter
- time filter

MVP polling 10 giây.
```

### Sprint 3

```text
Triển khai PHASE 3 — HYBRID AI.

Tạo:
- feature pipeline
- training dataset
- baseline XGBoost
- model registry
- rules engine
- hybrid risk engine
- evaluation
- explanation
- API

Threshold nằm trong configuration/database.
Mọi prediction lưu probability, confidence,
model_version, rules_version, timestamp, evidence.
```

### Sprint 4

```text
Triển khai PHASE 4 — INCIDENT + IMPACT.

Tạo:
- impact engine
- incident lifecycle
- evidence
- deduplication
- timeline
- risk → incident trigger

Mọi transition phải audit.
```

### Sprint 5

```text
Triển khai PHASE 5 — COMMAND CENTER.

Tạo:
- Executive Dashboard
- Operation Center
- Resource Board
- Resource Assignment
- Route Recommendation
- Action Recommendation

Không cho AI tự dispatch resource.
```

### Sprint 6

```text
Triển khai PHASE 6 — CITIZEN.

Tạo:
- Citizen UI
- location risk
- geofence
- alerts
- citizen reports
- evacuation points
- safe route

Privacy-by-design.
```

### Sprint 7

```text
Triển khai PHASE 7 — AI AGENTS.

Tạo:
- tool registry
- orchestrator
- situation agent
- knowledge/RAG agent
- response agent
- approval workflow
- audit

Agent chỉ dùng allowlisted tools.
Action nhạy cảm phải qua approval.
```

### Sprint 8

```text
Triển khai PHASE 8 — SIMULATION.

Tạo:
- snapshot
- what-if
- historical replay
- scenario comparison
- training mode

Không ghi scenario vào live operational state.
```

---

## 39. CI/CD

Pull Request:

```text
lint
type check
unit test
integration test
API test
security scan
migration check
```

Branches:

```text
main
develop
feature/*
fix/*
```

Release:

```text
tag
→ build
→ test
→ deploy
→ smoke test
```

---

## 40. MODEL DEPLOYMENT

```text
Training
 ↓
Evaluation
 ↓
Review
 ↓
Register
 ↓
Staging
 ↓
Shadow Test
 ↓
Approval
 ↓
Production
```

Không thay model production trực tiếp.

---

## 41. OPERATIONAL SAFETY

```text
AI confidence ≠ operational truth
Prediction ≠ warning order
Recommendation ≠ command
Citizen report ≠ verified incident
Simulation ≠ forecast
```

Cảnh báo chính thức phải tuân thủ thẩm quyền, quy trình và quy định hiện hành.

---

## 42. DEMO SCENARIO

### Heavy Rain

```text
Rainfall increases
 ↓
Data quality check
 ↓
Risk engine
 ↓
Risk Level 3
 ↓
Impact engine
 ↓
Incident detected
 ↓
Situation Agent
 ↓
Operator verifies
 ↓
Draft warning
 ↓
Commander approves
 ↓
Citizen notification
```

### Conflicting Evidence

```text
AI predicts high
BUT
sensor stale
AND
camera normal
```

System:

```text
Đánh dấu evidence conflict
↓
Giảm confidence hoặc yêu cầu verification
↓
Tạo operator task
```

### Cascade Event

```text
Extreme rainfall
 ↓
Landslide risk
 ↓
Road blocked
 ↓
Village isolated
 ↓
Population at risk
 ↓
Resource shortage
 ↓
Route unavailable
 ↓
Alternative route
 ↓
Evacuation recommendation
```

---

## 43. DEFINITION OF DONE

```text
[ ] Specification implemented
[ ] Database migration
[ ] API contract
[ ] Validation
[ ] Authorization
[ ] Tests
[ ] Logging
[ ] Metrics
[ ] Error handling
[ ] Documentation
[ ] Security review
[ ] Demo
[ ] Acceptance criteria passed
```

---

## 44. FIRST 20 TASKS

```text
01. Initialize Git repository
02. Create Docker Compose
03. Start PostgreSQL/PostGIS
04. Create migration framework
05. Create FastAPI application
06. Create /health
07. Create spatial_grid
08. Create rainfall_stations
09. Create rainfall_logs
10. Create seed_demo.py
11. Create mock_rain_generator.py
12. Create data quality service
13. Create rainfall API
14. Create GeoJSON API
15. Create Leaflet map
16. Create feature pipeline
17. Create baseline XGBoost model
18. Create configurable rules engine
19. Create hybrid risk API
20. Create risk WebGIS layer
```

---

## 45. GOVERNANCE

Roles:

```text
Product Owner
System Architect
Backend Engineer
GIS Engineer
Data Engineer
ML Engineer
Frontend Engineer
DevOps/Security
Domain Expert
Operations Representative
```

Domain Expert phải xác nhận:

- ngưỡng cảnh báo;
- quy trình ứng phó;
- phân quyền chỉ huy;
- quy trình sơ tán;
- quy định pháp lý;
- mức độ thiệt hại.

AI/Coding Agent không tự xác nhận các nội dung này.

---

## 46. FINAL ARCHITECTURE

```text
                         ┌─────────────────────┐
                         │     CITIZENS        │
                         └──────────┬──────────┘
                                    │
                         Alerts / Reports
                                    │
┌─────────────┐           ┌─────────▼─────────┐
│ DATA SOURCES│──────────→│   DATA PLATFORM   │
└─────────────┘           └─────────┬─────────┘
                                    │
                         ┌──────────▼──────────┐
                         │     GIS / PostGIS   │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────▼──────────────┐
                    │       AI + ANALYTICS         │
                    │ Observation / Hazard /       │
                    │ Impact / Evidence Fusion     │
                    └───────────────┬──────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │ INCIDENT / SITUATION│
                         └──────────┬──────────┘
                                    │
                    ┌───────────────▼──────────────┐
                    │       COMMAND CENTER         │
                    │ Decision Support / Resources │
                    │ Route / Action / Alert       │
                    └───────────────┬──────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │      AI AGENTS      │
                         │ Situation / Response│
                         │ Knowledge / Orchestr.│
                         └──────────┬──────────┘
                                    │
                             Human Approval
                                    │
                         ┌──────────▼──────────┐
                         │       RESPONSE      │
                         └──────────┬──────────┘
                                    │
                         ┌──────────▼──────────┐
                         │ LEARNING / REPLAY    │
                         │ SIMULATION / DIGITAL  │
                         │ TWIN                  │
                         └──────────────────────┘
```

---

## 47. SUCCESS CRITERIA

HAEWS MVP đạt khi chạy được chuỗi:

```text
Mưa tăng
 ↓
Dữ liệu được tiếp nhận
 ↓
Kiểm tra chất lượng
 ↓
AI + Rules đánh giá nguy cơ
 ↓
Bản đồ thay đổi
 ↓
Impact được tính
 ↓
Incident được tạo
 ↓
Situation được tổng hợp
 ↓
Operator xác minh
 ↓
AI đề xuất phương án
 ↓
Người có thẩm quyền phê duyệt
 ↓
Cảnh báo được phát
 ↓
Người dân nhận được
 ↓
Lực lượng được điều phối
 ↓
Kết quả được ghi nhận
 ↓
Sự kiện được replay
 ↓
Dữ liệu phục vụ cải thiện model
```

Vòng lặp cuối cùng:

```text
SENSE
 → UNDERSTAND
 → PREDICT
 → DECIDE
 → ACT
 → INFORM
 → LEARN
```

---

## 48. IMMEDIATE NEXT ACTION

Không yêu cầu AI Agent xây toàn bộ HAEWS trong một lần.

Bắt đầu:

```text
TASK 001
→ PHASE 0
→ Foundation
→ Docker + PostGIS + FastAPI + Frontend
→ Test
→ Commit
```

Sau đó:

```text
TASK 002 → Database
TASK 003 → Mock realtime
TASK 004 → GIS
TASK 005 → Hybrid AI
...
```

Mỗi task phải tạo ra một trạng thái **chạy được và kiểm thử được**.

---

## VERSION

```text
Document: HAEWS-IMPLEMENTATION-MASTER-PLAN.md
Version: 3.1
Status: Implementation Ready
Primary MVP: Flash Flood + Landslide
Architecture: Data + GIS + Hybrid AI + Incident + Command Center + Citizen
```
