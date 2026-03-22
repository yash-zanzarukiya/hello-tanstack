import { useRef, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface Card3DProps {
  children: ReactNode
  className?: string
  containerClassName?: string
}

export function Card3D({
  children,
  className,
  containerClassName,
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const rY = ((mouseX - width / 2) / width) * 20
    const rX = ((mouseY - height / 2) / height) * -20
    setRotateX(rX)
    setRotateY(rY)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <div
      className={cn('perspective-[1000px]', containerClassName)}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ transformStyle: 'preserve-3d' }}
        className={cn('relative', className)}
      >
        {children}
      </motion.div>
    </div>
  )
}

export function CardBody({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        '[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardItem({
  children,
  className,
  translateZ = 0,
  as: Component = 'div',
  ...rest
}: {
  children: ReactNode
  className?: string
  translateZ?: number
  as?: React.ElementType
  [key: string]: unknown
}) {
  return (
    <Component
      className={cn(className)}
      style={{ transform: `translateZ(${translateZ}px)` }}
      {...rest}
    >
      {children}
    </Component>
  )
}
