import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { STAGGER, UP } from '../hooks/motion'

// ── LoginPage ────────────────────────────────────────────────────
export function LoginPage() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async e => {
    e.preventDefault(); setBusy(true)
    try {
      const d = await login(form)
      toast.success(`Welcome back, ${d.user.name.split(' ')[0]}!`)
      nav(d.user.role === 'alumni' ? '/dashboard/alumni' : '/dashboard/student')
    } catch (err) { toast.error(err.message) }
    finally { setBusy(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'calc(var(--nav-h) + 3rem) 1.5rem 5rem' }}>
      {/* Left decorative panel (desktop) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', maxWidth: 900, width: '100%', gap: 0, boxShadow: '0 32px 80px rgba(13,13,13,0.1)', borderRadius: 24, overflow: 'hidden' }}>
        {/* Left panel */}
        <div style={{ background: 'var(--ink)', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: 240, height: 240, borderRadius: '50%', background: 'rgba(232,93,74,0.1)', pointerEvents: 'none' }} />
          <div>
            <Link to="/" style={{ textDecoration: 'none', fontFamily: 'var(--f-display)', fontSize: '1.15rem', color: 'var(--white)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '4rem' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--coral)', display: 'inline-block' }} />
              AlumniBridge
            </Link>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: '2.2rem', fontWeight: 400, color: 'var(--white)', lineHeight: 1.1, letterSpacing: '-0.025em', marginBottom: '1rem' }}>
              Where ambition<br />meets <span style={{ fontStyle: 'italic', color: 'var(--coral)' }}>experience.</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>Real mentorship from working professionals. Sign in to continue your journey.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            {[1,2,3,4,5].map(n => <span key={n} style={{ fontSize: '0.85rem', color: '#F59E0B' }}>★</span>)}
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginLeft: '0.3rem' }}>2,400+ sessions completed</span>
          </div>
        </div>

        {/* Right — form */}
        <div style={{ background: 'var(--white)', padding: '4rem' }}>
          <motion.div variants={STAGGER} initial="hidden" animate="show">
            <motion.div variants={UP} style={{ marginBottom: '2.25rem' }}>
              <h1 style={{ fontFamily: 'var(--f-display)', fontSize: '1.8rem', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
                Welcome back<span style={{ color: 'var(--coral)' }}>.</span>
              </h1>
              <p className="t-sm">
                New here? <Link to="/register" style={{ color: 'var(--coral)', textDecoration: 'none', fontWeight: 600 }}>Create an account</Link>
              </p>
            </motion.div>

            <motion.form variants={UP} onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="you@college.edu" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={show ? 'text' : 'password'} className="form-input" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required style={{ paddingRight: '3rem' }} />
                  <button type="button" onClick={() => setShow(v => !v)} style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-light)' }}>
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <motion.button type="submit" className="btn btn-dark btn-full btn-lg" disabled={busy} whileTap={{ scale: 0.97 }} style={{ marginTop: '0.25rem' }}>
                {busy ? <span className="spinner" style={{ borderTopColor: 'var(--white)' }} /> : <>Sign In <ArrowRight size={16} /></>}
              </motion.button>
            </motion.form>

            {/* Demo */}
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--off-white)', border: '1px solid var(--sand)', borderRadius: 'var(--r-lg)' }}>
              <div className="eyebrow" style={{ marginBottom: '0.5rem', fontSize: '0.6rem' }}>Demo Accounts</div>
              <div className="t-xs" style={{ lineHeight: 2.2 }}>
                student@test.com / password123<br />alumni@test.com / password123
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ── RegisterPage ────────────────────────────────────────────────────
import { GraduationCap, Briefcase } from 'lucide-react'

