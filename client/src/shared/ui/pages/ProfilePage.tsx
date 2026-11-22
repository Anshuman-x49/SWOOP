import { useAuth } from '../../../features/auth/hooks/useAuth'
import { Avatar, Button } from '../components'
import { LogOut, Mail, User as UserIcon } from 'lucide-react'

export function ProfilePage() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  if (!user) return null

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <Avatar name={user.name} id={user.id} size="xl" isOnline className="mb-4" />
          <h2 className="text-xl font-bold text-text">{user.name}</h2>
          <p className="text-sm text-muted">{user.email}</p>
        </div>

        <div className="mt-8 space-y-3 border-t border-border/80 pt-6">
          <div className="flex items-center gap-3 rounded-xl bg-bg/60 p-3.5 text-sm">
            <UserIcon className="h-5 w-5 text-muted" />
            <div>
              <p className="text-xs font-semibold text-muted uppercase">Display Name</p>
              <p className="font-medium text-text">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-bg/60 p-3.5 text-sm">
            <Mail className="h-5 w-5 text-muted" />
            <div>
              <p className="text-xs font-semibold text-muted uppercase">Email Address</p>
              <p className="font-medium text-text">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button
            variant="danger"
            onClick={handleLogout}
            leftIcon={<LogOut className="h-4 w-4" />}
            className="w-full"
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
