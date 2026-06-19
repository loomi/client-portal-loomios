import { AlertTriangle, Mail, Phone, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Blocker, ContactAttempt, Profile } from '../content'

function AttemptRow({ attempt }: { attempt: ContactAttempt }) {
  const Icon = attempt.channel === 'E-mail' ? Mail : Phone
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-border bg-surface text-foreground/50">
        <Icon className="size-3" />
      </span>
      <div className="min-w-0">
        <p className="loomi-body-sm">
          <span className="text-foreground">{attempt.channel}</span>
          <span className="text-muted-foreground"> · {attempt.date}</span>
        </p>
        <p className="loomi-body-sm text-muted-foreground">{attempt.note}</p>
      </div>
    </li>
  )
}

export function BlockerCard({
  blocker,
  profile,
}: {
  blocker: Blocker
  profile: Profile
}) {
  const isExternal = blocker.kind === 'externo'

  // Externo = ação do cliente (mais direto, com rastro). Interno = Loomi tratando
  // com responsabilidade, sem expor vulnerabilidade — disclosure honesto.
  const accent = isExternal ? 'border-state-blocked/30' : 'border-state-attention/30'
  const Icon = isExternal ? AlertTriangle : ShieldCheck
  const iconTone = isExternal ? 'text-state-blocked' : 'text-state-attention'

  return (
    <div className={cn('rounded-xl border bg-card p-6', accent)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={cn('grid size-9 shrink-0 place-items-center rounded-full bg-foreground/[0.04]', iconTone)}>
            <Icon className="size-4" />
          </span>
          <Badge variant={isExternal ? 'blocked' : 'attention'}>
            {isExternal ? 'Bloqueio externo' : 'Bloqueio interno'}
          </Badge>
        </div>
        <span className="loomi-caption pt-2">Criticidade {blocker.severity}</span>
      </div>

      <h3 className="loomi-h3 mt-4">{blocker.title[profile]}</h3>
      <p className="loomi-body mt-2 text-muted-foreground">{blocker.body[profile]}</p>

      {isExternal && blocker.attempts && blocker.attempts.length > 0 && (
        <div className="mt-5 border-t border-border pt-5">
          <p className="loomi-label text-foreground/70">
            Rastro de tentativas · {blocker.attempts.length}
          </p>
          <ul className="mt-4 space-y-3">
            {blocker.attempts.map((attempt, i) => (
              <AttemptRow key={i} attempt={attempt} />
            ))}
          </ul>
          <p className="loomi-body-sm mt-4 text-muted-foreground">
            Seguimos buscando o retorno. Assim que recebermos, esta etapa é retomada.
          </p>
        </div>
      )}

      {!isExternal && blocker.owner && (
        <div className="mt-5 flex items-center gap-2 border-t border-border pt-5">
          <span className="loomi-label text-foreground/70">Em tratamento por</span>
          <Badge variant="neutral">{blocker.owner}</Badge>
        </div>
      )}
    </div>
  )
}
