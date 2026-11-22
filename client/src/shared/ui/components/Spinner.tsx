import type { HTMLAttributes } from 'react'

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  label?: string
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-7 h-7 border-3',
  lg: 'w-10 h-10 border-4',
}

export function Spinner({
  size = 'md',
  fullScreen = false,
  label = 'Loading...',
  className = '',
  ...props
}: SpinnerProps) {
  const spinnerElement = (
    <div
      role="status"
      aria-label={label}
      className={`inline-block animate-spin rounded-full border-border border-t-primary ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <span className="sr-only">{label}</span>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg/80 backdrop-blur-sm">
        {spinnerElement}
        {label && <p className="mt-3 text-sm font-medium text-muted">{label}</p>}
      </div>
    )
  }

  return spinnerElement
}
