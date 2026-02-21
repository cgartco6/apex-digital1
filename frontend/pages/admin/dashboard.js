import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import axios from '../../lib/api';
import OwnerStats from '../../components/OwnerStats';
import AITargetEngine from '../../components/AITargetEngine';
import AcquisitionChart from '../../components/charts/AcquisitionChart';
import ClientPayouts from '../../components/ClientPayouts'; // Reused but for admin view
import styles from '../../styles/Admin.module.css';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      window.location.href = '/';
    }
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user, loading]);

  const fetchData = async () => {
    try {
      const res = await axios.get('/admin/dashboard');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <h1>Admin Dashboard</h1>
      <div className={styles.grid}>
        <OwnerStats current={data.current} />
        <AITargetEngine target={data.target} />
        <div className={styles.chartContainer}>
          <h2>Acquisition Trends (30 Days)</h2>
          <AcquisitionChart historical={data.historical} />
        </div>
        <div className={styles.payoutSection}>
          <h2>All Client Payouts</h2>
          <ClientPayouts payouts={data.allPayouts} balance={data.totalBalance} adminView />
        </div>
        <div className={styles.recentSignups}>
          <h2>Recent Signups</h2>
          <ul>
            {data.recentSignups.map(user => (
              <li key={user.id}>{user.fullName} - {user.email} ({new Date(user.createdAt).toLocaleDateString()})</li>
            ))}
          </ul>
        </div>
      </div>
    </Admin>
  );
      }
