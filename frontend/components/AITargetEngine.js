import { useState, useEffect } from 'react';
import styles from './AITargetEngine.module.css';

export default function AITargetEngine({ target }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={styles.card}>
      <h2>🎯 AI Target: 5,000 Paying Clients in 10 Days</h2>
      <div className={styles.progress}>
        <div className={styles.progressBar} style={{ width: `${target.progress}%` }} />
        <span>{target.progress}%</span>
      </div>
      <p>Current clients: <strong>{target.totalClients}</strong> / {target.target}</p>
      <p>Daily rate needed: <strong>{target.dailyRate}</strong> clients/day</p>
      <p>Current daily rate: <strong>{target.currentDailyRate}</strong></p>
      <p className={target.onTrack ? styles.onTrack : styles.offTrack}>
        {target.onTrack ? '✅ On track' : '⚠️ Behind schedule'}
      </p>
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'Hide' : 'Show'} AI Recommendations
      </button>
      {showDetails && (
        <ul className={styles.recommendations}>
          {target.recommendations.map((rec, i) => <li key={i}>🤖 {rec}</li>)}
        </ul>
      )}
    </div>
  );
  }
