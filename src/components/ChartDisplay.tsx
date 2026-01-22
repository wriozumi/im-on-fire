import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TooltipItem,
} from 'chart.js';
import { FireResults } from '../types';
import styles from './ChartDisplay.module.css';
import commonStyles from './common.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  results: FireResults;
}

const ChartDisplay: React.FC<Props> = ({ results }) => {
  const { chartData } = results;

  const data = {
    labels: chartData.map(d => d.age.toFixed(0)),
    datasets: [
      {
        label: 'Net Worth',
        data: chartData.map(d => d.netWorth),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true,
      },
      {
        label: 'FIRE Target',
        data: chartData.map(d => d.fireTarget),
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number | string) => '$' + value.toLocaleString(),
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <section className={`${commonStyles.section} ${styles.chartSection}`}>
      <h2>Your FIRE Journey</h2>
      <div className={styles.chartContainer}>
        <Line data={data} options={options} />
      </div>
      <div className={styles.keyMetrics}>
        <p>Your FIRE Number: <span>${results.fireNumber.toLocaleString()}</span></p>
        <p>Years to FI: <span>{results.yearsToFire.toFixed(1)}</span></p>
        <p>FIRE Age: <span>{results.fireAge.toFixed(1)}</span></p>
      </div>
    </section>
  );
};

export default ChartDisplay;
