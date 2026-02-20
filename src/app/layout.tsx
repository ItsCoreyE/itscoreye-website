import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0a0e27',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.itscoreye.com'),
  title: 'Corey Edwards | ItsCoreyE - Entrepreneur & Creator',
  description: 'Corey Edwards (ItsCoreyE) - Results-driven entrepreneur with 5+ years experience. Roblox UGC Creator building quality digital items, founder of Odds Up (fair prize competitions), Fix My Rig (remote IT support), and Click The Otter (idle clicker game). Building transparent businesses across gaming, tech, and customer service.',
  keywords: ['Corey Edwards', 'ItsCoreyE', 'Entrepreneur', 'Business Owner', 'UGC Creator', 'Roblox Designer', 'Digital Creator', 'Odds Up', 'Prize Competitions', 'UK Competitions', 'Fix My Rig', 'IT Support', 'Remote Tech Support', 'Click The Otter', 'Idle Clicker Game', 'Browser Game', 'Customer Service', 'Operations Management', 'Web Development', 'Stripe Integration'],
  authors: [{ name: 'Corey Edwards' }],
  creator: 'Corey Edwards',
  publisher: 'Corey Edwards',


  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
    title: 'Corey Edwards',
  },

  openGraph: {
    title: 'Corey Edwards | ItsCoreyE - Entrepreneur & Creator',
    description: 'Corey Edwards (ItsCoreyE) - Roblox UGC Creator and entrepreneur building transparent businesses. Operating four ventures: UGC digital items, Odds Up (competitions), Fix My Rig (IT support), and Click The Otter (idle clicker game).',
    url: 'https://www.itscoreye.com',
    siteName: 'Corey Edwards Portfolio',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Corey Edwards | ItsCoreyE - Entrepreneur & Creator'
      }
    ]
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Corey Edwards | ItsCoreyE - Entrepreneur & Creator',
    description: 'Corey Edwards (ItsCoreyE) - Roblox UGC Creator and entrepreneur. Operating: UGC digital items, Odds Up competitions, Fix My Rig IT support, and Click The Otter idle clicker game.',
    creator: '@itscoreye',
    images: ['/og-image.png']
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Corey Edwards",
    "alternateName": "ItsCoreyE",
    "description": "Roblox UGC Creator and entrepreneur with 5+ years experience building transparent businesses across gaming, tech, and customer service",
    "jobTitle": "Entrepreneur & UGC Creator",
    "url": "https://www.itscoreye.com",
    "knowsAbout": ["UGC Design", "IT Support", "Customer Service", "Web Development", "Operations Management", "Roblox Development"],
    "owns": [
      {
        "@type": "Organization",
        "name": "Odds Up",
        "description": "Fair Prize Competition Platform offering realistic odds",
        "url": "https://www.oddsup.co.uk",
        "foundingDate": "2025-12"
      },
      {
        "@type": "Organization",
        "name": "Fix My Rig",
        "description": "Remote IT Support Service - Expert technical assistance",
        "url": "https://www.fixmyrig.co.uk",
        "foundingDate": "2025-02"
      },
      {
        "@type": "Organization",
        "name": "Click The Otter",
        "description": "Free browser-based idle clicker game with achievements and prestige mechanics",
        "url": "https://clicktheotter.com",
        "foundingDate": "2026-02"
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/icons/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
