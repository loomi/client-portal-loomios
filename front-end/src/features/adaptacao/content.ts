// ── Adaptação linguística (Grupo 3) ─────────────────────────────
// Eixo de adaptação = NÍVEL DE FAMILIARIDADE TÉCNICA, não cargo.
// Atribuído manualmente por alguém da Loomi (ver tela /loomi).
// Regra de ouro: a familiaridade muda as PALAVRAS, nunca os FATOS —
// um problema aparece para os dois perfis, só explicado de forma diferente.

export type Profile = 'negocio' | 'tecnico'

/** Mesmo conteúdo, duas vozes. */
export type Voiced = Record<Profile, string>

export const PROFILE_LABEL: Record<Profile, string> = {
  negocio: 'Visão de negócio',
  tecnico: 'Visão técnica',
}

export const PROFILE_HINT: Record<Profile, string> = {
  negocio: 'Linguagem de resultado, sem jargão técnico.',
  tecnico: 'Vocabulário do setor e detalhe operacional.',
}

export type StepStatus = 'done' | 'current' | 'upcoming'

export interface JourneyStep {
  id: string
  status: StepStatus
  label: Voiced
}

export interface ContactAttempt {
  date: string
  channel: 'E-mail' | 'Ligação'
  note: string
}

export interface Blocker {
  id: string
  kind: 'interno' | 'externo'
  severity: 'baixa' | 'media' | 'alta'
  title: Voiced
  body: Voiced
  /** Rastro de tentativas — só faz sentido em bloqueio externo. */
  attempts?: ContactAttempt[]
  /** Quem está tratando — usado no bloqueio interno. */
  owner?: string
}

export interface Stat {
  label: Voiced
  value: string
}

export interface ProjectContent {
  client: string
  sector: string
  projectName: string
  health: {
    state: 'ok' | 'attention' | 'blocked'
    summary: Voiced
  }
  stats: Stat[]
  journey: JourneyStep[]
  blockers: Blocker[]
}

// ── Projeto-exemplo do setor de energia (trilho comum da demo) ───
export const PROJECT: ProjectContent = {
  client: 'Helios Energia',
  sector: 'Energia',
  projectName: 'Plataforma de Medição Inteligente — Subestação Norte',
  health: {
    state: 'attention',
    summary: {
      negocio:
        'Seu projeto está avançando bem: 2 das 5 etapas concluídas e dentro do prazo. Há um ponto que precisa de uma ação sua para não impactar o cronograma — está detalhado abaixo.',
      tecnico:
        'Projeto em andamento: 2 de 5 etapas concluídas, sem desvio de cronograma. Existe um bloqueio externo na integração de medição aguardando dados da sua equipe — detalhado abaixo.',
    },
  },
  stats: [
    {
      label: { negocio: 'Etapas concluídas', tecnico: 'Marcos concluídos' },
      value: '2 / 5',
    },
    {
      label: {
        negocio: 'Disponibilidade prevista',
        tecnico: 'SLA de disponibilidade',
      },
      value: '99,8%',
    },
    {
      label: { negocio: 'Previsão de entrega', tecnico: 'Go-live estimado' },
      value: 'Ago 2026',
    },
  ],
  journey: [
    {
      id: 'diagnostico',
      status: 'done',
      label: {
        negocio: 'Entendimento do cenário',
        tecnico: 'Diagnóstico e levantamento técnico',
      },
    },
    {
      id: 'solucao',
      status: 'done',
      label: {
        negocio: 'Desenho da solução',
        tecnico: 'Arquitetura da solução',
      },
    },
    {
      id: 'medicao',
      status: 'current',
      label: {
        negocio: 'Conexão dos dados de medição',
        tecnico: 'Integração de telemetria da medição',
      },
    },
    {
      id: 'validacao',
      status: 'upcoming',
      label: {
        negocio: 'Testes e validação',
        tecnico: 'Homologação',
      },
    },
    {
      id: 'operacao',
      status: 'upcoming',
      label: {
        negocio: 'Entrada em operação',
        tecnico: 'Go-live e operação assistida',
      },
    },
  ],
  blockers: [
    {
      id: 'medicao-dados',
      kind: 'externo',
      severity: 'alta',
      title: {
        negocio: 'Aguardando uma informação sua',
        tecnico: 'Bloqueio externo: dados de medição pendentes',
      },
      body: {
        negocio:
          'Para conectar a leitura automática dos medidores, precisamos da planilha de configuração da medição, que está com a sua equipe. Já buscamos esse retorno algumas vezes e ainda não recebemos — assim que chegar, retomamos na hora.',
        tecnico:
          'A integração de telemetria está bloqueada aguardando o arquivo de parametrização dos medidores (mapa de pontos e escalas), sob responsabilidade da sua equipe. Três tentativas de contato sem retorno; retomamos imediatamente após o recebimento.',
      },
      attempts: [
        { date: '02 jun', channel: 'E-mail', note: 'Solicitação enviada à equipe de medição' },
        { date: '06 jun', channel: 'Ligação', note: 'Sem atendimento' },
        { date: '12 jun', channel: 'E-mail', note: 'Reforço da solicitação — sem retorno' },
      ],
    },
    {
      id: 'performance-coleta',
      kind: 'interno',
      severity: 'baixa',
      owner: 'Equipe Loomi',
      title: {
        negocio: 'Ajuste interno em andamento',
        tecnico: 'Bloqueio interno: ajuste de performance na coleta',
      },
      body: {
        negocio:
          'Identificamos por conta própria um ajuste necessário para garantir a estabilidade da leitura em alto volume. Já estamos tratando — não depende de você e não afeta o prazo final.',
        tecnico:
          'Identificamos um gargalo de performance na rotina de coleta em alto volume. Correção em andamento pela nossa equipe; sem impacto no cronograma e sem ação necessária da sua parte.',
      },
    },
  ],
}
