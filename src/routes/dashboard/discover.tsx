import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import DiscoveredURLImport from '@/components/web/DiscoveredURLImport'
import { searchOnWebFn } from '@/data/items'
import { discoverSchema } from '@/schemas/importSchema'
import type { SearchResultWeb } from '@mendable/firecrawl-js'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { CompassIcon, SearchIcon, Sparkles } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { motion } from 'motion/react'

export const Route = createFileRoute('/dashboard/discover')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isPending, startTransition] = useTransition()

  const [discoveredUrls, setDiscoveredUrls] = useState<SearchResultWeb[]>([])

  const form = useForm({
    defaultValues: {
      query: '',
    },
    validators: {
      onSubmit: discoverSchema,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        const discoveredUrls = await searchOnWebFn({ data: value })
        setDiscoveredUrls(discoveredUrls)
        toast.success(`${discoveredUrls.length} URLs discovered!`)
      })
    },
  })

  return (
    <div className="flex flex-1 flex-col space-y-6 items-center justify-center">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="mx-auto mb-4 inline-flex items-center justify-center rounded-xl bg-primary/10 p-3"
        >
          <CompassIcon className="size-6 text-primary" />
        </motion.div>
        <h1 className="text-2xl font-bold tracking-tight">Discover</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search the web for articles and topics to save
        </p>
      </motion.div>

      {/* Search card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full max-w-xl"
      >
        <Card className="border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Sparkles className="size-5" />
              Topic Search
            </CardTitle>
            <CardDescription>
              Search the web for content and import what you find interesting
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
            >
              <FieldGroup>
                <form.Field
                  name="query"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name} className="flex items-center gap-2">
                          <SearchIcon className="size-3.5 text-muted-foreground" />
                          Search Query
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Anthropic vs OpenAI, Next.js Server Actions, etc."
                          type="text"
                          autoComplete="off"
                          className="transition-all focus:shadow-sm focus:shadow-primary/10"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Button disabled={isPending} type="submit" className="w-full">
                    {isPending ? (
                      <Spinner data-icon="inline-start" />
                    ) : (
                      <SearchIcon data-icon="inline-start" />
                    )}
                    {isPending ? 'Searching...' : 'Search on Web'}
                  </Button>
                </motion.div>
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            {discoveredUrls.length > 0 && (
              <DiscoveredURLImport discoveredUrls={discoveredUrls} />
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
