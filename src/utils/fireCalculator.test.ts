import { describe, it, expect } from 'vitest';
import { calculateFireJourney } from './fireCalculator';

// This is an anonymous type that must match the internal CalculationParams
const baseParams = {
  age: 30,
  netWorth: 100000,
  netIncome: 80000,
  spending: 40000,
  expectedReturn: 0.07,
  swr: 0.04,
};

describe('calculateFireJourney', () => {
  it('should calculate the FIRE journey correctly for the base case', () => {
    const results = calculateFireJourney(baseParams);
    expect(results.fireNumber).toBe(1000000);
    expect(results.yearsToFire).toBeCloseTo(12.56, 2);
    expect(results.fireAge).toBeCloseTo(42.56, 2);
    expect(results.isFire).toBe(false);
  });

  it('should handle the case where the user is already financially independent', () => {
    const params = { ...baseParams, netWorth: 1100000 };
    const results = calculateFireJourney(params);
    expect(results.yearsToFire).toBe(0);
    expect(results.fireAge).toBe(params.age);
    expect(results.isFire).toBe(true);
  });

  it('should handle the case where FI is unreachable due to negative savings', () => {
    const params = { ...baseParams, netWorth: 10000, netIncome: 40000, spending: 45000, expectedReturn: 0.01 };
    const results = calculateFireJourney(params);
    expect(results.yearsToFire).toBe(100); // Max years
  });

  it('should generate the correct number of chart data points', () => {
    const results = calculateFireJourney(baseParams);
    // +1 for the initial data point at age 0
    expect(results.chartData.length).toBe(Math.ceil(results.yearsToFire) + 1);
    expect(results.chartData[0].age).toBe(baseParams.age);
    expect(results.chartData[0].netWorth).toBe(baseParams.netWorth);
  });

  it('should show that higher savings lead to a shorter FIRE journey', () => {
    const higherSavingsParams = { ...baseParams, spending: 30000 };
    const baseResults = calculateFireJourney(baseParams);
    const higherSavingsResults = calculateFireJourney(higherSavingsParams);
    expect(higherSavingsResults.yearsToFire).toBeLessThan(baseResults.yearsToFire);
  });
});
