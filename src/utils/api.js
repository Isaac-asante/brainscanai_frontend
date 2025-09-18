import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URLL || 'http://127.0.0.1:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    console.log(`API Request: ${config.method?.toUpperCase()} ${API_BASE_URL}${config.url}`)
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    const { response, request } = error

    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: response?.status,
      data: response?.data,
      message: error.message
    })

    if (!response) {
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        toast.error('Cannot connect to server. Please ensure the backend is running on http://127.0.0.1:5000')
      } else {
        toast.error('Network error. Please check your connection.')
      }
      return Promise.reject(error)
    }

    const { status, data } = response

    switch (status) {
      case 401:
        if (data?.error === "Please verify your email before logging in.") {
          // Don't auto-logout for unverified email
          toast.error('Please verify your email before logging in.')
        } else {
          localStorage.removeItem('token')
          toast.error('Session expired. Please login again.')
          setTimeout(() => {
            window.location.href = '/'
          }, 1000)
        }
        break
      case 403:
        toast.error(data?.error || 'Access forbidden.')
        break
      case 404:
        toast.error('Endpoint not found.')
        break
      case 400:
        toast.error(data?.error || 'Bad request.')
        break
      case 500:
        toast.error('Server error. Please try again later.')
        break
      default:
        toast.error(data?.error || data?.message || `Error ${status}`)
    }

    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
  adminRegister: (userData) => api.post('/admin-register', userData),
  adminLogin: (credentials) => api.post('/login-admin', credentials),
  verifyEmail: (token) => api.get(`/verify-email/${token}`),
}

export const doctorAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile/update', data),
  getPredictions: () => api.get('/history'),
  uploadPrediction: (formData) => api.post('/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deletePrediction: (id) => api.delete(`/history/${id}`),
  deleteAllPredictions: () => api.delete('/history'),
  downloadLogs: (format = 'csv') => api.get(`/history/download?format=${format}`, {
    responseType: 'blob'
  }),
}

export const adminAPI = {
  getAllDoctors: () => api.get('/admin/users'),
  deleteDoctor: (email) => api.delete('/admin/delete-user', { data: { email } }),
  getAllPredictions: () => api.get('/admin/logs'),
}

// Test connection
export const testConnection = () => api.get('/status')

export default api