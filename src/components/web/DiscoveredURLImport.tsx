import type { SearchResultWeb } from '@mendable/firecrawl-js'
import { TypographyP } from '../ui/TypographyP'
import { useState, useTransition } from 'react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { ScrollFade } from '../ui/scroll-fade'
import { Checkbox } from '../ui/checkbox'
import { Spinner } from '../ui/spinner'
import { cn } from '@/lib/utils'
import { bulkImportFn } from '@/data/items'
import { toast } from 'sonner'
import type { BulkScrapProgress } from '@/types/types'
import { Progress } from '../ui/progress'

function DiscoveredURLImport({
  discoveredUrls,
}: {
  discoveredUrls: SearchResultWeb[]
}) {
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set())
  const [isBulkPending, startBulkTransition] = useTransition()

  const [progress, setProgress] = useState<BulkScrapProgress>()

  const startBulkImport = () => {
    startBulkTransition(async () => {
      setProgress({
        total: discoveredUrls.length,
        completed: 0,
        url: '',
        status: 'COMPLETED',
      })

      let successful = 0
      let failed = 0

      for await (const update of await bulkImportFn({
        data: { urls: Array.from(selectedUrls) },
      })) {
        setProgress(update)
        update.status === 'COMPLETED' ? successful++ : failed++
      }

      if (failed > 0) {
        toast.info(`Imported ${successful} URL(s), ${failed} failed.`)
      } else {
        toast.success(`Successfully imported ${successful} URL(s)`)
      }
    })
  }

  const toggleSelectAll = () => {
    setSelectedUrls((prev) => {
      if (prev.size === discoveredUrls.length) {
        return new Set()
      } else {
        return new Set(discoveredUrls.map((url) => url.url))
      }
    })
  }

  const toggleUrlSelection = (url: string) => {
    setSelectedUrls((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(url)) {
        newSet.delete(url)
      } else {
        newSet.add(url)
      }
      return newSet
    })
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <TypographyP>
          {selectedUrls.size
            ? `${selectedUrls.size} of ${discoveredUrls.length} selected`
            : `${discoveredUrls.length} URLs discovered!`}
        </TypographyP>
        <Button variant="outline" size="sm" onClick={toggleSelectAll}>
          {selectedUrls.size === discoveredUrls.length
            ? 'Deselect All'
            : 'Select All'}
        </Button>
      </div>
      <Separator />
      <ScrollFade className="h-80">
        {discoveredUrls.map((item) => {
          const id = `url-${item.url}`
          const isChecked = selectedUrls.has(item.url)
          return (
            <label
              key={item.url}
              htmlFor={id}
              className={cn(
                'flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors hover:bg-accent/50',
                isChecked && 'border-primary bg-accent',
              )}
            >
              <Checkbox
                id={id}
                checked={isChecked}
                onCheckedChange={() => toggleUrlSelection(item.url)}
                className="mt-0.5"
                aria-label={item.title || item.url}
              />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-medium leading-tight truncate">
                  {item.title || item.url}
                </span>
                {item.description && (
                  <span className="text-xs text-muted-foreground line-clamp-2">
                    {item.description}
                  </span>
                )}
                <span className="text-xs text-muted-foreground/70 truncate">
                  {item.url}
                </span>
              </div>
            </label>
          )
        })}
      </ScrollFade>
      {progress && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Competed: {progress.completed} / {progress.total}
            </span>
            <span className="font-medium">
              {((progress.completed / progress.total) * 100).toFixed(0)}%
            </span>
          </div>
          <Progress value={(progress.completed / progress.total) * 100} />
        </div>
      )}
      {selectedUrls.size > 0 && (
        <Button
          className="mt-2"
          onClick={startBulkImport}
          disabled={isBulkPending}
        >
          {isBulkPending ? (
            <>
              <Spinner data-icon="inline-start" />
              {progress
                ? `Importing ${progress.completed} of ${progress.total}...`
                : 'Starting Import...'}
            </>
          ) : (
            `Import ${selectedUrls.size} Selected URL(s)`
          )}
        </Button>
      )}
    </div>
  )
}

export default DiscoveredURLImport
