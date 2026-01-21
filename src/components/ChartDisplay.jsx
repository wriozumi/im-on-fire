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
} from 'chart.js';
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

const ChartDisplay = ({ results }) => {
  const { chartLabels, chartData, fireNumber } = results;

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Net Worth',
        data: chartData,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: true,
      },
      {
        label: 'FIRE Target',
        data: Array(chartLabels.length).fill(fireNumber),
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
          callback: (value) => '$' + value.toLocaleString(),
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
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
        <p>Years to FI: <span>{results.yearsToFi.toFixed(1)}</span></p>
        <p>FIRE Age: <span>{results.fireAge.toFixed(1)}</span></p>
      </div>
    </section>
  );
};

export default ChartDisplay;
