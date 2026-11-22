import type { HTMLAttributes } from 'react'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  rounded?: 'sm' | 'md' | 'lg' | 'full'
}

const roundedClasses = {
  sm: 'rounded-md',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full',
}

export function Skeleton({
  rounded = 'md',
  className = '',
  ...props
}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-border/40 ${roundedClasses[rounded]} ${className}`}
      {...props}
    />
  )
}
