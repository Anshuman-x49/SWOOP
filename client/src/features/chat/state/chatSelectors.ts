import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../../app/store/Store'
import { conversationsAdapter, messagesAdapter } from './chatSlice'
import type { Conversation, Message, Participant } from '../api/chatApi'

// Conversations selectors
const conversationsSelectors = conversationsAdapter.getSelectors<RootState>(
  (state) => state.chat.conversations
)

export const selectAllConversations = conversationsSelectors.selectAll
export const selectConversationById = conversationsSelectors.selectById
export const selectConversationTotal = conversationsSelectors.selectTotal

export const selectConversationsStatus = (state: RootState) =>
  state.chat.conversations.status

export const selectActiveConversationId = (state: RootState) =>
  state.chat.activeConversationId

export const selectIsInfoPanelOpen = (state: RootState) =>
  state.chat.isInfoPanelOpen

export const selectActiveConversation = createSelector(
  [selectAllConversations, selectActiveConversationId],
  (conversations, activeId) =>
    conversations.find((c) => c._id === activeId) || null
)

export const selectOnlineUsers = (state: RootState) => state.chat.onlineUsers

export const selectTypingUsersForActiveConversation = createSelector(
  [(state: RootState) => state.chat.typingUsers, selectActiveConversationId],
  (typingUsers, activeId) => (activeId ? typingUsers[activeId] || [] : [])
)

export const selectMessagesForConversation = (
  state: RootState,
  conversationId: string | null
): Message[] => {
  if (!conversationId || !state.chat.messages[conversationId]) {
    return []
  }
  return messagesAdapter
    .getSelectors()
    .selectAll(state.chat.messages[conversationId]!)
}

export const selectMessagesStateForConversation = (
  state: RootState,
  conversationId: string | null
) => {
  if (!conversationId || !state.chat.messages[conversationId]) {
    return {
      status: 'idle' as const,
      hasMore: false,
      page: 1,
    }
  }
  const convState = state.chat.messages[conversationId]!
  return {
    status: convState.status,
    hasMore: convState.hasMore,
    page: convState.page,
  }
}

/**
 * Returns partner participant for a direct conversation given current user ID
 */
export function getPartnerParticipant(
  conversation: Conversation | null,
  currentUserId?: string
): Participant | null {
  if (!conversation || !conversation.participants?.length) return null
  const partner = conversation.participants.find(
    (p) => p._id !== currentUserId
  )
  return partner || conversation.participants[0] || null
}
