# Próximos passos — Back-end Grupo 2 (INTELIGÊNCIA ⭐)

> **Contexto:** Hacka interno Loomi · Client Portal · 2026-06-19
> **Responsável:** Lucas (Back) — Grupo 2
> **Stack:** NestJS 11 · Prisma · SQLite
> **IA:** mockada (keyword matching determinístico — sem LLM real)

---

## O que já foi feito

- [x] Schema Prisma com 5 entidades: `Project`, `Task`, `Feedback`, `FeedbackTriage`, `Ticket`
- [x] Migration `20260619143925_add_portal_entities` aplicada
- [x] Todos os relacionamentos, FKs e índices definidos

---

## Fluxo de referência (Golden Path)

```
POST /feedback (cliente envia texto)
        ↓
  [Triage mock síncrona]
  categoria + urgência + prioridade + dono sugerido + match de task
        ↓
  Feedback.status = ANALYZING
        ↓
  PATCH /feedback/:id/decision (humano decide)
  ├── approved: true  → cria/linka Ticket + Feedback.status = APPROVED
  └── approved: false → Feedback.status = REJECTED
        ↓
  PATCH /feedback/:id/resolve → Feedback.status = RESOLVED
```

---

## Próximos passos (em ordem de prioridade)

### 1. Seed de dados para a demo

**Arquivo:** `prisma/seed.ts`

Criar 1 projeto do setor energia com:
- 1 `User` cliente (email/senha conhecidos para login na demo)
- 1 `Project` — `{ name: "Portal Energia X", sector: "energia", phase: "build", health: "ATTENTION" }`
- 4–5 `Task` com status `IN_PROGRESS` — exemplos realistas para o match da IA funcionar na demo:
  - "Refatorar dashboard de consumo mensal" (type: feature, assignedTo: developer)
  - "Redesign do relatório de picos de demanda" (type: design, assignedTo: designer)
  - "Corrigir cálculo de fator de potência" (type: bug, assignedTo: developer)
  - "Nova tela de alertas de falha de equipamento" (type: feature, assignedTo: po)

Isso é o que permite o `matchedTaskId` da triagem apontar para algo real na demo.

---

### 2. Módulo `feedback` — o core da entrega

**Caminho:** `src/modules/feedback/`

#### 2.1 `POST /feedback` — endpoint principal ⭐

Recebe `{ projectId, content }` do cliente autenticado.

Fluxo interno:
1. Cria `Feedback` com `status = RECEIVED`
2. Roda a **triage mock** (ver item 3)
3. Atualiza `Feedback.status = ANALYZING`
4. Retorna feedback com triage embutida

#### 2.2 `GET /feedback/:id`

Retorna o feedback com `triage` e `ticket` incluídos (status visível ao cliente).

#### 2.3 `GET /feedback?projectId=X`

Lista todos os feedbacks do projeto — view interna para o humano que vai decidir.

Filtros opcionais: `?status=ANALYZING` para mostrar só os que aguardam decisão.

#### 2.4 `PATCH /feedback/:id/decision`

Body: `{ approved: boolean, reason?: string }`

Lógica:
- Se `approved: true`:
  - Busca `FeedbackTriage.matchedTaskId`
  - Se existe → cria `Ticket` linkando ao match
  - Se não existe → cria `Task` nova com dados da triagem → cria `Ticket` linkando à task nova
  - `Feedback.status = APPROVED`
- Se `approved: false`:
  - `reason` é obrigatório
  - Cria `Ticket` com `decision = REJECTED`
  - `Feedback.status = REJECTED`

#### 2.5 `PATCH /feedback/:id/resolve`

Muda `Feedback.status = RESOLVED`. Fecha o loop — o Ítalo (mobile) consome esse status para o push.

---

### 3. Serviço de triage mock

**Arquivo:** `src/modules/feedback/triage.service.ts`

Lógica determinística por keyword matching — deve parecer inteligente na demo:

```
categoria:
  palavras: "dashboard", "relatório", "tela", "interface" → "feature"
  palavras: "erro", "bug", "falha", "quebrou", "incorreto" → "bug"
  palavras: "design", "visual", "layout", "cor", "ícone"  → "design"
  padrão                                                   → "question"

urgência:
  palavras: "urgente", "crítico", "parado", "bloqueio", "não funciona" → "CRITICAL"
  palavras: "importante", "preciso logo", "rápido"                     → "HIGH"
  palavras: "quando puder", "sugestão", "ideia"                        → "LOW"
  padrão                                                               → "MEDIUM"

prioridade (int 1–5):
  CRITICAL → 5 | HIGH → 4 | MEDIUM → 3 | LOW → 1

dono sugerido:
  category=design  → "designer"
  category=feature → "po"
  category=bug     → "developer"
  category=question → "pm"

match com task existente:
  Busca Tasks com status IN_PROGRESS do mesmo projeto
  Tokeniza content do feedback e title+description de cada task
  Conta interseção de palavras (≥ 3 tokens em comum = match)
  Retorna a task com maior score, ou null se nenhuma passa o threshold
```

`triageReason` deve ser um texto legível gerado deterministicamente para a demo, ex:
> "Feedback categorizado como bug de alta urgência. Encontrei match com a task 'Corrigir cálculo de fator de potência' — 4 termos em comum. Dono sugerido: developer."

---

### 4. Módulo `projects` — consumido pelos outros grupos

**Caminho:** `src/modules/projects/`

Endpoints mínimos:

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/projects` | Lista projetos do usuário autenticado |
| `GET` | `/projects/:id` | Detalhes + health (consumido pelo Grupo 1) |
| `POST` | `/projects` | Criação (admin/seed only) |

---

### 5. Módulo `tasks` — expõe tasks para outros grupos

**Caminho:** `src/modules/tasks/`

Endpoints mínimos:

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/tasks?projectId=X` | Lista tasks do projeto (Grupo 3 consome para exibir status) |
| `GET` | `/tasks/:id` | Detalhe de uma task |

---

### 6. Swagger / documentação dos endpoints

Depois que os módulos existirem, rodar `/back-swagger-docs` para anotar todos os controllers com `@ApiTags`, `@ApiOperation`, `@ApiOkResponse` e os DTOs com `@ApiProperty`.

A UI do Swagger fica em `http://localhost:3001/docs` e é o que os outros grupos usam para integrar.

---

## Dependências entre grupos

| Quem precisa | O que precisa do Lucas | Endpoint |
|---|---|---|
| Carol (UI feedback) | Saber o shape do retorno do POST /feedback | `POST /feedback` + response DTO |
| Ítalo (mobile status) | Status do feedback em tempo real | `GET /feedback/:id` |
| Grupo 1 (home executiva) | Health e phase do projeto | `GET /projects/:id` |
| Grupo 3 (adaptação) | Tasks com status | `GET /tasks?projectId=X` |

---

## Ordem de ataque sugerida (hacka)

```
1. Seed (30 min)        → base para testar tudo localmente
2. POST /feedback       → coração da demo, prioridade máxima
3. GET /feedback/:id    → cliente vê o retorno
4. PATCH /decision      → humano fecha o loop
5. GET /projects/:id    → desbloqueia Grupo 1
6. GET /tasks           → desbloqueia Grupo 3
7. PATCH /resolve       → fecha o loop completo
8. Swagger              → todos integram sem perguntar
```
