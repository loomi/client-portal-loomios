import type { Metadata } from 'next'

import { ContextBar } from '@/features/portal/components/ContextBar'
import { ExecutiveSummary } from '@/features/portal/components/ExecutiveSummary'
import { FloatingAssistant } from '@/features/portal/components/FloatingAssistant'
import { JourneyTimeline } from '@/features/portal/components/JourneyTimeline'

export const metadata: Metadata = {
  title: 'Portal do Cliente · Volt Energia — Loomi',
  description:
    'Visão executiva do projeto: jornada, saúde e métricas-chave em um só lugar.',
}

const sections = [
  { node: <ContextBar />, delay: '0ms' },
  { node: <ExecutiveSummary />, delay: '70ms' },
  { node: <JourneyTimeline />, delay: '140ms' },
]

export default function PortalHomePage() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Atmosfera: glow radial da marca (design.md — decorativo, sob o conteúdo) */}
      <div aria-hidden className="loomi-glow pointer-events-none absolute inset-x-0 top-0 h-80" />

      <main className="relative mx-auto max-w-5xl space-y-8 px-6 py-10 sm:py-14">
        {sections.map((section, index) => (
          <div
            key={index}
            className="animate-fade-up"
            style={{ animationDelay: section.delay }}
          >
            {section.node}
          </div>
        ))}

        <footer className="border-t border-border pt-6 text-center">
          <span className="loomi-caption">Acompanhamento em tempo real · Loomi × Volt Energia</span>
        </footer>
      </main>

      {/* Assistente de IA flutuante */}
      <FloatingAssistant />
    </div>
  )
}
