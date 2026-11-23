import { isToday, isYesterday, format } from 'date-fns'

export interface DateDividerProps {
  date: Date | string
}

export function DateDivider({ date }: DateDividerProps) {
  const d = new Date(date)

  let label = format(d, 'MMMM d, yyyy')
  if (isToday(d)) {
    label = 'Today'
  } else if (isYesterday(d)) {
    label = 'Yesterday'
  }

  return (
    <div className="my-4 flex items-center justify-center select-none">
      <span className="rounded-full bg-border/60 px-3 py-1 text-[11px] font-semibold tracking-wide text-muted shadow-2xs">
        {label}
      </span>
    </div>
  )
}
