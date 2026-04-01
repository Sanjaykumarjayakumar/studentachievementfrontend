import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useToast } from './ToastProvider';
import { getUsers, mapStudentToStaff } from '../services/api';
import './MapStaff.css';

const MapStaff = ({ user, onUserUpdate }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [staffUsers, setStaffUsers] = useState([]);
  const [busyId, setBusyId] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await getUsers({ role: 'staff', search, page: 1, limit: 50 });
        setStaffUsers(response?.items || []);
      } catch (err) {
        toast.error(err.message || 'Unable to load staff users');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search, toast]);

  const studentId = useMemo(() => user?.id || '', [user]);

  const handleMap = async (staffMongoId) => {
    if (!studentId) {
      toast.error('User session not found. Please login again.');
      return;
    }
    try {
      setBusyId(staffMongoId);
      const response = await mapStudentToStaff(studentId, staffMongoId);
      const nextUser = response?.user || null;
      if (nextUser) {
        localStorage.setItem('user', JSON.stringify({ ...(user || {}), ...nextUser }));
        onUserUpdate?.(nextUser);
      }
      toast.success('Staff mapped');
      navigate('/profile');
    } catch (err) {
      toast.error(err.message || 'Unable to map staff');
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="map-staff-page">
      <div className="map-staff-head">
        <div>
          <h2>Map Staff</h2>
          <p>Select one staff member to map. You can remap anytime.</p>
        </div>
        <button type="button" className="map-staff-back" onClick={() => navigate('/profile')}>
          Back to Profile
        </button>
      </div>

      <div className="map-staff-search">
        <Search size={16} />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search staff by name, email, or staff ID..."
        />
      </div>

      <div className="map-staff-card">
        {loading ? (
          <div className="map-staff-empty">Loading staff...</div>
        ) : staffUsers.length === 0 ? (
          <div className="map-staff-empty">No staff found</div>
        ) : (
          <div className="map-staff-table-wrap">
            <table className="map-staff-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {staffUsers.map((staff) => (
                  <tr key={staff.id}>
                    <td>{staff.name || '-'}</td>
                    <td>{staff.department || '-'}</td>
                    <td>{staff.email || '-'}</td>
                    <td className="map-staff-action">
                      <button
                        type="button"
                        className="map-staff-btn"
                        onClick={() => handleMap(staff.id)}
                        disabled={busyId === staff.id}
                      >
                        {busyId === staff.id ? 'Mapping...' : 'Map'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapStaff;

