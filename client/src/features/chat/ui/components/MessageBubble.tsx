import { format } from 'date-fns'
import { Check, CheckCheck, Clock, AlertCircle, RotateCcw } from 'lucide-react'
import type { Message } from '../../api/chatApi'

export interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  onRetry?: (message: Message) => void
}

export function MessageBubble({ message, isOwn, onRetry }: MessageBubbleProps) {
  const formatTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'p')
    } catch {
      return ''
    }
  }

  const renderStatus = () => {
    if (!isOwn) return null

    switch (message.status) {
      case 'pending':
        return (
          <span title="Sending...">
            <Clock className="h-3 w-3 text-muted/70 animate-pulse" />
          </span>
        )
      case 'sent':
        return (
          <span title="Sent">
            <Check className="h-3 w-3 text-muted" />
          </span>
        )
      case 'delivered':
        return (
          <span title="Delivered">
            <CheckCheck className="h-3.5 w-3.5 text-muted" />
          </span>
        )
      case 'read':
        return (
          <span title="Read">
            <CheckCheck className="h-3.5 w-3.5 text-primary font-bold" />
          </span>
        )
      case 'failed':
        return (
          <button
            type="button"
            onClick={() => onRetry?.(message)}
            className="inline-flex items-center gap-1 text-[11px] text-danger font-medium hover:underline"
            title="Failed to send. Click to retry."
          >
            <AlertCircle className="h-3 w-3" />
            <RotateCcw className="h-2.5 w-2.5" />
          </button>
        )
      default:
        return null
    }
  }

  return (
    <div className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'} my-1`}>
      <div
        className={`relative max-w-[80%] md:max-w-[70%] px-4 py-2.5 break-words transition-all duration-150 ${
          isOwn
            ? 'bg-bubble-own text-text rounded-2xl rounded-tr-xs shadow-2xs'
            : 'bg-bubble-other text-text rounded-2xl rounded-tl-xs shadow-2xs border border-border/40'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>

        <div
          className={`mt-1 flex items-center gap-1 text-[10px] select-none ${
            isOwn ? 'justify-end text-muted' : 'justify-start text-muted/80'
          }`}
        >
          <span>{formatTime(message.createdAt)}</span>
          {renderStatus()}
        </div>
      </div>
    </div>
  )
}
