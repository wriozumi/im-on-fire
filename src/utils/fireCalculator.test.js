import { describe, it, expect } from 'vitest';
import { calculateFireJourney } from './fireCalculator';

describe('calculateFireJourney', () => {
  const baseParams = {
    age: 30,
    netWorth: 100000,
    netIncome: 80000,
    spending: 40000,
    expectedReturn: 0.07,
    swr: 0.04,
  };

  it('should calculate the FIRE journey correctly for the base case', () => {
    const results = calculateFireJourney(baseParams);
    expect(results.fireNumber).toBe(1000000);
    expect(results.yearsToFi).toBeCloseTo(12.56, 2);
    expect(results.fireAge).toBeCloseTo(42.56, 2);
  });

  it('should handle the case where the user is already financially independent', () => {
    const params = { ...baseParams, netWorth: 1100000 };
    const results = calculateFireJourney(params);
    expect(results.yearsToFi).toBe(0);
    expect(results.fireAge).toBe(params.age);
  });

  it('should handle the case where FI is unreachable due to negative savings', () => {
    const params = { ...baseParams, netWorth: 10000, netIncome: 40000, spending: 45000 };
    const results = calculateFireJourney(params);
    expect(results.yearsToFi).toBe(100); // Max years
  });

  it('should generate the correct number of chart labels and data points', () => {
    const results = calculateFireJourney(baseParams);
    expect(results.chartLabels.length).toBe(Math.ceil(results.yearsToFi) + 1);
    expect(results.chartData.length).toBe(Math.ceil(results.yearsToFi) + 1);
  });

  it('should show that higher savings lead to a shorter FIRE journey', () => {
    const higherSavingsParams = { ...baseParams, spending: 30000 };
    const baseResults = calculateFireJourney(baseParams);
    const higherSavingsResults = calculateFireJourney(higherSavingsParams);
    expect(higherSavingsResults.yearsToFi).toBeLessThan(baseResults.yearsToFi);
  });
});
