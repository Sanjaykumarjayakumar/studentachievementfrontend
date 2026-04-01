import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trophy, FileBadge, FolderGit2, Briefcase, ArrowRight, Eye, Search, Sparkles } from 'lucide-react';
import { useToast } from './ToastProvider';
import { getItems, getMappedStudents } from '../services/api';
import './StaffDashboard.css';

const requestConfig = {
  summary: { title: 'Summary' },
  mappedstudents: { title: 'Mapped Students' },
  achievements: { title: 'Achievement Requests', routeType: 'achievements' },
  internships: { title: 'Internship Requests', routeType: 'internships' },
  certificates: { title: 'Certificate Requests', routeType: 'certificates' },
  projects: { title: 'Project Requests', routeType: 'projects' }
};

const quickActions = [
  { label: 'Mapped Students', path: '/staffdashboard/mappedstudents' },
  { label: 'Create Achievement Details', path: '/achievements' },
  { label: 'Create Internship Details', path: '/internships' },
  { label: 'Create Certificate Details', path: '/certificates' },
  { label: 'Create Project Details', path: '/projects' }
];

const isPendingRequest = (item) => !item.verificationStatus || item.verificationStatus === 'pending';

const StaffDashboard = ({ requestType = 'summary', currentStaffId = '', user }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [requestsByType, setRequestsByType] = useState({
    achievements: [],
    internships: [],
    certificates: [],
    projects: []
  });
  const [mappedStudents, setMappedStudents] = useState([]);
  const [mappedLoading, setMappedLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPending: 0,
    achievementsPending: 0,
    internshipsPending: 0,
    certificatesPending: 0,
    projectsPending: 0
  });

  const loadRequests = async () => {
    try {
      setLoading(true);
      const [achievementsResponse, internshipsResponse, certificatesResponse, projectsResponse] = await Promise.all([
        getItems('achievements', { mappedStaffId: currentStaffId }),
        getItems('internships', { mappedStaffId: currentStaffId }),
        getItems('certificates', { mappedStaffId: currentStaffId }),
        getItems('projects', { mappedStaffId: currentStaffId })
      ]);
      const achievements = Array.isArray(achievementsResponse)
        ? achievementsResponse
        : achievementsResponse?.items || [];
      const internships = Array.isArray(internshipsResponse)
        ? internshipsResponse
        : internshipsResponse?.items || [];
      const certificates = Array.isArray(certificatesResponse)
        ? certificatesResponse
        : certificatesResponse?.items || [];
      const projects = Array.isArray(projectsResponse) ? projectsResponse : projectsResponse?.items || [];

      const pendingAchievements = achievements.filter(isPendingRequest);
      const pendingInternships = internships.filter(isPendingRequest);
      const pendingCertificates = certificates.filter(isPendingRequest);
      const pendingProjects = projects.filter(isPendingRequest);

      setRequestsByType({
        achievements: pendingAchievements,
        internships: pendingInternships,
        certificates: pendingCertificates,
        projects: pendingProjects
      });

      setStats({
        totalPending:
          pendingAchievements.length +
          pendingInternships.length +
          pendingCertificates.length +
          pendingProjects.length,
        achievementsPending: pendingAchievements.length,
        internshipsPending: pendingInternships.length,
        certificatesPending: pendingCertificates.length,
        projectsPending: pendingProjects.length
      });
    } catch (err) {
      toast.error(err.message || 'Unable to load staff requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentStaffId) return;
    loadRequests();
  }, [currentStaffId]);

  useEffect(() => {
    if (!currentStaffId) return;
    if (requestType !== 'mappedstudents') return;
    const load = async () => {
      try {
        setMappedLoading(true);
        const response = await getMappedStudents(currentStaffId);
        setMappedStudents(response?.items || []);
      } catch (err) {
        toast.error(err.message || 'Unable to load mapped students');
      } finally {
        setMappedLoading(false);
      }
    };
    load();
  }, [currentStaffId, requestType, toast]);

  const currentConfig = requestConfig[requestType] || requestConfig.summary;
  const currentData =
    requestType === 'internships'
      ? requestsByType.internships
      : requestType === 'certificates'
      ? requestsByType.certificates
      : requestType === 'projects'
      ? requestsByType.projects
      : requestsByType.achievements;

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return currentData;
    const search = searchTerm.toLowerCase();
    return currentData.filter((item) => {
      const fields = [
        item.studentName,
        item.rollNo,
        item.title,
        item.name,
        item.company,
        item.issuingOrg,
        item.organizingBody
      ]
        .map((v) => String(v || '').toLowerCase())
        .join(' ');
      return fields.includes(search);
    });
  }, [currentData, searchTerm]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="Staff-dashboard-container">
      {requestType === 'summary' ? (
        <section className="hero-card">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              <Sparkles size={14} /> STAFF DASHBOARD
            </p>
            <h1>Welcome, {user?.name || 'Staff'}!</h1>
            <p>{currentConfig.title}</p>
          </div>
        </section>
      ) : (
        <div className="Staff-header">
          <div className="header-content">
            <h1>Staff Dashboard</h1>
            <p>{currentConfig.title}</p>
          </div>
        </div>
      )}

      {requestType === 'mappedstudents' ? (
        <div className="content-section">
          {mappedLoading ? (
            <div className="no-data"><p>Loading mapped students...</p></div>
          ) : mappedStudents.length === 0 ? (
            <div className="no-data"><p>No students mapped yet</p></div>
          ) : (
            <div className="table-container">
              <table className="Staff-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {mappedStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name || 'Student'}</td>
                      <td>{student.email || 'N/A'}</td>
                      <td>{student.year || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : requestType === 'summary' ? (
        <div className="summary-layout">
          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat-card total"><div className="stat-icon"><Clock size={24} /></div><div className="stat-content"><h3>{stats.totalPending}</h3><p>Total Pending</p></div></div>
              <div className="stat-card achievements"><div className="stat-icon"><Trophy size={24} /></div><div className="stat-content"><h3>{stats.achievementsPending}</h3><p>Achievements</p></div></div>
              <div className="stat-card internships"><div className="stat-icon"><Briefcase size={24} /></div><div className="stat-content"><h3>{stats.internshipsPending}</h3><p>Internships</p></div></div>
              <div className="stat-card certificates"><div className="stat-icon"><FileBadge size={24} /></div><div className="stat-content"><h3>{stats.certificatesPending}</h3><p>Certificates</p></div></div>
              <div className="stat-card projects"><div className="stat-icon"><FolderGit2 size={24} /></div><div className="stat-content"><h3>{stats.projectsPending}</h3><p>Projects</p></div></div>
            </div>
          </div>

          <div className="quick-actions-card">
            <h3>Quick Actions</h3>
            <p>Create details quickly from matching student forms.</p>
            <div className="quick-actions-list">
              {quickActions.map((action) => (
                <Link key={action.path} to={action.path} className="quick-action-link">
                  <span>{action.label}</span>
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="staff-page-search">
            <Search size={16} />
            <input
              type="text"
              placeholder={`Search ${requestType} requests...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="content-section">
            {loading ? (
              <div className="no-data"><p>Loading requests...</p></div>
            ) : filteredData.length === 0 ? (
              <div className="no-data"><p>No pending requests found</p></div>
            ) : (
              <div className="table-container">
                <table className="Staff-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Roll No</th>
                      <th>Title</th>
                      <th>Submitted On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.studentName || 'Student'}</td>
                        <td>{item.rollNo || 'N/A'}</td>
                        <td>{item.title || item.name || 'N/A'}</td>
                        <td>{formatDate(item.date || item.issueDate || item.startDate)}</td>
                        <td>
                          <Link
                            to={`/staffdashboard/${currentConfig.routeType}/${item.id}`}
                            className="btn-view"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StaffDashboard;
