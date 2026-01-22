import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ChartDisplay from './components/ChartDisplay';
import ScenarioPlanner from './components/ScenarioPlanner';
import HowItWorks from './components/HowItWorks';
import { calculateFireJourney, generateInsights } from './utils/fireCalculator';
import { FireResults, FireScenario } from './types';
import './App.css';

// Type for the form inputs, which is slightly different from calculation params
interface CalculatorInputs {
  age: number;
  cash: number;
  investments: number;
  netIncome: number;
  spending: number;
  returnRate: number; // Stored as percentage
  swr: number; // Stored as percentage
}

function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>(() => {
    const savedInputs = localStorage.getItem('fireCalculatorInputs');
    try {
      if (savedInputs) return JSON.parse(savedInputs);
    } catch (e) {
      console.error("Could not parse saved inputs", e);
    }
    return {
      age: 30,
      cash: 10000,
      investments: 90000,
      netIncome: 80000,
      spending: 40000,
      returnRate: 7,
      swr: 4,
    };
  });

  const [scenario, setScenario] = useState<FireScenario>(() => {
    const savedScenario = localStorage.getItem('fireCalculatorScenario');
    try {
      if (savedScenario) return JSON.parse(savedScenario);
    } catch (e) {
      console.error("Could not parse saved scenario", e);
    }
    return {
      spendingAdjustment: 0,
      returnAdjustment: 0,
      savingsAdjustment: 0,
    };
  });

  const [results, setResults] = useState<FireResults | null>(null);

  useEffect(() => {
    const { age, cash, investments, netIncome, spending, returnRate, swr } = inputs;
    const params = {
      age,
      netWorth: cash + investments,
      netIncome,
      spending: spending * (1 + scenario.spendingAdjustment / 100),
      expectedReturn: (returnRate + scenario.returnAdjustment) / 100,
      swr: swr / 100,
    };

    const journeyResults = calculateFireJourney(params);
    const insights = generateInsights(params, journeyResults);
    setResults({ ...journeyResults, insights });
  }, [inputs, scenario]);

  useEffect(() => {
    localStorage.setItem('fireCalculatorInputs', JSON.stringify(inputs));
  }, [inputs]);

  useEffect(() => {
    localStorage.setItem('fireCalculatorScenario', JSON.stringify(scenario));
  }, [scenario]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInputs(prev => ({ ...prev, [id]: Number(value) }));
  };

  const handleScenarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            scenario={scenario}
            results={results}
            onScenarioChange={handleScenarioChange}
          />
          <HowItWorks />
        </div>
        <div className="right-column">
          {results && <ChartDisplay results={results} />}
        </div>
      </main>
    </div>
  );
}

export default App;
