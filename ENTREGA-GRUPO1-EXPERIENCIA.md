# Entrega — Grupo 1 · Experiência (Client Portal)

> Hacka interno Loomi · branch `equipe-1-experiencia`
> Responsável pela entrega documentada aqui: **Laura (UI via Claude Code)**

---

## 1. Contexto do desafio

Hoje o cliente recebe update via call ou Slack — nada visível, nada mensurável.
A proposta é uma **plataforma client-facing** com visão executiva, jornada,
materiais e métricas, que torna a Loomi uma parceira mais transparente e cria um
**moat competitivo**.

O **Grupo 1 — EXPERIÊNCIA** é "a vitrine viva": prova que o cliente abre o portal
e entende **jornada + saúde (health) + métricas** em segundos, na linguagem do
negócio dele (sem jargão). Projeto-exemplo do Golden Path: cliente do setor de
**energia** (Volt Energia · "Nova Central de Atendimento Digital").

### Tarefa original (Laura)

- [x] Gerar a **Home executiva**: jornada visível + health (3 estados:
      verde/atenção/impeditivo) + métricas-chave.
- [x] Garantir **copy executiva, sem jargão**.

Ao longo das iterações o escopo evoluiu (a pedido do time/produto) para incluir
jornada interativa, assistente de IA, adaptação por persona e alinhamento total
ao design system Loomi.

---

## 2. Como visualizar

```bash
cd front-end
npm install      # se ainda não instalou
npm run dev
```

Abra **http://localhost:3000/portal** (rota pública, sem login, com dados de
exemplo). O código vive em `src/features/portal/` e a rota em
`src/app/portal/page.tsx`.

---

## 3. Funcionalidades construídas

### 3.1 Cabeçalho de contexto + seletor de cargo
**Arquivo:** `src/features/portal/components/ContextBar.tsx`

- Marca Loomi (logomark + wordmark), título do projeto e cliente/setor.
- **Seletor de cargo** (dropdown): troca a "lente" pela qual o cliente vê o
  portal — Diretora de Operações, Gerente de Atendimento, Analista de
  Experiência, Patrocinador (C-level). Gancho da **adaptação linguística por
  persona** (eixo do Grupo 3).
- "Atualizado hoje · 19 jun" alinhado à extrema direita, na linha do
  cliente/setor.

### 3.2 Resumo executivo (topo consolidado)
**Arquivo:** `src/features/portal/components/ExecutiveSummary.tsx`

- **Seção principal (acionável):** o único ponto que depende do cliente —
  rótulo "Pendente com você", assunto ("Aprovação dos textos da central"),
  descrição do que fazer e CTA roxo. Ícone de alerta em **lilás**.
- **Card de saúde (roxo):** status do projeto em termo de saúde
  (Saudável / Requer atenção / Crítico), com ícone **ⓘ** que revela no hover/foco
  a **legenda dos 3 estados**. Substituiu a antiga "régua" de saúde.
- **Métricas-chave:** Progresso geral, Etapas concluídas, Próxima entrega e
  Conclusão prevista — cada uma em seu **próprio card**, alinhadas ao mesmo
  ritmo vertical do card de saúde.

### 3.3 Jornada do projeto — Master-Detail interativo
**Arquivo:** `src/features/portal/components/JourneyTimeline.tsx`

- **Menu (esquerda):** timeline vertical clássica como **menu de abas**. Cada
  ponto é um **épico** com status, contagem de tarefas e data
  (concluída/prevista). A etapa selecionada herda a **cor do health** da fase.
- **Detalhe (direita):** renderiza dinamicamente a etapa selecionada (abre na
  etapa atual). Mostra:
  - **Tarefas** com status (Concluído / Em andamento / **Bloqueado** / Pendente),
    **responsável** e expansão por tarefa (descrição + prazo).
  - **Barra de progresso** de tarefas do épico.
  - **Próximos passos** da etapa.
  - **Materiais** entregues com tipo (Documento/Protótipo/Vídeo/Ambiente) e data
    de entrega.

### 3.4 Sistema de saúde (3 estados)
**Arquivo:** `src/features/portal/health.tsx`

- Fonte única de verdade para verde / atenção / impeditivo, mapeada aos tokens
  de estado do design system (`state-ok` / `state-attention` / `state-blocked`).
- `HealthBadge` (pill + label-caps) usado na jornada; termos, legendas e cores
  derivam daqui.

