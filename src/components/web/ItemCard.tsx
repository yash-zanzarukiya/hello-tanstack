import { copyToClipboard } from '@/lib/utils'
import { CopyIcon } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import type { SavedItemModel } from '@/generated/prisma/models'
import { Link } from '@tanstack/react-router'

interface ItemCardProps {
  item: SavedItemModel
}

function ItemCard({ item }: ItemCardProps) {
  return (
    <Card className="relative w-full max-w-sm overflow-hidden pt-0 pb-4">
      <Link to={`/dashboard/items/$itemId`} params={{ itemId: item.id }}>
        <img
          src={item.ogImage || 'https://ui.shadcn.com/placeholder.svg'}
          alt={item.title || 'Item Image'}
          title={item.title || 'Item Image'}
          className="relative z-20 aspect-video w-full object-cover transition-transform duration-300 hover:scale-105 grayscale"
        />
      </Link>
      <CardHeader>
        <Link to={`/dashboard/items/$itemId`} params={{ itemId: item.id }}>
          <CardTitle className="line-clamp-1">
            {item.title || 'Item Title'}
          </CardTitle>
        </Link>
        {(item.summary || item.content) && (
          <CardDescription className="line-clamp-2">
            {item.summary || item.content}
          </CardDescription>
        )}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardFooter>
        <Badge variant={'secondary'} className="mr-auto">
          {item.status}
        </Badge>
        <Button
          variant={'outline'}
          size={'icon-sm'}
          onClick={() => copyToClipboard(item.url.toString())}
        >
          <CopyIcon />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ItemCard
