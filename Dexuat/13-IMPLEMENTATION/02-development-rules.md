# Development Rules

1. Đọc specification trước khi code.
2. Không phá API contract nếu không cập nhật version/migration.
3. Không hard-code threshold.
4. Không commit secrets.
5. Feature phải có test.
6. Migration có rollback strategy.
7. AI output có provenance.
8. Operational action có authorization.
9. Log structured, hạn chế PII.
10. PR nêu risk và migration impact.

Definition of Done: feature → tests → security → observability → documentation → review.
