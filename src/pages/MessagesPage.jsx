import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const ago = (d) => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000)
  if (s < 3600)   return `${Math.floor(s / 60)}m ago`
  if (s < 86400)  return `${Math.floor(s / 3600)}h ago`
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`
  return new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })
}

export default function MessagesPage() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const [convs, setConvs]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    let cancelled = false
    api.get('/messages/').then(({ data }) => {
      if (!cancelled) setConvs(data.results || data)
    }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [user])

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
      {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-white rounded-xl border animate-pulse" />)}
    </div>
  )

  return (
    <div className="bg-[#f2f4f5] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-7">
        <h1 className="text-xl font-black text-[#241242] mb-5">Messages</h1>

        {convs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
            <p className="text-5xl mb-3">💬</p>
            <p className="font-black text-[#241242] text-lg mb-1">No messages yet</p>
            <p className="text-sm text-gray-400">Start a conversation by clicking "Chat with Seller" on any ad.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {convs.map(conv => (
              <Link key={conv.id} to={`/messages/${conv.id}`}
                className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm p-4 transition">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {conv.ad_cover
                    ? <img src={conv.ad_cover} alt={conv.ad_title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">📷</div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#241242] truncate">{conv.ad_title}</p>
                    {conv.last_message && (
                      <span className="text-xs text-gray-400 shrink-0 ml-2">{ago(conv.last_message.created_at)}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">with <strong>{conv.other_user?.username}</strong></p>
                  {conv.last_message && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{conv.last_message.body}</p>
                  )}
                </div>
                {conv.unread_count > 0 && (
                  <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shrink-0">
                    {conv.unread_count}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
