# Security Policy

EduGeneLearn is a research prototype and development foundation. It is not production-hardened by default. Teams using it with real DNA, student, health, education, or public-sector data should complete their own security review before deployment.

## Reporting Vulnerabilities

Please report suspected security vulnerabilities privately by email:

```text
Sekacorn@gmail.com
```

Do not open public issues for vulnerabilities that could expose sensitive data, secrets, authentication weaknesses, infrastructure details, or exploit steps. Include a concise description, affected files or services, reproduction steps if safe to share, and any suggested mitigation.

## Data That Should Not Be Used in Demos

Do not use real or identifiable sensitive data in demos, screenshots, local tests, public issues, or example fixtures.

Avoid using:

- Real DNA/genomic files, including VCF files from identifiable people.
- Student education records or assessment data.
- Medical, disability, behavioral, or psychological information.
- Names, emails, phone numbers, addresses, dates of birth, or government identifiers.
- Real credentials, API keys, OAuth secrets, JWT secrets, database passwords, or access tokens.
- Institutional logs, audit records, production exports, or incident data.

Use synthetic, anonymized, or clearly fictional data for demos.

## Production Hardening Checklist

Before using EduGeneLearn in production or with real participant data:

- Replace all default credentials and demo values.
- Set strong `JWT_SECRET`, database passwords, API keys, and Grafana credentials.
- Keep secrets out of Git and use a secret manager or institution-approved vault.
- Enforce TLS for all public traffic.
- Restrict CORS to approved origins only.
- Add authentication and authorization review for every protected endpoint.
- Add audit logging for login, upload, access, export, deletion, and administrative events.
- Define backup, restore, retention, and deletion procedures.
- Run dependency, container, and infrastructure scans.
- Add vulnerability management and patching procedures.
- Configure production monitoring, alerting, and incident response.
- Review file upload validation, size limits, content scanning, and storage controls.
- Run accessibility testing before public or institutional use.
- Complete privacy, legal, IRB/ethics, and compliance review for real DNA or student data.

See [PRODUCTION_READINESS_CHECKLIST.md](PRODUCTION_READINESS_CHECKLIST.md) for a broader deployment checklist.
