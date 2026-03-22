import { LoginForm } from '@/components/web/login-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/login/')({
  head: () => ({
    meta: [
      { title: 'Log In — ReCoil' },
      {
        name: 'description',
        content: 'Sign in to your ReCoil account to access your AI-powered knowledge base.',
      },
      { property: 'og:title', content: 'Log In — ReCoil' },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginForm />
}
