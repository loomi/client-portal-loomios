import { ApiProperty } from '@nestjs/swagger';
import { Feedback, FeedbackTriage, Ticket } from '@prisma/client';

type FeedbackWithRelations = Feedback & {
  triage: FeedbackTriage | null;
  ticket: Ticket | null;
};

class TriageSummary {
  @ApiProperty({ example: 'feature' })
  category!: string;

  @ApiProperty({ example: 'HIGH' })
  urgency!: string;

  @ApiProperty({ example: 2 })
  priority!: number;

  @ApiProperty({ example: 'po' })
  suggestedOwner!: string;

  @ApiProperty({ nullable: true, type: String })
  matchedTaskId!: string | null;

  @ApiProperty({ example: 'Pedido de melhoria de UX alinhado com task em andamento' })
  triageReason!: string;
}

class TicketSummary {
  @ApiProperty({ example: 'APPROVED' })
  decision!: string;

  @ApiProperty({ nullable: true, type: String })
  reason!: string | null;

  @ApiProperty({ example: 'pm@loomi.com' })
  decidedBy!: string;

  @ApiProperty()
  decidedAt!: Date;
}

export class FeedbackEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  projectId!: string;

  @ApiProperty()
  clientId!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty({
    example: 'RECEIVED',
    description: 'RECEIVED | ANALYZING | APPROVED | REJECTED | RESOLVED',
  })
  status!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ nullable: true, type: TriageSummary })
  triage!: TriageSummary | null;

  @ApiProperty({ nullable: true, type: TicketSummary })
  ticket!: TicketSummary | null;

  static fromPrisma(f: FeedbackWithRelations): FeedbackEntity {
    return Object.assign(new FeedbackEntity(), {
      id: f.id,
      projectId: f.projectId,
      clientId: f.clientId,
      content: f.content,
      status: f.status,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
      triage: f.triage
        ? {
            category: f.triage.category,
            urgency: f.triage.urgency,
            priority: f.triage.priority,
            suggestedOwner: f.triage.suggestedOwner,
            matchedTaskId: f.triage.matchedTaskId,
            triageReason: f.triage.triageReason,
          }
        : null,
      ticket: f.ticket
        ? {
            decision: f.ticket.decision,
            reason: f.ticket.reason,
            decidedBy: f.ticket.decidedBy,
            decidedAt: f.ticket.decidedAt,
          }
        : null,
    });
  }
}

export class PaginatedFeedbacksDto {
  @ApiProperty({ type: FeedbackEntity, isArray: true })
  data!: FeedbackEntity[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;
}
