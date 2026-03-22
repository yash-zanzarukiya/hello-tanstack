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
import { motion } from 'motion/react'

interface ItemCardProps {
  item: SavedItemModel
}

function ItemCard({ item }: ItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="group relative w-full max-w-sm overflow-hidden pt-0 pb-4 bg-card/50 backdrop-blur-sm transition-shadow hover:shadow-lg hover:shadow-primary/5">
        {/* Image */}
        <Link to={`/dashboard/items/$itemId`} params={{ itemId: item.id }}>
          <div className="relative overflow-hidden">
            <img
              src={item.ogImage || 'https://ui.shadcn.com/placeholder.svg'}
              alt={item.title || 'Item Image'}
              title={item.title || 'Item Image'}
              className="relative z-20 aspect-video w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 grayscale"
            />
            <div className="absolute inset-0 z-30 bg-gradient-to-t from-card/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </Link>

        <CardHeader>
          <Link to={`/dashboard/items/$itemId`} params={{ itemId: item.id }}>
            <CardTitle className="line-clamp-1 transition-colors group-hover:text-primary">
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
                <Badge
                  key={tag}
                  className="text-xs transition-colors hover:bg-primary/20"
                >
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
            className="transition-colors hover:border-primary/30 hover:text-primary"
          >
            <CopyIcon />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default ItemCard
