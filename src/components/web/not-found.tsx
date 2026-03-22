import { Link } from '@tanstack/react-router'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useSpring, useMotionTemplate, AnimatePresence } from 'motion/react'
import { ArrowLeft, CircleOff, Ghost, Home, MapPinOff, Orbit, Radar, Route, SearchX, ShieldQuestion, Sparkles, Unplug } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Interactive floating 404 digit that follows mouse with spring physics
function FloatingDigit({
  digit,
  delay,
  mouseX,
  mouseY,
}: {
  digit: string
  delay: number
  mouseX: number
  mouseY: number
}) {
  const x = useSpring(0, { stiffness: 50, damping: 20 })
  const y = useSpring(0, { stiffness: 50, damping: 20 })

  useEffect(() => {
    x.set(mouseX * (0.02 + delay * 0.01))
    y.set(mouseY * (0.02 + delay * 0.01))
  }, [mouseX, mouseY, x, y, delay])

  return (
    <motion.span
      initial={{ opacity: 0, y: 50, scale: 0.5, rotate: -15 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: delay * 0.15,
      }}
      style={{ x, y }}
      className="relative inline-block select-none"
    >
      <span className="text-[10rem] sm:text-[14rem] lg:text-[18rem] font-black leading-none tracking-tighter bg-gradient-to-b from-foreground/15 to-foreground/5 bg-clip-text text-transparent">
        {digit}
      </span>
    </motion.span>
  )
}

// Small "4" "0" "4" digits that emit from cursor and float away into space
interface EmittedDigit {
  id: number
  x: number
  y: number
  digit: string
  angle: number
  size: number
}

function useDigitEmitter() {
  const [digits, setDigits] = useState<EmittedDigit[]>([])
  const idRef = useRef(0)
  const lastEmitRef = useRef(0)
  const digitCycleRef = useRef(0)
  const digitChars = ['4', '0', '4']

  const cleanup = useCallback((ids: number[], delay: number) => {
    setTimeout(() => {
      setDigits((prev) => prev.filter((d) => !ids.includes(d.id)))
    }, delay)
  }, [])

  // Single digit trail on mouse move (throttled)
  const emit = useCallback((x: number, y: number) => {
    const now = Date.now()
    if (now - lastEmitRef.current < 100) return
    lastEmitRef.current = now

    const id = idRef.current++
    const digit = digitChars[digitCycleRef.current % 3]
    digitCycleRef.current++
    const angle = Math.random() * Math.PI * 2
    const size = 20 + Math.random() * 16

    setDigits((prev) => {
      const next = [...prev, { id, x, y, digit, angle, size }]
      return next.length > 20 ? next.slice(-20) : next
    })

    cleanup([id], 2200)
  }, [cleanup])

  // 3-digit burst on click
  const burst = useCallback((x: number, y: number) => {
    const batch: EmittedDigit[] = []
    for (let i = 0; i < 3; i++) {
      const id = idRef.current++
      const digit = digitChars[(digitCycleRef.current + i) % 3]
      const angle = ((Math.PI * 2) / 3) * i + (Math.random() * 0.6 - 0.3)
      const size = 28 + Math.random() * 20
      batch.push({ id, x, y, digit, angle, size })
    }
    digitCycleRef.current += 3

    setDigits((prev) => {
      const next = [...prev, ...batch]
      return next.length > 20 ? next.slice(-20) : next
    })

    cleanup(batch.map((d) => d.id), 2500)
  }, [cleanup])

  return { digits, emit, burst }
}

// Interactive ripple effect on click
function useRipples() {
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([])

  const addRipple = useCallback((x: number, y: number) => {
    const id = Date.now()
    setRipples((prev) => [...prev, { id, x, y }])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 1000)
  }, [])

  return { ripples, addRipple }
}

const floatingTagDefs = [
  { icon: Ghost, label: 'Page ghosted you' },
  { icon: SearchX, label: 'Nothing here' },
  { icon: Unplug, label: 'Disconnected' },
  { icon: MapPinOff, label: 'Off the map' },
  { icon: Orbit, label: 'Lost in orbit' },
  { icon: Route, label: 'Wrong turn' },
  { icon: Radar, label: 'Not on radar' },
  { icon: CircleOff, label: 'Dead end' },
  { icon: ShieldQuestion, label: 'Who knows?' },
  { icon: Ghost, label: 'Boo!' },
]

// Edge zones where tags can appear (avoiding center 25-75% x, 30-70% y)
const edgeZones = [
  { xMin: 3, xMax: 20, yMin: 5, yMax: 25 },   // top-left
  { xMin: 70, xMax: 92, yMin: 5, yMax: 25 },   // top-right
  { xMin: 2, xMax: 18, yMin: 35, yMax: 65 },   // mid-left
  { xMin: 78, xMax: 94, yMin: 35, yMax: 65 },   // mid-right
  { xMin: 5, xMax: 25, yMin: 75, yMax: 93 },   // bottom-left
  { xMin: 65, xMax: 88, yMin: 75, yMax: 93 },   // bottom-right
  { xMin: 30, xMax: 60, yMin: 88, yMax: 96 },   // bottom-center
  { xMin: 30, xMax: 60, yMin: 3, yMax: 12 },    // top-center
]