### 3.5 Assistente de IA flutuante (fictício)
**Arquivo:** `src/features/portal/components/FloatingAssistant.tsx`

- Pílula flutuante "Pergunte sobre o projeto" que abre um chat.
- Bolhas de conversa, indicador de digitação, perguntas sugeridas e respostas
  **derivadas dos dados do projeto** (status, próxima entrega, bloqueios, o que
  precisa do cliente).
- Campo com **ícone de áudio** (decorativo, evidencia envio por voz) + enviar.
- Mock client-side para demo — em produção conversaria com o motor de IA do
  Grupo 2 (triagem), fechando o golden path.

### 3.6 Dados de exemplo
**Arquivo:** `src/features/portal/data.ts`

- Projeto-exemplo do setor de energia, com épicos, tarefas (descrição/prazo/
  responsável), métricas, materiais e próximos passos. Sem back-end — a tela
  roda 100% com mock para a demo.

---

## 4. Alinhamento ao Design System (design.md — Loomi Light V.2.0)

O portal foi corrigido para seguir o `design.md` do projeto:

- **Fundação adotada da `main`** (que já integrou o design.md): `globals.css`
  (tokens, cores, camadas), `app/layout.tsx` (fonte **Sora**) e os primitivos
  `Button`, `badge`, `card`, `Input`.
- **Cores:** roxo `#7B3FFF`, pink, lilás; camadas de fundo
  (`#F4F4F5` canvas → `#FAFAFA` → branco); tokens de estado para health.
- **Tipografia:** Sora ExtraLight/Light — **nunca bold**; hierarquia por escala
  e cor; rótulos em **label-caps** (uppercase, tracking).
- **Elevação:** **sem `box-shadow`** — profundidade por camadas de fundo +
  bordas 1px; glow radial (`.loomi-glow`) decorativo no topo.
- **Formas:** pílulas em botões/badges; cards com raio 12px.

---

## 5. Correção de infraestrutura (fora do portal)

- **`make verify` funcionava só na raiz.** O Stop hook (`make verify`) falhava
  quando executado de um subdiretório. Adicionei um alvo `verify` em
  `front-end/Makefile` e `back-end/Makefile` que **delega para a raiz**, tornando
  o hook resiliente a qualquer cwd.
- **`claude-guide/team/page.tsx`:** ajuste de `Badge variant="secondary"` →
  `neutral` (variante removida no novo badge do design system).

---

## 6. Inventário de arquivos

### Novos (portal)
| Arquivo | Papel |
|---|---|
| `front-end/src/app/portal/page.tsx` | Rota pública `/portal` — compõe a Home executiva |
| `front-end/src/features/portal/data.ts` | Dados-mock do projeto de energia |
| `front-end/src/features/portal/health.tsx` | Sistema de saúde (3 estados) |
| `front-end/src/features/portal/components/ContextBar.tsx` | Cabeçalho + seletor de cargo |
| `front-end/src/features/portal/components/ExecutiveSummary.tsx` | Topo: ação + saúde + métricas |
| `front-end/src/features/portal/components/JourneyTimeline.tsx` | Jornada master-detail |
| `front-end/src/features/portal/components/FloatingAssistant.tsx` | Assistente de IA flutuante |

### Modificados
| Arquivo | Motivo |
|---|---|
| `front-end/src/styles/globals.css` | Tokens do design system Loomi |
| `front-end/src/app/layout.tsx` | Fonte Sora |
| `front-end/src/components/ui/{Button,badge,card,Input}.tsx` | Primitivos do design system |
| `front-end/src/app/claude-guide/team/page.tsx` | Ajuste de variante de badge |
| `front-end/README.md` | Documentação da rota `/portal` |
| `back-end/Makefile`, `front-end/Makefile` | Alvo `verify` delegando à raiz |

---

## 7. Verificação

- `npm run typecheck` ✅
- `npm run lint` ✅
- `GET /portal` → **200** (renderiza todas as seções)

---

## 8. Pendência conhecida (para o time)

A `main` tem arquivos com o **mesmo caminho** que os do portal (ex.:
`features/portal/JourneyTimeline.tsx`, `app/portal/page.tsx`, `mock.ts`/
`types.ts`). Quando a `main` for mergeada nesta branch **haverá conflito** —
vale alinhar qual estrutura vira a oficial (a `mock.ts`/`types.ts` da main ou a
`data.ts` desta branch). As informações da jornada construídas na main
(próximos passos, materiais com tipo/data) já foram incorporadas ao layout.
