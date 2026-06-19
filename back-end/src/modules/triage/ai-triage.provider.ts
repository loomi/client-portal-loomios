import { Injectable } from '@nestjs/common';

import type {
  AiTriageInput,
  AiTriageOutput,
  FeedbackCategory,
  FeedbackUrgency,
  SuggestedOwner,
  TriageTaskInput,
} from './triage.types';

// ─── keyword maps ─────────────────────────────────────────────────────────────

const BUG_KEYWORDS =
  /\b(erro\w*|bug|falha\w*|quebr\w+|nao funciona|nao esta funcionando|crash\w*|travou|parou|parada|indispon\w+|fora do ar|corrompid\w*|incorret\w+|errad\w+|duplicad\w+)\b/;

const DESIGN_KEYWORDS =
  /\b(visual|layout|cor|fonte|aparência|aparencia|interface|tela|botao|botão|ícone|icone|espaço|espaco|design|ui|ux|estilo|alinhamento|responsivo|mobile|tamanho|desalinhad\w+|sobreposto|sobrepost\w+)\b/;

const QUESTION_KEYWORDS =
  /\b(quando\s+(ser[aá]|vai|vem|estar[aá]|fica|ter[aá])|como\s+funciona|como\s+faz|por\s+que\b|porque\b|duvida|dúvida|pergunta|me\s+explica|qual\s+[eé]|quem\s+[eé]|onde\s+(est[aá]|fica)|tem\s+previs[aã]o)\b/;

const FEATURE_KEYWORDS =
  /\b(gostaria|quero|adicionar|funcionalidade|criar|implementar|seria\s+\w+|poderia|preciso\s+de|precisamos|incluir|export\w+|integrar|automatizar|notificac\w+|relat\w+|comparativ\w+|historico|novo\s+\w+|nova\s+\w+)\b/;

const CRITICAL_KEYWORDS =
  /\b(bloqueando|bloqueio|impossível|impossivel|crítico|critico|urgente|parado|producao|produção|impede|não consigo usar|nao consigo usar|paralisa|emperrado|travado completamente)\b/;

const HIGH_KEYWORDS =
  /\b(importante|prejudicando|dificulta|nao consigo|não consigo|travando|impactando|prejudica|atrapalha|compromete)\b/;

const LOW_KEYWORDS =
  /\b(quando puder|detalhe|pequeno|melhoria pequena|sugestão|sugestao|seria interessante|não é urgente|nao e urgente|se possível|se possivel|opcional|futuramente)\b/;

// ─── category labels ──────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  bug: 'falha ou bug',
  feature: 'solicitação de nova funcionalidade',
  design: 'melhoria de design/UX',
  question: 'dúvida ou pergunta',
};

const URGENCY_LABELS: Record<FeedbackUrgency, string> = {
  LOW: 'baixa urgência',
  MEDIUM: 'urgência moderada',
  HIGH: 'alta urgência',
  CRITICAL: 'urgência crítica',
};

const OWNER_LABELS: Record<SuggestedOwner, string> = {
  developer: 'time de desenvolvimento',
  po: 'Product Owner',
  designer: 'time de design',
  pm: 'gerente de projetos (PM)',
};

// ─── priority matrix ──────────────────────────────────────────────────────────
// urgency × category → priority 1–5 (1 = mais urgente)

const PRIORITY_MATRIX: Record<FeedbackUrgency, Record<FeedbackCategory, number>> = {
  CRITICAL: { bug: 1, feature: 1, design: 2, question: 2 },
  HIGH:     { bug: 1, feature: 2, design: 2, question: 3 },
  MEDIUM:   { bug: 2, feature: 3, design: 3, question: 4 },
  LOW:      { bug: 3, feature: 4, design: 4, question: 5 },
};

// ─── stop words para tokenização ─────────────────────────────────────────────

const STOP_WORDS = new Set([
  'para', 'com', 'que', 'por', 'uma', 'isso', 'mais', 'como',
  'quando', 'onde', 'este', 'esta', 'esse', 'essa', 'pelo', 'pela',
  'nao', 'não', 'pois', 'mas', 'muito', 'bem', 'ser', 'ter',
]);

// ─── provider ─────────────────────────────────────────────────────────────────

/**
 * Simula um provider de IA para triagem de feedbacks.
 * Usa heurísticas de keyword-matching e token-overlap para replicar o
 * comportamento esperado de um LLM, mantendo a interface `AiTriageInput →
 * AiTriageOutput` — basta trocar esta implementação por uma chamada real ao
 * Claude API sem alterar o serviço que a consome.
 */
