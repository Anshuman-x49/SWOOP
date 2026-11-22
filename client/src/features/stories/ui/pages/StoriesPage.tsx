import { BookOpen } from 'lucide-react'
import { EmptyState } from '../../../../shared/ui'

export function StoriesPage() {
  return (
    <div className="flex h-full flex-1 items-center justify-center bg-bg p-6">
      <EmptyState
        icon={<BookOpen className="h-7 w-7" />}
        title="Stories are coming soon"
        description="Stories from your friends will appear here."
      />
    </div>
  )
}

export default StoriesPage
