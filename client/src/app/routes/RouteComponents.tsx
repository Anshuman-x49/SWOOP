import { lazy, Suspense } from 'react'
import { Spinner } from '../../shared/ui'

export const LoginPage = lazy(() => import('../../features/auth/ui/pages/LoginPage'))
export const RegisterPage = lazy(() => import('../../features/auth/ui/pages/RegisterPage'))
export const ChatLayout = lazy(() => import('../../features/chat/ui/components/ChatLayout'))
export const ChatsPage = lazy(() => import('../../features/chat/ui/pages/ChatsPage'))
export const ChatPage = lazy(() => import('../../features/chat/ui/pages/ChatPage'))
export const CallsPage = lazy(() => import('../../features/calls/ui/pages/CallsPage'))
export const StoriesPage = lazy(() => import('../../features/stories/ui/pages/StoriesPage'))
export const ProfilePage = lazy(() => import('../../shared/ui/pages/ProfilePage'))
export const NotFoundPage = lazy(() => import('../../shared/ui/pages/NotFoundPage'))

export function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Spinner fullScreen label="Loading..." />}>
      {children}
    </Suspense>
  )
}
