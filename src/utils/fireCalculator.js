export const calculateFireJourney = (params) => {
    const { age, netWorth, netIncome, spending, expectedReturn, swr } = params;
    const fireNumber = spending / swr;
    let currentNetWorth = netWorth;
    let yearsToFi = 0;
    const MAX_YEARS = 100;

    const chartLabels = [age];
    const chartData = [currentNetWorth];

    if (currentNetWorth >= fireNumber) {
        return { fireNumber, yearsToFi: 0, fireAge: age, chartLabels, chartData };
    }

    const annualSavings = netIncome - spending;
    if (annualSavings <= 0 && (netWorth * expectedReturn < -annualSavings)) {
        // If savings are negative and investment gains don't cover the deficit, FI is unreachable.
        return { fireNumber, yearsToFi: MAX_YEARS, fireAge: age + MAX_YEARS, chartLabels, chartData };
    }

    for (let i = 1; i <= MAX_YEARS; i++) {
        const netWorthAtStartOfYear = currentNetWorth;
        currentNetWorth = currentNetWorth * (1 + expectedReturn) + annualSavings;
        chartLabels.push(age + i);
        chartData.push(currentNetWorth);

        if (currentNetWorth >= fireNumber) {
            const growthInFinalYear = currentNetWorth - netWorthAtStartOfYear;
            const requiredGrowth = fireNumber - netWorthAtStartOfYear;
            const fractionOfYear = requiredGrowth > 0 ? requiredGrowth / growthInFinalYear : 0;
            yearsToFi = (i - 1) + fractionOfYear;
            break;
        }
    }

    if (yearsToFi === 0 && currentNetWorth < fireNumber) {
        yearsToFi = MAX_YEARS;
    }
    const fireAge = age + yearsToFi;
    return { fireNumber, yearsToFi, fireAge, chartLabels, chartData };
};

export const generateInsights = (params, baseResults) => {
    const { netIncome, spending, expectedReturn } = params;
    const { yearsToFi } = baseResults;
    const savingsRate = (netIncome - spending) / netIncome;
    let insights = [];

    if (savingsRate > 0.05) {
        insights.push(`Your savings rate of ${savingsRate.toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 0})} is a major driver of your FIRE date.`);
    } else {
        insights.push("Increasing your savings rate will significantly accelerate your FIRE date.");
    }

    const higherReturnParams = { ...params, expectedReturn: expectedReturn + 0.01 };
    const higherReturnResults = calculateFireJourney(higherReturnParams);
    const returnImpact = yearsToFi - higherReturnResults.yearsToFi;
    if (returnImpact > 0.1) {
        insights.push(`A 1% increase in annual returns could accelerate your FIRE date by ${returnImpact.toFixed(1)} years.`);
    }

    const coastFireAge = calculateCoastFireAge(params, baseResults.fireNumber);
    if (coastFireAge > params.age && coastFireAge < baseResults.fireAge) {
        insights.push(`You could reach Coast FIRE by age ${coastFireAge}, meaning you'd only need to cover your expenses until your investments grow to your FIRE number.`);
    }

    // Insight 4: Spending vs. FIRE Number
    const spendingReduction = 1000;
    const fireNumberReduction = spendingReduction / params.swr;
    insights.push(`Every $${spendingReduction.toLocaleString()} you cut from annual spending reduces your FIRE number by $${fireNumberReduction.toLocaleString()}.`);

    // Insight 5: The Coffee Effect
    const dailySpend = 5;
    const annualSpend = dailySpend * 365;
    const coffeeFireNumber = annualSpend / params.swr;
    insights.push(`A daily $${dailySpend} habit costs $${annualSpend.toLocaleString()} a year, increasing your FIRE number by $${coffeeFireNumber.toLocaleString()}.`);

    return insights.length > 0 ? insights[Math.floor(Math.random() * insights.length)] : "No insights available.";
};

const calculateCoastFireAge = (params, fireNumber) => {
    const { age, netWorth, expectedReturn } = params;
    const TRADITIONAL_RETIREMENT_AGE = 65;
    let currentNetWorth = netWorth;

    for (let i = age; i <= TRADITIONAL_RETIREMENT_AGE; i++) {
        let futureValue = currentNetWorth * Math.pow(1 + expectedReturn, TRADITIONAL_RETIREMENT_AGE - i);
        if (futureValue >= fireNumber) {
            return i;
        }
    }
    return -1;
};
