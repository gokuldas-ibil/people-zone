import * as React from 'react';
import styles from '../PeopleZone.module.scss';

interface DashboardProps {
  totalEmployees: number;
  totalDepartments: number;
  onNavigate: (route: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ totalEmployees, totalDepartments, onNavigate }) => (
  <div className={styles.dashboard}>
    <h2 className={styles.dashboardTitle}>People Hub Dashboard</h2>
    <div className={styles.dashboardStats}>
      <div className={styles.dashboardCard}>
        <div className={styles.dashboardCardLabel}>Total Employees</div>
        <div className={styles.dashboardCardValue}>{totalEmployees}</div>
      </div>
      <div className={styles.dashboardCard}>
        <div className={styles.dashboardCardLabel}>Total Departments</div>
        <div className={styles.dashboardCardValue}>{totalDepartments}</div>
      </div>
    </div>
    <nav className={styles.dashboardNav}>
      <button className={styles.dashboardNavBtn} onClick={() => onNavigate('employees')}>
        Employees
      </button>
      <button className={styles.dashboardNavBtn} onClick={() => onNavigate('departments')}>
        Departments
      </button>
    </nav>
  </div>
);

export default Dashboard;
