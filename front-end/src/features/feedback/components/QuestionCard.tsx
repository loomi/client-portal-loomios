'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Pencil } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Question } from '../types'

type QuestionCardProps = {
  question: Question
  index: number
  total: number
  onSelect: (optionId: string, label: string) => void
  onSkip: () => void
}

export function QuestionCard({ question, index, total, onSelect, onSkip }: QuestionCardProps) {
  const [cursor, setCursor] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const options = question.options

  useEffect(() => {
    containerRef.current?.focus()
  }, [])

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setCursor((c) => Math.min(c + 1, options.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setCursor((c) => Math.max(c - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const option = options[cursor]
      if (option) onSelect(option.id, option.label)
    }
  }

  return (
    <div className="flex flex-col gap-2 motion-safe:animate-fade-up motion-reduce:animate-none">
      <div
        ref={containerRef}
        tabIndex={-1}
        role="group"
        aria-label={question.prompt}
        onKeyDown={handleKeyDown}
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(19,19,19,0.04),0_12px_40px_-16px_rgba(19,19,19,0.14)] outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
      >
        <div className="flex items-center justify-between gap-4 border-b border-border/60 px-4 py-3">
          <p className="text-[0.95rem] leading-snug text-foreground">{question.prompt}</p>
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {index + 1} de {total}
          </span>
        </div>

        <ul>
          {options.map((option, i) => (
            <li key={option.id}>
              <button
                type="button"
                onMouseEnter={() => setCursor(i)}
                onClick={() => onSelect(option.id, option.label)}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                  i === cursor ? 'bg-foreground/[0.05]' : 'hover:bg-foreground/[0.03]',
                )}
              >
                <span
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-lg text-xs transition-colors',
                    i === cursor
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {i + 1}
                </span>
                <span className="flex-1 text-[0.95rem] text-foreground">{option.label}</span>
                <ArrowRight
                  className={cn(
                    'size-4 text-muted-foreground transition-opacity',
                    i === cursor ? 'opacity-100' : 'opacity-0',
                  )}
                  aria-hidden
                />
              </button>
            </li>
          ))}

          <li className="flex items-center justify-between gap-3 border-t border-border/60 px-4 py-3">
            <span className="flex items-center gap-3 text-muted-foreground">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Pencil className="size-3.5" aria-hidden />
              </span>
              <span className="text-[0.95rem]">Outra opção — responda abaixo</span>
            </span>
            <button
              type="button"
              onClick={onSkip}
              className="shrink-0 rounded-full bg-muted px-3 py-1.5 text-xs text-foreground/70 transition-colors hover:bg-foreground/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              Pular
            </button>
          </li>
        </ul>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        ↑↓ para navegar · Enter para selecionar · ou responda abaixo
      </p>
    </div>
  )
}
