import type { Metadata } from 'next'
import { Sora, JetBrains_Mono } from 'next/font/google'
import { QueryProvider } from '@/components/QueryProvider'
import '@/styles/globals.css'
import { cn } from '@/lib/utils'

// Sora is the sole typeface — ExtraLight/Light for display & body,
// Regular reserved for label-caps. Bold (600+) is not part of the identity.
const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['200', '300', '400'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Claude Code — Onboarding Loomi',
  description: 'Guia prático de onboarding do Claude Code para o time de produto da Loomi',
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
