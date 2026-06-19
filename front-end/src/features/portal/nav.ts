export interface PortalNavItem {
  href: string
  label: string
  disabled?: boolean
}

export const portalNav: PortalNavItem[] = [
  { href: '/portal', label: 'Visão geral' },
  { href: '/portal/jornada', label: 'Jornada' },
  { href: '/portal/feedback', label: 'Feedback', disabled: true },
  { href: '/portal/status', label: 'Meus pedidos', disabled: true },
]
