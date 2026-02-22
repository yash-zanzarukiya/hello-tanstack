import { buttonVariants } from '@/components/ui/button'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="absolute top-5 left-10">
        <Link to="/" className={buttonVariants({ variant: 'outline' })}>
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
      </div>
      <div className="min-h-screen flex items-center justify-center">
        <Outlet />
      </div>
    </>
  )
}
