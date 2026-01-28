import * as React from 'react';
import { useRef, useEffect } from 'react';
import { EmployeePageProps, IEmployee } from '../../models/IEmployee';
import { IDepartment } from '../../models/IDepartment';
import { GraphService } from '../../services/GraphService';
import EmployeeTable from './EmployeeTable';
import EmployeeSummary from './EmployeeSummary';
import styles from '../PeopleZone.module.scss';
import AddEmployeeContainer from './AddEmployeeContainer';

const EmployeePage: React.FC<EmployeePageProps> = ({ context, getInitials, getProfileImageUrl }) => {
  const [employees, setEmployees] = React.useState<IEmployee[]>([]);
  // Ref for scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Store scroll position before update
  const scrollPositionRef = useRef<number>(0);
  const [departments, setDepartments] = React.useState<IDepartment[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showAddModal, setShowAddModal] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');

  React.useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEmployees = async (): Promise<void> => {
    // Save scroll position before update
    if (scrollContainerRef.current) {
      scrollPositionRef.current = scrollContainerRef.current.scrollTop;
    }
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const client = await context.msGraphClientFactory.getClient('3');
      const service = new GraphService(client);
      await service.init(context, 'Employees');
      if (search.trim()) {
        const items = await service.searchEmployeesByTitle(search.trim());
        setEmployees(items);
      } else {
        await fetchEmployees();
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to search employees.');
      // eslint-disable-next-line no-console
      console.error('Error searching employees:', err);
    }
  };
  const total = employees.length;
  const active = employees.filter((e) => e.Status === 'Active').length;

  // Restore scroll position after employees update
  useEffect(() => {
    if (scrollContainerRef.current && scrollPositionRef.current > 0) {
      scrollContainerRef.current.scrollTop = scrollPositionRef.current;
      scrollPositionRef.current = 0;
    }
  }, [employees]);

  return (
    <div>
      <button className={styles.addButton} onClick={() => setShowAddModal(true)} style={{ marginBottom: 16 }}>
        + Add Employee
      </button>

      {/* Add Employee Modal */}
      {showAddModal && (
        <AddEmployeeContainer
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          onEmployeeAdded={fetchEmployees}
          departments={departments}
          context={context}
        />
      )}

      {/* Search Box */}
      <form onSubmit={handleSearch} style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button type="submit" className={styles.addButton}>
          Search
        </button>
        <button
          type="button"
          onClick={() => {
            setSearch('');
            fetchEmployees();
          }}
          style={{ marginLeft: 4 }}
        >
          Clear
        </button>
      </form>

      {loading && <div className={styles.loading}>Loading employees...</div>}
      {error && <div className={styles.error}>{error}</div>}
      <EmployeeSummary total={total} active={active} />
      {/* Scrollable container for employee table */}
      <div
        ref={scrollContainerRef}
        style={{ maxHeight: 500, overflowY: 'auto', border: '1px solid #eee', borderRadius: 4 }}
      >
        <EmployeeTable
          employees={employees}
          departments={departments}
          getInitials={getInitials}
          getProfileImageUrl={getProfileImageUrl}
        />
      </div>
    </div>
  );
};

export default EmployeePage;
