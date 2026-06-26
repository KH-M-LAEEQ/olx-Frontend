import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function MainLayout() {
  const { user } = useAuth()
  return (
    <div className="w-full min-h-screen flex flex-col bg-[#f2f4f5]">
      <Navbar />
      {user && !user.is_email_verified && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <p className="text-xs font-semibold text-yellow-800">
              📧 Please verify your email address to unlock all features.
            </p>
            <a href="/verify-email" className="text-xs font-black text-yellow-800 underline hover:no-underline shrink-0">
              Verify now →
            </a>
          </div>
        </div>
      )}
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
