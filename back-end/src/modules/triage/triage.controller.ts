import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
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
import { TriageResultDto } from './dto/triage-result.dto';
import { TriageService } from './triage.service';

@ApiTags('triage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('feedbacks/:feedbackId/triage')
export class TriageController {
  constructor(private readonly triageService: TriageService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'feedbackId', description: 'UUID do feedback a triar' })
  @ApiOperation({
    summary: 'Executar triagem de IA no feedback',
    description:
      'Classifica o feedback em categoria, urgência, prioridade e dono sugerido. ' +
      'Faz match com tasks em andamento do projeto. Atualiza status do feedback para ANALYZING.',
  })
  @ApiCreatedResponse({ type: TriageResultDto })
  triage(
    @Param('feedbackId', new ParseUUIDPipe()) feedbackId: string,
  ): Promise<TriageResultDto> {
    return this.triageService.triage(feedbackId);
  }

  @Get()
  @ApiParam({ name: 'feedbackId', description: 'UUID do feedback' })
  @ApiOperation({ summary: 'Consultar resultado da triagem de um feedback' })
  @ApiOkResponse({ type: TriageResultDto })
  getResult(
    @Param('feedbackId', new ParseUUIDPipe()) feedbackId: string,
  ): Promise<TriageResultDto> {
    return this.triageService.getResult(feedbackId);
  }
}
