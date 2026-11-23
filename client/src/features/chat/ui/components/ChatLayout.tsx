import { useState, useEffect, useMemo } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { MessageSquare, Plus, Search } from 'lucide-react'
import { useAuth } from '../../../auth/hooks/useAuth'
import { useAppDispatch, useAppSelector } from '../../../../shared/hooks'
import { fetchConversations } from '../../state/chatSlice'
import {
  selectAllConversations,
  selectConversationsStatus,
  selectOnlineUsers,
  selectConnectionStatus,
} from '../../state/chatSelectors'
import { Avatar, Button, EmptyState, Input } from '../../../../shared/ui'
import { ConversationItem } from './ConversationItem'
import { ConversationSkeleton } from './ConversationSkeleton'
import { NewConversationModal } from './NewConversationModal'

export function ChatLayout() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const dispatch = useAppDispatch()

  const isConversationOpen = pathname.startsWith('/chats/') && pathname !== '/chats'
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)

  const conversations = useAppSelector(selectAllConversations)
  const status = useAppSelector(selectConversationsStatus)
  const onlineUsers = useAppSelector(selectOnlineUsers)
  const connectionStatus = useAppSelector(selectConnectionStatus)

  // Total unread conversations count
  const totalUnreadCount = useMemo(() => {
    return conversations.filter((conversation) => {
      const lastMsg = conversation.lastMessage
      return (
        lastMsg &&
        lastMsg.status !== 'read' &&
        (typeof lastMsg.sender === 'object'
          ? lastMsg.sender._id !== user?.id
          : lastMsg.sender !== user?.id)
      )
    }).length
  }, [conversations, user?.id])

  // Fetch conversations on mount
  useEffect(() => {
    dispatch(fetchConversations())
  }, [dispatch])

  // Filter conversations by tab and search
  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      // Tab filter
      if (activeTab === 'unread') {
        const lastMsg = conversation.lastMessage
        const isUnread =
          lastMsg &&
          lastMsg.status !== 'read' &&
          (typeof lastMsg.sender === 'object'
            ? lastMsg.sender._id !== user?.id
            : lastMsg.sender !== user?.id)
        if (!isUnread) return false
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchParticipant = conversation.participants.some(
          (p) =>
            p._id !== user?.id &&
            (p.name.toLowerCase().includes(query) ||
              p.email.toLowerCase().includes(query))
        )
        const matchLastMessage = conversation.lastMessage?.content
          ?.toLowerCase()
          .includes(query)
        return matchParticipant || matchLastMessage
      }

      return true
    })
  }, [conversations, activeTab, searchQuery, user?.id])

  return (
    <div className="flex h-full min-w-0 flex-1 bg-bg relative">
      {/* Offline/Reconnection status banner */}
      {connectionStatus !== 'connected' && (
        <div
          role="status"
          aria-live="polite"
          className="absolute top-0 inset-x-0 z-40 bg-accent text-[#2B1D16] py-1 px-4 text-center text-xs font-semibold shadow-xs flex items-center justify-center gap-2 select-none"
        >
          <span className="h-2 w-2 rounded-full bg-[#2B1D16] animate-pulse" />
          <span>
            {connectionStatus === 'reconnecting'
              ? 'Reconnecting to SWOOP chat...'
              : 'Connecting to live chat...'}
          </span>
        </div>
      )}
      {/* Conversation List Sidebar */}
      <aside
        className={`${
          isConversationOpen ? 'hidden' : 'flex'
        } relative w-full flex-col border-r border-border bg-surface md:flex md:w-80 md:flex-shrink-0`}
        aria-label="Chat list"
      >
        <header className="space-y-3 border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-text">Chats</h1>
            {user && (
              <div className="flex justify-end md:hidden">
                <NavLink
                  to="/profile"
                  className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  title={`${user.name} (${user.email})`}
                  aria-label="Account"
                >
                  <Avatar name={user.name} id={user.id} size="sm" isOnline />
                </NavLink>
              </div>
            )}
          </div>

          <Input
            type="search"
            placeholder="Search chats..."
            aria-label="Search chats"
            leftIcon={<Search className="h-4 w-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Filter Tabs: All & Unread */}
          <div className="flex rounded-xl bg-bg/80 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-surface text-primary shadow-xs'
                  : 'text-muted hover:text-text'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('unread')}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'unread'
                  ? 'bg-surface text-primary shadow-xs'
                  : 'text-muted hover:text-text'
              }`}
            >
              <span>Unread</span>
              {totalUnreadCount > 0 && (
                <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-[#2B1D16] leading-none">
                  {totalUnreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Conversation List / Loading / Empty */}
        <div className="flex-1 overflow-y-auto">
          {status === 'loading' && conversations.length === 0 ? (
            <>
              <ConversationSkeleton />
              <ConversationSkeleton />
              <ConversationSkeleton />
              <ConversationSkeleton />
            </>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => {
              const partner = conversation.participants.find(
                (p) => p._id !== user?.id
              )
              const isPartnerOnline = partner
                ? onlineUsers.includes(partner._id)
                : false

              return (
                <ConversationItem
                  key={conversation._id}
                  conversation={conversation}
                  currentUserId={user?.id}
                  isOnline={isPartnerOnline}
                />
              )
            })
          ) : (
            <div className="flex h-full items-center justify-center p-6">
              <EmptyState
                icon={<MessageSquare className="h-7 w-7" />}
                title={
                  searchQuery.trim()
                    ? 'No matching conversations'
                    : activeTab === 'unread'
                    ? 'No unread messages'
                    : 'No conversations yet'
                }
                description={
                  searchQuery.trim()
                    ? 'Try another search keyword.'
                    : activeTab === 'unread'
                    ? 'You are all caught up!'
                    : 'Start a new conversation using the button below.'
                }
              />
            </div>
          )}
        </div>

        {/* Floating Action Button for New Chat */}
        <Button
          type="button"
          aria-label="Start a new chat"
          title="Start a new chat"
          className="absolute bottom-20 right-5 h-12 w-12 !rounded-full !p-0 shadow-lg md:bottom-6 md:right-6"
          onClick={() => setIsNewChatOpen(true)}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </aside>

      {/* Main Conversation Outlet */}
      <section
        className={`${
          isConversationOpen ? 'flex' : 'hidden'
        } min-w-0 flex-1 md:flex`}
        aria-label="Selected conversation"
      >
        <Outlet />
      </section>

      {/* New Conversation Modal */}
      <NewConversationModal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
      />
    </div>
  )
}

export default ChatLayout
