import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from './Spinner'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variantClasses = {
  primary: 'bg-primary text-[#FBF6EF] hover:opacity-90 active:scale-[0.98] shadow-sm',
  secondary: 'bg-surface text-text border border-border hover:bg-bg active:scale-[0.98]',
  ghost: 'bg-transparent text-text hover:bg-border/30 active:scale-[0.98]',
  danger: 'bg-danger text-white hover:opacity-90 active:scale-[0.98]',
}

const sizeClasses = {
  sm: 'text-xs px-3 py-1.5 rounded-lg min-h-[36px]',
  md: 'text-sm px-4 py-2.5 rounded-xl min-h-[44px]',
  lg: 'text-base px-5 py-3 rounded-2xl min-h-[48px]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading

  return (
    <button
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Spinner size="sm" className="mr-2" />
      ) : leftIcon ? (
        <span className="mr-2 inline-flex items-center">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && rightIcon ? (
        <span className="ml-2 inline-flex items-center">{rightIcon}</span>
      ) : null}
    </button>
  )
}
