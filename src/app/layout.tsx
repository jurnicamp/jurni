import { Inter } from 'next/font/google'
import React from 'react'

import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: any = {
  title: 'CampShare - Share Your Adventure Stories',
  description:
    'Connect with fellow outdoor enthusiasts, discover new camping spots, and inspire others with your wilderness adventures.',
  keywords: 'camping, outdoor, adventure, social media, hiking, nature, wilderness',
  authors: [{ name: 'CampShare Team' }],
  openGraph: {
    title: 'CampShare - Share Your Adventure Stories',
    description:
      'Connect with fellow outdoor enthusiasts, discover new camping spots, and inspire others with your wilderness adventures.',
    type: 'website',
    locale: 'en_US',
    siteName: 'CampShare',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CampShare - Share Your Adventure Stories',
    description:
      'Connect with fellow outdoor enthusiasts, discover new camping spots, and inspire others with your wilderness adventures.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
