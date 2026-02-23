import z from 'zod'

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8, 'Password must be 8 characters long'),
})

export const signUpSchema = z.object({
  fullName: z.string().min(5, 'Password must be 5 characters long'),
  email: z.email(),
  password: z.string().min(8, 'Password must be 8 characters long'),
})
