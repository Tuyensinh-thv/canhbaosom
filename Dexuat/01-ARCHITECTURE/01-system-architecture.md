# System Architecture

```text
DATA SOURCES
  ↓
INGESTION & QUALITY
  ↓
DATA PLATFORM / GIS
  ↓
OBSERVATION AI
  ↓
HAZARD AI
  ↓
EVIDENCE FUSION
  ↓
IMPACT ENGINE
  ↓
INCIDENT + SITUATION AWARENESS
  ↓
DECISION SUPPORT
  ↓
COMMAND CENTER
  ├── Operation Center
  └── Citizen Platform
```

## Logical layers
Source; Ingestion; Data; GIS; AI/Analytics; Risk/Impact; Incident; Decision; Notification; Experience; Governance.

## MVP technology direction
Backend Python/FastAPI; PostgreSQL/PostGIS; Redis; WebGIS; S3-compatible object storage; Python AI services; OAuth2/OIDC or JWT; Docker.
