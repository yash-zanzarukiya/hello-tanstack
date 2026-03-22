import { MessageResponse } from '@/components/ai-elements/message'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { getItemByIdFn, saveSummaryAndGenerateTagsFn } from '@/data/items'
import { cn } from '@/lib/utils'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  ArrowLeft,
  CalendarIcon,
  ChevronDown,
  ClockIcon,
  ExternalLinkIcon,
  Sparkle,
  UserIcon,
} from 'lucide-react'
import { useState } from 'react'
import { useCompletion } from '@ai-sdk/react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { motion } from 'motion/react'

export const Route = createFileRoute('/dashboard/items/$itemId')({
  component: RouteComponent,
  loader: ({ params }) => getItemByIdFn({ data: { id: params.itemId } }),
})

function RouteComponent() {
  const { author, publishedAt, content, id, ogImage } = Route.useLoaderData()
  const { createdAt, summary, tags, title, url } = Route.useLoaderData()
  const router = useRouter()

  const [openContent, setOpenContent] = useState(false)

  const { completion, complete, isLoading } = useCompletion({
    api: '/api/ai/summary',
    initialCompletion: summary || '',
    streamProtocol: 'text',
    body: {
      itemId: id,
    },
    onFinish: async (_prompt, completionText) => {
      await saveSummaryAndGenerateTagsFn({
        data: { id, summary: completionText },
      })
      toast.success('Summary generated and Saved.')
      router.invalidate()
    },
    onError: (err) => {
      toast.error(
        err.message || 'An error occurred while generating the summary.',
      )
    },
  })

  const handleGenerateSummary = () => {
    if (!content) {
      toast.error('No content available to summarize.')
      return
    }
    complete(content)
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link to=".." className={cn(buttonVariants({ variant: 'outline' }), 'gap-1.5')}>
          <ArrowLeft className="size-4" />
          Go back
        </Link>
      </motion.div>

      {/* Main content card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden"
      >
        {/* Hero image */}
        {ogImage && (
          <div className="relative overflow-hidden bg-muted">
            <img
              src={ogImage}
              alt={title || 'Item image'}
              className="h-80 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          </div>
        )}

        <div className="p-6 space-y-5">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-3xl font-bold tracking-tight lg:text-4xl"
          >
            {title}
          </motion.h1>

          {/* Metadata pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground"
          >
            {author && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                <UserIcon className="size-3.5" /> {author}
              </span>
            )}
            {publishedAt && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                <CalendarIcon className="size-3.5" />
                {new Date(publishedAt).toLocaleDateString('en-US')}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
              <ClockIcon className="size-3.5" />
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </motion.div>

          {/* Original link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.35 }}
          >
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary transition-colors hover:text-primary/80"
            >
              View Original
              <ExternalLinkIcon className="size-3.5" />
            </a>
          </motion.div>

          {/* Tags */}
          {tags?.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="flex flex-wrap gap-2"
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Summary card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
          >
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
              <CardContent>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkle className="size-4 text-primary" />
                      <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
                        Summary
                      </h2>
                    </div>
                    {completion || summary ? (
                      <MessageResponse>{completion}</MessageResponse>
                    ) : (
                      <p className="italic text-muted-foreground">
                        {content
                          ? 'No summary yet! Click the button to generate with AI.'
                          : 'No content available to summarize.'}
                      </p>
                    )}
                  </div>
                  {content && !summary && (
                    <Button
                      size="sm"
                      disabled={isLoading}
                      onClick={handleGenerateSummary}
                      className="shrink-0"
                    >
                      {isLoading ? (
                        <Spinner className="size-4 mr-1" />
                      ) : (
                        <Sparkle className="size-4 mr-1" />
                      )}
                      {isLoading ? 'Cooking Magic...' : 'Generate Summary'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Collapsible content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Collapsible open={openContent} onOpenChange={setOpenContent}>
              <CollapsibleTrigger className="inline-flex items-center gap-1 text-sm">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(openContent && 'rounded-b-none border-b-0')}
                >
                  {openContent ? 'Hide Content' : 'Show Content'}
                  <ChevronDown
                    className={`size-4 ml-1 transition-transform ${openContent ? 'rotate-180' : ''}`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-6 border rounded-b-xl">
                <MessageResponse>
                  {content || 'No content available for this item.'}
                </MessageResponse>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
