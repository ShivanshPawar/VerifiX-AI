import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { api, clearAuthToken, registerUnauthorizedHandler } from '../lib/api'

const AuthContext = createContext(null)
const AUTH_PAGES = new Set(['/signin', '/signup'])

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null)
  const [ready, setReady] = useState(false)
  const isHandlingUnauthorizedRef = useRef(false)
  const sessionRequestIdRef = useRef(0)

  // Session validation via server-side cookie and /auth/me endpoint
  useEffect(() => {
    let active = true

    const validateSession = async () => {
      const requestId = ++sessionRequestIdRef.current

      try {
        // Validate session using httpOnly cookie (browser sends it automatically with withCredentials: true)
        const res = await api.get('/auth/me', { skipAuthRedirect: true })
        if (!active || requestId !== sessionRequestIdRef.current) return
        setUserState(res.data?.user ?? null)
      } catch {
        // No valid session or token expired
        if (!active || requestId !== sessionRequestIdRef.current) return
        setUserState(null)
      } finally {
        if (active && requestId === sessionRequestIdRef.current) setReady(true)
      }
    }

    validateSession()

    return () => {
      active = false
    }
  }, [])

  const redirectToSignIn = useCallback(() => {
    const currentPath = window.location.pathname
    if (AUTH_PAGES.has(currentPath)) return
    window.location.replace('/signin')
  }, [])

  const clearAuth = useCallback(
    async ({ redirectToLogin = false, notifyServer = false } = {}) => {
      sessionRequestIdRef.current += 1
      clearAuthToken()
      setUserState(null)
      setReady(true)

      if (notifyServer) {
        try {
          // Clear httpOnly cookie on server
          await api.post('/auth/logout', {}, { skipAuthRedirect: true })
        } catch {
          /* still clear client */
        }
      }

      if (redirectToLogin) {
        redirectToSignIn()
      }
    },
    [redirectToSignIn]
  )

  const logout = useCallback(async () => {
    await clearAuth({ notifyServer: true })
  }, [clearAuth])

  // Handle 401 responses by clearing auth and redirecting
  useEffect(() => {
    const unregister = registerUnauthorizedHandler(async () => {
      if (isHandlingUnauthorizedRef.current) return

      isHandlingUnauthorizedRef.current = true

      try {
        await clearAuth({ notifyServer: true, redirectToLogin: true })
      } finally {
        isHandlingUnauthorizedRef.current = false
      }
    })

    return unregister
  }, [clearAuth])

  // Helper function to refresh user from server
  const refreshUser = useCallback(async () => {
    const requestId = ++sessionRequestIdRef.current

    try {
      const res = await api.get('/auth/me', { skipAuthRedirect: true })
      const nextUser = res.data?.user ?? null

      if (requestId === sessionRequestIdRef.current) {
        setUserState(nextUser)
        setReady(true)
      }

      return nextUser
    } catch {
      if (requestId === sessionRequestIdRef.current) {
        setUserState(null)
        setReady(true)
      }

      return null
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      logout,
      ready,
      clearAuth,
      refreshUser,
      isAuthenticated: ready && !!user,
    }),
    [user, logout, ready, clearAuth, refreshUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
