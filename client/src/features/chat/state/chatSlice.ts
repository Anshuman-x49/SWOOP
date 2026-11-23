import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  type EntityState,
  type PayloadAction,
} from '@reduxjs/toolkit'
import {
  chatApi,
  type Conversation,
  type Message,
  type MessageStatus,
  type Participant,
} from '../api/chatApi'

export type { Conversation, Message, MessageStatus, Participant }

export const conversationsAdapter = createEntityAdapter<Conversation, string>({
  selectId: (conversation) => conversation._id,
  sortComparer: (a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
})

export const messagesAdapter = createEntityAdapter<Message, string>({
  selectId: (message) => message._id,
  sortComparer: (a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
})

export interface ConversationMessagesState extends EntityState<Message, string> {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  page: number
  hasMore: boolean
  error: string | null
}

export interface ChatState {
  conversations: EntityState<Conversation, string> & {
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null
  }
  messages: Record<string, ConversationMessagesState>
  activeConversationId: string | null
  onlineUsers: string[]
  typingUsers: Record<string, string[]> // conversationId -> array of userIds
  isInfoPanelOpen: boolean
}

const initialConversationsState = conversationsAdapter.getInitialState({
  status: 'idle' as const,
  error: null as string | null,
})

const initialState: ChatState = {
  conversations: initialConversationsState,
  messages: {},
  activeConversationId: null,
  onlineUsers: [],
  typingUsers: {},
  isInfoPanelOpen: false,
}

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const data = await chatApi.getConversations()
      return data
    } catch {
      return rejectWithValue('Failed to load conversations')
    }
  }
)

export const createOrOpenConversation = createAsyncThunk(
  'chat/createOrOpenConversation',
  async (participantId: string, { rejectWithValue }) => {
    try {
      const conversation = await chatApi.createConversation(participantId)
      return conversation
    } catch {
      return rejectWithValue('Failed to start conversation')
    }
  }
)

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (
    { conversationId, page = 1 }: { conversationId: string; page?: number },
    { rejectWithValue }
  ) => {
    try {
      const data = await chatApi.getMessages(conversationId, page)
      return { conversationId, ...data }
    } catch {
      return rejectWithValue('Failed to load messages')
    }
  }
)

