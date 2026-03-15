import { prisma } from '@/db'
import { openrouter } from '@/lib/ai-gateway-provider'
import { fireCrawl } from '@/lib/firecrawl'
import { authFnMiddleware } from '@/middleware/authMiddleware'
import {
  bulkImportSchema,
  extractSchema,
  importSchema,
} from '@/schemas/importSchema'
import type { BulkScrapProgress } from '@/types/types'
import type { SearchResultWeb } from '@mendable/firecrawl-js'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { generateText } from 'ai'
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
  .handler(async function* ({ data, context }) {
    const session = context.session
    const results = []
    const total = data.urls.length
    let completed = 0
    for (const url of data.urls) {
      const result = await scrapUrl({ url }, session.user.id)

      results.push(result)

      const status: BulkScrapProgress['status'] =
        result.status === 'COMPLETED' ? 'COMPLETED' : 'FAILED'

      completed++

      yield { completed, total, url, status }
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
          prompt: 'please extract the author and also publishedAt timestamp',
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
        ogImage:
          res.metadata?.ogImage || 'https://ui.shadcn.com/placeholder.svg',
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

export const getAllItemsFn = createServerFn()
  .middleware([authFnMiddleware])
  .handler(async ({ context }) => {
    const session = context.session
    const items = await prisma.savedItem.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })
    return items
  })

export const getItemByIdFn = createServerFn()
  .middleware([authFnMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data, context }) => {
    const session = context.session
    const item = await prisma.savedItem.findFirst({
      where: { id: data.id, userId: session.user.id },
    })
    if (!item) throw notFound()
    return item
  })

export const saveSummaryAndGenerateTagsFn = createServerFn()
  .middleware([authFnMiddleware])
  .inputValidator(z.object({ id: z.string(), summary: z.string() }))
  .handler(async ({ data, context }) => {
    const session = context.session

    const item = await prisma.savedItem.findFirst({
      where: { id: data.id, userId: session.user.id },
    })

    if (!item) throw notFound()

    const { text } = await generateText({
      model: openrouter.chat('arcee-ai/trinity-large-preview:free'),
      system: `You are a helpful assistant that extracts relevant tags from content summaries.
                - Extract 3-5 short, relevant tags that categorize the content.
                - Return ONLY a comma-separated list of tags, nothing else.
                - Example: technology, programming, web development, javascript`,
      prompt: `Extract tags from this summary: \n\n${data.summary}'`,
    })

    const tags = text
      .split(',')
      .map((tag) => tag.trim())
      .slice(0, 5)

    const updatedItem = await prisma.savedItem.update({
      where: { id: data.id },
      data: {
        summary: data.summary,
        tags,
      },
    })

    return updatedItem
  })

export const searchOnWebFn = createServerFn()
  .middleware([authFnMiddleware])
  .inputValidator(z.object({ query: z.string() }))
  .handler(async ({ data }) => {
    const result = await fireCrawl.search(data.query, {
      limit: 15,
      location: 'US',
      tbs: 'qdr:y',
    })

    return result.web?.map((item) => ({
      title: (item as SearchResultWeb).title,
      description: (item as SearchResultWeb).description,
      url: (item as SearchResultWeb).url,
    })) as SearchResultWeb[]
  })
