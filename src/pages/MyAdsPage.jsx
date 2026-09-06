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

const daysLeft = (d) => {
  if (!d) return null
  const diff = Math.ceil((new Date(d) - Date.now()) / 86400000)
  return diff
}

export default function MyAdsPage() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const [ads, setAds]         = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    let cancelled = false
    api.get('/ads/my-ads/').then(({ data }) => {
      if (!cancelled) setAds(data.results || data)
    }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [user])

  const handleDelete = async (id) => {
    if (!confirm('Delete this ad?')) return
    try {
      await api.delete(`/ads/${id}/delete/`)
      setAds(ads.filter(a => a.id !== id))
    } catch {
      alert('Failed to delete ad. Please try again.')
    }
  }

  const handleToggleActive = async (id) => {
    const { data } = await api.patch(`/ads/${id}/toggle-active/`)
    setAds(ads.map(a => a.id === id ? { ...a, is_active: data.is_active } : a))
  }

  const handleRenew = async (id) => {
    const { data } = await api.post(`/ads/${id}/renew/`)
    setAds(ads.map(a => a.id === id ? { ...a, expires_at: data.expires_at, is_active: data.is_active } : a))
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
          <h1 className="text-xl font-black text-[#241242]">My Ads ({ads.length})</h1>
          <Link to="/post-ad"
            className="flex items-center gap-1 bg-[#ff5c8a] hover:bg-pink-400 text-[#241242] font-black px-4 py-2.5 rounded-xl text-sm transition">
            <span className="text-base leading-none">+</span> Post New Ad
          </Link>
        </div>

        {ads.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
            <p className="text-5xl mb-3">📦</p>
            <p className="font-black text-[#241242] text-lg mb-1">No ads posted yet</p>
            <p className="text-sm text-gray-400 mb-6">Start selling — post your first ad for free</p>
            <Link to="/post-ad"
              className="bg-[#ff5c8a] hover:bg-pink-400 text-[#241242] font-black px-6 py-3 rounded-xl text-sm inline-block transition">
              Post an Ad
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {ads.map(ad => {
              const days = daysLeft(ad.expires_at)
              const expired = days !== null && days <= 0
              const expiringSoon = days !== null && days > 0 && days <= 7

              return (
                <div key={ad.id}
                  className={`bg-white rounded-xl border flex gap-4 p-4 items-start hover:shadow-sm transition ${!ad.is_active ? 'opacity-60 border-gray-100' : expired ? 'border-red-200' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 mt-0.5">
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
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/ads/${ad.id}`}
                        className="text-sm font-bold text-[#241242] hover:underline truncate block">
                        {ad.title}
                      </Link>
                      <div className="flex items-center gap-1 shrink-0">
                        {!ad.is_active && (
                          <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase">Inactive</span>
                        )}
                        {expired && (
                          <span className="text-[10px] font-black bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase">Expired</span>
                        )}
                        {expiringSoon && (
                          <span className="text-[10px] font-black bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full uppercase">Expires soon</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-black text-[#241242] mt-0.5">{fmt(ad.price)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {ad.location}{ad.category ? ` · ${ad.category.name}` : ''}
                      {ad.expires_at && (
                        <span className={`ml-2 ${expired ? 'text-red-400' : expiringSoon ? 'text-yellow-500' : 'text-gray-300'}`}>
                          · {expired ? 'Expired' : `${days}d left`}
                        </span>
                      )}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Link to={`/ads/${ad.id}/edit`}
                        className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:border-[#241242] hover:text-[#241242] font-semibold transition">
                        Edit
                      </Link>
                      <button onClick={() => handleToggleActive(ad.id)}
                        className={`text-xs border px-3 py-1.5 rounded-lg font-semibold transition ${ad.is_active ? 'border-yellow-200 text-yellow-700 hover:bg-yellow-50' : 'border-green-200 text-green-700 hover:bg-green-50'}`}>
                        {ad.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      {(expired || expiringSoon) && (
                        <button onClick={() => handleRenew(ad.id)}
                          className="text-xs border border-blue-200 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 font-semibold transition">
                          Renew 60 days
                        </button>
                      )}
                      <button onClick={() => handleDelete(ad.id)}
                        className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 font-semibold transition">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
