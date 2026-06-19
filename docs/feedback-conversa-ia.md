# Conversa de Feedback com IA — Portal do Cliente Loomi

> Funcionalidade do **Grupo 2 — Inteligência** do hackathon interno da Loomi.
> Esta é a parte que prova o diferencial do produto: o feedback do cliente entra
> solto e sai **estruturado** pela IA. Documento escrito para leitura externa.

---

## 1. O contexto

Hoje o cliente de uma consultoria recebe updates por call ou Slack — nada visível,
nada mensurável. A proposta do portal é dar ao cliente um espaço vivo onde ele
**vê a jornada do projeto, dá feedback e acompanha o andamento** — tudo no mesmo lugar.

O **coração de IA** do produto é a triagem: o cliente fala com naturalidade, e a IA
transforma esse texto solto em algo organizado (categoria, urgência, próximo passo),
conectando o feedback ao trabalho do time. O cliente sente que **co-constrói** o
projeto, com transparência sobre o que vira tarefa e o que não vira.

Esta funcionalidade cobre a **experiência conversacional** dessa triagem, do ponto de
vista do cliente.

---

## 2. O que está construído (funcional hoje)

Uma tela de conversa (`/feedback`) que se comporta como um chat de IA, em dois estados:

### Estado inicial
- Saudação personalizada e um campo de mensagem central (inspirado no padrão de
  produtos como Gemini/Claude), com atalhos rápidos ("Reportar um problema", "Pedir um
  ajuste", "Elogiar uma entrega", "Tirar uma dúvida").
- Sidebar flutuante de navegação do portal (Visão geral, Jornada, Conversar, Meus
  pedidos, Materiais, Ajustes), com o item ativo destacado.

### Estado de conversa
Ao enviar a primeira mensagem, a tela vira um chat e roda o **fluxo de triagem guiada**:

1. **Entrada** — o cliente descreve algo do projeto em texto livre.
2. **Refinamento** — em vez de adivinhar, a IA faz **perguntas de múltipla escolha**
   para entender melhor (ex.: "Qual o impacto disso pra você agora?", "Isso é sobre o
   quê?"). O cliente responde clicando, navegando pelo teclado (↑↓ + Enter) ou
   digitando. As respostas são armazenadas sem poluir o chat.
3. **Resultado** — com base nas respostas, a IA devolve a **triagem organizada**:
   - **Vira tarefa:** um card com a categoria, a urgência (com destaque visual), o
     **status inicial** (`Recebido → Em análise`) e, quando faz sentido, um sinal de
     **match** ("conversa com uma entrega já em andamento"). Deixa claro que o pedido
     **passa por uma pessoa do time** antes de virar trabalho.
   - **Não vira tarefa ("não" honesto):** quando o pedido está fora do escopo
     combinado, a IA explica com respeito que não entra como tarefa agora, mas que foi
     registrado e será levado para avaliação. Sem recusa fria.

### Detalhes de experiência
- **"IA pensando":** antes e depois do refinamento, um indicador de carregamento
  (pontinhos) com uma **aurora animada** sutil no fundo dá a sensação de que a IA está
  processando. Ao retornar a resposta, o fundo volta ao normal.
- **Acessibilidade:** navegação por teclado, foco visível, rótulos para leitores de
  tela, e funciona em telas pequenas.

---

## 3. Como a "inteligência" funciona hoje (e o plano)

Para o protótipo, a triagem é **mockada de forma determinística** — roteamento por
cenários, rodando 100% no navegador, sem depender de back-end nem de chave de API.
Isso garante uma demonstração estável e previsível.

> **Importante:** os cenários hoje são **fixos** — a primeira mensagem sempre segue o
> roteiro principal (um atraso em relatório do setor de energia), e os caminhos de
> resposta são pré-definidos. É uma simulação convincente da experiência, não uma IA
> reativa de verdade.

A peça-chave é que cada triagem produz um **objeto estruturado** (o "contrato"):
categoria, urgência, se vira tarefa, motivo (quando não vira), match e status. A tela
só consome esse objeto — **não sabe de onde ele vem**.

Por isso a evolução é direta: basta trocar a fonte do objeto por uma IA real, sem mexer
na interface. Já existe a estrutura para duas fontes reais:
- **API da Anthropic** (Claude) via um proxy server-side, com a chave protegida no
  servidor (já implementado, aguardando apenas a chave).
- **Claude Code local** (CLI), para gerar respostas reais usando o login local, sem
  chave de API — útil para demonstração.

Quando ligada, a IA passa a **reagir de verdade** ao que o cliente escreve, na
linguagem dele, mantendo a mesma experiência de tela.

---

## 4. O que está previsto (roadmap)

- **IA reativa de verdade** — conectar a triagem a uma IA real (API ou CLI) por trás do
  mesmo contrato, deixando a conversa responder a qualquer entrada.
- **Loop de status fechado** — o status do pedido avançar visivelmente para o cliente
  (`Em análise → Aprovado/Recusado → Resolvido`), com notificação "seu feedback virou
  entrega".
- **Tela de "Meus pedidos"** — uma visão consolidada dos pedidos e seus status, fora da
  conversa.
- **Adaptação de linguagem** — ajustar a copy ao cargo e ao setor do cliente
  (vocabulário do cargo × dicionário do setor), evitando jargão técnico.
- **Humano no loop** — a decisão final de virar (ou não) tarefa é de uma pessoa/grupo
  responsável; o portal apenas dá visibilidade ao cliente.
- **Mais cenários** — ampliar os roteiros de triagem (problema, ajuste, ideia, elogio,
  dúvida) e os critérios de urgência/prioridade/roteamento.
- **Integração entre squads** — conectar com a Home executiva, a Jornada e o fluxo de
  tickets internos dos outros grupos.

---

## 5. Stack e organização

- **Front-end:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4. Roda localmente
  com `make dev` (back-end opcional — esta tela funciona sozinha).
- **Rota:** `/feedback`.
- **Onde mora o código** (em `front-end/src`):
  - `features/feedback/scenarios.ts` — os cenários de triagem mockados (gatilhos,
    perguntas e lógica do resultado). É o arquivo central para estender a "inteligência".
  - `features/feedback/components/` — a conversa (`ConversationView`), o campo de
    mensagem (`Composer`), o card de pergunta (`QuestionCard`) e o card de resultado
    (`ResultCard`).
  - `app/api/triagem/route.ts` — o proxy server-side para a IA real (Anthropic).
  - `components/FloatingSidebar.tsx` — a navegação flutuante do portal.

> Pré-requisito de ambiente: o front-end usa Tailwind v4, que exige **Node ≥ 20**.
