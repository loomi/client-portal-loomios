'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { PROFILE_HINT, type Profile } from '@/features/adaptacao/content'
import { useCommProfile } from '@/features/adaptacao/profile-context'
import { SegmentedProfile } from '@/features/adaptacao/components/ProfileToggle'

interface ClientRow {
  name: string
  sector: string
  contact: string
  featured?: boolean
}

const CLIENTS: ClientRow[] = [
  { name: 'Helios Energia', sector: 'Energia', contact: 'Marina Duarte · Diretora de Operações', featured: true },
  { name: 'AgroVale', sector: 'Agronegócio', contact: 'Ricardo Lima · Gerente de Inovação' },
  { name: 'Norte Logística', sector: 'Logística', contact: 'Bianca Souza · Coordenadora de Projetos' },
]

function ClientCard({
  client,
  value,
  onChange,
}: {
  client: ClientRow
  value: Profile
  onChange: (profile: Profile) => void
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-brand-purple/40">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="loomi-h3">{client.name}</h3>
            <Badge variant="purple">{client.sector}</Badge>
          </div>
          <p className="loomi-body-sm mt-1 text-muted-foreground">{client.contact}</p>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <span className="loomi-caption">Perfil de comunicação</span>
          <SegmentedProfile value={value} onChange={onChange} />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <p className="loomi-body-sm text-muted-foreground">{PROFILE_HINT[value]}</p>
        {client.featured && (
          <Button variant="link" render={<Link href="/portal" />}>
            Ver portal do cliente
            <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default function LoomiPanelPage() {
  // Cliente em foco (Helios) — ligado ao perfil compartilhado que o portal lê.
  const { profile, setProfile } = useCommProfile()
  // Demais clientes — estado local só para demonstrar o controle.
  const [others, setOthers] = useState<Record<string, Profile>>({
    AgroVale: 'tecnico',
    'Norte Logística': 'negocio',
  })

  return (
    <main className="mx-auto max-w-5xl px-6 py-14 md:px-10">
      <p className="loomi-label text-brand-purple">Painel Loomi · Confiança & Adaptação</p>
      <h1 className="loomi-h1 mt-3">Perfis de comunicação</h1>
      <p className="loomi-body mt-4 max-w-2xl text-muted-foreground">
        Quem conhece o cliente é quem define a língua dele. Aqui a Loomi atribui, à mão,
        o nível de familiaridade técnica de cada contato — nada é adivinhado por um
        algoritmo, e ninguém é tratado de forma genérica.
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-brand-purple/20 bg-brand-purple/[0.04] p-5">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-purple/10 text-brand-purple">
          <ShieldCheck className="size-4" />
        </span>
        <p className="loomi-body-sm text-foreground/80">
          O perfil muda apenas <span className="text-foreground">como</span> a informação é
          dita — nunca <span className="text-foreground">o que</span> é dito. Um problema
          aparece para todos os perfis; só a linguagem se ajusta.
        </p>
      </div>

      <div className="mt-10 space-y-4">
        {CLIENTS.map((client) => (
          <ClientCard
            key={client.name}
            client={client}
            value={client.featured ? profile : others[client.name]}
            onChange={(next) =>
              client.featured
                ? setProfile(next)
                : setOthers((prev) => ({ ...prev, [client.name]: next }))
            }
          />
        ))}
      </div>
    </main>
  )
}
