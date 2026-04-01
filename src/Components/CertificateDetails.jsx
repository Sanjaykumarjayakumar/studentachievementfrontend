import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getItemById } from '../services/api';
import { useToast } from './ToastProvider';
import './Certificates.css';

const CertificateDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const found = await getItemById('certificates', id);
        setCertificate(found || null);
      } catch (_err) {
        setCertificate(null);
      }
    };
    load();
  }, [id]);

  const getPdfUrl = () => {
    const rawValue = certificate?.certificatePdf || certificate?.pdfData || '';
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
    <div className="certificates-container">
      <div className="certificates-header">
        <h1>Certificate Details</h1>
        <Link to="/certificates" className="btn-add">Back to Certificates</Link>
      </div>

      <div className="form-container">
        <h2>Details</h2>
        <div className="certificate-form">
          <div className="form-group">
            <label>Certificate Name</label>
            <input className="form-input" value={certificate?.name || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Issuing Organization</label>
            <input className="form-input" value={certificate?.issuingOrg || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Issue Date</label>
            <input className="form-input" value={certificate?.issueDate || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Expire Date</label>
            <input className="form-input" value={certificate?.expiryDate || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Credenitional / Certificate URL</label>
            <input className="form-input" value={certificate?.credentialField || certificate?.credentialId || ''} readOnly />
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

export default CertificateDetails;
