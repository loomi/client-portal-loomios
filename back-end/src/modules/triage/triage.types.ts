export type FeedbackCategory = 'bug' | 'feature' | 'design' | 'question';
export type FeedbackUrgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type SuggestedOwner = 'developer' | 'po' | 'designer' | 'pm';

export interface TriageTaskInput {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
}

export interface AiTriageInput {
  feedbackContent: string;
  projectTasks: TriageTaskInput[];
}

export interface AiTriageOutput {
  category: FeedbackCategory;
  urgency: FeedbackUrgency;
  /** 1 = mais urgente, 5 = menor prioridade */
  priority: number;
  suggestedOwner: SuggestedOwner;
  triageReason: string;
  /** ID da task existente com maior relevância semântica, ou null se nenhuma for adequada */
  matchedTaskId: string | null;
}
