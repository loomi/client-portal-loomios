# Grupo 3 — Confiança & Adaptação

Documentação do trabalho do Grupo 3 (Renan): a **base de design Loomi** e as
**telas de adaptação linguística + bloqueio**. Tudo roda 100% local, em cima do
design system, com dados mockados (sem back-end).

---

## 1. Base de Design System (Loomi → shadcn)

A identidade da Loomi (`design.md`) foi materializada no front-end para o time
construir telas em cima de tokens consistentes.

- **Fonte:** Sora (única, em todo o app)
- **Tokens** (`front-end/src/styles/globals.css`):
  - Marca: `bg-brand-purple` `#7B3FFF`, `bg-brand-pink` `#FF2D87`,
    `bg-brand-lilac`, `bg-brand-dark`
  - Grounds: `bg-canvas` / `bg-page` / `bg-surface`
  - Estados: `bg-state-ok` (verde) / `bg-state-attention` / `bg-state-blocked`
  - Tipografia: classes `loomi-display`, `loomi-h1/h2/h3`, `loomi-body`,
    `loomi-label`, `loomi-caption`
- **Componentes shadcn** re-estilizados: `Button` (pill, label-caps, variantes
  `default/purple/pink/outline/ghost/link`), `Badge`
  (`purple/pink/neutral/outline/ok/attention/blocked`), `Card`, `Input`
- **Vitrine viva:** rota **`/design-system`** — paleta, tipografia e componentes

> Regra do time: construir em cima dos tokens, **nunca cravar hex na mão**.

---

## 2. Adaptação linguística — a decisão de produto

A ideia inicial era adaptar a copy por **cargo × setor**. Mudamos o eixo:

- **Cargo é um proxy fraco** para letramento técnico (um diretor pode saber mais
  ou menos termos técnicos que outro).
- O eixo passou a ser o **nível de familiaridade técnica**: **Negócio** × **Técnico**.
- **A Loomi atribui o perfil manualmente** (humano no loop) — nada é adivinhado
  por algoritmo; ninguém é tratado de forma genérica. É o que materializa o
  pilar de **Confiança**.

### Guard-rail inegociável

A familiaridade muda **as palavras, nunca os fatos**. Um problema aparece para
os dois perfis — só a linguagem se ajusta. (Protege o pilar de transparência:
nada de esconder bloqueio de quem é "menos técnico".)

---

## 3. As telas

| Rota | O que é |
|------|---------|
| **`/grupo3/loomi`** | Painel da Loomi: atribui o perfil de comunicação de cada cliente (o momento de Confiança) |
| **`/grupo3/portal`** | Portal do cliente: jornada + health + bloqueios, tudo na língua atribuída, com "pré-visualizar como" |

O perfil é **estado compartilhado** entre as duas telas (React Context +
`localStorage`): atribuir no painel reflete no portal — prova que o sistema é
coerente.

### Componente de bloqueio (`BlockerCard`)

- **Externo** (a bola está com o cliente): mais direto, com **rastro de
  tentativas** (timeline de contatos sem retorno).
- **Interno**: disclosure honesto, enquadrado como a Loomi tratando, sem expor
  vulnerabilidade.

---

## 4. Roteiro de demo

1. Abra **`/grupo3/loomi`**.
2. Troque o perfil da **Helios Energia** entre *Negócio* e *Técnico*.
3. Clique em **"Ver portal do cliente"** → abre na língua atribuída.
4. No portal, use o **"pré-visualizar como"** para morfar a copy ao vivo.
5. Compare os **dois cards de bloqueio** nos dois perfis — o problema continua
   visível, só a linguagem muda.

> Trilho comum da demo: projeto-exemplo do setor **energia** (Helios Energia —
> Plataforma de Medição Inteligente, Subestação Norte).

---

## 5. Mapa de arquivos

```
front-end/src/
├── app/
│   ├── design-system/page.tsx           # vitrine do design system
│   └── grupo3/
│       ├── layout.tsx                    # provider de perfil + nav
│       ├── loomi/page.tsx                # painel de atribuição (Loomi)
│       └── portal/page.tsx               # portal do cliente (cliente)
├── features/adaptacao/
│   ├── content.ts                        # "um fato, duas vozes" (mock)
│   ├── profile-context.tsx               # estado compartilhado do perfil
│   └── components/
│       ├── ProfileToggle.tsx             # controle segmentado Negócio/Técnico
│       ├── JourneyTimeline.tsx           # timeline da jornada
│       └── BlockerCard.tsx               # bloqueio interno/externo + rastro
└── styles/globals.css                    # tokens Loomi
```

## 6. Como reusar / estender

- Mais conteúdo adaptável? Edite `features/adaptacao/content.ts` — todo bloco é
  um `Voiced` (`{ negocio, tecnico }`).
- Outro setor? Hoje a demo fixa energia; o modelo já separa "dicionário do
  setor" do "nível de familiaridade".
- Integrar ao `/portal` real (Grupo 1) no futuro: o motor de copy e o
  `BlockerCard` são independentes de rota e plugáveis.
