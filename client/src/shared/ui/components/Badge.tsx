import type { HTMLAttributes } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  count?: number
  variant?: 'accent' | 'primary' | 'muted'
}

export function Badge({
  count,
  variant = 'accent',
  children,
  className = '',
  ...props
}: BadgeProps) {
  const variantClasses = {
    accent: 'bg-accent text-[#2B1D16]',
    primary: 'bg-primary text-[#FBF6EF]',
    muted: 'bg-border text-muted',
  }

  const content = count !== undefined ? (count > 99 ? '99+' : count) : children

  if (count === 0) return null

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold leading-none shadow-xs ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {content}
    </span>
  )
}
