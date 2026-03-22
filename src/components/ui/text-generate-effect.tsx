import { useEffect, useRef } from 'react'
import { motion, stagger, useAnimate, useInView } from 'motion/react'
import { cn } from '@/lib/utils'

interface TextGenerateEffectProps {
  words: string
  className?: string
  filter?: boolean
  duration?: number
}

export function TextGenerateEffect({
  words,
  className,
  filter = true,
  duration = 0.5,
}: TextGenerateEffectProps) {
  const [scope, animate] = useAnimate()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const wordsArray = words.split(' ')

  useEffect(() => {
    if (isInView) {
      animate(
        'span',
        { opacity: 1, filter: filter ? 'blur(0px)' : 'none' },
        { duration, delay: stagger(0.08) },
      )
    }
  }, [isInView, animate, duration, filter])

  return (
    <div ref={ref} className={cn(className)}>
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="inline-block"
            style={{
              opacity: 0,
              filter: filter ? 'blur(10px)' : 'none',
            }}
          >
            {word}
            {idx < wordsArray.length - 1 && '\u00A0'}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}
