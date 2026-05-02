import { useState } from 'react';
import { troubleshoot } from '../services/api';

function Troubleshoot() {
  const [form, setForm] = useState({ error_type: 'upload_error', error_message: '' });
  const [analysis, setAnalysis] = useState('');

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await troubleshoot({ ...form, user_context: {} });
      setAnalysis(response.data.analysis);
    } catch {
      setAnalysis('Check that your file format is supported, the file size is below 100MB, and backend services are reachable.');
    }
  };

  return (
    <div className="page-stack">
      <section className="panel">
        <h1>Troubleshoot</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="error_type">Error type</label>
            <select id="error_type" name="error_type" value={form.error_type} onChange={updateField}>
              <option value="upload_error">Upload error</option>
              <option value="vcf_parsing_error">VCF parsing error</option>
              <option value="login_error">Login error</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="error_message">Error message</label>
            <textarea id="error_message" name="error_message" rows="4" value={form.error_message} onChange={updateField} />
          </div>
          <button className="button" type="submit">Get Help</button>
        </form>
      </section>
      {analysis && <section className="panel analysis">{analysis}</section>}
    </div>
  );
}

export default Troubleshoot;
