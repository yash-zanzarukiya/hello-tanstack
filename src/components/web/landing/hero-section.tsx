import { Link } from '@tanstack/react-router'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { buttonVariants } from '@/components/ui/button'
import { Spotlight } from '@/components/ui/spotlight'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import { FloatingParticles } from '@/components/ui/floating-particles'
import { AnimatedTooltip } from '@/components/ui/animated-tooltip'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
import { cn } from '@/lib/utils'

const vercelPeople = [
  {
    id: 1,
    name: 'Aurora Scharff',
    designation: 'DX Engineer @Vercel',
    image:
      'https://res.cloudinary.com/df6ztmktu/image/upload/v1774183628/qLRPB4Ci_400x400_arbsyb.jpg',
  },
  {
    id: 2,
    name: 'ShadCN',
    designation: 'The GOAT',
    image: 'https://github.com/shadcn.png',
  },
  {
    id: 3,
    name: 'Delba de Oliveira',
    designation: 'Developer Advocate @Vercel',
    image:
      'https://res.cloudinary.com/df6ztmktu/image/upload/v1774183415/3ApJ-y-B_400x400_k0b8mr.jpg',
  },
  {
    id: 4,
    name: 'Lee Robinson',
    designation: 'DevRels @Cursor',
    image:
      'https://res.cloudinary.com/df6ztmktu/image/upload/v1774183473/xfgt1L9l_400x400_gmvf2p.jpg',
  },
  {
    id: 5,
    name: 'Lydia Hallie',
    designation: 'Ex-Staff Engineer @Vercel',
    image:
      'https://res.cloudinary.com/df6ztmktu/image/upload/v1774183360/OTQxNjMyMTEyLTYyODUwNzQzOA_xpjwis.jpg',
  },
]

export function HeroSection() {
  return (
    <Spotlight className="relative min-h-[90vh] flex items-center">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20" />

      {/* Floating particles */}
      <FloatingParticles quantity={40} />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />

      <div className="relative z-20 mx-auto flex max-w-6xl flex-col items-center px-4 pt-24 pb-20 text-center sm:px-6 sm:pt-32 sm:pb-28">
        {/* Animated badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="text-primary size-4" aria-hidden="true" />
          </motion.div>
          <span>AI-Powered Knowledge Base</span>
          <ArrowRight className="size-3 text-primary" />
        </motion.div>

        {/* Heading with text generate effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1
            className="max-w-5xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ textWrap: 'balance' }}
          >
            Save, Organize &{' '}
            <span className="relative">
              <AnimatedGradientText
                className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl"
                colorFrom="oklch(0.795 0.184 86.047)"
                colorTo="oklch(0.681 0.162 75.834)"
              >
                Understand
              </AnimatedGradientText>
              <motion.span
                className="absolute -bottom-2 left-0 h-1 rounded-full bg-gradient-to-r from-primary/80 to-primary/0"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 1 }}
              />
            </span>{' '}
            the Web with AI
          </h1>
        </motion.div>

        {/* Subtitle with text generate */}
        <div className="mt-6 max-w-2xl">
          <TextGenerateEffect
            words="ReCoil saves any web page, extracts the content, and uses AI to generate summaries and smart tags. Your personal knowledge base, powered by the AI Intelligence."
            className="text-lg text-muted-foreground sm:text-xl leading-relaxed"
            duration={0.4}
          />
        </div>

        {/* CTAs with staggered animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link to="/signup">
            <HoverBorderGradient
              containerClassName="rounded-full"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
            >
              <span>Start for Free</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </HoverBorderGradient>
          </Link>
          <Link
            to="/login"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'rounded-full px-8 backdrop-blur-sm',
            )}
          >
            Log In
          </Link>
        </motion.div>

        {/* Social proof with animated tooltips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <div className="flex flex-row items-center justify-center">
            <AnimatedTooltip items={vercelPeople} />
          </div>
          <p className="text-sm text-muted-foreground">
            Trusted by researchers & creators
          </p>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </Spotlight>
  )
}
