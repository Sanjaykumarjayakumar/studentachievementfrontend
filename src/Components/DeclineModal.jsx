import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle } from 'lucide-react';
import './DeclineModal.css';

const DeclineModal = ({ onClose, onConfirm }) => {
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!remarks.trim()) {
      setError('Please provide a reason for declining this request');
      return;
    }

    if (remarks.trim().length < 10) {
      setError('Please provide a more detailed reason (at least 10 characters)');
      return;
    }

    onConfirm(remarks);
  };

  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
    if (error) setError('');
  };

  return createPortal(
    <div className="decline-modal-overlay" onClick={onClose}>
      <div className="decline-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="decline-modal-header">
          <div className="decline-modal-head">
            <div className="decline-modal-icon">
              <AlertCircle size={24} />
            </div>
            <h2>Reason for Decline</h2>
          </div>
        </div>

        <div className="decline-modal-body">
          <p className="decline-modal-message">
            Please provide a reason for decline. This will help the student understand why their submission was not approved.
          </p>

          <div className="decline-modal-form-group">
            <label htmlFor="remarks">Reason for decline *</label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={handleRemarksChange}
              placeholder="Enter the reason for decline..."
              className={`decline-modal-textarea ${error ? 'error' : ''}`}
              rows="5"
            />
            {error && (
              <div className="decline-modal-error" role="alert">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            <div className="decline-modal-count">{remarks.length} characters</div>
          </div>
        </div>

        <div className="decline-modal-footer">
          <button className="decline-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="decline-modal-confirm" onClick={handleSubmit}>
            Decline
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeclineModal;
