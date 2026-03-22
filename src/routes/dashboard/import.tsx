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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DiscoveredURLImport from '@/components/web/DiscoveredURLImport'
import { mapUrlFn, scrapUrlFn } from '@/data/items'
import { bulkImportSchema, importSchema } from '@/schemas/importSchema'
import type { SearchResultWeb } from '@mendable/firecrawl-js'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { Globe, ImportIcon, Link2Icon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { motion } from 'motion/react'

export const Route = createFileRoute('/dashboard/import')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isPending, startTransition] = useTransition()

  const [discoveredUrls, setDiscoveredUrls] = useState<SearchResultWeb[]>([])

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
          <ImportIcon className="size-6 text-primary" />
        </motion.div>
        <h1 className="text-2xl font-bold tracking-tight">Import Content</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Save web pages to your library for later reading
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full max-w-xl"
      >
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
            <Card className="w-full max-w-xl border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Import Single URL</CardTitle>
                <CardDescription>
                  Scrape and save content from any web page
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
                            <FieldLabel htmlFor={field.name} className="flex items-center gap-2">
                              <Link2Icon className="size-3.5 text-muted-foreground" />
                              URL
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
                              placeholder="https://ui.shadcn.com/create"
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
                          <>
                            <Spinner data-icon="inline-start" />
                            Processing
                          </>
                        ) : (
                          'Import URL'
                        )}
                      </Button>
                    </motion.div>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bulk">
            <Card className="w-full max-w-xl border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Bulk Import</CardTitle>
                <CardDescription>
                  Discover and import multiple URLs from a website at once
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
                            <FieldLabel htmlFor={field.name} className="flex items-center gap-2">
                              <Link2Icon className="size-3.5 text-muted-foreground" />
                              URL
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
                              placeholder="https://ui.shadcn.com/create"
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
                          <>
                            <Spinner data-icon="inline-start" />
                            Processing
                          </>
                        ) : (
                          'Import URLs'
                        )}
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
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
