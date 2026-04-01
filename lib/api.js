import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth
export const loginCreator = (telegram_id, telegram_username) =>
  api.post('/api/auth/login', { telegram_id, telegram_username });

export const getCreatorProfile = (telegram_id) =>
  api.get(`/api/creators/${telegram_id}`);

export const updateCreatorProfile = (telegram_id, data) =>
  api.put(`/api/creators/${telegram_id}`, data);

// Submissions
export const submitContent = (telegram_id, data) =>
  api.post('/api/submissions', { telegram_id, ...data });

export const getCreatorSubmissions = (telegram_id) =>
  api.get(`/api/submissions/${telegram_id}`);

// Leaderboard
export const getLeaderboard = () =>
  api.get('/api/leaderboard');

// Admin
export const checkIsAdmin = (telegram_id) =>
  api.get(`/api/admin/check/${telegram_id}`);

export const getPendingSubmissions = () =>
  api.get('/api/admin/submissions/pending');

export const approveSubmission = (id, admin_id, adjustment = 0) =>
  api.post(`/api/admin/submissions/${id}/approve`, { admin_id, adjustment });

export const rejectSubmission = (id, admin_id) =>
  api.post(`/api/admin/submissions/${id}/reject`, { admin_id });

export const addAdmin = (telegram_id, telegram_username) =>
  api.post('/api/admin/add', { telegram_id, telegram_username });

export default api;
