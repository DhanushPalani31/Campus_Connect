import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { ArrowRight, Star, Zap, Shield, TrendingUp, Award, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { UP, STAGGER, SCALE, RIGHT, LEFT } from '../hooks/motion'

const TAGS = ['Mock Interviews', 'Resume Review', 'System Design', 'DSA Coaching', 'Career Roadmap', 'FAANG Prep', 'Product Management', 'Startup Mentorship', 'Data Science', 'DevOps', 'Placement Guidance', 'Networking']

const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Razorpay', 'CRED', 'PhonePe', 'Swiggy', 'Zomato', 'Meesho', 'Atlassian', 'Adobe']

const STEPS = [
  { num: '01', title: 'Browse alumni', body: 'Filter by skill, company, experience, and session rate. Every profile is verified.' },
  { num: '02', title: 'Pick a slot', body: 'Book a 30 or 60-minute session that works for your schedule.' },
  { num: '03', title: 'Pay securely', body: 'Razorpay-protected payments. Your money is held safely until the session completes.' },
  { num: '04', title: 'Get clarity', body: 'Walk out with a concrete action plan, not just inspiration.' },
]

const TESTIMONIALS = [
  { q: 'Got my Google offer after 3 sessions. The system design prep was exactly what I needed.', name: 'Rohan M.', role: 'SDE at Google', rating: 5 },
  { q: 'My resume went from zero callbacks to 8 interviews in two weeks after the review session.', name: 'Priya K.', role: 'Data Scientist at Meesho', rating: 5 },
  { q: 'The mock interview feedback was brutally honest and completely accurate. Worth every rupee.', name: 'Aditya S.', role: 'PM at Razorpay', rating: 5 },
]

// Animated number
function Counter({ end, suffix = '', prefix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const dur = 1800
    const step = 16
    const inc = end / (dur / step)
    const t = setInterval(() => {
      start += inc
      if (start >= end) { setVal(end); clearInterval(t) }
      else setVal(Math.floor(start))
    }, step)
    return () => clearInterval(t)
  }, [inView, end])
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>
}

