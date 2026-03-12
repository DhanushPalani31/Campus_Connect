import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { alumniApi, sessionApi, payApi } from '../api'
import { Loader } from '../components'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { ArrowRight, Clock, CreditCard, Calendar } from 'lucide-react'
import { STAGGER, UP, LEFT } from '../hooks/motion'

const TOPICS = ['DSA & Algorithms', 'System Design', 'Resume Review', 'Mock Interview', 'Career Guidance', 'FAANG Prep', 'Product Management', 'Data Science', 'Startup Advice', 'Other']

export default function BookSessionPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const nav = useNavigate()
  const [alumni, setAlumni] = useState(null)
  const [busy, setBusy] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    scheduledAt: '',
    duration: 30,
    topic: '',
    message: '',
  })

  useEffect(() => {
    if (!user || user.role !== 'student') { nav('/login'); return }
    alumniApi.one(id).then(d => setAlumni(d.alumni)).catch(() => { toast.error('Alumni not found'); nav('/explore') }).finally(() => setBusy(false))
  }, [id])

  const rate = alumni?.sessionRate || 0
  const amount = form.duration === 30 ? rate : rate * 2

  const handlePay = async e => {
    e.preventDefault()
    if (!form.scheduledAt || !form.topic) { toast.error('Please fill all required fields'); return }
    setSubmitting(true)
    try {
      // Create session
      const sess = await sessionApi.create({
        alumni: id,
        scheduledAt: form.scheduledAt,
        duration: form.duration,
        topic: form.topic,
        message: form.message,
      })

      // Create Razorpay order
      const order = await payApi.order({ sessionId: sess.session._id, amount })

      // Load Razorpay
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(script)
      script.onload = () => {
        const rzp = new window.Razorpay({
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || order.keyId,
          amount: order.amount,
          currency: 'INR',
          name: 'AlumniBridge',
          description: `Session: ${form.topic}`,
          order_id: order.orderId,
          handler: async res => {
            try {
              await payApi.verify({ ...res, sessionId: sess.session._id })
              toast.success('Session booked & payment successful! 🎉')
              nav('/sessions/my')
            } catch { toast.error('Payment verification failed') }
          },
          prefill: { name: user.name, email: user.email },
          theme: { color: '#B8FF57' },
          modal: { ondismiss: () => toast('Payment cancelled', { icon: '⚠️' }) }
        })
        rzp.open()
      }
    } catch (err) { toast.error(err.message) }
    finally { setSubmitting(false) }
  }

  if (busy) return <div className="page"><Loader /></div>
  if (!alumni) return null

  const minDate = new Date(Date.now() + 2 * 3600 * 1000).toISOString().slice(0, 16)

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <motion.div variants={STAGGER} initial="hidden" animate="show">
          <motion.div variants={UP} style={{ marginBottom: '2.5rem' }}>
            <div className="label" style={{ marginBottom: '0.75rem' }}>Book Session</div>
            <h1 className="display-md">
              Session with <span className="swash" style={{ fontStyle: 'italic', color: 'var(--volt)' }}>{alumni.user?.name}</span>
            </h1>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '3rem', alignItems: 'start' }}>

            {/* Form */}
            <motion.div variants={UP}>
              <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>

                {/* Topic */}
                <div className="form-group">
                  <label className="form-label">Session Topic *</label>
                  <select className="form-input" value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} required>
                    <option value="">Select a topic…</option>
                    {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Duration */}
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {[30, 60].map(d => (
                      <motion.button key={d} type="button"
                        onClick={() => setForm(f => ({ ...f, duration: d }))}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          flex: 1, padding: '1rem', borderRadius: 'var(--r-lg)',
                          background: form.duration === d ? 'rgba(184,255,87,0.1)' : 'var(--ink-2)',
                          border: `1px solid ${form.duration === d ? 'rgba(184,255,87,0.3)' : 'var(--b-subtle)'}`,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem',
                          color: form.duration === d ? 'var(--volt)' : 'var(--t-secondary)',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Clock size={14} />
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{d} minutes</div>
                          <div className="label-dim" style={{ fontSize: '0.58rem', marginTop: 1, color: form.duration === d ? 'rgba(184,255,87,0.6)' : undefined }}>₹{d === 30 ? rate : rate * 2}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="form-group">
                  <label className="form-label">Preferred Date & Time *</label>
                  <input type="datetime-local" className="form-input" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} min={minDate} required
                    style={{ colorScheme: 'dark' }}
                  />
                </div>

                {/* Message */}
                <div className="form-group">
                  <label className="form-label">Message to Mentor (optional)</label>
                  <textarea className="form-input" placeholder="What's your specific goal for this session? Any context helps the mentor prepare." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4} />
                </div>

                <motion.button
                  type="submit"
                  className="btn btn-volt btn-lg"
                  disabled={submitting}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.03 }}
                >
                  {submitting ? <span className="spinner" /> : <><CreditCard size={16} /> Pay ₹{amount} & Book</>}
                </motion.button>
                <p style={{ fontSize: '0.73rem', color: 'var(--t-faint)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: 'var(--volt)', fontSize: '0.8rem' }}>🔒</span> Secured by Razorpay. Money held until session completes.
                </p>
              </form>
            </motion.div>

            {/* Summary */}
            <motion.div variants={LEFT} initial="hidden" animate="show" style={{ position: 'sticky', top: 'calc(var(--nav-h) + 1.5rem)' }}>
              <div className="card" style={{ padding: '1.75rem' }}>
                <div className="label" style={{ marginBottom: '1.25rem' }}>Booking Summary</div>
                <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--b-subtle)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'var(--ink-3)', border: '1px solid var(--b-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-display)', fontSize: '1.1rem', color: 'var(--volt)', flexShrink: 0, fontWeight: 300, overflow: 'hidden' }}>
                    {alumni.user?.profilePhoto ? <img src={alumni.user.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : alumni.user?.name?.[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--t-primary)' }}>{alumni.user?.name}</div>
                    <div style={{ fontSize: '0.77rem', color: 'var(--t-muted)', marginTop: '0.15rem' }}>{alumni.currentRole}{alumni.company ? ` · ${alumni.company}` : ''}</div>
                  </div>
                </div>
                {[
                  { l: 'Duration', v: `${form.duration} minutes` },
                  { l: 'Topic', v: form.topic || '—' },
                  form.scheduledAt && { l: 'Date', v: new Date(form.scheduledAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
                ].filter(Boolean).map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', fontSize: '0.82rem', borderBottom: i < 2 ? '1px solid var(--b-subtle)' : 'none' }}>
                    <span className="label-dim" style={{ fontSize: '0.6rem' }}>{row.l}</span>
                    <span style={{ color: 'var(--t-secondary)', textAlign: 'right', maxWidth: '60%' }}>{row.v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', marginTop: '0.5rem', borderTop: '1px solid var(--b-mid)' }}>
                  <span className="label-dim">Total</span>
                  <span style={{ fontFamily: 'var(--f-display)', fontSize: '1.5rem', fontWeight: 300, color: 'var(--volt)', letterSpacing: '-0.02em' }}>₹{amount}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
