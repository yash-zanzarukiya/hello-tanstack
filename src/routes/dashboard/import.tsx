import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ScrollFade } from '@/components/ui/scroll-fade'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TypographyH2 } from '@/components/ui/TypographyH2'
import { TypographyP } from '@/components/ui/TypographyP'
import { bulkImportFn, mapUrlFn, scrapUrlFn } from '@/data/items'
import { bulkImportSchema, importSchema } from '@/schemas/importSchema'
import type { SearchResultWeb } from '@mendable/firecrawl-js'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { Globe, Link2Icon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/import')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isPending, startTransition] = useTransition()
  const [isBulkPending, startBulkTransition] = useTransition()

  const [discoveredUrls, setDiscoveredUrls] = useState<SearchResultWeb[]>([])
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set())

  const form = useForm({
    defaultValues: {
      url: '',
    },
    validators: {
      onSubmit: importSchema,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        await scrapUrlFn({ data: value })
        toast.success('URL imported successfully!')
      })
    },
  })

  const bulkForm = useForm({
    defaultValues: {
      url: '',
      search: '',
    },
    validators: {
      onSubmit: bulkImportSchema,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        const discoveredUrls = await mapUrlFn({ data: value })
        setDiscoveredUrls(discoveredUrls)
        toast.success(`${discoveredUrls.length} URLs discovered!`)
      })
    },
  })

  const startBulkImport = () => {
    startBulkTransition(async () => {
      const result = await bulkImportFn({
        data: { urls: Array.from(selectedUrls) },
      })
      toast.success(`Successfully imported ${result.length} URL(s)!`)
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
    <div className="flex flex-1 flex-col space-y-4 items-center justify-center">
      <div className="text-center">
        <TypographyH2>Import Content</TypographyH2>
        <TypographyP>
          Save web pages to your library for later reading
        </TypographyP>
      </div>
      <div className="w-full max-w-xl">
        <Tabs defaultValue="single">
          <TabsList className="w-full">
            <TabsTrigger value="single">
              <Link2Icon />
              Single URL
            </TabsTrigger>
            <TabsTrigger value="bulk">
              <Globe />
              Bulk Import
            </TabsTrigger>
          </TabsList>
          <TabsContent value="single">
            <Card className="w-full max-w-xl">
              <CardHeader>
                <CardTitle>Import Single URL</CardTitle>
                <CardDescription>
                  Scrape and save content from any web app! 👀
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
                      name="url"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="https://ui.shadcn.com/create"
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
                        <>
                          <Spinner data-icon="inline-start" />
                          Processing
                        </>
                      ) : (
                        'Import URL'
                      )}
                    </Button>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bulk">
            <Card className="w-full max-w-xl">
              <CardHeader>
                <CardTitle>Bulk Import</CardTitle>
                <CardDescription>
                  Discover and import multiple URLs from a website at once 🚀
                </CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    bulkForm.handleSubmit()
                  }}
                >
                  <FieldGroup>
                    <bulkForm.Field
                      name="url"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="https://ui.shadcn.com/create"
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
                    <bulkForm.Field
                      name="search"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Filter (optional)
                            </FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="eg. blog, docs, tutorial"
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
                        <>
                          <Spinner data-icon="inline-start" />
                          Processing
                        </>
                      ) : (
                        'Import URLs'
                      )}
                    </Button>
                  </FieldGroup>
                </form>
              </CardContent>
              <CardFooter>
                {discoveredUrls.length > 0 && (
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex items-center justify-between">
                      <TypographyP>
                        {selectedUrls.size
                          ? `${selectedUrls.size} of ${discoveredUrls.length} selected`
                          : `${discoveredUrls.length} URLs discovered!`}
                      </TypographyP>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleSelectAll}
                      >
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
                              onCheckedChange={() =>
                                toggleUrlSelection(item.url)
                              }
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
                    {selectedUrls.size > 0 && (
                      <Button className="mt-2" onClick={startBulkImport}>
                        {isBulkPending ? (
                          <>
                            <Spinner data-icon="inline-start" />
                            Importing
                          </>
                        ) : (
                          `Import ${selectedUrls.size} Selected URL(s)`
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
