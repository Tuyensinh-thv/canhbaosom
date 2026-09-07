# Data Architecture

## Zones
`RAW → VALIDATED → PROCESSED → FEATURE → ANALYTICS → SERVING`

## Classes
Observation; Spatial; Forecast; Historical; Asset; Exposure; Incident; Resource; Citizen; Knowledge; Model; Audit.

## Data contract
```json
{"source_id":"rain_001","source_type":"rainfall","observed_at":"ISO-8601","location":{"lat":0,"lon":0},"payload":{},"quality":"VALID","ingested_at":"ISO-8601"}
```

Không ghi đè raw data; transformation phải truy vết source/version.
