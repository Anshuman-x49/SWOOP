import { Link, useNavigate } from 'react-router'
import { Button, Input } from '../../../../shared/ui'
import { Mail, Lock, User as UserIcon } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useForm } from 'react-hook-form'
import isEmail from 'validator/lib/isEmail'

interface RegisterFormValues {
  name: string
  email: string
  password: string
}

export function RegisterForm() {
  const navigate = useNavigate()
  const { status, error, register } = useAuth()
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>()

  const onSubmit = async ({ name, email, password }: RegisterFormValues) => {
    if (await register({ name: name.trim(), email: email.trim(), password })) {
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
        label="Full Name"
        type="text"
        placeholder="Jane Doe"
        {...registerField('name', {
          required: 'Name is required',
          validate: (value) =>
            value.trim().length >= 3 || 'Name must be at least 3 characters long',
        })}
        error={errors.name?.message}
        leftIcon={<UserIcon className="h-4 w-4" />}
        autoComplete="name"
        required
      />

      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        {...registerField('email', {
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
        {...registerField('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters long',
          },
        })}
        error={errors.password?.message}
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
