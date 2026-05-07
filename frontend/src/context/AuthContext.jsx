import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { api, registerUnauthorizedHandler } from '../lib/api'

const AuthContext = createContext(null)
const AUTH_PAGES = new Set(['/signin', '/signup'])

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null)
  const [ready, setReady] = useState(false)
  const isHandlingUnauthorizedRef = useRef(false)

  // Session validation via server-side cookie and /auth/me endpoint
  useEffect(() => {
    let active = true

    const validateSession = async () => {
      try {
        // Validate session using httpOnly cookie (browser sends it automatically with withCredentials: true)
        const res = await api.get('/auth/me', { skipAuthRedirect: true })
        if (!active) return
        setUserState(res.data?.user ?? null)
      } catch {
        // No valid session or token expired
        if (!active) return
        setUserState(null)
      } finally {
        if (active) setReady(true)
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
      if (notifyServer) {
        try {
          // Clear httpOnly cookie on server
          await api.post('/auth/logout', {}, { skipAuthRedirect: true })
        } catch {
          /* still clear client */
        }
      }

      setUserState(null)

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
    try {
      const res = await api.get('/auth/me', { skipAuthRedirect: true })
      setUserState(res.data?.user ?? null)
      return res.data?.user ?? null
    } catch {
      setUserState(null)
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
