import type { ComponentType } from 'react'
import { CircleCheck, OctagonAlert, TriangleAlert } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Os três estados de saúde do projeto, mapeados aos tokens de estado do
 * design system Loomi (design.md): state-ok / state-attention / state-blocked.
 */
export type HealthState = 'verde' | 'atencao' | 'impeditivo'

interface HealthMeta {
  label: string
  /** Termo no registro de "saúde" (para o card de saúde e legenda). */
  term: string
  /** Descrição curta do estado (legenda). */
  caption: string
  /** Cor sólida do estado (bg-*). */
  dot: string
  /** Cor de texto acessível sobre o fill translúcido. */
  text: string
  /** Fill translúcido (10–12%). */
  surface: string
  /** Borda do estado (~30–40%). */
  border: string
  /** Ring saturado (marcador / seleção). */
  solidRing: string
  Icon: ComponentType<{ className?: string }>
}

export const HEALTH: Record<HealthState, HealthMeta> = {
  verde: {
    label: 'No ritmo',
    term: 'Saudável',
    caption: 'Tudo caminhando como planejado.',
    dot: 'bg-state-ok',
    text: 'text-[#157A4C]',
    surface: 'bg-state-ok/10',
    border: 'border-state-ok/40',
    solidRing: 'ring-state-ok',
    Icon: CircleCheck,
  },
  atencao: {
    label: 'Atenção',
    term: 'Requer atenção',
    caption: 'Algo precisa de acompanhamento.',
    dot: 'bg-state-attention',
    text: 'text-[#8A5A12]',
    surface: 'bg-state-attention/12',
    border: 'border-state-attention/45',
    solidRing: 'ring-state-attention',
    Icon: TriangleAlert,
  },
  impeditivo: {
    label: 'Bloqueio',
    term: 'Crítico',
    caption: 'Há um impedimento que trava o avanço.',
    dot: 'bg-state-blocked',
    text: 'text-[#C0292E]',
    surface: 'bg-state-blocked/10',
    border: 'border-state-blocked/40',
    solidRing: 'ring-state-blocked',
    Icon: OctagonAlert,
  },
}

export const HEALTH_ORDER: HealthState[] = ['verde', 'atencao', 'impeditivo']

/** Badge de saúde — pill + label-caps, conforme design.md §Badges. */
export function HealthBadge({
  state,
  className,
}: {
  state: HealthState
  className?: string
}) {
  const h = HEALTH[state]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.625rem] font-medium tracking-[0.15em] uppercase',
        h.surface,
        h.border,
        h.text,
        className,
      )}
    >
      <h.Icon className="size-3" />
      {h.label}
    </span>
  )
}
