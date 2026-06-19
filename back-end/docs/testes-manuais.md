# Testes manuais — Feedback + Triagem de IA

Fluxo completo: **cliente envia feedback → IA tria → resultado consultado**.

---

## Pré-requisitos

| Passo | Comando | Onde |
|-------|---------|------|
| Rodar seed | `npx prisma db seed` | `back-end/` |
| Subir API | `npm run start:dev` | `back-end/` |
| Base URL | `http://localhost:3001/api` | — |

O seed cria:
- **Usuário demo**: `cliente@energia.com` / `Demo@1234`
- **Projeto 1**: Portal Monitoramento Energético (`phase: build`, `health: GREEN`)
- **Projeto 2**: Automação de Medição (`phase: design`, `health: ATTENTION`)
- **7 tasks** distribuídas entre os projetos

> Os IDs dos projetos são impressos no terminal ao rodar o seed. Copie-os — você vai precisar deles como `{{projectId}}`.

---

## Variáveis que persistem entre os passos

| Variável | De onde vem | Usado em |
|----------|------------|---------|
| `{{accessToken}}` | Resposta do Login | Header `Authorization: Bearer` de todos os outros |
| `{{projectId}}` | Output do seed (terminal) | URL dos endpoints de feedback |
| `{{feedbackId}}` | Resposta do POST feedback | URL dos endpoints de triagem |

---

## Passo 1 — Login

```
POST /api/auth/login
Content-Type: application/json
```

**Payload:**
```json
{
  "email": "cliente@energia.com",
  "password": "Demo@1234"
}
```

**Resposta esperada (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "<JWT — copie este valor>",
    "refreshToken": "<opaco>"
  }
}
```

> Salve o `accessToken`. Todos os próximos requests exigem:
> `Authorization: Bearer {{accessToken}}`

---

## Passo 2 — Enviar feedback

```
POST /api/projects/{{projectId}}/feedbacks
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Payload:**
```json
{
  "content": "Gostaria que o dashboard mostrasse o consumo comparado ao mês anterior, facilitaria muito a análise executiva"
}
```

