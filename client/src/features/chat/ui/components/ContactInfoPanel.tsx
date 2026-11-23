import { Mail, User as UserIcon } from 'lucide-react'
import type { Participant } from '../../api/chatApi'
import { Avatar, Drawer } from '../../../../shared/ui'

export interface ContactInfoPanelProps {
  partner: Participant | null
  isOnline: boolean
  isOpen: boolean
  onClose: () => void
}

export function ContactInfoPanel({
  partner,
  isOnline,
  isOpen,
  onClose,
}: ContactInfoPanelProps) {
  if (!partner) return null

  const content = (
    <div className="flex flex-col items-center p-6 text-center">
      <Avatar
        name={partner.name}
        id={partner._id}
        size="xl"
        isOnline={isOnline}
        className="mb-4 shadow-sm"
      />
      <h3 className="text-lg font-bold text-text">{partner.name}</h3>
      <p className="text-xs flex items-center gap-1.5 mt-1">
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            isOnline ? 'bg-online' : 'bg-muted/40'
          }`}
        />
        <span className={isOnline ? 'text-online font-semibold' : 'text-muted'}>
          {isOnline ? 'Online now' : 'Offline'}
        </span>
      </p>

      <div className="w-full mt-6 space-y-3 border-t border-border/80 pt-6 text-left">
        <div className="flex items-center gap-3 rounded-xl bg-bg/70 p-3.5 text-sm">
          <UserIcon className="h-5 w-5 text-muted flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider">
              Display Name
            </p>
            <p className="font-semibold text-text truncate">{partner.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-bg/70 p-3.5 text-sm">
          <Mail className="h-5 w-5 text-muted flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider">
              Email Address
            </p>
            <p className="font-semibold text-text truncate">{partner.email}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile and Tablet: Slide-in Drawer */}
      <div className="xl:hidden">
        <Drawer isOpen={isOpen} onClose={onClose} title="Contact Info">
          {content}
        </Drawer>
      </div>

      {/* Desktop >= 1280px: Docked Panel */}
      {isOpen && (
        <aside
          className="hidden xl:flex w-80 flex-col border-l border-border bg-surface h-full flex-shrink-0 overflow-y-auto z-10 transition-all duration-200"
          aria-label="Contact Information"
        >
          <div className="border-b border-border px-5 py-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-text">Contact Info</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-muted hover:text-text font-medium"
            >
              Close
            </button>
          </div>
          {content}
        </aside>
      )}
    </>
  )
}
