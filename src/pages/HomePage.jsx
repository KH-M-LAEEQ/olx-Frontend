import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import AdCard from '../components/AdCard'
import { LogoMark } from '../components/Logo'

const CITIES = [
  'Pakistan', 'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi',
  'Faisalabad', 'Peshawar', 'Quetta', 'Multan', 'Sialkot',
]

const NAV_LINKS = [
  { label: 'Mobile Phones', slug: 'mobiles' },
  { label: 'Cars',          slug: 'cars' },
  { label: 'Motorcycles',   slug: 'motorcycles' },
  { label: 'Houses',        slug: 'houses' },
  { label: 'Video-Audios',  slug: 'video-audios' },
  { label: 'Tablets',       slug: 'tablets' },
  { label: 'Land & Plots',  slug: 'land-plots' },
]

const CATS = [
  { name: 'Mobiles',                slug: 'mobiles',       emoji: '📱' },
  { name: 'Vehicles',               slug: 'cars',          emoji: '🚗' },
  { name: 'Property For Sale',      slug: 'property-sale', emoji: '🏠' },
  { name: 'Property For Rent',      slug: 'property-rent', emoji: '🔑' },
  { name: 'Electronics & Home...', slug: 'electronics',    emoji: '📷' },
  { name: 'Bikes',                  slug: 'bikes',         emoji: '🏍️' },
  { name: 'Business, Industrial &...', slug: 'business',   emoji: '🚜' },
  { name: 'Services',               slug: 'services',      emoji: '🧰' },
  { name: 'Jobs',                   slug: 'jobs',          emoji: '💼' },
  { name: 'Animals',                slug: 'animals',       emoji: '🐔' },
  { name: 'Furniture',              slug: 'furniture',     emoji: '🛋️' },
  { name: 'Fashion',                slug: 'fashion',       emoji: '👗' },
  { name: 'Books',                  slug: 'books',         emoji: '📚' },
  { name: 'Kids',                   slug: 'kids',          emoji: '🧸' },
]

function CatImage({ cat }) {
  return <span className="text-4xl leading-none select-none">{cat.emoji}</span>
}

