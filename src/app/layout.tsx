import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/ui/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LLM Learning Platform - Master Large Language Models',
  description: 'Interactive learning platform for LLM integration, prompt engineering, and AI development',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="root">
          <Navigation />
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}