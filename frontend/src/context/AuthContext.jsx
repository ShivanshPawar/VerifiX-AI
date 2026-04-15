import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { api, registerUnauthorizedHandler } from '../lib/api'

const AuthContext = createContext(null)
const USER_STORAGE_KEY = 'verifix_user'
const AUTH_PAGES = new Set(['/signin', '/signup'])

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null)
  const [ready, setReady] = useState(false)
  const isHandlingUnauthorizedRef = useRef(false)

  const clearStoredUser = useCallback(() => {
    localStorage.removeItem(USER_STORAGE_KEY)
    setUserState(null)
  }, [])

  useEffect(() => {
    let active = true

    const validateSession = async () => {
      let storedUser = null

      try {
        const raw = localStorage.getItem(USER_STORAGE_KEY)
        storedUser = raw ? JSON.parse(raw) : null
      } catch {
        clearStoredUser()
      }

      if (!storedUser) {
        if (active) setReady(true)
        return
      }

      try {
        // AI code: Re-check the server session before showing authenticated navigation on refresh.
        const res = await api.get('/auth/me', { skipAuthRedirect: true })
        const nextUser = res.data?.user ?? storedUser

        if (!active) return

        setUserState(nextUser)
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser))
      } catch {
        if (!active) return
        clearStoredUser()
      } finally {
        if (active) setReady(true)
      }
    }

    validateSession()

    return () => {
      active = false
    }
  }, [clearStoredUser])

  const setUser = useCallback((u) => {
    setUserState(u)
    if (u) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u))
    else localStorage.removeItem(USER_STORAGE_KEY)
  }, [])

  const redirectToSignIn = useCallback(() => {
    const currentPath = window.location.pathname
    if (AUTH_PAGES.has(currentPath)) return
    window.location.replace('/signin')
  }, [])

  const clearAuth = useCallback(
    async ({ redirectToLogin = false, notifyServer = false } = {}) => {
      if (notifyServer) {
        try {
          // AI code: Send an empty JSON object because Express strict JSON parsing rejects a raw `null` body.
          await api.post('/auth/logout', {}, { skipAuthRedirect: true })
        } catch {
          /* still clear client */
        }
      }

      clearStoredUser()

      if (redirectToLogin) {
        redirectToSignIn()
      }
    },
    [clearStoredUser, redirectToSignIn]
  )

  const logout = useCallback(async () => {
    await clearAuth({ notifyServer: true })
  }, [clearAuth])

  useEffect(() => {
    const unregister = registerUnauthorizedHandler(async () => {
      if (isHandlingUnauthorizedRef.current) return

      isHandlingUnauthorizedRef.current = true

      try {
        // AI code: Any protected request that comes back 401 immediately resets the stale client session.
        await clearAuth({ notifyServer: true, redirectToLogin: true })
      } finally {
        isHandlingUnauthorizedRef.current = false
      }
    })

    return unregister
  }, [clearAuth])

  const value = useMemo(
    () => ({
      user,
      setUser,
      logout,
      ready,
      clearAuth,
      isAuthenticated: ready && !!user,
    }),
    [user, setUser, logout, ready, clearAuth]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
