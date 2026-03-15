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
    <div className="space-y-4">
      <div>
        <Link to=".." className={buttonVariants({ variant: 'outline' })}>
          <ArrowLeft className="h-4 w-4" />
          Go back
        </Link>
      </div>
      <div className="flex flex-col rounded-md border p-6 space-y-4">
        {ogImage && (
          <img
            src={ogImage}
            alt={title || 'Item image'}
            className="mb-4 h-96 mx-auto rounded-md object-cover border"
          />
        )}

        <h1 className="mb-2 text-4xl font-bold">{title}</h1>

        <div className="mb-4 flex items-center gap-4 text-muted-foreground">
          {author && (
            <span className="flex items-center gap-2">
              <UserIcon className="size-4" /> {author}
            </span>
          )}
          {publishedAt && (
            <span className="flex items-center gap-2">
              <CalendarIcon className="size-4" />
              {new Date(publishedAt).toLocaleDateString('en-US')}
            </span>
          )}
          <span className="flex items-center gap-2">
            <ClockIcon className="size-4" />
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary"
        >
          View Original
          <ExternalLinkIcon className="size-4" />
        </a>

        {tags?.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <Card className="border-primary/20 bg-primary/5">
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                  Summary
                </h2>
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
          <CollapsibleContent className="p-6 border">
            <MessageResponse>
              {content || 'No content available for this item.'}
            </MessageResponse>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
