import { useParams, Link } from 'react-router'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { EmptyState } from '../../../../shared/ui'

/**
 * Chat view for a specific conversation (/chats/:conversationId)
 * (In Step 5, this will be wired to the full ChatPane)
 */
export function ChatPage() {
  const { conversationId } = useParams()

  return (
    <div className="flex h-full w-full flex-1 flex-col bg-bg">
      {/* Mobile back header */}
      <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3 md:hidden">
        <Link
          to="/chats"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-text hover:bg-bg active:scale-95"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-sm font-semibold text-text">Conversation</h2>
          <p className="text-xs text-muted">ID: {conversationId}</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <EmptyState
          icon={<MessageSquare className="h-7 w-7" />}
          title="Conversation selected"
          description={`Viewing conversation ${conversationId}. Chat pane and message input will be connected in Step 5.`}
        />
      </div>
    </div>
  )
}

export default ChatPage
