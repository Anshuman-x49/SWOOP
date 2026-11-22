import { NavLink, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { Avatar } from '../../shared/ui'
import { MessageSquare, User as UserIcon, Coffee } from 'lucide-react'

export function AppShell() {
  const { user } = useAuth()
  const location = useLocation()

  const isChatOpenOnMobile = /^\/chats\/.+/.test(location.pathname)

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-bg">
      {/* 1. Desktop & Tablet Icon Sidebar (hidden on mobile) */}
      <aside
        className="hidden md:flex w-16 flex-col items-center justify-between py-5 bg-sidebar text-[#FBF6EF] select-none flex-shrink-0 z-20"
        aria-label="App Navigation"
      >
        <div className="flex flex-col items-center gap-6">
          {/* Logo Mark */}
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-[#FBF6EF] shadow-sm"
            title="SWOOP Chat"
          >
            <Coffee className="h-6 w-6" />
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col items-center gap-2">
            <NavLink
              to="/chats"
              className={({ isActive }) =>
                `flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive || location.pathname.startsWith('/chats')
                    ? 'bg-primary text-[#FBF6EF] shadow-xs'
                    : 'text-border hover:bg-border/20 hover:text-white'
                }`
              }
              title="Conversations"
              aria-label="Conversations"
            >
              <MessageSquare className="h-5 w-5" />
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive
                    ? 'bg-primary text-[#FBF6EF] shadow-xs'
                    : 'text-border hover:bg-border/20 hover:text-white'
                }`
              }
              title="My Profile"
              aria-label="My Profile"
            >
              <UserIcon className="h-5 w-5" />
            </NavLink>
          </nav>
        </div>

        {/* Current User Avatar */}
        {user && (
          <NavLink
            to="/profile"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full"
            title={`${user.name} (${user.email})`}
            aria-label="View Profile"
          >
            <Avatar name={user.name} id={user.id} size="sm" isOnline />
          </NavLink>
        )}
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex flex-1 overflow-hidden relative">
        <Outlet />
      </main>

      {/* 3. Mobile Bottom Navigation (visible only on mobile, hidden inside active chat) */}
      {!isChatOpenOnMobile && (
        <nav
          className="md:hidden fixed bottom-0 inset-x-0 h-14 bg-surface border-t border-border flex items-center justify-around z-30 px-4"
          aria-label="Mobile Navigation"
        >
          <NavLink
            to="/chats"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-4 text-xs font-medium transition-colors ${
                isActive || location.pathname.startsWith('/chats')
                  ? 'text-primary'
                  : 'text-muted'
              }`
            }
          >
            <MessageSquare className="h-5 w-5" />
            <span>Chats</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-4 text-xs font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-muted'
              }`
            }
          >
            <UserIcon className="h-5 w-5" />
            <span>Profile</span>
          </NavLink>
        </nav>
      )}
    </div>
  )
}

export default AppShell
