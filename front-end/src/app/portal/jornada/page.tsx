import { JourneyTimeline } from '@/features/portal/components/JourneyTimeline'
import { demoProject } from '@/features/portal/mock'

export default function JornadaPage() {
  const { stages, progress } = demoProject
  const done = stages.filter((s) => s.status === 'concluida').length

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">Jornada do projeto</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Onde estamos, o que já entregamos e o que vem a seguir.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          {done} de {stages.length} etapas concluídas · {progress}% do projeto
        </p>
      </header>

      <JourneyTimeline stages={stages} />
    </div>
  )
}
