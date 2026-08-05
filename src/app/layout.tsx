import type { Metadata } from 'next'
import './globals.css'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { CursorProvider } from '@/components/providers/CursorProvider'
import Background3D from '@/components/3d/Background3D'

export const metadata: Metadata = {
  title: 'WebDev Solutions - Engineering Tomorrow\'s Web, Today',
  description: 'Premium technology and software development agency.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark bg-brand-navy text-brand-silver">
      <body className="antialiased">
        <SmoothScrollProvider>
          <CursorProvider>
            <Background3D />
            {children}
          </CursorProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
