import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#002f34] text-white/60 text-sm mt-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">

        <div>
          <div className="bg-white inline-block border-b-[3px] border-[#3a77ff] px-3 py-1.5 rounded-sm mb-3">
            <span className="text-[#002f34] font-black text-xl tracking-tight italic">OLX</span>
          </div>
          <p className="text-xs leading-relaxed text-white/50">
            Pakistan's No.1 online marketplace.<br />Buy and sell anything, for free.
          </p>
        </div>

        <div>
          <p className="text-white font-bold mb-3 text-xs uppercase tracking-widest">Categories</p>
          <ul className="space-y-2 text-xs">
            {['Mobiles', 'Cars', 'Property', 'Electronics', 'Fashion', 'Jobs'].map(c => (
              <li key={c}>
                <Link to={`/search?category=${c.toLowerCase()}`} className="hover:text-white transition">{c}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-white font-bold mb-3 text-xs uppercase tracking-widest">Links</p>
          <ul className="space-y-2 text-xs">
            <li><Link to="/"         className="hover:text-white transition">Home</Link></li>
            <li><Link to="/my-ads"   className="hover:text-white transition">My Ads</Link></li>
            <li><Link to="/profile"  className="hover:text-white transition">Profile</Link></li>
            <li><Link to="/login"    className="hover:text-white transition">Login</Link></li>
            <li><Link to="/signup"   className="hover:text-white transition">Register</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-white font-bold mb-3 text-xs uppercase tracking-widest">Contact</p>
          <ul className="space-y-2 text-xs">
            <li>support@olx.pk</li>
            <li>0800-00786</li>
            <li>Karachi, Pakistan</li>
          </ul>
          <div className="flex gap-3 mt-4">
            {['f', 't', 'in'].map(s => (
              <div key={s} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/60 hover:bg-white/20 cursor-pointer transition">
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/30">
        © {new Date().getFullYear()} OLX Clone — All rights reserved.
      </div>
    </footer>
  )
}
