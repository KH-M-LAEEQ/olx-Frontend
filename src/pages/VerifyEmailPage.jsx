import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function VerifyEmailPage() {
  const { user, refreshUser } = useAuth()
  const [digits, setDigits]     = useState(['', '', '', '', '', ''])
  const [loading, setLoading]   = useState(false)
  const [resending, setResending] = useState(false)
  const [msg, setMsg]           = useState('')
  const [err, setErr]           = useState('')
  const [devOtp, setDevOtp]     = useState('')
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()]

  const handleDigit = (i, val) => {
    const v = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = v
    setDigits(next)
    setErr('')
    if (v && i < 5) refs[i + 1].current?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs[i - 1].current?.focus()
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setDigits(pasted.split(''))
      refs[5].current?.focus()
    }
    e.preventDefault()
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    const otp = digits.join('')
    if (otp.length < 6) { setErr('Enter all 6 digits.'); return }
    setErr('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/verify-email/', { otp })
      setMsg(data.detail)
      await refreshUser()
    } catch (error) {
      setErr(error.response?.data?.detail || 'Incorrect OTP.')
      setDigits(['', '', '', '', '', ''])
      refs[0].current?.focus()
    } finally { setLoading(false) }
  }

  const handleResend = async () => {
    setResending(true)
    setDevOtp('')
    setMsg('')
    setErr('')
    try {
      const { data } = await api.post('/auth/send-verification/')
      setDevOtp(data.otp || '')
      setMsg('New OTP generated.')
      setDigits(['', '', '', '', '', ''])
      refs[0].current?.focus()
    } catch (error) {
      setErr(error.response?.data?.detail || 'Error generating OTP.')
    } finally { setResending(false) }
  }

  if (user?.is_email_verified) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-sm w-full text-center shadow-sm">
          <p className="text-5xl mb-3">✅</p>
          <h1 className="text-xl font-black text-[#241242] mb-2">Email Verified</h1>
          <p className="text-sm text-gray-500 mb-6">Your email address has been verified.</p>
          <Link to="/" className="bg-[#ff5c8a] hover:bg-pink-400 text-[#241242] font-black px-6 py-3 rounded-xl text-sm inline-block transition">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 bg-[#f2f4f5]">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-sm w-full shadow-sm">

        <div className="text-center mb-6">
          <p className="text-4xl mb-3">📧</p>
          <h1 className="text-xl font-black text-[#241242] mb-1">Verify Your Email</h1>
          <p className="text-sm text-gray-500">
            Enter the 6-digit OTP sent to your email.
            <br />
            <span className="text-xs text-gray-400">OTP expires in 24 hours.</span>
          </p>
        </div>

        {msg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-4 text-center">
            {msg}
          </div>
        )}
        {err && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 text-center">
            {err}
          </div>
        )}

        {/* Dev mode OTP display */}
        {devOtp && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-4 py-3 mb-5 text-center">
            <p className="text-xs font-bold text-yellow-700 mb-1 uppercase tracking-wide">Your OTP (dev mode)</p>
            <p className="text-2xl font-black text-yellow-900 tracking-[0.3em]">{devOtp}</p>
          </div>
        )}

        <form onSubmit={handleVerify}>
          {/* 6-box OTP input */}
          <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={refs[i]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleDigit(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className={`w-11 h-14 text-center text-xl font-black border-2 rounded-xl focus:outline-none transition
                  ${d ? 'border-[#241242] bg-[#241242]/5 text-[#241242]' : 'border-gray-200 text-gray-800'}
                  focus:border-[#241242]`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || digits.join('').length < 6}
            className="w-full bg-[#241242] hover:bg-[#1a0a33] text-white font-black py-3 rounded-xl text-sm transition disabled:opacity-40">
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 mb-2">Didn't receive the OTP?</p>
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-sm text-[#7c3aed] hover:underline font-bold disabled:opacity-50">
            {resending ? 'Sending...' : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  )
}
