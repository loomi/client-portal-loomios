export type HealthState = 'verde' | 'atencao' | 'impeditivo'

export type StageStatus = 'concluida' | 'atual' | 'proxima'

export interface Material {
  id: string
  title: string
  kind: string
  href: string
  deliveredAt: string | null
}

export interface JourneyStage {
  id: string
  title: string
  summary: string
  status: StageStatus
  health: HealthState
  nextSteps: string[]
  materials: Material[]
}

export interface Metric {
  id: string
  label: string
  value: string
  hint?: string
}

export interface Project {
  id: string
  name: string
  client: string
  sector: string
  health: HealthState
  progress: number
  metrics: Metric[]
  stages: JourneyStage[]
}
