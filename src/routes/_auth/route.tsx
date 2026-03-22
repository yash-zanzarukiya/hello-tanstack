import { buttonVariants } from '@/components/ui/button'
import { FloatingParticles } from '@/components/ui/floating-particles'
import { Logo } from '@/components/ui/logo'
import { cn } from '@/lib/utils'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import {
  ArrowLeft,
  BookmarkPlus,
  Brain,
  Search,
  Shield,
  Tags,
} from 'lucide-react'
import { motion } from 'motion/react'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

const floatingFeatures = [
  { icon: BookmarkPlus, label: 'Save Anything', x: '12%', y: '20%', delay: 0 },
  { icon: Brain, label: 'AI Summaries', x: '72%', y: '15%', delay: 0.5 },
  { icon: Tags, label: 'Smart Tags', x: '20%', y: '70%', delay: 1 },
  { icon: Search, label: 'Powerful Search', x: '75%', y: '65%', delay: 1.5 },
  { icon: Shield, label: 'Secure', x: '50%', y: '85%', delay: 2 },
]

function RouteComponent() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — immersive branding */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background p-10 lg:flex">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-15" />

        {/* Floating particles */}
        <FloatingParticles quantity={30} size={1.5} />

        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,oklch(0.795_0.184_86.047_/_0.08),transparent_70%)]" />

        {/* Floating feature pills */}
        {floatingFeatures.map((feat) => (
          <motion.div
            key={feat.label}
            className="absolute flex items-center gap-2 rounded-full border border-primary/10 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-md shadow-sm"
            style={{ left: feat.x, top: feat.y }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0, 0.8, 0.8, 0],
              scale: [0.8, 1, 1, 0.8],
              y: [0, -8, -8, 0],
            }}
            transition={{
              duration: 6,
              delay: feat.delay,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <feat.icon className="size-3 text-primary" />
            {feat.label}
          </motion.div>
        ))}

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="transition-opacity hover:opacity-80">
            <Logo />
          </Link>
        </div>

        {/* Center content — Quote */}
        <div className="relative z-10 flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-lg"
          >
            <motion.div
              className="mb-6 h-px w-12 bg-primary/60"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
            <blockquote>
              <p className="text-[2rem] font-light leading-[1.3] tracking-tight text-foreground/90 italic">
                &ldquo;When everyone has access to the same AI tools,{' '}
                <span className="not-italic font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  the taste{' '}
                </span>
                becomes your competitive advantage.&rdquo;
              </p>
              <footer className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 max-w-8 bg-muted-foreground/30" />
                <div>
                  <p className="text-sm font-medium text-foreground/80">
                    Lee Robinson
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Head of AI Education at Cursor
                  </p>
                </div>
              </footer>
            </blockquote>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 text-xs text-muted-foreground"
        >
          &copy; {new Date().getFullYear()} ReCoil. Your knowledge, amplified.
        </motion.p>
      </div>

      {/* Right panel — form */}
      <div className="relative flex w-full flex-col items-center justify-center px-4 lg:w-1/2 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-border)_1px,transparent_0)] bg-size-[3rem_3rem] opacity-20" />

        {/* Spotlight glow behind form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-primary/3 blur-3xl" />

        <div className="absolute top-6 left-6 z-10 lg:top-8 lg:left-8">
          <Link
            to="/"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'gap-1.5 backdrop-blur-sm',
            )}
          >
            <ArrowLeft aria-hidden="true" />
            Back
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative z-10 w-full max-w-sm"
        >
          {/* Mobile logo */}
          <motion.div
            className="mb-8 flex items-center justify-center lg:hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <Logo />
          </motion.div>

          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}
