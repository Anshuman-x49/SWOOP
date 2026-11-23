import { useEffect, useRef, useCallback } from 'react'
import { connectSocket, getSocket } from '../../../config/socket'
import { SOCKET_EVENTS } from '../../../constants/socketEvents'
import { useAppDispatch, useAppSelector } from '../../../shared/hooks'
import {
  messageReceived,
  setTyping,
  setUserOnline,
  setUserOffline,
  setOnlineUsers,
  messageRead,
} from '../state/chatSlice'
import type { Message } from '../api/chatApi'

export function useChatSocket() {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.auth.accessToken)
  const activeConversationId = useAppSelector(
    (state) => state.chat.activeConversationId
  )
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTypingRef = useRef<boolean>(false)

  // 1. Establish socket connection on auth
  useEffect(() => {
    if (!accessToken) return

    const socket = connectSocket(accessToken)

    const handleNewMessage = (message: Message) => {
      dispatch(messageReceived(message))
    }

    const handleTyping = (data: {
      conversationId: string
      userId: string
      isTyping: boolean
    }) => {
      dispatch(setTyping(data))
    }

    const handleUserOnline = (data: { userId: string }) => {
      dispatch(setUserOnline(data.userId))
    }

    const handleUserOffline = (data: { userId: string }) => {
      dispatch(setUserOffline(data.userId))
    }

    const handleOnlineUsers = (data: { userIds: string[] }) => {
      dispatch(setOnlineUsers(data.userIds))
    }

    const handleMessageRead = (data: {
      conversationId: string
      messageId?: string
      userId: string
    }) => {
      dispatch(messageRead(data))
    }

    socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage)
    socket.on(SOCKET_EVENTS.TYPING, handleTyping)
    socket.on(SOCKET_EVENTS.USER_ONLINE, handleUserOnline)
    socket.on(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline)
    socket.on(SOCKET_EVENTS.ONLINE_USERS, handleOnlineUsers)
    socket.on(SOCKET_EVENTS.MESSAGE_READ, handleMessageRead)

    return () => {
      socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage)
      socket.off(SOCKET_EVENTS.TYPING, handleTyping)
      socket.off(SOCKET_EVENTS.USER_ONLINE, handleUserOnline)
      socket.off(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline)
      socket.off(SOCKET_EVENTS.ONLINE_USERS, handleOnlineUsers)
      socket.off(SOCKET_EVENTS.MESSAGE_READ, handleMessageRead)
    }
  }, [accessToken, dispatch])

  // 2. Manage active room joining & leaving
  useEffect(() => {
    const socket = getSocket()
    if (!socket || !activeConversationId) return

    socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, {
      conversationId: activeConversationId,
    })

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, {
        conversationId: activeConversationId,
      })
    }
  }, [activeConversationId])

  // 3. Debounced typing indicator emission helper
  const sendTypingNotification = useCallback(() => {
    const socket = getSocket()
    if (!socket || !activeConversationId) return

    if (!isTypingRef.current) {
      isTypingRef.current = true
      socket.emit(SOCKET_EVENTS.TYPING_START, {
        conversationId: activeConversationId,
      })
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false
      socket.emit(SOCKET_EVENTS.TYPING_STOP, {
        conversationId: activeConversationId,
      })
    }, 2000)
  }, [activeConversationId])

  const markConversationRead = useCallback(
    (messageId?: string) => {
      const socket = getSocket()
      if (!socket || !activeConversationId) return

      socket.emit(SOCKET_EVENTS.MARK_READ, {
        conversationId: activeConversationId,
        messageId,
      })
    },
    [activeConversationId]
  )

  return {
    sendTypingNotification,
    markConversationRead,
  }
}
