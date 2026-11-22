import { LoginForm } from '../components/LoginForm'
import { MessageSquareQuote } from 'lucide-react'

export function LoginPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-bg p-4 sm:p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-[#FBF6EF] shadow-xs">
          <MessageSquareQuote className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Welcome back</h1>
        <p className="mt-1.5 mb-6 text-sm text-muted">
          Brew a coffee and catch up with your conversations.
        </p>

        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
