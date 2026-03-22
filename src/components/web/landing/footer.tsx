import { Link } from '@tanstack/react-router'
import { Logo } from '@/components/ui/logo'

export function Footer() {
  return (
    <footer className="relative border-t bg-background">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Link to="/" className="transition-opacity hover:opacity-80">
              <Logo />
            </Link>
            <p className="max-w-xs text-center text-sm text-muted-foreground sm:text-left">
              AI-powered knowledge base.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12 text-sm">
            <Link
              to="/dashboard"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              to="/login"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign Up
            </Link>
            {/* Scroll to top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Back to Top
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ReCoil. All rights reserved.</p>
          <p>
            Cooked by{' '}
            <a
              target="_blank"
              href="https://x.com/y_zanzarukiya"
              className="font-medium transition-colors hover:text-primary"
            >
              @y_zanzarukiya
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
