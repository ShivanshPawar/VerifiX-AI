import axios from 'axios'

function normalizeBaseURL(url) {
  return url.replace(/\/+$/, '')
}

function getApiBaseURL() {
  const configuredBaseURL = import.meta.env.VITE_API_BASE_URL?.trim()

  if (configuredBaseURL) return normalizeBaseURL(configuredBaseURL)

  if (import.meta.env.DEV) return 'http://localhost:3000/api/v1'

  throw new Error('VITE_API_BASE_URL is required for production builds.')
}

const apiBaseURL = getApiBaseURL()
const authRedirectIgnoredPaths = ['/auth/login', '/auth/register']
const AUTH_TOKEN_KEY = 'verifix_auth_token'

let unauthorizedHandler = null

export const api = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function getAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  } catch {
    return null
  }
}

export function setAuthToken(token) {
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token)
    else localStorage.removeItem(AUTH_TOKEN_KEY)
  } catch {
    /* storage may be unavailable */
  }
}

export function clearAuthToken() {
  setAuthToken(null)
}

export function registerUnauthorizedHandler(handler) {
  unauthorizedHandler = handler

  return () => {
    if (unauthorizedHandler === handler) {
      unauthorizedHandler = null
    }
  }
}

function shouldHandleUnauthorized(error) {
  const status = error?.response?.status
  const requestConfig = error?.config ?? {}
  const requestUrl = String(requestConfig.url ?? '')

  if (status !== 401) return false
  if (requestConfig.skipAuthRedirect) return false

  return !authRedirectIgnoredPaths.some((path) => requestUrl.includes(path))
}

api.interceptors.request.use((config) => {
  const token = getAuthToken()

  if (token) {
    config.headers = config.headers ?? {}

    if (typeof config.headers.set === 'function') {
      if (!config.headers.has?.('Authorization')) {
        config.headers.set('Authorization', `Bearer ${token}`)
      }
    } else if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

// AI code: Centralized 401 handling keeps expired sessions from leaving stale auth UI behind.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (shouldHandleUnauthorized(error) && unauthorizedHandler) {
      await unauthorizedHandler(error)
    }

    return Promise.reject(error)
  }
)

