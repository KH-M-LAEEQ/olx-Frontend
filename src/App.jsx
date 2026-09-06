import { Routes, Route, Link } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'
import HomePage     from './pages/HomePage'
import LoginPage    from './pages/LoginPage'
import SignupPage   from './pages/SignupPage'
import AdDetailPage from './pages/AdDetailPage'
import PostAdPage   from './pages/PostAdPage'
import MyAdsPage    from './pages/MyAdsPage'
import ProfilePage  from './pages/ProfilePage'
import SearchPage   from './pages/SearchPage'
import ContactPage  from './pages/ContactPage'
import FavouritesPage    from './pages/FavouritesPage'
import MessagesPage      from './pages/MessagesPage'
import ConversationPage  from './pages/ConversationPage'
import VerifyEmailPage   from './pages/VerifyEmailPage'

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-7xl mb-4">😕</p>
      <h1 className="text-3xl font-black text-[#241242] mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="bg-[#ff5c8a] text-[#241242] font-black px-6 py-3 rounded-xl hover:bg-pink-400 transition">
        Go Home
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index          element={<HomePage />} />
          <Route path="login"   element={<LoginPage />} />
          <Route path="signup"  element={<SignupPage />} />
          <Route path="ads/:id"        element={<AdDetailPage />} />
          <Route path="ads/:id/edit"   element={<PostAdPage />} />
          <Route path="post-ad"        element={<PostAdPage />} />
          <Route path="my-ads"         element={<MyAdsPage />} />
          <Route path="profile"        element={<ProfilePage />} />
          <Route path="search"         element={<SearchPage />} />
          <Route path="contact"        element={<ContactPage />} />
          <Route path="favourites"         element={<FavouritesPage />} />
          <Route path="messages"           element={<MessagesPage />} />
          <Route path="messages/:id"       element={<ConversationPage />} />
          <Route path="verify-email"       element={<VerifyEmailPage />} />
          <Route path="*"              element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
