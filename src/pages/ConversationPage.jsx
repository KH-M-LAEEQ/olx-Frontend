import { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const WS_BASE = import.meta.env.VITE_WS_URL || 'ws://127.0.0.1:8000'

const ago = (d) => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000)
  if (s < 60)    return 'just now'
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function ConversationPage() {
  const { id }   = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [conv, setConv]           = useState(null)
  const [body, setBody]           = useState('')
  const [sending, setSending]     = useState(false)
  const [loading, setLoading]     = useState(true)
  const [sendError, setSendError] = useState('')
  const [wsReady, setWsReady]     = useState(false)
  const bottomRef = useRef(null)
  const wsRef     = useRef(null)

  const scrollToBottom = () =>
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)

  // Initial load via REST (gets history + marks messages as read)
  useEffect(() => {
    if (!user) { navigate('/login'); return }
    api.get(`/messages/${id}/`)
      .then(({ data }) => { setConv(data); scrollToBottom() })
      .finally(() => setLoading(false))
  }, [id, user])

  // WebSocket connection — replaces the 10s polling
  useEffect(() => {
    if (!user) return
    const token = localStorage.getItem('access')
    if (!token) return

    const ws = new WebSocket(`${WS_BASE}/ws/messages/${id}/?token=${token}`)
    wsRef.current = ws

    ws.onopen  = () => setWsReady(true)
    ws.onclose = () => setWsReady(false)
    ws.onerror = () => setWsReady(false)

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data)
      // sender_id lets each client work out is_mine independently
      const enriched = { ...msg, is_mine: msg.sender_id === user.id }
      setConv(prev => {
        if (!prev) return prev
        if (prev.messages?.some(m => m.id === enriched.id)) return prev
        return { ...prev, messages: [...(prev.messages || []), enriched] }
      })
      scrollToBottom()
    }

    return () => { ws.close(); wsRef.current = null }
  }, [id, user])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!body.trim()) return
    setSendError('')
    setSending(true)

    const ws = wsRef.current
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ body }))
      setBody('')
      setSending(false)
    } else {
      // Fallback: REST API if WebSocket not connected
      try {
        await api.post(`/messages/${id}/reply/`, { body })
        const { data } = await api.get(`/messages/${id}/`)
        setConv(data)
        setBody('')
        scrollToBottom()
      } catch {
        setSendError('Failed to send. Please try again.')
      } finally {
        setSending(false)
      }
    }
  }

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
      {[...Array(4)].map((_, i) => <div key={i} className={`h-12 bg-gray-200 rounded-2xl animate-pulse ${i % 2 ? 'ml-16' : 'mr-16'}`} />)}
    </div>
  )

  if (!conv) return null

  return (
    <div className="bg-[#f2f4f5] min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/messages')} className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {conv.ad_cover && (
            <img src={conv.ad_cover} alt={conv.ad_title} className="w-9 h-9 rounded-lg object-cover border border-gray-200" />
          )}
          <div className="flex-1 min-w-0">
            <Link to={`/ads/${conv.ad_id}`} className="text-sm font-bold text-[#002f34] hover:underline truncate block">
              {conv.ad_title}
            </Link>
            <p className="text-xs text-gray-400">with {conv.other_user?.username}</p>
          </div>
          <span className={`w-2 h-2 rounded-full ${wsReady ? 'bg-green-400' : 'bg-gray-300'}`} title={wsReady ? 'Live' : 'Connecting...'} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 space-y-3 pb-24">
        {conv.messages?.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">No messages yet. Say hello!</p>
        )}
        {conv.messages?.map(msg => (
          <div key={msg.id} className={`flex ${msg.is_mine ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${msg.is_mine ? 'bg-[#002f34] text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'}`}>
              <p className="text-sm leading-relaxed">{msg.body}</p>
              <p className={`text-[10px] mt-1 ${msg.is_mine ? 'text-white/50 text-right' : 'text-gray-400'}`}>{ago(msg.created_at)}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Reply box */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        {sendError && <p className="text-red-500 text-xs px-4 pb-1">{sendError}</p>}
        <form onSubmit={handleSend} className="max-w-2xl mx-auto px-4 py-3 flex gap-2">
          <input
            type="text" value={body} onChange={e => setBody(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#002f34] bg-white transition" />
          <button type="submit" disabled={sending || !body.trim()}
            className="bg-[#002f34] hover:bg-[#013a40] disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition">
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