export function RegisterPage() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: params.get('role') || 'student', college: '' })
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)

  const strength = form.password.length >= 10 ? 4 : form.password.length >= 8 ? 3 : form.password.length >= 6 ? 2 : form.password.length > 0 ? 1 : 0
  const sColors = ['var(--sand)', '#EF4444', '#F59E0B', '#84CC16', 'var(--coral)']

  const submit = async e => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password too short'); return }
    setBusy(true)
    try {
      const d = await register(form)
      toast.success(`Welcome, ${d.user.name.split(' ')[0]}! 🎉`)
      nav(d.user.role === 'alumni' ? '/profile/alumni' : '/dashboard/student')
    } catch (err) { toast.error(err.message) }
    finally { setBusy(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'calc(var(--nav-h) + 3rem) 1.5rem 5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', maxWidth: 960, width: '100%', gap: 0, boxShadow: '0 32px 80px rgba(13,13,13,0.1)', borderRadius: 24, overflow: 'hidden' }}>
        {/* Left */}
        <div style={{ background: 'var(--coral)', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
          <div>
            <Link to="/" style={{ textDecoration: 'none', fontFamily: 'var(--f-display)', fontSize: '1.15rem', color: 'var(--white)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '4rem' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--white)', display: 'inline-block' }} />
              AlumniBridge
            </Link>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: '2rem', fontWeight: 400, color: 'var(--white)', lineHeight: 1.1, letterSpacing: '-0.025em', marginBottom: '1rem' }}>
              Join thousands<br />finding their<br /><span style={{ fontStyle: 'italic' }}>dream careers.</span>
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {['Verified alumni mentors', 'Secure Razorpay payments', '500+ experts across all fields'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)' }}>
                <span style={{ fontSize: '0.6rem' }}>◆</span> {item}
              </div>
            ))}
          </div>
        </div>

        {/* Right form */}
        <div style={{ background: 'var(--white)', padding: '4rem' }}>
          <motion.div variants={STAGGER} initial="hidden" animate="show">
            <motion.div variants={UP} style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontFamily: 'var(--f-display)', fontSize: '1.8rem', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
                Join AlumniBridge<span style={{ color: 'var(--coral)' }}>.</span>
              </h1>
              <p className="t-sm">Already have an account? <Link to="/login" style={{ color: 'var(--coral)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link></p>
            </motion.div>

            <motion.form variants={UP} onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Role */}
              <div className="form-group">
                <label className="form-label">I am a</label>
                <div className="g2">
                  {[
                    { v: 'student', l: 'Student', sub: 'Seeking guidance', icon: <GraduationCap size={16} /> },
                    { v: 'alumni', l: 'Alumni', sub: 'Ready to mentor', icon: <Briefcase size={16} /> },
                  ].map(r => (
                    <motion.button key={r.v} type="button"
                      onClick={() => setForm(f => ({ ...f, role: r.v }))}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        background: form.role === r.v ? 'var(--coral-pale)' : 'var(--off-white)',
                        border: `1.5px solid ${form.role === r.v ? 'var(--coral)' : 'var(--sand)'}`,
                        borderRadius: 'var(--r-lg)', padding: '0.9rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ color: form.role === r.v ? 'var(--coral)' : 'var(--ink-light)', marginBottom: '0.3rem' }}>{r.icon}</div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: form.role === r.v ? 'var(--coral-dark)' : 'var(--ink)' }}>{r.l}</div>
                      <div className="t-xs" style={{ marginTop: 2 }}>{r.sub}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" placeholder="Arjun Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="arjun@iit.ac.in" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">College</label>
                <input type="text" className="form-input" placeholder="IIT Bombay, VIT, BITS…" value={form.college} onChange={e => setForm(f => ({ ...f, college: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={show ? 'text' : 'password'} className="form-input" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required style={{ paddingRight: '3rem' }} />
                  <button type="button" onClick={() => setShow(v => !v)} style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-light)' }}>
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[1,2,3,4].map(n => (
                    <motion.div key={n} style={{ flex: 1, height: 2, borderRadius: 99 }}
                      animate={{ background: strength >= n ? sColors[strength] : 'var(--sand)' }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </div>

              <motion.button type="submit" className="btn btn-dark btn-full btn-lg" disabled={busy} whileTap={{ scale: 0.97 }} style={{ marginTop: '0.25rem' }}>
                {busy ? <span className="spinner" style={{ borderTopColor: 'var(--white)' }} /> : <>Create Account <ArrowRight size={16} /></>}
              </motion.button>
              <p className="t-xs" style={{ textAlign: 'center' }}>By registering you agree to our Terms of Service.</p>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
