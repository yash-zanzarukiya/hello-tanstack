import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { BookmarkPlus, Brain, Tags, ArrowDown } from 'lucide-react'

function MockBrowserCard() {
  return (
    <div className="rounded-xl border bg-card/80 shadow-2xl shadow-primary/5 backdrop-blur-sm overflow-hidden max-w-2xl mx-auto">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-destructive/50" />
          <div className="size-3 rounded-full bg-chart-2/50" />
          <div className="size-3 rounded-full bg-green-500/50" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 rounded-md bg-background px-4 py-1 text-xs text-muted-foreground">
            <span>recoil.yashpz.in/dashboard</span>
          </div>
        </div>
      </div>

      {/* Dashboard mock content */}
      <div className="p-6 space-y-4">
        {/* Search bar */}
        <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-4 py-2.5 text-sm text-muted-foreground">
          <span className="opacity-50">Search your knowledge base...</span>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              title: 'Introduction to LLMs',
              tags: ['AI', 'Machine Learning'],
              summary: 'A comprehensive overview of large language models...',
            },
            {
              title: 'React Server Components',
              tags: ['React', 'Web Dev'],
              summary: 'Understanding the new paradigm in React...',
            },
            {
              title: 'System Design Patterns',
              tags: ['Architecture', 'Engineering'],
              summary: 'Essential patterns for scalable systems...',
            },
            {
              title: 'TypeScript Advanced Types',
              tags: ['TypeScript', 'Programming'],
              summary: 'Deep dive into conditional and mapped types...',
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              className="rounded-lg border bg-background p-4 transition-all hover:border-primary/20 hover:shadow-sm"
              whileHover={{ y: -2 }}
            >
              <h4 className="text-sm font-medium truncate">{card.title}</h4>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {card.summary}
              </p>
              <div className="mt-2 flex gap-1">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ShowcaseSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section ref={containerRef} className="relative border-t bg-muted/10 py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealOnScroll>
          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="text-sm font-medium tracking-wide text-primary uppercase">
              See It in Action
            </p>
            <h2
              className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Your Knowledge, Beautifully Organized
            </h2>
          </div>
        </RevealOnScroll>

        {/* Process flow */}
        <div className="mb-12 flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <RevealOnScroll delay={0.1} direction="left">
            <div className="flex items-center gap-2 rounded-full border bg-card px-4 py-2">
              <BookmarkPlus className="size-4 text-primary" />
              <span>Save</span>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <ArrowDown className="size-4 text-primary rotate-[-90deg]" />
          </RevealOnScroll>
          <RevealOnScroll delay={0.3}>
            <div className="flex items-center gap-2 rounded-full border bg-card px-4 py-2">
              <Brain className="size-4 text-primary" />
              <span>Process</span>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.4}>
            <ArrowDown className="size-4 text-primary rotate-[-90deg]" />
          </RevealOnScroll>
          <RevealOnScroll delay={0.5} direction="right">
            <div className="flex items-center gap-2 rounded-full border bg-card px-4 py-2">
              <Tags className="size-4 text-primary" />
              <span>Organize</span>
            </div>
          </RevealOnScroll>
        </div>

        {/* Parallax dashboard mockup */}
        <motion.div style={{ y, opacity }}>
          <MockBrowserCard />
        </motion.div>
      </div>
    </section>
  )
}
