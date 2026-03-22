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
import { motion } from 'motion/react'
import { CheckCircle2, Globe } from 'lucide-react'

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-3 w-full"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary/10">
            <Globe className="size-3.5 text-primary" />
          </div>
          <TypographyP>
            {selectedUrls.size
              ? `${selectedUrls.size} of ${discoveredUrls.length} selected`
              : `${discoveredUrls.length} URLs discovered`}
          </TypographyP>
        </div>
        <Button variant="outline" size="sm" onClick={toggleSelectAll}>
          {selectedUrls.size === discoveredUrls.length
            ? 'Deselect All'
            : 'Select All'}
        </Button>
      </div>
      <Separator />
      <ScrollFade className="h-80">
        {discoveredUrls.map((item, index) => {
          const id = `url-${item.url}`
          const isChecked = selectedUrls.has(item.url)
          return (
            <motion.label
              key={item.url}
              htmlFor={id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.5) }}
              className={cn(
                'flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all hover:bg-accent/50',
                isChecked && 'border-primary/30 bg-primary/5',
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
            </motion.label>
          )
        })}
      </ScrollFade>
      {progress && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 rounded-lg border bg-muted/30 p-3"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <CheckCircle2 className="size-3.5 text-primary" />
              Completed: {progress.completed} / {progress.total}
            </span>
            <span className="font-medium text-primary">
              {((progress.completed / progress.total) * 100).toFixed(0)}%
            </span>
          </div>
          <Progress value={(progress.completed / progress.total) * 100} />
        </motion.div>
      )}
      {selectedUrls.size > 0 && (
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
          <Button
            className="mt-2 w-full"
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
        </motion.div>
      )}
    </motion.div>
  )
}

export default DiscoveredURLImport
