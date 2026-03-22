import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Kbd } from '@/components/ui/kbd'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ItemList from '@/components/web/ItemList'
import ItemListSkeletons from '@/components/web/ItemListSkeletons'
import { getAllItemsFn } from '@/data/items'
import { ItemStatus } from '@/generated/prisma/enums'
import { searchParamsSchema } from '@/schemas/importSchema'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { BookmarkIcon, SearchIcon } from 'lucide-react'
import { Suspense, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

export const Route = createFileRoute('/dashboard/items/')({
  component: RouteComponent,
  loader: () => ({ itemsPromise: getAllItemsFn() }),
  shouldReload: false,
  validateSearch: zodValidator(searchParamsSchema),
})

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath })
  const inputRef = useRef<HTMLInputElement>(null)

  const { itemsPromise } = Route.useLoaderData()
  const { query: searchQuery, status: searchStatus } = Route.useSearch()

  const [query, setQuery] = useState(searchQuery || '')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (query === searchQuery) return
    const setParamTimeout = setTimeout(() => {
      navigate({
        replace: true,
        search: (prev) => ({ ...prev, query }),
      })
    }, 300)
    return () => clearTimeout(setParamTimeout)
  }, [query, searchQuery, navigate])

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3"
      >
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <BookmarkIcon className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Saved Items</h1>
          <p className="text-xs text-muted-foreground">
            Browse and search your knowledge base
          </p>
        </div>
      </motion.div>

      {/* Search and filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex w-full items-center gap-4"
      >
        <InputGroup className="w-full max-w-xl">
          <InputGroupInput
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="transition-all focus:shadow-sm focus:shadow-primary/10"
          />
          <InputGroupAddon>
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>⌘K</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <Select
          value={searchStatus || 'ALL'}
          onValueChange={(value) =>
            navigate({
              search: (prev) => ({
                ...prev,
                status: value as typeof searchStatus,
              }),
            })
          }
        >
          <SelectTrigger className="w-full max-w-34">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              {Object.values({ all: 'ALL', ...ItemStatus }).map((status) => (
                <SelectItem key={status} value={status}>
                  <span className="capitalize">{status.toLowerCase()}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Items grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Suspense fallback={<ItemListSkeletons />}>
          <ItemList
            itemsPromise={itemsPromise}
            query={query}
            filterStatus={searchStatus}
          />
        </Suspense>
      </motion.div>
    </div>
  )
}
