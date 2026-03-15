import { use, useMemo } from 'react'
import ItemCard from './ItemCard'
import type { SavedItemModel } from '@/generated/prisma/models'
import type { ItemStatus } from '@/generated/prisma/enums'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { AlbumIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { getAllItemsFn } from '@/data/items'

interface ItemListProps {
  itemsPromise: ReturnType<typeof getAllItemsFn>
  query: string
  filterStatus: ItemStatus | 'ALL'
}

function ItemList({ itemsPromise, query, filterStatus }: ItemListProps) {
  const items = use(itemsPromise)

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesQuery =
          item.title?.toLowerCase().includes(query.toLowerCase()) ||
          item.tags?.includes(query.toLowerCase())
        const matchesStatus =
          filterStatus === 'ALL' || item.status === filterStatus
        return matchesQuery && matchesStatus
      }),
    [items, query, filterStatus],
  )

  if (filteredItems.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlbumIcon />
          </EmptyMedia>
          <EmptyTitle>
            {items.length === 0
              ? 'No items found'
              : 'No items match your search criteria'}
          </EmptyTitle>
          <EmptyDescription>
            {items.length === 0
              ? 'Start by importing some items.'
              : 'Try adjusting your search filter to find what you are looking for.'}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          {items.length === 0 && (
            <Link
              to="/dashboard/import"
              className={buttonVariants({ variant: 'outline' })}
            >
              Import Items
            </Link>
          )}
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredItems.map((item) => (
        <ItemCard key={item.url} item={item} />
      ))}
    </div>
  )
}

export default ItemList
