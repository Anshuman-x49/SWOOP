import { NavLink } from 'react-router'
import { formatDistanceToNow, isToday, format } from 'date-fns'
import type { Conversation } from '../../api/chatApi'
import { getPartnerParticipant } from '../../state/chatSelectors'
import { Avatar, Badge } from '../../../../shared/ui'

export interface ConversationItemProps {
  conversation: Conversation
  currentUserId?: string
  isOnline?: boolean
}

export function ConversationItem({
  conversation,
  currentUserId,
  isOnline,
}: ConversationItemProps) {
  const partner = getPartnerParticipant(conversation, currentUserId)
  const lastMessage = conversation.lastMessage

  const formatMessageTime = (dateString?: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      if (isToday(date)) {
        return format(date, 'p') // e.g. 4:30 PM
      }
      return formatDistanceToNow(date, { addSuffix: false })
    } catch {
      return ''
    }
  }

  const isOwnLastMessage =
    lastMessage &&
    (typeof lastMessage.sender === 'object'
      ? lastMessage.sender._id === currentUserId
      : lastMessage.sender === currentUserId)

  return (
    <NavLink
      to={`/chats/${conversation._id}`}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3.5 transition-colors border-b border-border/50 text-left select-none ${
          isActive
            ? 'bg-primary/10 border-l-4 border-l-primary'
            : 'hover:bg-bg/60 active:bg-bg'
        }`
      }
    >
      <Avatar
        name={partner?.name || 'Unknown'}
        id={partner?._id}
        size="md"
        isOnline={isOnline}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-sm font-semibold text-text truncate">
            {partner?.name || 'Unknown User'}
          </span>
          {lastMessage?.createdAt && (
            <span className="text-[11px] text-muted flex-shrink-0">
              {formatMessageTime(lastMessage.createdAt)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted truncate">
            {isOwnLastMessage && <span className="font-medium text-text">You: </span>}
            {lastMessage?.content || 'No messages yet'}
          </p>

          {lastMessage && lastMessage.status !== 'read' && !isOwnLastMessage && (
            <Badge variant="accent" count={1} className="flex-shrink-0" />
          )}
        </div>
      </div>
    </NavLink>
  )
}
