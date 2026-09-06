import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Logo from '../components/Logo'

const inp = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#241242] bg-white transition'

function Field({ name, label, type = 'text', placeholder, value, onChange, errors, required }) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#241242] mb-1.5 uppercase tracking-wide">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required={required}
        placeholder={placeholder} className={inp} />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">
          {Array.isArray(errors[name]) ? errors[name].join(' ') : errors[name]}
        </p>
      )}
    </div>
  )
}

export default function SignupPage() {
  const [form, setForm]       = useState({ username: '', email: '', phone: '', city: '', password: '', password2: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const gScript = document.createElement('script')
    gScript.src = 'https://accounts.google.com/gsi/client'
    gScript.async = true
    document.body.appendChild(gScript)

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
    setErrors({})
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register/', form)
      login(data.access, data.refresh)
      navigate('/')
    } catch (err) {
      const d = err.response?.data
      if (!d) { setErrors({ general: 'Network error.' }); return }
      const nf = [...(d.non_field_errors || []), ...(d.detail ? [d.detail] : [])]
      setErrors({ ...d, ...(nf.length ? { general: nf.join(' ') } : {}) })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    if (!window.google) return setErrors({ general: 'Google SDK not loaded yet, try again.' })
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async ({ credential }) => {
        setLoading(true)
        try {
          const { data } = await api.post('/auth/google/', { credential })
          login(data.access, data.refresh)
          navigate('/')
        } catch (err) {
          setErrors({ general: err.response?.data?.error || 'Google sign-up failed.' })
        } finally { setLoading(false) }
      },
    })
    window.google.accounts.id.prompt()
  }

  const handleFacebookLogin = () => {
    if (!window.FB) return setErrors({ general: 'Facebook SDK not loaded yet, try again.' })
    window.FB.login((response) => {
      if (response.authResponse) {
        setLoading(true)
        api.post('/auth/facebook/', { access_token: response.authResponse.accessToken })
          .then(({ data }) => { login(data.access, data.refresh); navigate('/') })
          .catch(() => setErrors({ general: 'Facebook sign-up failed.' }))
          .finally(() => setLoading(false))
      }
    }, { scope: 'email,public_profile' })
  }

  const fp = { onChange: handleChange, errors }

  return (
    <div className="bg-[#f2f4f5] min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">

        <div className="text-center mb-6">
          <Link to="/" className="inline-block mb-4">
            <div className="bg-white border-b-[3px] border-[#7c3aed] px-4 py-2 rounded-sm inline-block">
              <Logo size={28} />
            </div>
          </Link>
          <p className="text-sm text-gray-500">Create your free Bazaario account</p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{errors.general}</div>
        )}

        {/* Social login */}
        <div className="flex gap-3 mb-5">
          <button onClick={handleGoogleLogin}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Google
          </button>
          <button onClick={handleFacebookLogin}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl py-2.5 text-sm font-semibold transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.027 4.388 11.024 10.125 11.927V15.563H7.078v-3.49h3.047V9.43c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.932-1.956 1.887v2.247h3.328l-.532 3.49h-2.796v8.437C19.612 23.097 24 18.1 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
          <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or register with email</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Field name="username"  label="Username *"       placeholder="Choose a username"  value={form.username}  required {...fp} />
          <Field name="email"     label="Email (optional)" placeholder="your@email.com"      value={form.email}     type="email" {...fp} />
          <div className="grid grid-cols-2 gap-3">
            <Field name="phone" label="Phone"  placeholder="03xx-xxxxxxx" value={form.phone} {...fp} />
            <Field name="city"  label="City"   placeholder="Karachi"       value={form.city}  {...fp} />
          </div>
          <Field name="password"  label="Password *"         placeholder="Min 8 characters" value={form.password}  type="password" required {...fp} />
          <Field name="password2" label="Confirm Password *" placeholder="Repeat password"  value={form.password2} type="password" required {...fp} />
          <button type="submit" disabled={loading}
            className="w-full bg-[#241242] hover:bg-[#1a0a33] text-white font-black py-3 rounded-xl text-sm transition disabled:opacity-50 mt-2">
            {loading ? 'Creating account...' : 'Register Free'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-[#7c3aed] font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}
