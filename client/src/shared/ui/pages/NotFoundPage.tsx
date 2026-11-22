import { Link } from 'react-router'
import { Button } from '../components'
import { Coffee } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-bg p-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-surface border border-border text-primary shadow-xs">
        <Coffee className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-text">404</h1>
      <h2 className="mt-2 text-xl font-semibold text-text">Page not found</h2>
      <p className="mt-1 max-w-sm text-sm text-muted">
        Looks like you wandered into an empty coffee booth. Let&apos;s get you back to your chats.
      </p>
      <Link to="/chats" className="mt-6">
        <Button variant="primary">Back to Chats</Button>
      </Link>
    </div>
  )
}

export default NotFoundPage
