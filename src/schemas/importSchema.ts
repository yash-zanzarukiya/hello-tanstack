import { ItemStatus } from '@/generated/prisma/enums'
import z from 'zod'

export const importSchema = z.object({
  url: z.string().url(),
})

export const bulkImportSchema = z.object({
  url: z.string().url(),
  search: z.string(),
})

export const extractSchema = z.object({
  author: z.string().nullable(),
  publishedAt: z.string().nullable(),
})

export const searchParamsSchema = z.object({
  query: z.string().default(''),
  status: z.union([z.literal('ALL'), z.nativeEnum(ItemStatus)]).default('ALL'),
})

export type SearchParams = z.infer<typeof searchParamsSchema>

export const discoverSchema = z.object({
  query: z.string().min(3, 'Query must be at least 3 characters long'),
})
