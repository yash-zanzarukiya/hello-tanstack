import { SignupForm } from '@/components/web/signup-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/signup/')({
  head: () => ({
    meta: [
      { title: 'Sign Up — ReCoil' },
      {
        name: 'description',
        content: 'Create your free ReCoil account and start building your AI-powered knowledge base.',
      },
      { property: 'og:title', content: 'Sign Up — ReCoil' },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <SignupForm />
}
