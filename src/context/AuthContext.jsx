import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
  setUser: () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = () =>
    api.get('/auth/profile/').then(({ data }) => { setUser(data); return data })

  useEffect(() => {
    if (localStorage.getItem('access')) {
      fetchUser().catch(() => {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
      }).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (access, refresh) => {
    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)
    fetchUser().catch(() => {})
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout/', { refresh: localStorage.getItem('refresh') })
    } catch {}
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setUser(null)
  }

  const refreshUser = () => fetchUser()

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
