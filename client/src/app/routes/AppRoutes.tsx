import { createBrowserRouter, Navigate } from 'react-router'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { AppShell } from '../layout/AppShell'
import {
  CallsPage,
  ChatLayout,
  ChatPage,
  ChatsPage,
  LoginPage,
  NotFoundPage,
  ProfilePage,
  RegisterPage,
  StoriesPage,
  SuspenseWrapper,
} from './RouteComponents'

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
                <ChatLayout />
              </SuspenseWrapper>
            ),
            children: [
              {
                index: true,
                element: (
                  <SuspenseWrapper>
                    <ChatsPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: ':conversationId',
                element: (
                  <SuspenseWrapper>
                    <ChatPage />
                  </SuspenseWrapper>
                ),
              },
            ],
          },
          {
            path: '/calls',
            element: (
              <SuspenseWrapper>
                <CallsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/stories',
            element: (
              <SuspenseWrapper>
                <StoriesPage />
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
