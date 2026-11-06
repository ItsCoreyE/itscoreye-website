import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#fafafa',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.itscoreye.com'),
  // Homepage title stays under 60 characters so Google shows it in full; other pages
  // set a short title and the template adds the name, e.g. "Admin | Corey Edwards"
  title: {
    default: 'Corey Edwards (ItsCoreyE) | Roblox UGC Creator & Founder',
    template: '%s | Corey Edwards',
  },
  description: 'Corey Edwards (ItsCoreyE) designs Roblox UGC avatar accessories and runs Odds Up, Muzzle and Fix My Rig. See the ventures, real monthly sales numbers and how to get in touch.',
  keywords: ['Corey Edwards', 'ItsCoreyE', 'Entrepreneur', 'Business Owner', 'UGC Creator', 'Roblox Designer', 'Digital Creator', 'Odds Up', 'Prize Competitions', 'UK Competitions', 'Fix My Rig', 'IT Support', 'Remote Tech Support', 'Muzzle', 'Moderation Bot', "Yapin'", 'Customer Service', 'Operations Management', 'Web Development', 'Stripe Integration'],
  authors: [{ name: 'Corey Edwards' }],
  creator: 'Corey Edwards',
  publisher: 'Corey Edwards',


  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Corey Edwards',
  },

  openGraph: {
    title: 'Corey Edwards (ItsCoreyE) | Roblox UGC Creator & Founder',
    description: 'I design Roblox UGC and build businesses people trust, including Odds Up, Muzzle and Fix My Rig.',
    url: 'https://www.itscoreye.com',
    siteName: 'Corey Edwards',
    type: 'website',
    images: [
      {
        url: '/og-image.png?v=3',
        width: 1200,
        height: 630,
        alt: 'Corey Edwards, Roblox UGC Creator and Founder'
      }
    ]
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Corey Edwards (ItsCoreyE) | Roblox UGC Creator & Founder',
    description: 'I design Roblox UGC and build businesses people trust, including Odds Up, Muzzle and Fix My Rig.',
    creator: '@itscoreye',
    images: ['/og-image.png?v=3']
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
    "description": "Roblox UGC creator and founder of Odds Up, Muzzle and Fix My Rig, with over five years of experience in customer operations",
    "jobTitle": "Entrepreneur & UGC Creator",
    "url": "https://www.itscoreye.com",
    "knowsAbout": ["UGC Design", "IT Support", "Customer Service", "Web Development", "Operations Management", "Roblox Development"],
    "owns": [
      {
        "@type": "Organization",
        "name": "Odds Up",
        "description": "Fair prize competitions with realistic odds and transparent prizes",
        "url": "https://www.oddsup.co.uk",
        "foundingDate": "2025-12"
      },
      {
        "@type": "Organization",
        "name": "Fix My Rig",
        "description": "Expert remote tech support for PC and software problems",
        "url": "https://www.fixmyrig.co.uk",
        "foundingDate": "2025-02"
      },
      {
        "@type": "Organization",
        "name": "Muzzle",
        "description": "Free moderation bot for Yapin' servers with automod, raid protection, and a web dashboard",
        "url": "https://getmuzzle.tech",
        "foundingDate": "2026-11"
      }
    ]
  };

  return (
    <html lang="en" className={inter.variable}>
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
        <noscript>
          <style>{`.reveal{opacity:1;transform:none}.progress-fill{width:calc(var(--progress,0)*100%)}`}</style>
        </noscript>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
