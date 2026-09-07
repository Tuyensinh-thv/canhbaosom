# API Specification

Base `/api/v1`.

```http
GET /rainfall
GET /rivers
GET /stations
GET /cameras
GET /risk/map
GET /risk/{zone_id}
GET /risk/timeline
GET /impact/{zone_id}
GET /incidents
POST /incidents
GET /incidents/{id}
PATCH /incidents/{id}
GET /resources
GET /resources/available
POST /resources/assign
POST /scenarios/run
GET /scenarios/{id}
POST /citizen/reports
GET /citizen/alerts
POST /ai/analyze
POST /ai/situation-summary
POST /ai/recommend
```

Mọi API cần OpenAPI schema, auth, validation, pagination và error contract.
