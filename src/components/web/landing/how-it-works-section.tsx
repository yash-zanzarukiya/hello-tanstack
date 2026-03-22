import { useRef } from 'react'
import { Link as LinkIcon, Cpu, LayoutDashboard } from 'lucide-react'
import { motion, useScroll, useTransform } from 'motion/react'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { GlowingBorder } from '@/components/ui/glowing-border'
import { cn } from '@/lib/utils'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

const steps = [
  {
    number: '01',
    icon: LinkIcon,
    title: 'Paste a URL',
    description:
      'Drop in any web page URL or discover pages across an entire website to import in bulk.',
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    number: '02',
    icon: Cpu,
    title: 'AI Processes It',
    description:
      'ReCoil extracts the content, generates a concise summary, and assigns smart tags automatically.',
    gradient: 'from-primary/30 to-primary/10',
  },
  {
    number: '03',
    icon: LayoutDashboard,
    title: 'Access Anytime',
    description:
      'Search, filter, and browse your curated knowledge base from a clean, organized dashboard.',
    gradient: 'from-primary/40 to-primary/15',
  },
]

function StepCard({
  step,
  index,
}: {
  step: (typeof steps)[number]
  index: number
}) {
  return (
    <RevealOnScroll
      delay={index * 0.15}
      direction={index % 2 === 0 ? 'left' : 'right'}
    >
      <HoverBorderGradient
        containerClassName="rounded"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
      >
        <div className="relative flex flex-col items-center p-8 text-center sm:flex-row sm:text-left sm:items-start gap-6">
          {/* Number + Icon */}
          <div className="relative shrink-0">
            <div
              className={cn(
                'flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br',
                step.gradient,
              )}
            >
              <step.icon className="size-8 text-primary" aria-hidden="true" />
            </div>
            <span className="absolute -top-3 -right-3 flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-lg shadow-primary/25">
              {step.number}
            </span>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-md">
              {step.description}
            </p>
          </div>
        </div>
      </HoverBorderGradient>
    </RevealOnScroll>
  )
}

export function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%'])

  return (
    <section
      ref={containerRef}
      className="relative border-t bg-muted/20 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Section header */}
        <RevealOnScroll>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium tracking-wide text-primary uppercase">
              How It Works
            </p>
            <h2
              className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Three Steps to a Smarter Knowledge Base
            </h2>
          </div>
        </RevealOnScroll>

        {/* Steps with animated connecting line */}
        <div className="relative mt-16">
          {/* Animated vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-border sm:block">
            <motion.div
              className="w-full bg-gradient-to-b from-primary to-primary/30 origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="flex flex-col gap-8">
            {steps.map((step, index) => (
              <StepCard key={step.number} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
