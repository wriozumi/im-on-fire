import React from 'react';
import styles from './InputForm.module.css';
import commonStyles from './common.module.css';

const InputForm = ({ inputs, onChange }) => {
  return (
    <section className={`${commonStyles.section} ${styles.formSection}`}>
      <h2>Your Numbers</h2>
      <label htmlFor="age">Age</label>
      <input type="number" id="age" value={inputs.age} onChange={onChange} />
      <label htmlFor="cash">Net Worth (Cash)</label>
      <input type="number" id="cash" value={inputs.cash} onChange={onChange} />
      <label htmlFor="investments">Net Worth (Investments)</label>
      <input type="number" id="investments" value={inputs.investments} onChange={onChange} />
      <label htmlFor="netIncome">Annual Net Income</label>
      <input type="number" id="netIncome" value={inputs.netIncome} onChange={onChange} />
      <label htmlFor="spending">Annual Spending</label>
      <input type="number" id="spending" value={inputs.spending} onChange={onChange} />
    </section>
  );
};

export default InputForm;
