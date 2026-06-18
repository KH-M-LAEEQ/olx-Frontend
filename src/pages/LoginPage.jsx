import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function OlxLogo({ size = 58 }) {
  const h = Math.round(size * 44 / 96)
  return (
    <svg width={size} height={h} viewBox="0 0 96 44" fill="none">
      <circle cx="18" cy="22" r="15" stroke="#3a77ff" strokeWidth="6" fill="none" />
      <rect x="41" y="6" width="6" height="32" rx="3" fill="#3a77ff" />
      <rect x="41" y="32" width="15" height="6" rx="3" fill="#3a77ff" />
      <line x1="67" y1="6"  x2="94" y2="38" stroke="#3a77ff" strokeWidth="6.5" strokeLinecap="round" />
      <line x1="94" y1="6"  x2="67" y2="38" stroke="#3a77ff" strokeWidth="6.5" strokeLinecap="round" />
    </svg>
  )
}

export default function LoginPage() {
  const [form, setForm]       = useState({ username: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)
  const { login } = useAuth()

  useEffect(() => {
    // Google Identity Services
    const gScript = document.createElement('script')
    gScript.src = 'https://accounts.google.com/gsi/client'
    gScript.async = true
    document.body.appendChild(gScript)

    // Facebook SDK
    window.fbAsyncInit = function () {
      window.FB.init({ appId: import.meta.env.VITE_FB_APP_ID, cookie: true, version: 'v19.0' })
    }
    const fbScript = document.createElement('script')
    fbScript.src = 'https://connect.facebook.net/en_US/sdk.js'
    fbScript.async = true
    document.body.appendChild(fbScript)

    return () => {
      if (document.body.contains(gScript))  document.body.removeChild(gScript)
      if (document.body.contains(fbScript)) document.body.removeChild(fbScript)
    }
  }, [])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login/', form)
      login(data.access, data.refresh)
      window.location.href = '/'
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    if (!window.google) return setError('Google SDK not loaded yet, try again.')
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async ({ credential }) => {
        setLoading(true)
        try {
          const { data } = await api.post('/auth/google/', { credential })
          login(data.access, data.refresh)
          window.location.href = '/'
        } catch (err) {
          const msg = err.response?.data?.error || err.response?.data?.detail || err.message || 'Unknown error'
          setError(`Google login failed: ${msg}`)
        } finally { setLoading(false) }
      },
    })
    window.google.accounts.id.prompt()
  }

  const handleFacebookLogin = () => {
    if (!window.FB) return setError('Facebook SDK not loaded yet, try again.')
    window.FB.login((response) => {
      if (response.authResponse) {
        setLoading(true)
        api.post('/auth/facebook/', { access_token: response.authResponse.accessToken })
          .then(({ data }) => { login(data.access, data.refresh); window.location.href = '/' })
          .catch(() => setError('Facebook login failed. Backend social auth may not be configured yet.'))
          .finally(() => setLoading(false))
      }
    }, { scope: 'email,public_profile' })
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f2f4f5] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-xl">

        {/* ── Left panel: branding ── */}
        <div className="hidden md:flex flex-col justify-between bg-[#002f34] w-2/5 p-10">
          <Link to="/">
            <svg width="70" height="32" viewBox="0 0 96 44" fill="none">
              <circle cx="18" cy="22" r="15" stroke="white" strokeWidth="6" fill="none" />
              <rect x="41" y="6" width="6" height="32" rx="3" fill="white" />
              <rect x="41" y="32" width="15" height="6" rx="3" fill="white" />
              <line x1="67" y1="6"  x2="94" y2="38" stroke="white" strokeWidth="6.5" strokeLinecap="round" />
              <line x1="94" y1="6"  x2="67" y2="38" stroke="white" strokeWidth="6.5" strokeLinecap="round" />
            </svg>
          </Link>

          <div>
            <h2 className="text-white font-black text-3xl leading-tight mb-3">
              Pakistan's No.1<br />Online Marketplace
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Buy and sell anything — cars, mobiles, property, electronics and more.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: '🛡️', text: 'Secure & trusted platform' },
              { icon: '⚡', text: 'Post ads for free in seconds' },
              { icon: '🌍', text: 'Reach millions of buyers' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-xl leading-none">{icon}</span>
                <span className="text-white/70 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right panel: form ── */}
        <div className="flex-1 bg-white p-8 md:p-10 flex flex-col justify-center">

          {/* Mobile logo */}
          <div className="md:hidden flex justify-center mb-6">
            <Link to="/"><OlxLogo size={64} /></Link>
          </div>

          <h1 className="text-2xl font-black text-[#002f34] mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-7">Login to your OLX account</p>

          {/* Social buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleGoogleLogin}
              className="flex-1 flex items-center justify-center gap-2.5 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition">
              {/* Google G */}
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              Continue with Google
            </button>

            <button
              onClick={handleFacebookLogin}
              className="flex-1 flex items-center justify-center gap-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl py-2.5 text-sm font-semibold transition">
              {/* Facebook f */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.027 4.388 11.024 10.125 11.927V15.563H7.078v-3.49h3.047V9.43c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.932-1.956 1.887v2.247h3.328l-.532 3.49h-2.796v8.437C19.612 23.097 24 18.1 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400 font-medium">or continue with email</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#002f34] mb-1.5 uppercase tracking-wide">Username</label>
              <input
                type="text" name="username" value={form.username}
                onChange={handleChange} required autoComplete="username"
                placeholder="Enter your username"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3a77ff] focus:ring-2 focus:ring-[#3a77ff]/10 bg-white transition" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#002f34] uppercase tracking-wide">Password</label>
                <button type="button" className="text-xs text-[#3a77ff] hover:underline font-medium">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} required autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-[#3a77ff] focus:ring-2 focus:ring-[#3a77ff]/10 bg-white transition" />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showPw ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#002f34] hover:bg-[#013a40] active:scale-[0.98] text-white font-black py-3.5 rounded-xl text-sm transition disabled:opacity-50 mt-1">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Logging in...
                </span>
              ) : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#3a77ff] font-bold hover:underline">Register free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
