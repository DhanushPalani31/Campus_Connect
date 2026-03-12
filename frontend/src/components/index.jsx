import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Clock, Briefcase, CheckCircle, Copy, ExternalLink } from 'lucide-react'
import { UP, STAGGER, SCALE } from '../hooks/motion'
import toast from 'react-hot-toast'

/* ── AlumniCard ─────────────────────────────────────── */
export function AlumniCard({ alumni }) {
  const { _id, user, bio, currentRole, company, experience, skills, sessionRate, rating, totalReviews, totalSessions } = alumni
  const ini = user?.name?.[0]?.toUpperCase() || '?'
  return (
    <motion.div variants={UP} whileHover={{ y: -6, transition: { duration: 0.25 } }}>
      <Link to={`/alumni/${_id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        <div className="card card-hover alumni-card" style={{ height: '100%' }}>
          {/* Header */}
          <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
            <div className="alumni-av">
              {user?.profilePhoto
                ? <img src={user.profilePhoto} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : ini
              }
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--f-body)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--t-primary)', letterSpacing: '-0.01em' }}>{user?.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--t-muted)', marginTop: '0.15rem' }}>
                {currentRole || 'Mentor'}{company ? ` · ${company}` : ''}
              </div>
              {experience > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.25rem' }}>
                  <Briefcase size={10} color="var(--t-faint)" />
                  <span className="label-dim" style={{ fontSize: '0.58rem' }}>{experience}y exp</span>
                </div>
              )}
            </div>
            {rating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                <Star size={11} color="#FCD34D" fill="#FCD34D" />
                <span style={{ fontFamily: 'var(--f-display)', fontSize: '0.9rem', color: 'var(--t-primary)', fontWeight: 300 }}>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {skills?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {skills.slice(0, 4).map(s => <span key={s} className="chip">{s}</span>)}
              {skills.length > 4 && <span className="chip chip-ghost">+{skills.length - 4}</span>}
            </div>
          )}

          {/* Bio */}
          {bio && (
            <p style={{ fontSize: '0.8rem', color: 'var(--t-muted)', lineHeight: 1.55, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{bio}</p>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--b-subtle)' }}>
            <div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: '1.2rem', fontWeight: 300, color: 'var(--volt)', letterSpacing: '-0.02em' }}>
                ₹{sessionRate || 0}<span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.62rem', color: 'var(--t-muted)', marginLeft: '0.25rem' }}>/30min</span>
              </div>
              {totalSessions > 0 && <div className="label-dim" style={{ fontSize: '0.58rem', marginTop: 1 }}>{totalSessions} sessions</div>}
            </div>
            <div className="btn btn-ghost btn-xs" style={{ pointerEvents: 'none', borderColor: 'rgba(184,255,87,0.15)', color: 'rgba(184,255,87,0.7)' }}>
              View →
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

/* ── SessionCard ─────────────────────────────────────── */
export function SessionCard({ session, onAction, userRole }) {
  const { student, alumni, alumniProfile, scheduledAt, duration, topic, status, paymentStatus, meetLink, review } = session
  const d = new Date(scheduledAt)
  const day = d.getDate()
  const mon = d.toLocaleString('default', { month: 'short' })
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const other = userRole === 'student' ? alumni : student

  return (
    <motion.div layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
      <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', gap: '1.1rem', alignItems: 'flex-start' }}>
          <div className="sesh-date">
            <div className="sesh-date-d">{day}</div>
            <div className="sesh-date-m">{mon}</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--t-primary)' }}>{topic || 'Mentorship Session'}</span>
              <span className={`badge badge-${status}`}>{status}</span>
              <span className={`badge badge-${paymentStatus}`}>{paymentStatus}</span>
            </div>
            <div style={{ fontSize: '0.77rem', color: 'var(--t-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
              <Clock size={10} /> {time} · {duration} min
              {other?.name && <><span style={{ opacity: 0.4 }}>·</span><span style={{ color: 'var(--t-secondary)' }}>{other.name}</span></>}
            </div>
            {alumniProfile?.currentRole && (
              <div className="label-dim" style={{ fontSize: '0.58rem', marginTop: 3 }}>
                {alumniProfile.currentRole}{alumniProfile.company ? ` @ ${alumniProfile.company}` : ''}
              </div>
            )}
          </div>
        </div>

        {meetLink && status === 'confirmed' && (
          <div className="meet-box">
            <CheckCircle size={12} color="#7DD3FC" />
            <a href={meetLink} target="_blank" rel="noopener noreferrer" className="meet-url">{meetLink}</a>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => { navigator.clipboard.writeText(meetLink); toast.success('Copied!') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t-muted)', padding: 0, display: 'flex' }}>
              <Copy size={12} />
            </motion.button>
            <a href={meetLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--t-muted)', display: 'flex' }}><ExternalLink size={12} /></a>
          </div>
        )}

        {review?.rating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', paddingTop: '0.7rem', borderTop: '1px solid var(--b-subtle)' }}>
            {[1,2,3,4,5].map(n => <Star key={n} size={11} color={n <= review.rating ? '#FCD34D' : 'var(--t-faint)'} fill={n <= review.rating ? '#FCD34D' : 'none'} />)}
            {review.comment && <span style={{ fontSize: '0.76rem', color: 'var(--t-muted)', fontStyle: 'italic' }}>"{review.comment}"</span>}
          </div>
        )}

        {onAction && <div style={{ borderTop: '1px solid var(--b-subtle)', paddingTop: '0.7rem' }}>{onAction(session)}</div>}
      </div>
    </motion.div>
  )
}

/* ── StarRating ─────────────────────────────────────── */
export function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="stars">
      {[1,2,3,4,5].map(n => (
        <motion.button key={n} type="button"
          className={`star-btn${(hover || value) >= n ? ' lit' : ''}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.85 }}
        >★</motion.button>
      ))}
    </div>
  )
}

