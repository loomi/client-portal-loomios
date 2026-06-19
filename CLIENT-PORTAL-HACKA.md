# Client Portal — Plataforma client-side com visão executiva
### Documento de definições · Hacka interno Loomi

> **Mentor:** Marcos Cesar · Design · Produto
> **Time:** 8 pessoas (Vinicius ausente)
> **Localização:** Sala principal · Mesa 3

---

## 1. O desafio

Hoje o cliente recebe update via call ou Slack — nada visível, nada mensurável. A proposta é uma **plataforma client-facing** com visão executiva, jornada, materiais e métricas, que torna a Loomi uma parceira mais transparente e cria um **moat competitivo**. O desafio é altamente design-driven, com **IA conectando feedback do cliente a tickets internos**.

---

## 2. Histórico de definições (decisões tomadas na ideação)

### 2.1 Segmentação & adaptação linguística
- A Loomi é uma **consultoria sem nicho fixo** — atende agro, telecom, energia, empreendedorismo, bateria, logística.
- A adaptação linguística será **por persona/cargo**, usando **termos comuns do setor do cliente**, mas **evitando jargões técnicos** (nem de software, nem infantilização).
- Modelo conceitual: **vocabulário do cargo × dicionário do setor** → mesma informação, línguas diferentes.

### 2.2 Transparência e disclosure de problemas
- **Problema impeditivo:** tem que ser mostrado, claro.
- **Problema interno:** cuidado para não expor a empresa a vulnerabilidade — mas se a criticidade for alta e for impeditivo, **precisa ser comunicado**.
- **Casos externos (bola com o cliente):** ser mais direto, deixando claro que a Loomi **foi atrás e buscou retorno**, mas não houve resposta do cliente (mostrar o **rastro de tentativas**).
- O gate de revelar um problema interno crítico **não é decisão da IA sozinha** — tem humano no loop.

### 2.3 Feedback → ticket (o coração de IA)
- Precisa de uma **pré-etapa de triagem** antes de virar ticket. **Nem tudo que o cliente pede vira task** — e isso fica claro para ele.
- A IA faz: **flags de urgência**, **categorização automática**, **ranking de priorização** e **roteamento para a pessoa certa** (design → designer, nova feature → PO, etc.).
- A IA também faz **match com tasks em andamento**: a partir dos comentários, conecta o feedback a uma task existente e ajuda a priorizar para entregar tudo completo.
- A **decisão final (vira ticket ou não)** é de uma pessoa ou grupo responsável.
- O cliente tem **visibilidade do status** dos pedidos (recebido → em análise → aprovado/recusado → resolvido).

### 2.4 Valor & sensação para o cliente
- O cliente precisa sentir que **dar feedback e ver o andamento** acontecem no mesmo lugar.
- Sensação de **co-construção** — possivelmente uma **interface conversacional** para dialogar sobre o projeto.
- O portal precisa ser **o espaço vivo do projeto**.

### 2.5 Os dois "corações" do produto
- **Coração A — Transparência confiável:** jornada + health + disclosure honesto de bloqueios (a moldura).
- **Coração B — Co-criação inteligente:** feedback → triagem com IA → match → loop fechado (o diferencial).
- **Aposta do hacka:** o **Coração B** é o que ninguém mais tem e o que faz o cliente sentir que co-constrói. É a estrela da demo.

### 2.6 Dinâmica de execução
- Todos trabalham **local, cada um na sua máquina, treinando Claude Code**.
- **Não há necessidade de padronizar** mock de dados nem telas — o foco é **validar conceito e funcionamento**.
- Como o Claude Code gera **tela + código juntos**, os papéis de **design + front se unem**: cada pessoa de UI é um **gerador de telas completas**.
- Estrutura escolhida: **grupos cross-funcionais** (não por área).

---

## 3. O Golden Path (roteiro único da demo)

> Cliente do setor de **energia** abre o portal → vê **jornada + health** na língua do cargo dele → deixa um **feedback conversacional** → a **IA tritura** (categoriza, marca urgência, faz match com uma task em andamento, sugere o dono) → **humano decide** se vira ticket → cliente vê o **status mudar** (recebido → em análise → aprovado/recusado → resolvido) → recebe a notificação **na língua dele**.

**Ordem do pitch:** Grupo 1 (cliente vê) → Grupo 2 (cliente fala, IA tria) → Grupo 3 (volta pro cliente).

