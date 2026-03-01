import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
  beforeLoad: () => {
    throw redirect({ to: '/dashboard/import' })
  },
})

function RouteComponent() {}
