import { type ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface GlowingBorderProps {
  children: ReactNode
  className?: string
  containerClassName?: string
  borderColor?: string
  duration?: number
}

export function GlowingBorder({
  children,
  className,
  containerClassName,
  duration = 4,
}: GlowingBorderProps) {
  return (
    <div className={cn('relative rounded-xl p-px overflow-hidden', containerClassName)}>
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'conic-gradient(from 0deg, transparent, oklch(0.795 0.184 86.047), transparent, oklch(0.795 0.184 86.047), transparent)',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <div
        className={cn(
          'relative rounded-xl bg-background',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
