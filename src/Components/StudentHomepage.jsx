import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, FolderGit2, FileBadge, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { getItems, getUserById } from '../services/api';
import './StudentHomepage.css';

const StudentHomepage = ({ user }) => {
  const [stats, setStats] = useState({
    achievements: 0,
    projects: 0,
    certificates: 0,
    pendingVerifications: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileUser, setProfileUser] = useState(user || null);
  const navigate = useNavigate();

  useEffect(() => {
    setProfileUser(user || null);
  }, [user]);

  useEffect(() => {
    const loadDashboard = async () => {
      const studentId = user?.id;
      if (!studentId) {
        setStats({
          achievements: 0,
          projects: 0,
          certificates: 0,
          pendingVerifications: 0
        });
        setRecentActivities([]);
        setLoading(false);
        return;
      }

      try {
        const [achievementsResponse, projectsResponse, internshipsResponse, certificatesResponse, profileResponse] = await Promise.all([
          getItems('achievements', studentId),
          getItems('projects', studentId),
          getItems('internships', studentId),
          getItems('certificates', studentId),
          getUserById('student', studentId)
        ]);
        const achievements = Array.isArray(achievementsResponse)
          ? achievementsResponse
          : achievementsResponse?.items || [];
        const projects = Array.isArray(projectsResponse) ? projectsResponse : projectsResponse?.items || [];
        const internships = Array.isArray(internshipsResponse)
          ? internshipsResponse
          : internshipsResponse?.items || [];
        const certificates = Array.isArray(certificatesResponse)
          ? certificatesResponse
          : certificatesResponse?.items || [];
        const fetchedUser = profileResponse?.user || null;
        if (fetchedUser) {
          setProfileUser(fetchedUser);
          localStorage.setItem('user', JSON.stringify({ ...(user || {}), ...fetchedUser }));
        }
        const pending = [...achievements, ...projects, ...internships, ...certificates].filter(
          (item) => item.verificationStatus === 'pending'
        ).length;
        const approvedAchievements = achievements.filter(
          (item) => item.verificationStatus === 'verified'
        ).length;

        setStats({
          achievements: approvedAchievements,
          projects: projects.length,
          certificates: certificates.length,
          pendingVerifications: pending
        });

        const allActivities = [
          ...achievements.map((item) => ({ text: `Achievement added: ${item.title}`, date: item.date })),
          ...projects.map((item) => ({ text: `Project added: ${item.title}`, date: item.startDate })),
          ...certificates.map((item) => ({ text: `Certificate added: ${item.name}`, date: item.issueDate })),
          ...internships.map((item) => ({ text: `Internship added: ${item.title}`, date: item.startDate }))
        ]
          .filter((item) => item.date)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);

        setRecentActivities(allActivities);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user?.id]);

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'N/A';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="dashboard-container">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="hero-eyebrow">
            <Sparkles size={14} /> Student Dashboard
          </p>
          <h1>Welcome, {profileUser?.name || user?.name || 'Student'}!</h1>
          <p>Track progress and upload records.</p>
        </div>
      </section>

      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card stat-achievements">
            <div className="stat-icon">
              <Trophy size={22} />
            </div>
            <div className="stat-content">
              <h3>{loading ? '...' : stats.achievements}</h3>
              <p>Approved Achievements</p>
            </div>
          </div>

          <div className="stat-card stat-projects">
            <div className="stat-icon">
              <FolderGit2 size={22} />
            </div>
            <div className="stat-content">
              <h3>{loading ? '...' : stats.projects}</h3>
              <p>Projects Completed</p>
            </div>
          </div>

          <div className="stat-card stat-certificates">
            <div className="stat-icon">
              <FileBadge size={22} />
            </div>
            <div className="stat-content">
              <h3>{loading ? '...' : stats.certificates}</h3>
              <p>Certificates Earned</p>
            </div>
          </div>

          <div className="stat-card stat-pending">
            <div className="stat-icon">
              <Clock size={22} />
            </div>
            <div className="stat-content">
              <h3>{loading ? '...' : stats.pendingVerifications}</h3>
              <p>Pending Reviews</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content dashboard-content-simple">
        <div className="activity-card">
          <h3>Recent Activity</h3>
          {recentActivities.length > 0 ? (
            <div className="activity-timeline">
              {recentActivities.map((activity, index) => (
                <div key={`${activity.text}-${index}`} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <p className="timeline-text">{activity.text}</p>
                    <p className="timeline-time">{formatDate(activity.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No recent activity</h3>
            </div>
          )}
        </div>

        <div className="quick-links-card">
          <h3>Quick Links</h3>
          <div className="quick-links">
            <button onClick={() => navigate('/achievements')}>
              Achievements <ArrowRight size={15} />
            </button>
            <button onClick={() => navigate('/certificates')}>
              Certificates <ArrowRight size={15} />
            </button>
            <button onClick={() => navigate('/internships')}>
              Internships <ArrowRight size={15} />
            </button>
            <button onClick={() => navigate('/projects')}>
              Projects <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHomepage;
