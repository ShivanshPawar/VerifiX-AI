import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('verifix_user')
      if (raw) setUserState(JSON.parse(raw))
    } catch {
      localStorage.removeItem('verifix_user')
    }
    setReady(true)
  }, [])

  const setUser = useCallback((u) => {
    setUserState(u)
    if (u) localStorage.setItem('verifix_user', JSON.stringify(u))
    else localStorage.removeItem('verifix_user')
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      /* still clear client */
    }
    localStorage.removeItem('verifix_user')
    setUserState(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      setUser,
      logout,
      ready,
      isAuthenticated: !!user,
    }),
    [user, setUser, logout, ready]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
