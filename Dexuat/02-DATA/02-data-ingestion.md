# Data Ingestion

## Adapters
`RainfallAdapter`, `RiverAdapter`, `RadarAdapter`, `SatelliteAdapter`, `CameraAdapter`, `IoTAdapter`, `ForecastAdapter`, `CitizenAdapter`, `ExternalAPIAdapter`.

## Pipeline
`Receive → Authenticate → Validate → Normalize → Quality Check → Store → Publish Event`

## Requirements
Idempotency; retry/backoff; dead-letter handling; timestamp normalization; source health; rate limiting; raw payload preservation.

Mỗi source có owner, endpoint/protocol, frequency, auth method, schema và SLA.
