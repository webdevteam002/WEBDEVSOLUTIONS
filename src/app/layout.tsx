import type { Metadata } from 'next'
import './globals.css'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { CursorProvider } from '@/components/providers/CursorProvider'
import Background3D from '@/components/3d/Background3D'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("dark bg-brand-navy text-brand-silver", "font-sans", geist.variable)} suppressHydrationWarning>
      <body className="antialiased overflow-x-hidden" suppressHydrationWarning>
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
