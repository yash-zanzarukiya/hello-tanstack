import { createFileRoute } from '@tanstack/react-router'
import NavBar from '@/components/web/navbar'
import { HeroSection } from '@/components/web/landing/hero-section'
import { FeaturesSection } from '@/components/web/landing/features-section'
import { ShowcaseSection } from '@/components/web/landing/showcase-section'
import { HowItWorksSection } from '@/components/web/landing/how-it-works-section'
import { StatsSection } from '@/components/web/landing/stats-section'
import { TestimonialsSection } from '@/components/web/landing/testimonials-section'
import { CtaSection } from '@/components/web/landing/cta-section'
import { Footer } from '@/components/web/landing/footer'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'ReCoil — AI-Powered Knowledge Base' },
      {
        name: 'description',
        content:
          'Save any web page, get AI-generated summaries and smart tags. Your personal knowledge base, powered by intelligence.',
      },
      // Open Graph
      { property: 'og:title', content: 'ReCoil — AI-Powered Knowledge Base' },
      {
        property: 'og:description',
        content:
          'Save any web page, get AI-generated summaries and smart tags. Your personal knowledge base, powered by intelligence.',
      },
      { property: 'og:type', content: 'website' },
      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'ReCoil — AI-Powered Knowledge Base',
      },
      {
        name: 'twitter:description',
        content:
          'Save any web page, get AI-generated summaries and smart tags. Your personal knowledge base, powered by intelligence.',
      },
    ],
  }),
  component: App,
})

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <ShowcaseSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
