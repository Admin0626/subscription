import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  withCredentials: true
})

api.interceptors.response.use(
  response => response.data,
  error => {
    const message = error.response?.data?.error?.message || error.message || '请求失败'
    return Promise.reject(new Error(message))
  }
)

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout')
}

export const userApi = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getPoints: () => api.get('/user/points'),
  getPointsHistory: () => api.get('/user/points/history')
}

export const bookApi = {
  getList: (params) => api.get('/books', { params }),
  getDetail: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
  search: (params) => api.get('/books/search', { params }),
  download: (id) => api.post(`/books/${id}/download`),
  rate: (id, rating) => api.post(`/books/${id}/rate`, { rating })
}

export const categoryApi = {
  getAll: () => api.get('/categories')
}

export const tagApi = {
  getAll: () => api.get('/tags')
}

export const favoriteApi = {
  getAll: () => api.get('/favorites'),
  add: (bookId) => api.post('/favorites', { bookId }),
  remove: (bookId) => api.delete(`/favorites/${bookId}`)
}

export const homeApi = {
  getHotBooks: () => api.get('/home/hot'),
  getRandomBooks: () => api.get('/home/random'),
  getAnnouncements: () => api.get('/home/announcements')
}

export const notificationApi = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`)
}

export const adminApi = {
  getPendingBooks: () => api.get('/admin/books/pending'),
  reviewBook: (id, action, reason) => api.post(`/admin/books/${id}/review`, { action, reason }),
  getAllBooks: (params) => api.get('/admin/books', { params }),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  getStats: () => api.get('/admin/stats')
}

export default api