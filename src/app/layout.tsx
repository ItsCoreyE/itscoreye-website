import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ItsCoreyE - Entrepreneur & Creator',
  description: 'Results-driven entrepreneur with 5+ years experience. Founder of ItsCoreyE (Roblox UGC Creator), Odds Up (fair prize competitions), and Fix My Rig (remote IT support). Building transparent businesses across gaming, tech, and customer service.',
  keywords: ['ItsCoreyE', 'Entrepreneur', 'Business Owner', 'UGC Creator', 'Roblox Designer', 'Digital Creator', 'Odds Up', 'Prize Competitions', 'UK Competitions', 'Fix My Rig', 'IT Support', 'Remote Tech Support', 'Customer Service', 'Operations Management', 'Web Development', 'Stripe Integration'],
  authors: [{ name: 'ItsCoreyE' }],
  creator: 'ItsCoreyE',
  publisher: 'ItsCoreyE',
  
  themeColor: '#0a0e27',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ItsCoreyE',
  },
  
  openGraph: {
    title: 'ItsCoreyE - Entrepreneur | 3 Active Ventures',
    description: 'Building transparent businesses in gaming, tech, and customer service. Founder of ItsCoreyE (Roblox UGC), Odds Up (competitions), and Fix My Rig (IT support).',
    url: 'https://itscoreye.co.uk',
    siteName: 'ItsCoreyE Portfolio',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ItsCoreyE - Entrepreneur & Creator'
      }
    ]
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'ItsCoreyE - Entrepreneur | 3 Active Ventures',
    description: 'Building transparent businesses in gaming, tech, and customer service. ItsCoreyE | Odds Up | Fix My Rig',
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
    "name": "ItsCoreyE",
    "description": "Entrepreneur and customer professional with 5+ years experience building transparent businesses",
    "jobTitle": "Founder & Entrepreneur",
    "url": "https://itscoreye.co.uk",
    "knowsAbout": ["UGC Design", "IT Support", "Customer Service", "Web Development", "Operations Management", "Roblox Development"],
    "owns": [
      {
        "@type": "Organization",
        "name": "ItsCoreyE",
        "description": "Roblox UGC Creator - Quality digital items for Roblox avatars",
        "url": "https://itscoreye.co.uk",
        "foundingDate": "2025"
      },
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
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0a0e27" />
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
