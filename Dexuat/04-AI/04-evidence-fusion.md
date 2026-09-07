# Evidence Fusion

Kết hợp AI prediction, camera, rainfall, river, satellite, citizen report và historical context.

Evidence object:
```json
{"evidence_id":"uuid","type":"camera","source_id":"cam01","observed_at":"ISO-8601","location":{},"confidence":0.92,"payload_ref":"object://...","quality":"VALID"}
```

Không cộng confidence cơ học; fusion method phải được validation.