/* ── LoadingSpinner ─────────────────────────────────── */
export function Loader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem', flexDirection: 'column', gap: '1rem' }}>
      <motion.div
        style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--b-subtle)', borderTop: '2px solid var(--volt)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      <span className="label-dim">Loading…</span>
    </div>
  )
}

/* ── EmptyState ─────────────────────────────────────── */
export function Empty({ icon, title, desc, action }) {
  return (
    <motion.div variants={SCALE} initial="hidden" animate="show" className="empty">
      {icon && <div style={{ fontSize: '2.5rem', marginBottom: '1rem', filter: 'grayscale(0.3)' }}>{icon}</div>}
      <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--t-secondary)', marginBottom: '0.5rem' }}>{title}</h3>
      {desc && <p style={{ fontSize: '0.84rem', maxWidth: 360, margin: '0 auto 1.5rem', color: 'var(--t-muted)' }}>{desc}</p>}
      {action}
    </motion.div>
  )
}

/* ── StatCard ─────────────────────────────────────── */
export function StatCard({ label, value, sub, icon }) {
  return (
    <motion.div variants={UP} whileHover={{ y: -3, transition: { duration: 0.2 } }} className="stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="stat-val">{value}</div>
          <div className="stat-lbl">{label}</div>
          {sub && <div className="label-dim" style={{ marginTop: '0.4rem', fontSize: '0.58rem' }}>{sub}</div>}
        </div>
        {icon && <div style={{ color: 'var(--t-faint)' }}>{icon}</div>}
      </div>
    </motion.div>
  )
}

