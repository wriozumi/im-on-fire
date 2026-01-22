import { FireResults, ChartDataPoint } from '../types';

interface CalculationParams {
  age: number;
  netWorth: number;
  netIncome: number;
  spending: number;
  expectedReturn: number;
  swr: number;
}

// Omit insights as this function doesn't generate them
type FireJourney = Omit<FireResults, 'insights'>;

export const calculateFireJourney = (params: CalculationParams): FireJourney => {
    const { age, netWorth, netIncome, spending, expectedReturn, swr } = params;
    const fireNumber = spending / swr;
    const isFire = netWorth >= fireNumber; // Determine status at the start
    let currentNetWorth = netWorth;
    let yearsToFire = 0;
    const MAX_YEARS = 100;

    const chartData: ChartDataPoint[] = [{ age, netWorth: currentNetWorth, fireTarget: fireNumber }];

    if (isFire) {
        return { fireNumber, yearsToFire: 0, fireAge: age, chartData, isFire };
    }

    const annualSavings = netIncome - spending;
    if (annualSavings <= 0 && (netWorth * expectedReturn < -annualSavings)) {
        return { fireNumber, yearsToFire: MAX_YEARS, fireAge: age + MAX_YEARS, chartData, isFire };
    }

    for (let i = 1; i <= MAX_YEARS; i++) {
        const netWorthAtStartOfYear = currentNetWorth;
        currentNetWorth = currentNetWorth * (1 + expectedReturn) + annualSavings;
        chartData.push({ age: age + i, netWorth: currentNetWorth, fireTarget: fireNumber });

        if (currentNetWorth >= fireNumber) {
            const growthInFinalYear = currentNetWorth - netWorthAtStartOfYear;
            const requiredGrowth = fireNumber - netWorthAtStartOfYear;
            const fractionOfYear = requiredGrowth > 0 ? requiredGrowth / growthInFinalYear : 0;
            yearsToFire = (i - 1) + fractionOfYear;
            break;
        }
    }

    if (yearsToFire === 0 && currentNetWorth < fireNumber) {
        yearsToFire = MAX_YEARS;
    }
    const fireAge = age + yearsToFire;

    return { fireNumber, yearsToFire, fireAge, chartData, isFire };
};

export const generateInsights = (params: CalculationParams, baseResults: FireJourney): string[] => {
    const { netIncome, spending, expectedReturn } = params;
    const { yearsToFire } = baseResults;
    const savingsRate = netIncome > 0 ? (netIncome - spending) / netIncome : 0;
    const insights: string[] = [];

    if (savingsRate > 0.5) {
        insights.push(`Your amazing savings rate of ${savingsRate.toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 0})} is the primary driver of your early retirement.`);
    } else if (savingsRate > 0.2) {
        insights.push(`Your savings rate of ${savingsRate.toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 0})} is strong. Increasing it further will significantly accelerate your FIRE date.`);
    } else {
        insights.push("Increasing your savings rate is the most powerful lever you have to reach FIRE sooner.");
    }

    const higherReturnParams = { ...params, expectedReturn: expectedReturn + 0.01 };
    const higherReturnResults = calculateFireJourney(higherReturnParams);
    const returnImpact = yearsToFire - higherReturnResults.yearsToFire;
    if (returnImpact > 0.1) {
        insights.push(`A 1% increase in annual returns could accelerate your FIRE date by ${returnImpact.toFixed(1)} years.`);
    }

    const coastFireAge = calculateCoastFireAge(params, baseResults.fireNumber);
    if (coastFireAge > params.age && coastFireAge < baseResults.fireAge) {
        insights.push(`You could reach Coast FIRE by age ${coastFireAge}, meaning you'd only need to cover expenses until your investments grow to your FIRE number on their own.`);
    }

    const spendingReduction = 1000;
    const fireNumberReduction = spendingReduction / params.swr;
    insights.push(`Every $${spendingReduction.toLocaleString()} you cut from annual spending reduces your FIRE number by $${fireNumberReduction.toLocaleString()}.`);

    if (baseResults.isFire) {
        insights.push("Congratulations! You've reached financial independence. Your assets can now cover your expenses indefinitely.");
    }

    return insights;
};

const calculateCoastFireAge = (params: CalculationParams, fireNumber: number): number => {
    const { age, netWorth, netIncome, spending, expectedReturn } = params;
    const TRADITIONAL_RETIREMENT_AGE = 65;
    const annualSavings = netIncome - spending;

    if (annualSavings <= 0) {
        const fvOfCurrentNw = netWorth * Math.pow(1 + expectedReturn, TRADITIONAL_RETIREMENT_AGE - age);
        if (fvOfCurrentNw >= fireNumber) {
            return age;
        }
        return -1;
    }

    let projectedNetWorth = netWorth;
    for (let currentAge = age; currentAge <= TRADITIONAL_RETIREMENT_AGE; currentAge++) {
        const futureValueAtRetirement = projectedNetWorth * Math.pow(1 + expectedReturn, TRADITIONAL_RETIREMENT_AGE - currentAge);
        if (futureValueAtRetirement >= fireNumber) {
            return currentAge;
        }
        projectedNetWorth = projectedNetWorth * (1 + expectedReturn) + annualSavings;
    }

    return -1;
};
