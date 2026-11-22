import { EmptyState } from '../../../../shared/ui'
import { Coffee } from 'lucide-react'

/**
 * Default chats view when no conversation is selected (desktop/tablet)
 * or conversation list view on mobile.
 */
export function ChatsPage() {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center bg-bg p-6">
      <EmptyState
        icon={<Coffee className="h-7 w-7" />}
        title="Welcome to SWOOP"
        description="Select a conversation from the left to start messaging, or brew up a new conversation."
      />
    </div>
  )
}

export default ChatsPage
