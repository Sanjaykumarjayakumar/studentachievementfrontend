import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createUserAccount, getUserStats } from '../services/api';
import { useToast } from './ToastProvider';
import { AlertCircle, LayoutDashboard, Users, UsersRound, ShieldCheck, User } from 'lucide-react';
import './AdminDashboard.css';

const semesterOptionsByYear = {
  '1': ['1', '2'],
  '2': ['3', '4'],
  '3': ['5', '6'],
  '4': ['7', '8']
};

const departmentOptions = [
  'Computer Science and Engineering',
  'Artificial Intelligence and Data Science',
  'Artificial Intelligence and Machine Learning',
  'Electronics and Communication Engineering'
];

const passwordMeetsPolicy = (value, role) => {
  const candidate = String(value || '');
  if (role === 'admin') {
    return /^(?=.*[^A-Za-z0-9]).{8,}$/.test(candidate);
  }
  return /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/.test(candidate);
};

const getPasswordPolicy = (role) =>
  role === 'admin'
    ? {
        pattern: '(?=.*[^A-Za-z0-9]).{8,}',
        message: 'Use 8+ characters with 1 special character.'
      }
    : {
        pattern: '(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}',
        message: 'Use 8+ characters with 1 uppercase letter and 1 special character.'
      };

const quickActions = [
  { to: '/admindashboard/students', label: 'Students', icon: Users },
  { to: '/admindashboard/staff', label: 'Staff', icon: UsersRound },
  { to: '/admindashboard/admins', label: 'Admins', icon: ShieldCheck },
  { to: '/admindashboard/profile', label: 'Profile', icon: User }
];

const createEmptyForm = (role = 'staff') => ({
  name: '',
  email: '',
  password: '',
  role,
  rollNo: '',
  staffId: '',
  adminId: '',
  department: '',
  semester: '',
  year: ''
});

const AdminDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({ total: 0, students: 0, staff: 0, admins: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState(() => createEmptyForm('staff'));
  const passwordPolicy = getPasswordPolicy(formData.role);
  const passwordIsValid = passwordMeetsPolicy(formData.password, formData.role);
  const passwordHasError = formData.password.trim().length > 0 && !passwordIsValid;
  const isCreateFormComplete =
    formData.name.trim() &&
    (
      formData.role === 'admin'
        ? formData.adminId.trim() && formData.password.trim() && passwordIsValid
        : formData.role === 'staff'
        ? formData.staffId.trim() &&
          formData.email.trim() &&
          formData.password.trim() &&
          formData.department.trim() &&
          passwordIsValid
        : formData.rollNo.trim() &&
          formData.email.trim() &&
          formData.password.trim() &&
          formData.department.trim() &&
          formData.year.trim() &&
          formData.semester.trim() &&
          passwordIsValid
    );

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const data = await getUserStats();
      setStats(data);
    } catch (err) {
      toast.error(err.message || 'Unable to load summary');
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      if (!passwordIsValid) {
        toast.error(
          formData.role === 'admin'
            ? 'Password must be at least 8 characters and include 1 special character'
            : 'Password must be at least 8 characters, include 1 uppercase letter and 1 special character'
        );
        return;
      }
      if (!window.confirm('Create this user?')) {
        return;
      }
      setCreating(true);
      const payload =
        formData.role === 'admin'
          ? {
              role: 'admin',
              name: formData.name,
              adminId: formData.adminId,
              password: formData.password
            }
          : formData.role === 'staff'
          ? {
              role: 'staff',
              name: formData.name,
              staffId: formData.staffId,
              email: formData.email,
              password: formData.password,
              department: formData.department
            }
          : {
              role: 'student',
              name: formData.name,
              rollNo: formData.rollNo,
              email: formData.email,
              password: formData.password,
              department: formData.department,
              year: formData.year,
              semester: formData.semester
            };
      await createUserAccount(payload);
      setFormData(createEmptyForm('staff'));
      toast.success('User created');
      await loadStats();
    } catch (err) {
      toast.error(err.message || 'Unable to create user');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-summary-panel admin-card">
        <div className="admin-summary-head">
          <div>
            <p className="admin-section-kicker">At a glance</p>
            <h2>Dashboard summary</h2>
          </div>
          {statsLoading && <p className="admin-loading">Loading summary...</p>}
        </div>
        <div className="admin-stats">
          <div className="admin-stat-card"><h3>{stats.total}</h3><p>Total Users</p></div>
          <div className="admin-stat-card"><h3>{stats.students}</h3><p>Students</p></div>
          <div className="admin-stat-card"><h3>{stats.staff}</h3><p>Staff</p></div>
          <div className="admin-stat-card"><h3>{stats.admins}</h3><p>Admins</p></div>
        </div>
      </div>

      <div className="admin-bottom-grid">
        <div className="admin-card admin-card-create">
          <div className="admin-card-head">
            <div>
              <p className="admin-section-kicker">Quick create</p>
              <h2>Create User</h2>
              <p>Provision student, staff, or admin access from one place.</p>
            </div>
          </div>
          <form onSubmit={handleCreateUser} className="admin-form">
            <div className="field-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                className="form-input"
                value={formData.role}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    role: e.target.value,
                    password: '',
                    email: e.target.value === 'admin' ? '' : p.email,
                    rollNo: '',
                    staffId: '',
                    adminId: e.target.value === 'admin' ? p.adminId : '',
                    department: '',
                    year: '',
                    semester: ''
                  }))
                }
              >
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </div>

            {formData.role === 'student' && (
              <>
                <div className="field-group">
                  <label htmlFor="rollNo">Roll No</label>
                  <input
                    id="rollNo"
                    className="form-input"
                    value={formData.rollNo}
                    onChange={(e) => setFormData((p) => ({ ...p, rollNo: e.target.value }))}
                    required
                  />
                </div>
                <div className="field-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    className="form-input"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="field-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-input-wrap">
                    <input
                      id="password"
                      className={`form-input ${passwordHasError ? 'form-input-error' : ''}`}
                      placeholder="Enter user password"
                      type="password"
                      minLength={8}
                      autoComplete="new-password"
                      pattern={passwordPolicy.pattern}
                      title={passwordPolicy.message}
                      value={formData.password}
                      onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                      aria-invalid={passwordHasError}
                      required
                    />
                    {passwordHasError && (
                      <span className="password-error-icon" aria-hidden="true">
                        <AlertCircle size={18} />
                      </span>
                    )}
                  </div>
                  {passwordHasError && <small className="field-error">{passwordPolicy.message}</small>}
                </div>
                <div className="field-group">
                  <label htmlFor="department">Department</label>
                  <select
                    id="department"
                    className="form-input"
                    value={formData.department}
                    onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))}
                    required
                  >
                    <option value="">Select Department</option>
                    {departmentOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field-group">
                  <label htmlFor="year">Year</label>
                  <select
                    id="year"
                    className="form-input"
                    value={formData.year}
                    onChange={(e) => setFormData((p) => ({ ...p, year: e.target.value, semester: '' }))}
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                  </select>
                </div>
                <div className="field-group">
                  <label htmlFor="semester">Semester</label>
                  <select
                    id="semester"
                    className="form-input"
                    value={formData.semester}
                    onChange={(e) => setFormData((p) => ({ ...p, semester: e.target.value }))}
                    required
                    disabled={!formData.year}
                  >
                    <option value="">Select Semester</option>
                    {(semesterOptionsByYear[formData.year] || []).map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            {formData.role === 'staff' && (
              <>
                <div className="field-group">
                  <label htmlFor="staffId">Staff ID</label>
                  <input
                    id="staffId"
                    className="form-input"
                    value={formData.staffId}
                    onChange={(e) => setFormData((p) => ({ ...p, staffId: e.target.value }))}
                    required
                  />
                </div>
                <div className="field-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    className="form-input"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="field-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-input-wrap">
                    <input
                      id="password"
                      className={`form-input ${passwordHasError ? 'form-input-error' : ''}`}
                      placeholder="Enter user password"
                      type="password"
                      minLength={8}
                      autoComplete="new-password"
                      pattern={passwordPolicy.pattern}
                      title={passwordPolicy.message}
                      value={formData.password}
                      onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                      aria-invalid={passwordHasError}
                      required
                    />
                    {passwordHasError && (
                      <span className="password-error-icon" aria-hidden="true">
                        <AlertCircle size={18} />
                      </span>
                    )}
                  </div>
                  {passwordHasError && <small className="field-error">{passwordPolicy.message}</small>}
                </div>
                <div className="field-group">
                  <label htmlFor="staffDepartment">Department</label>
                  <select
                    id="staffDepartment"
                    className="form-input"
                    value={formData.department}
                    onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))}
                    required
                  >
                    <option value="">Select Department</option>
                    {departmentOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            {formData.role === 'admin' && (
              <div className="field-group">
                <label htmlFor="adminId">Admin ID</label>
                <input
                  id="adminId"
                  className="form-input"
                  value={formData.adminId}
                  onChange={(e) => setFormData((p) => ({ ...p, adminId: e.target.value }))}
                  required
                />
              </div>
            )}
            {formData.role === 'admin' && (
              <div className="field-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrap">
                  <input
                    id="password"
                    className={`form-input ${passwordHasError ? 'form-input-error' : ''}`}
                    placeholder="Enter admin password"
                    type="password"
                    minLength={8}
                    autoComplete="new-password"
                    pattern={passwordPolicy.pattern}
                    title={passwordPolicy.message}
                    value={formData.password}
                    onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                    aria-invalid={passwordHasError}
                    required
                  />
                  {passwordHasError && (
                    <span className="password-error-icon" aria-hidden="true">
                      <AlertCircle size={18} />
                    </span>
                  )}
                </div>
                {passwordHasError && <small className="field-error">{passwordPolicy.message}</small>}
              </div>
            )}
            <button className="btn-submit" type="submit" disabled={creating || !isCreateFormComplete}>
              {creating ? 'Creating...' : 'Create'}
            </button>
          </form>
        </div>

        <div className="admin-card admin-card-actions">
          <div className="admin-card-head">
            <div>
              <p className="admin-section-kicker">Quick actions</p>
              <h2>Go to a user group</h2>
              <p>Open the section you need in the admin home page.</p>
            </div>
          </div>
          <div className="admin-pages">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.to} to={action.to} className="admin-page-link admin-action-tile">
                  <span className="admin-action-icon-wrap">
                    <Icon size={22} />
                  </span>
                  <span className="admin-action-label">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
