import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { AppShell } from '../layout/AppShell'
import { Spinner } from '../../shared/ui'

// Lazy loaded page components
const LoginPage = lazy(() => import('../../features/auth/ui/pages/LoginPage'))
const RegisterPage = lazy(() => import('../../features/auth/ui/pages/RegisterPage'))
const ChatsPage = lazy(() => import('../../features/chat/ui/pages/ChatsPage'))
const ChatPage = lazy(() => import('../../features/chat/ui/pages/ChatPage'))
const ProfilePage = lazy(() => import('../../shared/ui/pages/ProfilePage'))
const NotFoundPage = lazy(() => import('../../shared/ui/pages/NotFoundPage'))

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Spinner fullScreen label="Loading..." />}>
      {children}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  // Public Auth Routes (redirects away if already authenticated)
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/register',
        element: (
          <SuspenseWrapper>
            <RegisterPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },

  // Protected Application Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: '/',
            element: <Navigate to="/chats" replace />,
          },
          {
            path: '/chats',
            element: (
              <SuspenseWrapper>
                <ChatsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/chats/:conversationId',
            element: (
              <SuspenseWrapper>
                <ChatPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/profile',
            element: (
              <SuspenseWrapper>
                <ProfilePage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },

  // 404 Catch-All
  {
    path: '*',
    element: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
  },
])
