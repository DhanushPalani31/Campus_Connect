import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'

import LandingPage from './pages/LandingPage'
import { LoginPage, RegisterPage } from './pages/AuthPages'
import { ExplorePage, AlumniDetailPage } from './pages/BrowsePages'
import BookSessionPage from './pages/BookSessionPage'
import { StudentDashboard, AlumniDashboard, MySessionsPage } from './pages/DashboardPages'
import { AlumniProfileSettings, StudentProfileSettings } from './pages/ProfilePages'

function Guard({ children, roles }) {
  const { user, ready } = useAuth()
  if (!ready) return null
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/alumni/:id" element={<AlumniDetailPage />} />
        <Route path="/book/:id" element={<Guard roles={['student']}><BookSessionPage /></Guard>} />
        <Route path="/dashboard/student" element={<Guard roles={['student']}><StudentDashboard /></Guard>} />
        <Route path="/dashboard/alumni" element={<Guard roles={['alumni']}><AlumniDashboard /></Guard>} />
        <Route path="/sessions/my" element={<Guard><MySessionsPage /></Guard>} />
        <Route path="/profile/alumni" element={<Guard roles={['alumni']}><AlumniProfileSettings /></Guard>} />
        <Route path="/profile/student" element={<Guard roles={['student']}><StudentProfileSettings /></Guard>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#0D0D0D',
              border: '1px solid #EDE8DF',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: '0.86rem',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(13,13,13,0.1)',
            },
            success: { iconTheme: { primary: '#E85D4A', secondary: '#FFFFFF' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  )
}
