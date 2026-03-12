import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Star, Users, Zap, Shield, TrendingUp, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { UP, STAGGER, STAGGER_SM, FADE, LEFT, RIGHT, SCALE_IN } from '../hooks/motion'

/* Cycling words — jointalent style hero text rotation */
const CYCLE_WORDS = ['Rohan Sharma', 'Priya Mehta', 'Aditya Kumar', 'Sneha Patel', 'Arjun Singh', 'Kavya Nair']
const MARQUEE_ITEMS = ['Mock Interviews', 'Resume Reviews', 'Career Roadmaps', 'System Design', 'DSA Coaching', 'FAANG Prep', 'Product Management', 'Data Science', 'Startup Advice', 'Placement Guidance']

const STATS = [
  { num: '500', unit: '+', label: 'Verified Alumni' },
  { num: '2,400', unit: '+', label: 'Sessions Done' },
  { num: '₹850', unit: '', label: 'Avg Session Rate' },
  { num: '4.8', unit: '★', label: 'Platform Rating' },
]

const SOLUTIONS = [
  {
    label: '01',
    title: 'Mock Interview Prep',
    body: "Practice with alumni who've cracked the rounds at the exact companies you're targeting. Honest feedback that moves the needle.",
    cta: 'Find Interview Mentors',
  },
  {
    label: '02',
    title: 'Resume & Profile Review',
    body: "Your resume reviewed by someone who's been on both sides of the hiring table. Line-by-line improvements that get callbacks.",
    cta: 'Find Resume Mentors',
  },
  {
    label: '03',
    title: 'Career Roadmap Sessions',
    body: 'A senior engineer, PM, or designer mapping out your exact path — from where you are to where you want to be.',
    cta: 'Find Career Mentors',
  },
  {
    label: '04',
    title: 'Technical Deep Dives',
    body: 'Stuck on DSA, system design, or a specific domain? Alumni who live and breathe it teach you in 30–60 min sessions.',
    cta: 'Find Technical Mentors',
  },
]

const PROCESS = [
  { n: '01', t: 'Browse Alumni', b: 'Filter by company, skill, experience, and rate. Every profile is manually verified.' },
  { n: '02', t: 'Book a Slot', b: "Pick a 30 or 60-minute window directly in your mentor's calendar." },
  { n: '03', t: 'Pay Securely', b: 'Razorpay checkout — your money held safely until the session completes.' },
  { n: '04', t: 'Walk Out Sharper', b: 'One focused conversation. A concrete action plan. Real momentum.' },
]

