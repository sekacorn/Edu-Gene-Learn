const nistControls = [
  {
    title: 'Identify',
    body: 'Maintain an inventory of user data flows, genomic uploads, service dependencies, and environment configuration.',
  },
  {
    title: 'Protect',
    body: 'Use role-based access, JWT validation, transport encryption, secure secrets management, and least-privilege service configuration.',
  },
  {
    title: 'Detect',
    body: 'Collect application health, API usage, authentication, and upload-processing signals for review and alerting.',
  },
  {
    title: 'Respond',
    body: 'Document incident triage, user notification, key rotation, rollback, and evidence preservation workflows.',
  },
  {
    title: 'Recover',
    body: 'Plan database backup restoration, service redeployment, user support, and post-incident improvement tracking.',
  },
];

const accessibilityItems = [
  'Keyboard-operable navigation and forms',
  'Semantic headings, labels, and link text',
  'Readable contrast targets for core interface elements',
  'Responsive layouts for desktop and mobile use',
  'Form validation messages that do not rely on color alone',
  'Compatibility goals for screen readers and browser zoom',
];

const europeanStandards = [
  {
    title: 'GDPR',
    body: 'Treat genetic and health-adjacent learning data as sensitive personal data. Track lawful basis, consent flows, minimization, retention, access rights, deletion, export, breach notification, and data processor agreements.',
  },
  {
    title: 'European Accessibility Act and EN 301 549',
    body: 'Use EN 301 549 and WCAG 2.1 AA as the working accessibility baseline for ICT, with keyboard access, labels, contrast, error identification, and assistive technology testing evidence.',
  },
  {
    title: 'EU AI Act',
    body: 'Maintain AI system documentation, intended-use boundaries, human oversight, data governance, transparency notices, and risk classification review for education-related recommendation features.',
  },
  {
    title: 'NIS2 Directive',
    body: 'Apply cybersecurity risk-management practices such as incident handling, supply-chain controls, vulnerability management, secure development, backup, and reporting readiness where applicable.',
  },
  {
    title: 'Cyber Resilience Act',
    body: 'Prepare software lifecycle evidence for secure-by-design development, vulnerability handling, security updates, SBOM/dependency tracking, and user security information for EU market readiness.',
  },
];

function Compliance() {
  return (
    <div className="page-stack">
      <section className="panel">
        <p className="eyebrow">Standards Alignment</p>
        <h1>NIST & Section 508 Compliance</h1>
        <p>
          EduGeneLearn is being structured around NIST cybersecurity practices and Section 508 accessibility
          requirements. This page describes implementation targets and evidence areas; it is not a certification
          claim.
        </p>
      </section>

      <section className="panel">
        <h2>NIST Cybersecurity Framework Alignment</h2>
        <p>
          The application tracks security work against the NIST CSF functions: Identify, Protect, Detect,
          Respond, and Recover.
        </p>
        <div className="grid compliance-grid">
          {nistControls.map((control) => (
            <article className="compliance-item" key={control.title}>
              <h3>{control.title}</h3>
              <p>{control.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid two">
        <article className="panel">
          <h2>Section 508 Accessibility</h2>
          <p>
            The frontend should support federal accessibility expectations for perceivable, operable,
            understandable, and robust user experiences.
          </p>
          <ul className="check-list">
            {accessibilityItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h2>Evidence Checklist</h2>
          <ul className="check-list">
            <li>Accessibility scans and manual keyboard walkthroughs</li>
            <li>Dependency and container vulnerability reports</li>
            <li>Security headers and CORS configuration review</li>
            <li>Authentication, upload, and audit-log test coverage</li>
            <li>Documented incident response and backup restore procedures</li>
          </ul>
        </article>
      </section>

      <section className="panel">
        <h2>European Standards & Regulations</h2>
        <p>
          For European users or EU market deployment, EduGeneLearn should also maintain a readiness file for
          privacy, accessibility, cybersecurity, and AI governance obligations.
        </p>
        <div className="grid compliance-grid">
          {europeanStandards.map((standard) => (
            <article className="compliance-item" key={standard.title}>
              <h3>{standard.title}</h3>
              <p>{standard.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>EU Readiness Checklist</h2>
        <ul className="check-list">
          <li>Privacy notice and data protection impact assessment for genomic and learning data</li>
          <li>Consent, withdrawal, deletion, export, and correction workflows</li>
          <li>Accessibility conformance report mapped to EN 301 549 / WCAG criteria</li>
          <li>AI model cards, risk classification notes, human oversight, and user-facing transparency text</li>
          <li>Incident response plan covering security events and personal-data breaches</li>
          <li>Software bill of materials, dependency monitoring, and vulnerability disclosure process</li>
        </ul>
      </section>
    </div>
  );
}

export default Compliance;
