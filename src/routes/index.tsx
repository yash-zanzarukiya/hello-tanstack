import { createFileRoute } from '@tanstack/react-router'
import { ComponentExample } from '@/components/component-example'
import NavBar from '@/components/web/navbar'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <>
      <NavBar />
      <ComponentExample />
    </>
  )
}
