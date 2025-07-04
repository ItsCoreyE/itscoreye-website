import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ItsCoreyE - UGC Creator',
  description: 'Official website of ItsCoreyE, a leading UGC creator on ROBLOX. Discover amazing accessories and items, view live sales stats, and explore creative designs across all categories.',
  keywords: ['ItsCoreyE', 'ROBLOX', 'UGC', 'Creator', 'Accessories', 'Virtual Items', 'Designer'],
  authors: [{ name: 'ItsCoreyE' }],
  creator: 'ItsCoreyE',
  publisher: 'ItsCoreyE',
  
  openGraph: {
    title: 'ItsCoreyE - UGC Creator',
    description: 'Official website of ItsCoreyE, a leading UGC creator on ROBLOX',
    url: 'https://itscoreye.co.uk',
    siteName: 'ItsCoreyE',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ItsCoreyE UGC Creator'
      }
    ]
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'ItsCoreyE - UGC Creator',
    description: 'Official website of ItsCoreyE, a leading UGC creator on ROBLOX',
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
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}