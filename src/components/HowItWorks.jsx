import React, { useState } from 'react';
import styles from './HowItWorks.module.css';
import commonStyles from './common.module.css';

const HowItWorks = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <section className={commonStyles.section}>
      <button onClick={toggleOpen} className={styles.toggleButton}>
        <h2>How It Works</h2>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className={styles.content}>
          <p>This calculator helps you estimate when you might reach Financial Independence (FI) based on a few key inputs and standard financial formulas.</p>
          <h4>Core Formulas:</h4>
          <ul>
            <li><strong>FIRE Number:</strong> This is the total amount of investments you need to be financially independent. It's calculated as: <br /><code>Your Annual Spending / Safe Withdrawal Rate</code></li>
            <li><strong>Net Worth Growth:</strong> Each year, your net worth is projected to grow based on your savings and investment returns: <br /><code>New Net Worth = (Old Net Worth * (1 + Real Return)) + Annual Savings</code></li>
          </ul>
          <h4>Key Assumptions:</h4>
          <ul>
            <li><strong>Real Return:</strong> This is your expected investment return *after* inflation. A common estimate is 7%.</li>
            <li><strong>Safe Withdrawal Rate (SWR):</strong> This is the percentage of your investments you can withdraw each year in retirement without running out of money. The 4% rule is a common guideline.</li>
          </ul>
          <p className={styles.disclaimer}><strong>Disclaimer:</strong> This is a simplified model and not financial advice. It does not account for taxes, market volatility, or changes in your financial situation.</p>
        </div>
      )}
    </section>
  );
};

export default HowItWorks;
