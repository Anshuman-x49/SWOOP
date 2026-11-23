import api from '../../../config/Axios'
import { API_ROUTES } from '../../../constants/apiRoutes'

export interface Participant {
  _id: string
  name: string
  email: string
}

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed'

export interface Message {
  _id: string
  conversation: string
  sender: Participant | string
  content: string
  status: MessageStatus
  createdAt: string
  updatedAt: string
  tempId?: string
}

export interface Conversation {
  _id: string
  participants: Participant[]
  lastMessage?: Message | null
  createdAt: string
  updatedAt: string
}

export const chatApi = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get<{
      success: boolean
      message: string
      data: { conversations: Conversation[] }
    }>(API_ROUTES.conversations.list)
    return response.data.data.conversations
  },

  createConversation: async (participantId: string): Promise<Conversation> => {
    const response = await api.post<{
      success: boolean
      message: string
      data: { conversation: Conversation }
    }>(API_ROUTES.conversations.create, { participantId })
    return response.data.data.conversation
  },

  getMessages: async (
    conversationId: string,
    page = 1,
    limit = 30
  ): Promise<{ messages: Message[]; total: number; hasMore: boolean; page: number }> => {
    const response = await api.get<{
      success: boolean
      message: string
      data: {
        messages: Message[]
        total: number
        hasMore: boolean
        page: number
        limit: number
      }
    }>(`${API_ROUTES.conversations.messages(conversationId)}?page=${page}&limit=${limit}`)
    return response.data.data
  },

  sendMessage: async (
    conversationId: string,
    content: string
  ): Promise<Message> => {
    const response = await api.post<{
      success: boolean
      message: string
      data: { message: Message }
    }>(API_ROUTES.messages.send(conversationId), { content })
    return response.data.data.message
  },
}
