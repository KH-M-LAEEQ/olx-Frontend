import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../services/api'
import AdCard from '../components/AdCard'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const [ads, setAds]               = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [total, setTotal]           = useState(0)
  const [page, setPage]             = useState(1)

  const [filters, setFilters] = useState({
    q:         searchParams.get('q')        || '',
    category:  searchParams.get('category') || '',
    location:  '',
    min_price: '',
    max_price: '',
    ordering:  '-created_at',
  })

  useEffect(() => {
    api.get('/categories/').then(r => setCategories(r.data.results || r.data))
  }, [])

  const fetchAds = useCallback(() => {
    setLoading(true)
    const p = new URLSearchParams()
    if (filters.q)         p.set('search', filters.q)
    if (filters.category)  p.set('category', filters.category)
    if (filters.location)  p.set('location', filters.location)
    if (filters.min_price) p.set('min_price', filters.min_price)
    if (filters.max_price) p.set('max_price', filters.max_price)
    p.set('ordering', filters.ordering)
    p.set('page', page)
    api.get(`/ads/?${p.toString()}`).then(({ data }) => {
      setAds(data.results || data)
      setTotal(data.count || (data.results || data).length)
    }).finally(() => setLoading(false))
  }, [filters, page])

  useEffect(() => { fetchAds() }, [fetchAds])

  const set = (k, v) => { setFilters(f => ({ ...f, [k]: v })); setPage(1) }
  const reset = () => {
    setFilters({ q: '', category: '', location: '', min_price: '', max_price: '', ordering: '-created_at' })
    setPage(1)
  }

  const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#241242] bg-white'

  return (
    <div className="bg-[#f2f4f5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-5">
        <div className="flex gap-5">

          {/* ── Sidebar ── */}
          <aside className="hidden md:block w-60 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-sm font-black text-[#241242]">Filters</span>
                <button onClick={reset} className="text-xs text-[#7c3aed] hover:underline font-semibold">Clear all</button>
              </div>
              <div className="p-4 space-y-5">

                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category</p>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="cat" checked={!filters.category} onChange={() => set('category', '')}
                        className="accent-[#241242]" />
                      <span className={!filters.category ? 'text-[#241242] font-bold' : 'text-gray-600'}>All Categories</span>
                    </label>
                    {categories.map(c => (
                      <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="cat" checked={filters.category === c.slug}
                          onChange={() => set('category', c.slug)} className="accent-[#241242]" />
                        <span className={filters.category === c.slug ? 'text-[#241242] font-bold' : 'text-gray-600'}>
                          {c.icon} {c.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Price (PKR)</p>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={filters.min_price}
                      onChange={e => set('min_price', e.target.value)} className={inp} />
                    <input type="number" placeholder="Max" value={filters.max_price}
                      onChange={e => set('max_price', e.target.value)} className={inp} />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Location</p>
                  <input type="text" placeholder="City or area" value={filters.location}
                    onChange={e => set('location', e.target.value)} className={inp} />
                </div>
              </div>
            </div>
          </aside>

          {/* ── Results ── */}
          <div className="flex-1 min-w-0">

            {/* Top bar */}
            <div className="flex items-center gap-3 mb-4">
              <form onSubmit={e => { e.preventDefault(); fetchAds() }}
                className="flex flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#241242] transition">
                <input type="text" value={filters.q} onChange={e => set('q', e.target.value)}
                  placeholder="Search ads..."
                  className="flex-1 px-4 py-2.5 text-sm focus:outline-none" />
                <button type="submit" className="bg-[#241242] hover:bg-[#1a0a33] px-5 flex items-center transition">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                </button>
              </form>
              <select value={filters.ordering} onChange={e => set('ordering', e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none shrink-0 font-semibold text-[#241242]">
                <option value="-created_at">Newest first</option>
                <option value="created_at">Oldest first</option>
                <option value="price">Price ↑</option>
                <option value="-price">Price ↓</option>
              </select>
            </div>

            {!loading && (
              <p className="text-xs text-gray-500 mb-3">
                <span className="font-bold text-[#241242]">{total.toLocaleString()}</span> results
                {filters.q && <> for "<em>{filters.q}</em>"</>}
              </p>
            )}

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 animate-pulse overflow-hidden">
                    <div className="aspect-[4/3] bg-gray-200" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : ads.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-black text-[#241242] text-lg">No results found</p>
                <p className="text-sm text-gray-400 mt-1">Try different keywords or remove filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {ads.map(ad => <AdCard key={ad.id} ad={ad} />)}
                </div>
                <div className="flex justify-center gap-2 mt-6">
                  {page > 1 && (
                    <button onClick={() => setPage(p => p - 1)}
                      className="px-5 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-[#241242] hover:border-[#241242] transition">
                      ← Previous
                    </button>
                  )}
                  {ads.length === 20 && (
                    <button onClick={() => setPage(p => p + 1)}
                      className="px-5 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-[#241242] hover:border-[#241242] transition">
                      Next →
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
