import { createMiddleware } from '@tanstack/react-start'

export const loggingMiddleware = createMiddleware().server(
  ({ request, next }) => {
    const { method, url } = request
    console.log(`[${method}] - ${url}`)
    return next()
  },
)
