'use client'

import { useState, type ComponentType } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  CalendarClock,
  ChevronDown,
  Circle,
  CircleCheck,
  CircleDot,
  Clock,
  Download,
  FileText,
  OctagonAlert,
  UserRound,
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import type { Epic, Material, PhaseStatus, Task, TaskStatus } from '../data'
import { project } from '../data'
import { HEALTH, HealthBadge } from '../health'

type StatusMeta = { label: string; node: string; Icon: ComponentType<{ className?: string }> }

/** Status do épico (nó da timeline). */
const STATUS: Record<PhaseStatus, StatusMeta> = {
  concluida: { label: 'Concluída', node: 'text-state-ok', Icon: CircleCheck },
  andamento: { label: 'Em andamento', node: 'text-brand-purple', Icon: CircleDot },
  ainiciar: { label: 'A iniciar', node: 'text-foreground/30', Icon: Circle },
}

/** Status de cada tarefa (inclui bloqueado). */
const TASK_STATUS: Record<TaskStatus, StatusMeta> = {
  concluida: { label: 'Concluído', node: 'text-state-ok', Icon: CircleCheck },
  andamento: { label: 'Em andamento', node: 'text-brand-purple', Icon: CircleDot },
  ainiciar: { label: 'Pendente', node: 'text-foreground/30', Icon: Circle },
  bloqueado: { label: 'Bloqueado', node: 'text-state-blocked', Icon: OctagonAlert },
}

function doneCount(tasks: Task[]) {
  return tasks.filter((t) => t.status === 'concluida').length
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })
function formatDelivered(iso?: string) {
  if (!iso) return null
  return dateFormatter.format(new Date(`${iso}T12:00:00`))
}

/* ─────────────────────────  Menu (master)  ───────────────────────── */

function TimelineMenuItem({
  epic,
  index,
  last,
  selected,
  onSelect,
}: {
  epic: Epic
  index: number
  last: boolean
  selected: boolean
  onSelect: () => void
}) {
  const status = STATUS[epic.status]
  const tone = epic.health ? HEALTH[epic.health] : null

  return (
    <li className="relative flex gap-3 pb-4 last:pb-0">
      {!last && (
        <span
          aria-hidden
          className={cn(
            'absolute top-7 bottom-0 left-[13px] w-px',
            epic.status === 'concluida' ? 'bg-state-ok' : 'bg-border',
          )}
        />
      )}
      <span className="relative z-10 grid size-7 shrink-0 place-items-center rounded-full bg-card">
        <status.Icon className={cn('size-7', status.node)} />
      </span>

      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={cn(
          'flex-1 rounded-lg border px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30',
          selected
            ? tone
              ? cn(tone.surface, tone.border)
              : 'border-brand-purple/30 bg-brand-purple/[0.06]'
            : 'border-transparent hover:bg-muted',
        )}
      >
        <span className="loomi-label block text-muted-foreground">Etapa {index + 1}</span>
        <span
          className={cn(
            'mt-1 block text-sm leading-snug font-light',
            selected && tone ? tone.text : 'text-foreground',
          )}
        >
          {epic.name}
        </span>
        <span className="mt-1 block text-[0.7rem] text-muted-foreground">
          {epic.dateShort} · {doneCount(epic.tasks)}/{epic.tasks.length} tarefas
        </span>
      </button>
    </li>
  )
}

/* ─────────────────────────  Detalhe (detail)  ───────────────────────── */

