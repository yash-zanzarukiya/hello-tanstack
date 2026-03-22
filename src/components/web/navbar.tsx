import { Link, useNavigate } from '@tanstack/react-router'
import { Button, buttonVariants } from '../ui/button'
import { AnimatedThemeToggler } from '../ui/animated-theme-toggler'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Logo } from '../ui/logo'

export default function NavBar() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Logged out successfully')
          navigate({ to: '/' })
        },
        onError: ({ error }) => {
          toast.error(error.message)
        },
      },
    })
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>

        <div className="flex items-center gap-3">
          <AnimatedThemeToggler />
          {isPending ? null : session ? (
            <>
              <Button onClick={handleLogout} variant="ghost" size="sm">
                Log Out
              </Button>
              <Link
                to="/dashboard"
                className={cn(buttonVariants({ size: 'sm' }))}
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
              >
                Log In
              </Link>
              <Link to="/signup" className={cn(buttonVariants({ size: 'sm' }))}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
