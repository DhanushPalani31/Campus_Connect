import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { alumniApi, sessionApi, payApi } from '../api'
import { Loader } from '../components'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { ArrowRight, Clock, CreditCard } from 'lucide-react'
import { STAGGER, UP, LEFT } from '../hooks/motion'

const TOPICS = ['DSA & Algorithms', 'System Design', 'Resume Review', 'Mock Interview', 'Career Guidance', 'FAANG Prep', 'Product Management', 'Data Science', 'Startup Advice', 'Other']

export default function BookSessionPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const nav = useNavigate()
  const [alumni, setAlumni] = useState(null)
  const [busy, setBusy] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ scheduledAt: '', duration: 30, topic: '', message: '' })

  useEffect(() => {
    if (!user || user.role !== 'student') { nav('/login'); return }
    alumniApi.one(id)
      .then(d => setAlumni(d.alumni))
      .catch(() => { toast.error('Not found'); nav('/explore') })
      .finally(() => setBusy(false))
  }, [id])

  const rate = alumni?.sessionRate || 0
  const amount = form.duration === 30 ? rate : rate * 2
  const minDate = new Date(Date.now() + 2 * 3600 * 1000).toISOString().slice(0, 16)

  const handlePay = async e => {
    e.preventDefault()
    if (!form.scheduledAt || !form.topic) { toast.error('Please fill all required fields'); return }
    setSubmitting(true)

    try {
      // Step 1: Create session in DB
      const sess = await sessionApi.create({
        alumni: id,                     // AlumniProfile _id — matches fixed sessionController
        scheduledAt: form.scheduledAt,
        duration: form.duration,
        topic: form.topic,
        message: form.message,
      })

      // Step 2: Create Razorpay order
      const order = await payApi.order({ sessionId: sess.session._id })

      // Step 3: Load Razorpay checkout script dynamically
      await new Promise((resolve, reject) => {
        // Avoid loading script twice if already present
        if (window.Razorpay) { resolve(); return }
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = resolve
        script.onerror = () => reject(new Error('Failed to load Razorpay. Check your internet connection.'))
        document.body.appendChild(script)
      })

      // ✅ FIX 8: Was `order.keyId` — backend returns `key` (see paymentController.js line:
      // `key: process.env.RAZORPAY_KEY_ID`). Using `order.key` fixes the Razorpay
      // "Invalid key" error that caused the checkout modal to fail silently.
      // Fallback to VITE env var in case key is missing from response.
      const razorpayKey = order.key || import.meta.env.VITE_RAZORPAY_KEY_ID

      const rzp = new window.Razorpay({
        key: razorpayKey,
        amount: order.amount,           // in paise (backend already multiplied by 100)
        currency: order.currency || 'INR',
        name: 'AlumniBridge',
        description: `Session: ${form.topic}`,
        order_id: order.orderId,
        handler: async res => {
          try {
            await payApi.verify({
              razorpayOrderId: res.razorpay_order_id,
              razorpayPaymentId: res.razorpay_payment_id,
              razorpaySignature: res.razorpay_signature,
              sessionId: sess.session._id,
            })
            toast.success('Session booked! 🎉')
            nav('/sessions/my')
          } catch {
            toast.error('Payment verification failed. Contact support.')
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: '#E85D4A' },
        modal: {
          ondismiss: () => toast('Payment cancelled', { icon: '⚠️' })
        },
      })

      rzp.open()

    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (busy) return <div className="page"><Loader /></div>
  if (!alumni) return null

  return (
    <div className="page">
      <div style={{ background: 'var(--off-white)', borderBottom: '1px solid var(--sand)', padding: '4rem 0 3rem' }}>
        <div className="container">
          <motion.div variants={STAGGER} initial="hidden" animate="show">
            <motion.div variants={UP} className="eyebrow" style={{ marginBottom: '0.75rem' }}>Book Session</motion.div>
            <motion.h1 variants={UP} className="t-section" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>
              Session with <span className="ital" style={{ color: 'var(--coral)' }}>{alumni.user?.name}</span><span className="dot">.</span>
            </motion.h1>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '3.5rem', paddingBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '4rem', alignItems: 'start' }}>
          <motion.div variants={STAGGER} initial="hidden" animate="show">
            <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <motion.div variants={UP} className="form-group">
                <label className="form-label">Session Topic *</label>
                <select className="form-input" value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} required>
                  <option value="">Select a topic…</option>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </motion.div>

              <motion.div variants={UP} className="form-group">
                <label className="form-label">Duration</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {[30, 60].map(d => (
                    <motion.button key={d} type="button" whileTap={{ scale: 0.97 }}
                      onClick={() => setForm(f => ({ ...f, duration: d }))}
                      style={{
                        flex: 1, padding: '1rem', borderRadius: 'var(--r-lg)',
                        background: form.duration === d ? 'var(--coral-pale)' : 'var(--off-white)',
                        border: `1.5px solid ${form.duration === d ? 'var(--coral)' : 'var(--sand)'}`,
                        cursor: 'pointer', display: 'flex', gap: '0.6rem', alignItems: 'center',
                        color: form.duration === d ? 'var(--coral-dark)' : 'var(--ink-mid)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Clock size={14} />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{d} minutes</div>
                        <div className="t-xs" style={{ marginTop: 1 }}>₹{d === 30 ? rate : rate * 2}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={UP} className="form-group">
                <label className="form-label">Preferred Date & Time *</label>
                <input type="datetime-local" className="form-input" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} min={minDate} required />
              </motion.div>

              <motion.div variants={UP} className="form-group">
                <label className="form-label">Message to Mentor (optional)</label>
                <textarea className="form-input" placeholder="What's your specific goal for this session?" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4} />
              </motion.div>

              <motion.button variants={UP} type="submit" className="btn btn-dark btn-lg" disabled={submitting} whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
                {submitting ? <span className="spinner spinner-white" /> : <><CreditCard size={16} /> Pay ₹{amount} & Book</>}
              </motion.button>
              <p className="t-xs" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                🔒 Secured by Razorpay. Funds held until session completes.
              </p>
            </form>
          </motion.div>

          {/* Summary card */}
          <motion.div variants={LEFT} initial="hidden" animate="show" style={{ position: 'sticky', top: 'calc(var(--nav-h) + 1.5rem)' }}>
            <div className="card" style={{ padding: '2rem', boxShadow: '0 4px 20px rgba(13,13,13,0.07)' }}>
              <div className="eyebrow" style={{ marginBottom: '1.25rem' }}>Booking Summary</div>
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--sand)' }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--pale)', border: '2px solid var(--sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--coral)', flexShrink: 0, overflow: 'hidden' }}>
                  {alumni.user?.profilePhoto
                    ? <img src={alumni.user.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : alumni.user?.name?.[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{alumni.user?.name}</div>
                  <div className="t-xs" style={{ marginTop: '0.15rem' }}>{alumni.currentRole}{alumni.company ? ` · ${alumni.company}` : ''}</div>
                </div>
              </div>

              {[
                { l: 'Duration', v: `${form.duration} minutes` },
                { l: 'Topic', v: form.topic || '—' },
                ...(form.scheduledAt ? [{ l: 'Date', v: new Date(form.scheduledAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }] : []),
              ].map((row, i, arr) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.83rem', borderBottom: i < arr.length - 1 ? '1px solid var(--sand)' : 'none' }}>
                  <span className="eyebrow" style={{ fontSize: '0.58rem' }}>{row.l}</span>
                  <span className="t-sm" style={{ textAlign: 'right', maxWidth: '60%' }}>{row.v}</span>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', marginTop: '0.5rem', borderTop: '1px solid var(--sand)' }}>
                <span className="eyebrow">Total</span>
                <span style={{ fontFamily: 'var(--f-display)', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--coral)' }}>₹{amount}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}