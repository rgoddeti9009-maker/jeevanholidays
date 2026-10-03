import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { Chrome } from '@/components/Chrome'
import { AppProvider } from '@/lib/app-context'

import '../styles.css'

const siteName = 'Jeevan Holidays Shirdi — Cabs, Sightseeing & Tours since 1997'
const siteDescription =
  'Book Shirdi cabs, Nashik, Trimbakeshwar, Shani Shingnapur sightseeing, airport & railway transfers and tour packages with Jeevan Holidays Shirdi. English, हिंदी, मराठी, తెలుగు.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { title: siteName },
      { name: 'description', content: siteDescription },
      { name: 'theme-color', content: '#1b1430' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-title', content: 'Jeevan Holidays' },
      { property: 'og:title', content: siteName },
      { property: 'og:description', content: siteDescription },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: '/.netlify/images?url=/img/hero.png&w=1200&fm=jpg' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'manifest', href: '/manifest.webmanifest' },
      { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/icon.svg' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Mukta:wght@400;500;600;700&family=Noto+Sans+Telugu:wght@400;600;700&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AppProvider>
          <Chrome>{children}</Chrome>
        </AppProvider>
        <Scripts />
      </body>
    </html>
  )
}
