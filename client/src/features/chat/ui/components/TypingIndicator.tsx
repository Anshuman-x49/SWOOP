export interface TypingIndicatorProps {
  partnerName?: string
}

export function TypingIndicator({ partnerName }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 text-xs text-muted select-none animate-fade-in">
      <div className="flex items-center gap-1 rounded-full bg-surface px-3 py-1.5 border border-border/60 shadow-2xs">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
      </div>
      <span>{partnerName ? `${partnerName} is typing...` : 'typing...'}</span>
    </div>
  )
}
