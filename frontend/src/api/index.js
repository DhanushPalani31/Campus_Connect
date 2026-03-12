import axios from 'axios'
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const api = axios.create({ baseURL: BASE, withCredentials: true })
api.interceptors.response.use(r => r.data, e => Promise.reject(new Error(e.response?.data?.message || 'Request failed')))

export const authApi = {
  register: d => api.post('/auth/register', d),
  login: d => api.post('/auth/login', d),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}
export const alumniApi = {
  all: p => api.get('/alumni', { params: p }),
  one: id => api.get(`/alumni/${id}`),
  update: d => api.put('/alumni/profile', d),
}
export const sessionApi = {
  create: d => api.post('/sessions', d),
  my: p => api.get('/sessions/my', { params: p }),
  confirm: (id, d) => api.put(`/sessions/${id}/confirm`, d),
  cancel: (id, d) => api.put(`/sessions/${id}/cancel`, d),
  complete: id => api.put(`/sessions/${id}/complete`),
  review: (id, d) => api.post(`/sessions/${id}/review`, d),
}
export const payApi = {
  order: d => api.post('/payments/create-order', d),
  verify: d => api.post('/payments/verify', d),
  history: () => api.get('/payments/history'),
}
export default api
