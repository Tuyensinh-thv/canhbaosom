# Event-Driven Architecture

## Events
`ObservationReceived`, `DataQualityChanged`, `RainfallUpdated`, `RiverLevelChanged`, `RiskLevelChanged`, `IncidentDetected`, `IncidentVerified`, `WarningDrafted`, `WarningApproved`, `WarningIssued`, `ResourceAssigned`, `CitizenReportReceived`, `IncidentResolved`.

## Event envelope
```json
{"event_id":"uuid","event_type":"RiskLevelChanged","occurred_at":"ISO-8601","producer":"risk-service","schema_version":"1.0","correlation_id":"uuid","payload":{}}
```

MVP có thể dùng background workers + Redis; production có thể dùng message broker phù hợp.
