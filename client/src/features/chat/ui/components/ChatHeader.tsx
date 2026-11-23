import { Link } from 'react-router'
import { ArrowLeft, Info } from 'lucide-react'
import type { Participant } from '../../api/chatApi'
import { Avatar } from '../../../../shared/ui'

export interface ChatHeaderProps {
  partner: Participant | null
  isOnline: boolean
  onToggleInfo: () => void
}

export function ChatHeader({ partner, isOnline, onToggleInfo }: ChatHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 py-3 select-none z-10 flex-shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back Button */}
        <Link
          to="/chats"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-text hover:bg-bg md:hidden active:scale-95 transition-colors"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        {partner ? (
          <div className="flex items-center gap-3 min-w-0">
            <Avatar
              name={partner.name}
              id={partner._id}
              size="md"
              isOnline={isOnline}
            />
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-text truncate">
                {partner.name}
              </h2>
              <p className="text-xs flex items-center gap-1.5">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    isOnline ? 'bg-online' : 'bg-muted/40'
                  }`}
                />
                <span className={isOnline ? 'text-online font-medium' : 'text-muted'}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="text-sm font-semibold text-text">Conversation</div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onToggleInfo}
          aria-label="View conversation details"
          title="Details"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted hover:bg-bg hover:text-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Info className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
