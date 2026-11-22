import api from '../../../config/Axios'
import { API_ROUTES } from '../../../constants/apiRoutes'

export interface User {
  id: string
  name: string
  email: string
}

export interface AuthResponseData {
  user: User
  accessToken: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export const authApi = {
  register: async (payload: RegisterPayload) => {
    const response = await api.post<{
      success: boolean
      message: string
      data: AuthResponseData
    }>(API_ROUTES.auth.register, payload)
    return response.data
  },

  login: async (payload: LoginPayload) => {
    const response = await api.post<{
      success: boolean
      message: string
      data: AuthResponseData
    }>(API_ROUTES.auth.login, payload)
    return response.data
  },

  logout: async () => {
    const response = await api.post<{
      success: boolean
      message: string
    }>(API_ROUTES.auth.logout)
    return response.data
  },

  refreshToken: async () => {
    const response = await api.post<{
      success: boolean
      message: string
      data: AuthResponseData
    }>(API_ROUTES.auth.refreshToken)
    return response.data
  },

  getMe: async () => {
    const response = await api.get<{
      success: boolean
      message: string
      data: { user: User }
    }>(API_ROUTES.auth.getMe)
    return response.data
  },
}
