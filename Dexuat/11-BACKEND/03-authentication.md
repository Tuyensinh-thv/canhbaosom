# Authentication & Authorization

Recommended OAuth2/OIDC or JWT.

Roles: SUPER_ADMIN, COMMANDER, OPERATOR, ANALYST, RESPONDER, FIELD_USER, CITIZEN.

RBAC + least privilege; sensitive actions may add ABAC by area/incident/function.

Sensitive: issue high-level alert, assign critical resource, approve evacuation, change threshold, deploy model. All require authorization and audit.
