import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { MessageSquare, Plus, Search } from 'lucide-react'
import { useAuth } from '../../../auth/hooks/useAuth'
import { Avatar, Button, EmptyState, Input, Modal } from '../../../../shared/ui'

export function ChatLayout() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const isConversationOpen = pathname.startsWith('/chats/')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddChatOpen, setIsAddChatOpen] = useState(false)
  const hasSearchQuery = searchQuery.trim().length > 0

  return (
    <div className="flex h-full min-w-0 flex-1 bg-bg">
      <aside
        className={`${isConversationOpen ? 'hidden' : 'flex'} relative w-full flex-col border-r border-border bg-surface md:flex md:w-80 md:flex-shrink-0`}
        aria-label="Chat list"
      >
        <header className="space-y-4 border-b border-border px-5 py-4">
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
          <Input
            type="search"
            placeholder="Search chats..."
            aria-label="Search chats"
            leftIcon={<Search className="h-4 w-4" />}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </header>
        <div className="flex flex-1 items-center justify-center p-6 pb-20">
          <EmptyState
            icon={<MessageSquare className="h-7 w-7" />}
            title={hasSearchQuery ? 'No matching conversations' : 'No conversations yet'}
            description={
              hasSearchQuery
                ? 'Try another search.'
                : 'Your conversations will appear here.'
            }
          />
        </div>
        <Button
          type="button"
          aria-label="Start a new chat"
          title="Start a new chat"
          className="absolute bottom-20 right-5 h-12 w-12 !rounded-full !p-0 shadow-lg md:bottom-5"
          onClick={() => setIsAddChatOpen(true)}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </aside>

      <section
        className={`${isConversationOpen ? 'flex' : 'hidden'} min-w-0 flex-1 md:flex`}
        aria-label="Selected conversation"
      >
        <Outlet />
      </section>

      <Modal
        isOpen={isAddChatOpen}
        onClose={() => setIsAddChatOpen(false)}
        title="New chat"
        description="Creating new conversations isn't available yet."
      >
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => setIsAddChatOpen(false)}
        >
          Got it
        </Button>
      </Modal>
    </div>
  )
}

export default ChatLayout
