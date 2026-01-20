document.addEventListener('DOMContentLoaded', () => {
    // Input Elements
    const ageInput = document.getElementById('age');
    const cashInput = document.getElementById('cash');
    const investmentsInput = document.getElementById('investments');
    const netIncomeInput = document.getElementById('net-income');
    const spendingInput = document.getElementById('spending');
    const returnRateInput = document.getElementById('return-rate');
    const swrInput = document.getElementById('swr');
    const spendingScenarioInput = document.getElementById('spending-scenario');

    // Output Elements
    const fireNumberOutput = document.getElementById('fire-number');
    const yearsToFiOutput = document.getElementById('years-to-fi');
    const fireAgeOutput = document.getElementById('fire-age');
    const returnRateValue = document.getElementById('return-rate-value');
    const swrValue = document.getElementById('swr-value');
    const spendingScenarioValue = document.getElementById('spending-scenario-value');
    const scenarioImpactOutput = document.getElementById('scenario-impact');
    const insightOutput = document.getElementById('insight');

    // Chart
    const ctx = document.getElementById('fire-chart').getContext('2d');
    let fireChart;

    function updateChart(labels, data, fireTarget) {
        if (fireChart) {
            fireChart.destroy();
        }
        fireChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Net Worth',
                    data: data,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: true
                }, {
                    label: 'FIRE Target',
                    data: Array(labels.length).fill(fireTarget),
                    borderColor: 'rgb(255, 99, 132)',
                    borderDash: [5, 5],
                    pointRadius: 0
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { callback: value => '$' + value.toLocaleString() }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: context => {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    function calculateFireJourney(params) {
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

        for (let i = 1; i <= MAX_YEARS; i++) {
            currentNetWorth = currentNetWorth * (1 + expectedReturn) + (netIncome - spending);
            chartLabels.push(age + i);
            chartData.push(currentNetWorth);
            if (currentNetWorth >= fireNumber) {
                yearsToFi = i;
                break;
            }
        }

        if (yearsToFi === 0) yearsToFi = MAX_YEARS;
        const fireAge = age + yearsToFi;
        return { fireNumber, yearsToFi, fireAge, chartLabels, chartData };
    }

    function updateUI() {
        const age = parseInt(ageInput.value, 10);
        const cash = parseFloat(cashInput.value);
        const investments = parseFloat(investmentsInput.value);
        const netIncome = parseFloat(netIncomeInput.value);
        const spending = parseFloat(spendingInput.value);
        const expectedReturn = parseFloat(returnRateInput.value) / 100;
        const swr = parseFloat(swrInput.value) / 100;
        const spendingAdjustmentPercent = parseInt(spendingScenarioInput.value, 10);

        if (isNaN(age) || isNaN(cash) || isNaN(investments) || isNaN(netIncome) || isNaN(spending) || isNaN(expectedReturn) || isNaN(swr)) {
            return; // Exit if any input is invalid
        }

        const baseParams = { age, netWorth: cash + investments, netIncome, spending, expectedReturn, swr };
        const baseResults = calculateFireJourney(baseParams);

        fireNumberOutput.textContent = `$${baseResults.fireNumber.toLocaleString()}`;
        yearsToFiOutput.textContent = baseResults.yearsToFi.toFixed(1);
        fireAgeOutput.textContent = baseResults.fireAge;
        updateChart(baseResults.chartLabels, baseResults.chartData, baseResults.fireNumber);

        const spendingAdjustmentAmount = (spending * spendingAdjustmentPercent) / 100;
        const adjustedSpending = spending + spendingAdjustmentAmount;
        spendingScenarioValue.textContent = `${spendingAdjustmentAmount >= 0 ? '+' : ''}$${spendingAdjustmentAmount.toLocaleString()}`;

        const scenarioParams = { ...baseParams, spending: adjustedSpending };
        const scenarioResults = calculateFireJourney(scenarioParams);
        const yearsDiff = scenarioResults.yearsToFi - baseResults.yearsToFi;

        if (Math.abs(yearsDiff) < 0.1) {
            scenarioImpactOutput.textContent = "This change has a negligible impact on your FIRE date.";
        } else {
            const direction = yearsDiff > 0 ? "delays" : "accelerates";
            scenarioImpactOutput.textContent = `This change ${direction} your FIRE date by ${Math.abs(yearsDiff).toFixed(1)} years.`;
        }

        const insightParams = { ...baseParams, yearsToFi: baseResults.yearsToFi };
        insightOutput.textContent = generateInsights(insightParams);
    }

    function generateInsights(params) {
        const { netIncome, spending, expectedReturn, yearsToFi } = params;
        const savingsRate = (netIncome - spending) / netIncome;

        // Insight 1: Savings Rate Contribution
        let insights = [];
        if (savingsRate > 0.05) {
            insights.push(`Your savings rate of ${savingsRate.toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 0})} is a major driver of your FIRE date.`);
        } else {
            insights.push("Increasing your savings rate will significantly accelerate your FIRE date.");
        }

        // Insight 2: Impact of 1% change in returns
        const higherReturnParams = { ...params, expectedReturn: expectedReturn + 0.01 };
        const higherReturnResults = calculateFireJourney(higherReturnParams);
        const returnImpact = yearsToFi - higherReturnResults.yearsToFi;
        if (returnImpact > 0.1) {
            insights.push(`A 1% increase in annual returns could accelerate your FIRE date by ${returnImpact.toFixed(1)} years.`);
        }

        // Insight 3: Coast FIRE
        const coastFireAge = calculateCoastFireAge(params);
        if (coastFireAge > params.age && coastFireAge < params.fireAge) {
            insights.push(`You could reach Coast FIRE by age ${coastFireAge}, meaning you'd only need to cover your expenses until your investments grow to your FIRE number.`);
        }

        return insights[Math.floor(Math.random() * insights.length)]; // Show one insight at a time
    }

    function calculateCoastFireAge(params) {
        const { age, netWorth, fireNumber, expectedReturn } = params;
        const TRADITIONAL_RETIREMENT_AGE = 65;
        let currentNetWorth = netWorth;

        for (let i = age; i <= TRADITIONAL_RETIREMENT_AGE; i++) {
            let futureValue = currentNetWorth * Math.pow(1 + expectedReturn, TRADITIONAL_RETIREMENT_AGE - i);
            if (futureValue >= fireNumber) {
                return i;
            }
        }
        return -1; // Not on track for Coast FIRE by target age
    }

    const inputs = [ageInput, cashInput, investmentsInput, netIncomeInput, spendingInput, returnRateInput, swrInput, spendingScenarioInput];
    inputs.forEach(input => input.addEventListener('input', updateUI));

    returnRateInput.addEventListener('input', (e) => returnRateValue.textContent = `${e.target.value}%`);
    swrInput.addEventListener('input', (e) => swrValue.textContent = `${e.target.value}%`);

    updateUI();
});
