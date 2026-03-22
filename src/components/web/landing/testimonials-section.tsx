import { Marquee } from '@/components/ui/marquee'
import { Card3D, CardBody } from '@/components/ui/card-3d'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager',
    body: 'ReCoil has completely changed how I do competitive research. The AI summaries save me hours every week.',
    avatar: 'SC',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Software Engineer',
    body: 'I use it to save every technical article I come across. The smart tags make finding things later effortless.',
    avatar: 'MJ',
    rating: 5,
  },
  {
    name: 'Emily Park',
    role: 'Content Strategist',
    body: 'The bulk import feature is a game-changer. I can catalog entire documentation sites in minutes.',
    avatar: 'EP',
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'UX Researcher',
    body: 'Finally, a tool that organizes my research the way my brain works. The AI tagging is surprisingly accurate.',
    avatar: 'DK',
    rating: 5,
  },
  {
    name: 'Laura Martinez',
    role: 'Freelance Writer',
    body: 'I save 10+ articles a day for research. ReCoil keeps everything organized without any effort on my part.',
    avatar: 'LM',
    rating: 5,
  },
  {
    name: 'Alex Rivera',
    role: 'Data Analyst',
    body: 'The search is incredibly fast. I can find any saved page in seconds, even across thousands of entries.',
    avatar: 'AR',
    rating: 5,
  },
]

const firstRow = testimonials.slice(0, 3)
const secondRow = testimonials.slice(3)

function TestimonialCard({
  name,
  role,
  body,
  avatar,
  rating,
}: (typeof testimonials)[number]) {
  return (
    <Card3D containerClassName="w-80 shrink-0">
      <CardBody
        className={cn(
          'w-full cursor-default rounded-xl border bg-card/80 p-6 backdrop-blur-sm',
          'transition-shadow hover:shadow-lg hover:shadow-primary/5',
        )}
      >
        {/* Stars */}
        <div className="flex gap-0.5 mb-3">
          {Array.from({ length: rating }).map((_, i) => (
            <Star
              key={i}
              className="size-3.5 fill-primary text-primary"
              aria-hidden="true"
            />
          ))}
        </div>

        <blockquote>
          <p className="text-sm leading-relaxed text-muted-foreground">
            &ldquo;{body}&rdquo;
          </p>
        </blockquote>
        <figcaption className="mt-4 flex items-center gap-3 border-t pt-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-xs font-semibold text-primary ring-1 ring-primary/10">
            {avatar}
          </div>
          <div>
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </figcaption>
      </CardBody>
    </Card3D>
  )
}

export function TestimonialsSection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealOnScroll>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium tracking-wide text-primary uppercase">
              Testimonials
            </p>
            <h2
              className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Loved by{' '}
              <AnimatedGradientText
                className="text-3xl font-bold sm:text-4xl"
                colorFrom="oklch(0.795 0.184 86.047)"
                colorTo="oklch(0.681 0.162 75.834)"
              >
                Researchers & Creators
              </AnimatedGradientText>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See what our users have to say about their experience.
            </p>
          </div>
        </RevealOnScroll>
      </div>

      {/* Double marquee - opposite directions */}
      <div className="relative mt-16 space-y-4">
        <Marquee pauseOnHover className="[--duration:40s]">
          {firstRow.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </Marquee>
        <Marquee pauseOnHover reverse className="[--duration:40s]">
          {secondRow.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </Marquee>

        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  )
}
