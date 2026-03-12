// ── ExplorePage ──────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { alumniApi } from '../api'
import { AlumniCard, Skel, Empty, Pages } from '../components'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { STAGGER, UP } from '../hooks/motion'

const SKILLS = ['DSA', 'System Design', 'React', 'Node.js', 'Python', 'Machine Learning', 'Product Management', 'Data Science', 'DevOps', 'AWS', 'Java', 'Golang', 'Flutter', 'SQL', 'Kubernetes']
const SORTS = [{ v: '', l: 'Newest' }, { v: 'rating', l: 'Top Rated' }, { v: 'price_low', l: 'Price ↑' }, { v: 'price_high', l: 'Price ↓' }, { v: 'experience', l: 'Most Exp.' }]

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

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load() }, 380)
    return () => clearTimeout(t)
  }, [q])

  const setF = (k, v) => { setFilters(f => ({ ...f, [k]: v })); setPage(1) }
  const clearAll = () => { setFilters({ skill: '', minRating: '', sort: '' }); setQ(''); setPage(1) }
  const hasF = filters.skill || filters.minRating || filters.sort

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>

        {/* Header */}
        <motion.div variants={STAGGER} initial="hidden" animate="show" style={{ marginBottom: '2.5rem' }}>
          <motion.div variants={UP} className="label" style={{ marginBottom: '0.75rem' }}>Browse</motion.div>
          <motion.div variants={UP} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 className="display-md">
              Find your <span className="swash" style={{ fontStyle: 'italic', color: 'var(--volt)' }}>mentor.</span>
            </h1>
            {!busy && total > 0 && <span className="label-dim">{total} alumni available</span>}
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.5 }} className="filter-bar">
          <div className="search-wrap" style={{ flex: 2, minWidth: 200 }}>
            <Search className="search-ico" size={15} />
            <input type="text" className="form-input" placeholder="Search skill, role, company…" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <select className="form-input" style={{ minWidth: 140, flex: 1 }} value={filters.sort} onChange={e => setF('sort', e.target.value)}>
            {SORTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
          <select className="form-input" style={{ minWidth: 130, flex: 1 }} value={filters.minRating} onChange={e => setF('minRating', e.target.value)}>
            <option value="">Any Rating</option>
            <option value="4">4★ +</option>
            <option value="4.5">4.5★ +</option>
          </select>
          <motion.button className={`btn btn-ghost btn-sm`} onClick={() => setShowSkills(v => !v)} whileTap={{ scale: 0.97 }}>
            <SlidersHorizontal size={13} /> Skills
          </motion.button>
          <AnimatePresence>
            {hasF && (
              <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                className="btn btn-ghost btn-sm" onClick={clearAll} style={{ color: 'var(--volt)', borderColor: 'rgba(184,255,87,0.2)' }}
              >
                <X size={13} /> Clear
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Skill chips */}
        <AnimatePresence>
          {showSkills && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.5rem', overflow: 'hidden' }}
            >
              {SKILLS.map(s => (
                <motion.button key={s} onClick={() => setF('skill', filters.skill === s ? '' : s)}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                  className="chip"
                  style={{ cursor: 'pointer', background: filters.skill === s ? 'rgba(184,255,87,0.15)' : 'rgba(184,255,87,0.05)', borderColor: filters.skill === s ? 'rgba(184,255,87,0.35)' : 'rgba(184,255,87,0.15)', color: filters.skill === s ? 'var(--volt)' : 'rgba(184,255,87,0.6)' }}
                >
                  {s}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {busy ? (
          <div className="ga">{Array.from({ length: 6 }).map((_, i) => <Skel key={i} />)}</div>
        ) : alumni.length === 0 ? (
          <Empty icon="🔍" title="No alumni found" desc="Try adjusting your search or removing filters." action={<button className="btn btn-outline btn-sm" onClick={clearAll}>Clear All Filters</button>} />
        ) : (
          <motion.div variants={STAGGER} initial="hidden" animate="show" className="ga">
            {alumni.map(a => <AlumniCard key={a._id} alumni={a} />)}
          </motion.div>
        )}

        <Pages page={page} total={totalPages} onChange={setPage} />
      </div>
    </div>
  )
}

// ── AlumniDetailPage ──────────────────────────────────────────────
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader } from '../components'
import toast from 'react-hot-toast'
import { Star, Briefcase, Globe, Github, Linkedin, Clock, ArrowRight, CheckCircle } from 'lucide-react'
import { LEFT, RIGHT } from '../hooks/motion'

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
    if (!user) { toast('Login to book', { icon: '🔒' }); nav('/login'); return }
    if (user.role !== 'student') { toast.error('Only students can book sessions'); return }
    nav(`/book/${id}`)
  }

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3.5rem', alignItems: 'start' }}>

          {/* Left */}
          <motion.div variants={STAGGER} initial="hidden" animate="show">
            <motion.div variants={UP} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              <div style={{ width: 76, height: 76, borderRadius: 'var(--r-xl)', background: 'var(--ink-3)', border: '1px solid var(--b-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-display)', fontSize: '1.8rem', color: 'var(--volt)', flexShrink: 0, overflow: 'hidden', fontWeight: 300 }}>
                {aUser?.profilePhoto ? <img src={aUser.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : aUser?.name?.[0]}
              </div>
              <div>
                <h1 className="display-md" style={{ fontSize: '2.2rem', marginBottom: '0.3rem' }}>{aUser?.name}</h1>
                {currentRole && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--t-secondary)', marginBottom: '0.3rem', fontSize: '0.9rem' }}><Briefcase size={13} /> {currentRole}{company && ` · ${company}`}</div>}
                {experience > 0 && <div className="label-dim">{experience} years experience</div>}
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={UP} style={{ display: 'flex', gap: '2rem', padding: '1.25rem 1.5rem', background: 'var(--card)', border: '1px solid var(--b-subtle)', borderRadius: 'var(--r-xl)', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              {[{ l: 'Rating', v: rating > 0 ? `${rating.toFixed(1)}★` : 'New' }, { l: 'Reviews', v: totalReviews || '—' }, { l: 'Sessions', v: totalSessions || 0 }, { l: 'Rate / 30min', v: `₹${sessionRate || 0}` }].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: 'var(--f-display)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--volt)', letterSpacing: '-0.02em' }}>{s.v}</div>
                  <div className="label-dim" style={{ fontSize: '0.6rem' }}>{s.l}</div>
                </div>
              ))}
            </motion.div>

            {bio && <motion.div variants={UP} style={{ marginBottom: '2rem' }}><div style={{ fontFamily: 'var(--f-mono)', fontSize: '0.63rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--t-muted)', marginBottom: '0.65rem' }}>About</div><p style={{ color: 'var(--t-secondary)', lineHeight: 1.7, fontSize: '0.92rem' }}>{bio}</p></motion.div>}

            {skills?.length > 0 && (
              <motion.div variants={UP} style={{ marginBottom: '2rem' }}>
                <div className="label-dim" style={{ marginBottom: '0.65rem' }}>Skills</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>{skills.map(s => <span key={s} className="chip" style={{ fontSize: '0.76rem' }}>{s}</span>)}</div>
              </motion.div>
            )}

            {(education?.degree || education?.college) && (
              <motion.div variants={UP} style={{ marginBottom: '2rem' }}>
                <div className="label-dim" style={{ marginBottom: '0.65rem' }}>Education</div>
                <div style={{ padding: '1rem 1.25rem', background: 'var(--card)', border: '1px solid var(--b-subtle)', borderRadius: 'var(--r-lg)', display: 'flex', gap: '0.9rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>🎓</div>
                  <div><div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{education.degree}</div><div style={{ fontSize: '0.78rem', color: 'var(--t-muted)', marginTop: '0.15rem' }}>{education.college}{education.year && ` · ${education.year}`}</div></div>
                </div>
              </motion.div>
            )}

            {availability?.length > 0 && (
              <motion.div variants={UP} style={{ marginBottom: '2rem' }}>
                <div className="label-dim" style={{ marginBottom: '0.65rem' }}>Availability</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {availability.map(a => (
                    <div key={a.day} style={{ padding: '0.5rem 0.9rem', background: 'rgba(184,255,87,0.07)', border: '1px solid rgba(184,255,87,0.18)', borderRadius: 'var(--r-md)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--volt)' }}>{a.day}</div>
                      {a.slots?.length > 0 && <div className="label-dim" style={{ fontSize: '0.58rem', marginTop: 2 }}>{a.slots.join(', ')}</div>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {(linkedIn || github || website) && (
              <motion.div variants={UP} style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                {linkedIn && <a href={linkedIn} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><Linkedin size={13} /> LinkedIn</a>}
                {github && <a href={github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><Github size={13} /> GitHub</a>}
                {website && <a href={website} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><Globe size={13} /> Website</a>}
              </motion.div>
            )}
          </motion.div>

          {/* Right — Booking card */}
          <motion.div variants={LEFT} initial="hidden" animate="show" style={{ position: 'sticky', top: 'calc(var(--nav-h) + 1.5rem)' }}>
            <div className="card grad-border" style={{ padding: '2rem', boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(109,40,217,0.1)' }}>
              <div className="label" style={{ marginBottom: '1.25rem' }}>Book a Session</div>
              <div className="g2" style={{ marginBottom: '1.5rem' }}>
                {[{ d: '30 min', p: sessionRate || 0 }, { d: '60 min', p: (sessionRate || 0) * 2 }].map(o => (
                  <div key={o.d} style={{ padding: '1rem', background: 'var(--ink-2)', border: '1px solid var(--b-subtle)', borderRadius: 'var(--r-lg)', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: 'var(--t-muted)', marginBottom: '0.4rem' }}><Clock size={10} /><span className="label-dim" style={{ fontSize: '0.6rem' }}>{o.d}</span></div>
                    <div style={{ fontFamily: 'var(--f-display)', fontSize: '1.3rem', fontWeight: 300, color: 'var(--volt)', letterSpacing: '-0.02em' }}>₹{o.p}</div>
                  </div>
                ))}
              </div>
              {['1:1 video call', 'Session resources', 'Follow-up Q&A', 'Actionable roadmap'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.38rem 0', fontSize: '0.8rem', color: 'var(--t-secondary)' }}>
                  <CheckCircle size={12} color="var(--volt)" /> {item}
                </div>
              ))}
              <div style={{ height: 1, background: 'var(--b-subtle)', margin: '1.25rem 0' }} />
              <motion.button className="btn btn-volt btn-full btn-lg" onClick={book} whileTap={{ scale: 0.97 }}>
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
