import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getItemById } from '../services/api';
import { useToast } from './ToastProvider';
import './Achievements.css';

const AchievementDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [achievement, setAchievement] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const found = await getItemById('achievements', id);
        setAchievement(found || null);
      } catch (_err) {
        setAchievement(null);
      }
    };
    load();
  }, [id]);

  const getPdfUrl = () => {
    const rawValue =
      achievement?.achievementPdfData ||
      achievement?.achievementPdf ||
      achievement?.pdfData ||
      '';

    if (!rawValue || typeof rawValue !== 'string') {
      return '';
    }

    const trimmed = rawValue.trim();
    if (!trimmed) {
      return '';
    }

    if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('blob:')) {
      return trimmed;
    }

    if (trimmed.includes('base64,')) {
      return `data:application/pdf;${trimmed}`;
    }

    return `data:application/pdf;base64,${trimmed}`;
  };

  const openInNewTab = (rawValue) => {
    if (!rawValue) {
      toast.error('Uploaded PDF is not available');
      return;
    }

    let targetUrl = rawValue;
    if (rawValue.startsWith('data:')) {
      const [meta, base64Part] = rawValue.split(',');
      const mimeMatch = meta.match(/^data:(.*?);base64$/);
      const mimeType = mimeMatch?.[1] || 'application/pdf';
      const binaryString = window.atob(base64Part || '');
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i += 1) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mimeType });
      targetUrl = URL.createObjectURL(blob);
    }

    const link = document.createElement('a');
    link.href = targetUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();

    if (targetUrl.startsWith('blob:')) {
      setTimeout(() => URL.revokeObjectURL(targetUrl), 60_000);
    }
  };

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <h1>Achievement Details</h1>
        <Link to="/achievements" className="btn-add">Back to Achievements</Link>
      </div>

      <div className="form-container">
        <h2>Details</h2>
        <div className="achievement-form">
          <div className="form-group">
            <label>Achievement Title</label>
            <input className="form-input" value={achievement?.title || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Organizing Body</label>
            <input className="form-input" value={achievement?.organizingBody || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input className="form-input" value={achievement?.date || ''} readOnly />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input className="form-input" value={achievement?.endDate || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Status</label>
            <input className="form-input" value={achievement?.verificationStatus || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-input" rows="4" value={achievement?.description || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Uploaded PDF</label>
            <div>
              {getPdfUrl() ? (
                <button type="button" onClick={() => openInNewTab(getPdfUrl())} className="btn-view">
                  View File
                </button>
              ) : (
                <input className="form-input" value="N/A" readOnly />
              )}
            </div>
          </div>
          {achievement?.remarks && (
            <div className="form-group">
              <label>Remarks</label>
              <textarea className="form-input" rows="3" value={achievement.remarks} readOnly />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementDetails;
