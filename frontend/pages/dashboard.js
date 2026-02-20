import { useEffect, useState } from 'react';
import axios from '../lib/api';
import AnalyticsChart from '../components/AnalyticsChart';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [balance, setBalance] = useState({});

  useEffect(() => {
    fetchProjects();
    fetchPayouts();
  }, []);

  const fetchProjects = async () => {
    const { data } = await axios.get('/projects');
    setProjects(data);
  };

  const fetchPayouts = async () => {
    const { data } = await axios.get('/payouts');
    setPayouts(data.payouts);
    setBalance(data.balance);
  };

  return (
    <div className={styles.dashboard}>
      <h1>Your Dashboard</h1>
      <section>
        <h2>Active Projects</h2>
        <div className={styles.projectGrid}>
          {projects.map(p => (
            <div key={p.id} className={styles.projectCard}>
              <h3>{p.type} - {p.package}</h3>
              <p>Status: {p.status}</p>
              <progress value={p.progress} max="100" />
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2>Campaign Analytics</h2>
        <AnalyticsChart data={projects.filter(p => p.type === 'marketing')} />
      </section>
      <section>
        <h2>Payouts</h2>
        <table>
          <thead><tr><th>Week</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {payouts.map(p => (
              <tr key={p.id}>
                <td>{new Date(p.weekStart).toLocaleDateString()}</td>
                <td>R{p.totalAmount}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Retained Balance: R{balance.retained}</p>
      </section>
    </div>
  );
    }