export const sendChatMessage = createAsyncThunk(
  'chat/sendChatMessage',
  async (
    {
      conversationId,
      content,
      tempId,
    }: {
      conversationId: string
      content: string
      tempId: string
    },
    { rejectWithValue }
  ) => {
    try {
      const message = await chatApi.sendMessage(conversationId, content)
      return { conversationId, tempId, message }
    } catch {
      return rejectWithValue({ conversationId, tempId, error: 'Failed to send message' })
    }
  }
)

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversationId: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload
    },
    toggleInfoPanel: (state) => {
      state.isInfoPanelOpen = !state.isInfoPanelOpen
    },
    setInfoPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.isInfoPanelOpen = action.payload
    },
    optimisticMessageAdded: (
      state,
      action: PayloadAction<{ conversationId: string; message: Message }>
    ) => {
      const { conversationId, message } = action.payload
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = messagesAdapter.getInitialState({
          status: 'idle',
          page: 1,
          hasMore: true,
          error: null,
        })
      }
      messagesAdapter.addOne(state.messages[conversationId]!, message)

      // Also update conversation's lastMessage
      conversationsAdapter.updateOne(state.conversations, {
        id: conversationId,
        changes: {
          lastMessage: message,
          updatedAt: message.createdAt,
        },
      })
    },
    messageReceived: (state, action: PayloadAction<Message>) => {
      const message = action.payload
      const convId = message.conversation

      if (!state.messages[convId]) {
        state.messages[convId] = messagesAdapter.getInitialState({
          status: 'idle',
          page: 1,
          hasMore: true,
          error: null,
        })
      }

      // Check for pending optimistic message with same tempId or identical content from same sender
      const existingEntities = Object.values(state.messages[convId]!.entities)
      const senderId = typeof message.sender === 'object' ? message.sender._id : message.sender
      const pendingMatch = existingEntities.find(
        (m) =>
          m &&
          m.status === 'pending' &&
          m.content === message.content &&
          (typeof m.sender === 'object' ? m.sender._id : m.sender) === senderId
      )

      if (pendingMatch) {
        messagesAdapter.removeOne(state.messages[convId]!, pendingMatch._id)
      }

      // Upsert the message
      messagesAdapter.upsertOne(state.messages[convId]!, message)

      // Update conversation's lastMessage
      conversationsAdapter.updateOne(state.conversations, {
        id: convId,
        changes: {
          lastMessage: message,
          updatedAt: message.createdAt,
        },
      })
    },
    setTyping: (
      state,
      action: PayloadAction<{
        conversationId: string
        userId: string
        isTyping: boolean
      }>
    ) => {
      const { conversationId, userId, isTyping } = action.payload
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = []
      }
      if (isTyping) {
        if (!state.typingUsers[conversationId]!.includes(userId)) {
          state.typingUsers[conversationId]!.push(userId)
        }
      } else {
        state.typingUsers[conversationId] = state.typingUsers[conversationId]!.filter(
          (id) => id !== userId
        )
      }
    },
    setUserOnline: (state, action: PayloadAction<string>) => {
      const userId = action.payload
      if (!state.onlineUsers.includes(userId)) {
        state.onlineUsers.push(userId)
      }
    },
    setUserOffline: (state, action: PayloadAction<string>) => {
      const userId = action.payload
      state.onlineUsers = state.onlineUsers.filter((id) => id !== userId)
    },
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload
    },
    messageRead: (
      state,
      action: PayloadAction<{
        conversationId: string
        messageId?: string
        userId: string
      }>
    ) => {
      const { conversationId, messageId } = action.payload
      const convMessages = state.messages[conversationId]
      if (!convMessages) return

      if (messageId && convMessages.entities[messageId]) {
        messagesAdapter.updateOne(convMessages, {
          id: messageId,
          changes: { status: 'read' },
        })
      } else {
        // Mark all messages as read
        const updates = Object.values(convMessages.entities)
          .filter((m): m is Message => Boolean(m && m.status !== 'read'))
          .map((m) => ({ id: m._id, changes: { status: 'read' as MessageStatus } }))
        messagesAdapter.updateMany(convMessages, updates)
      }
    },
  },
  extraReducers: (builder) => {
    // fetchConversations
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.conversations.status = 'loading'
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations.status = 'succeeded'
        conversationsAdapter.setAll(state.conversations, action.payload)
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.conversations.status = 'failed'
        state.conversations.error = (action.payload as string) || 'Error'
      })

    // createOrOpenConversation
    builder.addCase(createOrOpenConversation.fulfilled, (state, action) => {
      conversationsAdapter.upsertOne(state.conversations, action.payload)
      state.activeConversationId = action.payload._id
    })

    // fetchMessages
    builder
      .addCase(fetchMessages.pending, (state, action) => {
        const { conversationId } = action.meta.arg
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = messagesAdapter.getInitialState({
            status: 'loading',
            page: 1,
            hasMore: true,
            error: null,
          })
        } else {
          state.messages[conversationId]!.status = 'loading'
        }
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { conversationId, messages, hasMore, page } = action.payload
        const convState = state.messages[conversationId]!
        convState.status = 'succeeded'
        convState.hasMore = hasMore
        convState.page = page

        if (page === 1) {
          messagesAdapter.setAll(convState, messages)
        } else {
          // Prepend older messages
          messagesAdapter.upsertMany(convState, messages)
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        const { conversationId } = action.meta.arg
        if (state.messages[conversationId]) {
          state.messages[conversationId]!.status = 'failed'
          state.messages[conversationId]!.error =
            (action.payload as string) || 'Error'
        }
      })

    // sendChatMessage
    builder
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        const { conversationId, tempId, message } = action.payload
        const convState = state.messages[conversationId]
        if (convState) {
          // Remove temp message if present and add real message
          if (convState.entities[tempId]) {
            messagesAdapter.removeOne(convState, tempId)
          }
          messagesAdapter.upsertOne(convState, message)
        }
        conversationsAdapter.updateOne(state.conversations, {
          id: conversationId,
          changes: {
            lastMessage: message,
            updatedAt: message.createdAt,
          },
        })
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        const payload = action.payload as
          | { conversationId: string; tempId: string; error: string }
          | undefined
        if (payload && state.messages[payload.conversationId]) {
          const convState = state.messages[payload.conversationId]!
          if (convState.entities[payload.tempId]) {
            messagesAdapter.updateOne(convState, {
              id: payload.tempId,
              changes: { status: 'failed' },
            })
          }
        }
      })
  },
})

export const {
  setActiveConversationId,
  toggleInfoPanel,
  setInfoPanelOpen,
  optimisticMessageAdded,
  messageReceived,
  setTyping,
  setUserOnline,
  setUserOffline,
  setOnlineUsers,
  messageRead,
} = chatSlice.actions

export default chatSlice.reducer
