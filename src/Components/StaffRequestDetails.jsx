import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DeclineModal from './DeclineModal';
import { useToast } from './ToastProvider';
import { getItemById, updateItemStatus } from '../services/api';
import './StaffDashboard.css';
import './StaffRequestDetails.css';

const configByType = {
  achievements: {
    singular: 'achievement',
    resource: 'achievements',
    title: 'Achievement Details',
    backLabel: 'Back to Achievement Requests'
  },
  internships: {
    singular: 'internship',
    resource: 'internships',
    title: 'Internship Details',
    backLabel: 'Back to Internship Requests'
  },
  certificates: {
    singular: 'certificate',
    resource: 'certificates',
    title: 'Certificate Details',
    backLabel: 'Back to Certificate Requests'
  },
  projects: {
    singular: 'project',
    resource: 'projects',
    title: 'Project Details',
    backLabel: 'Back to Project Requests'
  }
};

const StaffRequestDetails = ({ requestType }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requestItem, setRequestItem] = useState(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  const currentConfig = useMemo(() => configByType[requestType], [requestType]);

  useEffect(() => {
    if (!currentConfig) {
      navigate('/staffdashboard/summary', { replace: true });
      return;
    }

    const load = async () => {
      try {
        const found = await getItemById(currentConfig.resource, id);
        setRequestItem(found || null);
      } catch (_err) {
        setRequestItem(null);
      }
    };
    load();
  }, [id, currentConfig, navigate]);

  const updateStatus = async (status, remarks = '') => {
    const updated = await updateItemStatus(currentConfig.resource, id, { status, remarks });
    setRequestItem(updated);
  };

  const handleApprove = async () => {
    try {
      await updateStatus('verified');
      toast.success(`${currentConfig.singular.charAt(0).toUpperCase() + currentConfig.singular.slice(1)} approved successfully!`);
      navigate(`/staffdashboard/${requestType}`);
    } catch (err) {
      toast.error(err.message || 'Unable to approve request');
    }
  };

  const handleDeclineConfirm = async (remarks) => {
    try {
      await updateStatus('rejected', remarks);
      setShowDeclineModal(false);
      toast.success(`${currentConfig.singular.charAt(0).toUpperCase() + currentConfig.singular.slice(1)} declined`);
      navigate(`/staffdashboard/${requestType}`);
    } catch (err) {
      toast.error(err.message || 'Unable to decline request');
    }
  };

  const renderReadonly = (label, value) => (
    <div className="form-group">
      <label>{label}</label>
      <input className="form-input" value={value || 'N/A'} readOnly />
    </div>
  );

  const renderReadonlyText = (label, value) => (
    <div className="form-group">
      <label>{label}</label>
      <textarea className="form-input" rows="4" value={value || 'N/A'} readOnly />
    </div>
  );

  const normalizeFileUrl = (rawValue) => {
    const value = String(rawValue || '').trim();
    if (!value) return '';
    if (value.startsWith('data:') || value.startsWith('http://') || value.startsWith('https://') || value.startsWith('blob:')) {
      return value;
    }
    if (value.startsWith('JVBERi0')) {
      return `data:application/pdf;base64,${value}`;
    }
    return '';
  };

  const openFile = (rawValue) => {
    const fileUrl = normalizeFileUrl(rawValue);
    if (!fileUrl) {
      toast.error('No file uploaded');
      return;
    }
    let targetUrl = fileUrl;
    if (fileUrl.startsWith('data:')) {
      const [meta, base64Part] = fileUrl.split(',');
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

  if (!currentConfig) {
    return null;
  }

  if (!requestItem) {
    return (
      <div className="achievements-container">
        <div className="achievements-header">
          <h1>{currentConfig.title}</h1>
          <Link to={`/staffdashboard/${requestType}`} className="btn-add">
            {currentConfig.backLabel}
          </Link>
        </div>
        <div className="form-container">
          <h2>Not Found</h2>
          <p>This request does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <h1>{currentConfig.title}</h1>
        <Link to={`/staffdashboard/${requestType}`} className="btn-add">
          {currentConfig.backLabel}
        </Link>
      </div>

      <div className="form-container">
        <h2>Request Details</h2>
        <div className="achievement-form">
          {renderReadonly('Student Name', requestItem.studentName || 'Student')}
          {renderReadonly('Roll No', requestItem.rollNo)}

          {requestType === 'achievements' && (
            <>
              {renderReadonly('Achievement Title', requestItem.title)}
              {renderReadonly('Organizing Body', requestItem.organizingBody)}
              {renderReadonly('Start Date', requestItem.date)}
              {renderReadonly('End Date', requestItem.endDate)}
              {renderReadonlyText('Description', requestItem.description)}
              <div className="form-group">
                <label>Uploaded PDF</label>
                <div>
                  {normalizeFileUrl(requestItem.achievementPdfData) ? (
                    <button type="button" className="file-open-btn" onClick={() => openFile(requestItem.achievementPdfData)}>
                      View File
                    </button>
                  ) : (
                    <span className="no-file-text">No file uploaded</span>
                  )}
                </div>
              </div>
            </>
          )}

          {requestType === 'internships' && (
            <>
              {renderReadonly('Internship Title', requestItem.title)}
              {renderReadonly('Company', requestItem.company)}
              {renderReadonly('Start Date', requestItem.startDate)}
              {renderReadonly('End Date', requestItem.endDate)}
              <div className="form-group">
                <label>Uploaded PDF</label>
                <div>
                  {normalizeFileUrl(requestItem.internshipPdf) ? (
                    <button type="button" className="file-open-btn" onClick={() => openFile(requestItem.internshipPdf)}>
                      View File
                    </button>
                  ) : (
                    <span className="no-file-text">No file uploaded</span>
                  )}
                </div>
              </div>
            </>
          )}

          {requestType === 'certificates' && (
            <>
              {renderReadonly('Certificate Name', requestItem.name)}
              {renderReadonly('Issuing Organization', requestItem.issuingOrg)}
              {renderReadonly('Issue Date', requestItem.issueDate)}
              {renderReadonly('Expiry Date', requestItem.expiryDate)}
              {renderReadonly('Credential URL', requestItem.credentialField)}
              <div className="form-group">
                <label>Uploaded PDF</label>
                <div>
                  {normalizeFileUrl(requestItem.certificatePdf) ? (
                    <button type="button" className="file-open-btn" onClick={() => openFile(requestItem.certificatePdf)}>
                      View File
                    </button>
                  ) : (
                    <span className="no-file-text">No file uploaded</span>
                  )}
                </div>
              </div>
            </>
          )}

          {requestType === 'projects' && (
            <>
              {renderReadonly('Project Title', requestItem.title)}
              {renderReadonly('Start Date', requestItem.startDate)}
              {renderReadonly('End Date', requestItem.endDate)}
              {renderReadonly('Project URL', requestItem.projectUrl)}
              {renderReadonly('GitHub URL', requestItem.githubUrl)}
              {renderReadonlyText('Description', requestItem.description)}
              {requestItem.image && (
                <div className="form-group">
                  <label>Project Image</label>
                  <img
                    src={requestItem.image}
                    alt="Project"
                    style={{ width: '100%', maxWidth: '320px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                </div>
              )}
            </>
          )}

          {renderReadonly('Status', requestItem.verificationStatus || 'pending')}
          {requestItem.remarks && renderReadonlyText('Decline Remarks', requestItem.remarks)}
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

export default StaffRequestDetails;
