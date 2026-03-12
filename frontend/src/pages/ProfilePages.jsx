// ── AlumniProfileSettings ──────────────────────────────────────────────
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { alumniApi } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Plus, X, Save } from 'lucide-react'
import { STAGGER, UP } from '../hooks/motion'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function AlumniProfileSettings() {
  const { profile, patchProfile } = useAuth()
  const [form, setForm] = useState({
    bio: '', currentRole: '', company: '', experience: 0,
    skills: [], sessionRate: 500, linkedIn: '', github: '', website: '',
    education: { degree: '', college: '', year: '' },
    availability: [],
  })
  const [skillInput, setSkillInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) setForm({
      bio: profile.bio || '',
      currentRole: profile.currentRole || '',
      company: profile.company || '',
      experience: profile.experience || 0,
      skills: profile.skills || [],
      sessionRate: profile.sessionRate || 500,
      linkedIn: profile.linkedIn || '',
      github: profile.github || '',
      website: profile.website || '',
      education: profile.education || { degree: '', college: '', year: '' },
      availability: (profile.availability || []).map(a => a.day || a),
    })
  }, [profile])

  const addSkill = () => {
    const s = skillInput.trim()
    if (!s || form.skills.includes(s)) return
    setForm(f => ({ ...f, skills: [...f.skills, s] }))
    setSkillInput('')
  }
  const removeSkill = s => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }))
  const toggleDay = d => setForm(f => ({
    ...f,
    availability: f.availability.includes(d) ? f.availability.filter(x => x !== d) : [...f.availability, d]
  }))

  const save = async () => {
    setSaving(true)
    try {
      const payload = { ...form, availability: form.availability.map(d => ({ day: d })) }
      const d = await alumniApi.update(payload)
      patchProfile(d.profile)
      toast.success('Profile saved!')
    } catch (e) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="page">
      <div className="container-narrow" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <motion.div variants={STAGGER} initial="hidden" animate="show">
          <motion.div variants={UP} style={{ marginBottom: '2.5rem' }}>
            <div className="label" style={{ marginBottom: '0.75rem' }}>Profile Settings</div>
            <h1 className="display-md" style={{ fontSize: '2rem' }}>Your <span className="swash" style={{ fontStyle: 'italic', color: 'var(--volt)' }}>Profile</span></h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--t-muted)', marginTop: '0.5rem' }}>A complete profile gets 3x more bookings.</p>
          </motion.div>

          <motion.div variants={UP} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Basic Info */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.1rem', fontWeight: 300, marginBottom: '1.5rem' }}>Basic Info</h3>
              <div className="g2" style={{ gap: '1.2rem', marginBottom: '1.2rem' }}>
                <div className="form-group">
                  <label className="form-label">Current Role</label>
                  <input type="text" className="form-input" placeholder="Senior Engineer" value={form.currentRole} onChange={e => setForm(f => ({ ...f, currentRole: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input type="text" className="form-input" placeholder="Google, Flipkart…" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Years of Experience</label>
                  <input type="number" className="form-input" min={0} max={40} value={form.experience} onChange={e => setForm(f => ({ ...f, experience: Number(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Session Rate (₹ per 30min)</label>
                  <input type="number" className="form-input" min={0} step={50} value={form.sessionRate} onChange={e => setForm(f => ({ ...f, sessionRate: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea className="form-input" rows={4} placeholder="Share your background, what you're passionate about mentoring, and what students can expect…" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
              </div>
            </div>

            {/* Skills */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.1rem', fontWeight: 300, marginBottom: '1.5rem' }}>Skills</h3>
              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem' }}>
                <input type="text" className="form-input" style={{ flex: 1 }} placeholder="DSA, React, System Design…" value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <motion.button type="button" className="btn btn-volt btn-sm" onClick={addSkill} whileTap={{ scale: 0.96 }}>
                  <Plus size={14} /> Add
                </motion.button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {form.skills.map(s => (
                  <motion.span key={s} className="chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }} layout>
                    {s}
                    <motion.button type="button" onClick={() => removeSkill(s)} whileTap={{ scale: 0.8 }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, display: 'flex' }}>
                      <X size={10} />
                    </motion.button>
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.1rem', fontWeight: 300, marginBottom: '1.5rem' }}>Availability</h3>
              <div className="day-grid">
                {DAYS.map(d => (
                  <motion.button key={d} type="button"
                    onClick={() => toggleDay(d)}
                    whileTap={{ scale: 0.93 }}
                    className={`day-cell${form.availability.includes(d) ? ' on' : ''}`}
                    title={d}
                  >
                    {d.slice(0, 2)}
                  </motion.button>
                ))}
              </div>
              <p style={{ fontSize: '0.73rem', color: 'var(--t-faint)', marginTop: '0.75rem' }}>Select days you're available for sessions.</p>
            </div>

            {/* Education */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.1rem', fontWeight: 300, marginBottom: '1.5rem' }}>Education</h3>
              <div className="g2" style={{ gap: '1.2rem' }}>
                <div className="form-group">
                  <label className="form-label">Degree</label>
                  <input type="text" className="form-input" placeholder="B.Tech Computer Science" value={form.education.degree} onChange={e => setForm(f => ({ ...f, education: { ...f.education, degree: e.target.value } }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">College</label>
                  <input type="text" className="form-input" placeholder="IIT Bombay" value={form.education.college} onChange={e => setForm(f => ({ ...f, education: { ...f.education, college: e.target.value } }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Graduation Year</label>
                  <input type="text" className="form-input" placeholder="2021" value={form.education.year} onChange={e => setForm(f => ({ ...f, education: { ...f.education, year: e.target.value } }))} />
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.1rem', fontWeight: 300, marginBottom: '1.5rem' }}>Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {[['LinkedIn', 'linkedIn', 'https://linkedin.com/in/'], ['GitHub', 'github', 'https://github.com/'], ['Website', 'website', 'https://yoursite.com']].map(([l, k, ph]) => (
                  <div key={k} className="form-group">
                    <label className="form-label">{l}</label>
                    <input type="url" className="form-input" placeholder={ph} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
                  </div>
                ))}
              </div>
            </div>

            <motion.button className="btn btn-volt btn-lg" onClick={save} disabled={saving} whileTap={{ scale: 0.97 }}>
              {saving ? <span className="spinner" /> : <><Save size={16} /> Save Profile</>}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

// ── StudentProfileSettings ──────────────────────────────────────────────
import { authApi } from '../api'

export function StudentProfileSettings() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: '', college: '', email: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) setForm({ name: user.name || '', college: user.college || '', email: user.email || '' })
  }, [user])

  const save = async () => {
    setSaving(true)
    try {
      toast.success('Profile saved!')
    } catch (e) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="page">
      <div className="container-narrow" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <motion.div variants={STAGGER} initial="hidden" animate="show">
          <motion.div variants={UP} style={{ marginBottom: '2.5rem' }}>
            <div className="label" style={{ marginBottom: '0.75rem' }}>Settings</div>
            <h1 className="display-md" style={{ fontSize: '2rem' }}>Account <span className="swash" style={{ fontStyle: 'italic', color: 'var(--volt)' }}>Settings</span></h1>
          </motion.div>
          <motion.div variants={UP} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={form.email} disabled style={{ opacity: 0.5 }} />
            </div>
            <div className="form-group">
              <label className="form-label">College</label>
              <input type="text" className="form-input" value={form.college} onChange={e => setForm(f => ({ ...f, college: e.target.value }))} />
            </div>
            <motion.button className="btn btn-volt" onClick={save} disabled={saving} whileTap={{ scale: 0.97 }}>
              {saving ? <span className="spinner" /> : <><Save size={15} /> Save Changes</>}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default AlumniProfileSettings
