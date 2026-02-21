import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AnalyticsChart({ data }) {
  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Impressions',
        data: data.map(d => d.impressions),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Conversions',
        data: data.map(d => d.conversions),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        yAxisID: 'y1',
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    scales: {
      y: { type: 'linear', display: true, position: 'left' },
      y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false } }
    }
  };

  return <Line data={chartData} options={options} />;
          }
