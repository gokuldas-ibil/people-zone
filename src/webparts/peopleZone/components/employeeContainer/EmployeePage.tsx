import * as React from 'react';
import { IEmployee } from '../../models/IEmployee';
import { IDepartment } from '../../models/IDepartment';
import { GraphService } from '../../services/GraphService';
import EmployeeTable from './EmployeeTable';
import styles from '../PeopleZone.module.scss';

interface EmployeePageProps {
  context: any;
  getInitials: (name: string) => string;
  getProfileImageUrl: (employee: IEmployee) => string | null;
}

const EmployeePage: React.FC<EmployeePageProps> = ({ context, getInitials, getProfileImageUrl }) => {
  const [employees, setEmployees] = React.useState<IEmployee[]>([]);
  const [departments, setDepartments] = React.useState<IDepartment[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEmployees = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const client = await context.msGraphClientFactory.getClient('3');
      const service = new GraphService(client);
      await service.init(context, 'Employees');
      const items = await service.getEmployeesList();
      setEmployees(items);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to load employees from SharePoint. Please check if the list exists and you have permissions.');
      console.error('Error fetching employees from Graph API:', err);
    }
  };

  const fetchDepartments = async (): Promise<void> => {
    try {
      const client = await context.msGraphClientFactory.getClient('3');
      const service = new GraphService(client);
      await service.init(context, 'Department');
      const items = await service.getDepartmentsList();
      setDepartments(items);
    } catch (err) {
      console.error('Failed to load departments', err);
    }
  };

  const total = employees.length;
  const active = employees.filter((e) => e.Status === 'Active').length;

  return (
    <div>
      {loading && <div className={styles.loading}>Loading employees...</div>}
      {error && <div className={styles.error}>{error}</div>}
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
      <EmployeeTable
        employees={employees}
        departments={departments}
        getInitials={getInitials}
        getProfileImageUrl={getProfileImageUrl}
      />
    </div>
  );
};

export default EmployeePage;
