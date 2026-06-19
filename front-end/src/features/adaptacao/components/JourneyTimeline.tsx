import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { JourneyStep, Profile } from '../content'

export function JourneyTimeline({
  steps,
  profile,
}: {
  steps: JourneyStep[]
  profile: Profile
}) {
  return (
    <ol className="relative">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        return (
          <li key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
            {/* connector line */}
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  'absolute top-7 left-3.5 h-full w-px -translate-x-1/2',
                  step.status === 'done' ? 'bg-state-ok/40' : 'bg-border',
                )}
              />
            )}

            {/* marker */}
            <span
              aria-hidden
              className={cn(
                'relative z-10 mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border transition-colors',
                step.status === 'done' && 'border-transparent bg-state-ok/15 text-[#157A4C]',
                step.status === 'current' && 'border-brand-purple bg-brand-purple/10 text-brand-purple',
                step.status === 'upcoming' && 'border-border bg-surface text-foreground/30',
              )}
            >
              {step.status === 'done' ? (
                <Check className="size-3.5" />
              ) : (
                <span className="size-1.5 rounded-full bg-current" />
              )}
            </span>

            {/* label */}
            <div className="pt-0.5">
              <p
                className={cn(
                  'loomi-body-sm',
                  step.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground',
                  step.status === 'current' && 'font-normal',
                )}
              >
                {step.label[profile]}
              </p>
              {step.status === 'current' && (
                <span className="loomi-caption mt-1 block text-brand-purple">
                  Etapa atual
                </span>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
