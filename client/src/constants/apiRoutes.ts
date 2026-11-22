/**
 * Centralized API endpoints for SWOOP
 * Chat and user-search endpoints are marked as TODO for when the backend is ready.
 */
export const API_ROUTES = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refreshToken: '/api/auth/refresh-token',
    getMe: '/api/auth/get-me',
  },
  // TODO: Backend contracts to be filled in
  conversations: {
    list: '/api/conversations', // TODO: GET
    create: '/api/conversations', // TODO: POST
    messages: (conversationId: string) => `/api/conversations/${conversationId}/messages`, // TODO: GET (pagination)
  },
  messages: {
    send: (conversationId: string) => `/api/conversations/${conversationId}/messages`, // TODO: POST
  },
  users: {
    search: '/api/users/search', // TODO: GET ?query=
  },
} as const
