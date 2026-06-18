import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => { await logout(); window.location.href = '/' }

  return (
    <header className="bg-[#eff1f3] border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between" style={{ height: '64px' }}>

          {/* ── Left: Logo + Motors + Property ── */}
          <div className="flex items-center gap-6">

            {/* OLX Logo */}
            <Link to="/"
              className="shrink-0 flex items-center gap-2 bg-white rounded-2xl px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              {/* Proper OLX wordmark — O circle · L with base · X crossing */}
              <svg width="58" height="28" viewBox="0 0 96 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* O */}
                <circle cx="18" cy="22" r="15" stroke="#3a77ff" strokeWidth="6" fill="none" />
                {/* L — vertical stroke */}
                <rect x="41" y="6" width="6" height="32" rx="3" fill="#3a77ff" />
                {/* L — base stroke */}
                <rect x="41" y="32" width="15" height="6" rx="3" fill="#3a77ff" />
                {/* X */}
                <line x1="67" y1="6"  x2="94" y2="38" stroke="#3a77ff" strokeWidth="6.5" strokeLinecap="round" />
                <line x1="94" y1="6"  x2="67" y2="38" stroke="#3a77ff" strokeWidth="6.5" strokeLinecap="round" />
              </svg>
              <span className="hidden lg:block text-[10px] font-black text-gray-300 tracking-[0.2em] uppercase leading-tight border-l border-gray-200 pl-2">
                Pakistan's<br />No.1 Market
              </span>
            </Link>

            <Link to="/search?category=cars"
              className="hidden md:flex items-center gap-2 group shrink-0">
              <span className="text-xl leading-none">🚗</span>
              <span className="font-bold text-[#002f34] text-sm group-hover:text-[#3a77ff] transition">Motors</span>
            </Link>

            <Link to="/search?category=property-sale"
              className="hidden md:flex items-center gap-2 group shrink-0">
              <span className="text-xl leading-none">🏠</span>
              <span className="font-bold text-[#002f34] text-sm group-hover:text-[#3a77ff] transition">Property</span>
            </Link>
          </div>

          {/* ── Right: Auth + SELL ── */}
          <div className="flex items-center gap-5">

            {user ? (
              <>
                <Link to="/my-ads"
                  className="hidden md:block font-bold text-[#002f34] text-sm hover:text-[#3a77ff] transition">
                  My Ads
                </Link>
                <Link to="/profile"
                  className="hidden md:flex items-center gap-2 font-bold text-[#002f34] text-sm hover:text-[#3a77ff] transition">
                  <div className="w-7 h-7 rounded-full bg-[#002f34] flex items-center justify-center text-[#ffce32] text-xs font-black shrink-0">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.username}</span>
                </Link>
                <button onClick={handleLogout}
                  className="hidden md:block text-sm text-gray-400 hover:text-red-500 transition font-semibold">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login"
                className="hidden md:block font-bold text-[#002f34] text-sm underline underline-offset-4 hover:text-[#3a77ff] transition">
                Login
              </Link>
            )}

            {/* SELL — gradient border pill (wrapper technique, works with border-radius) */}
            <Link to="/post-ad"
              className="inline-flex rounded-full shrink-0"
              style={{
                padding: '2.5px',
                background: 'linear-gradient(90deg, #23e5db, #ffce32)',
              }}>
              <span className="flex items-center gap-1.5 bg-white rounded-full px-4 py-1.5 font-black text-[#002f34] text-sm whitespace-nowrap">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                SELL
              </span>
            </Link>

            {/* Mobile hamburger */}
            <button className="md:hidden p-1" onClick={() => setMenuOpen(o => !o)}>
              <svg className="w-6 h-6 text-[#002f34]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
          {user ? (
            <>
              <Link to="/my-ads"  className="block py-2.5 font-bold text-[#002f34] text-sm border-b border-gray-100" onClick={() => setMenuOpen(false)}>My Ads</Link>
              <Link to="/profile" className="block py-2.5 font-bold text-[#002f34] text-sm border-b border-gray-100" onClick={() => setMenuOpen(false)}>Profile — {user.username}</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="block w-full text-left py-2.5 font-bold text-red-500 text-sm">Logout</button>
            </>
          ) : (
            <div className="flex gap-3 pt-1 pb-1">
              <Link to="/login"  className="flex-1 text-center py-2.5 border-2 border-[#002f34] text-[#002f34] rounded-xl font-bold text-sm" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="flex-1 text-center py-2.5 bg-[#002f34] text-white rounded-xl font-bold text-sm"                   onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
