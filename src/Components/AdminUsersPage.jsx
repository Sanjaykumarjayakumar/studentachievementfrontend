import { useEffect, useState, useRef } from 'react';
import { deleteUser, getUsers, updateUserBlocked, updateUserProfile } from '../services/api';
import { useToast } from './ToastProvider';
import './AdminDashboard.css';

const roleTitles = {
  student: 'Student Users',
  staff: 'Staff Users',
  admin: 'Admin Users'
};

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

const AdminUsersPage = ({ role }) => {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    rollNo: '',
    staffId: '',
    department: '',
    semester: '',
    year: '',
    password: ''
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const showEmailColumn = role !== 'admin';
  const searchPlaceholder = role === 'admin' ? 'Search admin by name or admin ID' : `Search ${role} by name or email`;
  const passwordPolicy =
    role === 'admin'
      ? {
          pattern: '(?=.*[^A-Za-z0-9]).{8,}',
          message: 'Password must be at least 8 characters with 1 special character.'
        }
      : {
          pattern: '(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}',
          message: 'Password must be at least 8 characters with 1 uppercase and 1 special character.'
        };
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const normalizeId = (value) => String(value || '').trim().toLowerCase();

  const loadUsers = async (reset = false) => {
    try {
      setLoading(true);
      if (reset) {
        setPage(1);
      }
      const response = await getUsers({ role, search, page: reset ? 1 : page, limit: 10 });
      const newUsers = response.items || [];
      setUsers((prev) => (reset ? newUsers : [...prev, ...newUsers]));
      setHasMore(newUsers.length > 0 && (reset ? newUsers.length : users.length + newUsers.length) < response.total);
      setTotalUsers(Number(response.total || 0));
    } catch (err) {
      toast.error(err.message || 'Unable to load users');
    } finally {
      setLoading(false);
    }
  };





  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loader, hasMore, loading]);

  useEffect(() => {
    loadUsers(true);
  }, [role, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (page > 1) {
      loadUsers();
    }
  }, [page]);

  const handleDelete = async (id, isDefaultAdmin) => {
    try {
      if (isDefaultAdmin) return;
      if (!window.confirm('Delete this user?')) {
        return;
      }
      setBusyId(id);
      await deleteUser(role, id);
      toast.success('User deleted');
      await loadUsers(true);
    } catch (err) {
      toast.error(err.message || 'Unable to delete user');
    } finally {
      setBusyId('');
    }
  };

  const handleToggleBlocked = async (id, blocked, isDefaultAdmin) => {
    try {
      if (isDefaultAdmin) return;
      const nextBlocked = !blocked;
      if (!window.confirm(`${nextBlocked ? 'Block' : 'Unblock'} this user?`)) {
        return;
      }
      setBusyId(id);
      await updateUserBlocked(role, id, nextBlocked);
      toast.success(nextBlocked ? 'User blocked' : 'User unblocked');
      await loadUsers(true);
    } catch (err) {
      toast.error(err.message || 'Unable to update user status');
    } finally {
      setBusyId('');
    }
  };

  const handleOpenEdit = (user) => {
    setEditUser(user);
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      rollNo: user?.rollNo || '',
      staffId: user?.staffId || '',
      department: user?.department || '',
      semester: user?.semester || '',
      year: user?.year || '',
      password: ''
    });
  };

  const handleCloseEdit = () => {
    if (savingEdit) return;
    setEditUser(null);
    setEditForm({
      name: '',
      email: '',
      rollNo: '',
      staffId: '',
      department: '',
      semester: '',
      year: '',
      password: ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editUser) return;
    if (role === 'student') {
      if (!editForm.rollNo.trim() || !editForm.email.trim() || !editForm.department.trim() || !editForm.year.trim() || !editForm.semester.trim()) {
        toast.error('Please fill in all required student fields');
        return;
      }
    }
    if (role === 'staff') {
      if (!editForm.staffId.trim() || !editForm.email.trim() || !editForm.department.trim()) {
        toast.error('Please fill in all required staff fields');
        return;
      }
    }
    const payload = {
      name: editForm.name,
      password: editForm.password,
      allowNameUpdate: true
    };
    if (role === 'student') {
      payload.email = editForm.email;
      payload.rollNo = editForm.rollNo;
      payload.department = editForm.department;
      payload.semester = editForm.semester;
      payload.year = editForm.year;
    }
    if (role === 'staff') {
      payload.email = editForm.email;
      payload.staffId = editForm.staffId;
      payload.department = editForm.department;
    }

    try {
      setSavingEdit(true);
      await updateUserProfile(role, editUser.id, payload);
      toast.success('User updated');
      await loadUsers(true);
      handleCloseEdit();
    } catch (err) {
      toast.error(err.message || 'Unable to update user');
    } finally {
      setSavingEdit(false);
    }
  };

  const getInitials = (value) =>
    String(value || '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'U';

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>{roleTitles[role]}</h1>
      </div>

      <div className="admin-card">
        <div className="admin-users-head">
          <input
            className="form-input admin-search"
            placeholder={searchPlaceholder}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="admin-users-cards">
            {users.map((user) => {
              const isDefaultAdmin = role === 'admin' && user.adminId === 'admin';
              const currentAdminId = normalizeId(currentUser?.adminId || currentUser?.username || '');
              const rowAdminId = normalizeId(user.adminId || user.username || '');
              const isSelfAdmin =
                role === 'admin' &&
                ((currentUser?.id && currentUser.id === user.id) ||
                  (currentAdminId && rowAdminId && currentAdminId === rowAdminId));
              const isProtectedAdmin = isDefaultAdmin || isSelfAdmin;
              const idLabel = role === 'student' ? 'Roll No' : role === 'staff' ? 'Staff ID' : 'Admin ID';
              return (
                <div className="admin-user-card" key={user.id}>
                  <div className="admin-user-card-head">
                    <div className="admin-user-avatar">{getInitials(user.name)}</div>
                    <div className="admin-user-meta">
                      <h3>{user.name}</h3>
                      {showEmailColumn && <p>{user.email}</p>}
                    </div>
                    <div className="admin-user-status">
                      <span>Status</span>
                      <strong>{user.blocked ? 'Blocked' : 'Active'}</strong>
                    </div>
                  </div>
                  <div className="admin-user-card-body">
                    <div className="admin-user-row">
                      <span>{idLabel}</span>
                      <strong>{user.rollNo || user.staffId || user.adminId || '-'}</strong>
                    </div>
                  </div>
                  <div className="admin-user-card-actions">
                    <button
                      className="btn-secondary"
                      onClick={() => handleOpenEdit(user)}
                      disabled={busyId === user.id}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-submit"
                      onClick={() => handleToggleBlocked(user.id, user.blocked, isProtectedAdmin)}
                      disabled={isProtectedAdmin || busyId === user.id}
                    >
                      {busyId === user.id ? 'Please wait...' : user.blocked ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(user.id, isProtectedAdmin)}
                      disabled={isProtectedAdmin || busyId === user.id}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
            <div ref={loader} />
            {!users.length && !loading && <div className="admin-empty">No data found</div>}
          </div>
        )}


      </div>

      {editUser && (
        <div className="admin-modal-overlay" onClick={handleCloseEdit}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Edit {roleTitles[role].replace(' Users', '')}</h3>
              <p>{editUser.rollNo || editUser.staffId || editUser.adminId || editUser.email || ''}</p>
            </div>
          <div className="admin-modal-body">
            <label className="admin-modal-label" htmlFor="edit-name">Name</label>
            <input
              id="edit-name"
              className="form-input"
              value={editForm.name}
              onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
            />
            {role === 'student' && (
              <>
                <label className="admin-modal-label" htmlFor="edit-rollNo">Roll No</label>
                <input
                  id="edit-rollNo"
                  className="form-input"
                  value={editForm.rollNo}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, rollNo: e.target.value }))}
                />
                <label className="admin-modal-label" htmlFor="edit-email">Email</label>
                <input
                  id="edit-email"
                  className="form-input"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                />
                <label className="admin-modal-label" htmlFor="edit-department">Department</label>
                <select
                  id="edit-department"
                  className="form-input"
                  value={editForm.department}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, department: e.target.value }))}
                >
                  <option value="">Select Department</option>
                  {departmentOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <label className="admin-modal-label" htmlFor="edit-year">Year</label>
                <select
                  id="edit-year"
                  className="form-input"
                  value={editForm.year}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, year: e.target.value, semester: '' }))}
                >
                  <option value="">Select Year</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
                <label className="admin-modal-label" htmlFor="edit-semester">Semester</label>
                <select
                  id="edit-semester"
                  className="form-input"
                  value={editForm.semester}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, semester: e.target.value }))}
                  disabled={!editForm.year}
                >
                  <option value="">Select Semester</option>
                  {(semesterOptionsByYear[editForm.year] || []).map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </>
            )}
            {role === 'staff' && (
              <>
                <label className="admin-modal-label" htmlFor="edit-staffId">Staff ID</label>
                <input
                  id="edit-staffId"
                  className="form-input"
                  value={editForm.staffId}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, staffId: e.target.value }))}
                />
                <label className="admin-modal-label" htmlFor="edit-email">Email</label>
                <input
                  id="edit-email"
                  className="form-input"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                />
                <label className="admin-modal-label" htmlFor="edit-department">Department</label>
                <select
                  id="edit-department"
                  className="form-input"
                  value={editForm.department}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, department: e.target.value }))}
                >
                  <option value="">Select Department</option>
                  {departmentOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </>
            )}
            <label className="admin-modal-label" htmlFor="edit-password">New Password</label>
            <input
              id="edit-password"
              className="form-input"
              type="password"
                placeholder="Leave blank to keep current password"
                value={editForm.password}
                onChange={(e) => setEditForm((prev) => ({ ...prev, password: e.target.value }))}
                pattern={passwordPolicy.pattern}
                title={passwordPolicy.message}
              />
              <p className="admin-modal-hint">
                {passwordPolicy.message}
              </p>
            </div>
            <div className="admin-modal-footer">
              <button className="btn-delete" type="button" onClick={handleCloseEdit} disabled={savingEdit}>
                Cancel
              </button>
              <button className="btn-submit" type="button" onClick={handleSaveEdit} disabled={savingEdit}>
                {savingEdit ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
