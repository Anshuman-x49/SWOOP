import axios, { type InternalAxiosRequestConfig } from 'axios'
import { API_ROUTES } from '../constants/apiRoutes'

// Minimal interface for the store to avoid direct import and circular dependency
interface InjectedStore {
  getState: () => {
    auth: {
      accessToken: string | null
    }
  }
  dispatch: (action: unknown) => unknown
}

let store: InjectedStore | null = null

// Action creators to be injected or dispatched dynamically
let onTokenRefreshed: ((token: string) => void) | null = null
let onLogout: (() => void) | null = null

/**
 * Called from store initialization to wire Redux into Axios without circular dependencies
 */
export function injectStore(
  appStore: InjectedStore,
  handlers?: {
    setAccessToken: (token: string) => void
    logout: () => void
  }
) {
  store = appStore
  if (handlers) {
    onTokenRefreshed = handlers.setAccessToken
    onLogout = handlers.logout
  }
}

// Axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true, // Send httpOnly refresh token cookie on every request
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach in-memory access token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (store) {
      const token = store.getState().auth.accessToken
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Single-flight refresh token queue on 401
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is not 401 or request was already retried, reject immediately
    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // Don't intercept refresh-token or login/register 401 failures to prevent infinite loops
    if (
      originalRequest.url?.includes(API_ROUTES.auth.refreshToken) ||
      originalRequest.url?.includes(API_ROUTES.auth.login) ||
      originalRequest.url?.includes(API_ROUTES.auth.register)
    ) {
      return Promise.reject(error)
    }

    // If another request is currently refreshing the token, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      // Call refresh-token endpoint ONCE (using vanilla axios to avoid triggering interceptors)
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const response = await axios.post(
        `${baseURL}${API_ROUTES.auth.refreshToken}`,
        {},
        { withCredentials: true }
      )

      const newAccessToken = response.data?.data?.accessToken

      if (!newAccessToken) {
        throw new Error('No access token returned from refresh endpoint')
      }

      // Update token in Redux store
      if (onTokenRefreshed) {
        onTokenRefreshed(newAccessToken)
      }

      // Update Authorization header for original request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

      // Process all queued requests with the new token
      processQueue(null, newAccessToken)

      // Retry the original request
      return api(originalRequest)
    } catch (refreshError) {
      // Refresh failed: reject all queued requests, clear state, and redirect to /login
      processQueue(refreshError, null)
      if (onLogout) {
        onLogout()
      }
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
