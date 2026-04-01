import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getItemById } from '../services/api';
import { useToast } from './ToastProvider';
import './Projects.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const found = await getItemById('projects', id);
        setProject(found || null);
      } catch (_err) {
        setProject(null);
      }
    };
    load();
  }, [id]);

  const getFileUrl = () => {
    const rawValue =
      project?.image ||
      project?.imageUrl ||
      project?.projectFile ||
      project?.fileData ||
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
      return `data:application/octet-stream;${trimmed}`;
    }

    return `data:application/octet-stream;base64,${trimmed}`;
  };

  const openInNewTab = (rawValue) => {
    if (!rawValue) {
      toast.error('Uploaded file is not available');
      return;
    }

    let targetUrl = rawValue;
    if (rawValue.startsWith('data:')) {
      const [meta, base64Part] = rawValue.split(',');
      const mimeMatch = meta.match(/^data:(.*?);base64$/);
      const mimeType = mimeMatch?.[1] || 'application/octet-stream';
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
    <div className="projects-container">
      <div className="projects-header">
        <h1>Project Details</h1>
        <Link to="/projects" className="btn-add">Back to Projects</Link>
      </div>

      <div className="form-container">
        <h2>Details</h2>
        <div className="project-form">
          <div className="form-group">
            <label>Project Title</label>
            <input className="form-input" value={project?.title || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-input" rows="4" value={project?.description || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Technologies</label>
            <input className="form-input" value={Array.isArray(project?.technologies) ? project.technologies.join(', ') : ''} readOnly />
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input className="form-input" value={project?.startDate || ''} readOnly />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input className="form-input" value={project?.endDate || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Project URL</label>
            <input className="form-input" value={project?.projectUrl || ''} readOnly />
          </div>
          <div className="form-group">
            <label>GitHub URL</label>
            <input className="form-input" value={project?.githubUrl || ''} readOnly />
          </div>
          <div className="form-group">
            <label>Uploaded File</label>
            <div>
              {getFileUrl() ? (
                <button type="button" onClick={() => openInNewTab(getFileUrl())} className="btn-view">
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

export default ProjectDetails;
