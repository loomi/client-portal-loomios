import type { Metadata } from 'next'
import { Sora, JetBrains_Mono } from 'next/font/google'
import { QueryProvider } from '@/components/QueryProvider'
import '@/styles/globals.css'
import { cn } from '@/lib/utils'

// Loomi uses a single typeface — Sora — at every scale (design.md).
// ExtraLight (200) and Light (300) carry the brand's airy quality;
// Regular/Medium (400/500) cover labels and UI chrome.
const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['200', '300', '400', '500', '600'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Loomi · Client Portal',
  description: 'Portal do cliente Loomi — jornada, health e co-criação transparente',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body
        className={cn("bg-background font-body text-foreground antialiased", sora.variable, jetbrains.variable)}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
