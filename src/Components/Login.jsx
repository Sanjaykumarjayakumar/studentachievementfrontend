import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
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
  const [googleLoading, setGoogleLoading] = useState(false);
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
      let message = err.message || 'Google login failed';

      if (message.toLowerCase().includes('missing firebase env values')) {
        setError('Google sign-in is not configured for this environment.');
        return;
      }

      // Handle different error cases
      if (message.toLowerCase().includes('account not found')) {
        const email = googleUser?.email ? ` (${googleUser.email})` : '';
        setError(
          `Account not found${email}. Google sign-in works only for student/staff accounts created with the same email. Admins must login using Admin ID + password.`
        );
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
      if (message.toLowerCase().includes('failed') || 
          message.toLowerCase().includes('network') ||
          message.toLowerCase().includes('timeout')) {
        setError('Network error. Please check your connection and try again.');
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
          <h1>Student Achievement Dashboard</h1>
          <p>Please login to your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="loginId">Email or Admin ID</label>
            <input
              type="text"
              id="loginId"
              name="loginId"
              value={formData.loginId}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter email, or admin ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn-login">
            Login
          </button>

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
