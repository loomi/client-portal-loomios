'use client'

import { useEffect, useRef } from 'react'
import { ArrowUp, Plus } from 'lucide-react'

import { cn } from '@/lib/utils'

type ComposerProps = {
  value: string
  onValueChange: (value: string) => void
  onSend: () => void
  placeholder?: string
  autoFocus?: boolean
}

export function Composer({
  value,
  onValueChange,
  onSend,
  placeholder = 'Conte como está sendo o projeto…',
  autoFocus = false,
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const canSend = value.trim().length > 0

  function grow(el: HTMLTextAreaElement) {
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }

  // Reseta a altura quando o campo é limpo (após enviar).
  useEffect(() => {
    if (value === '' && textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [value])

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    onValueChange(event.target.value)
    grow(event.target)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (canSend) onSend()
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (canSend) onSend()
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="rounded-3xl border border-border bg-card p-2 shadow-[0_1px_2px_rgba(19,19,19,0.04),0_12px_40px_-12px_rgba(19,19,19,0.12)] transition-colors focus-within:border-ring/40">
        <label htmlFor="composer" className="sr-only">
          Escreva sua mensagem
        </label>
        <textarea
          id="composer"
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          placeholder={placeholder}
          inputMode="text"
          autoComplete="off"
          className="block max-h-[200px] w-full resize-none bg-transparent px-3 pt-2.5 text-[0.95rem] leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
        />

        <div className="flex items-center justify-between px-1 pt-1">
          <button
            type="button"
            aria-label="Anexar arquivo"
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <Plus className="size-5" aria-hidden />
          </button>

          <button
            type="submit"
            disabled={!canSend}
            aria-label="Enviar mensagem"
            className={cn(
              'flex size-9 items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
              canSend
                ? 'bg-primary text-primary-foreground hover:-translate-y-px hover:bg-primary/90'
                : 'cursor-not-allowed bg-muted text-muted-foreground/50',
            )}
          >
            <ArrowUp className="size-5" aria-hidden />
          </button>
        </div>
      </div>
    </form>
  )
}
