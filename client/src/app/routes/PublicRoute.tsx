import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { Spinner } from '../../shared/ui'

/**
 * PublicRoute: prevents authenticated users from accessing login/register
 * Redirects authenticated users to /chats
 */
export function PublicRoute() {
  const { status } = useAuth()

  if (status === 'idle' || status === 'loading') {
    return <Spinner fullScreen label="Checking authentication..." />
  }

  if (status === 'authenticated') {
    return <Navigate to="/chats" replace />
  }

  return <Outlet />
}
