import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const inp = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#241242] bg-white transition'

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]       = useState({ username: '', email: '', phone: '', city: '', address: '' })
  const [avatar, setAvatar]   = useState(null)
  const [preview, setPreview] = useState(null)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    setForm({
      username: user.username || '', email: user.email || '',
      phone: user.phone || '', city: user.city || '', address: user.address || '',
    })
    if (user.avatar) setPreview(user.avatar)
  }, [user])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAvatar = (e) => {
    const file = e.target.files[0]
    if (file) { setAvatar(file); setPreview(URL.createObjectURL(file)) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (avatar) fd.append('avatar', avatar)
    try {
      const { data } = await api.patch('/auth/profile/', fd)
      setUser(data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setErrors(err.response?.data || {})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#f2f4f5] min-h-screen">
      <div className="max-w-lg mx-auto px-4 py-7">
        <h1 className="text-xl font-black text-[#241242] mb-5">My Profile</h1>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-4">
            Profile updated successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">

          {/* Avatar */}
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full bg-[#241242] overflow-hidden flex items-center justify-center">
                {preview
                  ? <img src={preview} alt="" className="w-full h-full object-cover" />
                  : <span className="text-[#ff5c8a] font-black text-xl">{user?.username?.[0]?.toUpperCase()}</span>
                }
              </div>
              <label className="absolute -bottom-1 -right-1 bg-white border-2 border-gray-200 rounded-full p-1 cursor-pointer hover:bg-gray-50 transition">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
              </label>
            </div>
            <div>
              <p className="font-black text-[#241242]">{user?.username}</p>
              <p className="text-xs text-gray-400 mt-0.5">Click the camera to change photo</p>
            </div>
          </div>

          {[
            { name: 'username', label: 'Username',  type: 'text' },
            { name: 'email',    label: 'Email',     type: 'email' },
            { name: 'phone',    label: 'Phone',     type: 'text' },
            { name: 'city',     label: 'City',      type: 'text' },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-xs font-bold text-[#241242] mb-1.5 uppercase tracking-wide">{f.label}</label>
              <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange} className={inp} />
              {errors[f.name] && <p className="text-red-500 text-xs mt-1">{errors[f.name]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-xs font-bold text-[#241242] mb-1.5 uppercase tracking-wide">Address</label>
            <textarea name="address" value={form.address} onChange={handleChange} rows={2}
              className={`${inp} resize-none`} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#241242] hover:bg-[#1a0a33] text-white font-black py-3 rounded-xl text-sm transition disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
