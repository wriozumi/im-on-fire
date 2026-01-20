import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ChartDisplay from './components/ChartDisplay';
import ScenarioPlanner from './components/ScenarioPlanner';
import { calculateFireJourney, generateInsights } from './utils/fireCalculator';
import './App.css';

function App() {
  const [inputs, setInputs] = useState({
    age: 30,
    cash: 10000,
    investments: 90000,
    netIncome: 80000,
    spending: 40000,
    returnRate: 7,
    swr: 4,
  });

  const [scenario, setScenario] = useState({
    spendingAdjustment: 0,
  });

  const [results, setResults] = useState(null);
  const [insight, setInsight] = useState('');

  useEffect(() => {
    const { age, cash, investments, netIncome, spending, returnRate, swr } = inputs;
    const params = {
      age,
      netWorth: cash + investments,
      netIncome,
      spending,
      expectedReturn: returnRate / 100,
      swr: swr / 100,
    };

    const journeyResults = calculateFireJourney(params);
    setResults(journeyResults);
    setInsight(generateInsights(params, journeyResults));
  }, [inputs]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInputs(prev => ({ ...prev, [id]: Number(value) }));
  };

  const handleScenarioChange = (e) => {
    const { id, value } = e.target;
    setScenario(prev => ({ ...prev, [id]: Number(value) }));
  };

  return (
    <div>
      <header className="App-header">
        <h1>FIRE Calculator</h1>
      </header>
      <main>
        <div className="left-column">
          <InputForm inputs={inputs} onChange={handleInputChange} />
          <ScenarioPlanner
            inputs={inputs}
            scenario={scenario}
            results={results}
            onInputChange={handleInputChange}
            onScenarioChange={handleScenarioChange}
            insight={insight}
          />
        </div>
        <div className="right-column">
          {results && <ChartDisplay results={results} />}
        </div>
      </main>
    </div>
  );
}

export default App;
