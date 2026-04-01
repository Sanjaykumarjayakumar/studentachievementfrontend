import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StaffDashboard from './StaffDashboard';
import StaffRequestDetails from './StaffRequestDetails';
import ProfilePage from './ProfilePage';

const validRequestTypes = ['summary', 'mappedstudents', 'achievements', 'internships', 'certificates', 'projects', 'profile'];

const StaffPanel = ({ user, onUserUpdate }) => {
  const { requestType, id } = useParams();
  const navigate = useNavigate();

  const activeRequestType = useMemo(() => {
    if (validRequestTypes.includes(requestType)) {
      return requestType;
    }
    return 'summary';
  }, [requestType]);

  useEffect(() => {
    if (!requestType) {
      navigate('/staffdashboard/summary', { replace: true });
      return;
    }

    if (id && (requestType === 'summary' || requestType === 'profile' || requestType === 'mappedstudents')) {
      navigate('/staffdashboard/summary', { replace: true });
      return;
    }

    if (!validRequestTypes.includes(requestType)) {
      navigate('/staffdashboard/summary', { replace: true });
    }
  }, [requestType, id, navigate]);

  return (
    <>
      {activeRequestType === 'profile' ? (
        <ProfilePage user={user} onUserUpdate={onUserUpdate} role="staff" />
      ) : id ? (
        <StaffRequestDetails requestType={activeRequestType} />
      ) : (
        <StaffDashboard requestType={activeRequestType} currentStaffId={user?.id || ''} user={user} />
      )}
    </>
  );
};

export default StaffPanel;
