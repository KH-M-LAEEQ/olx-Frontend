import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const INFO_CARDS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Email Us',
    value: 'support@olx.pk',
    sub: 'We reply within 24 hours',
    href: 'mailto:support@olx.pk',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: 'Call Us',
    value: '0800-00786',
    sub: 'Mon – Fri, 9 AM – 6 PM PKT',
    href: 'tel:080000786',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Visit Us',
    value: 'Karachi, Pakistan',
    sub: 'Head Office, I.I. Chundrigar Road',
    href: null,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    label: 'Live Chat',
    value: 'Chat with Support',
    sub: 'Available during business hours',
    href: null,
  },
]

const FAQS = [
  {
    q: 'How do I post an ad for free?',
    a: 'Click "Post Ad" in the top navigation, fill in the details about your item, add photos, and publish. It\'s completely free.',
  },
  {
    q: 'My account was suspended. What should I do?',
    a: 'Send us an email at support@olx.pk with your username and we\'ll review your account within 2 business days.',
  },
  {
    q: 'How do I report a fraudulent listing?',
    a: 'Open the ad and click "Report Ad". Our safety team reviews all reports within 24 hours.',
  },
  {
    q: 'Can I edit or delete my ad after posting?',
    a: 'Yes. Go to "My Ads" from the navigation menu to edit, deactivate, or delete any of your listings.',
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null) // 'success' | 'error' | null
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name is required.'
    if (!form.email.trim())   e.email   = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.'
    if (!form.subject.trim()) e.subject = 'Subject is required.'
    if (!form.message.trim()) e.message = 'Message is required.'
    else if (form.message.trim().length < 20) e.message = 'Message must be at least 20 characters.'
    return e
  }

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: undefined }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setLoading(true)
    setStatus(null)
    try {
      await api.post('/auth/contact/', form)
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      const d = err.response?.data
      if (d && typeof d === 'object') setErrors(d)
      else setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#f2f4f5] min-h-screen">

      {/* ── Hero ── */}
      <div className="bg-[#002f34] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#ffce32] text-xs font-black uppercase tracking-[0.2em] mb-3">Support Center</p>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            How can we help you?
          </h1>
          <p className="text-white/50 text-base max-w-xl mx-auto">
            Our support team is here for you — reach out via the form, email, phone, or live chat.
          </p>
        </div>
      </div>

      {/* ── Info Cards ── */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INFO_CARDS.map(card => (
            <div
              key={card.label}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#002f34]/5 flex items-center justify-center text-[#002f34] group-hover:bg-[#002f34] group-hover:text-white transition">
                {card.icon}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{card.label}</p>
                {card.href ? (
                  <a href={card.href} className="text-[#002f34] font-bold text-sm hover:text-[#3a77ff] transition">{card.value}</a>
                ) : (
                  <p className="text-[#002f34] font-bold text-sm">{card.value}</p>
                )}
                <p className="text-gray-400 text-xs mt-0.5">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Form + Side Panel ── */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-black text-[#002f34] mb-1">Send us a message</h2>
            <p className="text-gray-400 text-sm mb-7">Fill in the form below and we'll get back to you within 24 hours.</p>

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-2xl mb-6">
                Something went wrong. Please try again.
              </div>
            )}

            {status === 'success' && (
              <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-4 rounded-2xl mb-6">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-bold">Message sent successfully!</p>
                  <p className="text-green-600 text-xs mt-0.5">We'll get back to you at your provided email within 24 hours.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Full Name" name="name" type="text" placeholder="e.g. Ahmed Khan"
                  value={form.name} onChange={handleChange} error={errors.name} />
                <Field label="Email Address" name="email" type="email" placeholder="you@example.com"
                  value={form.email} onChange={handleChange} error={errors.email} />
              </div>
              <Field label="Subject" name="subject" type="text" placeholder="What is your inquiry about?"
                value={form.subject} onChange={handleChange} error={errors.subject} />
              <div>
                <label className="block text-xs font-black text-[#002f34] uppercase tracking-widest mb-1.5">
                  Message
                </label>
                <textarea
                  name="message" rows={5} value={form.message} onChange={handleChange}
                  placeholder="Describe your issue or question in detail..."
                  className={`w-full border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none transition
                    ${errors.message
                      ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-200 focus:border-[#3a77ff] focus:ring-2 focus:ring-[#3a77ff]/10 bg-white'}`}
                />
                {errors.message && <FieldError msg={errors.message} />}
                <p className="text-xs text-gray-400 mt-1 text-right">{form.message.length} / 1000</p>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full bg-[#002f34] hover:bg-[#013a40] active:scale-[0.98] text-white font-black py-3.5 rounded-xl text-sm transition disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Side panel */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Trust badges */}
            <div className="bg-[#002f34] rounded-3xl p-7 text-white">
              <h3 className="font-black text-lg mb-5">Why reach out to us?</h3>
              <ul className="space-y-4">
                {[
                  { icon: '⚡', title: 'Fast responses', desc: 'Most inquiries answered within a few hours' },
                  { icon: '🔒', title: 'Safe & secure', desc: 'Your data is never shared with third parties' },
                  { icon: '🌍', title: 'Pakistan-wide support', desc: 'Support available across all major cities' },
                  { icon: '🛠️', title: 'Expert team', desc: 'Dedicated specialists for every type of issue' },
                ].map(({ icon, title, desc }) => (
                  <li key={title} className="flex items-start gap-3">
                    <span className="text-xl leading-none mt-0.5">{icon}</span>
                    <div>
                      <p className="font-bold text-sm">{title}</p>
                      <p className="text-white/50 text-xs mt-0.5">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
              <h3 className="font-black text-[#002f34] text-base mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { label: 'Browse all categories', to: '/' },
                  { label: 'Post a free ad', to: '/post-ad' },
                  { label: 'Manage my ads', to: '/my-ads' },
                  { label: 'Edit my profile', to: '/profile' },
                ].map(({ label, to }) => (
                  <li key={to}>
                    <Link to={to} className="flex items-center justify-between text-sm text-gray-600 hover:text-[#3a77ff] font-medium py-1.5 border-b border-gray-50 last:border-0 transition group">
                      {label}
                      <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="max-w-3xl mx-auto px-4 lg:px-8 pb-16">
        <div className="text-center mb-8">
          <p className="text-[#3a77ff] text-xs font-black uppercase tracking-[0.2em] mb-2">FAQs</p>
          <h2 className="text-2xl font-black text-[#002f34]">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left focus:outline-none group"
              >
                <span className="font-bold text-sm text-[#002f34] group-hover:text-[#3a77ff] transition">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 shrink-0 ml-4 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-400 mt-8">
          Still have questions?{' '}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[#3a77ff] font-bold hover:underline"
          >
            Send us a message ↑
          </button>
        </p>
      </div>

    </div>
  )
}

function Field({ label, name, type, placeholder, value, onChange, error }) {
  return (
    <div>
      <label className="block text-xs font-black text-[#002f34] uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} autoComplete="off"
        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition
          ${error
            ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-200'
            : 'border-gray-200 focus:border-[#3a77ff] focus:ring-2 focus:ring-[#3a77ff]/10 bg-white'}`}
      />
      {error && <FieldError msg={error} />}
    </div>
  )
}

function FieldError({ msg }) {
  return (
    <p className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5 font-medium">
      <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {msg}
    </p>
  )
}
