// ── StudentDashboard ──────────────────────────────────────────────
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { sessionApi } from '../api'
import { SessionCard, StatCard, Loader, Empty, ReviewModal } from '../components'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Compass, CalendarDays, TrendingUp, Star, Settings, Clock } from 'lucide-react'
import { STAGGER, UP } from '../hooks/motion'

export function StudentDashboard() {
  const { user, profile } = useAuth()
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
  const totalSpent = sessions.filter(s => s.paymentStatus === 'paid').reduce((acc, s) => acc + (s.amount || 0), 0)

  const cancelSession = async id => {
    if (!confirm('Cancel this session?')) return
    try { await sessionApi.cancel(id, { reason: 'Cancelled by student' }); toast.success('Session cancelled'); load() }
    catch (e) { toast.error(e.message) }
  }

  const submitReview = async data => {
    try { await sessionApi.review(reviewTarget._id, data); toast.success('Review submitted! ⭐'); setReviewTarget(null); load() }
    catch (e) { toast.error(e.message) }
  }

  return (
    <div className="page">
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr' }}>
        {/* Sidebar */}
        <aside className="sidebar">
          <div style={{ padding: '0 0.7rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(184,255,87,0.07)', border: '1px solid rgba(184,255,87,0.15)', borderRadius: 'var(--r-xl)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--t-primary)' }}>{user?.name}</div>
              <div className="label-dim" style={{ marginTop: 2, fontSize: '0.6rem' }}>Student · {user?.college || 'AlumniBridge'}</div>
            </div>
          </div>
          {[
            { icon: <TrendingUp size={14} />, label: 'Dashboard', to: '/dashboard/student' },
            { icon: <CalendarDays size={14} />, label: 'My Sessions', to: '/sessions/my' },
            { icon: <Compass size={14} />, label: 'Find Mentors', to: '/explore' },
            { icon: <Settings size={14} />, label: 'Settings', to: '/profile/student' },
          ].map(l => (
            <Link key={l.to} to={l.to} className={`s-link${window.location.pathname === l.to ? ' active' : ''}`}>
              {l.icon} {l.label}
            </Link>
          ))}
        </aside>

        {/* Main */}
        <main style={{ padding: '2.5rem 3rem', minHeight: 'calc(100vh - var(--nav-h))' }}>
          <motion.div variants={STAGGER} initial="hidden" animate="show">
            <motion.div variants={UP} style={{ marginBottom: '2.25rem' }}>
              <div className="label" style={{ marginBottom: '0.5rem' }}>Dashboard</div>
              <h1 className="display-md" style={{ fontSize: '2rem' }}>
                Hey, <span className="swash" style={{ fontStyle: 'italic', color: 'var(--volt)' }}>{user?.name?.split(' ')[0]}.</span>
              </h1>
            </motion.div>

            {/* Stats */}
            <motion.div variants={UP} className="g4" style={{ marginBottom: '2.5rem' }}>
              <StatCard label="Total Sessions" value={sessions.length} sub="All time" icon={<CalendarDays size={16} />} />
              <StatCard label="Completed" value={completed.length} sub="Successfully done" icon={<Star size={16} />} />
              <StatCard label="Upcoming" value={upcoming.length} sub="Confirmed sessions" icon={<Clock size={16} />} />
              <StatCard label="Total Spent" value={`₹${totalSpent}`} sub="INR invested" icon={<TrendingUp size={16} />} />
            </motion.div>

            {/* Recent sessions */}
            <motion.div variants={UP}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontFamily: 'var(--f-display)', fontSize: '1.3rem', fontWeight: 300 }}>Recent Sessions</h2>
                <Link to="/sessions/my" style={{ fontSize: '0.82rem', color: 'var(--volt)', textDecoration: 'none' }}>View all →</Link>
              </div>
              {busy ? <Loader /> : sessions.length === 0 ? (
                <Empty icon="📅" title="No sessions yet" desc="Browse alumni and book your first 1:1 session." action={<Link to="/explore" className="btn btn-volt btn-sm">Explore Mentors</Link>} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <AnimatePresence>
                    {recent.map(s => (
                      <SessionCard key={s._id} session={s} userRole="student" onAction={sess => (
                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                          {sess.status === 'pending' && <motion.button className="btn btn-danger btn-xs" whileTap={{ scale: 0.96 }} onClick={() => cancelSession(sess._id)}>Cancel</motion.button>}
                          {sess.status === 'completed' && !sess.review?.rating && (
                            <motion.button className="btn btn-volt btn-xs" whileTap={{ scale: 0.96 }} onClick={() => setReviewTarget(sess)}>Leave Review</motion.button>
                          )}
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

// ── AlumniDashboard ──────────────────────────────────────────────
import { ConfirmMeetModal } from '../components'
import { DollarSign, Users } from 'lucide-react'

export function AlumniDashboard() {
  const { user, profile } = useAuth()
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
  const completeSess = async id => {
    try { await sessionApi.complete(id); toast.success('Marked as complete!'); load() }
    catch (e) { toast.error(e.message) }
  }
  const cancelSess = async id => {
    if (!confirm('Cancel session?')) return
    try { await sessionApi.cancel(id, {}); toast.success('Cancelled'); load() }
    catch (e) { toast.error(e.message) }
  }

  return (
    <div className="page">
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr' }}>
        <aside className="sidebar">
          <div style={{ padding: '0 0.7rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(184,255,87,0.07)', border: '1px solid rgba(184,255,87,0.15)', borderRadius: 'var(--r-xl)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--t-primary)' }}>{user?.name}</div>
              <div className="label-dim" style={{ marginTop: 2, fontSize: '0.6rem' }}>Alumni · Mentor</div>
            </div>
          </div>
          {[
            { icon: <TrendingUp size={14} />, label: 'Dashboard', to: '/dashboard/alumni' },
            { icon: <CalendarDays size={14} />, label: 'Sessions', to: '/sessions/my' },
            { icon: <Settings size={14} />, label: 'Profile', to: '/profile/alumni' },
          ].map(l => (
            <Link key={l.to} to={l.to} className={`s-link${window.location.pathname === l.to ? ' active' : ''}`}>
              {l.icon} {l.label}
            </Link>
          ))}
        </aside>

        <main style={{ padding: '2.5rem 3rem', minHeight: 'calc(100vh - var(--nav-h))' }}>
          <motion.div variants={STAGGER} initial="hidden" animate="show">
            <motion.div variants={UP} style={{ marginBottom: '2.25rem' }}>
              <div className="label" style={{ marginBottom: '0.5rem' }}>Dashboard</div>
              <h1 className="display-md" style={{ fontSize: '2rem' }}>
                Welcome back, <span className="swash" style={{ fontStyle: 'italic', color: 'var(--volt)' }}>{user?.name?.split(' ')[0]}.</span>
              </h1>
            </motion.div>

            <motion.div variants={UP} className="g4" style={{ marginBottom: '2.5rem' }}>
              <StatCard label="Total Earnings" value={`₹${earnings}`} sub="Paid sessions" icon={<DollarSign size={16} />} />
              <StatCard label="Pending" value={pending.length} sub="Awaiting action" icon={<Clock size={16} />} />
              <StatCard label="Confirmed" value={confirmed.length} sub="Upcoming calls" icon={<CalendarDays size={16} />} />
              <StatCard label="Completed" value={completed.length} sub="All time" icon={<Users size={16} />} />
            </motion.div>

            {/* Pending requests */}
            {pending.length > 0 && (
              <motion.div variants={UP} style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1.1rem' }}>
                  <h2 style={{ fontFamily: 'var(--f-display)', fontSize: '1.2rem', fontWeight: 300 }}>Pending Requests</h2>
                  <span className="badge badge-pending">{pending.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {pending.map(s => (
                    <SessionCard key={s._id} session={s} userRole="alumni" onAction={sess => (
                      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <motion.button className="btn btn-volt btn-xs" whileTap={{ scale: 0.96 }} onClick={() => setConfirmTarget(sess)}>Confirm</motion.button>
                        <motion.button className="btn btn-danger btn-xs" whileTap={{ scale: 0.96 }} onClick={() => cancelSess(sess._id)}>Decline</motion.button>
                      </div>
                    )} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Upcoming confirmed */}
            {confirmed.length > 0 && (
              <motion.div variants={UP}>
                <h2 style={{ fontFamily: 'var(--f-display)', fontSize: '1.2rem', fontWeight: 300, marginBottom: '1.1rem' }}>Upcoming Sessions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {confirmed.map(s => (
                    <SessionCard key={s._id} session={s} userRole="alumni" onAction={sess => (
                      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                        {new Date(sess.scheduledAt) < new Date() && (
                          <motion.button className="btn btn-volt btn-xs" whileTap={{ scale: 0.96 }} onClick={() => completeSess(sess._id)}>Mark Complete</motion.button>
                        )}
                        <motion.button className="btn btn-danger btn-xs" whileTap={{ scale: 0.96 }} onClick={() => cancelSess(sess._id)}>Cancel</motion.button>
                      </div>
                    )} />
                  ))}
                </div>
              </motion.div>
            )}

            {!busy && sessions.length === 0 && (
              <Empty icon="🎯" title="No sessions yet" desc="Complete your profile to start receiving bookings." action={<Link to="/profile/alumni" className="btn btn-volt btn-sm">Set Up Profile</Link>} />
            )}
          </motion.div>
        </main>
      </div>
      {confirmTarget && <ConfirmMeetModal onClose={() => setConfirmTarget(null)} onConfirm={confirmSess} />}
    </div>
  )
}

// ── MySessionsPage ──────────────────────────────────────────────
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

  const cancelSess = async id => {
    if (!confirm('Cancel this session?')) return
    try { await sessionApi.cancel(id, {}); toast.success('Cancelled'); load() }
    catch (e) { toast.error(e.message) }
  }
  const confirmSess = async data => {
    try { await sessionApi.confirm(confirmTarget._id, data); toast.success('Confirmed!'); setConfirmTarget(null); load() }
    catch (e) { toast.error(e.message) }
  }
  const completeSess = async id => {
    try { await sessionApi.complete(id); toast.success('Marked complete!'); load() }
    catch (e) { toast.error(e.message) }
  }
  const submitReview = async data => {
    try { await sessionApi.review(reviewTarget._id, data); toast.success('Review submitted!'); setReviewTarget(null); load() }
    catch (e) { toast.error(e.message) }
  }

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <motion.div variants={STAGGER} initial="hidden" animate="show">
          <motion.div variants={UP} style={{ marginBottom: '2.25rem' }}>
            <div className="label" style={{ marginBottom: '0.75rem' }}>Sessions</div>
            <h1 className="display-md" style={{ fontSize: '2rem' }}>My <span className="swash" style={{ fontStyle: 'italic', color: 'var(--volt)' }}>Sessions</span></h1>
          </motion.div>
          <motion.div variants={UP}>
            <div className="tabs">
              {tabs.map(t => (
                <button key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                  {t === 'all' ? ` (${sessions.length})` : ` (${sessions.filter(s => s.status === t).length})`}
                </button>
              ))}
            </div>
            {busy ? <Loader /> : filtered.length === 0 ? (
              <Empty icon="📅" title="No sessions" desc={`No ${tab === 'all' ? '' : tab} sessions found.`} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <AnimatePresence>
                  {filtered.map(s => (
                    <SessionCard key={s._id} session={s} userRole={user?.role} onAction={sess => {
                      if (user?.role === 'student') return (
                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                          {sess.status === 'pending' && <motion.button className="btn btn-danger btn-xs" whileTap={{ scale: 0.96 }} onClick={() => cancelSess(sess._id)}>Cancel</motion.button>}
                          {sess.status === 'completed' && !sess.review?.rating && (
                            <motion.button className="btn btn-volt btn-xs" whileTap={{ scale: 0.96 }} onClick={() => setReviewTarget(sess)}>Review</motion.button>
                          )}
                        </div>
                      )
                      return (
                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                          {sess.status === 'pending' && <>
                            <motion.button className="btn btn-volt btn-xs" whileTap={{ scale: 0.96 }} onClick={() => setConfirmTarget(sess)}>Confirm</motion.button>
                            <motion.button className="btn btn-danger btn-xs" whileTap={{ scale: 0.96 }} onClick={() => cancelSess(sess._id)}>Decline</motion.button>
                          </>}
                          {sess.status === 'confirmed' && new Date(sess.scheduledAt) < new Date() && (
                            <motion.button className="btn btn-volt btn-xs" whileTap={{ scale: 0.96 }} onClick={() => completeSess(sess._id)}>Mark Complete</motion.button>
                          )}
                        </div>
                      )
                    }} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
      {reviewTarget && <ReviewModal session={reviewTarget} onClose={() => setReviewTarget(null)} onSubmit={submitReview} />}
      {confirmTarget && <ConfirmMeetModal onClose={() => setConfirmTarget(null)} onConfirm={confirmSess} />}
    </div>
  )
}

export default StudentDashboard
