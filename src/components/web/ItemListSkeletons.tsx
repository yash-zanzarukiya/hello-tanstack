import { Skeleton } from '../ui/skeleton'
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { CopyIcon } from 'lucide-react'

function ItemListSkeletons() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4].map((item) => (
        <Card
          key={item}
          className="relative w-full max-w-sm overflow-hidden pt-0 pb-4"
        >
          <Skeleton className="relative z-20 aspect-video w-full object-cover" />
          <CardHeader>
            <CardTitle className="line-clamp-1">
              <Skeleton className="h-6 w-3/4" />
            </CardTitle>
            <CardDescription className="line-clamp-3">
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-5/6 mt-1" />
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Badge variant="secondary" className="mr-auto">
              <Skeleton className="h-4 w-12" />
            </Badge>
            <Button variant="outline" size="icon-sm" disabled>
              <Skeleton className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default ItemListSkeletons
