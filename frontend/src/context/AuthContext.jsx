import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { api, registerUnauthorizedHandler } from '../lib/api'

const AuthContext = createContext(null)
const AUTH_PAGES = new Set(['/signin', '/signup'])

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null)
  const [ready, setReady] = useState(false)
  const isHandlingUnauthorizedRef = useRef(false)

  const clearUser = useCallback(() => {
    setUserState(null)
  }, [])

  useEffect(() => {
    let active = true

    const validateSession = async () => {
      try {
        // AI code: Re-check the server session before showing authenticated navigation on refresh.
        const res = await api.get('/auth/me', { skipAuthRedirect: true })
        const nextUser = res.data?.user ?? null

        if (!active) return

        setUserState(nextUser)
      } catch {
        if (!active) return
        clearUser()
      } finally {
        if (active) setReady(true)
      }
    }

    validateSession()

    return () => {
      active = false
    }
  }, [clearUser])

  const setUser = useCallback((u) => {
    setUserState(u)
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

      clearUser()

      if (redirectToLogin) {
        redirectToSignIn()
      }
    },
    [clearUser, redirectToSignIn]
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
