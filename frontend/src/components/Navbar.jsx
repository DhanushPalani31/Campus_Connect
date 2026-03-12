import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { LayoutDashboard, CalendarDays, Settings, LogOut, Menu, X, Compass } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const [dropdown, setDropdown] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [solid, setSolid] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 30)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setDropdown(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const doLogout = async () => {
    await logout(); toast.success('Logged out'); nav('/'); setDropdown(false)
  }

  const dashPath = user?.role === 'alumni' ? '/dashboard/alumni' : '/dashboard/student'
  const profPath = user?.role === 'alumni' ? '/profile/alumni' : '/profile/student'
  const initial = user?.name?.[0]?.toUpperCase() || '?'

  return (
    <>
      <nav className={`nav${solid ? ' solid' : ''}`}>
        <div className="container nav-inner">

          {/* Logo */}
          <Link to="/" className="nav-logo">
            <motion.div
              className="nav-logo-mark"
              whileHover={{ rotate: 15, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" fill="#0A0A10" strokeWidth="0"/>
              </svg>
            </motion.div>
            AlumniBridge
          </Link>

          {/* Desktop nav */}
          <ul className="nav-links hide-mob">
            <li><NavLink to="/explore" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Explore</NavLink></li>
            {user && <>
              <li><NavLink to={dashPath} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Dashboard</NavLink></li>
              <li><NavLink to="/sessions/my" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Sessions</NavLink></li>
            </>}
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            {user ? (
              <div style={{ position: 'relative' }} ref={ref}>
                <motion.button className="av-btn" onClick={() => setDropdown(v => !v)} whileTap={{ scale: 0.9 }}>
                  {user.profilePhoto
                    ? <img src={user.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                    : initial
                  }
                </motion.button>
                <AnimatePresence>
                  {dropdown && (
                    <motion.div
                      className="av-dropdown"
                      initial={{ opacity: 0, scale: 0.92, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: -6 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div style={{ padding: '0.5rem 0.8rem 0.8rem', borderBottom: '1px solid var(--b-subtle)', marginBottom: '0.3rem' }}>
                        <div style={{ fontFamily: 'var(--f-body)', fontWeight: 600, fontSize: '0.88rem', color: 'var(--t-primary)' }}>{user.name}</div>
                        <div className="label-dim" style={{ fontSize: '0.58rem', marginTop: 2 }}>{user.role}</div>
                      </div>
                      <Link to={dashPath} className="av-item" onClick={() => setDropdown(false)}><LayoutDashboard size={13} /> Dashboard</Link>
                      <Link to="/sessions/my" className="av-item" onClick={() => setDropdown(false)}><CalendarDays size={13} /> Sessions</Link>
                      <Link to={profPath} className="av-item" onClick={() => setDropdown(false)}><Settings size={13} /> Settings</Link>
                      <div style={{ height: 1, background: 'var(--b-subtle)', margin: '0.3rem 0' }} />
                      <button className="av-item danger" onClick={doLogout}><LogOut size={13} /> Sign out</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm hide-mob">Sign in</Link>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/register" className="btn btn-volt btn-sm">Get Started</Link>
                </motion.div>
              </>
            )}
            <motion.button
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t-secondary)', display: 'none', padding: '0.3rem' }}
              id="mob-toggle"
              onClick={() => setMobile(v => !v)}
              whileTap={{ scale: 0.9 }}
            >
              {mobile ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', top: 'var(--nav-h)', left: 0, right: 0, zIndex: 800, background: 'rgba(11,11,16,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--b-subtle)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}
          >
            <Link to="/explore" className="nav-link" onClick={() => setMobile(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Compass size={15} /> Explore</Link>
            {user ? <>
              <Link to={dashPath} className="nav-link" onClick={() => setMobile(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><LayoutDashboard size={15} /> Dashboard</Link>
              <Link to="/sessions/my" className="nav-link" onClick={() => setMobile(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><CalendarDays size={15} /> Sessions</Link>
              <div style={{ height: 1, background: 'var(--b-subtle)', margin: '0.3rem 0' }} />
              <button onClick={() => { doLogout(); setMobile(false) }} className="btn btn-ghost" style={{ justifyContent: 'flex-start', gap: '0.6rem' }}><LogOut size={15} /> Sign out</button>
            </> : <>
              <Link to="/login" className="btn btn-outline" onClick={() => setMobile(false)}>Sign in</Link>
              <Link to="/register" className="btn btn-volt" onClick={() => setMobile(false)}>Get Started</Link>
            </>}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@media (max-width: 768px) { #mob-toggle { display: flex !important; } }`}</style>
    </>
  )
}
