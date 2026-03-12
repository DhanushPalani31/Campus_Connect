import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { sessionApi } from '../api'
import { SessionCard, StatCard, Loader, Empty, ReviewModal, ConfirmMeetModal } from '../components'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Compass, CalendarDays, TrendingUp, Star, Settings, Clock, DollarSign, Users, LayoutDashboard } from 'lucide-react'
import { STAGGER, UP } from '../hooks/motion'

function Sidebar({ links }) {
  const { user } = useAuth()
  return (
    <aside className="sidebar">
      <div style={{ padding: '0 0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '0.85rem 1rem', background: 'var(--white)', border: '1px solid var(--sand)', borderRadius: 'var(--r-xl)', boxShadow: '0 2px 8px rgba(13,13,13,0.04)' }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)', marginBottom: '0.1rem' }}>{user?.name}</div>
          <div className="eyebrow" style={{ fontSize: '0.58rem' }}>{user?.role} · {user?.college || 'AlumniBridge'}</div>
        </div>
      </div>
      <div style={{ height: 1, background: 'var(--sand)', margin: '0 1rem 1rem' }} />
      {links.map(l => (
        <Link key={l.to} to={l.to}
          className={`s-link${window.location.pathname === l.to ? ' active' : ''}`}
        >{l.icon} {l.label}</Link>
      ))}
    </aside>
  )
}

