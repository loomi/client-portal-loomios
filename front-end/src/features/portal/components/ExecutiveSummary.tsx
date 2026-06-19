'use client'

import { ArrowRight, Info, TrendingDown, TrendingUp, TriangleAlert } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { project } from '../data'
import { HEALTH, HEALTH_ORDER, type HealthState } from '../health'

/** Ícone de informação que revela a legenda de todos os status no hover/foco. */
function HealthLegend() {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-label="Ver legenda dos status de saúde"
        className="grid size-6 place-items-center rounded-full text-primary-foreground/70 transition hover:bg-white/15 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/40"
      >
        <Info className="size-4" />
      </button>
      <span
        role="tooltip"
        className="invisible absolute top-8 right-0 z-20 w-60 origin-top-right scale-95 rounded-xl border border-border bg-popover p-3 text-left opacity-0 transition-all duration-150 group-hover:visible group-hover:scale-100 group-hover:opacity-100 group-focus-within:visible group-focus-within:scale-100 group-focus-within:opacity-100"
      >
        <span className="loomi-label mb-2.5 block text-muted-foreground">Status de saúde</span>
        <span className="flex flex-col gap-2.5">
          {HEALTH_ORDER.map((state) => {
            const h = HEALTH[state]
            return (
              <span key={state} className="flex items-start gap-2.5">
                <span className={cn('mt-1 size-2 shrink-0 rounded-full', h.dot)} />
                <span className="leading-tight">
                  <span className={cn('block text-xs font-medium', h.text)}>{h.term}</span>
                  <span className="block text-[0.7rem] text-muted-foreground">{h.caption}</span>
                </span>
              </span>
            )
          })}
        </span>
      </span>
    </span>
  )
}

/** Card de saúde — fundo roxo, texto branco, sem ícone de alerta. */
function HealthStatusCard({ state }: { state: HealthState }) {
  const h = HEALTH[state]
  return (
    <Card className="border-transparent bg-primary text-primary-foreground">
      <CardContent className="flex h-full flex-col justify-between gap-6">
        <div className="flex items-center justify-between">
          <span className="loomi-label text-primary-foreground/70">Saúde do projeto</span>
          <HealthLegend />
        </div>
        <div>
          <p className="text-3xl leading-none font-extralight">{h.term}</p>
          <p className="mt-2 text-xs text-primary-foreground/70">{project.healthHeadline}</p>
        </div>
      </CardContent>
    </Card>
  )
}

/** Uma métrica-chave em seu próprio card. */
function MetricCard({ metric }: { metric: (typeof project.metrics)[number] }) {
  const Trend = metric.trend === 'down' ? TrendingDown : TrendingUp
  return (
    <Card>
      {/* Mesma estrutura do card de saúde: rótulo no topo, valor + hint ancorados embaixo. */}
      <CardContent className="flex h-full flex-col justify-between gap-6">
        <p className="loomi-label text-muted-foreground">{metric.label}</p>
        <div>
          <p className="text-3xl leading-none font-extralight tracking-tight tabular-nums text-foreground">
            {metric.value}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            {metric.trend && (
              <Trend
                className={cn(
                  'size-3.5',
                  metric.trend === 'up' ? 'text-state-ok' : 'text-state-blocked',
                )}
              />
            )}
            {metric.hint}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Topo do portal:
 *  • Seção principal — o acionável prioritário (assunto + o que fazer + CTA).
 *  • Abaixo — card de saúde (roxo, com legenda no hover) e as métricas, uma por card.
 */
export function ExecutiveSummary() {
  const { overallHealth, attention, metrics } = project

  return (
    <section className="space-y-4">
      {/* Seção principal: o acionável */}
      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-brand-lilac/25 bg-brand-lilac/10 text-brand-lilac">
            <TriangleAlert className="size-5" />
          </span>
          <div className="flex-1 space-y-1">
            <span className="loomi-label text-brand-lilac">{attention.label}</span>
            <h2 className="text-lg leading-snug font-light text-foreground">{attention.title}</h2>
            <p className="text-sm text-muted-foreground">{attention.detail}</p>
          </div>
          <Button variant="purple" className="group/cta w-full justify-between sm:w-auto">
            {attention.cta}
            <ArrowRight className="transition-transform group-hover/cta:translate-x-0.5" />
          </Button>
        </CardContent>
      </Card>

      {/* Saúde + métricas, abaixo da seção principal */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,17rem)_1fr]">
        <HealthStatusCard state={overallHealth} />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.key} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  )
}
