import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Trophy,
  FileBadge,
  FolderGit2,
  Briefcase,
  LogOut,
  Users,
  UsersRound,
  ShieldCheck,
  User,
  UserRound,
  Menu,
  X
} from 'lucide-react';
import { FaGraduationCap } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const normalizedRole = String(user?.role || '').trim().toLowerCase();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    onLogout();
    navigate('/login');
  };

  const studentLinks = [
    { path: '/homepage', label: 'Summary', icon: LayoutDashboard },
    { path: '/achievements', label: 'Achievement', icon: Trophy },
    { path: '/internships', label: 'Internship', icon: Briefcase },
    { path: '/certificates', label: 'Certificate', icon: FileBadge },
    { path: '/projects', label: 'Project', icon: FolderGit2 },
    { path: '/profile', label: 'Profile', icon: User }
  ];

  const staffLinks = [
    { path: '/staffdashboard/summary', label: 'Summary', icon: LayoutDashboard },
    { path: '/staffdashboard/mappedstudents', label: 'Mapped Students', icon: Users },
    { path: '/staffdashboard/achievements', label: 'Achievement Requests', icon: Trophy },
    { path: '/staffdashboard/internships', label: 'Internship Requests', icon: Briefcase },
    { path: '/staffdashboard/certificates', label: 'Certificate Requests', icon: FileBadge },
    { path: '/staffdashboard/projects', label: 'Project Requests', icon: FolderGit2 },
    { path: '/staffdashboard/profile', label: 'Profile', icon: User }
  ];

  const adminLinks = [
    { path: '/admindashboard', label: 'Summary', icon: LayoutDashboard },
    { path: '/admindashboard/students', label: 'Students', icon: Users },
    { path: '/admindashboard/staff', label: 'Staff', icon: UsersRound },
    { path: '/admindashboard/admins', label: 'Admins', icon: ShieldCheck },
    { path: '/admindashboard/profile', label: 'Profile', icon: User }
  ];

  const links = normalizedRole === 'admin' ? adminLinks : normalizedRole === 'staff' ? staffLinks : studentLinks;

  return (
    <>
      <button
        type="button"
        className={`navbar-backdrop ${mobileMenuOpen ? 'show' : ''}`}
        aria-label="Close menu"
        onClick={() => setMobileMenuOpen(false)}
      />

      <nav className={`navbar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-mobile-toggle"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="navbar-logo">
            <FaGraduationCap size={24} color="#FFFFFF" className="logo-icon" />
            <span className="logo-text">Achievement Portal</span>
          </div>
        </div>

        <div className="navbar-menu">
          {links.map((link) => {
            const Icon = link.icon;
            const end = link.path === '/admindashboard';
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={end}
                className={({ isActive: active }) => `navbar-item ${active ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon className="navbar-icon" size={20} />
                <span className="navbar-label">{link.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="navbar-footer">
          <div className="navbar-user">
            <div className="user-avatar">
              <span className="user-avatar-fallback">
                <UserRound size={24} className="user-avatar-fallback-icon" />
              </span>
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.rollNo || user?.staffId || user?.adminId || '-'}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
