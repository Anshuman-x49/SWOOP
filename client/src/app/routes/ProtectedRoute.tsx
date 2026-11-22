import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { Spinner } from '../../shared/ui'

/**
 * ProtectedRoute: prevents unauthorized access to protected screens
 * Shows a cozy spinner during initial auth bootstrap to prevent login flash on reload
 */
export function ProtectedRoute() {
  const { status } = useAuth()

  if (status === 'idle' || status === 'loading') {
    return <Spinner fullScreen label="Checking authentication..." />
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
