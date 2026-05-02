# Privacy Notes

EduGeneLearn can support research workflows involving sensitive data. This file explains what the app may store, what is demo/mock behavior, and what deployers must review before using real participant, student, or institutional data.

## Data the App Can Store or Process

Depending on which services are enabled and how the app is deployed, EduGeneLearn can store or process:

- User account data such as username, email, password hash, role, and profile metadata.
- Authentication/session data such as JWT-related user identity and role information.
- Genomic upload metadata and parsed genomic records, including VCF, CSV, or JSON data paths.
- Educational and learning profile inputs used by the analysis workflow.
- Environmental or contextual learning factors used by the AI model service.
- AI recommendation inputs and outputs.
- LLM query text, troubleshooting context, and generated responses.
- Collaboration/session metadata if collaboration features are connected to real backend services.
- Operational logs, health checks, metrics, and service monitoring data.

Treat DNA/genomic data, student records, learning assessments, disability-related information, and AI prompts as sensitive data.

## Demo/Mock vs Real Deployment

Demo and mock behavior:

- The frontend includes a local mock login path with `admin` / `Admin123!`.
- The LLM service currently uses mock provider behavior unless a real provider is implemented and configured.
- The AI model can start without a pretrained `model.pt`, so outputs are not validated research predictions by default.
- Collaboration and visualization backend routes are reserved, but standalone backend services for those routes are not included in `docker-compose.yml`.
- Screenshots and examples should use synthetic or fictional data.

Real deployment responsibilities:

- Replace all demo credentials and default secrets.
- Configure real authentication, authorization, logging, monitoring, and retention controls.
- Decide what data is stored, where it is stored, who can access it, and how long it is retained.
- Document consent, deletion, export, and access request workflows.
- Use secure infrastructure, TLS, backups, and incident response procedures.

## GDPR and Public-Sector Responsibilities

EduGeneLearn includes GDPR, accessibility, NIST, Section 508, EU AI Act, NIS2, Cyber Resilience Act, and FedRAMP readiness language. It is not certified compliant.

Deployers remain responsible for:

- Identifying the controller/processor roles for any personal data.
- Establishing a lawful basis for processing DNA, student, or research participant data.
- Handling special category data obligations where GDPR applies.
- Drafting consent, privacy notice, retention, and deletion language.
- Completing DPIAs, IRB/ethics review, or institutional review where required.
- Supporting participant access, correction, export, deletion, and objection workflows.
- Configuring data minimization, access controls, encryption, logging, and retention.
- Reviewing FERPA, HIPAA, COPPA, state privacy laws, GDPR, public-sector procurement rules, and grant requirements where applicable.
- Completing Section 508/WCAG accessibility review for public or institutional deployments.
- Reviewing AI outputs with qualified professionals before using them in educational, medical, legal, or research decisions.

For demos and public examples, use synthetic or anonymized data only.
