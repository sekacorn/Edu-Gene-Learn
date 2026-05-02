import { useState } from 'react';
import DataUpload from '../components/DataUpload';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [latestUpload, setLatestUpload] = useState({
    fileName: 'mock_23andme_learning_traits.vcf',
    fileType: 'VCF',
    processingStatus: 'completed',
  });
  const mockRecommendations = [
    'Visual study map for biology and genetics modules',
    '84 minute morning study blocks with spaced recall',
    'Collaborative review session for high-friction topics',
  ];

  return (
    <div className="page-stack">
      <section className="panel">
        <h1>Dashboard</h1>
        <p className="muted">Welcome {user.username || 'admin'}. Mock data is loaded for local exploration.</p>
      </section>

      <section className="grid two">
        <DataUpload userId={user.id || '123e4567-e89b-12d3-a456-426614174000'} onUploadSuccess={setLatestUpload} />
        <article className="card">
          <h2>My Genomic Data</h2>
          {latestUpload ? (
            <div className="status">
              {latestUpload.fileName || latestUpload.file_name || 'Uploaded file'} is ready for processing.
            </div>
          ) : (
            <p>No data uploaded in this session.</p>
          )}
          <h3>Mock Recommendations</h3>
          <ul>
            {mockRecommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}

export default Dashboard;
