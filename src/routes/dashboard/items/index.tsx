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
import { SearchIcon } from 'lucide-react'
import { Suspense, useEffect, useRef, useState } from 'react'

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
    <div className="flex h-full flex-col gap-4">
      <div className="flex w-full items-center gap-4">
        <InputGroup className="w-full max-w-xl">
          <InputGroupInput
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
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
      </div>
      <Suspense fallback={<ItemListSkeletons />}>
        <ItemList
          itemsPromise={itemsPromise}
          query={query}
          filterStatus={searchStatus}
        />
      </Suspense>
    </div>
  )
}
