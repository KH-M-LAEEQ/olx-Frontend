import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const inp = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#241242] bg-white transition'

export default function PostAdPage() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const { id }     = useParams()
  const isEdit     = Boolean(id)

  const [form, setForm]             = useState({ title: '', description: '', price: '', category: '', location: '', condition: 'used' })
  const [images, setImages]         = useState([])
  const [previews, setPreviews]     = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [categories, setCategories] = useState([])
  const [errors, setErrors]         = useState({})
  const [loading, setLoading]       = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    api.get('/categories/').then(r => setCategories(r.data.results || r.data))
    if (isEdit) {
      api.get(`/ads/${id}/`).then(({ data }) => {
        setForm({
          title: data.title, description: data.description, price: data.price,
          category: data.category?.id || '', location: data.location, condition: data.condition,
        })
        const imgs = data.images || []
        setExistingImages(imgs)
        setPreviews(imgs.map(i => i.image))
      })
    }
  }, [user, id])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)
    setExistingImages([])
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    images.forEach(img => fd.append('uploaded_images', img))
    try {
      if (isEdit) { await api.patch(`/ads/${id}/update/`, fd); navigate(`/ads/${id}`) }
      else        { const { data } = await api.post('/ads/create/', fd); navigate(`/ads/${data.id}`) }
    } catch (err) {
      setErrors(err.response?.data || { general: 'Something went wrong.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#f2f4f5] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-7">

        <h1 className="text-xl font-black text-[#241242] mb-5">
          {isEdit ? 'Edit your ad' : 'Post your ad'}
        </h1>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Ad details */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-black text-[#241242] uppercase tracking-wide">Ad Details</h2>

            <div>
              <label className="block text-xs font-bold text-[#241242] mb-1.5 uppercase tracking-wide">Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required
                placeholder="What are you selling?" className={inp} />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#241242] mb-1.5 uppercase tracking-wide">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required className={inp}>
                <option value="">Select a category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#241242] mb-1.5 uppercase tracking-wide">Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={5}
                placeholder="Describe your item — condition, age, reason for selling..."
                className={`${inp} resize-none`} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#241242] mb-1.5 uppercase tracking-wide">Price (PKR) *</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} required min="0"
                  placeholder="Enter price" className={inp} />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-[#241242] mb-1.5 uppercase tracking-wide">Condition</label>
                <select name="condition" value={form.condition} onChange={handleChange} className={inp}>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#241242] mb-1.5 uppercase tracking-wide">Location *</label>
              <input type="text" name="location" value={form.location} onChange={handleChange} required
                placeholder="e.g. Karachi, Lahore, Islamabad" className={inp} />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-sm font-black text-[#241242] uppercase tracking-wide mb-4">
              {isEdit ? 'Photos' : 'Upload Photos'}
              {' '}<span className="text-gray-400 font-normal normal-case text-xs">
                {isEdit ? '(upload new to replace existing)' : '(first = cover)'}
              </span>
            </h2>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-[#241242] hover:bg-[#241242]/5 transition">
              <svg className="w-9 h-9 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-semibold text-gray-500">Click to add photos</span>
              <span className="text-xs text-gray-400 mt-0.5">JPG, PNG up to 10MB each</span>
              <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
            </label>
            {previews.length > 0 && (
              <div className="flex gap-2 mt-4 flex-wrap">
                {previews.map((src, i) => (
                  <div key={i} className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 ${i === 0 ? 'border-[#241242]' : 'border-gray-200'}`}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-[#241242] text-[#ff5c8a] font-black py-0.5">
                        COVER
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#ff5c8a] hover:bg-pink-400 text-[#241242] font-black py-3.5 rounded-xl text-sm transition disabled:opacity-50">
            {loading ? (isEdit ? 'Saving...' : 'Posting...') : (isEdit ? 'Update Ad' : 'Post Ad Now')}
          </button>
        </form>
      </div>
    </div>
  )
}