/* Animated number counter */
function Counter({ end, prefix = '', suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const numEnd = parseFloat(end.replace(/[^0-9.]/g, ''))

  useEffect(() => {
    if (!inView) return
    let start = 0; const dur = 1600; const step = 16
    const inc = numEnd / (dur / step)
    const t = setInterval(() => {
      start += inc
      if (start >= numEnd) { setVal(numEnd); clearInterval(t) }
      else setVal(parseFloat(start.toFixed(numEnd % 1 !== 0 ? 1 : 0)))
    }, step)
    return () => clearInterval(t)
  }, [inView, numEnd])

  const display = numEnd >= 1000 ? val.toLocaleString() : val.toString()
  return <span ref={ref}>{prefix}{display}{suffix}</span>
}

/* Word cycling hero component */
function CycleWord() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % CYCLE_WORDS.length), 2200)
    return () => clearInterval(t)
  }, [])
  return (
    <span style={{ position: 'relative', display: 'inline-block', color: 'var(--coral)', fontStyle: 'italic', minWidth: '280px' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'block' }}
        >
          {CYCLE_WORDS[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function LandingPage() {
  const { user } = useAuth()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>

      {/* ═══════════ HERO — jointalent style ═══════════ */}
      <section
        ref={heroRef}
        style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingBottom: '4rem' }}
      >
        {/* Subtle warm gradient bg */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, var(--off-white) 0%, var(--white) 60%)', pointerEvents: 'none' }} />
        {/* Coral dot pattern very subtle */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(232,93,74,0.06) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />

        <motion.div className="container" style={{ y: heroY, opacity: heroOpacity, position: 'relative', zIndex: 2, paddingTop: '6rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

            {/* Left */}
            <motion.div variants={STAGGER} initial="hidden" animate="show">
              {/* Eyebrow */}
              <motion.div variants={UP} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2.5rem' }}>
                <span className="eyebrow-coral">Where Ambition Meets Experience</span>
              </motion.div>

              {/* Headline — jointalent word cycling */}
              <motion.div variants={UP} style={{ marginBottom: '2rem' }}>
                <h1 className="t-hero" style={{ marginBottom: '0.1em' }}>
                  Real guidance<br />from
                </h1>
                <CycleWord />
                <h1 className="t-hero" style={{ marginTop: '0.05em' }}>
                  and more<span className="dot">.</span>
                </h1>
              </motion.div>

              <motion.p variants={UP} className="t-lead" style={{ maxWidth: 460, marginBottom: '2.5rem' }}>
                Connect with working alumni for paid 1:1 sessions. Mock interviews, resume reviews, career roadmaps — no fluff, just results.
              </motion.p>

              <motion.div variants={UP} style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/explore" className="btn btn-dark btn-lg">
                    Find a Mentor <ArrowRight size={17} />
                  </Link>
                </motion.div>
                {!user && (
                  <Link to="/register" className="btn-arrow btn-arrow-coral">
                    Become a Mentor <ArrowUpRight size={15} />
                  </Link>
                )}
              </motion.div>

              {/* Trust row */}
              <motion.div variants={UP} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(n => <Star key={n} size={13} color="#F59E0B" fill="#F59E0B" />)}
                </div>
                <span className="t-sm">Trusted by <strong style={{ color: 'var(--ink)' }}>2,400+</strong> students across India</span>
              </motion.div>
            </motion.div>

            {/* Right — floating profile card */}
            <motion.div
              variants={LEFT}
              initial="hidden"
              animate="show"
              style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
            >
              {/* Main card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  background: 'var(--white)',
                  border: '1.5px solid var(--sand)',
                  borderRadius: '24px',
                  padding: '2rem',
                  maxWidth: 340,
                  width: '100%',
                  boxShadow: '0 24px 60px rgba(13,13,13,0.1), 0 8px 24px rgba(13,13,13,0.05)'
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--pale)', border: '2px solid var(--sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--coral)', flexShrink: 0 }}>R</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Rahul Verma</div>
                    <div className="t-sm">Senior SDE at Google</div>
                  </div>
                  <div style={{ marginLeft: 'auto', background: 'var(--coral-pale)', border: '1px solid rgba(232,93,74,0.2)', borderRadius: 'var(--r-pill)', padding: '0.2rem 0.6rem', fontSize: '0.68rem', fontFamily: 'var(--f-mono)', color: 'var(--coral-dark)' }}>Available</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  {['System Design', 'DSA', 'FAANG Prep'].map(s => <span key={s} className="tag">{s}</span>)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--sand)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--f-display)', fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.02em' }}>₹800</div>
                    <div className="t-xs">per 30 min</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>4.9</span>
                    <span className="t-xs">(47)</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                style={{ position: 'absolute', top: -20, right: 0, background: 'var(--coral)', borderRadius: 'var(--r-pill)', padding: '0.65rem 1.1rem', color: 'var(--white)', fontSize: '0.82rem', fontWeight: 600, boxShadow: '0 8px 24px rgba(232,93,74,0.35)', whiteSpace: 'nowrap' }}
              >
                Session booked ✓
              </motion.div>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                style={{ position: 'absolute', bottom: -12, left: -16, background: 'var(--white)', border: '1.5px solid var(--sand)', borderRadius: 'var(--r-xl)', padding: '0.75rem 1rem', boxShadow: '0 12px 32px rgba(13,13,13,0.1)', maxWidth: 200 }}
              >
                <div style={{ display: 'flex', gap: 2, marginBottom: '0.3rem' }}>
                  {[1,2,3,4,5].map(n => <Star key={n} size={10} color="#F59E0B" fill="#F59E0B" />)}
                </div>
                <div style={{ fontSize: '0.78rem', fontStyle: 'italic', color: 'var(--ink-mid)' }}>"Got the Google offer!"</div>
                <div className="t-xs" style={{ marginTop: '0.2rem' }}>— Rohan, SDE 2</div>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', marginTop: '5rem', opacity: 0.35 }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            <span className="eyebrow" style={{ fontSize: '0.58rem' }}>Scroll to explore</span>
            <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, var(--coral))' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════ MARQUEE STRIP — jointalent style ═══════════ */}
      <div style={{ borderTop: '1px solid var(--sand)', borderBottom: '1px solid var(--sand)', background: 'var(--off-white)', padding: '1.1rem 0', overflow: 'hidden' }}>
        <div className="marquee-track">
          <div className="marquee-inner">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="m-item">
                <span className="m-sep">◆</span> {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ SMART. SCALABLE. STRATEGIC. — section intro ═══════════ */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'end' }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={STAGGER}>
              <motion.div variants={UP}>
                <h2 className="t-section">
                  Smart<span className="dot">.</span> Targeted<span className="dot">.</span><br />
                  <span className="ital">Effective.</span>
                </h2>
              </motion.div>
            </motion.div>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={UP}>
              <p className="t-lead" style={{ marginBottom: '2rem' }}>
                Our alumni and their knowledge empower students to access, accelerate and realise their career ambitions — through the power of real conversation.
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link to="/explore" className="btn btn-outline">Browse All Mentors</Link>
              </motion.div>
            </motion.div>
          </div>

          {/* 4 stats */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={STAGGER_SM}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginTop: '5rem', borderTop: '1px solid var(--sand)', borderLeft: '1px solid var(--sand)' }}
          >
            {STATS.map((s, i) => (
              <motion.div key={i} variants={UP} style={{ padding: '2.5rem 2rem', borderRight: '1px solid var(--sand)', borderBottom: '1px solid var(--sand)', textAlign: 'left' }}>
                <div className="stat-num">
                  <Counter end={s.num} />
                  <span className="stat-unit">{s.unit}</span>
                </div>
                <div className="stat-lbl">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ SOLUTIONS — vertical accordion style ═══════════ */}
      <section className="section" style={{ background: 'var(--off-white)', borderTop: '1px solid var(--sand)', borderBottom: '1px solid var(--sand)' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={STAGGER}>
            <motion.div variants={UP} style={{ marginBottom: '4rem' }}>
              <span className="eyebrow" style={{ marginBottom: '1rem' }}>What we offer</span>
              <h2 className="t-section">
                Discover Our<br /><span className="ital">Solutions</span><span className="dot">.</span>
              </h2>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {SOLUTIONS.map((s, i) => (
                <motion.div
                  key={i}
                  variants={UP}
                  style={{ borderTop: '1px solid var(--sand)', padding: '2.5rem 0', display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '2rem', alignItems: 'start', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                  whileHover={{ backgroundColor: 'rgba(232, 93, 74, 0.02)' }}
                >
                  <span className="eyebrow-coral" style={{ paddingTop: '0.2rem' }}>{s.label}</span>
                  <div>
                    <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.5rem', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: '0.75rem', transition: 'color 0.2s' }}>
                      {s.title}
                    </h3>
                    <p className="t-body" style={{ maxWidth: 540 }}>{s.body}</p>
                  </div>
                  <Link to="/explore" className="btn-arrow btn-arrow-coral hide-mob" style={{ alignSelf: 'center', minWidth: 180, justifyContent: 'flex-end' }}>
                    {s.cta} <ArrowUpRight size={14} />
                  </Link>
                  {/* Bottom line hover */}
                  <motion.div
                    style={{ position: 'absolute', bottom: 0, left: 0, height: '1px', background: 'var(--coral)', transformOrigin: 'left', scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.div>
              ))}
              <div style={{ borderTop: '1px solid var(--sand)' }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ TRANSFORMATIVE. TAILORED. TRUSTED. ═══════════ */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={RIGHT}>
              <span className="eyebrow" style={{ marginBottom: '1.25rem' }}>Why it works</span>
              <h2 className="t-section">
                Transformative<span className="dot">.</span><br />
                Tailored<span className="dot">.</span><br />
                <span className="ital">Trusted</span><span className="dot">.</span>
              </h2>
              <p className="t-lead" style={{ marginTop: '1.75rem', marginBottom: '2.5rem' }}>
                AlumniBridge invests in building real connections, not just bookings. Every interaction is designed for genuine outcomes.
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link to="/register" className="btn btn-coral btn-lg">Get Started <ArrowRight size={16} /></Link>
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={LEFT}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--sand)' }}>
                {[
                  { t: 'Verified Alumni Network', b: 'Every mentor profile is manually reviewed. Real companies, real experience, real value.' },
                  { t: 'AI-Matched Pairing', b: 'We help match students to the right alumni based on goals, background, and target companies.' },
                  { t: 'Secure Payments', b: 'Razorpay-protected checkout. Funds held until session completion — zero risk for students.' },
                  { t: 'Outcomes Guarantee', b: 'Not satisfied after your first session? We make it right. Your growth is our responsibility.' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{ background: 'var(--white)', padding: '1.75rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start', cursor: 'default' }}
                    whileHover={{ backgroundColor: 'var(--off-white)' }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--coral-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.1rem' }}>
                      <CheckCircle size={15} color="var(--coral)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.35rem' }}>{item.t}</div>
                      <p className="t-sm">{item.b}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="section" style={{ background: 'var(--ink)' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={STAGGER}>
            <motion.div variants={UP} style={{ marginBottom: '5rem' }}>
              <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>The Process</span>
              <h2 className="t-section" style={{ color: 'var(--white)' }}>
                How<span style={{ color: 'var(--coral)' }}>.</span> It<span style={{ color: 'var(--coral)' }}>.</span> <span style={{ fontStyle: 'italic' }}>Works</span><span style={{ color: 'var(--coral)' }}>.</span>
              </h2>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
              {PROCESS.map((p, i) => (
                <motion.div key={i} variants={UP}
                  style={{ padding: '2.5rem 2rem', borderRight: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <div style={{ fontFamily: 'var(--f-display)', fontSize: '3.5rem', fontWeight: 900, color: 'rgba(232,93,74,0.15)', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '1.25rem' }}>{p.n}</div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--coral)', marginBottom: '0.75rem' }}>{p.n}</div>
                  <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--white)', marginBottom: '0.75rem', letterSpacing: '-0.015em' }}>{p.t}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{p.b}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS — editorial ═══════════ */}
      <section className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={STAGGER}>
            <motion.div variants={UP} style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <span className="eyebrow" style={{ marginBottom: '1rem' }}>Proven Outcomes</span>
                <h2 className="t-section">
                  Real Students<span className="dot">.</span><br />
                  <span className="ital">Real Results.</span>
                </h2>
              </div>
              <Link to="/explore" className="btn-arrow">View All Mentors <ArrowRight size={15} /></Link>
            </motion.div>

            <div className="g3">
              {[
                { q: 'Got my Google offer within 3 months of starting sessions. The system design practice was exactly what I needed.', name: 'Rohan Mehta', role: 'SDE 2 at Google', rating: 5, co: 'Google' },
                { q: 'My resume went from zero callbacks to 8 interviews in 2 weeks. The line-by-line review was brutal but brilliant.', name: 'Priya Sharma', role: 'Data Scientist at Meesho', rating: 5, co: 'Meesho' },
                { q: 'The mock interviews were brutally honest — which is exactly what I needed. Cracked CRED and Razorpay.', name: 'Aditya Patel', role: 'PM at Razorpay', rating: 5, co: 'Razorpay' },
              ].map((t, i) => (
                <motion.div key={i} variants={UP} whileHover={{ y: -5, transition: { duration: 0.25 } }}>
                  <div className="card" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem', transition: 'box-shadow 0.25s' }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {Array.from({ length: t.rating }).map((_, n) => <Star key={n} size={13} color="#F59E0B" fill="#F59E0B" />)}
                    </div>
                    <p style={{ fontFamily: 'var(--f-display)', fontSize: '1.05rem', fontWeight: 400, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.55, flex: 1 }}>"{t.q}"</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--sand)', paddingTop: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.87rem' }}>{t.name}</div>
                        <div className="t-xs" style={{ marginTop: '0.15rem' }}>{t.role}</div>
                      </div>
                      <div style={{ fontFamily: 'var(--f-mono)', fontSize: '0.65rem', color: 'var(--coral)', background: 'var(--coral-pale)', padding: '0.2rem 0.6rem', borderRadius: 'var(--r-pill)', border: '1px solid rgba(232,93,74,0.2)' }}>{t.co}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section style={{ background: 'var(--pale)', borderTop: '1px solid var(--sand)', padding: '10rem 0', position: 'relative', overflow: 'hidden' }}>
        {/* Big decorative text */}
        <div style={{ position: 'absolute', bottom: '-2rem', right: '-2rem', fontFamily: 'var(--f-display)', fontSize: '18rem', fontWeight: 900, color: 'rgba(232,93,74,0.04)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.05em' }}>AB</div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
            variants={STAGGER}
            style={{ maxWidth: 760 }}
          >
            <motion.div variants={UP}>
              <span className="eyebrow-coral" style={{ marginBottom: '1.5rem' }}>Start today</span>
            </motion.div>
            <motion.h2 variants={UP} className="t-hero" style={{ marginBottom: '1.75rem', lineHeight: 0.95 }}>
              Streamline Your<br />Career{' '}
              <span className="ital" style={{ color: 'var(--coral)' }}>Trajectory</span>
              <span className="dot">.</span>
            </motion.h2>
            <motion.p variants={UP} className="t-lead" style={{ maxWidth: 520, marginBottom: '2.5rem' }}>
              Discover how alumni mentorship can accelerate your career goals — one focused conversation at a time.
            </motion.p>
            <motion.div variants={UP} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/explore" className="btn btn-dark btn-xl">Find Your Mentor <ArrowRight size={18} /></Link>
              </motion.div>
              {!user && (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/register" className="btn btn-outline btn-xl">Create Free Account</Link>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--ink)', padding: '4rem 0 2.5rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: '1.3rem', color: 'var(--white)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--coral)', display: 'inline-block' }} />
                AlumniBridge
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, maxWidth: 280 }}>Where ambition meets experience. Real mentorship from real professionals.</p>
            </div>
            <div>
              <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1.25rem' }}>Platform</div>
              {['Find Mentors', 'Become a Mentor', 'How it Works', 'Pricing'].map(l => (
                <div key={l}><Link to="/explore" style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', display: 'block', padding: '0.3rem 0', transition: 'color 0.18s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--white)'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
                >{l}</Link></div>
              ))}
            </div>
            <div>
              <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1.25rem' }}>Company</div>
              {['About Us', 'Blog', 'Careers', 'Contact'].map(l => (
                <div key={l}><Link to="/" style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', display: 'block', padding: '0.3rem 0', transition: 'color 0.18s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--white)'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
                >{l}</Link></div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>© 2024 AlumniBridge. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {['Privacy Policy', 'Terms of Service'].map(l => (
                <Link key={l} to="/" style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
