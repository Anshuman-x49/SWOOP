/**
 * Centralized API endpoints for SWOOP
 */
export const API_ROUTES = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refreshToken: '/api/auth/refresh-token',
    getMe: '/api/auth/get-me',
  },
  conversations: {
    list: '/api/conversations',
    create: '/api/conversations',
    messages: (conversationId: string) => `/api/conversations/${conversationId}/messages`,
  },
  messages: {
    send: (conversationId: string) => `/api/conversations/${conversationId}/messages`,
  },
  users: {
    search: '/api/users/search',
  },
} as const
