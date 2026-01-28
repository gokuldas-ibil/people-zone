import * as React from 'react';
import styles from '../PeopleZone.module.scss';

interface EmployeeSummaryProps {
  total: number;
  active: number;
}

const EmployeeSummary: React.FC<EmployeeSummaryProps> = ({ total, active }) => (
  <div className={styles.employeeSummary}>
    <div className={styles.employeeSummaryCard}>
      <span className={styles.employeeSummaryLabel}>Total Employees</span>
      <span className={styles.employeeSummaryValue}>{total}</span>
    </div>
    <div className={styles.employeeSummaryCard}>
      <span className={styles.employeeSummaryLabel}>Active Employees</span>
      <span className={styles.employeeSummaryValue}>{active}</span>
    </div>
  </div>
);

export default EmployeeSummary;
