'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Copy,
  MoreVertical,
  RotateCcw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  type LucideIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { findScenario } from '../scenarios'
import type { ChatMessage, Scenario } from '../types'
import { Composer } from './Composer'
import { QuestionCard } from './QuestionCard'
import { ResultCard } from './ResultCard'

const CLIENT_FIRST_NAME = 'Helena'

const QUICK_PROMPTS = [
  'Reportar um problema',
  'Pedir um ajuste',
  'Elogiar uma entrega',
  'Tirar uma dúvida',
] as const

// Demo: a primeira mensagem sempre cai no golden path (setor energia),
// independentemente do que a pessoa digitar.
const GOLDEN_PATH_MESSAGE =
  'O relatório de consumo está vindo com atraso e atrapalha minha reunião de diretoria.'

// Tempos de "pensamento" da IA (ms) — só antes e depois do refinamento.
const THINK_INTRO = 1900
const THINK_RESULT = 2200

type ActiveFlow = {
  scenario: Scenario
  questionIndex: number
  answers: Record<string, string>
}

function makeId() {
  return Math.random().toString(36).slice(2)
}

export function ConversationView() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [flow, setFlow] = useState<ActiveFlow | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  const started = messages.length > 0

  useEffect(() => {
    if (started) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking, flow, started])

  function pushUser(text: string) {
    setMessages((prev) => [...prev, { id: makeId(), role: 'user', text }])
  }

  function startScenario(text: string) {
    pushUser(text)
    setIsThinking(true)

    window.setTimeout(() => {
      const scenario = findScenario(text)
      setMessages((prev) => [...prev, { id: makeId(), role: 'assistant', text: scenario.intro }])

      if (scenario.questions.length > 0) {
        setFlow({ scenario, questionIndex: 0, answers: {} })
      } else if (scenario.buildResult) {
        const result = scenario.buildResult({})
        setMessages((prev) => [...prev, { id: makeId(), role: 'assistant', result }])
      }
      setIsThinking(false)
    }, THINK_INTRO)
  }

  function recordAnswer(value: string) {
    if (!flow) return
    const current = flow
    const question = current.scenario.questions[current.questionIndex]
    const answers = { ...current.answers, [question.id]: value }
    const nextIndex = current.questionIndex + 1

    if (nextIndex < current.scenario.questions.length) {
      // Só armazena e avança — sem criar mensagem no chat.
      setFlow({ ...current, questionIndex: nextIndex, answers })
      return
    }

    // Última pergunta respondida → "pensa" antes de montar o resultado.
    setFlow(null)
    setIsThinking(true)
    const result = current.scenario.buildResult?.(answers)
    window.setTimeout(() => {
      if (result) setMessages((prev) => [...prev, { id: makeId(), role: 'assistant', result }])
      setIsThinking(false)
    }, THINK_RESULT)
  }

  function send() {
    const text = input.trim()
    if (!text) return
    setInput('')

    if (flow) {
      // Resposta livre digitada durante o refinamento aparece como mensagem.
      pushUser(text)
      recordAnswer(text)
      return
    }

    // A primeira mensagem sempre entra pelo golden path.
    const isFirst = messages.length === 0
    startScenario(isFirst ? GOLDEN_PATH_MESSAGE : text)
  }

  const showQuestion = flow !== null && !isThinking

  // ── Estado inicial: greeting centralizado (estilo Gemini) ──────────────
  if (!started) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-[35%] rounded-full opacity-70 blur-[120px]"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(123,63,255,0.22), rgba(196,126,255,0.16) 40%, rgba(255,45,135,0.10) 68%, transparent 78%)',
          }}
        />

        <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
          <h1
            className="text-center text-[clamp(1.875rem,5vw,3rem)] leading-[1.1] text-foreground motion-safe:animate-fade-up motion-reduce:animate-none"
            style={{ animationDelay: '60ms' }}
          >
            Como está sendo o projeto,{' '}
            <span className="text-[var(--color-brand-lilac)]">{CLIENT_FIRST_NAME}</span>?
          </h1>

          <p
            className="mt-4 max-w-md text-center text-sm leading-relaxed text-muted-foreground motion-safe:animate-fade-up motion-reduce:animate-none"
            style={{ animationDelay: '120ms' }}
          >
            Conte o que está funcionando ou o que precisa melhorar. A gente organiza o
            seu feedback e te mostra o andamento.
          </p>

          <div
            className="mt-9 w-full motion-safe:animate-fade-up motion-reduce:animate-none"
            style={{ animationDelay: '180ms' }}
          >
            <Composer value={input} onValueChange={setInput} onSend={send} />
          </div>

          <ul
            className="mt-6 flex flex-wrap items-center justify-center gap-2 motion-safe:animate-fade-up motion-reduce:animate-none"
            style={{ animationDelay: '240ms' }}
          >
            {QUICK_PROMPTS.map((prompt) => (
              <li key={prompt}>
                <button
                  type="button"
                  onClick={() => setInput(prompt + ' ')}
                  className="rounded-full border border-foreground/10 bg-card px-4 py-2 text-[0.8125rem] text-foreground/80 transition-all hover:-translate-y-px hover:border-foreground/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  {prompt}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    )
  }

  // ── Estado de conversa: thread + input fixo embaixo ────────────────────
  return (
    <main className="relative flex min-h-screen flex-col">
      {/* Aurora animada — só enquanto a IA "pensa"; some ao retornar */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-opacity duration-700 ease-out',
          isThinking ? 'opacity-100' : 'opacity-0',
        )}
      >
        <div
          className="absolute bottom-[-8rem] left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full blur-[100px] motion-safe:animate-aurora-a"
          style={{ background: 'radial-gradient(circle, rgba(123,63,255,0.24), transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-9rem] left-[42%] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full blur-[100px] motion-safe:animate-aurora-b"
          style={{ background: 'radial-gradient(circle, rgba(255,45,135,0.18), transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-7rem] left-[58%] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full blur-[100px] motion-safe:animate-aurora-c"
          style={{ background: 'radial-gradient(circle, rgba(196,126,255,0.18), transparent 70%)' }}
        />
      </div>

      <header className="flex items-center justify-end px-6 py-4">
        <button
          type="button"
          aria-label="Mais opções"
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <MoreVertical className="size-5" aria-hidden />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-44">
        <div className="mx-auto flex max-w-2xl flex-col gap-8 pt-4">
          {messages.map((message) => {
            if (message.role === 'user') {
              return <UserMessage key={message.id} text={message.text} />
            }
            if ('result' in message) {
              return (
                <AssistantTurn key={message.id}>
                  <ResultCard result={message.result} />
                </AssistantTurn>
              )
            }
            return <AssistantMessage key={message.id} text={message.text} />
          })}

          {showQuestion && flow ? (
            <AssistantTurn>
              <QuestionCard
                key={`${flow.scenario.id}-${flow.questionIndex}`}
                question={flow.scenario.questions[flow.questionIndex]}
                index={flow.questionIndex}
                total={flow.scenario.questions.length}
                onSelect={(optionId) => recordAnswer(optionId)}
                onSkip={() => recordAnswer('skip')}
              />
            </AssistantTurn>
          ) : null}

          {isThinking ? <TypingIndicator /> : null}
          <div ref={endRef} />
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-6">
        <div className="pointer-events-auto mx-auto max-w-2xl px-6 pb-5">
          <Composer
            value={input}
            onValueChange={setInput}
            onSend={send}
            placeholder={flow ? 'Ou responda diretamente…' : 'Escreva uma mensagem…'}
            autoFocus
          />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            A Loomi organiza o seu feedback — você acompanha cada etapa por aqui.
          </p>
        </div>
      </div>
    </main>
  )
}

// Envoltório com avatar para qualquer turno da IA (texto, pergunta ou resultado).
function AssistantTurn({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 motion-safe:animate-fade-up motion-reduce:animate-none">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[var(--color-brand-lilac)]">
        <Sparkles className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex justify-end motion-safe:animate-fade-up motion-reduce:animate-none">
      <div className="max-w-[80%] rounded-2xl bg-foreground/[0.05] px-4 py-2.5 text-[0.95rem] leading-relaxed text-foreground">
        {text}
      </div>
    </div>
  )
}

function AssistantMessage({ text }: { text: string }) {
  function copy() {
    navigator.clipboard?.writeText(text)
  }

  return (
    <AssistantTurn>
      <p className="whitespace-pre-wrap pt-0.5 text-[0.95rem] leading-relaxed text-foreground">
        {text}
      </p>
      <div className="mt-2 flex items-center gap-1 text-muted-foreground">
        <ActionButton icon={ThumbsUp} label="Resposta útil" />
        <ActionButton icon={ThumbsDown} label="Resposta não útil" />
        <ActionButton icon={RotateCcw} label="Refazer resposta" />
        <ActionButton icon={Copy} label="Copiar resposta" onClick={copy} />
      </div>
    </AssistantTurn>
  )
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
    >
      <Icon className="size-4" aria-hidden />
    </button>
  )
}

function TypingIndicator() {
  return (
    <AssistantTurn>
      <span
        className="flex items-center gap-1 pt-2"
        role="status"
        aria-label="A Loomi está organizando seu feedback"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2 rounded-full bg-muted-foreground/50 motion-safe:animate-pulse motion-reduce:animate-none"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </span>
    </AssistantTurn>
  )
}
