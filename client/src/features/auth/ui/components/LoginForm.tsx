import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button, Input } from '../../../../shared/ui'
import { Mail, Lock } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export function LoginForm() {
  const navigate = useNavigate()
  const { status, error, login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  const validate = () => {
    const errors: { email?: string; password?: string } = {}
    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address'
    }
    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    if (await login({ email: email.trim(), password })) {
      navigate('/chats')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {error}
        </div>
      )}

      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErrors.email}
        leftIcon={<Mail className="h-4 w-4" />}
        autoComplete="email"
        required
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fieldErrors.password}
        leftIcon={<Lock className="h-4 w-4" />}
        autoComplete="current-password"
        required
      />

      <Button
        type="submit"
        variant="primary"
        isLoading={status === 'loading'}
        className="w-full mt-2"
      >
        Sign in
      </Button>

      <p className="text-center text-sm text-muted mt-2">
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-primary hover:text-accent transition-colors"
        >
          Sign up
        </Link>
      </p>
    </form>
  )
}
