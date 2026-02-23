import { Link, useNavigate } from '@tanstack/react-router'
import { Button, buttonVariants } from '../ui/button'
import { ModeSwitcher } from '../ui/mode-switcher'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'

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
    <>
      <nav className="sticky top-0 z-50 flex justify-between p-4 px-6 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="flex items-center gap-3">
          <img
            src="https://tanstack.com/images/logos/logo-color-600.png"
            alt="TanStack Logo"
            className="size-8"
          />
          <h1 className="font-semibold text-xl tracking-tight">
            Hello TanStack Start
          </h1>
        </div>
        <div className="flex gap-4 items-center">
          <ModeSwitcher />
          {isPending ? null : session ? (
            <>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
              <Link to="/dashboard" className={buttonVariants()}>
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={buttonVariants({ variant: 'outline' })}
              >
                Login
              </Link>
              <Link to="/signup" className={buttonVariants()}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  )
}