function TaskRow({ task }: { task: Task }) {
  const [open, setOpen] = useState(false)
  const status = TASK_STATUS[task.status]
  const hasDetail = Boolean(task.description || task.due)
  const isPill = task.status === 'andamento' || task.status === 'bloqueado'

  return (
    <li className="py-4">
      <div className="flex items-center gap-2.5">
        <status.Icon className={cn('size-4 shrink-0', status.node)} />
        <span
          className={cn(
            'text-sm',
            task.status === 'concluida'
              ? 'text-muted-foreground line-through decoration-foreground/30'
              : 'text-foreground',
          )}
        >
          {task.title}
        </span>
        {isPill && (
          <span
            className={cn(
              'rounded-full border px-2 py-0.5 text-[0.5625rem] font-medium tracking-[0.12em] uppercase',
              task.status === 'bloqueado'
                ? 'border-state-blocked/30 bg-state-blocked/10 text-[#C0292E]'
                : 'border-brand-purple/30 bg-brand-purple/10 text-brand-purple',
            )}
          >
            {status.label}
          </span>
        )}

        <div className="ml-auto flex items-center gap-2">
          {task.owner && (
            <span className="hidden max-w-[14rem] items-center gap-1 truncate text-xs text-muted-foreground md:inline-flex">
              <UserRound className="size-3.5 shrink-0" />
              {task.owner}
            </span>
          )}
          {hasDetail && (
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-label={open ? 'Ocultar detalhes da tarefa' : 'Ver detalhes da tarefa'}
              className="grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
            >
              <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && hasDetail && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 ml-[1.625rem] space-y-2 rounded-md bg-muted p-3 text-xs">
              {task.description && (
                <p className="leading-relaxed text-foreground/80">{task.description}</p>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                {task.due && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarClock className="size-3.5" />
                    {task.due}
                  </span>
                )}
                {task.owner && (
                  <span className="inline-flex items-center gap-1.5 md:hidden">
                    <UserRound className="size-3.5" />
                    {task.owner}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

function MaterialRow({ material }: { material: Material }) {
  const available = material.ready !== false
  const delivered = formatDelivered(material.deliveredAt)
  return (
    <li
      className={cn(
        'flex items-center gap-2 rounded-lg border px-4 py-3 text-sm',
        available ? 'border-border bg-card' : 'border-dashed border-border bg-transparent',
      )}
    >
      <FileText className="size-4 shrink-0 text-muted-foreground" />
      <span className={available ? 'text-foreground' : 'text-muted-foreground'}>{material.label}</span>
      {material.kind && (
        <span className="rounded bg-muted px-1.5 py-0.5 text-[0.625rem] tracking-[0.1em] text-muted-foreground uppercase">
          {material.kind}
        </span>
      )}
      <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
        {available ? (
          <>
            {delivered && <span>entregue {delivered}</span>}
            <Download className="size-3.5" />
          </>
        ) : (
          <span>em preparação</span>
        )}
      </span>
    </li>
  )
}

function EpicDetail({ epic }: { epic: Epic }) {
  const done = doneCount(epic.tasks)
  const total = epic.tasks.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <h3 className="text-xl leading-snug font-light text-foreground">{epic.name}</h3>
        {epic.health ? (
          <HealthBadge state={epic.health} />
        ) : (
          <span className="loomi-caption">{STATUS[epic.status].label}</span>
        )}
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          {epic.dateLabel}
        </span>
      </div>

      <p className="text-sm text-muted-foreground">{epic.summary}</p>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="loomi-label text-muted-foreground">Tarefas</span>
          <span className="text-xs tabular-nums text-foreground">
            {done} de {total} concluídas
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      <ul className="divide-y divide-border">
        {epic.tasks.map((task) => (
          <TaskRow key={task.title} task={task} />
        ))}
      </ul>

      {epic.nextSteps && epic.nextSteps.length > 0 && (
        <div className="space-y-2 rounded-xl border border-brand-purple/20 bg-brand-purple/[0.04] p-3">
          <span className="loomi-label text-brand-purple">Próximos passos</span>
          <ul className="space-y-1.5">
            {epic.nextSteps.map((step) => (
              <li key={step} className="flex items-start gap-2 text-sm text-foreground/90">
                <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-brand-purple" />
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      {epic.materials && epic.materials.length > 0 && (
        <div className="space-y-3.5 border-t border-border pt-5">
          <span className="loomi-label text-muted-foreground">Materiais</span>
          <ul className="space-y-2.5">
            {epic.materials.map((material) => (
              <MaterialRow key={material.label} material={material} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────  Master-detail  ───────────────────────── */

/** Jornada como menu interativo: timeline (master) + tarefas da etapa (detail). */
export function JourneyTimeline() {
  const { epics } = project
  const currentIndex = Math.max(
    epics.findIndex((e) => e.status === 'andamento'),
    0,
  )
  const [selected, setSelected] = useState(currentIndex)
  const epic = epics[selected]

  return (
    <section aria-label="Jornada do projeto" className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-light text-foreground">A jornada do projeto</h2>
        <span className="loomi-caption">{epics.length} etapas</span>
      </div>

      <Card>
        <CardContent className="grid gap-0 px-0 lg:grid-cols-[16rem_1fr]">
          {/* Menu timeline */}
          <nav className="border-b border-border px-4 pb-4 lg:border-r lg:border-b-0 lg:pb-0">
            <ol className="relative">
              {epics.map((item, index) => (
                <TimelineMenuItem
                  key={item.name}
                  epic={item}
                  index={index}
                  last={index === epics.length - 1}
                  selected={index === selected}
                  onSelect={() => setSelected(index)}
                />
              ))}
            </ol>
          </nav>

          {/* Detalhe da etapa selecionada */}
          <div className="px-4 pt-5 lg:px-6 lg:pt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={epic.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <EpicDetail epic={epic} />
              </motion.div>
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
