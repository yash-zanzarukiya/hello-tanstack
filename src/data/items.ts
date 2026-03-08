import { prisma } from '@/db'
import { fireCrawl } from '@/lib/firecrawl'
import { authFnMiddleware } from '@/middleware/authMiddleware'
import {
  bulkImportSchema,
  extractSchema,
  importSchema,
} from '@/schemas/importSchema'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

export const scrapUrlFn = createServerFn()
  .middleware([authFnMiddleware])
  .inputValidator(importSchema)
  .handler(async ({ data, context }) => {
    const session = context.session
    return scrapUrl(data, session.user.id)
  })

export const mapUrlFn = createServerFn()
  .middleware([authFnMiddleware])
  .inputValidator(bulkImportSchema)
  .handler(async ({ data }) => {
    const result = await fireCrawl.map(data.url, {
      limit: 25,
      search: data.search,
      location: { country: 'US', languages: ['en'] },
    })
    return result.links
  })

export const bulkImportFn = createServerFn()
  .middleware([authFnMiddleware])
  .inputValidator(z.object({ urls: z.array(z.string()) }))
  .handler(async ({ data, context }) => {
    const session = context.session
    const results = []
    for (const url of data.urls) {
      const result = await scrapUrl({ url }, session.user.id)
      results.push(result)
    }
    return results
  })

async function scrapUrl(data: z.infer<typeof importSchema>, userId: string) {
  const savedItem = await prisma.savedItem.create({
    data: {
      url: data.url,
      status: 'PROCESSING',
      userId,
    },
  })

  try {
    const res = await fireCrawl.scrape(data.url, {
      formats: [
        'markdown',
        {
          type: 'json',
          schema: extractSchema,
        },
      ],
      location: { country: 'US', languages: ['en'] },
      onlyMainContent: true,
      proxy: 'auto',
    })

    const jsonData = res.json as z.infer<typeof extractSchema>

    const updatedData = await prisma.savedItem.update({
      where: { id: savedItem.id },
      data: {
        title: res.metadata?.title || null,
        content: res.markdown || null,
        ogImage: res.metadata?.ogImage || null,
        author: jsonData?.author || null,
        publishedAt: jsonData?.publishedAt
          ? new Date(jsonData.publishedAt)
          : null,
        status: 'COMPLETED',
      },
    })

    return updatedData
  } catch (error) {
    return await prisma.savedItem.update({
      where: { id: savedItem.id },
      data: {
        status: 'FAILED',
      },
    })
  }
}
