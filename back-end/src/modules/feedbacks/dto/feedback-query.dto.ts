import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const FEEDBACK_STATUSES = [
  'RECEIVED',
  'ANALYZING',
  'APPROVED',
  'REJECTED',
  'RESOLVED',
] as const;

export class FeedbackQueryDto {
  @ApiProperty({
    description: 'Filtrar por status do feedback',
    enum: FEEDBACK_STATUSES,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(FEEDBACK_STATUSES)
  status?: string;

  @ApiProperty({ description: 'Página (começa em 1)', required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Itens por página (máx 50)', required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20;
}
