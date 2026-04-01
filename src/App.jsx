import { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './Components/Login';
import Navbar from './Components/Navbar';
import StudentHomepage from './Components/StudentHomepage';
import ProfilePage from './Components/ProfilePage';
import MapStaff from './Components/MapStaff';
import Achievements from './Components/Achievements';
import AchievementDetails from './Components/AchievementDetails';
import Certificates from './Components/Certificates';
import CertificateDetails from './Components/CertificateDetails';
import Projects from './Components/Projects';
import ProjectDetails from './Components/ProjectDetails';
import Internships from './Components/Internships';
import InternshipDetails from './Components/InternshipDetails';
import ToastProvider from './Components/ToastProvider';
import StaffPanel from './Components/StaffPanel';
import AdminDashboard from './Components/AdminDashboard';
import AdminUsersPage from './Components/AdminUsersPage';
import ErrorBoundary from './Components/ErrorBoundary';
import './App.css';

function MainContent({ pathname, children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.classList.remove('page-enter');
    // Force reflow so the animation can restart without remounting.
    // eslint-disable-next-line no-unused-expressions
    el.offsetWidth;
    el.classList.add('page-enter');
  }, [pathname]);

  return (
    <div ref={containerRef} className="main-content page-enter">
      {children}
    </div>
  );
}

const ProtectedRoute = ({ sessionUser, handleLogout, handleUserUpdate, pathname, children }) => {
  if (!sessionUser) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="app-layout">
      <Navbar user={sessionUser} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />
      <ErrorBoundary resetKey={pathname}>
        <MainContent pathname={pathname}>{children}</MainContent>
      </ErrorBoundary>
    </div>
  );
};

const RoleRoute = ({ sessionUser, resolvedRole, allowedRoles, homePath, handleLogout, handleUserUpdate, pathname, children }) => {
  if (!sessionUser) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(resolvedRole)) {
    return <Navigate to={homePath} replace />;
  }
  return (
    <div className="app-layout">
      <Navbar user={sessionUser} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />
      <ErrorBoundary resetKey={pathname}>
        <MainContent pathname={pathname}>{children}</MainContent>
      </ErrorBoundary>
    </div>
  );
};

const StaffRoute = ({ sessionUser, resolvedRole, homePath, handleLogout, handleUserUpdate, pathname, children }) => {
  if (!sessionUser) {
    return <Navigate to="/login" replace />;
  }
  if (resolvedRole !== 'staff') {
    return <Navigate to={homePath} replace />;
  }
  return (
    <div className="app-layout">
      <Navbar user={sessionUser} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />
      <ErrorBoundary resetKey={pathname}>
        <MainContent pathname={pathname}>{children}</MainContent>
      </ErrorBoundary>
    </div>
  );
};

