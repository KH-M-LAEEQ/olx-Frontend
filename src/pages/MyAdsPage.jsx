import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const fmt = (p) => {
  const n = Number(p)
  if (n >= 10000000) return `PKR ${(n / 10000000).toFixed(1)} Cr`
  if (n >= 100000)   return `PKR ${(n / 100000).toFixed(1)} Lac`
  return `PKR ${n.toLocaleString()}`
}

export default function MyAdsPage() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const [ads, setAds]         = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    api.get('/ads/my-ads/').then(({ data }) => setAds(data.results || data)).finally(() => setLoading(false))
  }, [user])

  const handleDelete = async (id) => {
    if (!confirm('Delete this ad?')) return
    await api.delete(`/ads/${id}/delete/`)
    setAds(ads.filter(a => a.id !== id))
  }

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-24 bg-white rounded-xl border border-gray-200 animate-pulse" />
      ))}
    </div>
  )

  return (
    <div className="bg-[#f2f4f5] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-7">

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-black text-[#002f34]">My Ads ({ads.length})</h1>
          <Link to="/post-ad"
            className="flex items-center gap-1 bg-[#ffce32] hover:bg-yellow-400 text-[#002f34] font-black px-4 py-2.5 rounded-xl text-sm transition">
            <span className="text-base leading-none">+</span> Post New Ad
          </Link>
        </div>

        {ads.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
            <p className="text-5xl mb-3">📦</p>
            <p className="font-black text-[#002f34] text-lg mb-1">No ads posted yet</p>
            <p className="text-sm text-gray-400 mb-6">Start selling — post your first ad for free</p>
            <Link to="/post-ad"
              className="bg-[#ffce32] hover:bg-yellow-400 text-[#002f34] font-black px-6 py-3 rounded-xl text-sm inline-block transition">
              Post an Ad
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {ads.map(ad => (
              <div key={ad.id}
                className="bg-white rounded-xl border border-gray-200 flex gap-4 p-4 items-center hover:border-gray-300 hover:shadow-sm transition">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {ad.cover_image
                    ? <img src={ad.cover_image} alt={ad.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/ads/${ad.id}`}
                    className="text-sm font-bold text-[#002f34] hover:underline truncate block">
                    {ad.title}
                  </Link>
                  <p className="text-sm font-black text-[#002f34] mt-0.5">{fmt(ad.price)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {ad.location}{ad.category ? ` · ${ad.category.name}` : ''}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link to={`/ads/${ad.id}/edit`}
                    className="text-xs border border-gray-200 text-gray-600 px-3 py-2 rounded-lg hover:border-[#002f34] hover:text-[#002f34] font-semibold transition">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(ad.id)}
                    className="text-xs border border-red-200 text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 font-semibold transition">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
