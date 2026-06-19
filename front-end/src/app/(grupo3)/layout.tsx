import Link from 'next/link'
import { CommunicationProfileProvider } from '@/features/adaptacao/profile-context'

export default function Grupo3Layout({ children }: { children: React.ReactNode }) {
  return (
    <CommunicationProfileProvider>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 border-b border-border bg-page/80 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 md:px-10">
            <div className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-full border border-foreground/15 text-sm">
                ○
              </span>
              <span className="loomi-label">Loomi</span>
            </div>
            <div className="flex items-center gap-1">
              <Link
                href="/loomi"
                className="loomi-label rounded-full px-4 py-2 text-foreground/55 transition-colors hover:text-foreground"
              >
                Painel Loomi
              </Link>
              <Link
                href="/portal"
                className="loomi-label rounded-full px-4 py-2 text-foreground/55 transition-colors hover:text-foreground"
              >
                Portal do cliente
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </div>
    </CommunicationProfileProvider>
  )
}
