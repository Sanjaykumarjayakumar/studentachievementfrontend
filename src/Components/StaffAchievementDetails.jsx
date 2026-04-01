import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DeclineModal from './DeclineModal';
import { useToast } from './ToastProvider';
import './Achievements.css';
import './StaffDashboard.css';

const StaffAchievementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [achievement, setAchievement] = useState(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('achievements') || '[]');
    const found = saved.find((item) => String(item.id) === String(id));
    setAchievement(found || null);
  }, [id]);

  const updateStatus = (status, remarks = '') => {
    const allAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    const updatedAchievements = allAchievements.map((item) =>
      String(item.id) === String(id) ? { ...item, verificationStatus: status, remarks } : item
    );

    localStorage.setItem('achievements', JSON.stringify(updatedAchievements));
    setAchievement((prev) => (prev ? { ...prev, verificationStatus: status, remarks } : prev));
  };

  const handleApprove = () => {
    updateStatus('verified');
    toast.success('Achievement approved successfully!');
    navigate('/staffdashboard/achievements');
  };

  const handleDeclineConfirm = (remarks) => {
    updateStatus('rejected', remarks);
    setShowDeclineModal(false);
    toast.success('Achievement declined');
    navigate('/staffdashboard/achievements');
  };

  if (!achievement) {
    return (
      <div className="achievements-container">
        <div className="achievements-header">
          <h1>Achievement Details</h1>
          <Link to="/staffdashboard/achievements" className="btn-add">
            Back to Achievement Requests
          </Link>
        </div>
        <div className="form-container">
          <h2>Not Found</h2>
          <p>This achievement request does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <h1>Achievement Details</h1>
        <Link to="/staffdashboard/achievements" className="btn-add">
          Back to Achievement Requests
        </Link>
      </div>

      <div className="form-container">
        <h2>Request Details</h2>
        <div className="achievement-form">
          <div className="form-group">
            <label>Student Name</label>
            <input className="form-input" value={achievement.studentName || 'Student'} readOnly />
          </div>
          <div className="form-group">
            <label>Roll No</label>
            <input className="form-input" value={achievement.rollNo || 'N/A'} readOnly />
          </div>
          <div className="form-group">
            <label>Achievement Title</label>
            <input className="form-input" value={achievement.title || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Organizing Body</label>
            <input className="form-input" value={achievement.organizingBody || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input className="form-input" value={achievement.date || ''} readOnly />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input className="form-input" value={achievement.endDate || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Status</label>
            <input className="form-input" value={achievement.verificationStatus || 'pending'} readOnly />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-input" rows="4" value={achievement.description || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Uploaded PDF</label>
            <div>
              {achievement.achievementPdfData ? (
                <a
                  href={achievement.achievementPdfData}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-view"
                >
                  {achievement.achievementPdfName || 'View Uploaded PDF'}
                </a>
              ) : (
                <input className="form-input" value="N/A" readOnly />
              )}
            </div>
          </div>
          {achievement.remarks && (
            <div className="form-group">
              <label>Decline Remarks</label>
              <textarea className="form-input" rows="3" value={achievement.remarks} readOnly />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button className="decision-btn decline" onClick={() => setShowDeclineModal(true)}>
            Decline
          </button>
          <button className="decision-btn approve" onClick={handleApprove}>
            Approve
          </button>
        </div>
      </div>

      {showDeclineModal && (
        <DeclineModal
          onClose={() => setShowDeclineModal(false)}
          onConfirm={handleDeclineConfirm}
        />
      )}
    </div>
  );
};

export default StaffAchievementDetails;
