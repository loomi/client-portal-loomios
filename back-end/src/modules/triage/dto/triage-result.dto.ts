import { ApiProperty } from '@nestjs/swagger';

export class TriageResultDto {
  @ApiProperty({ example: 'a1b2c3d4-...' })
  id!: string;

  @ApiProperty({ example: 'a1b2c3d4-...' })
  feedbackId!: string;

  @ApiProperty({ example: 'feature', description: 'bug | feature | design | question' })
  category!: string;

  @ApiProperty({ example: 'HIGH', description: 'LOW | MEDIUM | HIGH | CRITICAL' })
  urgency!: string;

  @ApiProperty({ example: 2, description: '1 = mais urgente, 5 = menor prioridade' })
  priority!: number;

  @ApiProperty({ example: 'po', description: 'developer | po | designer | pm' })
  suggestedOwner!: string;

  @ApiProperty({ nullable: true, type: String })
  matchedTaskId!: string | null;

  @ApiProperty({ example: 'Feedback identificado como solicitação de nova funcionalidade...' })
  triageReason!: string;

  @ApiProperty()
  createdAt!: Date;
}
