import { Outlet, useLocation } from 'react-router'
import { MessageSquare } from 'lucide-react'
import { EmptyState } from '../../../../shared/ui'

export function ChatLayout() {
  const { pathname } = useLocation()
  const isConversationOpen = pathname.startsWith('/chats/')

  return (
    <div className="flex h-full min-w-0 flex-1 bg-bg">
      <aside
        className={`${isConversationOpen ? 'hidden' : 'flex'} w-full flex-col border-r border-border bg-surface md:flex md:w-80 md:flex-shrink-0`}
        aria-label="Chat list"
      >
        <header className="border-b border-border px-5 py-4">
          <h1 className="text-xl font-bold text-text">Chats</h1>
        </header>
        <div className="flex flex-1 items-center justify-center p-6">
          <EmptyState
            icon={<MessageSquare className="h-7 w-7" />}
            title="No conversations yet"
            description="Your conversations will appear here."
          />
        </div>
      </aside>

      <section
        className={`${isConversationOpen ? 'flex' : 'hidden'} min-w-0 flex-1 md:flex`}
        aria-label="Selected conversation"
      >
        <Outlet />
      </section>
    </div>
  )
}

export default ChatLayout
