import React, { useState, useEffect } from 'react';
import { FireResults, FireScenario } from '../types';
import styles from './ScenarioPlanner.module.css';
import commonStyles from './common.module.css';

interface Props {
  scenario: FireScenario;
  results: FireResults | null;
  onScenarioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InsightDisplay: React.FC<{ insights: string[] }> = ({ insights }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (insights.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % insights.length);
    }, 5000); // Change insight every 5 seconds
    return () => clearInterval(timer);
  }, [insights]);

  if (insights.length === 0) {
    return <p className={styles.insight}>No insights available.</p>;
  }

  return <p className={styles.insight}>{insights[currentIndex]}</p>;
};

const ScenarioPlanner: React.FC<Props> = ({ scenario, results, onScenarioChange }) => {
  if (!results) return null;

  const { spendingAdjustment, returnAdjustment } = scenario;

  return (
    <section className={`${commonStyles.section} ${styles.scenarioSection}`}>
      <h2>Scenarios & Insights</h2>

      <label htmlFor="spendingAdjustment">Spending Shock</label>
      <div className={styles.sliderContainer}>
        <input type="range" id="spendingAdjustment" min="-50" max="50" value={spendingAdjustment} onChange={onScenarioChange} step="1" />
        <span>{spendingAdjustment}%</span>
      </div>

      <label htmlFor="returnAdjustment">Market Performance</label>
       <div className={styles.sliderContainer}>
        <input type="range" id="returnAdjustment" min="-5" max="5" value={returnAdjustment} onChange={onScenarioChange} step="0.5" />
        <span>{returnAdjustment > 0 ? '+' : ''}{returnAdjustment}%</span>
      </div>

      <InsightDisplay insights={results.insights} />
    </section>
  );
};

export default ScenarioPlanner;
