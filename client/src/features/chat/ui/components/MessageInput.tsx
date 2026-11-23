import { useState, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from 'react'
import { Send } from 'lucide-react'

export interface MessageInputProps {
  onSendMessage: (content: string) => void
  onTyping?: () => void
  disabled?: boolean
}

export function MessageInput({
  onSendMessage,
  onTyping,
  disabled = false,
}: MessageInputProps) {
  const [content, setContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea up to 4 lines
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const newHeight = Math.min(textarea.scrollHeight, 120)
      textarea.style.height = `${newHeight}px`
    }
  }, [content])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    onTyping?.()
  }

  const handleSend = () => {
    const trimmed = content.trim()
    if (!trimmed || disabled) return
    onSendMessage(trimmed)
    setContent('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const canSend = content.trim().length > 0 && !disabled

  return (
    <div className="border-t border-border bg-surface p-3 sm:p-4 select-none flex-shrink-0 z-10">
      <div className="flex items-end gap-2 rounded-2xl bg-bg/80 border border-border p-1.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
        <textarea
          ref={textareaRef}
          rows={1}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Write a message... (Press Enter to send)"
          aria-label="Message text"
          disabled={disabled}
          className="max-h-32 min-h-[38px] flex-1 resize-none bg-transparent px-3 py-2 text-sm text-text placeholder:text-muted/60 focus:outline-none disabled:opacity-50"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          title="Send"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-[#FBF6EF] transition-all duration-150 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
