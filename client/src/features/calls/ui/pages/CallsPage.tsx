import { Phone } from 'lucide-react'
import { EmptyState } from '../../../../shared/ui'

export function CallsPage() {
  return (
    <div className="flex h-full flex-1 items-center justify-center bg-bg p-6">
      <EmptyState
        icon={<Phone className="h-7 w-7" />}
        title="Calls are coming soon"
        description="Your calls will appear here."
      />
    </div>
  )
}

export default CallsPage
