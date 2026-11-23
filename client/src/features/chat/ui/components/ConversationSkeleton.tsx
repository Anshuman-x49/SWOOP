import { Skeleton } from '../../../../shared/ui'

export function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40">
      <Skeleton rounded="full" className="h-12 w-12 flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-3 w-12 rounded-md" />
        </div>
        <Skeleton className="h-3.5 w-44 rounded-md" />
      </div>
    </div>
  )
}
