import * as React from 'react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

function ScrollFade({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollArea>) {
  return (
    <div
      className={cn(
        'rounded-xl border mask-[linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)]',
        className,
      )}
    >
      <ScrollArea
        className="h-full rounded-xl [&>[data-slot=scroll-area-viewport]>div]:block!"
        {...props}
      >
        <div className="space-y-1 p-3">{children}</div>
      </ScrollArea>
    </div>
  )
}

export { ScrollFade }
