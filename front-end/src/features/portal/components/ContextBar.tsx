'use client'

import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

import { personas, project } from '../data'

/** Seletor de cargo: troca a "lente" pela qual o cliente vê o portal. */
function PersonaSelector() {
  const [open, setOpen] = useState(false)
  const [personaId, setPersonaId] = useState(personas[0].id)
  const active = personas.find((p) => p.id === personaId) ?? personas[0]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs transition hover:border-brand-purple/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
      >
        <span className="loomi-label text-muted-foreground">Visão de</span>
        <span className="font-light text-foreground">{active.role}</span>
        <ChevronDown className={cn('size-3.5 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 cursor-default"
          />
          <ul
            role="listbox"
            className="absolute right-0 z-40 mt-2 w-64 origin-top-right animate-fade-in overflow-hidden rounded-xl border border-border bg-popover p-1"
          >
            {personas.map((persona) => {
              const selected = persona.id === personaId
              return (
                <li key={persona.id} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      setPersonaId(persona.id)
                      setOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left transition hover:bg-accent',
                      selected && 'bg-accent',
                    )}
                  >
                    <Check
                      className={cn(
                        'mt-0.5 size-4 shrink-0 text-brand-purple',
                        selected ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <span>
                      <span className="block text-sm font-light text-foreground">{persona.role}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{persona.focus}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}

/**
 * Cabeçalho de contexto: marca, projeto, cliente e o seletor de cargo que
 * adapta a "lente" do portal (gancho da adaptação linguística).
 */
export function ContextBar() {
  return (
    <header className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <span aria-hidden className="size-2.5 rounded-full bg-brand-purple" />
            <span className="loomi-label text-foreground">loomi</span>
            <span className="text-border">/</span>
            <span className="loomi-label text-muted-foreground">Portal do cliente</span>
          </div>
          <h1 className="text-4xl leading-none font-extralight tracking-tight text-foreground">
            {project.name}
          </h1>
        </div>

        <PersonaSelector />
      </div>

      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {project.client} · Setor de {project.sector}
        </p>
        <span className="loomi-caption shrink-0">{project.updatedLabel}</span>
      </div>
    </header>
  )
}
