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
import { TypographyH2 } from '@/components/ui/TypographyH2'
import { TypographyP } from '@/components/ui/TypographyP'
import DiscoveredURLImport from '@/components/web/DiscoveredURLImport'
import { searchOnWebFn } from '@/data/items'
import { discoverSchema } from '@/schemas/importSchema'
import type { SearchResultWeb } from '@mendable/firecrawl-js'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { SearchIcon, Sparkles } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

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
    <div className="flex flex-1 flex-col space-y-4 items-center justify-center">
      <div className="text-center">
        <TypographyH2>Discover</TypographyH2>
        <TypographyP>
          Search on the web for any articles or topic base.
        </TypographyP>
      </div>
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Sparkles data-icon="inline-start" />
            Topic Search
          </CardTitle>
          <CardDescription>
            Search the web for content and import what you find interesting!
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
                      <FieldLabel htmlFor={field.name}>Search Query</FieldLabel>
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
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <SearchIcon data-icon="inline-start" />
                )}
                {isPending ? 'Searching...' : 'Search on Web'}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          {discoveredUrls.length > 0 && (
            <DiscoveredURLImport discoveredUrls={discoveredUrls} />
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
