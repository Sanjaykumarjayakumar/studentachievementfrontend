import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getItemById } from '../services/api';
import { useToast } from './ToastProvider';
import './Internships.css';

const InternshipDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [internship, setInternship] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const found = await getItemById('internships', id);
        setInternship(found || null);
      } catch (_err) {
        setInternship(null);
      }
    };
    load();
  }, [id]);

  const status = internship?.endDate ? 'Completed' : 'Ongoing';

  const getPdfUrl = () => {
    const rawValue = internship?.internshipPdf || internship?.pdfData || '';
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
    <div className="internships-container">
      <div className="internships-header">
        <h1>Internship Details</h1>
        <Link to="/internships" className="btn-add">Back to Internships</Link>
      </div>

      <div className="form-container">
        <h2>Details</h2>
        <div className="internship-form">
          <div className="form-group">
            <label>Internship Title</label>
            <input className="form-input" value={internship?.title || ''} readOnly />
          </div>

          <div className="form-group">
            <label>Company</label>
            <input className="form-input" value={internship?.company || ''} readOnly />
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input className="form-input" value={internship?.startDate || ''} readOnly />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input className="form-input" value={internship?.endDate || ''} readOnly />
          </div>

          <div className="form-group">
            <label>Status</label>
            <input className="form-input" value={internship ? status : ''} readOnly />
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
        </div>
      </div>
    </div>
  );
};

export default InternshipDetails;
