import React from 'react';
import { calculateFireJourney } from '../utils/fireCalculator';
import styles from './ScenarioPlanner.module.css';
import commonStyles from './common.module.css';

const ScenarioPlanner = ({ inputs, scenario, results, onInputChange, onScenarioChange, insight }) => {
  if (!results) {
    return null; // or a loading spinner
  }

  const { spending, returnRate, swr } = inputs;
  const { spendingAdjustment } = scenario;

  const adjustedSpending = spending + (spending * spendingAdjustment / 100);
  const scenarioParams = {
    ...inputs,
    spending: adjustedSpending,
    netWorth: inputs.cash + inputs.investments,
    expectedReturn: returnRate / 100,
    swr: swr / 100
  };

  const scenarioResults = calculateFireJourney(scenarioParams);
  const yearsDiff = scenarioResults.yearsToFi - results.yearsToFi;
  const direction = yearsDiff > 0 ? "delays" : "accelerates";
  const impactMessage = Math.abs(yearsDiff) < 0.1
    ? "This change has a negligible impact on your FIRE date."
    : `This change ${direction} your FIRE date by ${Math.abs(yearsDiff).toFixed(1)} years.`;

  return (
    <section className={`${commonStyles.section} ${styles.scenarioSection}`}>
      <h2>Assumptions</h2>
      <label htmlFor="returnRate">Expected Real Return</label>
      <input type="range" id="returnRate" min="0" max="15" value={returnRate} onChange={onInputChange} step="0.1" />
      <span>{returnRate}%</span>
      <label htmlFor="swr">Safe Withdrawal Rate</label>
      <input type="range" id="swr" min="2" max="6" value={swr} onChange={onInputChange} step="0.1" />
      <span>{swr}%</span>

      <h2>Scenarios & Insights</h2>
      <label htmlFor="spendingAdjustment">Adjust Spending</label>
      <input type="range" id="spendingAdjustment" min="-50" max="50" value={spendingAdjustment} onChange={onScenarioChange} step="1" />
      <span>{spendingAdjustment}%</span>
      <p className={styles.scenarioImpact}>{impactMessage}</p>
      <p className={styles.insight}>{insight}</p>
    </section>
  );
};

export default ScenarioPlanner;
