// Tiny fetch wrapper. All calls go through Vite's /api proxy -> backend :3000.
const TOKEN_KEY = 'thesisflow_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {};
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  // FormData (file uploads) sets its own multipart Content-Type — don't override.
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  if (!isForm && body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: isForm ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 401 -> clear stale token so the app falls back to login.
  if (res.status === 401) {
    setToken(null);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* no JSON body */
  }

  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  register: (payload) =>
    request('/auth/register', { method: 'POST', body: payload, auth: false }),
  me: () => request('/auth/me', { method: 'GET', auth: true }),
  getDepartments: () => request('/departments', { method: 'GET', auth: false }),
  getTheses: () => request('/theses', { method: 'GET', auth: true }),
  getThesis: (id) => request(`/theses/${id}`, { method: 'GET', auth: true }),
  getSupervisors: () => request('/users/supervisors', { method: 'GET', auth: true }),
  getMyStudents: () => request('/users/my-students', { method: 'GET', auth: true }),
  getUsers: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.role && filters.role !== 'all') params.append('role', filters.role);
    if (filters.departmentId && filters.departmentId !== 'all') params.append('departmentId', filters.departmentId);
    const query = params.toString();
    return request(`/users${query ? `?${query}` : ''}`, { method: 'GET', auth: true });
  },
  createUser: (payload) => request('/users', { method: 'POST', body: payload, auth: true }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE', auth: true }),
  createThesis: (title, supervisorId) =>
    request('/theses', { method: 'POST', body: { title, supervisorId }, auth: true }),
  uploadSubmission: (thesisId, file) => {
    const form = new FormData();
    form.append('file', file);
    return request(`/theses/${thesisId}/submissions/upload`, {
      method: 'POST',
      body: form,
      auth: true,
    });
  },
  submitToSupervisor: (thesisId) =>
    request(`/theses/${thesisId}/submit`, { method: 'POST', auth: true }),
  getComments: (submissionId) =>
    request(`/submissions/${submissionId}/comments`, { method: 'GET', auth: true }),
  postComment: (submissionId, content) =>
    request(`/submissions/${submissionId}/comments`, {
      method: 'POST',
      body: { content },
      auth: true,
    }),
  startReview: (thesisId) =>
    request(`/theses/${thesisId}/start-review`, { method: 'POST', auth: true }),
  approve: (thesisId) =>
    request(`/theses/${thesisId}/approve`, { method: 'POST', auth: true }),
  approveThesis: (thesisId) =>
    request(`/theses/${thesisId}/approve`, { method: 'POST', auth: true }),
  requestRevisions: (thesisId) =>
    request(`/theses/${thesisId}/request-revisions`, { method: 'POST', auth: true }),
  reopenThesis: (thesisId) =>
    request(`/theses/${thesisId}/reopen`, { method: 'POST', auth: true }),
  getNotifications: () => request('/notifications', { method: 'GET', auth: true }),
  markNotificationRead: (id) =>
    request(`/notifications/${id}/read`, { method: 'PATCH', auth: true }),
  markAllNotificationsRead: () =>
    request('/notifications/read-all', { method: 'POST', auth: true }),
  updateProfile: (payload) =>
    request('/users/profile', { method: 'PATCH', body: payload, auth: true }),
  changePassword: (currentPassword, newPassword) =>
    request('/users/change-password', {
      method: 'PUT',
      body: { currentPassword, newPassword },
      auth: true,
    }),
};
