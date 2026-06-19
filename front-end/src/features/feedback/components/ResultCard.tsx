'use client'

import { Check, CircleSlash, Link2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { TriageResult, Urgency } from '../types'

const URGENCY_STYLE: Record<Urgency, string> = {
  Alta: 'bg-[var(--color-brand-pink)]/10 text-[var(--color-brand-pink)]',
  Média: 'bg-primary/10 text-[var(--color-brand-lilac)]',
  Baixa: 'bg-foreground/[0.06] text-muted-foreground',
}

export function ResultCard({ result }: { result: TriageResult }) {
  if (result.kind === 'no') {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(19,19,19,0.04),0_12px_40px_-16px_rgba(19,19,19,0.14)] motion-safe:animate-fade-up motion-reduce:animate-none">
        <div className="flex items-center gap-2">
          <CircleSlash className="size-4 text-muted-foreground" aria-hidden />
          <span className="text-[0.6875rem] font-normal uppercase tracking-[0.2em] text-muted-foreground">
            Recebido, mas não vira tarefa agora
          </span>
        </div>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-foreground">{result.resumo}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{result.motivo}</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(19,19,19,0.04),0_12px_40px_-16px_rgba(19,19,19,0.14)] motion-safe:animate-fade-up motion-reduce:animate-none">
      <div className="flex items-center gap-2">
        <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3" strokeWidth={3} aria-hidden />
        </span>
        <span className="text-[0.6875rem] font-normal uppercase tracking-[0.2em] text-[var(--color-brand-lilac)]">
          Pedido registrado
        </span>
      </div>

      <p className="mt-3 text-[0.95rem] leading-relaxed text-foreground">{result.resumo}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-foreground/[0.05] px-3 py-1 text-xs text-foreground/80">
          {result.categoria}
        </span>
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium',
            URGENCY_STYLE[result.urgencia],
          )}
        >
          Urgência {result.urgencia.toLowerCase()}
        </span>
      </div>

      {result.match ? (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-muted px-3 py-2.5 text-sm text-muted-foreground">
          <Link2 className="mt-0.5 size-4 shrink-0 text-[var(--color-brand-lilac)]" aria-hidden />
          <span>{result.match}</span>
        </div>
      ) : null}

      <StatusStepper stages={result.status} />

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Passa por uma pessoa do time antes de virar trabalho — e você acompanha cada etapa por aqui.
      </p>
    </div>
  )
}

function StatusStepper({ stages }: { stages: string[] }) {
  const currentIndex = stages.length - 1

  return (
    <ol className="mt-4 flex items-center gap-2" aria-label="Status do pedido">
      {stages.map((stage, i) => {
        const isCurrent = i === currentIndex
        return (
          <li key={stage} className="flex items-center gap-2">
            <span
              className={cn(
                'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-colors',
                isCurrent
                  ? 'bg-primary/10 text-[var(--color-brand-lilac)]'
                  : 'bg-foreground/[0.05] text-muted-foreground',
              )}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  isCurrent ? 'bg-[var(--color-brand-lilac)]' : 'bg-muted-foreground/50',
                )}
                aria-hidden
              />
              {stage}
            </span>
            {i < stages.length - 1 ? (
              <span className="text-muted-foreground/40" aria-hidden>
                →
              </span>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
