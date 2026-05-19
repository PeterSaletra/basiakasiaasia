import {useEffect} from 'react'
import {BrowserRouter, Routes, Route, Navigate, Outlet, useLocation} from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import AboutPage from '@/pages/AboutPage'
import ForumPage from '@/pages/ForumPage'
import ForumThreadPage from '@/pages/ForumThreadPage'
import ThreadDetailPage from '@/pages/ThreadDetailPage'
import ProfilePage from '@/pages/ProfilePage'
import AdminPanelPage from './pages/AdminPanelPage'
import { logPageView } from '@/services/analytics'

const ProtectedRoute = () => {
  const auth = useAuth()

  if (auth.loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}

const AdminRoute = () => {
  const auth = useAuth()

  if (auth.loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (auth.role !== "admin") {
    return <Navigate to="/" />
  }

  return <Outlet />
}

const ScreenTracker = () => {
  const location = useLocation()
  useEffect(() => {
    const title = location.pathname === "/" ? "Home"
      : location.pathname === "/login" ? "Login"
      : location.pathname === "/register" ? "Sign Up"
      : location.pathname === "/about" ? "About"
      : location.pathname === "/forum" ? "Forum"
      : location.pathname.startsWith("/forum/") ? "Forum Detail"
      : location.pathname === "/profile" ? "Profile"
      : location.pathname === "/admin" ? "Admin"
      : "Other"
    document.title = `${title} | BasiaKasiaAsia`
    logPageView(document.title, location.pathname)
  }, [location])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScreenTracker />
      <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/forum/:id" element={<ForumThreadPage />} />
            <Route path="/forum/:id/thread/:threadId" element={<ThreadDetailPage />} />
            <Route path="/profile" element={<ProtectedRoute />} >
              <Route path="" element={<ProfilePage />} />
            </Route>
            <Route path="/admin" element={<AdminRoute />} >
              <Route path="" element={<AdminPanelPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
    </BrowserRouter>
  )
}

export default App
