import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Clock, Briefcase, CheckCircle, Copy, ExternalLink } from 'lucide-react'
import { UP, STAGGER, SCALE_IN } from '../hooks/motion'
import toast from 'react-hot-toast'

/* ── AlumniCard ─── */
export function AlumniCard({ alumni }) {
  const { _id, user, bio, currentRole, company, experience, skills, sessionRate, rating, totalReviews, totalSessions } = alumni
  const ini = user?.name?.[0]?.toUpperCase() || '?'
  return (
    <motion.div variants={UP} whileHover={{ y: -5, transition: { duration: 0.25 } }}>
      <Link to={`/alumni/${_id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        <div className="card card-hover alumni-card" style={{ height: '100%', boxShadow: '0 2px 12px rgba(13,13,13,0.04)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div className="alumni-av">
              {user?.profilePhoto ? <img src={user.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : ini}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)', marginBottom: '0.1rem' }}>{user?.name}</div>
              <div className="t-sm" style={{ marginBottom: '0.2rem' }}>{currentRole || 'Mentor'}{company ? ` · ${company}` : ''}</div>
              {experience > 0 && <div className="t-xs">{experience}y experience</div>}
            </div>
            {rating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ink)' }}>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {skills?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {skills.slice(0, 4).map(s => <span key={s} className="tag" style={{ fontSize: '0.72rem' }}>{s}</span>)}
              {skills.length > 4 && <span className="tag" style={{ fontSize: '0.72rem', color: 'var(--ink-light)' }}>+{skills.length - 4}</span>}
            </div>
          )}

          {bio && <p className="t-sm" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.55 }}>{bio}</p>}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--sand)' }}>
            <div>
              <span style={{ fontFamily: 'var(--f-display)', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)' }}>₹{sessionRate || 0}</span>
              <span className="t-xs"> / 30min</span>
            </div>
            <span className="btn btn-ghost btn-xs" style={{ pointerEvents: 'none', borderColor: 'var(--sand)' }}>View →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

/* ── SessionCard ─── */
export function SessionCard({ session, onAction, userRole }) {
  const { student, alumni, alumniProfile, scheduledAt, duration, topic, status, paymentStatus, meetLink, review } = session
  const d = new Date(scheduledAt)
  const day = d.getDate(), mon = d.toLocaleString('default', { month: 'short' })
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const other = userRole === 'student' ? alumni : student
  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4 }}>
      <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', boxShadow: '0 2px 8px rgba(13,13,13,0.04)' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div className="sesh-date">
            <div className="sesh-date-d">{day}</div>
            <div className="sesh-date-m">{mon}</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{topic || 'Mentorship Session'}</span>
              <span className={`badge badge-${status}`}>{status}</span>
              <span className={`badge badge-${paymentStatus}`}>{paymentStatus}</span>
            </div>
            <div className="t-xs" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
              <Clock size={10} /> {time} · {duration} min
              {other?.name && <><span>·</span><span style={{ color: 'var(--ink-mid)' }}>{other.name}</span></>}
            </div>
          </div>
        </div>
        {meetLink && status === 'confirmed' && (
          <div className="meet-box">
            <CheckCircle size={12} color="#1D4ED8" />
            <a href={meetLink} target="_blank" rel="noreferrer" className="meet-url">{meetLink}</a>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => { navigator.clipboard.writeText(meetLink); toast.success('Copied!') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-light)', display: 'flex' }}><Copy size={12} /></motion.button>
            <a href={meetLink} target="_blank" rel="noreferrer" style={{ color: 'var(--ink-light)', display: 'flex' }}><ExternalLink size={12} /></a>
          </div>
        )}
        {review?.rating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', paddingTop: '0.7rem', borderTop: '1px solid var(--sand)' }}>
            {[1,2,3,4,5].map(n => <Star key={n} size={11} color={n <= review.rating ? '#F59E0B' : 'var(--sand)'} fill={n <= review.rating ? '#F59E0B' : 'none'} />)}
            {review.comment && <span className="t-xs" style={{ fontStyle: 'italic' }}>"{review.comment}"</span>}
          </div>
        )}
        {onAction && <div style={{ borderTop: '1px solid var(--sand)', paddingTop: '0.7rem' }}>{onAction(session)}</div>}
      </div>
    </motion.div>
  )
}

/* ── StarRating ─── */
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
          whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.85 }}
        >★</motion.button>
      ))}
    </div>
  )
}

/* ── Loader ─── */
export function Loader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem', flexDirection: 'column', gap: '0.85rem' }}>
      <motion.div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--sand)', borderTop: '2px solid var(--coral)' }}
        animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
      <span className="eyebrow">Loading…</span>
    </div>
  )
}

/* ── Empty ─── */
export function Empty({ icon, title, desc, action }) {
  return (
    <motion.div variants={SCALE_IN} initial="hidden" animate="show" className="empty">
      {icon && <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>}
      <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--ink-mid)', marginBottom: '0.5rem' }}>{title}</h3>
      {desc && <p className="t-sm" style={{ maxWidth: 360, margin: '0 auto 1.5rem' }}>{desc}</p>}
      {action}
    </motion.div>
  )
}

/* ── StatCard ─── */
export function StatCard({ label, value, sub, icon }) {
  return (
    <motion.div variants={UP} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
      <div className="card" style={{ padding: '1.75rem', boxShadow: '0 2px 8px rgba(13,13,13,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--ink)', lineHeight: 1, marginBottom: '0.4rem' }}>{value}</div>
            <div className="eyebrow">{label}</div>
            {sub && <div className="t-xs" style={{ marginTop: '0.35rem' }}>{sub}</div>}
          </div>
          {icon && <div style={{ color: 'var(--ink-faint)', marginTop: '0.2rem' }}>{icon}</div>}
        </div>
      </div>
    </motion.div>
  )
}

/* ── Skel ─── */
export function Skel() {
  return (
    <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div className="skel" style={{ width: 52, height: 52, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.45rem', paddingTop: '0.1rem' }}>
          <div className="skel" style={{ height: 13, width: '55%' }} />
          <div className="skel" style={{ height: 10, width: '38%' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.35rem' }}>
        {[70,52,84].map((w, i) => <div key={i} className="skel" style={{ height: 20, width: w, borderRadius: 99 }} />)}
      </div>
      <div className="skel" style={{ height: 10, width: '90%' }} />
      <div className="skel" style={{ height: 10, width: '68%' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--sand)', paddingTop: '0.85rem' }}>
        <div className="skel" style={{ height: 16, width: 70 }} />
        <div className="skel" style={{ height: 26, width: 58, borderRadius: 99 }} />
      </div>
    </div>
  )
}

/* ── Pagination ─── */
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

/* ── ReviewModal ─── */
export function ReviewModal({ session, onClose, onSubmit }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)
  const go = async () => { if (!rating) return; setBusy(true); try { await onSubmit({ rating, comment }) } finally { setBusy(false) } }
  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className="modal-box" initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 20 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
        <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.6rem', fontWeight: 400, marginBottom: '0.4rem' }}>Leave a review<span style={{ color: 'var(--coral)' }}>.</span></h3>
        <p className="t-sm" style={{ marginBottom: '1.75rem' }}>How was your session on "{session?.topic || 'your session'}"?</p>
        <div className="form-group" style={{ marginBottom: '1.1rem' }}>
          <label className="form-label">Rating</label>
          <StarRating value={rating} onChange={setRating} />
        </div>
        <div className="form-group" style={{ marginBottom: '1.75rem' }}>
          <label className="form-label">Comment (optional)</label>
          <textarea className="form-input" placeholder="Share what you found most valuable…" value={comment} onChange={e => setComment(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '0.7rem', justifyContent: 'flex-end' }}>
          <motion.button className="btn btn-ghost" onClick={onClose} whileTap={{ scale: 0.96 }}>Cancel</motion.button>
          <motion.button className="btn btn-coral" onClick={go} disabled={!rating || busy} whileTap={{ scale: 0.96 }}>
            {busy ? <span className="spinner spinner-white" /> : 'Submit Review'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

/* ── ConfirmMeetModal ─── */
export function ConfirmMeetModal({ onClose, onConfirm }) {
  const [link, setLink] = useState('')
  const [busy, setBusy] = useState(false)
  const go = async () => { setBusy(true); try { await onConfirm({ meetLink: link }) } finally { setBusy(false) } }
  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className="modal-box" initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 20 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
        <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.6rem', fontWeight: 400, marginBottom: '0.4rem' }}>Confirm session<span style={{ color: 'var(--coral)' }}>.</span></h3>
        <p className="t-sm" style={{ marginBottom: '1.75rem' }}>Add a video call link for the student.</p>
        <div className="form-group" style={{ marginBottom: '1.75rem' }}>
          <label className="form-label">Meet / Zoom link (optional)</label>
          <input type="url" className="form-input" placeholder="https://meet.google.com/…" value={link} onChange={e => setLink(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '0.7rem', justifyContent: 'flex-end' }}>
          <motion.button className="btn btn-ghost" onClick={onClose} whileTap={{ scale: 0.96 }}>Cancel</motion.button>
          <motion.button className="btn btn-dark" onClick={go} disabled={busy} whileTap={{ scale: 0.96 }}>
            {busy ? <span className="spinner spinner-white" /> : 'Confirm Session'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
