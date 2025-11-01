import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'AI Learning Platform',
    template: '%s | AI Learning Platform'
  },
  description: 'AI-powered adaptive learning platform with gamification and personalized education paths',
  keywords: ['AI', 'Learning', 'Education', 'Gamification', 'Adaptive Learning', 'Personalized Education'],
  authors: [{ name: 'AI Learning Platform Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-learning-platform.vercel.app',
    title: 'AI Learning Platform',
    description: 'AI-powered adaptive learning platform with gamification and personalized education paths',
    siteName: 'AI Learning Platform',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Learning Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Learning Platform',
    description: 'AI-powered adaptive learning platform with gamification and personalized education paths',
    images: ['/og-image.png']
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1
  },
  robots: {
    index: true,
    follow: true
  },
  manifest: '/manifest.json'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))'
              }
            }}
          />
        </Providers>
      </body>
    </html>
  )
}