import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('refresh')
        if (!refresh) return Promise.reject(err)
        const { data } = await axios.post('http://127.0.0.1:8000/api/auth/refresh/', { refresh })
        localStorage.setItem('access', data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch {
        // Refresh also failed — clear tokens, let the app handle the unauthenticated state
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
      }
    }
    return Promise.reject(err)
  }
)

export default api