function AppRoutes() {
  const normalizeRole = (value) => {
    const candidate = String(value || '').trim().toLowerCase();
    if (candidate === 'admin' || candidate === 'staff' || candidate === 'student') return candidate;
    return undefined;
  };

  const inferRole = (sessionUser, pathname) => {
    const path = String(pathname || '');
    if (path.startsWith('/admindashboard')) return 'admin';
    if (path.startsWith('/staffdashboard')) return 'staff';

    const u = sessionUser || {};
    if (u.adminId) return 'admin';
    if (u.staffId) return 'staff';
    if (u.rollNo) return 'student';
    return undefined;
  };

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const parsed = savedUser ? JSON.parse(savedUser) : null;
      if (!parsed) return null;
      const normalized = { ...parsed };
      const role = normalizeRole(normalized.role);
      if (role) normalized.role = role;
      else delete normalized.role;
      return normalized;
    } catch (_error) {
      localStorage.removeItem('user');
      return null;
    }
  });
  const location = useLocation();
  const activeRole = normalizeRole(user?.role);
  const resolvedRole = activeRole || inferRole(user, location.pathname);
  const sessionUser =
    user && resolvedRole && normalizeRole(user.role) !== resolvedRole ? { ...user, role: resolvedRole } : user;
  const homePath =
    resolvedRole === 'admin' ? '/admindashboard' : resolvedRole === 'staff' ? '/staffdashboard' : '/homepage';

  useEffect(() => {
    if (!user) return;
    if (normalizeRole(user.role)) return;
    const inferred = inferRole(user, location.pathname);
    if (!inferred) return;
    const patched = { ...user, role: inferred };
    setUser(patched);
    localStorage.setItem('user', JSON.stringify(patched));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== 'user') return;
      try {
        setUser(event.newValue ? JSON.parse(event.newValue) : null);
      } catch (_error) {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogin = (userData) => {
    const normalized = { ...(userData || {}) };
    const role = normalizeRole(normalized.role);
    if (role) normalized.role = role;
    else delete normalized.role;
    setUser(normalized);
    localStorage.setItem('user', JSON.stringify(normalized));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleUserUpdate = (nextUserData) => {
    setUser((prev) => {
      const previousUser = prev || {};
      const incoming = nextUserData || {};
      const merged = { ...previousUser, ...incoming };

      const previousRole = normalizeRole(previousUser.role);
      const normalizedRole = normalizeRole(merged.role) || previousRole;
      if (normalizedRole) merged.role = normalizedRole;
      else delete merged.role;

      if ((merged.id === undefined || merged.id === null || merged.id === '') && previousUser.id) {
        merged.id = previousUser.id;
      }

      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={sessionUser ? <Navigate to={homePath} replace /> : <Login onLogin={handleLogin} />}
      />
      <Route path="/register" element={<Navigate to="/login" replace />} />
      <Route path="/admindashboard" element={<RoleRoute allowedRoles={['admin']} sessionUser={sessionUser} resolvedRole={resolvedRole} homePath={homePath} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}><AdminDashboard /></RoleRoute>} />
      <Route path="/admindashboard/students" element={<RoleRoute allowedRoles={['admin']} sessionUser={sessionUser} resolvedRole={resolvedRole} homePath={homePath} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}><AdminUsersPage role="student" /></RoleRoute>} />
      <Route path="/admindashboard/staff" element={<RoleRoute allowedRoles={['admin']} sessionUser={sessionUser} resolvedRole={resolvedRole} homePath={homePath} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}><AdminUsersPage role="staff" /></RoleRoute>} />
      <Route path="/admindashboard/admins" element={<RoleRoute allowedRoles={['admin']} sessionUser={sessionUser} resolvedRole={resolvedRole} homePath={homePath} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}><AdminUsersPage role="admin" /></RoleRoute>} />
      <Route
        path="/admindashboard/profile"
        element={
          <RoleRoute allowedRoles={['admin']} sessionUser={sessionUser} resolvedRole={resolvedRole} homePath={homePath} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}>
            <ProfilePage user={sessionUser} onUserUpdate={handleUserUpdate} role="admin" />
          </RoleRoute>
        }
      />
      <Route
        path="/admindashboard/profile/*"
        element={
          <RoleRoute allowedRoles={['admin']} sessionUser={sessionUser} resolvedRole={resolvedRole} homePath={homePath} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}>
            <ProfilePage user={sessionUser} onUserUpdate={handleUserUpdate} role="admin" />
          </RoleRoute>
        }
      />
      <Route path="/staffdashboard" element={<StaffRoute sessionUser={sessionUser} resolvedRole={resolvedRole} homePath={homePath} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}><Navigate to="/staffdashboard/summary" replace /></StaffRoute>} />
      <Route
        path="/staffdashboard/profile"
        element={
          <StaffRoute sessionUser={sessionUser} resolvedRole={resolvedRole} homePath={homePath} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}>
            <ProfilePage user={sessionUser} onUserUpdate={handleUserUpdate} role="staff" />
          </StaffRoute>
        }
      />
      <Route
        path="/staffdashboard/:requestType/:id"
        element={<StaffRoute sessionUser={sessionUser} resolvedRole={resolvedRole} homePath={homePath} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}><StaffPanel user={user} onLogout={handleLogout} onUserUpdate={handleUserUpdate} /></StaffRoute>}
      />
      <Route
        path="/staffdashboard/:requestType"
        element={<StaffRoute sessionUser={sessionUser} resolvedRole={resolvedRole} homePath={homePath} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}><StaffPanel user={user} onLogout={handleLogout} onUserUpdate={handleUserUpdate} /></StaffRoute>}
      />
      <Route
        path="/homepage"
        element={
          <ProtectedRoute sessionUser={sessionUser} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}>
            <StudentHomepage user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <RoleRoute allowedRoles={['student']} sessionUser={sessionUser} resolvedRole={resolvedRole} homePath={homePath} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}>
            <ProfilePage user={sessionUser} onUserUpdate={handleUserUpdate} role="student" />
          </RoleRoute>
        }
      />
      <Route
        path="/profile/map-staff"
        element={
          <RoleRoute allowedRoles={['student']} sessionUser={sessionUser} resolvedRole={resolvedRole} homePath={homePath} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}>
            <MapStaff user={user} onUserUpdate={handleUserUpdate} />
          </RoleRoute>
        }
      />
      <Route
        path="/achievements"
        element={
          <ProtectedRoute sessionUser={sessionUser} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}>
            <Achievements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/achievements/:id"
        element={
          <ProtectedRoute sessionUser={sessionUser} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}>
            <AchievementDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/certificates"
        element={
          <ProtectedRoute sessionUser={sessionUser} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}>
            <Certificates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/certificates/:id"
        element={
          <ProtectedRoute sessionUser={sessionUser} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}>
            <CertificateDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute sessionUser={sessionUser} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}>
            <Projects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute sessionUser={sessionUser} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}>
            <ProjectDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/internships"
        element={
          <ProtectedRoute sessionUser={sessionUser} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}>
            <Internships />
          </ProtectedRoute>
        }
      />
      <Route
        path="/internships/:id"
        element={
          <ProtectedRoute sessionUser={sessionUser} handleLogout={handleLogout} handleUserUpdate={handleUserUpdate} pathname={location.pathname}>
            <InternshipDetails />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={sessionUser ? homePath : '/login'} replace />} />
      <Route path="*" element={<Navigate to={sessionUser ? homePath : '/login'} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ToastProvider>
  );
}

export default App;
