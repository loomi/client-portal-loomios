export type Urgency = 'Alta' | 'Média' | 'Baixa'

export type QuestionOption = { id: string; label: string }

export type Question = {
  id: string
  prompt: string
  options: QuestionOption[]
}

export type Answers = Record<string, string>

export type TriageResult =
  | {
      kind: 'ticket'
      resumo: string
      categoria: string
      urgencia: Urgency
      match?: string
      status: string[] // etapas em ordem; a última é a atual
    }
  | {
      kind: 'no'
      resumo: string
      motivo: string
    }

export type Scenario = {
  id: string
  matches: (text: string) => boolean
  intro: string
  questions: Question[]
  buildResult?: (answers: Answers) => TriageResult
}

export type ChatMessage =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'assistant'; text: string }
  | { id: string; role: 'assistant'; result: TriageResult }
