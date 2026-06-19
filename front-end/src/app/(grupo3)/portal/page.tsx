'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { PROFILE_LABEL, PROJECT } from '@/features/adaptacao/content'
import { useCommProfile } from '@/features/adaptacao/profile-context'
import { ProfileToggle } from '@/features/adaptacao/components/ProfileToggle'
import { JourneyTimeline } from '@/features/adaptacao/components/JourneyTimeline'
import { BlockerCard } from '@/features/adaptacao/components/BlockerCard'

const HEALTH_LABEL = {
  ok: 'No prazo',
  attention: 'Atenção',
  blocked: 'Impeditivo',
} as const

export default function ClientPortalPage() {
  const { profile } = useCommProfile()
  const p = PROJECT

  return (
    <main className="loomi-glow">
      {/* Barra de pré-visualização — dispositivo de demo, não faz parte do portal real do cliente */}
      <div className="border-b border-border bg-page/60">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10">
          <p className="loomi-caption">
            Pré-visualizar como · <span className="text-foreground">{PROFILE_LABEL[profile]}</span>
          </p>
          <ProfileToggle />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-14 md:px-10">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="purple">{p.sector}</Badge>
          <Badge variant="attention">{HEALTH_LABEL[p.health.state]}</Badge>
        </div>
        <h1 className="loomi-h1 mt-5">{p.projectName}</h1>
        <p className="loomi-caption mt-3">{p.client}</p>

        {/* Conteúdo que se adapta — key={profile} re-dispara a transição ao trocar */}
        <div key={profile} className="animate-fade-up">
          {/* Health summary */}
          <p className="loomi-body mt-8 max-w-3xl">{p.health.summary[profile]}</p>

          {/* Stats */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {p.stats.map((stat) => (
              <Card key={stat.label[profile]} size="sm">
                <CardContent>
                  <p className="loomi-caption">{stat.label[profile]}</p>
                  <p className="loomi-h3 mt-2 text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Jornada + Bloqueios */}
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <section>
              <h2 className="loomi-label text-foreground/70">Jornada do projeto</h2>
              <div className="mt-6">
                <JourneyTimeline steps={p.journey} profile={profile} />
              </div>
            </section>

            <section>
              <h2 className="loomi-label text-foreground/70">Pontos de atenção</h2>
              <div className="mt-6 space-y-5">
                {p.blockers.map((blocker) => (
                  <BlockerCard key={blocker.id} blocker={blocker} profile={profile} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
