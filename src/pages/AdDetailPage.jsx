import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import AdCard from '../components/AdCard'

const fmt = (price) => {
  const n = Number(price)
  if (n >= 10000000) return `PKR ${(n / 10000000).toFixed(2)} Crore`
  if (n >= 100000)   return `PKR ${(n / 100000).toFixed(1)} Lac`
  return `PKR ${n.toLocaleString()}`
}

export default function AdDetailPage() {
  const { id }   = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [ad, setAd]               = useState(null)
  const [related, setRelated]     = useState([])
  const [activeImg, setActiveImg] = useState(0)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get(`/ads/${id}/`).then(({ data }) => {
      setAd(data)
      setActiveImg(0)
      if (data.category) {
        api.get(`/ads/?category=${data.category.slug}`).then(r => {
          setRelated((r.data.results || r.data).filter(a => a.id !== data.id).slice(0, 6))
        })
      }
    }).catch(() => navigate('/')).finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Delete this ad?')) return
    await api.delete(`/ads/${id}/delete/`)
    navigate('/my-ads')
  }

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-3">
          <div className="aspect-video bg-gray-200 rounded-xl" />
          <div className="h-5 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="space-y-3">
          <div className="h-40 bg-gray-200 rounded-xl" />
          <div className="h-24 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  )

  if (!ad) return null

  const postedDate = new Date(ad.created_at).toLocaleDateString('en-PK', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="bg-[#f2f4f5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-5">

        {/* Breadcrumb */}
        <p className="text-xs text-gray-400 mb-4">
          <Link to="/" className="hover:underline">Home</Link>
          {ad.category && (
            <> › <Link to={`/search?category=${ad.category.slug}`} className="hover:underline">{ad.category.name}</Link></>
          )}
          {' '}› <span className="text-gray-600">{ad.title}</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">

          {/* ── Left ── */}
          <div className="space-y-4">

            {/* Gallery */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="aspect-video bg-gray-50 relative">
                {ad.images.length > 0 ? (
                  <img src={ad.images[activeImg]?.image} alt={ad.title}
                    className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {ad.images.length > 1 && (
                  <>
                    <button onClick={() => setActiveImg(i => (i - 1 + ad.images.length) % ad.images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center text-xl transition">
                      ‹
                    </button>
                    <button onClick={() => setActiveImg(i => (i + 1) % ad.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center text-xl transition">
                      ›
                    </button>
                    <div className="absolute bottom-3 right-4 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                      {activeImg + 1} / {ad.images.length}
                    </div>
                  </>
                )}
              </div>
              {ad.images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto border-t border-gray-100">
                  {ad.images.map((img, i) => (
                    <button key={img.id} onClick={() => setActiveImg(i)}
                      className={`shrink-0 w-14 h-14 overflow-hidden rounded-lg border-2 transition ${i === activeImg ? 'border-[#002f34]' : 'border-transparent hover:border-gray-300'}`}>
                      <img src={img.image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details + Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-black text-[#002f34] mb-4 text-sm uppercase tracking-wide">Details</h3>
              <table className="w-full text-sm mb-5">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-400 w-32">Condition</td>
                    <td className="py-2 capitalize font-semibold text-[#002f34]">{ad.condition}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-400">Location</td>
                    <td className="py-2 font-semibold text-[#002f34]">{ad.location}</td>
                  </tr>
                  {ad.category && (
                    <tr>
                      <td className="py-2 text-gray-400">Category</td>
                      <td className="py-2 font-semibold text-[#002f34]">{ad.category.icon} {ad.category.name}</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <h3 className="font-black text-[#002f34] mb-2 text-sm uppercase tracking-wide">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{ad.description}</p>
            </div>
          </div>

          {/* ── Right ── */}
          <div className="space-y-3">

            {/* Price card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 lg:sticky lg:top-20">
              <p className="text-2xl font-black text-[#002f34]">{fmt(ad.price)}</p>
              <p className="text-base text-gray-700 mt-1 font-semibold leading-snug">{ad.title}</p>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {ad.location}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Posted: {postedDate}</p>

              <div className="mt-4">
                {user && user.id === ad.seller.id ? (
                  <div className="flex gap-2">
                    <Link to={`/ads/${ad.id}/edit`}
                      className="flex-1 text-center text-sm font-bold py-2.5 border-2 border-[#002f34] text-[#002f34] rounded-xl hover:bg-[#002f34]/5 transition">
                      Edit Ad
                    </Link>
                    <button onClick={handleDelete}
                      className="flex-1 text-sm font-bold py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition">
                      Delete
                    </button>
                  </div>
                ) : (
                  <button className="w-full bg-[#ffce32] hover:bg-yellow-400 text-[#002f34] font-black py-3 rounded-xl text-sm transition">
                    Contact Seller
                  </button>
                )}
              </div>
            </div>

            {/* Seller card */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Seller</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#002f34] flex items-center justify-center text-[#ffce32] font-black text-sm shrink-0">
                  {ad.seller.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#002f34]">{ad.seller.username}</p>
                  {ad.seller.city && <p className="text-xs text-gray-400">{ad.seller.city}</p>}
                </div>
              </div>
              {ad.seller.phone && (
                <a href={`tel:${ad.seller.phone}`}
                  className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#3a77ff] hover:underline">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {ad.seller.phone}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Related ads */}
        {related.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-base font-black text-[#002f34] whitespace-nowrap">More from this category</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {related.map(r => <AdCard key={r.id} ad={r} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
