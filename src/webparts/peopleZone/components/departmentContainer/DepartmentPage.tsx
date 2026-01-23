import * as React from 'react';
import { IDepartment } from '../../models/IDepartment';
import { GraphService } from '../../services/GraphService';
import DepartmentTable from './DepartmentTable';
import styles from '../PeopleZone.module.scss';

interface DepartmentPageProps {
  context: any;
}

const DepartmentPage: React.FC<DepartmentPageProps> = ({ context }) => {
  const [departments, setDepartments] = React.useState<IDepartment[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDepartments = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const client = await context.msGraphClientFactory.getClient('3');
      const service = new GraphService(client);
      await service.init(context, 'Department');
      const items = await service.getDepartmentsList();
      setDepartments(items);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to load departments from SharePoint. Please check if the list exists and you have permissions.');
      console.error('Error fetching departments from Graph API:', err);
    }
  };

  return (
    <div>
      {loading && <div className={styles.loading}>Loading departments...</div>}
      {error && <div className={styles.error}>{error}</div>}
      <DepartmentTable departments={departments} />
    </div>
  );
};

export default DepartmentPage;
