import type { ComponentType } from 'react'
import {
  CalendarClock,
  CalendarDays,
  CircleCheck,
  Gauge,
} from 'lucide-react'

import type { HealthState } from './health'

type IconType = ComponentType<{ className?: string }>

export type PhaseStatus = 'concluida' | 'andamento' | 'ainiciar'
export type TaskStatus = PhaseStatus | 'bloqueado'

export interface Task {
  title: string
  status: TaskStatus
  description?: string
  due?: string
  owner?: string
}

/** Cargo/persona pela qual o portal é visto — base da adaptação linguística. */
export interface Persona {
  id: string
  role: string
  focus: string
}

export const personas: Persona[] = [
  {
    id: 'diretora-ops',
    role: 'Diretora de Operações',
    focus: 'Visão de prazo, saúde e impacto na operação.',
  },
  {
    id: 'gerente-atendimento',
    role: 'Gerente de Atendimento',
    focus: 'Visão de equipe, filas e qualidade do atendimento.',
  },
  {
    id: 'analista-cx',
    role: 'Analista de Experiência',
    focus: 'Visão dos detalhes da experiência e do feedback dos clientes.',
  },
  {
    id: 'patrocinador',
    role: 'Patrocinador (C-level)',
    focus: 'Visão de resultado de negócio e panorama geral.',
  },
]

export interface Material {
  label: string
  /** Tipo do material (Documento, Protótipo, Vídeo, Ambiente…) — vindo da main. */
  kind?: string
  /** Data de entrega em ISO (yyyy-mm-dd) — vindo da main. */
  deliveredAt?: string
  /** false → entregável ainda em preparação (não disponível para download) */
  ready?: boolean
}

/**
 * Cada ponto da jornada é um **épico**: agrupa um conjunto de tarefas, tem um
 * status, uma saúde e uma data (concluída ou prevista).
 */
export interface Epic {
  name: string
  status: PhaseStatus
  /** Saúde do épico. `null` quando ainda não começou. */
  health: HealthState | null
  /** Data curta para o nó da timeline, ex.: "28 abr" ou "12 set". */
  dateShort: string
  /** Rótulo completo, ex.: "Concluído em 28 abr" ou "Previsão: 12 set". */
  dateLabel: string
  isForecast: boolean
  summary: string
  tasks: Task[]
  /** Próximos passos da etapa — informação puxada da jornada construída na main. */
  nextSteps?: string[]
  materials?: Material[]
}

export interface Metric {
  key: string
  label: string
  value: string
  hint: string
  trend?: 'up' | 'down'
  icon: IconType
}

export interface Project {
  client: string
  sector: string
  name: string
  persona: string
  updatedLabel: string
  overallHealth: HealthState
  /** Status objetivo, em uma linha. */
  healthHeadline: string
  attention: {
    label: string
    title: string
    detail: string
    cta: string
  }
  metrics: Metric[]
  epics: Epic[]
}

/**
 * Projeto-exemplo do Golden Path do hacka: cliente do setor de energia.
 * Toda a copy é executiva e em linguagem de negócio — sem jargão de software.
 */