function FloatingTag({
  icon: Icon,
  label,
  index,
}: {
  icon: React.ElementType
  label: string
  index: number
}) {
  const [pos, setPos] = useState(() => {
    const zone = edgeZones[index % edgeZones.length]
    return {
      x: zone.xMin + Math.random() * (zone.xMax - zone.xMin),
      y: zone.yMin + Math.random() * (zone.yMax - zone.yMin),
    }
  })

  // Stagger delays evenly across cycle so there's always tags visible
  // Total cycle = duration(5s) + repeatDelay(~3s) = ~8s
  // Spread 10 tags across 8s = 0.8s apart
  const delay = index * 0.8

  const handleAnimationComplete = useCallback(() => {
    // Pick a new random zone and position for next cycle
    const zone = edgeZones[Math.floor(Math.random() * edgeZones.length)]
    setPos({
      x: zone.xMin + Math.random() * (zone.xMax - zone.xMin),
      y: zone.yMin + Math.random() * (zone.yMax - zone.yMin),
    })
  }, [])

  return (
    <motion.div
      className="absolute flex items-center gap-2 rounded-full border border-primary/10 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-md shadow-sm pointer-events-none"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: [0, 0.7, 0.7, 0],
        scale: [0.8, 1, 1, 0.8],
        y: [0, -6, -6, 0],
      }}
      transition={{
        duration: 5,
        delay,
        repeat: Infinity,
        repeatDelay: 2.5 + Math.random() * 1.5,
      }}
      onAnimationComplete={handleAnimationComplete}
    >
      <Icon className="size-3 text-primary" />
      {label}
    </motion.div>
  )
}

export function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const { ripples, addRipple } = useRipples()
  const { digits, emit, burst } = useDigitEmitter()

  // Spotlight spring
  const spotX = useSpring(0, { stiffness: 40, damping: 25 })
  const spotY = useSpring(0, { stiffness: 40, damping: 25 })
  const spotBg = useMotionTemplate`radial-gradient(350px circle at ${spotX}px ${spotY}px, oklch(0.795 0.184 86.047 / 0.05), transparent 70%)`

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const localX = e.clientX - rect.left
      const localY = e.clientY - rect.top
      setMouse({
        x: localX - rect.width / 2,
        y: localY - rect.height / 2,
      })
      spotX.set(localX)
      spotY.set(localY)
      emit(localX, localY)
    },
    [spotX, spotY, emit],
  )

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const localX = e.clientX - rect.left
      const localY = e.clientY - rect.top
      addRipple(localX, localY)
      burst(localX, localY)
    },
    [addRipple],
  )

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background cursor-crosshair"
    >
      {/* Spotlight glow + digit emitter layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: spotBg }}
      />

      {/* Emitted 4-0-4 digits burst outward on click */}
      <AnimatePresence>
        {digits.map((d) => {
          const distance = 140 + Math.random() * 60
          const tx = Math.cos(d.angle) * distance
          const ty = Math.sin(d.angle) * distance - 80
          return (
            <motion.span
              key={d.id}
              className="absolute pointer-events-none select-none font-black text-primary/40"
              style={{
                left: d.x,
                top: d.y,
                fontSize: d.size,
              }}
              initial={{ opacity: 0.8, scale: 1.2, x: 0, y: 0, rotate: 0 }}
              animate={{
                opacity: 0,
                scale: 0.4,
                x: tx,
                y: ty,
                rotate: Math.random() * 80 - 40,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: [0.2, 0.8, 0.3, 1] }}
            >
              {d.digit}
            </motion.span>
          )
        })}
      </AnimatePresence>

      {/* Floating fun tags */}
      {floatingTagDefs.map((tag, i) => (
        <FloatingTag key={tag.label} icon={tag.icon} label={tag.label} index={i} />
      ))}

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Click ripples */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full border-2 border-primary/30 pointer-events-none"
          style={{ left: ripple.x, top: ripple.y }}
          initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            width: 200,
            height: 200,
            x: -100,
            y: -100,
            opacity: 0,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Giant 404 */}
        <div className="flex items-center">
          <FloatingDigit digit="4" delay={0} mouseX={mouse.x} mouseY={mouse.y} />
          <FloatingDigit digit="0" delay={1} mouseX={mouse.x} mouseY={mouse.y} />
          <FloatingDigit digit="4" delay={2} mouseX={mouse.x} mouseY={mouse.y} />
        </div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="-mt-8 sm:-mt-12"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary backdrop-blur-sm">
            <Sparkles className="size-4" />
            Page not found
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Oops! You&apos;ve wandered into the{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              void
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-3 max-w-md mx-auto text-muted-foreground"
          >
            The page you&apos;re looking for doesn&apos;t exist, was moved, or
            is playing hide and seek. Click around — it&apos;s fun here!
          </motion.p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3"
        >
          <Link
            to="/"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'gap-2 rounded-full px-6',
            )}
          >
            <Home className="size-4" />
            Go Home
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'gap-2 rounded-full px-6',
            )}
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>
        </motion.div>

        {/* Fun hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-12 text-xs text-muted-foreground/50"
        >
          Tip: Move your mouse around & click for some fun
        </motion.p>
      </div>

      {/* Brand watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 opacity-40"
      >
        <Logo height="h-5" />
      </motion.div>
    </div>
  )
}
