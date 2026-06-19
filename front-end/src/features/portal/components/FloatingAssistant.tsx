'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mic, Send, Sparkles, X } from 'lucide-react'

import { cn } from '@/lib/utils'

interface Message {
  id: number
  role: 'user' | 'assistant'
  text: string
}

const SUGGESTIONS = [
  'Qual o status geral?',
  'Quando é a próxima entrega?',
  'O que está travando?',
  'O que precisa de mim?',
]

/**
 * Respostas fictícias derivadas dos dados do projeto — apenas para demonstração.
 * Em produção isto conversaria com o serviço de IA (núcleo do Grupo 2).
 */
function answerFor(question: string): string {
  const q = question.toLowerCase()

  if (/(status|geral|sa[úu]de|como.*projeto|como.*vai)/.test(q)) {
    return 'O projeto está em atenção, mas dentro do prazo — conclusão prevista para 12 de set. O único ponto aberto é a aprovação dos textos da central.'
  }
  if (/(pr[óo]xim|entrega|quando)/.test(q)) {
    return 'A próxima entrega é o ambiente de demonstração, em cerca de 6 dias (previsão 25 jun).'
  }
  if (/(trav|bloqueio|impedi|atras|risco|problema)/.test(q)) {
    return 'Nada está bloqueado. O ponto de atenção é a aprovação dos textos — sem ela, os testes com clientes não começam no prazo.'
  }
  if (/(preciso|precisa de mim|fazer|aprov|depende|de mim)/.test(q)) {
    return 'Precisamos da sua aprovação dos textos da central. A proposta foi enviada há 4 dias; ao aprovar, liberamos os testes com clientes.'
  }
  if (/(prazo|conclus|fim|termin|entreg.*final|lan[çc])/.test(q)) {
    return 'A conclusão está prevista para 12 de set, dentro do prazo combinado. O lançamento inclui o treinamento da sua equipe.'
  }
  if (/(custo|or[çc]amento|valor|investi)/.test(q)) {
    return 'O projeto segue dentro do orçamento aprovado. Posso detalhar por etapa, se quiser.'
  }
  return 'Posso falar sobre o status, a próxima entrega, prazos, o que está em andamento e o que depende de você. Sobre o que você quer saber?'
}

let nextId = 1
const newId = () => nextId++

function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: newId(),
      role: 'assistant',
      text: 'Olá! Pergunte qualquer coisa sobre o andamento da Nova Central de Atendimento.',
    },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  function ask(question: string) {
    const trimmed = question.trim()
    if (!trimmed || thinking) return

    setMessages((prev) => [...prev, { id: newId(), role: 'user', text: trimmed }])
    setInput('')
    setThinking(true)

    const answer = answerFor(trimmed)
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { id: newId(), role: 'assistant', text: answer }])
      setThinking(false)
    }, 650)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="flex w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card"
    >
      {/* Cabeçalho */}
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
        <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary">
          <Sparkles className="size-4" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-medium text-foreground">Pergunte sobre o projeto</p>
          <p className="loomi-caption">IA · demonstração</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar assistente"
          className="ml-auto grid size-7 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Histórico */}
      <div ref={scrollRef} className="max-h-72 space-y-3 overflow-y-auto px-4 py-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
                message.role === 'user'
                  ? 'rounded-br-sm bg-primary text-primary-foreground'
                  : 'rounded-bl-sm bg-muted text-foreground',
              )}
            >
              {message.text}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sugestões */}
      <div className="flex flex-wrap gap-1.5 px-4 pb-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => ask(suggestion)}
            disabled={thinking}
            className="rounded-full border border-border bg-card px-2.5 py-1 text-[0.7rem] text-foreground transition hover:bg-muted disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Entrada com ícone de áudio (decorativo) e enviar */}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          ask(input)
        }}
        className="flex items-center gap-1.5 border-t border-border/60 p-3"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Pergunte sobre o projeto"
          aria-label="Sua pergunta sobre o projeto"
          disabled={thinking}
          className="min-w-0 flex-1 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 disabled:opacity-50"
        />
        <button
          type="button"
          aria-label="Enviar áudio"
          title="Enviar áudio"
          className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <Mic className="size-4" />
        </button>
        <button
          type="submit"
          aria-label="Enviar pergunta"
          disabled={thinking || !input.trim()}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40"
        >
          <Send className="size-4" />
        </button>
      </form>
    </motion.div>
  )
}

/** Assistente de IA flutuante — pílula no canto que abre o chat do projeto. */
export function FloatingAssistant() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>{open && <ChatPanel onClose={() => setOpen(false)} />}</AnimatePresence>

      {!open && (
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2.5 rounded-full bg-primary py-3 pr-5 pl-4 text-primary-foreground transition hover:-translate-y-px hover:bg-[#6A32E0]"
        >
          <Sparkles className="size-5" />
          <span className="text-sm font-medium">Pergunte sobre o projeto</span>
        </motion.button>
      )}
    </div>
  )
}
