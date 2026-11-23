import api from '../../../config/Axios'
import { API_ROUTES } from '../../../constants/apiRoutes'

export interface Participant {
  id: string
  name: string
  email: string
}

export const usersApi = {
  searchUsers: async (query: string): Promise<Participant[]> => {
    const response = await api.get<{
      success: boolean
      message: string
      data: { users: Participant[] }
    }>(`${API_ROUTES.users.search}?q=${encodeURIComponent(query)}`)
    return response.data.data.users
  },
}
