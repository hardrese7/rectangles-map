import React from 'react';
import styles from './Spinner.module.css';

function Spinner(): JSX.Element {
  return <div className={styles.spinner}>Loading...</div>;
}

export default Spinner;
