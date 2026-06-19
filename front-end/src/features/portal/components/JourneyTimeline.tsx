import { cn } from '@/lib/utils'
import type { JourneyStage, StageStatus } from '../types'
import { HealthPill } from './HealthPill'
import { MaterialItem } from './MaterialItem'

const markerClass: Record<StageStatus, string> = {
  concluida: 'border-emerald-500 bg-emerald-500',
  atual: 'border-primary bg-primary',
  proxima: 'border-border bg-background',
}

const statusLabel: Record<StageStatus, string> = {
  concluida: 'Concluída',
  atual: 'Em andamento',
  proxima: 'Próxima',
}

function StageNode({ stage, isLast }: { stage: JourneyStage; isLast: boolean }) {
  const isCurrent = stage.status === 'atual'

  return (
    <li className="relative flex gap-4 pb-8">
      {!isLast && (
        <span className="absolute left-[7px] top-5 h-full w-px bg-border" aria-hidden />
      )}

      <span
        className={cn(
          'relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2',
          markerClass[stage.status],
        )}
        aria-hidden
      />

      <div
        className={cn(
          'flex-1 rounded-xl border p-4',
          isCurrent ? 'border-primary/40 bg-card' : 'border-border bg-card',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {statusLabel[stage.status]}
            </p>
            <h3 className="mt-0.5 font-medium">{stage.title}</h3>
          </div>
          <HealthPill health={stage.health} />
        </div>

        <p className="mt-2 text-sm text-muted-foreground">{stage.summary}</p>

        {isCurrent && stage.nextSteps.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Próximos passos
            </p>
            <ul className="mt-2 space-y-1.5">
              {stage.nextSteps.map((step) => (
                <li key={step} className="flex gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}

        {stage.materials.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Materiais
            </p>
            <div className="mt-2 space-y-2">
              {stage.materials.map((material) => (
                <MaterialItem key={material.id} material={material} />
              ))}
            </div>
          </div>
        )}
      </div>
    </li>
  )
}

export function JourneyTimeline({ stages }: { stages: JourneyStage[] }) {
  return (
    <ul>
      {stages.map((stage, i) => (
        <StageNode key={stage.id} stage={stage} isLast={i === stages.length - 1} />
      ))}
    </ul>
  )
}
