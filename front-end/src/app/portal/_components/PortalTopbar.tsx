import { HealthPill } from '@/features/portal/components/HealthPill'
import { demoProject } from '@/features/portal/mock'

export function PortalTopbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-8">
        <div>
          <p className="text-sm font-medium leading-tight">{demoProject.name}</p>
          <p className="text-xs text-muted-foreground">
            {demoProject.client} · {demoProject.sector}
          </p>
        </div>
        <HealthPill health={demoProject.health} />
      </div>
    </header>
  )
}
