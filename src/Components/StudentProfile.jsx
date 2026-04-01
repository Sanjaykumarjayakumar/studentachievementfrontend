import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BadgeInfo,
  Building2,
  GraduationCap,
  Lock,
  Mail,
  Shield,
  UsersRound
} from 'lucide-react';
import { useToast } from './ToastProvider';
import { getUserById, updateUserProfile } from '../services/api';
import './StudentProfile.css';

const passwordMeetsPolicy = (value, roleKey) => {
  const candidate = String(value || '');
  if (roleKey === 'admin') {
    return /^(?=.*[^A-Za-z0-9]).{8,}$/.test(candidate);
  }
  return /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/.test(candidate);
};

const StudentProfile = ({ user, onUserUpdate, role = 'admin' }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profileUser, setProfileUser] = useState(user || {});
  const [changingPassword, setChangingPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const roleKey = role === 'student' ? 'student' : role === 'staff' ? 'staff' : 'admin';
  const isStudent = roleKey === 'student';
  const isStaff = roleKey === 'staff';
  const isAdmin = roleKey === 'admin';

  const normalizeRole = (value) => {
    const candidate = String(value || '').trim().toLowerCase();
    if (candidate === 'admin' || candidate === 'staff' || candidate === 'student') return candidate;
    return undefined;
  };

  const mergeSessionUser = (patch) => {
    const base = user || {};
    const merged = { ...base, ...(patch || {}) };

    const normalized = normalizeRole(merged.role);
    if (!normalized && base.role) {
      merged.role = base.role;
    } else if (!normalized) {
      delete merged.role;
    } else {
      merged.role = normalized;
    }

    if ((merged.id === undefined || merged.id === null || merged.id === '') && base.id) {
      merged.id = base.id;
    }

    return merged;
  };

  const idLabel = useMemo(() => {
    if (isStudent) return 'Roll No';
    if (isStaff) return 'Staff ID';
    return 'Admin ID';
  }, [isStudent, isStaff]);

  const idValue = useMemo(() => {
    if (isStudent) return profileUser?.rollNo || profileUser?.username || '-';
    if (isStaff) return profileUser?.staffId || profileUser?.username || '-';
    return profileUser?.adminId || profileUser?.username || '-';
  }, [isStudent, isStaff, profileUser]);

  useEffect(() => {
    if (!user) return;
    setProfileUser(user);
  }, [user]);

  useEffect(() => {
    const id = user?.id;
    if (!id) return;
    const load = async () => {
      try {
        const response = await getUserById(roleKey, id);
        const nextUser = response?.user || null;
        if (nextUser) {
          const merged = mergeSessionUser(nextUser);
          setProfileUser(merged);
          onUserUpdate?.(merged);
        }
      } catch (_error) {
        // Keep the cached profile when offline/backends fail.
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleKey, user?.id]);

  const avatar = profileUser?.name?.charAt(0)?.toUpperCase() || 'U';

  const handleCancel = () => {
    if (saving) return;
    setChangingPassword(false);
    setFormData({ password: '', confirmPassword: '' });
  };

  const handleSavePassword = async () => {
    try {
      const password = String(formData.password || '').trim();
      const confirmPassword = String(formData.confirmPassword || '').trim();
      if (!password || !confirmPassword) {
        toast.error('Please fill in both password fields');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (!passwordMeetsPolicy(password, roleKey)) {
        toast.error(
          roleKey === 'admin'
            ? 'Password must be 8+ chars with 1 special character'
            : 'Password must be 8+ chars with 1 uppercase and 1 special character'
        );
        return;
      }
      const id = profileUser?.id || user?.id;
      if (!id) {
        toast.error('User session not found. Please login again.');
        return;
      }
      setSaving(true);
      const response = await updateUserProfile(roleKey, id, { password });
      const nextUser = response?.user || null;
      if (nextUser) {
        const merged = mergeSessionUser(nextUser);
        onUserUpdate?.(merged);
        setProfileUser(merged);
      }
      toast.success('Password updated');
      handleCancel();
    } catch (err) {
      toast.error(err.message || 'Unable to update password');
    } finally {
      setSaving(false);
    }
  };

  const mappedStaffLabel = useMemo(() => {
    const mapped = profileUser?.mappedStaff;
    if (!mapped) return 'Not yet mapped';
    const staffId = mapped.staffId ? ` (${mapped.staffId})` : '';
    return `${mapped.name || 'Staff'}${staffId}`;
  }, [profileUser]);

  return (
    <div className="profile-page">
      <div className="profile-top">
        <div>
          <p className="profile-kicker">Account</p>
          <h1 className="profile-title">Profile</h1>
          <p className="profile-subtitle">View your details and manage security settings.</p>
        </div>
        <span className="profile-role-pill">
          <Shield size={14} />
          {roleKey}
        </span>
      </div>

      <div className="profile-grid">
        <section className="profile-card profile-card-identity">
          <div className="profile-card-head">
            <h2>Identity</h2>
            <p>Basic information for your account.</p>
          </div>

          <div className="profile-identity">
            <div className="profile-avatar" aria-hidden="true">
              {avatar}
            </div>
            <div className="profile-identity-meta">
              <div className="profile-name">{profileUser?.name || 'User'}</div>
              <div className="profile-muted">{idLabel}: {idValue}</div>
            </div>
          </div>

          <div className="profile-fields">
            <div className="profile-field">
              <div className="profile-field-label">
                <BadgeInfo size={16} /> {idLabel}
              </div>
              <div className="profile-field-value">{idValue}</div>
            </div>

            {!isAdmin && (
              <div className="profile-field">
                <div className="profile-field-label">
                  <Mail size={16} /> Email
                </div>
                <div className="profile-field-value">{profileUser?.email || '-'}</div>
              </div>
            )}
          </div>
        </section>

        <section className="profile-card profile-card-details">
          <div className="profile-card-head">
            <h2>Details</h2>
            <p>{isStudent ? 'Academic details and mapping.' : isStaff ? 'Work details.' : 'Admin details.'}</p>
          </div>

          <div className="profile-fields">
            {(isStudent || isStaff) && (
              <div className="profile-field">
                <div className="profile-field-label">
                  <Building2 size={16} /> Department
                </div>
                <div className="profile-field-value">{profileUser?.department || '-'}</div>
              </div>
            )}

            {isStudent && (
              <>
                <div className="profile-field">
                  <div className="profile-field-label">
                    <GraduationCap size={16} /> Year
                  </div>
                  <div className="profile-field-value">{profileUser?.year || '-'}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">
                    <GraduationCap size={16} /> Semester
                  </div>
                  <div className="profile-field-value">{profileUser?.semester || '-'}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">
                    <UsersRound size={16} /> Mapped Staff
                  </div>
                  <div className="profile-field-value">{mappedStaffLabel}</div>
                </div>
              </>
            )}
          </div>

          {isStudent && (
            <div className="profile-card-actions">
              <button type="button" className="profile-btn secondary" onClick={() => navigate('/profile/map-staff')}>
                <UsersRound size={16} />
                Map Staff
              </button>
            </div>
          )}
        </section>

        <section className="profile-card profile-card-security">
          <div className="profile-card-head">
            <h2>Security</h2>
            <p>Update your password.</p>
          </div>

          {!changingPassword ? (
            <div className="profile-card-actions">
              <button type="button" className="profile-btn primary" onClick={() => setChangingPassword(true)}>
                <Lock size={16} />
                Change Password
              </button>
            </div>
          ) : (
            <div className="profile-form">
              <div className="profile-form-row">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                  disabled={saving}
                />
              </div>
              <div className="profile-form-row">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))}
                  disabled={saving}
                />
              </div>
              <p className="profile-hint">
                {roleKey === 'admin'
                  ? 'Use 8+ characters with 1 special character.'
                  : 'Use 8+ characters with 1 uppercase letter and 1 special character.'}
              </p>
              <div className="profile-form-actions">
                <button type="button" className="profile-btn ghost" onClick={handleCancel} disabled={saving}>
                  Cancel
                </button>
                <button type="button" className="profile-btn primary" onClick={handleSavePassword} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudentProfile;
