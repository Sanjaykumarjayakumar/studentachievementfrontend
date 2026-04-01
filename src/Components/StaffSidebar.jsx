import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Trophy, Briefcase, FileBadge, FolderGit2, ShieldCheck, User, LogOut, UserRound } from 'lucide-react';
import './StaffSidebar.css';

const StaffSidebar = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const requestLinks = [
    { path: '/staffdashboard/summary', label: 'Summary', icon: LayoutDashboard },
    { path: '/staffdashboard/achievements', label: 'Achievement Requests', icon: Trophy },
    { path: '/staffdashboard/internships', label: 'Internship Requests', icon: Briefcase },
    { path: '/staffdashboard/certificates', label: 'Certificate Requests', icon: FileBadge },
    { path: '/staffdashboard/projects', label: 'Project Requests', icon: FolderGit2 },
    { path: '/staffdashboard/profile', label: 'Profile', icon: User }
  ];

  return (
    <aside className="Staff-sidebar">
      <div className="Staff-sidebar-header">
        <div className="Staff-sidebar-brand">
          <ShieldCheck size={22} />
          <span>Staff Dashboard</span>
        </div>
      </div>

      <nav className="Staff-sidebar-nav">
        {requestLinks.map((link) => {
          const Icon = link.icon;
          return (
            <button
              type="button"
              key={link.path}
              className={`Staff-sidebar-item ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => {
                if (location.pathname !== link.path) {
                  navigate(link.path);
                }
              }}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="Staff-sidebar-footer">
        <div className="Staff-user-card">
          <div className="Staff-user-avatar">
            <UserRound size={22} />
          </div>
          <div className="Staff-user-info">
            <div className="Staff-user-name">{user?.name || 'Staff User'}</div>
            <div className="Staff-user-id">{user?.staffId || user?.email || '-'}</div>
          </div>
        </div>
        <button
          type="button"
          className="Staff-logout-btn"
          onClick={() => {
            onLogout?.();
            navigate('/login');
          }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default StaffSidebar;
