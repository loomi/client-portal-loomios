import type { Project, JourneyStage, HealthState } from './types'

const stages: JourneyStage[] = [
  {
    id: 'descoberta',
    title: 'Descoberta & alinhamento',
    summary:
      'Entendemos o contexto da operação, mapeamos os objetivos do projeto e alinhamos expectativas com os times envolvidos.',
    status: 'concluida',
    health: 'verde',
    nextSteps: [],
    materials: [
      {
        id: 'm-disc-1',
        title: 'Relatório de descoberta',
        kind: 'Documento',
        href: '#',
        deliveredAt: '2026-04-10',
      },
      {
        id: 'm-disc-2',
        title: 'Mapa de stakeholders',
        kind: 'Documento',
        href: '#',
        deliveredAt: '2026-04-12',
      },
    ],
  },
  {
    id: 'estrategia',
    title: 'Estratégia & escopo',
    summary:
      'Definimos as prioridades, o roteiro de entregas e os indicadores que vão medir o sucesso ao longo do projeto.',
    status: 'concluida',
    health: 'verde',
    nextSteps: [],
    materials: [
      {
        id: 'm-strat-1',
        title: 'Roteiro de entregas',
        kind: 'Documento',
        href: '#',
        deliveredAt: '2026-04-28',
      },
    ],
  },
  {
    id: 'construcao',
    title: 'Construção da solução',
    summary:
      'Estamos desenvolvendo as primeiras funcionalidades e validando cada parte com o seu time antes de seguir.',
    status: 'atual',
    health: 'atencao',
    nextSteps: [
      'Revisar o protótipo da tela de monitoramento com o seu time',
      'Confirmar os dados de consumo que vão alimentar os painéis',
      'Agendar a próxima demonstração para o dia 26/06',
    ],
    materials: [
      {
        id: 'm-build-1',
        title: 'Protótipo navegável — painel de consumo',
        kind: 'Protótipo',
        href: '#',
        deliveredAt: '2026-06-15',
      },
      {
        id: 'm-build-2',
        title: 'Demonstração quinzenal (gravação)',
        kind: 'Vídeo',
        href: '#',
        deliveredAt: '2026-06-12',
      },
    ],
  },
  {
    id: 'validacao',
    title: 'Validação & ajustes',
    summary:
      'Vamos testar a solução em condições reais, coletar feedback e fazer os ajustes finais antes da entrega.',
    status: 'proxima',
    health: 'verde',
    nextSteps: [],
    materials: [],
  },
  {
    id: 'entrega',
    title: 'Entrega & acompanhamento',
    summary:
      'Entregamos a solução em operação e acompanhamos os primeiros resultados junto com o seu time.',
    status: 'proxima',
    health: 'verde',
    nextSteps: [],
    materials: [],
  },
]

export const demoProject: Project = {
  id: 'proj-energia-001',
  name: 'Plataforma de monitoramento de consumo',
  client: 'Helios Energia',
  sector: 'Energia',
  health: 'atencao',
  progress: 48,
  metrics: [
    { id: 'k-1', label: 'Etapa atual', value: 'Construção', hint: '3 de 5 etapas' },
    { id: 'k-2', label: 'Progresso geral', value: '48%', hint: 'do projeto concluído' },
    { id: 'k-3', label: 'Materiais entregues', value: '5', hint: 'disponíveis para consulta' },
    { id: 'k-4', label: 'Próxima entrega', value: '26/06', hint: 'demonstração quinzenal' },
  ],
  stages,
}

export const healthMeta: Record<HealthState, { label: string; tone: string }> = {
  verde: { label: 'No prazo', tone: 'verde' },
  atencao: { label: 'Requer atenção', tone: 'atencao' },
  impeditivo: { label: 'Bloqueado', tone: 'impeditivo' },
}
