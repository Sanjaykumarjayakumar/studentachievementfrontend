import { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from './ToastProvider';
import { createItem, deleteItem, getItems } from '../services/api';
import './Achievements.css';

const Achievements = () => {
  const { toast } = useToast();
  const [achievements, setAchievements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    organizingBody: '',
    date: '',
    endDate: '',
    description: '',
    achievementPdfName: '',
    achievementPdfData: ''
  });
  const isAchievementFormComplete =
    formData.title.trim() &&
    formData.organizingBody.trim() &&
    formData.date &&
    formData.description.trim() &&
    formData.achievementPdfData;

  useEffect(() => {
    loadAchievements(true);
  }, []);

  const loadAchievements = async (reset = false) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await getItems('achievements', { studentId: user.id, page: reset ? 1 : page, limit: 10 });
      const normalized = Array.isArray(response) ? { items: response, total: response.length } : (response || {});
      const newAchievements = normalized.items || [];
      setAchievements((prev) => (reset ? newAchievements : [...prev, ...newAchievements]));
      const currentCount = reset ? 0 : achievements.length;
      const nextCount = currentCount + newAchievements.length;
      const total = Number.isFinite(Number(normalized.total)) ? Number(normalized.total) : nextCount;
      setHasMore(newAchievements.length > 0 && nextCount < total);
    } catch (err) {
      toast.error(err.message || 'Unable to load achievements');
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
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
  }, [loader, hasMore]);

  useEffect(() => {
    if (page > 1) {
      loadAchievements();
    }
  }, [page]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.organizingBody || !formData.date || !formData.description || !formData.achievementPdfData) {
      toast.error('Please fill in all required fields');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const newAchievement = {
      ...formData,
      studentId: user.id,
      category: 'student achievement dashboard project',
      verificationStatus: 'pending',
      studentName: user.name || user.username || 'Student',
      rollNo: user.rollNo || 'N/A'
    };

    try {
      await createItem('achievements', newAchievement);
      setPage(1);
      await loadAchievements(true);
      setFormData({
        title: '',
        organizingBody: '',
        date: '',
        endDate: '',
        description: '',
        achievementPdfName: '',
        achievementPdfData: ''
      });
      setShowForm(false);
      toast.success('Achievement submitted successfully');
      } catch (err) {
        toast.error(err.message || 'Unable to submit achievement');
      }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFormData((prev) => ({
        ...prev,
        achievementPdfName: '',
        achievementPdfData: ''
      }));
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file only');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        achievementPdfName: file.name,
        achievementPdfData: String(reader.result || '')
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (achievementId) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      toast.error('User session not found. Please login again.');
      return;
    }

    const confirmed = window.confirm('Delete this achievement request?');
    if (!confirmed) return;

    try {
      await deleteItem('achievements', achievementId, user.id);
      loadAchievements(true);
      toast.success('Achievement request deleted');
    } catch (err) {
      toast.error(err.message || 'Unable to delete achievement');
    }
  };

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <h1>Achievements</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-add">
            <Plus size={20} />
            Add Achievement
          </button>
        )}
      </div>

      {showForm ? (
        <div className="form-container">
          <h2>Add Achievement</h2>
          <form onSubmit={handleSubmit} className="achievement-form">
            <div className="form-group">
              <label htmlFor="title">Achievement Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="organizingBody">Organizing Body *</label>
              <input
                type="text"
                id="organizingBody"
                name="organizingBody"
                value={formData.organizingBody}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                rows="4"
                required
              />
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="achievementPdf">Upload PDF *</label>
              <input
                type="file"
                id="achievementPdf"
                name="achievementPdf"
                accept=".pdf,application/pdf"
                onChange={handlePdfChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={!isAchievementFormComplete}>
                Add Achievement
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="table-container">
          {achievements.length > 0 ? (
            <table className="achievements-table">
              <thead>
                <tr>
                  <th>Achievement Title</th>
                  <th>Organizing Body</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((achievement) => (
                  <tr key={achievement.id}>
                    <td>{achievement.title}</td>
                    <td>{achievement.organizingBody}</td>
                    <td>{achievement.date ? new Date(achievement.date).toLocaleDateString() : '-'}</td>
                    <td>{achievement.endDate ? new Date(achievement.endDate).toLocaleDateString() : '-'}</td>
                    <td>
                      <span className={`status-badge ${achievement.verificationStatus}`}>
                        {achievement.verificationStatus}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/achievements/${achievement.id}`} className="btn-view">
                          View Details
                        </Link>
                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => handleDelete(achievement.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-achievements">
              <p>No achievements available</p>
            </div>
          )}
          <div ref={loader}></div>
        </div>
      )}
    </div>
  );
}

export default Achievements;
