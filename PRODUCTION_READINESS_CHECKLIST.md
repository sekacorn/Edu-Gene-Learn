# Production Readiness Checklist

EduGeneLearn is a runnable research prototype and development foundation. Use this checklist before deploying it with real DNA, student, health, education, institutional, or public-sector data.

## Secrets

- [ ] Replace default passwords, demo credentials, and sample secrets.
- [ ] Set strong values for `POSTGRES_PASSWORD`, `JWT_SECRET`, API keys, and Grafana credentials.
- [ ] Store secrets in a secret manager or institution-approved vault.
- [ ] Rotate secrets before launch and after any suspected exposure.
- [ ] Confirm `.env` files and local credentials are not committed.

## CORS and Network Exposure

- [ ] Restrict `CORS_ALLOWED_ORIGINS` to approved domains.
- [ ] Remove broad local-development origins from production configs.
- [ ] Review exposed ports in Docker Compose, Kubernetes, and cloud firewalls.
- [ ] Place services behind an approved gateway, reverse proxy, or ingress.
- [ ] Confirm internal services are not publicly reachable unless required.

## TLS and Transport Security

- [ ] Enforce HTTPS/TLS for all public traffic.
- [ ] Use institution-approved certificates and renewal procedures.
- [ ] Redirect HTTP to HTTPS where appropriate.
- [ ] Configure secure headers at the reverse proxy or app layer.
- [ ] Review WebSocket security if collaboration features are enabled.

## Authentication and Access Control

- [ ] Replace mock login with production authentication.
- [ ] Review user roles and endpoint authorization.
- [ ] Add MFA or SSO if required by the organization.
- [ ] Review account recovery, session expiration, and token revocation.
- [ ] Test unauthorized access attempts for protected pages and APIs.

## Audit Logs

- [ ] Log authentication events.
- [ ] Log data upload, read, export, deletion, and processing events.
- [ ] Log administrative and role changes.
- [ ] Protect logs from tampering and unauthorized access.
- [ ] Define log retention and review procedures.

## Backups and Recovery

- [ ] Define backup schedules for PostgreSQL and any file/object storage.
- [ ] Encrypt backups.
- [ ] Test restore procedures.
- [ ] Document recovery time and recovery point objectives.
- [ ] Define retention and secure deletion policies.

## Dependency and Container Scanning

- [ ] Scan npm dependencies.
- [ ] Scan Maven dependencies.
- [ ] Scan Python dependencies.
- [ ] Scan Docker images and base images.
- [ ] Track vulnerabilities and patch timelines.
- [ ] Generate SBOMs if required by policy or procurement.

## Accessibility Audit

- [ ] Run automated accessibility checks.
- [ ] Complete manual keyboard-only testing.
- [ ] Test with screen readers and assistive technology.
- [ ] Review color contrast, focus states, labels, headings, and responsive layouts.
- [ ] Document Section 508, WCAG 2.1 AA, or EN 301 549 gaps and remediation plans.

## AI Review

- [ ] Document model inputs, outputs, and assumptions.
- [ ] Validate AI recommendations against research goals.
- [ ] Use trained/validated models before research or production decisions.
- [ ] Add human review for educational, medical, legal, or high-impact use.
- [ ] Review EU AI Act or organizational AI governance requirements.
- [ ] Monitor model performance, drift, and failure modes.

## Legal and Privacy Review

- [ ] Confirm IRB, ethics board, or institutional review requirements.
- [ ] Draft consent and privacy notices for participant data.
- [ ] Define lawful basis and special category data handling where GDPR applies.
- [ ] Review FERPA, HIPAA, COPPA, state privacy laws, GDPR, and public-sector rules where applicable.
- [ ] Define data minimization, retention, deletion, access, correction, and export workflows.
- [ ] Complete DPIAs or risk assessments where required.

## Monitoring and Incident Response

- [ ] Configure production metrics and alerts.
- [ ] Monitor uptime, error rates, resource usage, and security events.
- [ ] Document incident response roles and escalation paths.
- [ ] Test incident response and recovery procedures.
- [ ] Define vulnerability disclosure and patch handling processes.

## Release Gate

- [ ] Frontend lint and build pass.
- [ ] Backend tests pass.
- [ ] Python tests pass.
- [ ] Compose/Kubernetes configuration is reviewed.
- [ ] Security, privacy, accessibility, AI, and legal reviews are complete.
- [ ] Known risks and accepted exceptions are documented.
