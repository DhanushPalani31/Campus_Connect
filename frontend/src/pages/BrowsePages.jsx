import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { alumniApi } from '../api'
import { AlumniCard, Skel, Empty, Pages, Loader } from '../components'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Search, SlidersHorizontal, X, Star, Briefcase, Globe, Github, Linkedin, Clock, ArrowRight, CheckCircle, ArrowUpRight } from 'lucide-react'
import { STAGGER, STAGGER_SM, UP, LEFT, RIGHT } from '../hooks/motion'

const SKILLS = ['DSA', 'System Design', 'React', 'Node.js', 'Python', 'ML', 'Product Management', 'Data Science', 'DevOps', 'AWS', 'Java', 'Golang', 'Flutter', 'SQL']
const SORTS = [{ v: '', l: 'Newest' }, { v: 'rating', l: 'Top Rated' }, { v: 'price_low', l: 'Price ↑' }, { v: 'price_high', l: 'Price ↓' }, { v: 'experience', l: 'Most Exp.' }]

// ── ExplorePage ─────────────────────────────────────────────────
export function ExplorePage() {
  const [alumni, setAlumni] = useState([])
  const [busy, setBusy] = useState(true)
  const [q, setQ] = useState('')
  const [filters, setFilters] = useState({ skill: '', minRating: '', sort: '' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [showSkills, setShowSkills] = useState(false)

  const load = useCallback(async () => {
    setBusy(true)
    try {
      const d = await alumniApi.all({ ...filters, search: q, page, limit: 12 })
      setAlumni(d.alumni); setTotalPages(d.totalPages); setTotal(d.count)
    } catch { setAlumni([]) }
    finally { setBusy(false) }
  }, [filters, q, page])

  useEffect(() => { load() }, [load])
  useEffect(() => { const t = setTimeout(() => { setPage(1) }, 380); return () => clearTimeout(t) }, [q])

  const setF = (k, v) => { setFilters(f => ({ ...f, [k]: v })); setPage(1) }
  const clearAll = () => { setFilters({ skill: '', minRating: '', sort: '' }); setQ(''); setPage(1) }
  const hasF = filters.skill || filters.minRating || filters.sort

  return (
    <div className="page">
      <div style={{ background: 'var(--off-white)', borderBottom: '1px solid var(--sand)', padding: '4rem 0 3rem' }}>
        <div className="container">
          <motion.div variants={STAGGER} initial="hidden" animate="show">
            <motion.div variants={UP} className="eyebrow" style={{ marginBottom: '1rem' }}>Find Mentors</motion.div>
            <motion.div variants={UP} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
              <h1 className="t-section">
                Discover Your<br /><span className="ital">Mentor</span><span className="dot">.</span>
              </h1>
              {!busy && total > 0 && <span className="eyebrow">{total} alumni available</span>}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
        {/* Filter bar */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="filter-bar">
          <div className="search-wrap" style={{ flex: 2, minWidth: 200 }}>
            <Search className="search-ico" size={14} />
            <input type="text" className="form-input" placeholder="Search skill, role, company…" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <select className="form-input" style={{ minWidth: 130, flex: 1 }} value={filters.sort} onChange={e => setF('sort', e.target.value)}>
            {SORTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
          <select className="form-input" style={{ minWidth: 120, flex: 1 }} value={filters.minRating} onChange={e => setF('minRating', e.target.value)}>
            <option value="">Any Rating</option>
            <option value="4">4★ +</option>
            <option value="4.5">4.5★ +</option>
          </select>
          <motion.button className="btn btn-ghost btn-sm" onClick={() => setShowSkills(v => !v)} whileTap={{ scale: 0.97 }}>
            <SlidersHorizontal size={13} /> Skills
          </motion.button>
          <AnimatePresence>
            {hasF && (
              <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                className="btn btn-outline-coral btn-sm" onClick={clearAll}
              ><X size={12} /> Clear</motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {showSkills && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem', overflow: 'hidden' }}
            >
              {SKILLS.map(s => (
                <motion.button key={s} onClick={() => setF('skill', filters.skill === s ? '' : s)}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className={`tag${filters.skill === s ? ' tag-coral' : ''}`}
                  style={{ cursor: 'pointer', border: 'none' }}
                >{s}</motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {busy ? (
          <div className="ga">{Array.from({ length: 6 }).map((_, i) => <Skel key={i} />)}</div>
        ) : alumni.length === 0 ? (
          <Empty icon="🔍" title="No alumni found" desc="Try adjusting your search or removing filters." action={<button className="btn btn-outline btn-sm" onClick={clearAll}>Clear Filters</button>} />
        ) : (
          <motion.div variants={STAGGER_SM} initial="hidden" animate="show" className="ga">
            {alumni.map(a => <AlumniCard key={a._id} alumni={a} />)}
          </motion.div>
        )}
        <Pages page={page} total={totalPages} onChange={setPage} />
      </div>
    </div>
  )
}

// ── AlumniDetailPage ─────────────────────────────────────────────────
export function AlumniDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const nav = useNavigate()
  const [data, setData] = useState(null)
  const [busy, setBusy] = useState(true)

  useEffect(() => {
    alumniApi.one(id).then(d => setData(d.alumni)).catch(() => toast.error('Profile not found')).finally(() => setBusy(false))
  }, [id])

  if (busy) return <div className="page"><Loader /></div>
  if (!data) return null

  const { user: aUser, bio, currentRole, company, experience, skills, sessionRate, linkedIn, github, website, education, availability, rating, totalReviews, totalSessions } = data

  const book = () => {
    if (!user) { toast('Please log in to book', { icon: '🔒' }); nav('/login'); return }
    if (user.role !== 'student') { toast.error('Only students can book sessions'); return }
    nav(`/book/${id}`)
  }

  return (
    <div className="page">
      {/* Hero */}
      <div style={{ background: 'var(--off-white)', borderBottom: '1px solid var(--sand)', padding: '4rem 0 3rem' }}>
        <div className="container">
          <motion.div variants={STAGGER} initial="hidden" animate="show">
            <motion.div variants={UP} style={{ display: 'flex', gap: '1.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'var(--pale)', border: '2px solid var(--sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--coral)', flexShrink: 0, overflow: 'hidden' }}>
                {aUser?.profilePhoto ? <img src={aUser.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : aUser?.name?.[0]}
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>Alumni Profile</div>
                <h1 className="t-section" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', marginBottom: '0.5rem' }}>{aUser?.name}<span className="dot">.</span></h1>
                {currentRole && <div className="t-body" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Briefcase size={13} /> {currentRole}{company && ` · ${company}`}</div>}
                {experience > 0 && <div className="t-xs" style={{ marginTop: '0.3rem' }}>{experience} years experience</div>}
              </div>
            </motion.div>

            {/* Stats strip */}
            <motion.div variants={UP} style={{ display: 'flex', gap: '2.5rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--sand)', flexWrap: 'wrap' }}>
              {[
                { l: 'Rating', v: rating > 0 ? `${rating.toFixed(1)}★` : 'New' },
                { l: 'Reviews', v: totalReviews || '—' },
                { l: 'Sessions', v: totalSessions || 0 },
                { l: 'Rate / 30min', v: `₹${sessionRate || 0}` }
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: 'var(--f-display)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--ink)', marginBottom: '0.15rem' }}>{s.v}</div>
                  <div className="eyebrow">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '3.5rem', paddingBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '4rem', alignItems: 'start' }}>
          {/* Left */}
          <motion.div variants={STAGGER} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {bio && (
              <motion.div variants={UP}>
                <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>About</div>
                <p className="t-lead">{bio}</p>
              </motion.div>
            )}
            {skills?.length > 0 && (
              <motion.div variants={UP}>
                <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>Skills</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>{skills.map(s => <span key={s} className="tag">{s}</span>)}</div>
              </motion.div>
            )}
            {(education?.degree || education?.college) && (
              <motion.div variants={UP}>
                <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>Education</div>
                <div className="card-warm" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', borderRadius: 'var(--r-xl)' }}>
                  <div style={{ fontSize: '1.5rem' }}>🎓</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{education.degree}</div>
                    <div className="t-sm" style={{ marginTop: '0.15rem' }}>{education.college}{education.year && ` · ${education.year}`}</div>
                  </div>
                </div>
              </motion.div>
            )}
            {availability?.length > 0 && (
              <motion.div variants={UP}>
                <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>Availability</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {availability.map(a => (
                    <div key={a.day} style={{ padding: '0.5rem 0.9rem', background: 'var(--coral-pale)', border: '1px solid rgba(232,93,74,0.2)', borderRadius: 'var(--r-lg)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--coral-dark)' }}>{a.day}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {(linkedIn || github || website) && (
              <motion.div variants={UP} style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                {linkedIn && <a href={linkedIn} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm"><Linkedin size={13} /> LinkedIn</a>}
                {github && <a href={github} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm"><Github size={13} /> GitHub</a>}
                {website && <a href={website} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm"><Globe size={13} /> Website</a>}
              </motion.div>
            )}
          </motion.div>

          {/* Booking card */}
          <motion.div variants={LEFT} initial="hidden" animate="show" style={{ position: 'sticky', top: 'calc(var(--nav-h) + 1.5rem)' }}>
            <div className="card" style={{ padding: '2rem', boxShadow: '0 8px 32px rgba(13,13,13,0.1)' }}>
              <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>Book a Session</div>
              <div className="g2" style={{ marginBottom: '1.5rem' }}>
                {[{ d: '30 min', p: sessionRate || 0 }, { d: '60 min', p: (sessionRate || 0) * 2 }].map(o => (
                  <div key={o.d} className="card-warm" style={{ padding: '1rem', textAlign: 'center', borderRadius: 'var(--r-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', marginBottom: '0.35rem' }}><Clock size={10} color="var(--ink-light)" /><span className="t-xs">{o.d}</span></div>
                    <div style={{ fontFamily: 'var(--f-display)', fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.02em' }}>₹{o.p}</div>
                  </div>
                ))}
              </div>
              {['1:1 video call', 'Session resources', 'Follow-up Q&A', 'Actionable plan'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.35rem 0', fontSize: '0.83rem', color: 'var(--ink-mid)' }}>
                  <CheckCircle size={13} color="var(--coral)" /> {item}
                </div>
              ))}
              <div style={{ height: 1, background: 'var(--sand)', margin: '1.25rem 0' }} />
              <motion.button className="btn btn-dark btn-full btn-lg" onClick={book} whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
                Book Now <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ExplorePage
