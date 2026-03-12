// ── LoginPage ────────────────────────────────────────────────
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { STAGGER, UP } from '../hooks/motion'

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
    <div style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'calc(var(--nav-h) + 2rem) 1.5rem 4rem', position: 'relative', overflow: 'hidden' }}>
      <div className="noise-overlay" />
      <motion.div className="orb" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%)', top: '-100px', right: '-100px' }}
        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div variants={STAGGER} initial="hidden" animate="show" style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 2 }}>
        <motion.div variants={UP} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none', fontFamily: 'var(--f-display)', fontSize: '1.3rem', color: 'var(--t-primary)', fontWeight: 300 }}>AlumniBridge</Link>
          <h1 className="display-md" style={{ marginTop: '1.5rem', marginBottom: '0.4rem' }}>
            Welcome <span className="swash" style={{ fontStyle: 'italic' }}>back.</span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--t-muted)' }}>
            New here? <Link to="/register" style={{ color: 'var(--volt)', textDecoration: 'none', fontWeight: 600 }}>Create an account</Link>
          </p>
        </motion.div>

        <motion.div variants={UP}>
          <form onSubmit={submit}>
            <div className="card" style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(109,40,217,0.07)' }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="you@college.edu" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={show ? 'text' : 'password'} className="form-input" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required style={{ paddingRight: '3rem' }} />
                  <button type="button" onClick={() => setShow(v => !v)} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t-muted)' }}>
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <motion.button type="submit" className="btn btn-volt btn-full btn-lg" disabled={busy} whileTap={{ scale: 0.97 }} style={{ marginTop: '0.4rem' }}>
                {busy ? <span className="spinner" /> : <>Sign In <ArrowRight size={16} /></>}
              </motion.button>
            </div>
          </form>
        </motion.div>

        <motion.div variants={UP} style={{ marginTop: '1.25rem', padding: '1rem 1.25rem', background: 'rgba(184,255,87,0.04)', border: '1px solid rgba(184,255,87,0.12)', borderRadius: 'var(--r-xl)' }}>
          <div className="label" style={{ marginBottom: '0.45rem', fontSize: '0.58rem' }}>Demo Accounts</div>
          <div className="label-dim" style={{ fontSize: '0.7rem', lineHeight: 2.1 }}>
            student@test.com / password123<br />alumni@test.com / password123
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

// ── RegisterPage ─────────────────────────────────────────────
import { useSearchParams } from 'react-router-dom'
import { GraduationCap, Briefcase } from 'lucide-react'

export function RegisterPage() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: params.get('role') || 'student', college: '' })
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)

  const strength = form.password.length >= 10 ? 4 : form.password.length >= 8 ? 3 : form.password.length >= 6 ? 2 : form.password.length > 0 ? 1 : 0
  const sColors = ['var(--ink-3)', '#EF4444', '#F59E0B', '#A78BFA', 'var(--volt)']

  const submit = async e => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password needs at least 6 characters'); return }
    setBusy(true)
    try {
      const d = await register(form)
      toast.success(`Welcome, ${d.user.name.split(' ')[0]}! 🎉`)
      nav(d.user.role === 'alumni' ? '/profile/alumni' : '/dashboard/student')
    } catch (err) { toast.error(err.message) }
    finally { setBusy(false) }
  }

  return (
    <div style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'calc(var(--nav-h) + 2rem) 1.5rem 4rem', position: 'relative', overflow: 'hidden' }}>
      <div className="noise-overlay" />
      <motion.div className="orb" style={{ width: 450, height: 450, background: 'radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)', top: '-50px', left: '-100px' }}
        animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 9, repeat: Infinity }}
      />

      <motion.div variants={STAGGER} initial="hidden" animate="show" style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 2 }}>
        <motion.div variants={UP} style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <Link to="/" style={{ textDecoration: 'none', fontFamily: 'var(--f-display)', fontSize: '1.3rem', color: 'var(--t-primary)', fontWeight: 300 }}>AlumniBridge</Link>
          <h1 className="display-md" style={{ marginTop: '1.5rem', marginBottom: '0.4rem' }}>
            Join <span className="swash" style={{ fontStyle: 'italic' }}>AlumniBridge.</span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--t-muted)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--volt)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </motion.div>

        <motion.div variants={UP}>
          <form onSubmit={submit}>
            <div className="card" style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(109,40,217,0.07)' }}>

              {/* Role selector */}
              <div className="form-group">
                <label className="form-label">I am a</label>
                <div className="g2">
                  {[
                    { v: 'student', l: 'Student', sub: 'Looking for guidance', icon: <GraduationCap size={16} /> },
                    { v: 'alumni',  l: 'Alumni',  sub: 'Ready to mentor',      icon: <Briefcase size={16} /> },
                  ].map(r => (
                    <motion.button key={r.v} type="button"
                      onClick={() => setForm(f => ({ ...f, role: r.v }))}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        background: form.role === r.v ? 'rgba(184,255,87,0.08)' : 'var(--ink-2)',
                        border: `1px solid ${form.role === r.v ? 'rgba(184,255,87,0.25)' : 'var(--b-subtle)'}`,
                        borderRadius: 'var(--r-lg)', padding: '1rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ color: form.role === r.v ? 'var(--volt)' : 'var(--t-muted)', marginBottom: '0.4rem' }}>{r.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: form.role === r.v ? 'var(--volt)' : 'var(--t-primary)' }}>{r.l}</div>
                      <div className="label-dim" style={{ fontSize: '0.58rem', marginTop: 2 }}>{r.sub}</div>
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
                <input type="email" className="form-input" placeholder="arjun@college.edu" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">College</label>
                <input type="text" className="form-input" placeholder="IIT Bombay, VIT, BITS…" value={form.college} onChange={e => setForm(f => ({ ...f, college: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={show ? 'text' : 'password'} className="form-input" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required style={{ paddingRight: '3rem' }} />
                  <button type="button" onClick={() => setShow(v => !v)} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t-muted)' }}>
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 3, marginTop: '0.35rem' }}>
                  {[1,2,3,4].map(n => (
                    <motion.div key={n} style={{ flex: 1, height: 2.5, borderRadius: 99 }}
                      animate={{ background: strength >= n ? sColors[strength] : 'var(--ink-3)' }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </div>

              <motion.button type="submit" className="btn btn-volt btn-full btn-lg" disabled={busy} whileTap={{ scale: 0.97 }} style={{ marginTop: '0.4rem' }}>
                {busy ? <span className="spinner" /> : <>Create Account <ArrowRight size={16} /></>}
              </motion.button>
              <p style={{ fontSize: '0.7rem', color: 'var(--t-faint)', textAlign: 'center' }}>By registering you agree to our Terms of Service.</p>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginPage
