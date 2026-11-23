import { useEffect, useRef, useMemo } from 'react'
import { useParams } from 'react-router'
import { useAuth } from '../../../auth/hooks/useAuth'
import { useAppDispatch, useAppSelector } from '../../../../shared/hooks'
import {
  fetchMessages,
  setActiveConversationId,
  sendChatMessage,
  optimisticMessageAdded,
  toggleInfoPanel,
  setInfoPanelOpen,
} from '../../state/chatSlice'
import {
  selectConversationById,
  selectMessagesForConversation,
  selectMessagesStateForConversation,
  selectOnlineUsers,
  selectTypingUsersForActiveConversation,
  selectIsInfoPanelOpen,
  getPartnerParticipant,
} from '../../state/chatSelectors'
import type { Message } from '../../api/chatApi'
import { useChatSocket } from '../../hooks/useChatSocket'
import { ChatHeader } from '../components/ChatHeader'
import { MessageBubble } from '../components/MessageBubble'
import { DateDivider } from '../components/DateDivider'
import { TypingIndicator } from '../components/TypingIndicator'
import { MessageInput } from '../components/MessageInput'
import { ContactInfoPanel } from '../components/ContactInfoPanel'
import { Spinner, EmptyState } from '../../../../shared/ui'
import { MessageSquare } from 'lucide-react'

export function ChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const { sendTypingNotification, markConversationRead } = useChatSocket()

  const conversation = useAppSelector((state) =>
    conversationId ? selectConversationById(state, conversationId) : null
  )
  const messages = useAppSelector((state) =>
    selectMessagesForConversation(state, conversationId || null)
  )
  const messagesState = useAppSelector((state) =>
    selectMessagesStateForConversation(state, conversationId || null)
  )
  const onlineUsers = useAppSelector(selectOnlineUsers) as string[]
  const typingUsers = useAppSelector(selectTypingUsersForActiveConversation) as string[]
  const isInfoOpen = useAppSelector(selectIsInfoPanelOpen)

  const partner = useMemo(
    () => getPartnerParticipant(conversation, user?.id),
    [conversation, user?.id]
  )
  const isPartnerOnline = partner ? onlineUsers.includes(partner._id) : false

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const bottomSentinelRef = useRef<HTMLDivElement>(null)
  const isInitialLoadRef = useRef(true)

  // 1. Set active conversation & load initial messages
  useEffect(() => {
    if (!conversationId) return

    dispatch(setActiveConversationId(conversationId))
    dispatch(fetchMessages({ conversationId, page: 1 }))
    markConversationRead()
    isInitialLoadRef.current = true

    return () => {
      dispatch(setActiveConversationId(null))
    }
  }, [conversationId, dispatch, markConversationRead])

  // 2. Auto-scroll to bottom on initial load and when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      if (isInitialLoadRef.current) {
        bottomSentinelRef.current?.scrollIntoView({ behavior: 'auto' })
        isInitialLoadRef.current = false
      } else {
        const container = scrollContainerRef.current
        if (container) {
          const isNearBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight < 200
          if (isNearBottom) {
            bottomSentinelRef.current?.scrollIntoView({ behavior: 'smooth' })
          }
        }
      }
    }
  }, [messages.length])

  // 3. Pagination: load older messages on scroll near top
  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container || !conversationId) return

    if (
      container.scrollTop === 0 &&
      messagesState.hasMore &&
      messagesState.status !== 'loading'
    ) {
      const prevScrollHeight = container.scrollHeight
      dispatch(
        fetchMessages({
          conversationId,
          page: messagesState.page + 1,
        })
      ).then(() => {
        // Maintain scroll position after prepending older messages
        requestAnimationFrame(() => {
          if (container) {
            container.scrollTop = container.scrollHeight - prevScrollHeight
          }
        })
      })
    }
  }

  // 4. Send Message Handler
  const handleSendMessage = (content: string) => {
    if (!conversationId || !user) return

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const optimisticMsg: Message = {
      _id: tempId,
      conversation: conversationId,
      sender: {
        _id: user.id,
        name: user.name,
        email: user.email,
      },
      content,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tempId,
    }

    dispatch(
      optimisticMessageAdded({
        conversationId,
        message: optimisticMsg,
      })
    )

    dispatch(
      sendChatMessage({
        conversationId,
        content,
        tempId,
      })
    )

    requestAnimationFrame(() => {
      bottomSentinelRef.current?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups: Array<{ dateKey: string; messages: Message[] }> = []
    let currentDateKey = ''

    messages.forEach((msg: Message) => {
      const msgDate = new Date(msg.createdAt).toDateString()
      if (msgDate !== currentDateKey) {
        currentDateKey = msgDate
        groups.push({ dateKey: msgDate, messages: [msg] })
      } else {
        groups[groups.length - 1]?.messages.push(msg)
      }
    })

    return groups
  }, [messages])

  const isPartnerTyping = Boolean(partner && typingUsers.includes(partner._id))

  return (
    <div className="flex h-full w-full flex-1 overflow-hidden bg-bg">
      {/* Central Chat Column */}
      <div className="flex h-full flex-1 flex-col min-w-0 relative">
        <ChatHeader
          partner={partner}
          isOnline={isPartnerOnline}
          onToggleInfo={() => dispatch(toggleInfoPanel())}
        />

        {/* Messages Scroll Area */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-3 min-h-0"
        >
          {messagesState.status === 'loading' && messagesState.page > 1 && (
            <div className="py-2 text-center">
              <Spinner size="sm" />
            </div>
          )}

          {messagesState.status === 'loading' && messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <Spinner size="md" label="Loading messages..." />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <EmptyState
                icon={<MessageSquare className="h-7 w-7" />}
                title="Say hello!"
                description="This is the start of your direct conversation."
              />
            </div>
          ) : (
            groupedMessages.map((group) => (
              <div key={group.dateKey}>
                <DateDivider date={group.dateKey} />
                {group.messages.map((message) => {
                  const isOwn =
                    typeof message.sender === 'object'
                      ? message.sender._id === user?.id
                      : message.sender === user?.id

                  return (
                    <MessageBubble
                      key={message._id}
                      message={message}
                      isOwn={isOwn}
                      onRetry={(failedMsg: Message) =>
                        handleSendMessage(failedMsg.content)
                      }
                    />
                  )
                })}
              </div>
            ))
          )}

          {isPartnerTyping && <TypingIndicator partnerName={partner?.name} />}

          <div ref={bottomSentinelRef} />
        </div>

        {/* Message Input Bar */}
        <MessageInput
          onSendMessage={handleSendMessage}
          onTyping={sendTypingNotification}
        />
      </div>

      {/* Contact Info Panel / Drawer */}
      <ContactInfoPanel
        partner={partner}
        isOnline={isPartnerOnline}
        isOpen={isInfoOpen}
        onClose={() => dispatch(setInfoPanelOpen(false))}
      />
    </div>
  )
}

export default ChatPage
