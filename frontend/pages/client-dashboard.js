import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from '../lib/api';
import ClientProjects from '../components/ClientProjects';
import ClientPayouts from '../components/ClientPayouts';
import AnalyticsChart from '../components/AnalyticsChart';
import styles from '../styles/Dashboard.module.css';

export default function ClientDashboard() {
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [balance, setBalance] = useState({ retained: 0 });
  const [analytics, setAnalytics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login';
    }
    if (user) {
      fetchData();
    }
  }, [user, loading]);

  const fetchData = async () => {
    try {
      const [projRes, payoutRes, analyticsRes] = await Promise.all([
        axios.get('/dashboard/projects'),
        axios.get('/dashboard/payouts'),
        axios.get('/dashboard/analytics')
      ]);
      setProjects(projRes.data);
      setPayouts(payoutRes.data.payouts);
      setBalance(payoutRes.data.currentBalance);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <h1>Welcome, {user?.fullName}</h1>
      <div className={styles.grid}>
        <ClientProjects projects={projects} />
        <ClientPayouts payouts={payouts} balance={balance} />
      </div>
      {analytics.length > 0 && (
        <section className={styles.analytics}>
          <h2>Campaign Performance</h2>
          <AnalyticsChart data={analytics} />
        </section>
      )}
    </Layout>
  );
        }
