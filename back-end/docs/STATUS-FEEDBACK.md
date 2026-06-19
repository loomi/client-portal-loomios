# Status — Feature de Feedback + Triagem de IA

---

## O que já está feito

### Modelagem (Prisma)

| Modelo | Campos relevantes | Status |
|--------|------------------|--------|
| `Feedback` | `content`, `status` (RECEIVED→ANALYZING→APPROVED→REJECTED→RESOLVED), `projectId`, `clientId` | ✅ migrado |
| `FeedbackTriage` | `category`, `urgency`, `priority`, `suggestedOwner`, `matchedTaskId`, `triageReason` | ✅ migrado |
| `Ticket` | `decision` (APPROVED\|REJECTED), `reason`, `decidedBy`, `taskId` | ✅ migrado (schema pronto, sem endpoint ainda) |
| `Project` | `name`, `sector`, `phase`, `health`, `clientId` | ✅ migrado |
| `Task` | `title`, `description`, `type`, `status`, `assignedTo`, `priority` | ✅ migrado |

### Seed

- Usuário demo: `cliente@energia.com` / `Demo@1234`
- 2 projetos no setor energia (build/GREEN e design/ATTENTION)
- 7 tasks com status e tipos variados — usadas pelo match semântico da IA
- Idempotente: `npx prisma db seed`

### Módulo `feedbacks`

| Endpoint | Descrição |
|----------|-----------|
| `POST /projects/:projectId/feedbacks` | Cliente envia texto livre → nasce com `status: RECEIVED` |
| `GET /projects/:projectId/feedbacks` | Lista paginada, filtrável por `?status=`, inclui triagem aninhada |
| `GET /projects/:projectId/feedbacks/:feedbackId` | Detalhe completo com triagem + ticket |

- Autorização por `clientId`: cliente só acessa projetos e feedbacks próprios
- Validação: `content` entre 10 e 2000 caracteres

### Módulo `triage` — provider de IA (mock)

| Endpoint | Descrição |
|----------|-----------|
| `POST /feedbacks/:feedbackId/triage` | Executa a triagem → cria `FeedbackTriage`, muda status para `ANALYZING` |
| `GET /feedbacks/:feedbackId/triage` | Consulta resultado de triagem existente |

**O que o `AiTriageProvider` entrega:**

| Campo | Lógica |
|-------|--------|
| `category` | Detecção por keywords: design → bug → question → feature |
| `urgency` | Detecção por keywords: CRITICAL → HIGH → LOW → MEDIUM |
| `priority` | Matriz urgency × category, escala 1–5 |
| `suggestedOwner` | bug→developer, feature→po, design→designer, question→pm |
| `matchedTaskId` | Similaridade de Jaccard (tokens ≥ 4 chars) sobre tasks não-DONE do projeto, threshold 0.15 |
| `triageReason` | Texto em português explicando a classificação e o match |

- Interface `AiTriageInput → AiTriageOutput` desacoplada: para trocar pelo Claude API real basta substituir a implementação do provider
- 409 se o feedback já foi triado; 404 se não existe

### Documentação e testes

- `back-end/docs/testes-manuais.md` — golden path completo com payloads, tabela de casos e erros esperados
- `back-end/postman/hacka.postman_collection.json` — collection pronta com scripts que auto-salvam `feedbackId` e imprimem triagem no console

---

## O que falta para fechar o loop

### 1. Módulo `tickets` — decisão humana ⬅ próximo passo

O schema já tem o modelo `Ticket`. Falta o módulo NestJS com:

| Endpoint | Descrição |
|----------|-----------|
| `POST /feedbacks/:feedbackId/ticket` | PM/PO aprova ou rejeita a triagem |
| `GET /feedbacks/:feedbackId/ticket` | Consulta a decisão |

**Body esperado:**
```json
{
  "decision": "APPROVED",
  "taskId": "<id da task vinculada>",
  "reason": "Alinhado com a task em andamento, faz sentido incorporar",
  "decidedBy": "pm@loomi.com"
}
```

**Efeitos colaterais:**
- Cria `Ticket` com `decision: APPROVED | REJECTED`
- Atualiza `Feedback.status` → `APPROVED` ou `REJECTED`

**Transição `RESOLVED`:**
- `PATCH /feedbacks/:feedbackId/status` com `{ "status": "RESOLVED" }` — chamado quando a task vinculada for concluída

### 2. Módulo `projects` — visão executiva (Grupo 1 / Pablo)

Sem esse módulo o front-end não consegue listar projetos para obter o `projectId`.

| Endpoint | Descrição |
|----------|-----------|
| `GET /projects` | Lista projetos do cliente logado com `health`, `phase`, métricas de tasks |
| `GET /projects/:id` | Detalhe + contagem de tasks por status |

### 3. Substituição do provider mock pelo Claude API real (opcional para o hacka)

Arquivo a editar: `src/modules/triage/ai-triage.provider.ts`

Trocar o método `analyze()` por uma chamada ao `@anthropic-ai/sdk` mantendo a mesma assinatura `AiTriageInput → AiTriageOutput`. O restante da stack (service, controller, DB) não muda.

---

## Fluxo de status completo (atual vs. completo)

```
RECEIVED
   │
   ▼  POST /feedbacks/:id/triage
ANALYZING          ← status atual após triagem (IA classificou)
   │
   ▼  POST /feedbacks/:id/ticket  ← FALTA
APPROVED ou REJECTED
   │
   ▼  PATCH /feedbacks/:id/status  ← FALTA
RESOLVED
```

---

## Resumo rápido

| Item | Status |
|------|--------|
| Schema + seed | ✅ |
| POST feedback | ✅ |
| GET feedbacks (lista + detalhe) | ✅ |
| Triagem de IA (mock) + endpoints | ✅ |
| Postman + docs de teste | ✅ |
| Decisão humana (ticket APPROVED/REJECTED) | ❌ falta |
| Marcar como RESOLVED | ❌ falta |
| Listagem de projetos (GET /projects) | ❌ falta (Grupo 1) |
| Trocar mock por Claude API real | ⚠️ opcional |
