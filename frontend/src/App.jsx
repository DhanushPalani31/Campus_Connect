import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
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
              background: 'var(--ink-3)',
              color: 'var(--t-primary)',
              border: '1px solid var(--b-mid)',
              fontFamily: 'var(--f-body)',
              fontSize: '0.85rem',
              borderRadius: '12px',
              boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            },
            success: { iconTheme: { primary: '#B8FF57', secondary: '#0A0A10' } },
            error: { iconTheme: { primary: '#FB7185', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  )
}