export default function LandingPage() {
  const { user } = useAuth()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section ref={heroRef} style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Grid */}
        <div className="grid-bg" />
        <div className="noise-overlay" />

        {/* Orbs */}
        <motion.div className="orb" style={{ width: 700, height: 700, background: 'radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 65%)', top: '-200px', right: '-150px' }}
          animate={{ scale: [1, 1.12, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="orb" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(184,255,87,0.07) 0%, transparent 70%)', bottom: '-100px', left: '10%' }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        <motion.div className="container" style={{ y: yText, opacity, position: 'relative', zIndex: 2, paddingTop: '4rem', paddingBottom: '6rem' }}>
          <motion.div variants={STAGGER} initial="hidden" animate="show" style={{ maxWidth: 900 }}>

            {/* Eyebrow */}
            <motion.div variants={UP} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.9rem', background: 'rgba(184,255,87,0.08)', border: '1px solid rgba(184,255,87,0.22)', borderRadius: 'var(--r-pill)', marginBottom: '2.5rem' }}>
              <motion.div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--volt)', flexShrink: 0 }}
                animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="label" style={{ color: 'var(--volt)', fontSize: '0.62rem' }}>India's Alumni Mentorship Marketplace</span>
            </motion.div>

            {/* Headline — editorial split layout */}
            <motion.h1 variants={UP} className="display-xl" style={{ marginBottom: '1.75rem', lineHeight: 0.93 }}>
              Real guidance<br />
              from people<br />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                who&nbsp;
                <motion.span
                  className="swash"
                  style={{ fontStyle: 'italic', color: 'var(--volt)' }}
                  animate={{ textShadow: ['0 0 30px rgba(184,255,87,0)', '0 0 30px rgba(184,255,87,0.4)', '0 0 30px rgba(184,255,87,0)'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  made it.
                </motion.span>
              </span>
            </motion.h1>

            <motion.p variants={UP} style={{ fontSize: '1.08rem', color: 'var(--t-secondary)', maxWidth: 520, lineHeight: 1.7, marginBottom: '2.75rem', fontWeight: 300 }}>
              Paid 1:1 sessions with alumni working at India's top tech companies. Mock interviews, resume reviews, career roadmaps — no fluff.
            </motion.p>

            {/* CTA row */}
            <motion.div variants={UP} style={{ display: 'flex', gap: '0.9rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/explore" className="btn btn-volt btn-xl">
                  Find a Mentor <ArrowRight size={18} />
                </Link>
              </motion.div>
              {!user && (
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/register" className="btn btn-outline btn-xl">
                    Become a Mentor
                  </Link>
                </motion.div>
              )}
            </motion.div>

            {/* Social proof row */}
            <motion.div variants={UP} style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                <div style={{ display: 'flex' }}>
                  {['#B8FF57','#7C3AED','#F43F5E','#38BDF8','#F59E0B'].map((c, i) => (
                    <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: c, border: '2px solid var(--ink)', marginLeft: i > 0 ? -9 : 0, flexShrink: 0 }} />
                  ))}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 2 }}>{[1,2,3,4,5].map(n => <Star key={n} size={11} color="#FCD34D" fill="#FCD34D" />)}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--t-muted)', marginTop: 2 }}>2,400+ students mentored</div>
                </div>
              </div>
              <div style={{ width: 1, height: 36, background: 'var(--b-subtle)' }} />
              <div>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: '1.2rem', color: 'var(--volt)', fontWeight: 300 }}>₹850 avg</div>
                <div style={{ fontSize: '0.73rem', color: 'var(--t-muted)' }}>per session</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll down */}
        <motion.div
          style={{ position: 'absolute', bottom: '2rem', left: '50%', translateX: '-50%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', opacity: 0.35 }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, transparent, var(--volt))' }} />
        </motion.div>
      </section>

      {/* ═══════════════════ COMPANY MARQUEE ═══════════════════ */}
      <div style={{ borderTop: '1px solid var(--b-subtle)', borderBottom: '1px solid var(--b-subtle)', background: 'var(--ink-1)', padding: '1.1rem 0', overflow: 'hidden' }}>
        <div className="label-dim" style={{ textAlign: 'center', padding: '0 0 0.9rem', fontSize: '0.58rem' }}>Alumni from teams at</div>
        <div className="marquee-track">
          <div className="marquee-inner">
            {[...COMPANIES, ...COMPANIES, ...COMPANIES].map((c, i) => (
              <span key={i} className="m-item">
                <span className="m-dot">◆</span> {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <section style={{ padding: '7rem 0 5rem' }}>
        <div className="container">
          <motion.div variants={STAGGER} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="g4">
            {[
              { n: 500, s: '+', label: 'Verified Alumni', sub: 'Manually reviewed profiles' },
              { n: 2400, s: '+', label: 'Sessions Completed', sub: 'Across 60+ skills' },
              { n: 850, s: '', pre: '₹', label: 'Avg Session Rate', sub: 'For 30 minute call' },
              { n: 4.8, s: '★', label: 'Platform Rating', sub: 'From verified reviews' },
            ].map((s, i) => (
              <motion.div key={i} variants={UP} whileHover={{ y: -4, transition: { duration: 0.22 } }}>
                <div className="stat-card">
                  <div className="stat-val">
                    <Counter end={s.n} suffix={s.s} prefix={s.pre || ''} />
                  </div>
                  <div className="stat-lbl">{s.label}</div>
                  <div className="label-dim" style={{ fontSize: '0.58rem', marginTop: '0.4rem' }}>{s.sub}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section style={{ padding: '7rem 0', background: 'var(--ink-1)', borderTop: '1px solid var(--b-subtle)', borderBottom: '1px solid var(--b-subtle)', position: 'relative', overflow: 'hidden' }}>
        <motion.div className="orb" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(109,40,217,0.1) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={STAGGER}>
            <motion.div variants={UP} style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
              <div className="label" style={{ marginBottom: '1rem' }}>How it works</div>
              <h2 className="display-md">
                From <span className="swash" style={{ fontStyle: 'italic' }}>curious</span> to placed<br />in four steps.
              </h2>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {STEPS.map((s, i) => (
                <motion.div key={i} variants={UP} whileHover={{ y: -5, transition: { duration: 0.22 } }}>
                  <div style={{ padding: '2rem', background: 'var(--card)', border: '1px solid var(--b-subtle)', borderRadius: 'var(--r-xl)', height: '100%', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-8px', right: '10px', fontFamily: 'var(--f-display)', fontSize: '5rem', color: 'rgba(184,255,87,0.05)', lineHeight: 1, userSelect: 'none', fontWeight: 300 }}>{s.num}</div>
                    <div className="label" style={{ marginBottom: '1.1rem' }}>{s.num}</div>
                    <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.25rem', fontWeight: 300, color: 'var(--t-primary)', marginBottom: '0.55rem', letterSpacing: '-0.015em' }}>{s.title}</h3>
                    <p style={{ fontSize: '0.83rem', color: 'var(--t-muted)', lineHeight: 1.6 }}>{s.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ FOR ALUMNI (editorial layout) ═══════════════════ */}
      <section style={{ padding: '9rem 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={RIGHT}>
              <div className="label" style={{ marginBottom: '1.25rem' }}>For Alumni</div>
              <h2 className="display-md" style={{ marginBottom: '1.5rem' }}>
                Your experience<br />
                has a <span className="swash" style={{ fontStyle: 'italic', color: 'var(--volt)' }}>price tag.</span>
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--t-secondary)', lineHeight: 1.7, marginBottom: '2.5rem', fontWeight: 300 }}>
                Set your own rate. Choose your schedule. Earn from the knowledge you've worked years to build. Students need exactly what you know.
              </p>
              {[
                { icon: <Zap size={15} />, title: 'Set your own rate', body: 'Full control over per-session pricing in INR.' },
                { icon: <Shield size={15} />, title: 'Verified profiles', body: 'Every alumni profile manually reviewed.' },
                { icon: <TrendingUp size={15} />, title: 'Earnings dashboard', body: 'Track sessions, income, and growth over time.' },
                { icon: <Award size={15} />, title: 'Ratings & reviews', body: 'Build credibility with verified student reviews.' },
              ].map((f, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.1rem' }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 'var(--r-md)', background: 'rgba(184,255,87,0.08)', border: '1px solid rgba(184,255,87,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--volt)', flexShrink: 0 }}>
                    {f.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--t-primary)', marginBottom: '0.18rem' }}>{f.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--t-muted)' }}>{f.body}</div>
                  </div>
                </motion.div>
              ))}
              <div style={{ marginTop: '2.5rem' }}>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/register" className="btn btn-volt btn-lg">Start Mentoring <ArrowRight size={16} /></Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Dashboard mockup */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={LEFT}>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'relative' }}
              >
                <div className="card grad-border" style={{ padding: '2rem', boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 60px rgba(109,40,217,0.08)' }}>
                  <div className="label" style={{ marginBottom: '1.5rem' }}>Earnings overview</div>
                  <div className="g2" style={{ marginBottom: '1.5rem' }}>
                    {[{ l: 'This Month', v: '₹12,400' }, { l: 'Total Sessions', v: '47' }].map((s, i) => (
                      <div key={i} style={{ background: 'var(--ink-2)', borderRadius: 'var(--r-lg)', padding: '1.1rem', border: '1px solid var(--b-subtle)' }}>
                        <div style={{ fontFamily: 'var(--f-display)', fontSize: '1.6rem', fontWeight: 300, color: 'var(--volt)', letterSpacing: '-0.02em' }}>{s.v}</div>
                        <div className="label-dim" style={{ marginTop: '0.2rem' }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                  {/* Mini chart */}
                  <div className="chart" style={{ marginBottom: '0.75rem' }}>
                    {[30,50,38,72,55,88,65,92,70,80,85,100].map((h, i) => (
                      <motion.div key={i} className="c-bar"
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {['Jan','Feb','Mar','Apr'].map(m => <span key={m} className="label-dim" style={{ fontSize: '0.56rem' }}>{m}</span>)}
                  </div>
                </div>

                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  style={{ position: 'absolute', top: -20, right: -20, background: 'var(--volt)', borderRadius: 'var(--r-xl)', padding: '0.8rem 1.25rem', boxShadow: '0 8px 32px var(--glow-volt)', fontFamily: 'var(--f-display)', fontWeight: 400, color: '#0A0A10', fontSize: '0.95rem', zIndex: 2, letterSpacing: '-0.01em' }}
                >
                  ₹800/hr avg ✦
                </motion.div>

                {/* Review floating card */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  style={{ position: 'absolute', bottom: -24, left: -24, background: 'var(--ink-3)', border: '1px solid var(--b-mid)', borderRadius: 'var(--r-xl)', padding: '0.85rem 1.1rem', boxShadow: '0 12px 40px rgba(0,0,0,0.5)', zIndex: 2, maxWidth: 210 }}
                >
                  <div style={{ display: 'flex', gap: 2, marginBottom: '0.4rem' }}>
                    {[1,2,3,4,5].map(n => <Star key={n} size={10} color="#FCD34D" fill="#FCD34D" />)}
                  </div>
                  <div style={{ fontSize: '0.77rem', color: 'var(--t-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>"Best mock I've ever had. Got the offer!"</div>
                  <div className="label-dim" style={{ fontSize: '0.56rem', marginTop: '0.4rem' }}>— Rohan, Google SDE</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section style={{ padding: '7rem 0', background: 'var(--ink-1)', borderTop: '1px solid var(--b-subtle)', borderBottom: '1px solid var(--b-subtle)' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={STAGGER}>
            <motion.div variants={UP} style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div className="label" style={{ marginBottom: '1rem' }}>Testimonials</div>
              <h2 className="display-md">What students <span className="swash" style={{ fontStyle: 'italic' }}>actually say.</span></h2>
            </motion.div>
            <div className="g3">
              {TESTIMONIALS.map((t, i) => (
                <motion.div key={i} variants={UP} whileHover={{ y: -5, transition: { duration: 0.22 } }}>
                  <div className="card" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {Array.from({ length: t.rating }).map((_, n) => <Star key={n} size={12} color="#FCD34D" fill="#FCD34D" />)}
                    </div>
                    <p style={{ fontFamily: 'var(--f-display)', fontSize: '1.05rem', fontWeight: 300, fontStyle: 'italic', color: 'var(--t-primary)', lineHeight: 1.5, flex: 1 }}>"{t.q}"</p>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--t-primary)' }}>{t.name}</div>
                      <div style={{ fontSize: '0.77rem', color: 'var(--t-muted)', marginTop: '0.15rem' }}>{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ SKILLS MARQUEE ═══════════════════ */}
      <div style={{ borderBottom: '1px solid var(--b-subtle)', background: 'var(--ink)', padding: '1.25rem 0', overflow: 'hidden' }}>
        <div className="marquee-track">
          <div className="marquee-inner" style={{ animationDirection: 'reverse' }}>
            {[...TAGS, ...TAGS, ...TAGS].map((t, i) => (
              <span key={i} className="m-item"><span className="m-dot">◆</span> {t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section style={{ padding: '10rem 0', position: 'relative', overflow: 'hidden' }}>
        <motion.div className="orb" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity }}
        />
        <div className="noise-overlay" />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={STAGGER}>
            <motion.div variants={UP} className="label" style={{ marginBottom: '1.25rem' }}>Ready?</motion.div>
            <motion.h2 variants={UP} className="display-lg" style={{ maxWidth: 680, margin: '0 auto 1.5rem', letterSpacing: '-0.025em' }}>
              One conversation can<br />change your <span className="swash" style={{ fontStyle: 'italic', color: 'var(--volt)' }}>trajectory.</span>
            </motion.h2>
            <motion.p variants={UP} style={{ fontSize: '1rem', color: 'var(--t-secondary)', maxWidth: 440, margin: '0 auto 3rem', fontWeight: 300, lineHeight: 1.7 }}>
              Join thousands of students who found clarity, confidence, and their next job through real alumni mentorship.
            </motion.p>
            <motion.div variants={UP} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                <Link to="/explore" className="btn btn-volt btn-xl">Find Your Mentor <ArrowRight size={18} /></Link>
              </motion.div>
              {!user && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/register" className="btn btn-outline btn-xl">Create Free Account</Link>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--b-subtle)', padding: '2.5rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontFamily: 'var(--f-display)', fontSize: '1.1rem', fontWeight: 300, color: 'var(--t-muted)' }}>AlumniBridge</span>
          <span className="label-dim" style={{ fontSize: '0.58rem' }}>© 2024 AlumniBridge. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[['Explore', '/explore'], ['Login', '/login'], ['Register', '/register']].map(([l, p]) => (
              <Link key={l} to={p} style={{ fontSize: '0.8rem', color: 'var(--t-muted)', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = 'var(--t-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--t-muted)'}
              >{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
