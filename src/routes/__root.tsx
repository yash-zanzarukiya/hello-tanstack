import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { NotFound } from '@/components/web/not-found'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import { ThemeProvider } from '@/lib/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: 'ReCoil - AI-Powered Knowledge Base' },
      {
        name: 'description',
        content:
          'Save any web page, get AI-generated summaries and smart tags. Build your personal knowledge base with ReCoil.',
      },
      // Open Graph defaults
      { property: 'og:site_name', content: 'ReCoil' },
      { property: 'og:locale', content: 'en_US' },
      // Twitter defaults
      { name: 'twitter:card', content: 'summary_large_image' },
      // Theme color for browser chrome
      {
        name: 'theme-color',
        content: '#1a1a1a',
        media: '(prefers-color-scheme: dark)',
      },
      {
        name: 'theme-color',
        content: '#ffffff',
        media: '(prefers-color-scheme: light)',
      },
      // SEO extras
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'ReCoil' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'canonical', href: 'https://recoil.yashpz.in' },
    ],
    scripts: [
      // Structured data (JSON-LD)
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'ReCoil',
          applicationCategory: 'Productivity',
          description:
            'AI-powered knowledge base. Save any web page, get instant summaries and smart tags.',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        }),
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster position="top-center" closeButton />
        </ThemeProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