**Trilho comum:** mesmo despadronizado, todos usam **1 projeto-exemplo do setor energia** para o pitch parecer um produto só.

---

## 4. Os grupos

### Grupo 1 — EXPERIÊNCIA · *a vitrine viva*
**O que provam juntos:** o cliente abre o portal e entende a jornada + health em 5 segundos.
**Integrantes:** Laura (UI) · Gustavo (UI) · Pablo (Back)

### Grupo 2 — INTELIGÊNCIA ⭐ · *o cérebro de triagem*
**O que provam juntos:** feedback do cliente entra solto e sai estruturado (categoria, urgência, prioridade, dono, match com task). É o **diferencial** — a estrela do hacka.
**Integrantes:** Carol (UI) · Igor (Projetos) · Lucas (Back)

### Grupo 3 — CONFIANÇA & ADAPTAÇÃO · *o loop e a língua*
**O que provam juntos:** o ticket anda, o status volta pro cliente, e tudo aparece na língua dele (cargo × setor), com bloqueios tratados com responsabilidade.
**Integrantes:** Renan (UI) · Ítalo (UI Mobile)
> A parte de fluxo de dados (ticket interno → status visível) foi absorvida pelo **Lucas** (Grupo 2), dono de tickets/triagem, já que o loop é continuação natural do trabalho dele.

---

## 5. Tasks por pessoa

### Grupo 1 — EXPERIÊNCIA

**Laura** (UI via Claude Code)
- [ ] Gerar a **Home executiva**: jornada visível + health (3 estados: verde/atenção/impeditivo) + métricas-chave
- [ ] Garantir copy executiva, sem jargão

**Gustavo** (UI via Claude Code)
- [ ] Gerar o **shell do portal** (layout + navegação)
- [ ] Gerar a **jornada detalhada** (etapa atual, materiais entregues, próximos passos) e ligar com a Home da Laura

**Pablo** (Back — fluxo de dados)
- [ ] Modelar os dados de **projeto + jornada** (etapas, marcos, materiais)
- [ ] Estruturar as **métricas** que alimentam a Home
- [ ] Expor de forma que o front consuma (mock/endpoint próprio)

### Grupo 2 — INTELIGÊNCIA ⭐

**Carol** (UI via Claude Code)
- [ ] Gerar a **tela conversacional** de feedback (parece diálogo, não formulário)
- [ ] Gerar a **confirmação** ("entendi que você quer X — confirma?")
- [ ] Gerar a resposta de **"não" honesto** (quando o pedido não vira task) + a visão de triagem organizada

**Igor** (Projetos — regras + roteiro)
- [ ] Definir as **regras de triagem** (o que vira task / o que não vira)
- [ ] Definir critérios de **urgência, prioridade e roteamento** por tipo (design → designer, feature → PO)
- [ ] Desenhar o **fluxograma do golden path** (roteiro do pitch)

**Lucas** (Back — a prova principal + loop de status)
- [ ] Fluxo de IA: texto livre → **categoria + flag de urgência + ranking + dono sugerido**
- [ ] Lógica de **match** com task em andamento (feedback novo ↔ task existente)
- [ ] Endpoint de feedback rodando ponta a ponta
- [ ] **Ticket interno → status visível** ao cliente (parte absorvida do Vinicius)

### Grupo 3 — CONFIANÇA & ADAPTAÇÃO

**Renan** (UI via Claude Code)
- [ ] Gerar a **matriz de adaptação** viva (troca de perfil cargo × setor = troca de copy)
- [ ] Gerar o **componente de bloqueio** (interno vs. externo + rastro de tentativas)
- [ ] Aplicar a adaptação linguística numa tela demonstrável

**Ítalo** (UI Mobile via Claude Code)
- [ ] Gerar o **app cliente**: jornada mobile
- [ ] Telas de **status do pedido** (recebido → em análise → aprovado/recusado → resolvido) — consome o status produzido pelo Lucas
- [ ] **Push** "seu feedback virou entrega"

---

## 6. Prioridades de escopo (se faltar tempo)
- A peça que **tem que funcionar de verdade** é a do **Lucas** (IA triando) — é o diferencial que ninguém mais tem.
- Squads 1 e 3 são a **moldura** que faz a estrela brilhar — podem ser mais protótipo.
- **Mobile (Ítalo)** = segunda tela do loop, foco no push de status (o "uau" mais barato), não app completo.
- **1 setor só** no demo (energia) — provar adaptação em 1 vende melhor que 6 pela metade.
