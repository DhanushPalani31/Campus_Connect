import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api'
const Ctx = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [ready, setReady] = useState(false)
  useEffect(() => { load() }, [])
  async function load() {
    try { const d = await authApi.me(); setUser(d.user); setProfile(d.profile) }
    catch { setUser(null); setProfile(null) }
    finally { setReady(true) }
  }
  const login = async c => { const d = await authApi.login(c); setUser(d.user); await load(); return d }
  const register = async d => { const r = await authApi.register(d); setUser(r.user); await load(); return r }
  const logout = async () => { await authApi.logout(); setUser(null); setProfile(null) }
  const patchProfile = p => setProfile(p)
  return <Ctx.Provider value={{ user, profile, ready, login, register, logout, patchProfile, reload: load }}>{children}</Ctx.Provider>
}
export const useAuth = () => { const c = useContext(Ctx); if (!c) throw new Error('outside provider'); return c }
