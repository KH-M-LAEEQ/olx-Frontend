import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const fmt = (price) => {
  const n = Number(price)
  if (n >= 10000000) return `PKR ${(n / 10000000).toFixed(1)} Crore`
  if (n >= 100000)   return `PKR ${(n / 100000).toFixed(1)} Lac`
  return `PKR ${n.toLocaleString()}`
}

const ago = (d) => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000)
  if (s < 60)    return 'Just now'
  if (s < 3600)  return `${Math.floor(s / 60)} min ago`
  if (s < 86400) return `${Math.floor(s / 3600)} hr ago`
  if (s < 172800) return 'Yesterday'
  return new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })
}

export default function AdCard({ ad }) {
  const { user } = useAuth()
  const [isFav, setIsFav] = useState(ad.is_favourite ?? false)
  const [loading, setLoading] = useState(false)

  const toggleFav = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return
    if (loading) return
    setLoading(true)
    try {
      const { data } = await api.post(`/ads/${ad.id}/favourite/`)
      setIsFav(data.is_favourite)
    } catch {}
    finally { setLoading(false) }
  }

  return (
    <Link to={`/ads/${ad.id}`}
      className="block bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all rounded-xl overflow-hidden group">
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
        {ad.cover_image
          ? <img src={ad.cover_image} alt={ad.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
        }
        {ad.is_expired && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
            Expired
          </span>
        )}
        {user && (
          <button
            onClick={toggleFav}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm ${isFav ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'}`}>
            <svg className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
      </div>
      <div className="p-3">
        <p className="font-black text-[#241242] text-sm">{fmt(ad.price)}</p>
        <p className="text-sm text-gray-600 mt-0.5 line-clamp-2 leading-snug">{ad.title}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400 truncate max-w-[90px]">{ad.location}</span>
          <span className="text-xs text-gray-400 shrink-0 ml-1">{ago(ad.created_at)}</span>
        </div>
      </div>
    </Link>
  )
}
