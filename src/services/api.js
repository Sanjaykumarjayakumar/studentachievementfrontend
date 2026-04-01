const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://studentachievementbackend.onrender.com/api').replace(/\/$/, '');

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with ${response.status}`);
  }

  return data;
};

export const loginUser = (payload) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify(payload) });

export const googleLogin = (payload) =>
  request('/auth/google-login', { method: 'POST', body: JSON.stringify(payload) });

export const getItems = (resource, studentIdOrOptions) => {
  const params = new URLSearchParams();
  if (typeof studentIdOrOptions === 'string' && studentIdOrOptions) {
    params.set('studentId', studentIdOrOptions);
  } else if (studentIdOrOptions && typeof studentIdOrOptions === 'object') {
    Object.entries(studentIdOrOptions).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        params.set(key, String(value));
      }
    });
  }
  const query = params.toString();
  return request(`/${resource}${query ? `?${query}` : ''}`);
};

export const getItemById = (resource, id) => request(`/${resource}/${id}`);

export const createItem = (resource, payload) =>
  request(`/${resource}`, { method: 'POST', body: JSON.stringify(payload) });

export const deleteItem = (resource, id, studentId) =>
  request(`/${resource}/${id}?studentId=${encodeURIComponent(studentId)}`, { method: 'DELETE' });

export const updateItemStatus = (resource, id, payload) =>
  request(`/${resource}/${id}/status`, { method: 'PATCH', body: JSON.stringify(payload) });

export const getUsers = ({ role, search, page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (!role) {
    return request(`/users/students?${params.toString()}`);
  }
  const rolePath = role === 'student' ? 'students' : role === 'staff' ? 'staff' : 'admins';
  return request(`/users/${rolePath}?${params.toString()}`);
};

export const getUserStats = () => request('/users/stats');

export const getUserById = (role, id) => request(`/users/${role}/${id}`);

export const createUserAccount = (payload) =>
  request('/users', { method: 'POST', body: JSON.stringify(payload) });

export const updateUserBlocked = (role, id, blocked) =>
  request(`/users/${role}/${id}/block`, { method: 'PATCH', body: JSON.stringify({ blocked }) });

export const deleteUser = (role, id) =>
  request(`/users/${role}/${id}`, { method: 'DELETE' });

export const updateUserProfile = (role, id, payload) =>
  request(`/users/${role}/${id}/profile`, { method: 'PATCH', body: JSON.stringify(payload) });

export const searchStaffUsers = (q) => request(`/users/staff-search?q=${encodeURIComponent(q)}`);

export const mapStudentToStaff = (studentId, staffMongoId) =>
  request(`/users/student/${studentId}/mapped-staff`, {
    method: 'PATCH',
    body: JSON.stringify({ staffMongoId })
  });

export const getMappedStudents = (staffId) => request(`/users/staff/${staffId}/students`);
