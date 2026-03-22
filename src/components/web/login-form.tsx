import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { authClient } from '@/lib/auth-client'
import { loginSchema } from '@/schemas/authSchema'
import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from '@tanstack/react-router'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { motion } from 'motion/react'
import { LogIn, Mail, Lock } from 'lucide-react'

export function LoginForm() {
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()

  const form = useForm({
    defaultValues: {
      email: 'leerob@acme.com',
      password: '12345678',
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        await authClient.signIn.email({
          email: value.email,
          password: value.password,
          fetchOptions: {
            onSuccess: () => {
              toast.success('Logged in successfully')
              navigate({ to: '/dashboard' })
            },
            onError: ({ error }) => {
              toast.error(error.message)
            },
          },
        })
      })
    },
  })

  return (
    <div>
      {/* Header with icon */}
      <div className="mb-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="mb-4 inline-flex items-center justify-center rounded-xl bg-primary/10 p-3"
        >
          <LogIn className="size-6 text-primary" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-2xl font-bold tracking-tight"
        >
          Welcome Back
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-1 text-sm text-muted-foreground"
        >
          Enter your credentials to access your account
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="rounded-xl border border-primary/50 bg-card/50 p-6 shadow-sm backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid || undefined}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="flex items-center gap-2"
                      >
                        <Mail className="size-3.5 text-muted-foreground" />
                        Email
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid || undefined}
                        placeholder="you@example.com"
                        type="email"
                        autoComplete="email"
                        className="transition-all focus:shadow-sm focus:shadow-primary/10"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              <form.Field
                name="password"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid || undefined}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="flex items-center gap-2"
                      >
                        <Lock className="size-3.5 text-muted-foreground" />
                        Password
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid || undefined}
                        placeholder="Enter your password..."
                        type="password"
                        autoComplete="current-password"
                        className="transition-all focus:shadow-sm focus:shadow-primary/10"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              <Field>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    disabled={isPending}
                    type="submit"
                    className="w-full relative overflow-hidden"
                  >
                    {isPending && <Spinner data-icon="inline-start" />}
                    {isPending ? 'Signing In...' : 'Sign In'}
                    {!isPending && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                      />
                    )}
                  </Button>
                </motion.div>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6"
      >
        <FieldDescription className="mt-6 text-center">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-primary underline-offset-4 hover:underline transition-colors"
          >
            Create one
          </Link>
        </FieldDescription>
      </motion.div>
    </div>
  )
}
