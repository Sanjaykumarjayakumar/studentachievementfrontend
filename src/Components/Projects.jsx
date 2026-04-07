import { useState, useEffect } from 'react';
import { Plus, FileImage, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from './ToastProvider';
import { createItem, deleteItem, getItems } from '../services/api';
import './Projects.css';

const Projects = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    projectUrl: '',
    githubUrl: '',
    image: ''
  });
  const isProjectFormComplete =
    formData.title.trim() &&
    formData.description.trim() &&
    formData.startDate &&
    formData.endDate &&
    formData.projectUrl.trim() &&
    formData.githubUrl.trim();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await getItems('projects', user.id);
      const items = Array.isArray(response) ? response : response?.items || [];
      setProjects(items);
      if (items.length > 0) {
        setShowForm(false);
      }
    } catch (err) {
      toast.error(err.message || 'Unable to load projects');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (
      !formData.title ||
      !formData.description ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.projectUrl.trim() ||
      !formData.githubUrl.trim()
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const newProject = {
      ...formData,
      studentId: user.id,
      studentName: user.name || user.username || 'Student',
      rollNo: user.rollNo || 'N/A'
    };

    try {
      await createItem('projects', newProject);
      await loadProjects();
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        projectUrl: '',
        githubUrl: '',
        image: ''
      });
      setShowForm(false);
      toast.success('Project submitted successfully');
    } catch (err) {
      toast.error(err.message || 'Unable to submit project');
    }
  };

  const getProjectFileUrl = (project) => {
    const rawValue = project?.image || project?.imageUrl || project?.projectFile || project?.fileData || '';
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

    if (trimmed.startsWith('JVBERi0')) {
      return `data:application/pdf;base64,${trimmed}`;
    }
    if (trimmed.startsWith('/9j/')) {
      return `data:image/jpeg;base64,${trimmed}`;
    }
    if (trimmed.startsWith('iVBORw0KGgo')) {
      return `data:image/png;base64,${trimmed}`;
    }
    if (trimmed.startsWith('R0lGOD')) {
      return `data:image/gif;base64,${trimmed}`;
    }
    if (trimmed.startsWith('UklGR')) {
      return `data:image/webp;base64,${trimmed}`;
    }

    return `data:application/octet-stream;base64,${trimmed}`;
  };

  const handleDelete = async (projectId) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      toast.error('User session not found. Please login again.');
      return;
    }

    const confirmed = window.confirm('Delete this project request?');
    if (!confirmed) return;

    try {
      await deleteItem('projects', projectId, user.id);
      await loadProjects();
      toast.success('Project request deleted');
    } catch (err) {
      toast.error(err.message || 'Unable to delete project');
    }
  };

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Projects</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-add">
            <Plus size={20} />
            Add Project
          </button>
        )}
      </div>

      {showForm ? (
        <div className="form-container">
          <h2>Add Project</h2>
          <form onSubmit={handleSubmit} className="project-form">
            <div className="form-group">
              <label htmlFor="title">Project Title *</label>
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date *</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date *</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="projectUrl">Project URL *</label>
              <input
                type="url"
                id="projectUrl"
                name="projectUrl"
                value={formData.projectUrl}
                onChange={handleChange}
                className="form-input"
                placeholder="https://project-demo.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="githubUrl">GitHub URL *</label>
              <input
                type="url"
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                className="form-input"
                placeholder="https://github.com/username/repo"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Project Image (Optional)</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="form-input"
              />
              {formData.image && (
                <img src={formData.image} alt="Preview" className="image-preview" />
              )}
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={!isProjectFormComplete}>
                Add Project
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="project-card-wrap">
          {projects.length > 0 ? (
            <div className="project-cards-grid">
              {projects.map((project) => {
                const projectFileUrl = getProjectFileUrl(project);
                const isImage = projectFileUrl.startsWith('data:image') || /\.(png|jpe?g|gif|webp|svg)$/i.test(projectFileUrl);
                const isPdf = projectFileUrl.startsWith('data:application/pdf') || /\.pdf$/i.test(projectFileUrl);

                return (
                  <div key={project.id} className="project-card">
                    <div className="project-card-image">
                      {projectFileUrl && isImage ? (
                        <img src={projectFileUrl} alt={project.title || 'Project upload'} className="project-upload-preview" />
                      ) : (
                        <>
                          {isPdf ? <FileText size={24} /> : <FileImage size={24} />}
                          <span>{projectFileUrl ? 'File Uploaded' : 'No File'}</span>
                        </>
                      )}
                    </div>
                    <div className="project-card-details">
                      <p><strong>Title:</strong> {project.title || ''}</p>
                      <p><strong>Start Date:</strong> {project.startDate ? new Date(project.startDate).toLocaleDateString('en-GB') : ''}</p>
                      <p><strong>End Date:</strong> {project.endDate ? new Date(project.endDate).toLocaleDateString('en-GB') : '-'}</p>
                      <p><strong>Status:</strong> {project.endDate ? 'Completed' : 'Ongoing'}</p>
                    </div>
                    <div className="project-card-actions">
                      <Link to={`/projects/${project.id}`} className="btn-project-link">
                        View Details
                      </Link>
                      <a
                        href={project.projectUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className={`btn-project-link ${!project.projectUrl ? 'disabled' : ''}`}
                        onClick={(e) => {
                          if (!project.projectUrl) {
                            e.preventDefault();
                            toast.error('Project URL is not available');
                          }
                        }}
                      >
                        View Project
                      </a>
                      <button
                        type="button"
                        className="btn-project-delete"
                        onClick={() => handleDelete(project.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-projects">
              <p>No projects available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;
