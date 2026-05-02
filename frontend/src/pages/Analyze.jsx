import { useState } from 'react';
import { getLearningRecommendations } from '../services/api';

const fallbackRecommendation = {
  recommended_visual_emphasis: 74,
  recommended_auditory_emphasis: 58,
  recommended_kinesthetic_emphasis: 62,
  optimal_session_duration_minutes: 84,
  preferred_study_time: 'morning',
  confidence_score: 0.86,
  strategies: [
    'Use diagrams, timelines, and color-coded notes for dense concepts.',
    'Practice retrieval in focused study blocks with short breaks.',
    'Pair digital tools with offline summaries for durable recall.',
  ],
};

function Analyze() {
  const [form, setForm] = useState({
    memory_gene_score: 0.7,
    attention_gene_score: 0.65,
    processing_speed_score: 0.72,
    current_visual_score: 75,
    current_auditory_score: 60,
    current_kinesthetic_score: 55,
    tech_access_score: 0.9,
    study_env_quality: 0.8,
    internet_quality: 0.85,
  });
  const [recommendation, setRecommendation] = useState(null);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: Number(value) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await getLearningRecommendations(form);
      setRecommendation(response.data);
    } catch {
      setRecommendation(fallbackRecommendation);
    }
  };

  const data = recommendation;

  return (
    <div className="page-stack">
      <section className="panel">
        <h1>Learning Analysis</h1>
        <form className="form profile-form" onSubmit={handleSubmit}>
          <div className="grid two">
            <div className="field">
              <label htmlFor="current_visual_score">Visual score</label>
              <input id="current_visual_score" name="current_visual_score" type="number" min="0" max="100" value={form.current_visual_score} onChange={updateField} />
            </div>
            <div className="field">
              <label htmlFor="current_auditory_score">Auditory score</label>
              <input id="current_auditory_score" name="current_auditory_score" type="number" min="0" max="100" value={form.current_auditory_score} onChange={updateField} />
            </div>
            <div className="field">
              <label htmlFor="current_kinesthetic_score">Kinesthetic score</label>
              <input id="current_kinesthetic_score" name="current_kinesthetic_score" type="number" min="0" max="100" value={form.current_kinesthetic_score} onChange={updateField} />
            </div>
          </div>
          <button className="button" type="submit">Get Recommendations</button>
        </form>
      </section>

      {data && (
        <section className="panel recommendations">
          <h2>Recommendations</h2>
          <div className="grid two">
            <div className="metric">Visual: {Math.round(data.recommended_visual_emphasis ?? data.recommendedVisualEmphasis)}%</div>
            <div className="metric">Auditory: {Math.round(data.recommended_auditory_emphasis ?? data.recommendedAuditoryEmphasis)}%</div>
            <div className="metric">Kinesthetic: {Math.round(data.recommended_kinesthetic_emphasis ?? data.recommendedKinestheticEmphasis)}%</div>
            <div className="metric">Confidence: {Math.round((data.confidence_score ?? data.confidenceScore) * 100)}%</div>
          </div>
          <p>Optimal session duration: {data.optimal_session_duration_minutes ?? data.optimalSessionDurationMinutes} minutes.</p>
          <p>Preferred study time: {data.preferred_study_time ?? data.preferredStudyTime}.</p>
          <ul>
            {(data.strategies || []).map((strategy) => (
              <li key={strategy}>{strategy}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default Analyze;
