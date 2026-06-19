'use client'

import Link from 'next/link'
import {
  FileText,
  LayoutDashboard,
  ListChecks,
  PanelLeft,
  Route,
  Settings,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'

type NavItem = {
  icon: LucideIcon
  label: string
  href: string
}

// Grupo principal de navegação do portal.
const PRIMARY_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: 'Visão geral', href: '#' },
  { icon: Route, label: 'Jornada', href: '#' },
  { icon: Sparkles, label: 'Conversar', href: '/feedback' },
  { icon: ListChecks, label: 'Meus pedidos', href: '#' },
  { icon: FileText, label: 'Materiais', href: '#' },
]

// Grupo de rodapé (após o divisor).
const SECONDARY_ITEMS: NavItem[] = [
  { icon: Settings, label: 'Ajustes', href: '#' },
]

// Rota ativa — destacada com o círculo claro.
const ACTIVE_HREF = '/feedback'

const CLIENT_NAME = 'Helena Vargas'

function NavButton({ item }: { item: NavItem }) {
  const isActive = item.href === ACTIVE_HREF
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      title={item.label}
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'group relative flex size-11 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
        isActive
          ? 'bg-foreground/[0.07] text-foreground'
          : 'text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground',
      )}
    >
      <Icon className="size-5" strokeWidth={1.75} aria-hidden />
    </Link>
  )
}

export function FloatingSidebar() {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex"
    >
      {/* Marca — botão circular flutuante */}
      <Link
        href="/feedback"
        aria-label="Loomi — início"
        className="flex size-14 items-center justify-center rounded-full border border-border bg-card text-primary shadow-[0_8px_28px_-10px_rgba(19,19,19,0.25)] transition-transform hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <PanelLeft className="size-6" strokeWidth={1.75} aria-hidden />
      </Link>

      {/* Pílula de navegação */}
      <div className="flex flex-col items-center gap-1 rounded-[1.75rem] border border-border bg-card p-2 shadow-[0_12px_44px_-14px_rgba(19,19,19,0.22)]">
        {PRIMARY_ITEMS.map((item) => (
          <NavButton key={item.label} item={item} />
        ))}

        <div className="my-1 h-px w-7 bg-border" role="separator" />

        {SECONDARY_ITEMS.map((item) => (
          <NavButton key={item.label} item={item} />
        ))}
      </div>

      {/* Avatar do cliente — círculo flutuante */}
      <Link
        href="#"
        aria-label={`Perfil de ${CLIENT_NAME}`}
        title={CLIENT_NAME}
        className="flex size-14 items-center justify-center rounded-full border border-border bg-card p-1 shadow-[0_8px_28px_-10px_rgba(19,19,19,0.25)] transition-transform hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <span
          className="flex size-full items-center justify-center rounded-full text-sm font-normal tracking-wide text-white"
          style={{
            background:
              'linear-gradient(135deg, #7B3FFF 0%, #8B3FE0 50%, #FF2D87 100%)',
          }}
          aria-hidden
        >
          HV
        </span>
      </Link>
    </nav>
  )
}
