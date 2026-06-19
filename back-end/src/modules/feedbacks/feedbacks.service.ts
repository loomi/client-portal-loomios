import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Feedback } from '@prisma/client';

import { PrismaService } from '@prisma-svc/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackQueryDto } from './dto/feedback-query.dto';
import { FeedbackEntity, PaginatedFeedbacksDto } from './dto/feedback.entity';

@Injectable()
export class FeedbacksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    projectId: string,
    clientId: string,
    dto: CreateFeedbackDto,
  ): Promise<Feedback> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, clientId },
    });
    if (!project) throw new NotFoundException('Projeto não encontrado');

    return this.prisma.feedback.create({
      data: {
        projectId,
        clientId,
        content: dto.content,
        status: 'RECEIVED',
      },
    });
  }

  async findAllByProject(
    projectId: string,
    clientId: string,
    query: FeedbackQueryDto,
  ): Promise<PaginatedFeedbacksDto> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, clientId },
    });
    if (!project) throw new NotFoundException('Projeto não encontrado');

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      projectId,
      clientId,
      ...(query.status ? { status: query.status } : {}),
    };

    const [feedbacks, total] = await this.prisma.$transaction([
      this.prisma.feedback.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          triage: true,
          ticket: true,
        },
      }),
      this.prisma.feedback.count({ where }),
    ]);

    return {
      data: feedbacks.map((f) => FeedbackEntity.fromPrisma(f)),
      total,
      page,
      limit,
    };
  }

  async findOne(feedbackId: string, clientId: string): Promise<FeedbackEntity> {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id: feedbackId },
      include: {
        triage: true,
        ticket: true,
      },
    });

    if (!feedback) throw new NotFoundException('Feedback não encontrado');
    if (feedback.clientId !== clientId) {
      throw new ForbiddenException('Acesso negado');
    }

    return FeedbackEntity.fromPrisma(feedback);
  }
}
