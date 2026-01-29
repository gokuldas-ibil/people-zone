import React from 'react';
import styles from './ProfileContainer.module.scss';
import mainStyle from '../../PeopleZone.module.scss';
import { IEmployee } from '../../../models/IEmployee';
import { IDepartment } from '../../../models/IDepartment';

interface ProfileContainerProps {
  employee: IEmployee | null;
  departments: IDepartment[];
  getInitials: (name: string) => string;
  getProfileImageUrl: (employee: IEmployee) => string | null;
  onClose: () => void;
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({
  employee,
  departments,
  getInitials,
  getProfileImageUrl,
  onClose,
}) => {
  const initials = getInitials(employee ? employee.Title : '');

  // Find department name by lookup id or fallback
  let departmentName = 'N/A';
  const lookupId = (employee as any).DepartmentLookupId;
  if (lookupId) {
    const dept = departments.find((d) => d.Id === Number(lookupId));
    if (dept) departmentName = dept.DepartmentName;
  } else if (employee?.Department?.Title) {
    departmentName = employee.Department.Title;
  }

  return (
    <div className={mainStyle.modalOverlay}>
      <div
        className={mainStyle.modalContent}
        onClick={(e) => e.stopPropagation()}
        style={{ padding: 0, minWidth: 340, maxWidth: 400 }}
      >
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <h2>Employee Profile</h2>
            <button className={mainStyle.closeButton} onClick={onClose}>
              x
            </button>
          </div>
          <div className={styles.profileImageWrapper}>
            {employee?.ProfilePhoto ? (
              <img
                src={employee?.ProfilePhoto}
                alt={employee ? employee.Title : ''}
                className={styles.profileImage}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextSibling) {
                    (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
                  }
                }}
              />
            ) : (
              <div className={styles.noPhoto} style={{ display: employee?.ProfilePhoto ? 'none' : 'flex' }}>
                {initials}
              </div>
            )}
          </div>
          <div className={styles.profileDetails}>
            <div>
              <strong>Name:</strong> {employee ? employee.Title : ''}
            </div>
            <div>
              <strong>Department:</strong> {departmentName}
            </div>
            <div>
              <strong>Email:</strong> {employee ? employee.Email : 'N/A'}
            </div>
            <div>
              <strong>Employee ID:</strong> {employee ? employee.EmployeeID : 'N/A'}
            </div>
            <div>
              <strong>Role:</strong> {employee ? employee.Role : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileContainer;