@Injectable()
export class AiTriageProvider {
  analyze(input: AiTriageInput): AiTriageOutput {
    const normalized = this.normalize(input.feedbackContent);

    const category = this.detectCategory(normalized);
    const urgency = this.detectUrgency(normalized);
    const priority = PRIORITY_MATRIX[urgency][category];
    const suggestedOwner = this.mapOwner(category);
    const matchedTaskId = this.matchTask(normalized, input.projectTasks);

    const matchedTask = matchedTaskId
      ? input.projectTasks.find((t) => t.id === matchedTaskId) ?? null
      : null;

    const triageReason = this.buildReason(
      category,
      urgency,
      suggestedOwner,
      matchedTask,
    );

    return { category, urgency, priority, suggestedOwner, triageReason, matchedTaskId };
  }

  // ── detecção de categoria ──────────────────────────────────────────────────

  private detectCategory(content: string): FeedbackCategory {
    // Design tem keywords muito específicos (interface, layout, responsivo) — checa antes de bug
    // para não confundir "o layout quebra" com um bug técnico
    if (DESIGN_KEYWORDS.test(content)) return 'design';
    if (BUG_KEYWORDS.test(content)) return 'bug';
    if (QUESTION_KEYWORDS.test(content)) return 'question';
    if (FEATURE_KEYWORDS.test(content)) return 'feature';
    return 'question';
  }

  // ── detecção de urgência ───────────────────────────────────────────────────

  private detectUrgency(content: string): FeedbackUrgency {
    if (CRITICAL_KEYWORDS.test(content)) return 'CRITICAL';
    if (HIGH_KEYWORDS.test(content)) return 'HIGH';
    if (LOW_KEYWORDS.test(content)) return 'LOW';
    return 'MEDIUM';
  }

  // ── roteamento de owner por categoria ─────────────────────────────────────

  private mapOwner(category: FeedbackCategory): SuggestedOwner {
    const map: Record<FeedbackCategory, SuggestedOwner> = {
      bug: 'developer',
      feature: 'po',
      design: 'designer',
      question: 'pm',
    };
    return map[category];
  }

  // ── match semântico com tasks ──────────────────────────────────────────────

  private matchTask(
    normalizedContent: string,
    tasks: TriageTaskInput[],
  ): string | null {
    const contentTokens = this.tokenize(normalizedContent);
    if (!contentTokens.size) return null;

    let bestScore = 0;
    let bestId: string | null = null;

    for (const task of tasks) {
      // tasks concluídas não recebem novos vínculos
      if (task.status === 'DONE') continue;

      const taskText = `${task.title} ${task.description ?? ''}`;
      const taskTokens = this.tokenize(this.normalize(taskText));
      const score = this.jaccardScore(contentTokens, taskTokens);

      if (score > bestScore) {
        bestScore = score;
        bestId = task.id;
      }
    }

    // threshold: pelo menos 15% de overlap para considerar relevante
    return bestScore >= 0.15 ? bestId : null;
  }

  // ── raciocínio em linguagem natural ───────────────────────────────────────

  private buildReason(
    category: FeedbackCategory,
    urgency: FeedbackUrgency,
    owner: SuggestedOwner,
    matchedTask: TriageTaskInput | null,
  ): string {
    const parts: string[] = [
      `Feedback identificado como ${CATEGORY_LABELS[category]} com ${URGENCY_LABELS[urgency]}.`,
      `Roteado para o ${OWNER_LABELS[owner]}.`,
    ];

    if (matchedTask) {
      parts.push(
        `Correspondência encontrada com a task "${matchedTask.title}" (status: ${matchedTask.status}) — recomenda-se vincular ao invés de abrir uma nova task.`,
      );
    } else {
      parts.push(
        'Nenhuma task existente com correspondência relevante foi encontrada; uma nova task poderá ser criada após aprovação.',
      );
    }

    return parts.join(' ');
  }

  // ── utilitários de texto ──────────────────────────────────────────────────

  /** Remove acentos e converte para minúsculas. */
  private normalize(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }

  /** Tokeniza em palavras com comprimento ≥ 4 e remove stop words. */
  private tokenize(text: string): Set<string> {
    return new Set(
      text
        .split(/\W+/)
        .filter((t) => t.length >= 4 && !STOP_WORDS.has(t)),
    );
  }

  /** Similaridade de Jaccard: |A ∩ B| / |A ∪ B| */
  private jaccardScore(a: Set<string>, b: Set<string>): number {
    if (!a.size || !b.size) return 0;

    let intersection = 0;
    for (const token of a) {
      if (b.has(token)) intersection++;
    }

    const union = a.size + b.size - intersection;
    return intersection / union;
  }
}
