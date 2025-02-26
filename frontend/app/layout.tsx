import './styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/navbar'
import Footer from './components/footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NeoBloom | AI-Powered Futuristic Blogging Platform',
  description: 'A fully automated, AI-powered blogging platform with a futuristic cyberpunk aesthetic.',
  keywords: 'AI, blogging, automation, content generation, cyberpunk, futuristic',
  authors: [{ name: 'NeoBloom Team' }],
  openGraph: {
    title: 'NeoBloom | AI-Powered Futuristic Blogging Platform',
    description: 'A fully automated, AI-powered blogging platform with a futuristic cyberpunk aesthetic.',
    url: 'https://neobloom.com',
    siteName: 'NeoBloom',
    images: [
      {
        url: '/assets/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NeoBloom - AI-Powered Futuristic Blogging Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeoBloom | AI-Powered Futuristic Blogging Platform',
    description: 'A fully automated, AI-powered blogging platform with a futuristic cyberpunk aesthetic.',
    images: ['/assets/images/twitter-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-sans bg-gray-50`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
} 