import Link from 'next/link'
import { HealthPill } from '@/features/portal/components/HealthPill'
import { demoProject } from '@/features/portal/mock'

export default function PortalHomePage() {
  const { metrics, health, name } = demoProject

  return (
    <div>
      <section className="rounded-xl border border-dashed border-border bg-card p-6">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Slot da Home executiva (Laura)
        </p>
        <div className="mt-2 flex items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold">{name}</h1>
          <HealthPill health={health} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Resumo executivo do projeto em uma olhada. Esta área recebe a Home da
          Laura — por ora, um placeholder com as métricas-chave.
        </p>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            <p className="mt-1 text-xl font-semibold">{metric.value}</p>
            {metric.hint && (
              <p className="mt-0.5 text-xs text-muted-foreground">{metric.hint}</p>
            )}
          </div>
        ))}
      </section>

      <section className="mt-6">
        <Link
          href="/portal/jornada"
          className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Ver jornada completa
        </Link>
      </section>
    </div>
  )
}
