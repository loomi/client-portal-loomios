import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

export const metadata: Metadata = {
  title: 'Design System · Loomi',
  description: 'Base de design da Loomi — tokens e componentes para o time construir telas',
}

/* ── Small presentational helpers (local to this page) ───────────── */

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="border-t border-border py-16">
      <p className="loomi-label text-brand-purple">{eyebrow}</p>
      <h2 className="loomi-h2 mt-3">{title}</h2>
      {description ? (
        <p className="loomi-body mt-3 max-w-2xl text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-10">{children}</div>
    </section>
  )
}

function Swatch({ name, hex, className }: { name: string; hex: string; className: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`h-20 rounded-lg border border-border ${className}`} />
      <div>
        <p className="loomi-body-sm font-normal">{name}</p>
        <p className="font-mono text-xs text-muted-foreground">{hex}</p>
      </div>
    </div>
  )
}

function TypeRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-b border-border py-6 last:border-0 md:flex-row md:items-baseline md:gap-8">
      <span className="loomi-caption w-28 shrink-0 pt-2">{label}</span>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

export default function DesignSystemPage() {
  return (
    <main className="loomi-glow min-h-screen">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        {/* ── Header ── */}
        <header className="animate-fade-up py-20">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full border border-foreground/15 text-lg">
              ○
            </span>
            <span className="loomi-label">Loomi</span>
          </div>
          <h1 className="loomi-display mt-10">Design System</h1>
          <p className="loomi-body mt-6 max-w-2xl text-muted-foreground">
            A base visual do Client Portal. Tokens, tipografia e componentes prontos —
            construa telas em cima daqui e tudo nasce consistente. Light-first, fonte
            Sora, profundidade por luz (nunca sombra).
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Badge variant="purple">V.2.0</Badge>
            <Badge variant="neutral">Light-first</Badge>
            <Badge variant="neutral">Sora</Badge>
            <Badge variant="neutral">shadcn · base-nova</Badge>
          </div>
        </header>

        {/* ── Colors ── */}
        <Section
          id="cores"
          eyebrow="Tokens"
          title="Cores"
          description="Sinais de marca aparecem onde há significado — estado ou hierarquia, nunca decoração. Os grounds vão de claro a mais claro; a camada mais branca é a mais elevada."
        >
          <div className="space-y-10">
            <div>
              <p className="loomi-caption mb-4">Marca</p>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5">
                <Swatch name="Purple" hex="#7B3FFF" className="bg-brand-purple" />
                <Swatch name="Pink" hex="#FF2D87" className="bg-brand-pink" />
                <Swatch name="Lilac" hex="#8B3FE0" className="bg-brand-lilac" />
                <Swatch name="Lilac soft" hex="#C47EFF" className="bg-brand-lilac-soft" />
                <Swatch name="Dark" hex="#131313" className="bg-brand-dark" />
              </div>
            </div>
            <div>
              <p className="loomi-caption mb-4">Grounds</p>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                <Swatch name="Canvas" hex="#F4F4F5" className="bg-canvas" />
                <Swatch name="Page" hex="#FAFAFA" className="bg-page" />
                <Swatch name="Surface" hex="#FFFFFF" className="bg-surface" />
              </div>
            </div>
            <div>
              <p className="loomi-caption mb-4">Estados (jornada / health)</p>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                <Swatch name="OK · verde" hex="#1FAA6B" className="bg-state-ok" />
                <Swatch name="Atenção" hex="#E0982E" className="bg-state-attention" />
                <Swatch name="Impeditivo" hex="#E5484D" className="bg-state-blocked" />
              </div>
            </div>
          </div>
        </Section>

        {/* ── Typography ── */}
        <Section
          id="tipografia"
          eyebrow="Tokens"
          title="Tipografia"
          description="Sora em toda escala. ExtraLight e Light para títulos (grandes e silenciosos); label-caps maiúsculo e espaçado é a voz da interface. Nunca Bold."
        >
          <div>
            <TypeRow label="Display">
              <p className="loomi-display">Sem parar</p>
            </TypeRow>
            <TypeRow label="H1">
              <p className="loomi-h1">Portal transparente</p>
            </TypeRow>
            <TypeRow label="H2">
              <p className="loomi-h2">Jornada e health do projeto</p>
            </TypeRow>
            <TypeRow label="H3">
              <p className="loomi-h3">Co-criação inteligente</p>
            </TypeRow>
            <TypeRow label="Body MD">
              <p className="loomi-body max-w-xl">
                O portal é o espaço vivo do projeto. O cliente dá feedback e acompanha o
                andamento no mesmo lugar — com a sensação de que constrói junto.
              </p>
            </TypeRow>
            <TypeRow label="Body SM">
              <p className="loomi-body-sm max-w-xl text-muted-foreground">
                Texto de apoio, legendas e descrições secundárias.
              </p>
            </TypeRow>
            <TypeRow label="Label caps">
              <p className="loomi-label">Navegação · Botões · Badges</p>
            </TypeRow>
            <TypeRow label="Caption">
              <p className="loomi-caption">Atualizado 19 jun 2026 · V.2.0</p>
            </TypeRow>
          </div>
        </Section>

        {/* ── Buttons ── */}
        <Section
          id="botoes"
          eyebrow="Componentes"
          title="Botões"
          description="Pill, label-caps. A ação primária na luz é o preto (maior contraste); roxo e rosa são variantes de marca. Hover sobe 1px — sem sombra."
        >
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-4">
              <Button>Primário</Button>
              <Button variant="purple">Roxo</Button>
              <Button variant="pink">Rosa</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link de texto</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
        </Section>

        {/* ── Badges ── */}
        <Section
          id="badges"
          eyebrow="Componentes"
          title="Badges"
          description="Fill translúcido + borda do acento + texto sólido. Use para status, categorias e tags."
        >
          <div className="flex flex-wrap gap-3">
            <Badge variant="purple">Roxo</Badge>
            <Badge variant="pink">Rosa</Badge>
            <Badge variant="neutral">Neutro</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="ok">No prazo</Badge>
            <Badge variant="attention">Atenção</Badge>
            <Badge variant="blocked">Impeditivo</Badge>
          </div>
        </Section>

        {/* ── Cards ── */}
        <Section
          id="cards"
          eyebrow="Componentes"
          title="Cards"
          description="Superfície branca, borda de 1px, raio 12px. Hover acende a borda em roxo e levanta 2px. Passe o mouse para ver."
        >
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Implementação SCADA</CardTitle>
                <CardDescription>Etapa atual da jornada</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <Badge variant="ok">No prazo</Badge>
                <span className="loomi-body-sm text-muted-foreground">3 de 5 marcos</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Integração de medição</CardTitle>
                <CardDescription>Aguardando dados do cliente</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="attention">Atenção</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Homologação regulatória</CardTitle>
                <CardDescription>Bloqueio externo</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="blocked">Impeditivo</Badge>
              </CardContent>
              <CardFooter>
                <span className="loomi-caption">3 tentativas de contato · última 12 jun</span>
              </CardFooter>
            </Card>
          </div>
        </Section>

        {/* ── Inputs ── */}
        <Section
          id="inputs"
          eyebrow="Componentes"
          title="Inputs"
          description="Superfície branca, borda fina, foco em roxo. Label acima em label-caps."
        >
          <div className="grid max-w-xl gap-6">
            <div className="grid gap-2">
              <Label className="loomi-label" htmlFor="ds-nome">
                Nome do projeto
              </Label>
              <Input id="ds-nome" placeholder="Ex.: Subestação Norte" />
            </div>
            <div className="grid gap-2">
              <Label className="loomi-label" htmlFor="ds-email">
                E-mail do contato
              </Label>
              <Input id="ds-email" type="email" placeholder="contato@cliente.com.br" />
            </div>
          </div>
        </Section>

        {/* ── Radius & spacing ── */}
        <Section
          id="formas"
          eyebrow="Tokens"
          title="Formas e espaçamento"
          description="Cantos arredondados em escala fixa; espaçamento sempre na base de 8px — nunca interpole."
        >
          <div className="space-y-10">
            <div>
              <p className="loomi-caption mb-4">Raio</p>
              <div className="flex flex-wrap items-end gap-6">
                {[
                  { n: 'sm · 4', c: 'rounded-sm' },
                  { n: 'md · 8', c: 'rounded-md' },
                  { n: 'lg · 12', c: 'rounded-lg' },
                  { n: 'xl · 16', c: 'rounded-xl' },
                  { n: 'pill · 100', c: 'rounded-full' },
                ].map((r) => (
                  <div key={r.n} className="flex flex-col items-center gap-2">
                    <div className={`size-16 border border-foreground/20 bg-accent ${r.c}`} />
                    <span className="font-mono text-xs text-muted-foreground">{r.n}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="loomi-caption mb-4">Espaçamento (px)</p>
              <div className="flex flex-wrap items-end gap-6">
                {[
                  { n: 'xs · 4', w: 'w-1' },
                  { n: 'sm · 8', w: 'w-2' },
                  { n: 'md · 16', w: 'w-4' },
                  { n: 'lg · 24', w: 'w-6' },
                  { n: 'xl · 40', w: 'w-10' },
                  { n: '2xl · 64', w: 'w-16' },
                ].map((s) => (
                  <div key={s.n} className="flex flex-col gap-2">
                    <div className={`h-3 rounded-sm bg-brand-purple ${s.w}`} />
                    <span className="font-mono text-xs text-muted-foreground">{s.n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <footer className="border-t border-border py-12">
          <p className="loomi-caption">
            Loomi Client Portal · Design System base · Sem parar
          </p>
        </footer>
      </div>
    </main>
  )
}
