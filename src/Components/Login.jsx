import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { googleLogin, loginUser } from '../services/api';
import './Login.css';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="currentColor" d="M21.8 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.5c-.2 1.3-.9 2.4-2 3.1v2.6h3.2c1.9-1.7 3.1-4.3 3.1-7.7Z" />
    <path fill="currentColor" d="M12 22c2.7 0 5-.9 6.7-2.5l-3.2-2.6c-.9.6-2 .9-3.5.9-2.7 0-4.9-1.8-5.7-4.2H3v2.7C4.7 19.6 8.1 22 12 22Z" />
    <path fill="currentColor" d="M6.3 13.6c-.2-.6-.3-1.1-.3-1.6s.1-1.1.3-1.6V7.7H3C2.4 9 2 10.5 2 12s.4 3 1 4.3l3.3-2.7Z" />
    <path fill="currentColor" d="M12 6.2c1.5 0 2.8.5 3.8 1.4l2.9-2.9C17 3.2 14.7 2 12 2 8.1 2 4.7 4.4 3 7.7l3.3 2.7c.8-2.4 3-4.2 5.7-4.2Z" />
  </svg>
);

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    loginId: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.loginId || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoginLoading(true);
      const response = await loginUser(formData);
      onLogin(response.user);
      navigate(
        response.user.role === 'admin'
          ? '/admindashboard'
          : response.user.role === 'staff'
          ? '/staffdashboard'
          : '/homepage'
      );
    } catch (err) {
      setError(err.message || 'Unable to login');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    let googleUser = null;
    try {
      setGoogleLoading(true);

      const { auth, googleProvider } = await import('../firebase');
      const result = await signInWithPopup(auth, googleProvider);
      googleUser = result.user;

      const getFreshIdToken = async () => result.user.getIdToken(true);

      let response;
      try {
        response = await googleLogin({
          idToken: await getFreshIdToken()
        });
      } catch (apiError) {
        const message = String(apiError?.message || '');
        if (message.toLowerCase().includes('invalid or expired firebase token')) {
          response = await googleLogin({
            idToken: await getFreshIdToken()
          });
        } else {
          throw apiError;
        }
      }

      onLogin(response.user);
      navigate(
        response.user.role === 'admin'
          ? '/admindashboard'
          : response.user.role === 'staff'
          ? '/staffdashboard'
          : '/homepage'
      );
    } catch (err) {
      const host = typeof window !== 'undefined' ? window.location.hostname : '';
      let message = err.message || 'Google login failed';

      if (message.toLowerCase().includes('missing firebase env values')) {
        setError('Google sign-in is not configured for this environment.');
        return;
      }

      if (err?.code === 'auth/unauthorized-domain') {
        setError(
          `Google sign-in is blocked for this domain${host ? ` (${host})` : ''}. Add it in Firebase Console → Authentication → Settings → Authorized domains.`
        );
        return;
      }

      if (err?.code === 'auth/invalid-credential') {
        setError(
          `Google sign-in failed due to invalid credentials. This usually means the Firebase OAuth configuration is incorrect for this domain${host ? ` (${host})` : ''}.`
        );
        return;
      }

      // Handle different error cases
      if (message.toLowerCase().includes('account not found')) {
        setError('Account not found');
        return;
      }
      
      // Handle "popup closed by user" error
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/popup-blocked' ||
        message.toLowerCase().includes('popup closed') ||
        message.toLowerCase().includes('popup blocked')
      ) {
        setError('Google sign-in popup was closed. Please try again.');
        return;
      }
      
      // Handle network/Firebase errors
      if (
        err?.isNetworkError ||
        message.toLowerCase().includes('failed') ||
        message.toLowerCase().includes('network') ||
        message.toLowerCase().includes('timeout')
      ) {
        setError('Network error. Please check your connection / API URL and try again.');
        return;
      }
      
      setError(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Student Achievement Dashboard</h2>
          <p>Sign in with your Email/Admin ID</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="loginId">Email or Admin ID</label>
            <div className="input-wrap">
              <div className="input-shell">
                <span className="input-icon-slot" aria-hidden="true">
                  <Mail size={18} className="input-icon" />
                </span>
                <input
                  type="text"
                  id="loginId"
                  name="loginId"
                  value={formData.loginId}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Email/Admin ID"
                  autoComplete="username"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <div className="input-shell">
                <span className="input-icon-slot" aria-hidden="true">
                  <Lock size={18} className="input-icon" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input password-input"
                  placeholder="Password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-login" disabled={loginLoading}>
            {loginLoading ? 'Logging in...' : 'Login'}
          </button>

          <div className="login-divider" role="separator" aria-label="or">
            <span>or</span>
          </div>

          <button type="button" className="btn-google" onClick={handleGoogleLogin} disabled={googleLoading}>
            <GoogleIcon />
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <div className="register-link">
            Accounts are created and managed by an admin.
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
