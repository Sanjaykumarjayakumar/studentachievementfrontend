import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from './ToastProvider';
import { createItem, deleteItem, getItems } from '../services/api';
import './Internships.css';

const Internships = () => {
  const { toast } = useToast();
  const [internships, setInternships] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    internshipPdf: '',
    internshipPdfName: ''
  });
  const hasInvalidInternshipDates =
    Boolean(formData.startDate && formData.endDate) &&
    new Date(formData.endDate) <= new Date(formData.startDate);
  const isInternshipFormComplete =
    formData.title.trim() &&
    formData.company.trim() &&
    formData.startDate &&
    formData.endDate &&
    formData.internshipPdf &&
    !hasInvalidInternshipDates;

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await getItems('internships', user.id);
      const items = Array.isArray(response) ? response : response?.items || [];
      setInternships(items);
      if (items.length > 0) {
        setShowForm(false);
      }
    } catch (err) {
      toast.error(err.message || 'Unable to load internships');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Please upload only PDF file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        internshipPdf: reader.result,
        internshipPdfName: file.name
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.company || !formData.startDate || !formData.endDate || !formData.internshipPdf) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error('End date must be after the start date');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const newInternship = {
      ...formData,
      studentId: user.id,
      studentName: user.name || user.username || 'Student',
      rollNo: user.rollNo || 'N/A'
    };

    try {
      await createItem('internships', newInternship);
      await loadInternships();
      setFormData({
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        internshipPdf: '',
        internshipPdfName: ''
      });
      setShowForm(false);
      toast.success('Internship submitted successfully');
    } catch (err) {
      toast.error(err.message || 'Unable to submit internship');
    }
  };

  const handleDelete = async (internshipId) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      toast.error('User session not found. Please login again.');
      return;
    }

    const confirmed = window.confirm('Delete this internship request?');
    if (!confirmed) return;

    try {
      await deleteItem('internships', internshipId, user.id);
      await loadInternships();
      toast.success('Internship request deleted');
    } catch (err) {
      toast.error(err.message || 'Unable to delete internship');
    }
  };

  return (
    <div className="internships-container">
      <div className="internships-header">
        <h1>Internships</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-add">
            <Plus size={20} />
            Add Internship
          </button>
        )}
      </div>

      {showForm ? (
        <div className="form-container">
          <h2>Add Internship</h2>
          <form onSubmit={handleSubmit} className="internship-form">
            <div className="form-group">
              <label htmlFor="title">Internship Title *</label>
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
              <label htmlFor="company">Company *</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

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
                min={formData.startDate || undefined}
              />
            </div>

            <div className="form-group">
              <label htmlFor="internshipPdf">Upload PDF *</label>
              <input
                type="file"
                id="internshipPdf"
                accept="application/pdf,.pdf"
                onChange={handlePdfChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={!isInternshipFormComplete}>
                Add Internship
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="table-container">
          {internships.length > 0 ? (
            <table className="internships-table">
              <thead>
                <tr>
                  <th>Internship Title</th>
                  <th>Company</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {internships.map((internship) => (
                  <tr key={internship.id}>
                    <td>{internship.title}</td>
                    <td>{internship.company}</td>
                    <td>{internship.startDate ? new Date(internship.startDate).toLocaleDateString() : '-'}</td>
                    <td>{internship.endDate ? new Date(internship.endDate).toLocaleDateString() : '-'}</td>
                    <td>{internship.endDate ? 'Completed' : 'Ongoing'}</td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/internships/${internship.id}`} className="btn-view">
                          View Details
                        </Link>
                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => handleDelete(internship.id)}
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
            <div className="no-internships">
              <p>No internships available</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Internships;
