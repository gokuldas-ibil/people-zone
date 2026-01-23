import * as React from 'react';
import { IDepartment } from '../../models/IDepartment';
import styles from '../PeopleZone.module.scss';

interface DepartmentTableProps {
  departments: IDepartment[];
}

const DepartmentTable: React.FC<DepartmentTableProps> = ({ departments }) => (
  <div>
    <h3 style={{ color: '#0097a7', margin: '32px 0 16px 0', textAlign: 'center', fontWeight: 700 }}>Departments</h3>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Department Name</th>
          <th>Department Code</th>
          <th>Is Active</th>
        </tr>
      </thead>
      <tbody>
        {departments.map((dept) => (
          <tr key={dept.Id}>
            <td>{dept.DepartmentName}</td>
            <td>{dept.DepartmentCode}</td>
            <td>{dept.IsActive ? '✅' : ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DepartmentTable;
