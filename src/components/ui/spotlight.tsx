import { useRef, useState, useCallback } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'motion/react'
import { cn } from '@/lib/utils'

interface SpotlightProps {
  className?: string
  children: React.ReactNode
}

export function Spotlight({ className, children }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY],
  )

  const spotlightBackground = useMotionTemplate`radial-gradient(650px circle at ${mouseX}px ${mouseY}px, oklch(0.795 0.184 86.047 / 0.08), transparent 80%)`

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn('relative overflow-hidden', className)}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500"
        style={{
          background: spotlightBackground,
          opacity: isHovered ? 1 : 0,
        }}
      />
      {children}
    </div>
  )
}
