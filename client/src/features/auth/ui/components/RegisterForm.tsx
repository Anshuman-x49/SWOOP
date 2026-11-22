import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button, Input } from '../../../../shared/ui'
import { Mail, Lock, User as UserIcon } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export function RegisterForm() {
  const navigate = useNavigate()
  const { status, error, register } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string
    email?: string
    password?: string
  }>({})

  const validate = () => {
    const errors: { name?: string; email?: string; password?: string } = {}
    if (!name.trim()) {
      errors.name = 'Name is required'
    } else if (name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters'
    }
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

    if (
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      })
    ) {
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
        label="Full Name"
        type="text"
        placeholder="Jane Doe"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={fieldErrors.name}
        leftIcon={<UserIcon className="h-4 w-4" />}
        autoComplete="name"
        required
      />

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
        helperText="Must be at least 6 characters"
        leftIcon={<Lock className="h-4 w-4" />}
        autoComplete="new-password"
        required
      />

      <Button
        type="submit"
        variant="primary"
        isLoading={status === 'loading'}
        className="w-full mt-2"
      >
        Create Account
      </Button>

      <p className="text-center text-sm text-muted mt-2">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-primary hover:text-accent transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
