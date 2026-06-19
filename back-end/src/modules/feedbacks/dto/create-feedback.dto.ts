import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({
    description: 'Texto livre do feedback do cliente',
    example: 'Gostaria que o dashboard mostrasse o consumo comparado ao mês anterior',
    minLength: 10,
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  content!: string;
}
