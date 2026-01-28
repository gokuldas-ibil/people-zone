import * as React from 'react';
import { EmployeeForm } from '../../models/IEmployee';
import { IDepartment } from '../../models/IDepartment';
import styles from '../PeopleZone.module.scss';

export interface AddEmployeeContainerProps {
  show: boolean;
  onClose: () => void;
  onEmployeeAdded: () => void;
  departments: IDepartment[];
  context: any;
}

const DEFAULT_FORM_STATE: EmployeeForm = {
  Title: '',
  EmployeeID: '',
  Email: '',
  DepartmentLookupId: '',
  Role: '',
  Manager: '',
  DateOfJoining: '',
  Status: 'Active',
  ProfilePhoto: '',
};

const AddEmployeeContainer: React.FC<AddEmployeeContainerProps> = ({ show, onClose, onEmployeeAdded, departments, context }) => {
  const [form, setForm] = React.useState<EmployeeForm>(DEFAULT_FORM_STATE);
  const [saving, setSaving] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!show) setForm(DEFAULT_FORM_STATE);
  }, [show]);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const client = await context.msGraphClientFactory.getClient('3');
      const { GraphService } = await import('../../services/GraphService');
      const service = new GraphService(client);
      await service.init(context, 'Employees');
      await service.addEmployee({
        Title: form.Title,
        EmployeeID: form.EmployeeID,
        Email: form.Email,
        DepartmentLookupId: Number(form.DepartmentLookupId),
        Role: form.Role,
        Manager: form.Manager ? { Title: form.Manager } : undefined,
        DateOfJoining: form.DateOfJoining,
        Status: form.Status,
        ProfilePhoto: form.ProfilePhoto,
      });
      setForm(DEFAULT_FORM_STATE);
      onEmployeeAdded();
      onClose();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error adding employee:', err);
    }
    setSaving(false);
  };

  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Add Employee</h3>
        <form onSubmit={handleAddEmployee}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input
                type="text"
                value={form.Title}
                onChange={(e) => setForm((f) => ({ ...f, Title: e.target.value }))}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Employee ID</label>
              <input
                type="text"
                value={form.EmployeeID}
                onChange={(e) => setForm((f) => ({ ...f, EmployeeID: e.target.value }))}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                value={form.Email}
                onChange={(e) => setForm((f) => ({ ...f, Email: e.target.value }))}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Department</label>
              <select
                value={form.DepartmentLookupId}
                onChange={(e) => setForm((f) => ({ ...f, DepartmentLookupId: e.target.value }))}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dep) => (
                  <option key={dep.Id} value={dep.Id}>
                    {dep.DepartmentName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Role</label>
              <input
                type="text"
                value={form.Role}
                onChange={(e) => setForm((f) => ({ ...f, Role: e.target.value }))}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Manager</label>
              <input
                type="text"
                value={form.Manager}
                onChange={(e) => setForm((f) => ({ ...f, Manager: e.target.value }))}
                placeholder="Manager Name"
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Date Of Joining</label>
              <input
                type="date"
                value={form.DateOfJoining}
                onChange={(e) => setForm((f) => ({ ...f, DateOfJoining: e.target.value }))}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Status</label>
              <select
                value={form.Status}
                onChange={(e) => setForm((f) => ({ ...f, Status: e.target.value }))}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Profile Photo URL</label>
            <input
              type="text"
              value={form.ProfilePhoto}
              onChange={(e) => setForm((f) => ({ ...f, ProfilePhoto: e.target.value }))}
              placeholder="Photo URL"
            />
          </div>
          <div className={styles.formActions}>
            <button type="button" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeContainer;
