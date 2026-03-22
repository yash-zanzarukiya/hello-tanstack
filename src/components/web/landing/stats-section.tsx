import { NumberTicker } from '@/components/ui/number-ticker'
import { Card3D, CardBody, CardItem } from '@/components/ui/card-3d'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'

const stats = [
  {
    value: 10000,
    suffix: '+',
    label: 'Pages Saved',
    description: 'Content pieces organized',
  },
  {
    value: 99,
    suffix: '%',
    label: 'Accuracy Rate',
    description: 'AI tagging precision',
  },
  {
    value: 50,
    suffix: 'x',
    label: 'Faster Research',
    description: 'Compared to manual work',
  },
  {
    value: 24,
    suffix: '/7',
    label: 'Always Available',
    description: 'Access from anywhere',
  },
]

export function StatsSection() {
  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-border)_1px,transparent_0)] bg-size-[3rem_3rem] opacity-20" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <RevealOnScroll key={stat.label} delay={index * 0.1}>
              <Card3D containerClassName="w-full h-full">
                <CardBody className="flex flex-col items-center rounded-xl border bg-card/50 p-6 text-center backdrop-blur-sm h-full">
                  <CardItem translateZ={50}>
                    <div className="flex items-baseline gap-0.5">
                      <NumberTicker
                        value={stat.value}
                        className="text-4xl font-bold tracking-tight sm:text-5xl"
                      />
                      <span className="text-2xl font-bold text-primary sm:text-3xl">
                        {stat.suffix}
                      </span>
                    </div>
                  </CardItem>
                  <CardItem translateZ={30} className="mt-2">
                    <p className="text-sm font-semibold">{stat.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardItem>
                </CardBody>
              </Card3D>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
