import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { Providers } from './providers'

import UserContextWrapper from '../context/UserContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'PH-HealthCare | Your Trusted Partner in Digital Health',
  description: 'Book appointments with verified doctors, get expert medical advice, and manage your health digitally.',
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans mx-auto antialiased bg-background text-foreground`}>
       
        <Providers>
      
          <UserContextWrapper>
          {children}
        </UserContextWrapper>
        </Providers>
      </body>
    </html>
  )
}