**Resposta esperada (201):**
```json
{
  "success": true,
  "data": {
    "id": "<feedbackId — copie este valor>",
    "projectId": "{{projectId}}",
    "clientId": "<id do usuário logado>",
    "content": "Gostaria que o dashboard mostrasse...",
    "status": "RECEIVED",
    "triage": null,
    "ticket": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

> Salve o `id` retornado como `{{feedbackId}}`.

---

## Passo 3 — Executar triagem de IA

```
POST /api/feedbacks/{{feedbackId}}/triage
Authorization: Bearer {{accessToken}}
```

> Sem body — a IA usa o conteúdo do feedback e as tasks do projeto.

**Resposta esperada (201):**
```json
{
  "success": true,
  "data": {
    "id": "<triageId>",
    "feedbackId": "{{feedbackId}}",
    "category": "feature",
    "urgency": "MEDIUM",
    "priority": 3,
    "suggestedOwner": "po",
    "matchedTaskId": "<id da task 'Dashboard de consumo...' se score Jaccard ≥ 0.15>",
    "triageReason": "Feedback identificado como solicitação de nova funcionalidade com urgência moderada. Roteado para o Product Owner. Correspondência encontrada com a task \"Dashboard de consumo em tempo real\" — recomenda-se vincular ao invés de abrir uma nova task.",
    "createdAt": "..."
  }
}
```

> Após este passo, o `status` do feedback passa de `RECEIVED` → `ANALYZING`.

---

## Passo 4 — Consultar resultado da triagem

```
GET /api/feedbacks/{{feedbackId}}/triage
Authorization: Bearer {{accessToken}}
```

Retorna o mesmo objeto do passo 3.

---

## Passo 5 — Verificar status atualizado do feedback

```
GET /api/projects/{{projectId}}/feedbacks/{{feedbackId}}
Authorization: Bearer {{accessToken}}
```

**Resposta esperada (200):**
```json
{
  "success": true,
  "data": {
    "id": "{{feedbackId}}",
    "status": "ANALYZING",
    "triage": {
      "category": "feature",
      "urgency": "MEDIUM",
      "priority": 3,
      "suggestedOwner": "po",
      "matchedTaskId": "<id ou null>",
      "triageReason": "..."
    },
    "ticket": null
  }
}
```

---

## Casos de teste — o que a IA deve classificar

Use o **Passo 2** com cada payload abaixo e então o **Passo 3** para verificar a saída esperada.

> Para cada novo feedback, repita o seed ou use um `projectId` diferente — o endpoint de triagem retorna 409 se o feedback já foi triado.

### Tabela de payloads e saídas esperadas

| # | Conteúdo do feedback | `category` | `urgency` | `priority` | `suggestedOwner` | Match de task esperado |
|---|----------------------|-----------|-----------|-----------|-----------------|----------------------|
| 1 | `"Gostaria que o dashboard mostrasse o consumo comparado ao mês anterior"` | `feature` | `MEDIUM` | 3 | `po` | Dashboard de consumo |
| 2 | `"O sistema está crashando quando tento exportar o relatório, isso está bloqueando o fechamento mensal"` | `bug` | `CRITICAL` | 1 | `developer` | Exportação de relatório PDF |
| 3 | `"O botão de alertas está desalinhado no mobile, fica sobreposto ao menu lateral"` | `design` | `MEDIUM` | 3 | `designer` | nenhum |
| 4 | `"Os dados do relatório PDF estão incorretos, prejudicando a análise da equipe"` | `bug` | `HIGH` | 1 | `developer` | nenhum |
| 5 | `"Quando será entregue a função de comparativo histórico de medições?"` | `question` | `MEDIUM` | 4 | `pm` | nenhum |
| 6 | `"O portal fora do ar desde ontem, impossível acessar o painel de medições"` | `bug` | `CRITICAL` | 1 | `developer` | nenhum |
| 7 | `"Seria interessante ter exportação de dados em Excel quando puder"` | `feature` | `LOW` | 4 | `po` | nenhum |
| 8 | `"A interface não está responsiva, o layout quebra completamente no mobile e prejudica muito o uso"` | `design` | `HIGH` | 2 | `designer` | nenhum |

---

## Listagem com filtro de status

```
GET /api/projects/{{projectId}}/feedbacks?status=ANALYZING
Authorization: Bearer {{accessToken}}
```

Retorna apenas os feedbacks que já foram triados. Outros valores possíveis: `RECEIVED`, `APPROVED`, `REJECTED`, `RESOLVED`.

**Paginação (query params opcionais):**

| Param | Tipo | Padrão | Máx |
|-------|------|--------|-----|
| `page` | `number` | 1 | — |
| `limit` | `number` | 20 | 50 |
| `status` | `string` | todos | — |

---

## Erros esperados

| Situação | Status | Mensagem |
|----------|--------|---------|
| Feedback já triado (POST /triage novamente) | 409 | `"Este feedback já foi triado. Consulte o resultado existente."` |
| Feedback não encontrado | 404 | `"Feedback não encontrado"` |
| Triagem consultada antes de existir | 404 | `"Triagem não encontrada para este feedback. Execute POST /triage primeiro."` |
| Projeto não pertence ao cliente logado | 404 | `"Projeto não encontrado"` |
| Token expirado ou ausente | 401 | `"Unauthorized"` |
| `content` com menos de 10 caracteres | 400 | array de erros de validação |
| `feedbackId` não é UUID válido | 400 | `"Validation failed (uuid is expected)"` |

---

## Sequência rápida para o golden path do pitch

```
1. Seed        → npx prisma db seed              (terminal)
2. Login       → POST /auth/login                 (salva accessToken)
3. Feedback    → POST /projects/:id/feedbacks     (salva feedbackId)
4. Triagem     → POST /feedbacks/:id/triage       (IA classifica)
5. Status      → GET  /projects/:id/feedbacks/:id (vê ANALYZING + triage)
6. Lista       → GET  /projects/:id/feedbacks?status=ANALYZING
```
