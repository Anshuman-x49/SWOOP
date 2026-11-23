/**
 * Centralized Socket.IO event names for real-time messaging, typing, and presence
 */
export const SOCKET_EVENTS = {
  // Client -> Server
  JOIN_CONVERSATION: 'join-conversation',
  LEAVE_CONVERSATION: 'leave-conversation',
  SEND_MESSAGE: 'send-message',
  TYPING_START: 'typing-start',
  TYPING_STOP: 'typing-stop',
  MARK_READ: 'mark-read',

  // Server -> Client
  NEW_MESSAGE: 'new-message',
  TYPING: 'typing',
  MESSAGE_READ: 'message-read',
  USER_ONLINE: 'user-online',
  USER_OFFLINE: 'user-offline',
  ONLINE_USERS: 'online-users',
} as const