export const project: Project = {
  client: 'Volt Energia',
  sector: 'Energia',
  name: 'Nova Central de Atendimento Digital',
  persona: 'Diretora de Operações',
  updatedLabel: 'Atualizado hoje · 19 jun',
  overallHealth: 'atencao',
  healthHeadline: 'No prazo · 1 ponto aguarda você',
  attention: {
    label: 'Pendente com você',
    title: 'Aprovação dos textos da central',
    detail: 'Revise e aprove a proposta de conteúdo enviada há 4 dias.',
    cta: 'Revisar e aprovar',
  },
  metrics: [
    {
      key: 'progresso',
      label: 'Progresso geral',
      value: '64%',
      hint: '+8% nas últimas 2 semanas',
      trend: 'up',
      icon: Gauge,
    },
    {
      key: 'etapas',
      label: 'Etapas concluídas',
      value: '2 de 5',
      hint: 'Construção em andamento',
      icon: CircleCheck,
    },
    {
      key: 'proxima',
      label: 'Próxima entrega',
      value: '6 dias',
      hint: 'Ambiente de demonstração',
      icon: CalendarClock,
    },
    {
      key: 'conclusao',
      label: 'Conclusão prevista',
      value: '12 set',
      hint: 'Dentro do prazo combinado',
      icon: CalendarDays,
    },
  ],
  epics: [
    {
      name: 'Descoberta e alinhamento',
      status: 'concluida',
      health: 'verde',
      dateShort: '28 abr',
      dateLabel: 'Concluído em 28 abr',
      isForecast: false,
      summary: 'Entendemos seus objetivos, ouvimos seus clientes e definimos o foco.',
      tasks: [
        {
          title: 'Entrevistas com lideranças',
          status: 'concluida',
          description: 'Conversas com as áreas de operação e atendimento para entender dores e prioridades.',
          due: 'Concluído em 12 abr',
          owner: 'Marina Costa · Pesquisa',
        },
        {
          title: 'Análise da operação atual',
          status: 'concluida',
          description: 'Levantamento de volumes, filas e gargalos do atendimento de hoje.',
          due: 'Concluído em 18 abr',
          owner: 'Bruno Antunes · Tecnologia',
        },
        {
          title: 'Mapa da jornada do cliente',
          status: 'concluida',
          description: 'Visão ponta a ponta da experiência do cliente final, do contato à resolução.',
          due: 'Concluído em 24 abr',
          owner: 'Larissa Tavares · Design',
        },
        {
          title: 'Definição de objetivos e metas',
          status: 'concluida',
          description: 'Acordo das metas do projeto: redução de tempo de espera e satisfação.',
          due: 'Concluído em 28 abr',
          owner: 'Equipe Loomi',
        },
      ],
      materials: [
        { label: 'Relatório de diagnóstico', kind: 'Documento', deliveredAt: '2026-04-10' },
        { label: 'Mapa da jornada do cliente', kind: 'Documento', deliveredAt: '2026-04-12' },
        { label: 'Mapa de stakeholders', kind: 'Documento', deliveredAt: '2026-04-12' },
      ],
    },
    {
      name: 'Definição da experiência',
      status: 'concluida',
      health: 'verde',
      dateShort: '23 mai',
      dateLabel: 'Concluído em 23 mai',
      isForecast: false,
      summary: 'Desenhamos como a nova central vai funcionar e validamos o visual com você.',
      tasks: [
        {
          title: 'Arquitetura da nova central',
          status: 'concluida',
          description: 'Definição de como as informações e os canais se organizam na central.',
          due: 'Concluído em 6 mai',
          owner: 'Bruno Antunes · Tecnologia',
        },
        {
          title: 'Protótipo navegável',
          status: 'concluida',
          description: 'Versão clicável da central para testar o fluxo antes de construir.',
          due: 'Concluído em 14 mai',
          owner: 'Larissa Tavares · Design',
        },
        {
          title: 'Guia da nova identidade',
          status: 'concluida',
          description: 'Cores, tipografia e tom de voz aplicados à experiência.',
          due: 'Concluído em 19 mai',
          owner: 'Larissa Tavares · Design',
        },
        {
          title: 'Validação com seu time',
          status: 'concluida',
          description: 'Sessão de revisão e aprovação da direção da experiência com a Volt.',
          due: 'Concluído em 23 mai',
          owner: 'Equipe Loomi + Volt',
        },
      ],
      materials: [
        { label: 'Roteiro de entregas', kind: 'Documento', deliveredAt: '2026-04-28' },
        { label: 'Protótipo navegável', kind: 'Protótipo', deliveredAt: '2026-05-14' },
        { label: 'Guia da nova identidade', kind: 'Documento', deliveredAt: '2026-05-19' },
      ],
    },
    {
      name: 'Construção',
      status: 'andamento',
      health: 'atencao',
      dateShort: '25 jun',
      dateLabel: 'Previsão: 25 jun',
      isForecast: true,
      summary: 'Montando a central de autoatendimento no ambiente de demonstração.',
      tasks: [
        {
          title: 'Central de autoatendimento',
          status: 'andamento',
          description: 'Construção das telas onde o cliente resolve as solicitações mais comuns sozinho.',
          due: 'Previsão: 20 jun',
          owner: 'Bruno Antunes · Tecnologia',
        },
        {
          title: 'Integração com seus sistemas',
          status: 'andamento',
          description: 'Conexão da central com os sistemas atuais da Volt para dados em tempo real.',
          due: 'Previsão: 23 jun',
          owner: 'Bruno Antunes · Tecnologia',
        },
        {
          title: 'Conteúdo e textos da central',
          status: 'bloqueado',
          description: 'Redação das mensagens e respostas — aguarda sua aprovação para iniciar.',
          due: 'Bloqueado · aguarda aprovação',
          owner: 'Marina Costa · Conteúdo',
        },
        {
          title: 'Testes internos de qualidade',
          status: 'ainiciar',
          description: 'Verificação final antes de abrir para os clientes.',
          due: 'Previsão: 25 jun',
          owner: 'Equipe Loomi',
        },
      ],
      nextSteps: [
        'Revisar o protótipo da central de autoatendimento com o seu time',
        'Confirmar os conteúdos e textos que vão alimentar a central',
        'Agendar a próxima demonstração para o dia 26/06',
      ],
      materials: [
        {
          label: 'Protótipo navegável — central de autoatendimento',
          kind: 'Protótipo',
          deliveredAt: '2026-06-15',
        },
        { label: 'Demonstração quinzenal (gravação)', kind: 'Vídeo', deliveredAt: '2026-06-12' },
        { label: 'Ambiente de demonstração', kind: 'Ambiente', ready: false },
      ],
    },
    {
      name: 'Testes com clientes',
      status: 'ainiciar',
      health: null,
      dateShort: '25 ago',
      dateLabel: 'Previsão: 14 a 25 ago',
      isForecast: true,
      summary: 'Vamos colocar a central na frente de clientes reais e ajustar com base no que observarmos.',
      tasks: [
        {
          title: 'Recrutamento de participantes',
          status: 'ainiciar',
          description: 'Seleção de clientes reais com o perfil que mais usa o atendimento.',
          due: 'Previsão: 14 ago',
          owner: 'Marina Costa · Pesquisa',
        },
        {
          title: 'Sessões de teste',
          status: 'ainiciar',
          description: 'Acompanhamento de clientes usando a central para identificar ajustes.',
          due: 'Previsão: 18 a 22 ago',
          owner: 'Larissa Tavares · Design',
        },
        {
          title: 'Ajustes a partir dos aprendizados',
          status: 'ainiciar',
          description: 'Melhorias na central com base no que observarmos nos testes.',
          due: 'Previsão: 25 ago',
          owner: 'Equipe Loomi',
        },
      ],
    },
    {
      name: 'Lançamento',
      status: 'ainiciar',
      health: null,
      dateShort: '12 set',
      dateLabel: 'Previsão: 12 set',
      isForecast: true,
      summary: 'Publicação da nova central e acompanhamento dos primeiros resultados com você.',
      tasks: [
        {
          title: 'Publicação da central',
          status: 'ainiciar',
          description: 'Disponibilização da nova central para todos os clientes da Volt.',
          due: 'Previsão: 8 set',
          owner: 'Bruno Antunes · Tecnologia',
        },
        {
          title: 'Treinamento da sua equipe',
          status: 'ainiciar',
          description: 'Capacitação do time de atendimento para o novo fluxo.',
          due: 'Previsão: 10 set',
          owner: 'Equipe Loomi + Volt',
        },
        {
          title: 'Acompanhamento dos resultados',
          status: 'ainiciar',
          description: 'Medição dos primeiros resultados e plano de melhoria contínua.',
          due: 'Previsão: 12 set',
          owner: 'Equipe Loomi',
        },
      ],
    },
  ],
}
