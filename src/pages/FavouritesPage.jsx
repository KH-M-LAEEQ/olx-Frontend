import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import AdCard from '../components/AdCard'

export default function FavouritesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [ads, setAds]         = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    let cancelled = false
    api.get('/ads/favourites/').then(({ data }) => {
      if (!cancelled) setAds(data.results || data)
    }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [user])

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => <div key={i} className="aspect-[4/3] bg-gray-200 rounded-xl animate-pulse" />)}
    </div>
  )

  return (
    <div className="bg-[#f2f4f5] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-7">
        <h1 className="text-xl font-black text-[#002f34] mb-5">Saved Ads ({ads.length})</h1>
        {ads.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
            <p className="text-5xl mb-3">🤍</p>
            <p className="font-black text-[#002f34] text-lg mb-1">No saved ads yet</p>
            <p className="text-sm text-gray-400 mb-6">Tap the heart on any ad to save it here</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {ads.map(ad => <AdCard key={ad.id} ad={{ ...ad, is_favourite: true }} />)}
          </div>
        )}
      </div>
    </div>
  )
}
