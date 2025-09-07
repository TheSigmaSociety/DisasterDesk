import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'DisasterDesk - Emergency Response System',
  description: 'AI-powered emergency call handling and resource dispatch system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} font-sans`}>
        {/* Cyber Grid Background */}
        <div className="fixed inset-0 cyber-grid opacity-30 pointer-events-none"></div>
        
        {/* Main Content */}
        <main className="relative min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
