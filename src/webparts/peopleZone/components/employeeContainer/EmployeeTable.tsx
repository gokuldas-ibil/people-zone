import * as React from 'react';
import { IEmployee } from '../../models/IEmployee';
import { IDepartment } from '../../models/IDepartment';
import styles from '../PeopleZone.module.scss';

interface EmployeeTableProps {
  employees: IEmployee[];
  departments: IDepartment[];
  getInitials: (name: string) => string;
  getProfileImageUrl: (employee: IEmployee) => string | null;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, departments, getInitials, getProfileImageUrl }) => (
  <div className={styles.employeeList}>
    <div style={{ minWidth: 900 }}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Photo</th>
            <th>Full Name</th>
            <th>Employee ID</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Manager</th>
            <th>Date of Joining</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => {
            const imageUrl = getProfileImageUrl(employee);
            const initials = getInitials(employee.Title);

            // Find department name by lookup id (ensure type match)
            let departmentName = 'N/A';
            const lookupId = (employee as any).DepartmentLookupId;
            if (lookupId) {
              const dept = departments.find((d) => d.Id === Number(lookupId));
              if (dept) departmentName = dept.DepartmentName;
            } else if (employee.Department?.Title) {
              departmentName = employee.Department.Title;
            }
            return (
              <tr key={employee.Id}>
                <td>{employee.Id}</td>
                <td>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={employee.Title}
                      className={styles.profilePhoto}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextSibling) {
                          (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div className={styles.noPhoto} style={{ display: imageUrl ? 'none' : 'flex' }}>
                    {initials}
                  </div>
                </td>
                <td>{employee.Title}</td>
                <td>{employee.EmployeeID || 'N/A'}</td>
                <td>{employee.Email || 'N/A'}</td>
                <td>{departmentName}</td>
                <td>{employee.Role || 'N/A'}</td>
                <td>{employee.Manager?.Title || 'N/A'}</td>
                <td>{employee.DateOfJoining ? new Date(employee.DateOfJoining).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${employee.Status === 'Active' ? styles.active : styles.inactive}`}
                  >
                    {employee.Status || 'N/A'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default EmployeeTable;
