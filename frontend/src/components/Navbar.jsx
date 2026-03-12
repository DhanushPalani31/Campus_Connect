import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { LayoutDashboard, CalendarDays, Settings, LogOut, Menu, X, Compass, ChevronRight } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const [dd, setDd] = useState(false)
  const [mob, setMob] = useState(false)
  const [solid, setSolid] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setDd(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const doLogout = async () => { await logout(); toast.success('Signed out'); nav('/'); setDd(false) }
  const dashPath = user?.role === 'alumni' ? '/dashboard/alumni' : '/dashboard/student'
  const profPath = user?.role === 'alumni' ? '/profile/alumni' : '/profile/student'
  const initial = user?.name?.[0]?.toUpperCase() || '?'

  return (
    <>
      <nav className={`nav${solid ? ' solid' : ''}`}>
        <div className="container nav-inner">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <span className="nav-logo-dot" />
            AlumniBridge
          </Link>

          {/* Links */}
          <ul className="nav-links hide-mob">
            <li><NavLink to="/explore" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Find Mentors</NavLink></li>
            {user && <>
              <li><NavLink to={dashPath} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Dashboard</NavLink></li>
              <li><NavLink to="/sessions/my" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Sessions</NavLink></li>
            </>}
          </ul>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {user ? (
              <div ref={ref} style={{ position: 'relative' }}>
                <motion.button
                  className="nav-av"
                  onClick={() => setDd(v => !v)}
                  whileTap={{ scale: 0.9 }}
                >
                  {user.profilePhoto
                    ? <img src={user.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                    : initial
                  }
                </motion.button>
                <AnimatePresence>
                  {dd && (
                    <motion.div
                      className="nav-dropdown"
                      initial={{ opacity: 0, scale: 0.95, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -6 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div style={{ padding: '0.5rem 0.85rem 0.75rem', borderBottom: '1px solid var(--sand)', marginBottom: '0.3rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--ink)' }}>{user.name}</div>
                        <div className="eyebrow" style={{ marginTop: 2 }}>{user.role}</div>
                      </div>
                      <Link to={dashPath} className="dd-item" onClick={() => setDd(false)}><LayoutDashboard size={14} /> Dashboard</Link>
                      <Link to="/sessions/my" className="dd-item" onClick={() => setDd(false)}><CalendarDays size={14} /> Sessions</Link>
                      <Link to={profPath} className="dd-item" onClick={() => setDd(false)}><Settings size={14} /> Settings</Link>
                      <div style={{ height: 1, background: 'var(--sand)', margin: '0.3rem 0.4rem' }} />
                      <button className="dd-item danger" onClick={doLogout}><LogOut size={14} /> Sign out</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-link hide-mob">Sign in</Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/register" className="nav-cta">Let's Talk <ChevronRight size={14} /></Link>
                </motion.div>
              </>
            )}
            <motion.button
              id="mob-btn"
              onClick={() => setMob(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-mid)', padding: '0.3rem', display: 'none' }}
              whileTap={{ scale: 0.9 }}
            >
              {mob ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile */}
      <AnimatePresence>
        {mob && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', top: 'var(--nav-h)', left: 0, right: 0, zIndex: 800, background: 'var(--white)', borderBottom: '1px solid var(--sand)', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}
          >
            <Link to="/explore" className="s-link" onClick={() => setMob(false)}><Compass size={15} /> Find Mentors</Link>
            {user ? <>
              <Link to={dashPath} className="s-link" onClick={() => setMob(false)}><LayoutDashboard size={15} /> Dashboard</Link>
              <Link to="/sessions/my" className="s-link" onClick={() => setMob(false)}><CalendarDays size={15} /> Sessions</Link>
              <div style={{ height: 1, background: 'var(--sand)', margin: '0.3rem 0' }} />
              <button onClick={() => { doLogout(); setMob(false) }} className="dd-item danger"><LogOut size={15} /> Sign out</button>
            </> : <>
              <Link to="/login" className="btn btn-ghost" onClick={() => setMob(false)}>Sign in</Link>
              <Link to="/register" className="btn btn-dark" onClick={() => setMob(false)}>Get Started</Link>
            </>}
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@media (max-width: 768px) { #mob-btn { display: flex !important; } }`}</style>
    </>
  )
}