// ── StudentDashboard ─────────────────────────────────────────────────
export function StudentDashboard() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [busy, setBusy] = useState(true)
  const [reviewTarget, setReviewTarget] = useState(null)

  useEffect(() => { load() }, [])
  const load = async () => {
    try { const d = await sessionApi.my({ limit: 100 }); setSessions(d.sessions || []) }
    catch { setSessions([]) } finally { setBusy(false) }
  }
  const recent = [...sessions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
  const completed = sessions.filter(s => s.status === 'completed')
  const upcoming = sessions.filter(s => s.status === 'confirmed' && new Date(s.scheduledAt) > new Date())
  const totalSpent = sessions.filter(s => s.paymentStatus === 'paid').reduce((a, s) => a + (s.amount || 0), 0)

  const submitReview = async data => {
    try { await sessionApi.review(reviewTarget._id, data); toast.success('Review submitted!'); setReviewTarget(null); load() }
    catch (e) { toast.error(e.message) }
  }

  const navLinks = [
    { icon: <LayoutDashboard size={15} />, label: 'Dashboard', to: '/dashboard/student' },
    { icon: <CalendarDays size={15} />, label: 'My Sessions', to: '/sessions/my' },
    { icon: <Compass size={15} />, label: 'Find Mentors', to: '/explore' },
    { icon: <Settings size={15} />, label: 'Settings', to: '/profile/student' },
  ]

  return (
    <div className="page">
      <div className="dash-layout">
        <Sidebar links={navLinks} />
        <main className="dash-main">
          <motion.div variants={STAGGER} initial="hidden" animate="show">
            <motion.div variants={UP} style={{ marginBottom: '2.5rem' }}>
              <div className="eyebrow" style={{ marginBottom: '0.6rem' }}>Dashboard</div>
              <h1 style={{ fontFamily: 'var(--f-display)', fontSize: '2.2rem', fontWeight: 400, letterSpacing: '-0.025em' }}>
                Hello, <span className="ital" style={{ color: 'var(--coral)' }}>{user?.name?.split(' ')[0]}</span><span className="dot">.</span>
              </h1>
            </motion.div>
            <motion.div variants={UP} className="g4" style={{ marginBottom: '2.5rem' }}>
              <StatCard label="Total Sessions" value={sessions.length} sub="All time" icon={<CalendarDays size={16} />} />
              <StatCard label="Completed" value={completed.length} sub="Done" icon={<Star size={16} />} />
              <StatCard label="Upcoming" value={upcoming.length} sub="Confirmed" icon={<Clock size={16} />} />
              <StatCard label="Total Spent" value={`₹${totalSpent}`} sub="INR" icon={<TrendingUp size={16} />} />
            </motion.div>
            <motion.div variants={UP}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontFamily: 'var(--f-display)', fontSize: '1.25rem', fontWeight: 400 }}>Recent Sessions</h2>
                <Link to="/sessions/my" className="btn-arrow btn-arrow-coral">View all <span style={{ fontSize: '0.8em' }}>→</span></Link>
              </div>
              {busy ? <Loader /> : sessions.length === 0 ? (
                <Empty icon="📅" title="No sessions yet" desc="Browse alumni and book your first session." action={<Link to="/explore" className="btn btn-dark btn-sm">Find Mentors</Link>} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <AnimatePresence>
                    {recent.map(s => (
                      <SessionCard key={s._id} session={s} userRole="student" onAction={sess => (
                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                          {sess.status === 'pending' && <motion.button className="btn btn-danger btn-xs" whileTap={{ scale: 0.96 }} onClick={async () => { try { await sessionApi.cancel(sess._id, {}); toast.success('Cancelled'); load() } catch(e) { toast.error(e.message) } }}>Cancel</motion.button>}
                          {sess.status === 'completed' && !sess.review?.rating && <motion.button className="btn btn-coral btn-xs" whileTap={{ scale: 0.96 }} onClick={() => setReviewTarget(sess)}>Leave Review</motion.button>}
                        </div>
                      )} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </motion.div>
        </main>
      </div>
      {reviewTarget && <ReviewModal session={reviewTarget} onClose={() => setReviewTarget(null)} onSubmit={submitReview} />}
    </div>
  )
}

// ── AlumniDashboard ─────────────────────────────────────────────────
export function AlumniDashboard() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [busy, setBusy] = useState(true)
  const [confirmTarget, setConfirmTarget] = useState(null)

  useEffect(() => { load() }, [])
  const load = async () => {
    try { const d = await sessionApi.my({ limit: 100 }); setSessions(d.sessions || []) }
    catch { setSessions([]) } finally { setBusy(false) }
  }

  const pending = sessions.filter(s => s.status === 'pending')
  const confirmed = sessions.filter(s => s.status === 'confirmed')
  const completed = sessions.filter(s => s.status === 'completed')
  const earnings = sessions.filter(s => s.paymentStatus === 'paid').reduce((a, s) => a + (s.amount || 0), 0)

  const confirmSess = async data => {
    try { await sessionApi.confirm(confirmTarget._id, data); toast.success('Session confirmed!'); setConfirmTarget(null); load() }
    catch (e) { toast.error(e.message) }
  }
  const cancel = async id => {
    if (!confirm('Cancel?')) return
    try { await sessionApi.cancel(id, {}); toast.success('Cancelled'); load() }
    catch (e) { toast.error(e.message) }
  }
  const complete = async id => {
    try { await sessionApi.complete(id); toast.success('Marked complete!'); load() }
    catch (e) { toast.error(e.message) }
  }

  const navLinks = [
    { icon: <LayoutDashboard size={15} />, label: 'Dashboard', to: '/dashboard/alumni' },
    { icon: <CalendarDays size={15} />, label: 'Sessions', to: '/sessions/my' },
    { icon: <Settings size={15} />, label: 'My Profile', to: '/profile/alumni' },
  ]

  return (
    <div className="page">
      <div className="dash-layout">
        <Sidebar links={navLinks} />
        <main className="dash-main">
          <motion.div variants={STAGGER} initial="hidden" animate="show">
            <motion.div variants={UP} style={{ marginBottom: '2.5rem' }}>
              <div className="eyebrow" style={{ marginBottom: '0.6rem' }}>Dashboard</div>
              <h1 style={{ fontFamily: 'var(--f-display)', fontSize: '2.2rem', fontWeight: 400, letterSpacing: '-0.025em' }}>
                Welcome, <span className="ital" style={{ color: 'var(--coral)' }}>{user?.name?.split(' ')[0]}</span><span className="dot">.</span>
              </h1>
            </motion.div>
            <motion.div variants={UP} className="g4" style={{ marginBottom: '2.5rem' }}>
              <StatCard label="Total Earnings" value={`₹${earnings}`} sub="Paid sessions" icon={<DollarSign size={16} />} />
              <StatCard label="Pending" value={pending.length} sub="Needs action" icon={<Clock size={16} />} />
              <StatCard label="Confirmed" value={confirmed.length} sub="Upcoming" icon={<CalendarDays size={16} />} />
              <StatCard label="Completed" value={completed.length} sub="All time" icon={<Users size={16} />} />
            </motion.div>

            {pending.length > 0 && (
              <motion.div variants={UP} style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.1rem' }}>
                  <h2 style={{ fontFamily: 'var(--f-display)', fontSize: '1.25rem', fontWeight: 400 }}>Pending Requests</h2>
                  <span className="badge badge-pending">{pending.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {pending.map(s => (
                    <SessionCard key={s._id} session={s} userRole="alumni" onAction={sess => (
                      <div style={{ display: 'flex', gap: '0.6rem' }}>
                        <motion.button className="btn btn-dark btn-xs" whileTap={{ scale: 0.96 }} onClick={() => setConfirmTarget(sess)}>Confirm</motion.button>
                        <motion.button className="btn btn-danger btn-xs" whileTap={{ scale: 0.96 }} onClick={() => cancel(sess._id)}>Decline</motion.button>
                      </div>
                    )} />
                  ))}
                </div>
              </motion.div>
            )}

            {confirmed.length > 0 && (
              <motion.div variants={UP}>
                <h2 style={{ fontFamily: 'var(--f-display)', fontSize: '1.25rem', fontWeight: 400, marginBottom: '1.1rem' }}>Upcoming Sessions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {confirmed.map(s => (
                    <SessionCard key={s._id} session={s} userRole="alumni" onAction={sess => (
                      <div style={{ display: 'flex', gap: '0.6rem' }}>
                        {new Date(sess.scheduledAt) < new Date() && <motion.button className="btn btn-dark btn-xs" whileTap={{ scale: 0.96 }} onClick={() => complete(sess._id)}>Mark Complete</motion.button>}
                        <motion.button className="btn btn-danger btn-xs" whileTap={{ scale: 0.96 }} onClick={() => cancel(sess._id)}>Cancel</motion.button>
                      </div>
                    )} />
                  ))}
                </div>
              </motion.div>
            )}

            {!busy && sessions.length === 0 && <Empty icon="🎯" title="No sessions yet" desc="Complete your profile to start receiving bookings." action={<Link to="/profile/alumni" className="btn btn-dark btn-sm">Set Up Profile</Link>} />}
          </motion.div>
        </main>
      </div>
      {confirmTarget && <ConfirmMeetModal onClose={() => setConfirmTarget(null)} onConfirm={confirmSess} />}
    </div>
  )
}

// ── MySessionsPage ─────────────────────────────────────────────────
export function MySessionsPage() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [busy, setBusy] = useState(true)
  const [tab, setTab] = useState('all')
  const [reviewTarget, setReviewTarget] = useState(null)
  const [confirmTarget, setConfirmTarget] = useState(null)

  useEffect(() => { load() }, [])
  const load = async () => {
    try { const d = await sessionApi.my({ limit: 100 }); setSessions(d.sessions || []) }
    catch { setSessions([]) } finally { setBusy(false) }
  }
  const tabs = ['all', 'pending', 'confirmed', 'completed', 'cancelled']
  const filtered = tab === 'all' ? sessions : sessions.filter(s => s.status === tab)

  const cancel = async id => { if (!confirm('Cancel?')) return; try { await sessionApi.cancel(id, {}); toast.success('Cancelled'); load() } catch(e) { toast.error(e.message) } }
  const confirmS = async data => { try { await sessionApi.confirm(confirmTarget._id, data); toast.success('Confirmed!'); setConfirmTarget(null); load() } catch(e) { toast.error(e.message) } }
  const complete = async id => { try { await sessionApi.complete(id); toast.success('Done!'); load() } catch(e) { toast.error(e.message) } }
  const submitReview = async data => { try { await sessionApi.review(reviewTarget._id, data); toast.success('Submitted!'); setReviewTarget(null); load() } catch(e) { toast.error(e.message) } }

  return (
    <div className="page">
      <div style={{ background: 'var(--off-white)', borderBottom: '1px solid var(--sand)', padding: '4rem 0 3rem' }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>Sessions</div>
          <h1 className="t-section" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>My <span className="ital">Sessions</span><span className="dot">.</span></h1>
        </div>
      </div>
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
        <div className="tabs">
          {tabs.map(t => (
            <button key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)} ({t === 'all' ? sessions.length : sessions.filter(s => s.status === t).length})
            </button>
          ))}
        </div>
        {busy ? <Loader /> : filtered.length === 0 ? (
          <Empty icon="📅" title="No sessions" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <AnimatePresence>
              {filtered.map(s => (
                <SessionCard key={s._id} session={s} userRole={user?.role} onAction={sess => {
                  if (user?.role === 'student') return (
                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                      {sess.status === 'pending' && <motion.button className="btn btn-danger btn-xs" whileTap={{ scale: 0.96 }} onClick={() => cancel(sess._id)}>Cancel</motion.button>}
                      {sess.status === 'completed' && !sess.review?.rating && <motion.button className="btn btn-coral btn-xs" whileTap={{ scale: 0.96 }} onClick={() => setReviewTarget(sess)}>Review</motion.button>}
                    </div>
                  )
                  return (
                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                      {sess.status === 'pending' && <>
                        <motion.button className="btn btn-dark btn-xs" whileTap={{ scale: 0.96 }} onClick={() => setConfirmTarget(sess)}>Confirm</motion.button>
                        <motion.button className="btn btn-danger btn-xs" whileTap={{ scale: 0.96 }} onClick={() => cancel(sess._id)}>Decline</motion.button>
                      </>}
                      {sess.status === 'confirmed' && new Date(sess.scheduledAt) < new Date() && <motion.button className="btn btn-dark btn-xs" whileTap={{ scale: 0.96 }} onClick={() => complete(sess._id)}>Mark Complete</motion.button>}
                    </div>
                  )
                }} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      {reviewTarget && <ReviewModal session={reviewTarget} onClose={() => setReviewTarget(null)} onSubmit={submitReview} />}
      {confirmTarget && <ConfirmMeetModal onClose={() => setConfirmTarget(null)} onConfirm={confirmS} />}
    </div>
  )
}

export default StudentDashboard
