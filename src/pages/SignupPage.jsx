import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const inp = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#002f34] bg-white transition'

function Field({ name, label, type = 'text', placeholder, value, onChange, errors, required }) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#002f34] mb-1.5 uppercase tracking-wide">{label}</label>
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

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register/', form)
      login(data.access, data.refresh)
      window.location.href = '/'
    } catch (err) {
      const d = err.response?.data
      if (!d) { setErrors({ general: 'Network error.' }); return }
      const nf = [...(d.non_field_errors || []), ...(d.detail ? [d.detail] : [])]
      setErrors({ ...d, ...(nf.length ? { general: nf.join(' ') } : {}) })
    } finally {
      setLoading(false)
    }
  }

  const fp = { onChange: handleChange, errors }

  return (
    <div className="bg-[#f2f4f5] min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">

        <div className="text-center mb-6">
          <Link to="/" className="inline-block mb-4">
            <div className="bg-white border-b-[3px] border-[#3a77ff] px-4 py-2 rounded-sm inline-block">
              <span className="text-[#002f34] font-black text-2xl tracking-tight italic">OLX</span>
            </div>
          </Link>
          <p className="text-sm text-gray-500">Create your free OLX account</p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{errors.general}</div>
        )}

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
            className="w-full bg-[#002f34] hover:bg-[#013a40] text-white font-black py-3 rounded-xl text-sm transition disabled:opacity-50 mt-2">
            {loading ? 'Creating account...' : 'Register Free'}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
          <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or</span></div>
        </div>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-[#3a77ff] font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}
