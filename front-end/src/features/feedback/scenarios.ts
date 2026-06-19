import type { Answers, Scenario, TriageResult, Urgency } from './types'

// Cenários mockados do golden path (cliente do setor energia, perfil executivo).
// A IA recebe o feedback solto, refina por perguntas e monta a triagem.
// Determinístico: roteamento por palavra-chave. Troca trivial por API real depois.

const URGENCY_BY_IMPACT: Record<string, Urgency> = {
  impeditivo: 'Alta',
  contorna: 'Média',
  incomodo: 'Baixa',
  alta: 'Alta',
  media: 'Média',
  explorando: 'Baixa',
  baixa: 'Baixa',
}

const SCENARIOS: Scenario[] = [
  // 1) Elogio — sem perguntas, só agradece.
  {
    id: 'elogio',
    matches: (t) => /(obrigad|parab|gostei|[óo]timo|excelente|adorei|incr[íi]vel|mandaram bem|show)/.test(t),
    intro:
      'Que bom saber. Vou repassar pro time — esse tipo de retorno ajuda a gente a manter o rumo do projeto.',
    questions: [],
  },

  // 2) Problema / atraso numa entrega — vira ticket.
  {
    id: 'entrega',
    matches: (t) =>
      /(relat[óo]rio|atras|travou|parou|erro|problema|n[ãa]o\s+funciona|demor|lentid|fora do ar|bug|falha|prazo)/.test(
        t,
      ),
    intro:
      'Entendi que algo na entrega não está fluindo. Deixa eu fazer duas perguntas rápidas pra encaminhar do jeito certo.',
    questions: [
      {
        id: 'impacto',
        prompt: 'Qual o impacto disso pra você agora?',
        options: [
          { id: 'impeditivo', label: 'Está me travando hoje' },
          { id: 'contorna', label: 'Atrapalha, mas dá pra contornar' },
          { id: 'incomodo', label: 'É mais um incômodo' },
        ],
      },
      {
        id: 'tema',
        prompt: 'Isso é sobre o quê?',
        options: [
          { id: 'entrega', label: 'Uma entrega ou relatório' },
          { id: 'portal', label: 'Uma funcionalidade do portal' },
          { id: 'prazo', label: 'Um prazo combinado' },
        ],
      },
    ],
    buildResult: (a: Answers): TriageResult => {
      const urgencia = URGENCY_BY_IMPACT[a.impacto] ?? 'Média'
      const categoria =
        a.tema === 'portal' ? 'Portal' : a.tema === 'prazo' ? 'Prazo' : 'Entrega'
      return {
        kind: 'ticket',
        resumo: `Você sinalizou um problema em ${categoria.toLowerCase()} com impacto ${urgencia.toLowerCase()}.`,
        categoria,
        urgencia,
        match:
          urgencia === 'Alta'
            ? 'Conversa com a entrega “Painel de consumo”, que já está em andamento.'
            : undefined,
        status: ['Recebido', 'Em análise'],
      }
    },
  },

  // 3) Pedido de frente nova — pode dar o "não" honesto.
  {
    id: 'escopo',
    matches: (t) =>
      /(site|institucional|do zero|nova frente|outro projeto|al[ée]m|redesign|landing|app novo|criar)/.test(
        t,
      ),
    intro: 'Boa. Deixa eu entender melhor pra te dar um retorno honesto.',
    questions: [
      {
        id: 'escopo',
        prompt: 'Isso é dentro do projeto atual ou uma frente nova?',
        options: [
          { id: 'dentro', label: 'Dentro do projeto atual' },
          { id: 'nova', label: 'Uma frente nova' },
        ],
      },
      {
        id: 'prioridade',
        prompt: 'Quão importante é pra você?',
        options: [
          { id: 'alta', label: 'Prioridade alta' },
          { id: 'media', label: 'Importante, sem pressa' },
          { id: 'explorando', label: 'Só explorando a ideia' },
        ],
      },
    ],
    buildResult: (a: Answers): TriageResult => {
      if (a.escopo === 'nova') {
        return {
          kind: 'no',
          resumo: 'Você está pedindo uma frente nova, fora do que combinamos para este projeto.',
          motivo:
            'Por isso não entra como tarefa agora — mas registrei e vou levar pro time avaliar como uma nova proposta. Você fica sabendo do retorno por aqui.',
        }
      }
      const urgencia = URGENCY_BY_IMPACT[a.prioridade] ?? 'Média'
      return {
        kind: 'ticket',
        resumo: 'Entendi como um ajuste dentro do projeto atual.',
        categoria: 'Ajuste',
        urgencia,
        status: ['Recebido', 'Em análise'],
      }
    },
  },

  // 4) Catch-all — sempre cai aqui se nada acima casar.
  {
    id: 'default',
    matches: () => true,
    intro: 'Entendi. Deixa eu organizar isso com duas perguntas rápidas.',
    questions: [
      {
        id: 'tipo',
        prompt: 'Como você descreveria o seu recado?',
        options: [
          { id: 'problema', label: 'Um problema' },
          { id: 'ajuste', label: 'Um pedido de ajuste' },
          { id: 'ideia', label: 'Uma ideia nova' },
          { id: 'duvida', label: 'Uma dúvida' },
        ],
      },
      {
        id: 'urgencia',
        prompt: 'Qual a urgência?',
        options: [
          { id: 'alta', label: 'Alta — preciso logo' },
          { id: 'media', label: 'Média' },
          { id: 'baixa', label: 'Baixa' },
        ],
      },
    ],
    buildResult: (a: Answers): TriageResult => {
      const categoria =
        a.tipo === 'problema'
          ? 'Problema'
          : a.tipo === 'ajuste'
            ? 'Ajuste'
            : a.tipo === 'ideia'
              ? 'Ideia'
              : 'Dúvida'
      const urgencia = URGENCY_BY_IMPACT[a.urgencia] ?? 'Média'
      return {
        kind: 'ticket',
        resumo: `Registrei como ${categoria.toLowerCase()} com urgência ${urgencia.toLowerCase()}.`,
        categoria,
        urgencia,
        status: ['Recebido', 'Em análise'],
      }
    },
  },
]

export function findScenario(text: string): Scenario {
  const normalized = text.toLowerCase()
  // O catch-all garante retorno; o "!" é seguro.
  return SCENARIOS.find((s) => s.matches(normalized))!
}
