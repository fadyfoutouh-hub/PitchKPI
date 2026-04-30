import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PitchKPI — Football Business Intelligence',
  description: 'Live transfer fees, broadcast rights, player salaries, club valuations and sponsorship deals. The Bloomberg of football.',
  keywords: 'football business, transfer fees, player salaries, broadcast rights, club valuations, sponsorship deals, stadium finance, football money',
  authors: [{ name: 'PitchKPI' }],
  openGraph: {
    type: 'website',
    url: 'https://pitchkpi.com',
    title: 'PitchKPI — Football Business Intelligence',
    description: 'Live transfer fees, broadcast rights, player salaries, club valuations and sponsorship deals. The Bloomberg of football.',
    siteName: 'PitchKPI',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@PitchKPI',
    title: 'PitchKPI — Football Business Intelligence',
    description: 'Live transfer fees, broadcast rights, player salaries, club valuations and sponsorship deals.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'PitchKPI',
              url: 'https://pitchkpi.com',
              description: 'Football Business Intelligence Platform',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://pitchkpi.com/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
