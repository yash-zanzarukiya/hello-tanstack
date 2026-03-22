import { BookmarkPlus, Brain, Globe, Search, Tags, Zap } from 'lucide-react'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { Marquee } from '@/components/ui/marquee'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'

function SaveAnythingBackground() {
  const urls = [
    'medium.com/ai-breakthrough-2024',
    'nextjs.org/learn/app-router',
    'ui.shadcn.com/docs/cli-4.0',
    'dev.to/react-patterns',
    'stackoverflow.com/q/123456',
    'docs.python.org/3/library',
  ]
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-60">
      <Marquee className="[--duration:25s]" pauseOnHover>
        {urls.map((url) => (
          <div
            key={url}
            className="mx-2 rounded-lg border bg-muted/50 px-4 py-2 text-xs font-mono text-muted-foreground"
          >
            {url}
          </div>
        ))}
      </Marquee>
    </div>
  )
}

function AISummaryBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-6 opacity-50">
      <div className="space-y-2 rounded-lg border bg-card/80 p-4 text-xs text-muted-foreground backdrop-blur-sm max-w-[280px]">
        <div className="flex items-center gap-2 text-primary font-medium">
          <Brain className="size-3" />
          AI Summary
        </div>
        <div className="h-2 w-full rounded bg-muted animate-pulse" />
        <div
          className="h-2 w-4/5 rounded bg-muted animate-pulse"
          style={{ animationDelay: '0.2s' }}
        />
        <div
          className="h-2 w-3/5 rounded bg-muted animate-pulse"
          style={{ animationDelay: '0.4s' }}
        />
        <div className="mt-3 flex gap-1.5">
          {['AI', 'ML', 'Research'].map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function SmartTagsBackground() {
  const tags = [
    'Technology',
    'AI',
    'Design',
    'React',
    'Python',
    'Research',
    'UI/UX',
    'Data',
    'Machine Learning',
    'Startups',
    'Productivity',
  ]
  return (
    <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-2 p-6 opacity-50">
      {tags.map((tag, i) => (
        <span
          key={tag}
          className="rounded-full border bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm transition-all hover:bg-primary/10 hover:text-primary"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          #{tag}
        </span>
      ))}
    </div>
  )
}

function SearchBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-6 opacity-50">
      <div className="w-full max-w-[260px] rounded-lg border bg-card/80 p-3 backdrop-blur-sm">
        <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
          <Search className="size-3" />
          <span>Discover on web...</span>
        </div>
        <div className="mt-2 space-y-1.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-md px-2 py-1"
            >
              <div className="size-1.5 rounded-full bg-primary/50" />
              <div className="h-2 flex-1 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FastBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-40">
      <div className="relative">
        <Zap className="size-16 text-primary/30" />
        <Zap
          className="absolute inset-0 size-16 text-primary/60 animate-ping"
          style={{ animationDuration: '2s' }}
        />
      </div>
    </div>
  )
}

const features = [
  {
    Icon: BookmarkPlus,
    name: 'Save Anything',
    description:
      'Import any URL and ReCoil automatically extracts content, metadata, and images.',
    href: '/signup',
    cta: 'Try it now',
    background: <SaveAnythingBackground />,
    className: 'lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2',
  },
  {
    Icon: Brain,
    name: 'AI Summaries',
    description:
      'Get instant AI-generated summaries to grasp key insights at a glance.',
    href: '/signup',
    cta: 'See it in action',
    background: <AISummaryBackground />,
    className: 'lg:col-start-2 lg:col-end-3',
  },
  {
    Icon: Tags,
    name: 'Smart Tags',
    description:
      'AI automatically categorizes your content with relevant tags.',
    href: '/signup',
    cta: 'Explore tags',
    background: <SmartTagsBackground />,
    className: 'lg:col-start-3 lg:col-end-4',
  },
  {
    Icon: Globe,
    name: 'Discover & Import',
    description: 'Discover pages across websites and bulk import what matters.',
    href: '/signup',
    cta: 'Start discovering',
    background: <SearchBackground />,
    className: 'lg:col-start-2 lg:col-end-3',
  },
  {
    Icon: Zap,
    name: 'Lightning Fast',
    description:
      'Built on modern tech for instant page loads and seamless experience.',
    href: '/signup',
    cta: 'Experience speed',
    background: <FastBackground />,
    className: 'lg:col-start-3 lg:col-end-4',
  },
]

export function FeaturesSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <RevealOnScroll>
          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="text-sm font-medium tracking-wide text-primary uppercase">
              Features
            </p>
            <h2
              className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Everything You Need to{' '}
              <AnimatedGradientText
                className="text-3xl font-bold sm:text-4xl"
                colorFrom="oklch(0.795 0.184 86.047)"
                colorTo="oklch(0.681 0.162 75.834)"
              >
                Curate Knowledge
              </AnimatedGradientText>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From saving a single link to discovering entire sites, ReCoil
              handles it all.
            </p>
          </div>
        </RevealOnScroll>

        {/* Bento grid */}
        <RevealOnScroll delay={0.2}>
          <BentoGrid className="auto-rows-[18rem] grid-cols-1 lg:grid-cols-3">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </RevealOnScroll>
      </div>
    </section>
  )
}
