import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@modules/auth/strategies/jwt.strategy';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackQueryDto } from './dto/feedback-query.dto';
import { FeedbackEntity, PaginatedFeedbacksDto } from './dto/feedback.entity';
import { FeedbacksService } from './feedbacks.service';

@ApiTags('feedbacks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'projectId', description: 'UUID do projeto' })
  @ApiOperation({ summary: 'Enviar feedback para um projeto' })
  @ApiCreatedResponse({ type: FeedbackEntity })
  async create(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateFeedbackDto,
  ): Promise<FeedbackEntity> {
    const feedback = await this.feedbacksService.create(projectId, user.id, dto);
    return FeedbackEntity.fromPrisma({ ...feedback, triage: null, ticket: null });
  }

  @Get()
  @ApiParam({ name: 'projectId', description: 'UUID do projeto' })
  @ApiOperation({ summary: 'Listar feedbacks do projeto com paginação e filtro de status' })
  @ApiOkResponse({ type: PaginatedFeedbacksDto })
  findAll(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: FeedbackQueryDto,
  ): Promise<PaginatedFeedbacksDto> {
    return this.feedbacksService.findAllByProject(projectId, user.id, query);
  }

  @Get(':feedbackId')
  @ApiParam({ name: 'projectId', description: 'UUID do projeto' })
  @ApiParam({ name: 'feedbackId', description: 'UUID do feedback' })
  @ApiOperation({ summary: 'Detalhe de um feedback com triagem e ticket' })
  @ApiOkResponse({ type: FeedbackEntity })
  findOne(
    @Param('projectId', new ParseUUIDPipe()) _projectId: string,
    @Param('feedbackId', new ParseUUIDPipe()) feedbackId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<FeedbackEntity> {
    return this.feedbacksService.findOne(feedbackId, user.id);
  }
}
