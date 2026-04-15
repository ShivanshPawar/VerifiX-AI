import axios from 'axios'

const apiBaseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1'
const authRedirectIgnoredPaths = ['/auth/login', '/auth/register']

let unauthorizedHandler = null

export const api = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

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

