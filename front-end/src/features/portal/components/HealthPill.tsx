import { cn } from '@/lib/utils'
import { healthMeta } from '../mock'
import type { HealthState } from '../types'

const toneClass: Record<HealthState, string> = {
  verde: 'bg-emerald-100 text-emerald-700',
  atencao: 'bg-amber-100 text-amber-700',
  impeditivo: 'bg-red-100 text-red-700',
}

const dotClass: Record<HealthState, string> = {
  verde: 'bg-emerald-500',
  atencao: 'bg-amber-500',
  impeditivo: 'bg-red-500',
}

export function HealthPill({
  health,
  className,
}: {
  health: HealthState
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        toneClass[health],
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dotClass[health])} />
      {healthMeta[health].label}
    </span>
  )
}
