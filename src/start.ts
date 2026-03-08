import { createStart } from '@tanstack/react-start'
import { loggingMiddleware } from './middleware/loggingMiddleware'
import { authMiddleware } from './middleware/authMiddleware'

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [loggingMiddleware, authMiddleware],
  }
})