export default function HomePage() {
  const [ads, setAds]         = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery]     = useState('')
  const [city, setCity]       = useState('Pakistan')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/ads/?ordering=-created_at&page_size=20')
      .then(({ data }) => setAds(data.results || data))
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (query.trim()) p.set('q', query)
    if (city !== 'Pakistan') p.set('location', city)
    navigate(`/search?${p.toString()}`)
  }

  return (
    <div className="bg-white min-h-screen">

      {/* ══════════════════════════════════════════
          SEARCH BAR — single-container border
      ══════════════════════════════════════════ */}
      <div className="bg-white py-4 border-b border-gray-100 sticky top-[64px] z-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <form onSubmit={handleSearch}>
            <div className="flex h-12 rounded-lg overflow-hidden border border-gray-300 focus-within:border-gray-400 transition">

              {/* Location picker */}
              <div className="flex items-center gap-2 px-4 bg-white shrink-0 w-52 border-r border-gray-300">
                <svg className="w-4 h-4 text-[#7c3aed] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                </svg>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="flex-1 text-sm text-[#241242] bg-transparent focus:outline-none font-semibold cursor-pointer appearance-none min-w-0">
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Text input */}
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Find Cars, Mobile Phones and more..."
                className="flex-1 px-4 text-sm focus:outline-none text-gray-700 placeholder-gray-400 bg-white min-w-0"
              />

              {/* Search button */}
              <button
                type="submit"
                className="bg-[#241242] hover:bg-[#1a0a33] px-7 text-white font-bold text-sm flex items-center gap-2 shrink-0 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          HORIZONTAL CATEGORY NAV
      ══════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-8 py-3 overflow-x-auto scrollbar-none">
            <button className="flex items-center gap-1 font-black text-[#241242] text-sm whitespace-nowrap shrink-0">
              All Categories
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {NAV_LINKS.map(t => (
              <Link
                key={t.slug}
                to={`/search?category=${t.slug}`}
                className="text-sm text-gray-600 hover:text-[#241242] whitespace-nowrap shrink-0 transition">
                {t.label}
              </Link>
            ))}
            {/* spacer pushes button to far right */}
            <div className="flex-1 shrink-0 min-w-4" />
            <Link
              to="/post-ad"
              className="whitespace-nowrap shrink-0 bg-[#ff5c8a] hover:bg-pink-400 text-[#241242] font-black text-sm px-6 py-2.5 rounded-md transition">
              Promote Your Ad
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          PROMO BANNER
      ══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-5">
        <div className="w-full rounded-xl overflow-hidden bg-[#7c3aed]">
          <div className="flex items-center justify-between gap-4 px-8 py-8 md:px-10 md:py-10">

            {/* Left — INTRODUCING + badge */}
            <div className="shrink-0 min-w-0">
              <p className="text-white font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight leading-none italic whitespace-nowrap">
                INTRODUCING
              </p>
              <div className="mt-3 bg-[#ff5c8a] inline-block px-3 sm:px-4 py-2 rounded-sm">
                <span className="text-[#241242] font-black text-sm sm:text-base md:text-lg lg:text-2xl tracking-tight whitespace-nowrap">
                  ★ AD OF THE WEEK ★
                </span>
              </div>
            </div>

            {/* Center — Bazaario logo circle (lg+) */}
            <div className="hidden lg:flex items-center justify-center w-32 h-32 xl:w-36 xl:h-36 rounded-full bg-[#4c1d95] shrink-0 shadow-2xl">
              <LogoMark size={48} color="#ffffff" />
            </div>

            {/* Right — Prime Spot + Book Now */}
            <div className="text-white text-center shrink-0">
              <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-black leading-snug whitespace-nowrap">
                Prime Spot. <span>One Week.</span>
              </p>
              <Link
                to="/post-ad"
                className="inline-block mt-3 bg-[#4c1d95] hover:bg-[#3b0764] text-white font-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-md text-sm sm:text-base transition">
                Book Now
              </Link>
            </div>

            {/* Far right — Feature boxes (xl+) */}
            <div className="hidden xl:flex flex-col gap-2 shrink-0">
              <div className="flex items-center gap-3 border border-white/40 bg-[#4c1d95] rounded-lg px-4 py-3 w-44">
                <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" />
                  </svg>
                </div>
                <div className="text-white text-xs font-bold leading-snug">
                  <div>Top</div>
                  <div>Placement</div>
                </div>
              </div>
              <div className="flex items-center gap-3 border border-white/40 bg-[#4c1d95] rounded-lg px-4 py-3 w-44">
                <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="text-white text-xs font-bold leading-snug">
                  <div>Maximum</div>
                  <div>Visibility</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          CATEGORY ICON GRID
      ══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-7">
        <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-9 gap-3 md:gap-4">
          {CATS.map(cat => (
            <Link
              key={cat.slug}
              to={`/search?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 group">
              <div className="w-full aspect-square flex items-center justify-center rounded-xl bg-[#f2f4f5] group-hover:bg-[#e6e9ea] transition-colors overflow-hidden">
                <CatImage cat={cat} />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-[#241242] text-center leading-tight group-hover:text-[#7c3aed] transition-colors px-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          ADS FEED
      ══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-8 pb-10">

        <div className="flex items-center gap-4 mb-5">
          <h2 className="text-base font-black text-[#241242] whitespace-nowrap">Fresh Recommendations</h2>
          <div className="flex-1 h-px bg-gray-200" />
          <Link to="/search" className="text-sm font-bold text-[#241242] hover:underline shrink-0">View all →</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 animate-pulse overflow-hidden">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {ads.map(ad => <AdCard key={ad.id} ad={ad} />)}
          </div>
        )}
      </div>

    </div>
  )
}
