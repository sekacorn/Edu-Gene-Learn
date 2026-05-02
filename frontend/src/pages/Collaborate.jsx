import { useState } from 'react';

function Collaborate() {
  const [sessions, setSessions] = useState([]);
  const [sessionName, setSessionName] = useState('');

  const createSession = (event) => {
    event.preventDefault();
    if (!sessionName.trim()) {
      return;
    }
    setSessions((current) => [
      ...current,
      { id: crypto.randomUUID(), sessionName, sessionType: 'study_group', maxParticipants: 5 },
    ]);
    setSessionName('');
  };

  return (
    <div className="page-stack">
      <section className="panel">
        <h1>Collaborate</h1>
        <form className="form" onSubmit={createSession}>
          <div className="field">
            <label htmlFor="sessionName">Session name</label>
            <input id="sessionName" name="sessionName" value={sessionName} onChange={(event) => setSessionName(event.target.value)} />
          </div>
          <button className="button" type="submit">Create Session</button>
        </form>
      </section>

      <section className="panel session-list">
        <h2>Active Sessions</h2>
        {sessions.length === 0 ? (
          <p>No active sessions.</p>
        ) : (
          <div className="grid">
            {sessions.map((session) => (
              <article className="card" key={session.id}>
                <h3>{session.sessionName}</h3>
                <p>{session.sessionType} · max {session.maxParticipants} participants</p>
                <button className="button secondary" type="button">Join</button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Collaborate;
