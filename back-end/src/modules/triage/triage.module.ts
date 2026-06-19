import { Module } from '@nestjs/common';
import { AiTriageProvider } from './ai-triage.provider';
import { TriageController } from './triage.controller';
import { TriageService } from './triage.service';

@Module({
  controllers: [TriageController],
  providers: [TriageService, AiTriageProvider],
  exports: [AiTriageProvider],
})
export class TriageModule {}
