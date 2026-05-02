import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="page-stack">
      <section className="hero">
        <div>
          <h1>EduGeneLearn</h1>
          <p>
            Personalized learning recommendations from genomic, educational, and environmental signals.
          </p>
        </div>
        <div className="actions">
          <Link className="button" to="/login">Start</Link>
          <Link className="button secondary" to="/analyze">View analysis</Link>
          <Link className="button secondary" to="/compliance">Compliance</Link>
        </div>
      </section>

      <section className="grid two">
        <article className="card">
          <h2>Integrate Data</h2>
          <p>Upload VCF, CSV, or JSON data and connect it with learning profile inputs.</p>
        </article>
        <article className="card">
          <h2>Get Guidance</h2>
          <p>Generate study strategies, session timing, and modality emphasis recommendations.</p>
        </article>
        <article className="card">
          <h2>Standards Aware</h2>
          <p>Track NIST-aligned security practices and Section 508 accessibility commitments.</p>
        </article>
      </section>
    </div>
  );
}

export default Home;
