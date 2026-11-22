import { getAvatarColor, getInitials } from '../../utils/avatarColor'

export interface AvatarProps {
  name: string
  id?: string
  src?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isOnline?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
}

const onlineDotSize = {
  sm: 'w-2.5 h-2.5 bottom-0 right-0 border-[1.5px]',
  md: 'w-3 h-3 bottom-0 right-0 border-2',
  lg: 'w-3.5 h-3.5 bottom-0.5 right-0.5 border-2',
  xl: 'w-4 h-4 bottom-1 right-1 border-2',
}

export function Avatar({
  name,
  id,
  src,
  size = 'md',
  isOnline,
  className = '',
}: AvatarProps) {
  const color = getAvatarColor(id || name)
  const initials = getInitials(name)

  return (
    <div className={`relative inline-flex flex-shrink-0 items-center justify-center rounded-full font-semibold select-none ${sizeClasses[size]} ${color.bg} ${color.text} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}

      {typeof isOnline === 'boolean' && (
        <span
          className={`absolute rounded-full border-surface transition-colors ${
            isOnline ? 'bg-online' : 'bg-muted/40'
          } ${onlineDotSize[size]}`}
          title={isOnline ? 'Online' : 'Offline'}
          aria-label={isOnline ? 'Online' : 'Offline'}
        />
      )}
    </div>
  )
}
