export interface FireInputs {
  age: number;
  netWorth: number;
  income: number;
  spending: number;
}

export interface FireScenario {
  spendingAdjustment: number;
  returnAdjustment: number;
  savingsAdjustment: number;
}

export interface FireResults {
  fireNumber: number;
  yearsToFire: number;
  fireAge: number;
  chartData: ChartDataPoint[];
  insights: string[];
  isFire: boolean;
}

export interface ChartDataPoint {
  age: number;
  netWorth: number;
  fireTarget: number;
}
