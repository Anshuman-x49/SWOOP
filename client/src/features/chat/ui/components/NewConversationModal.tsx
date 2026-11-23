import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Search, MessageSquare, Loader2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../../shared/hooks'
import { searchUsersQuery, clearSearchResults } from '../../../users/state/usersSlice'
import { createOrOpenConversation } from '../../state/chatSlice'
import { Modal, Input, Avatar, Button, EmptyState } from '../../../../shared/ui'

export interface NewConversationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewConversationModal({ isOpen, onClose }: NewConversationModalProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [isStarting, setIsStarting] = useState(false)
  const { searchResults, searchStatus } = useAppSelector((state) => state.users)
  const onlineUsers = useAppSelector((state) => state.chat.onlineUsers)

  // Debounce search query
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      dispatch(clearSearchResults())
      return
    }

    const timer = setTimeout(() => {
      if (query.trim()) {
        dispatch(searchUsersQuery(query.trim()))
      } else {
        dispatch(clearSearchResults())
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, isOpen, dispatch])

  const handleSelectUser = async (participantId: string) => {
    try {
      setIsStarting(true)
      const action = await dispatch(createOrOpenConversation(participantId))
      if (createOrOpenConversation.fulfilled.match(action)) {
        onClose()
        navigate(`/chats/${action.payload._id}`)
      }
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Start a conversation"
      description="Find people by name or email to brew up a chat."
    >
      <div className="space-y-4">
        <Input
          type="search"
          placeholder="Search name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          autoFocus
        />

        <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
          {searchStatus === 'loading' && (
            <div className="flex items-center justify-center p-8 text-muted">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {searchStatus !== 'loading' && searchResults.length > 0 && (
            searchResults.map((user) => {
              const isOnline = onlineUsers.includes(user.id)
              return (
                <button
                  key={user.id}
                  type="button"
                  disabled={isStarting}
                  onClick={() => handleSelectUser(user.id)}
                  className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-bg/70 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Avatar name={user.name} id={user.id} size="md" isOnline={isOnline} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text truncate">{user.name}</p>
                    <p className="text-xs text-muted truncate">{user.email}</p>
                  </div>
                  <Button variant="ghost" size="sm" disabled={isStarting}>
                    Chat
                  </Button>
                </button>
              )
            })
          )}

          {searchStatus !== 'loading' && query.trim() && searchResults.length === 0 && (
            <EmptyState
              icon={<MessageSquare className="h-6 w-6" />}
              title="No users found"
              description="Check the spelling or try searching another name or email."
            />
          )}

          {!query.trim() && (
            <div className="p-8 text-center text-xs text-muted">
              Start typing above to search across registered users.
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
