import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Line } from 'react-chartjs-2';
import axios from '../lib/api';

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/analytics/social').then(res => setData(res.data));
  }, []);

  if (!data) return <Layout>Loading...</Layout>;

  const chartData = {
    labels: data.dates,
    datasets: [
      {
        label: 'Impressions',
        data: data.impressions,
        borderColor: '#3B82F6'
      },
      {
        label: 'Engagement',
        data: data.engagement,
        borderColor: '#F59E0B'
      }
    ]
  };

  return (
    <Layout>
      <h1>Social Media Analytics</h1>
      <Line data={chartData} />
    </Layout>
  );
}
