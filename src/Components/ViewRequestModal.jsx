import { X, Check, XCircle, User, Calendar, Building2, FileText, Link as LinkIcon, Tag, Briefcase } from 'lucide-react';
import './ViewRequestModal.css';

const ViewRequestModal = ({ request, onClose, onApprove, onDecline }) => {
  if (!request) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const renderAchievementDetails = () => (
    <>
      <div className="detail-row">
        <div className="detail-label">
          <FileText size={18} />
          <span>Title</span>
        </div>
        <div className="detail-value">{request.title || 'N/A'}</div>
      </div>

      <div className="detail-row">
        <div className="detail-label">
          <Building2 size={18} />
          <span>Organizing Body</span>
        </div>
        <div className="detail-value">{request.organizingBody || 'N/A'}</div>
      </div>

      <div className="detail-row">
        <div className="detail-label">
          <Tag size={18} />
          <span>Category</span>
        </div>
        <div className="detail-value">
          <span className="category-badge">{request.category || 'General'}</span>
        </div>
      </div>

      <div className="detail-row">
        <div className="detail-label">
          <Calendar size={18} />
          <span>Date</span>
        </div>
        <div className="detail-value">{formatDate(request.date)}</div>
      </div>

      {request.endDate && (
        <div className="detail-row">
          <div className="detail-label">
            <Calendar size={18} />
            <span>End Date</span>
          </div>
          <div className="detail-value">{formatDate(request.endDate)}</div>
        </div>
      )}

      {request.description && (
        <div className="detail-row full-width">
          <div className="detail-label">
            <FileText size={18} />
            <span>Description</span>
          </div>
          <div className="detail-value description">{request.description}</div>
        </div>
      )}

      {request.achievementPdfData && (
        <div className="detail-row">
          <div className="detail-label">
            <FileText size={18} />
            <span>Submitted PDF</span>
          </div>
          <div className="detail-value">
            <a href={request.achievementPdfData} target="_blank" rel="noopener noreferrer" className="link">
              {request.achievementPdfName || 'View PDF'}
            </a>
          </div>
        </div>
      )}
    </>
  );

  const renderCertificateDetails = () => (
    <>
      <div className="detail-row">
        <div className="detail-label">
          <FileText size={18} />
          <span>Certificate Name</span>
        </div>
        <div className="detail-value">{request.name || 'N/A'}</div>
      </div>

      <div className="detail-row">
        <div className="detail-label">
          <Building2 size={18} />
          <span>Issuing Organization</span>
        </div>
        <div className="detail-value">{request.issuingOrg || 'N/A'}</div>
      </div>

      <div className="detail-row">
        <div className="detail-label">
          <Calendar size={18} />
          <span>Issue Date</span>
        </div>
        <div className="detail-value">{formatDate(request.issueDate)}</div>
      </div>

      {request.expiryDate && (
        <div className="detail-row">
          <div className="detail-label">
            <Calendar size={18} />
            <span>Expiry Date</span>
          </div>
          <div className="detail-value">{formatDate(request.expiryDate)}</div>
        </div>
      )}

      {request.credentialId && (
        <div className="detail-row">
          <div className="detail-label">
            <Tag size={18} />
            <span>Credential ID</span>
          </div>
          <div className="detail-value">{request.credentialId}</div>
        </div>
      )}

      {request.credentialUrl && (
        <div className="detail-row">
          <div className="detail-label">
            <LinkIcon size={18} />
            <span>Credential URL</span>
          </div>
          <div className="detail-value">
            <a href={request.credentialUrl} target="_blank" rel="noopener noreferrer" className="link">
              View Certificate
            </a>
          </div>
        </div>
      )}

      {request.imageUrl && (
        <div className="detail-row full-width">
          <div className="detail-label">
            <FileText size={18} />
            <span>Certificate Image</span>
          </div>
          <div className="detail-value">
            <img src={request.imageUrl} alt="Certificate" className="certificate-image" />
          </div>
        </div>
      )}
    </>
  );

  const renderProjectDetails = () => (
    <>
      <div className="detail-row">
        <div className="detail-label">
          <FileText size={18} />
          <span>Project Title</span>
        </div>
        <div className="detail-value">{request.title || 'N/A'}</div>
      </div>

      <div className="detail-row">
        <div className="detail-label">
          <Tag size={18} />
          <span>Status</span>
        </div>
        <div className="detail-value">
          <span className={`status-badge ${request.status?.toLowerCase()}`}>
            {request.status || 'Ongoing'}
          </span>
        </div>
      </div>

      <div className="detail-row">
        <div className="detail-label">
          <Calendar size={18} />
          <span>Start Date</span>
        </div>
        <div className="detail-value">{formatDate(request.startDate)}</div>
      </div>

      {request.endDate && (
        <div className="detail-row">
          <div className="detail-label">
            <Calendar size={18} />
            <span>End Date</span>
          </div>
          <div className="detail-value">{formatDate(request.endDate)}</div>
        </div>
      )}

      {request.technologies && request.technologies.length > 0 && (
        <div className="detail-row full-width">
          <div className="detail-label">
            <Tag size={18} />
            <span>Technologies</span>
          </div>
          <div className="detail-value">
            <div className="tech-tags">
              {request.technologies.map((tech, index) => (
                <span key={index} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {request.projectUrl && (
        <div className="detail-row">
          <div className="detail-label">
            <LinkIcon size={18} />
            <span>Project URL</span>
          </div>
          <div className="detail-value">
            <a href={request.projectUrl} target="_blank" rel="noopener noreferrer" className="link">
              View Project
            </a>
          </div>
        </div>
      )}

      {request.githubUrl && (
        <div className="detail-row">
          <div className="detail-label">
            <LinkIcon size={18} />
            <span>GitHub URL</span>
          </div>
          <div className="detail-value">
            <a href={request.githubUrl} target="_blank" rel="noopener noreferrer" className="link">
              View on GitHub
            </a>
          </div>
        </div>
      )}

      {request.description && (
        <div className="detail-row full-width">
          <div className="detail-label">
            <FileText size={18} />
            <span>Description</span>
          </div>
          <div className="detail-value description">{request.description}</div>
        </div>
      )}

      {request.imageUrl && (
        <div className="detail-row full-width">
          <div className="detail-label">
            <FileText size={18} />
            <span>Project Image</span>
          </div>
          <div className="detail-value">
            <img src={request.imageUrl} alt="Project" className="project-image" />
          </div>
        </div>
      )}
    </>
  );

  const renderInternshipDetails = () => (
    <>
      <div className="detail-row">
        <div className="detail-label">
          <Briefcase size={18} />
          <span>Internship Title</span>
        </div>
        <div className="detail-value">{request.title || 'N/A'}</div>
      </div>

      <div className="detail-row">
        <div className="detail-label">
          <Building2 size={18} />
          <span>Company</span>
        </div>
        <div className="detail-value">{request.company || 'N/A'}</div>
      </div>

      <div className="detail-row">
        <div className="detail-label">
          <Calendar size={18} />
          <span>Start Date</span>
        </div>
        <div className="detail-value">{formatDate(request.startDate)}</div>
      </div>

      {request.endDate && (
        <div className="detail-row">
          <div className="detail-label">
            <Calendar size={18} />
            <span>End Date</span>
          </div>
          <div className="detail-value">{formatDate(request.endDate)}</div>
        </div>
      )}

      {request.internshipPdfName && (
        <div className="detail-row">
          <div className="detail-label">
            <FileText size={18} />
            <span>Submitted PDF</span>
          </div>
          <div className="detail-value">{request.internshipPdfName}</div>
        </div>
      )}
    </>
  );

  const getTypeTitle = () => {
    switch(request.type) {
      case 'achievement':
        return 'Achievement Details';
      case 'certificate':
        return 'Certificate Details';
      case 'project':
        return 'Project Details';
      case 'internship':
        return 'Internship Details';
      default:
        return 'Request Details';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content view-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2>{getTypeTitle()}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Student Info Section */}
          <div className="student-info-section">
            <h3>Student Information</h3>
            <div className="detail-row">
              <div className="detail-label">
                <User size={18} />
                <span>Name</span>
              </div>
              <div className="detail-value">{request.studentName || 'Student'}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">
                <Tag size={18} />
                <span>Roll Number</span>
              </div>
              <div className="detail-value">{request.rollNo || 'N/A'}</div>
            </div>
          </div>

          {/* Divider */}
          <div className="divider"></div>

          {/* Request Details Section */}
          <div className="request-details-section">
            <h3>
              {request.type === 'achievement'
                ? 'Achievement'
                : request.type === 'certificate'
                ? 'Certificate'
                : request.type === 'internship'
                ? 'Internship'
                : 'Project'} Information
            </h3>
            {request.type === 'achievement' && renderAchievementDetails()}
            {request.type === 'certificate' && renderCertificateDetails()}
            {request.type === 'internship' && renderInternshipDetails()}
            {request.type === 'project' && renderProjectDetails()}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn-modal-decline" onClick={onDecline}>
            <XCircle size={18} />
            Decline
          </button>
          <button className="btn-modal-approve" onClick={onApprove}>
            <Check size={18} />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewRequestModal;