/* ── SkeletonCard ─────────────────────────────────── */
export function Skel() {
  return (
    <div className="card" style={{ padding: '1.6rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.9rem' }}>
        <div className="skel" style={{ width: 48, height: 48, borderRadius: 'var(--r-md)', flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.45rem', paddingTop: '0.1rem' }}>
          <div className="skel" style={{ height: 13, width: '60%' }} />
          <div className="skel" style={{ height: 10, width: '40%' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.35rem' }}>
        {[68, 52, 80].map((w, i) => <div key={i} className="skel" style={{ height: 19, width: w, borderRadius: 99 }} />)}
      </div>
      <div className="skel" style={{ height: 10, width: '88%' }} />
      <div className="skel" style={{ height: 10, width: '65%' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--b-subtle)', paddingTop: '0.8rem' }}>
        <div className="skel" style={{ height: 16, width: 75 }} />
        <div className="skel" style={{ height: 26, width: 60, borderRadius: 99 }} />
      </div>
    </div>
  )
}

/* ── Pagination ─────────────────────────────────────── */
export function Pages({ page, total, onChange }) {
  if (total <= 1) return null
  return (
    <div className="pg">
      <button className="pg-btn" onClick={() => onChange(page - 1)} disabled={page === 1}>‹</button>
      {Array.from({ length: total }, (_, i) => i + 1).map(p => (
        <button key={p} className={`pg-btn${p === page ? ' active' : ''}`} onClick={() => onChange(p)}>{p}</button>
      ))}
      <button className="pg-btn" onClick={() => onChange(page + 1)} disabled={page === total}>›</button>
    </div>
  )
}

/* ── ReviewModal ─────────────────────────────────────── */
export function ReviewModal({ session, onClose, onSubmit }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)

  const go = async () => {
    if (!rating) return
    setBusy(true)
    try { await onSubmit({ rating, comment }) }
    finally { setBusy(false) }
  }

  return (
    <AnimatePresence>
      <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
        <motion.div
          className="modal-box"
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 24 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.6rem', fontWeight: 300, marginBottom: '0.4rem' }}>Leave a review</h3>
          <p style={{ fontSize: '0.83rem', color: 'var(--t-muted)', marginBottom: '1.75rem' }}>How was your session on "{session?.topic || 'your session'}"?</p>
          <div className="form-group" style={{ marginBottom: '1.1rem' }}>
            <label className="form-label">Your rating</label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Comment (optional)</label>
            <textarea className="form-input" placeholder="Share what you found most valuable…" value={comment} onChange={e => setComment(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '0.7rem', justifyContent: 'flex-end' }}>
            <motion.button className="btn btn-ghost" onClick={onClose} whileTap={{ scale: 0.96 }}>Cancel</motion.button>
            <motion.button className="btn btn-volt" onClick={go} disabled={!rating || busy} whileTap={{ scale: 0.96 }}>
              {busy ? <span className="spinner" /> : 'Submit'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

/* ── ConfirmMeetModal ─────────────────────────────────── */
export function ConfirmMeetModal({ onClose, onConfirm }) {
  const [link, setLink] = useState('')
  const [busy, setBusy] = useState(false)
  const go = async () => { setBusy(true); try { await onConfirm({ meetLink: link }) } finally { setBusy(false) } }

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        className="modal-box"
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 24 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.6rem', fontWeight: 300, marginBottom: '0.4rem' }}>Confirm session</h3>
        <p style={{ fontSize: '0.83rem', color: 'var(--t-muted)', marginBottom: '1.75rem' }}>Add a video call link for the student to join.</p>
        <div className="form-group" style={{ marginBottom: '1.75rem' }}>
          <label className="form-label">Meet / Zoom link (optional)</label>
          <input type="url" className="form-input" placeholder="https://meet.google.com/…" value={link} onChange={e => setLink(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '0.7rem', justifyContent: 'flex-end' }}>
          <motion.button className="btn btn-ghost" onClick={onClose} whileTap={{ scale: 0.96 }}>Cancel</motion.button>
          <motion.button className="btn btn-volt" onClick={go} disabled={busy} whileTap={{ scale: 0.96 }}>
            {busy ? <span className="spinner" /> : 'Confirm Session'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
