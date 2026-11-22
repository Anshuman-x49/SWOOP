import { Link, useNavigate } from 'react-router'
import { Button, Input } from '../../../../shared/ui'
import { Mail, Lock } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useForm } from 'react-hook-form'
import isEmail from 'validator/lib/isEmail'

interface LoginFormValues {
  email: string
  password: string
}

export function LoginForm() {
  const navigate = useNavigate()
  const { status, error, login } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>()

  const onSubmit = async ({ email, password }: LoginFormValues) => {
    if (await login({ email: email.trim(), password })) {
      navigate('/chats')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 w-full">
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
        {...register('email', {
          required: 'Email is required',
          validate: (value) => isEmail(value.trim()) || 'Email is invalid',
        })}
        error={errors.email?.message}
        leftIcon={<Mail className="h-4 w-4" />}
        autoComplete="email"
        required
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters long',
          },
        })}
        error={errors.password?.message}
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
