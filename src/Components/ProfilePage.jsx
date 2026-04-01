import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BadgeInfo, Building2, GraduationCap, Lock, Mail, Shield, UsersRound } from 'lucide-react';
import { useToast } from './ToastProvider';
import { getUserById, updateUserProfile } from '../services/api';
import './ProfilePage.css';

const passwordMeetsPolicy = (value, roleKey) => {
  const candidate = String(value || '');
  if (roleKey === 'admin') {
    return /^(?=.*[^A-Za-z0-9]).{8,}$/.test(candidate);
  }
  return /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/.test(candidate);
};

const passwordPolicyText = (roleKey) =>
  roleKey === 'admin'
    ? 'Use 8+ characters with 1 special character.'
    : 'Use 8+ characters with 1 uppercase letter and 1 special character.';

const ProfilePage = ({ user, onUserUpdate, role }) => {
  const { toast } = useToast();
  const roleKey = role === 'student' ? 'student' : role === 'staff' ? 'staff' : 'admin';
  const isStudent = roleKey === 'student';
  const isStaff = roleKey === 'staff';
  const isAdmin = roleKey === 'admin';

  const [profileUser, setProfileUser] = useState(() => user || null);
  const [loading, setLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });

  useEffect(() => {
    setProfileUser(user || null);
  }, [user]);

  const idLabel = useMemo(() => {
    if (isStudent) return 'Roll No';
    if (isStaff) return 'Staff ID';
    return 'Admin ID';
  }, [isStudent, isStaff]);

  const idValue = useMemo(() => {
    const u = profileUser || user || {};
    if (isStudent) return u.rollNo || u.username || '-';
    if (isStaff) return u.staffId || u.username || '-';
    return u.adminId || u.username || '-';
  }, [isStudent, isStaff, profileUser, user]);

  const mappedStaffLabel = useMemo(() => {
    const mapped = profileUser?.mappedStaff || null;
    if (!mapped) return 'Not yet mapped';
    const staffId = mapped.staffId ? ` (${mapped.staffId})` : '';
    return `${mapped.name || 'Staff'}${staffId}`;
  }, [profileUser]);

  useEffect(() => {
    const id = user?.id;
    if (!id) return;
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const response = await getUserById(roleKey, id);
        const fetched = response?.user || null;
        if (!fetched || cancelled) return;
        const merged = { ...(user || {}), ...fetched, role: roleKey };
        setProfileUser(merged);
        onUserUpdate?.(merged);
      } catch (_error) {
        // Keep cached user info when the backend is unavailable.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleKey, user?.id]);

  const avatar = (profileUser?.name || user?.name || 'U').charAt(0).toUpperCase();

  const handleCancelPassword = () => {
    if (savingPassword) return;
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
            ? 'Password must be at least 8 characters and include 1 special character'
            : 'Password must be at least 8 characters, include 1 uppercase letter and 1 special character'
        );
        return;
      }

      const id = user?.id || profileUser?.id;
      if (!id) {
        toast.error('User session not found. Please login again.');
        return;
      }

      setSavingPassword(true);
      const response = await updateUserProfile(roleKey, id, { password });
      const nextUser = response?.user || null;
      if (nextUser) {
        const merged = { ...(user || {}), ...nextUser, role: roleKey };
        setProfileUser(merged);
        onUserUpdate?.(merged);
      }
      toast.success('Password updated');
      handleCancelPassword();
    } catch (err) {
      toast.error(err.message || 'Unable to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="profile2-page">
      <div className="profile2-top">
        <div>
          <p className="profile2-kicker">Account</p>
          <h1 className="profile2-title">Profile</h1>
          <p className="profile2-subtitle">View your details and manage security settings.</p>
        </div>
        <span className="profile2-role-pill">
          <Shield size={14} />
          {roleKey}
        </span>
      </div>

      <div className="profile2-grid">
        <section className="profile2-card">
          <div className="profile2-card-head">
            <h2>Identity</h2>
            <p>Basic information for your account.</p>
          </div>

          <div className="profile2-identity">
            <div className="profile2-avatar" aria-hidden="true">
              {avatar}
            </div>
            <div className="profile2-identity-meta">
              <div className="profile2-name">{profileUser?.name || user?.name || 'User'}</div>
              <div className="profile2-muted">
                {idLabel}: {idValue}
              </div>
            </div>
          </div>

          <div className="profile2-fields">
            <div className="profile2-field">
              <div className="profile2-field-label">
                <BadgeInfo size={16} /> {idLabel}
              </div>
              <div className="profile2-field-value">{idValue}</div>
            </div>

            {!isAdmin && (
              <div className="profile2-field">
                <div className="profile2-field-label">
                  <Mail size={16} /> Email
                </div>
                <div className="profile2-field-value">{profileUser?.email || user?.email || '-'}</div>
              </div>
            )}
          </div>

          {loading && <div className="profile2-inline-note">Refreshing profile…</div>}
        </section>

        <section className="profile2-card">
          <div className="profile2-card-head">
            <h2>Details</h2>
            <p>{isStudent ? 'Academic details and mapping.' : isStaff ? 'Work details.' : 'Admin details.'}</p>
          </div>

          <div className="profile2-fields">
            {(isStudent || isStaff) && (
              <div className="profile2-field">
                <div className="profile2-field-label">
                  <Building2 size={16} /> Department
                </div>
                <div className="profile2-field-value">{profileUser?.department || '-'}</div>
              </div>
            )}

            {isStudent && (
              <>
                <div className="profile2-field">
                  <div className="profile2-field-label">
                    <GraduationCap size={16} /> Year
                  </div>
                  <div className="profile2-field-value">{profileUser?.year || '-'}</div>
                </div>
                <div className="profile2-field">
                  <div className="profile2-field-label">
                    <GraduationCap size={16} /> Semester
                  </div>
                  <div className="profile2-field-value">{profileUser?.semester || '-'}</div>
                </div>
                <div className="profile2-field">
                  <div className="profile2-field-label">
                    <UsersRound size={16} /> Mapped Staff
                  </div>
                  <div className="profile2-field-value">{mappedStaffLabel}</div>
                </div>
              </>
            )}
          </div>

          {isStudent && (
            <div className="profile2-actions">
              <Link to="/profile/map-staff" className="profile2-btn secondary">
                <UsersRound size={16} />
                Map Staff
              </Link>
            </div>
          )}
        </section>

        <section className="profile2-card">
          <div className="profile2-card-head">
            <h2>Security</h2>
            <p>Update your password.</p>
          </div>

          {!changingPassword ? (
            <div className="profile2-actions">
              <button type="button" className="profile2-btn primary" onClick={() => setChangingPassword(true)}>
                <Lock size={16} />
                Change Password
              </button>
            </div>
          ) : (
            <div className="profile2-form">
              <div className="profile2-form-row">
                <label htmlFor="profile2-password">New Password</label>
                <input
                  type="password"
                  id="profile2-password"
                  value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                  disabled={savingPassword}
                />
              </div>
              <div className="profile2-form-row">
                <label htmlFor="profile2-confirm">Confirm Password</label>
                <input
                  type="password"
                  id="profile2-confirm"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))}
                  disabled={savingPassword}
                />
              </div>
              <p className="profile2-hint">{passwordPolicyText(roleKey)}</p>
              <div className="profile2-actions">
                <button type="button" className="profile2-btn ghost" onClick={handleCancelPassword} disabled={savingPassword}>
                  Cancel
                </button>
                <button type="button" className="profile2-btn primary" onClick={handleSavePassword} disabled={savingPassword}>
                  {savingPassword ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;

