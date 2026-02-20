import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AcquisitionChart({ historical }) {
  const data = {
    labels: historical.map(day => day.date.slice(5)), // MM-DD
    datasets: [
      {
        label: 'New Clients',
        data: historical.map(day => day.newClientsToday),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Revenue (R)',
        data: historical.map(day => day.revenueToday),
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        yAxisID: 'y1',
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    scales: { y: { type: 'linear', display: true, position: 'left' }, y1: { type: 'linear', display: true, position: 'right' } }
  };

  return <Line data={data} options={options} />;
    }
