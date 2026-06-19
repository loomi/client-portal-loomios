'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { portalNav } from '@/features/portal/nav'

export function PortalSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-60 flex-col border-r border-border bg-card">
      <div className="px-6 py-6">
        <p className="text-sm font-semibold">Loomi Portal</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Helios Energia</p>
      </div>

      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {portalNav.map(({ href, label, disabled }) => {
            const active = pathname === href

            if (disabled) {
              return (
                <li key={href}>
                  <span
                    className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground/50"
                    title="Em breve"
                  >
                    {label}
                    <span className="text-[10px] uppercase tracking-wide">em breve</span>
                  </span>
                </li>
              )
            }

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2 text-sm transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/70 hover:bg-muted hover:text-foreground',
                  )}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="px-6 py-4">
        <p className="text-[10px] text-muted-foreground">Loomi · 2026</p>
      </div>
    </aside>
  )
}
