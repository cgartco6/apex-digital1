import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import OwnerStats from '../../components/OwnerStats';
import AITargetEngine from '../../components/AITargetEngine';
import AcquisitionChart from '../../components/charts/AcquisitionChart';
import axios from '../../lib/api';
import styles from '../../styles/Admin.module.css';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('/admin/dashboard');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <h1>Owner Dashboard</h1>
      <div className={styles.grid}>
        <OwnerStats current={data.current} />
        <AITargetEngine target={data.target} />
        <AcquisitionChart historical={data.historical} />
      </div>
    </Layout>
  );
                    }
