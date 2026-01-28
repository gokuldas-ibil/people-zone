import * as React from 'react';
import styles from './PeopleZone.module.scss';
import type { IPeopleZoneProps } from './IPeopleZoneProps';
import { IEmployee } from '../models/IEmployee';
import EmployeePage from './employeeContainer/EmployeePage';
import DepartmentPage from './departmentContainer/DepartmentPage';
import Dashboard from './dashboardContainer/Dashboard';
import { GraphService } from '../services/GraphService';
import { Item } from '@pnp/sp/items';

// Define the possible routes for navigation
type Route = 'dashboard' | 'employees' | 'departments';

// Main functional component for the Employee Directory
const PeopleZone: React.FC<IPeopleZoneProps> = (props) => {
  // State for total employee and department counts, loading indicator, error message, and current route
  const [totalEmployees, setTotalEmployees] = React.useState<number>(0);
  const [totalDepartments, setTotalDepartments] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [route, setRoute] = React.useState<Route>('dashboard');

  // Helper: Get initials from a name string
  const getInitials = (name: string): string => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Helper: Build SharePoint user photo URL from email
  const getProfileImageUrl = (employee: IEmployee): string | null => {
    if (employee.User?.EMail) {
      return `/_layouts/15/userphoto.aspx?size=M&username=${encodeURIComponent(employee.User.EMail)}`;
    }
    if (employee.Email) {
      return `/_layouts/15/userphoto.aspx?size=M&username=${encodeURIComponent(employee.Email)}`;
    }
    return null;
  };

  // Fetch total counts of employees and departments
  const fetchTotals = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const client = await props.context.msGraphClientFactory.getClient('3');
      const service = new GraphService(client);
      await service.init(props.context, 'Employees');
      const items = await service.getTotalEmployees();
      setTotalEmployees(items);
      setTotalDepartments(5); // Placeholder until getTotalDepartments is implemented
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to load employees from SharePoint. Please check if the list exists and you have permissions.');
      console.error('Error fetching employees from Graph API:', err);
    }
  };
  // Fetch total employee and department counts when the component mounts
  React.useEffect(() => {
    fetchTotals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(Item);

  //Sync route with URL hash
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'employees' || hash === 'departments' || hash === 'dashboard') {
        setRoute(hash as Route);
      } else {
        setRoute('dashboard');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Navigation handler using window.location.href (full reload)
  const handleNavigate = (to: Route) => {
    window.location.href = `${props.context.pageContext.web.absoluteUrl}${window.location.pathname.replace(props.context.pageContext.web.serverRelativeUrl, '')}#${to}`;
    setRoute(to);
  };

  // Render the UI: loading, error, no data, or the appropriate page (dashboard, employee list, or department list)
  return (
    <section className={styles.peopleZone}>
      <div className={styles.welcome}>
        <h2>People Zone</h2>
        <div>Welcome {props.userDisplayName}!</div>
      </div>
      {loading && <div className={styles.loading}>Loading data...</div>}
      {error && <div className={styles.error}>{error}</div>}
      {!loading && !error && (
        <>
          {route === 'dashboard' && (
            <Dashboard
              totalEmployees={totalEmployees}
              totalDepartments={totalDepartments}
              onNavigate={handleNavigate}
            />
          )}
          {route === 'employees' && (
            <>
              <button
                className={styles.backButton}
                onClick={() => handleNavigate('dashboard')}
                style={{ marginBottom: 16 }}
              >
                ← Back to Dashboard
              </button>
              <EmployeePage context={props.context} getInitials={getInitials} getProfileImageUrl={getProfileImageUrl} />
            </>
          )}
          {route === 'departments' && (
            <>
              <button
                className={styles.backButton}
                onClick={() => handleNavigate('dashboard')}
                style={{ marginBottom: 16 }}
              >
                ← Back to Dashboard
              </button>
              <DepartmentPage context={props.context} />
            </>
          )}
        </>
      )}
    </section>
  );
};
export default PeopleZone;
