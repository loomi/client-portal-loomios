import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@prisma-svc/prisma.service';
import { AiTriageProvider } from './ai-triage.provider';
import { TriageResultDto } from './dto/triage-result.dto';

@Injectable()
export class TriageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiTriage: AiTriageProvider,
  ) {}

  async triage(feedbackId: string): Promise<TriageResultDto> {
    // Carrega feedback com todas as tasks do projeto para o match
    const feedback = await this.prisma.feedback.findUnique({
      where: { id: feedbackId },
      include: {
        triage: true,
        project: {
          include: {
            tasks: {
              select: {
                id: true,
                title: true,
                description: true,
                type: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!feedback) throw new NotFoundException('Feedback não encontrado');

    if (feedback.triage) {
      throw new ConflictException(
        'Este feedback já foi triado. Consulte o resultado existente.',
      );
    }

    const result = this.aiTriage.analyze({
      feedbackContent: feedback.content,
      projectTasks: feedback.project.tasks,
    });

    // Persiste a triagem e atualiza o status do feedback em uma transação
    const [triageRecord] = await this.prisma.$transaction([
      this.prisma.feedbackTriage.create({
        data: {
          feedbackId,
          category: result.category,
          urgency: result.urgency,
          priority: result.priority,
          suggestedOwner: result.suggestedOwner,
          triageReason: result.triageReason,
          matchedTaskId: result.matchedTaskId ?? null,
        },
      }),
      this.prisma.feedback.update({
        where: { id: feedbackId },
        data: { status: 'ANALYZING' },
      }),
    ]);

    return {
      id: triageRecord.id,
      feedbackId: triageRecord.feedbackId,
      category: triageRecord.category,
      urgency: triageRecord.urgency,
      priority: triageRecord.priority,
      suggestedOwner: triageRecord.suggestedOwner,
      matchedTaskId: triageRecord.matchedTaskId,
      triageReason: triageRecord.triageReason,
      createdAt: triageRecord.createdAt,
    };
  }

  async getResult(feedbackId: string): Promise<TriageResultDto> {
    const triage = await this.prisma.feedbackTriage.findUnique({
      where: { feedbackId },
    });

    if (!triage) {
      throw new NotFoundException(
        'Triagem não encontrada para este feedback. Execute POST /triage primeiro.',
      );
    }

    return {
      id: triage.id,
      feedbackId: triage.feedbackId,
      category: triage.category,
      urgency: triage.urgency,
      priority: triage.priority,
      suggestedOwner: triage.suggestedOwner,
      matchedTaskId: triage.matchedTaskId,
      triageReason: triage.triageReason,
      createdAt: triage.createdAt,
    };
  }
}
