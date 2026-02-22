import { Link } from '@tanstack/react-router'
import { Button, buttonVariants } from '../ui/button'
import { ModeSwitcher } from '../ui/mode-switcher'

export default function NavBar() {
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
          <Link to="/login" className={buttonVariants({ variant: 'outline' })}>
            Login
          </Link>
          <Link to="/signup" className={buttonVariants()}>
            Get Started
          </Link>
        </div>
      </nav>
    </>
  )
}
