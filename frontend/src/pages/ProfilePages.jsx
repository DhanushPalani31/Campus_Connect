import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { alumniApi } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Plus, X, Save } from 'lucide-react'
import { STAGGER, UP } from '../hooks/motion'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// ── AlumniProfileSettings ─────────────────────────────────────────────────
export function AlumniProfileSettings() {
  const { profile, patchProfile } = useAuth()
  const [form, setForm] = useState({ bio: '', currentRole: '', company: '', experience: 0, skills: [], sessionRate: 500, linkedIn: '', github: '', website: '', education: { degree: '', college: '', year: '' }, availability: [] })
  const [skillInput, setSkillInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) setForm({ bio: profile.bio||'', currentRole: profile.currentRole||'', company: profile.company||'', experience: profile.experience||0, skills: profile.skills||[], sessionRate: profile.sessionRate||500, linkedIn: profile.linkedIn||'', github: profile.github||'', website: profile.website||'', education: profile.education||{degree:'',college:'',year:''}, availability: (profile.availability||[]).map(a => a.day||a) })
  }, [profile])

  const addSkill = () => { const s = skillInput.trim(); if (!s || form.skills.includes(s)) return; setForm(f => ({ ...f, skills: [...f.skills, s] })); setSkillInput('') }
  const removeSkill = s => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }))
  const toggleDay = d => setForm(f => ({ ...f, availability: f.availability.includes(d) ? f.availability.filter(x => x !== d) : [...f.availability, d] }))

  const save = async () => {
    setSaving(true)
    try {
      const d = await alumniApi.update({ ...form, availability: form.availability.map(d => ({ day: d })) })
      patchProfile(d.profile); toast.success('Profile saved!')
    } catch (e) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="page">
      <div style={{ background: 'var(--off-white)', borderBottom: '1px solid var(--sand)', padding: '4rem 0 3rem' }}>
        <div className="container-tight">
          <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>Settings</div>
          <h1 className="t-section" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>Your <span className="ital">Profile</span><span className="dot">.</span></h1>
          <p className="t-sm" style={{ marginTop: '0.5rem' }}>A complete profile receives 3× more bookings.</p>
        </div>
      </div>

      <div className="container-tight" style={{ paddingTop: '3.5rem', paddingBottom: '5rem' }}>
        <motion.div variants={STAGGER} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Basic */}
          <motion.div variants={UP} className="card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.15rem', fontWeight: 400, marginBottom: '1.75rem' }}>Basic Info</h3>
            <div className="g2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
              {[['Current Role', 'currentRole', 'text', 'Senior Engineer'], ['Company', 'company', 'text', 'Google, Flipkart…']].map(([l, k, t, ph]) => (
                <div key={k} className="form-group">
                  <label className="form-label">{l}</label>
                  <input type={t} className="form-input" placeholder={ph} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Experience (years)</label>
                <input type="number" className="form-input" min={0} max={40} value={form.experience} onChange={e => setForm(f => ({ ...f, experience: Number(e.target.value) }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Session Rate (₹ / 30min)</label>
                <input type="number" className="form-input" min={0} step={50} value={form.sessionRate} onChange={e => setForm(f => ({ ...f, sessionRate: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-input" rows={4} placeholder="Your background, mentorship style, and what students can expect…" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div variants={UP} className="card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.15rem', fontWeight: 400, marginBottom: '1.5rem' }}>Skills</h3>
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem' }}>
              <input type="text" className="form-input" style={{ flex: 1 }} placeholder="DSA, React, System Design…" value={skillInput}
                onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
              <motion.button type="button" className="btn btn-dark btn-sm" onClick={addSkill} whileTap={{ scale: 0.96 }}><Plus size={14} /> Add</motion.button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {form.skills.map(s => (
                <motion.span key={s} className="tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }} layout>
                  {s}
                  <motion.button type="button" onClick={() => removeSkill(s)} whileTap={{ scale: 0.8 }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, display: 'flex' }}><X size={10} /></motion.button>
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Availability */}
          <motion.div variants={UP} className="card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.15rem', fontWeight: 400, marginBottom: '1.5rem' }}>Availability</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
              {DAYS.map(d => (
                <motion.button key={d} type="button" whileTap={{ scale: 0.93 }} onClick={() => toggleDay(d)}
                  style={{ aspectRatio: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--r-md)', background: form.availability.includes(d) ? 'var(--coral-pale)' : 'var(--off-white)', border: `1.5px solid ${form.availability.includes(d) ? 'var(--coral)' : 'var(--sand)'}`, cursor: 'pointer', fontFamily: 'var(--f-mono)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: form.availability.includes(d) ? 'var(--coral-dark)' : 'var(--ink-light)', transition: 'all 0.15s' }}
                  title={d}
                >
                  {d.slice(0, 2)}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Education */}
          <motion.div variants={UP} className="card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.15rem', fontWeight: 400, marginBottom: '1.5rem' }}>Education</h3>
            <div className="g2" style={{ gap: '1.25rem' }}>
              {[['Degree', 'degree', 'B.Tech Computer Science'], ['College', 'college', 'IIT Bombay'], ['Year', 'year', '2021']].map(([l, k, ph]) => (
                <div key={k} className="form-group">
                  <label className="form-label">{l}</label>
                  <input type="text" className="form-input" placeholder={ph} value={form.education[k]} onChange={e => setForm(f => ({ ...f, education: { ...f.education, [k]: e.target.value } }))} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          <motion.div variants={UP} className="card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.15rem', fontWeight: 400, marginBottom: '1.5rem' }}>Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {[['LinkedIn URL', 'linkedIn', 'https://linkedin.com/in/'], ['GitHub URL', 'github', 'https://github.com/'], ['Website', 'website', 'https://yoursite.com']].map(([l, k, ph]) => (
                <div key={k} className="form-group">
                  <label className="form-label">{l}</label>
                  <input type="url" className="form-input" placeholder={ph} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.button className="btn btn-dark btn-lg" onClick={save} disabled={saving} whileTap={{ scale: 0.97 }}>
            {saving ? <span className="spinner spinner-white" /> : <><Save size={16} /> Save Profile</>}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

// ── StudentProfileSettings ─────────────────────────────────────────────────
export function StudentProfileSettings() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: '', college: '', email: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (user) setForm({ name: user.name||'', college: user.college||'', email: user.email||'' }) }, [user])

  const save = async () => { setSaving(true); await new Promise(r => setTimeout(r, 500)); toast.success('Saved!'); setSaving(false) }

  return (
    <div className="page">
      <div style={{ background: 'var(--off-white)', borderBottom: '1px solid var(--sand)', padding: '4rem 0 3rem' }}>
        <div className="container-tight">
          <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>Settings</div>
          <h1 className="t-section" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>Account <span className="ital">Settings</span><span className="dot">.</span></h1>
        </div>
      </div>
      <div className="container-tight" style={{ paddingTop: '3.5rem', paddingBottom: '5rem' }}>
        <motion.div variants={STAGGER} initial="hidden" animate="show">
          <motion.div variants={UP} className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[['Full Name', 'name', 'text', false], ['Email', 'email', 'email', true], ['College', 'college', 'text', false]].map(([l, k, t, disabled]) => (
              <div key={k} className="form-group">
                <label className="form-label">{l}</label>
                <input type={t} className="form-input" value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} disabled={disabled} style={disabled ? { opacity: 0.5 } : {}} />
              </div>
            ))}
            <motion.button className="btn btn-dark" onClick={save} disabled={saving} whileTap={{ scale: 0.97 }}>
              {saving ? <span className="spinner spinner-white" /> : <><Save size={15} /> Save Changes</>}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default AlumniProfileSettings
