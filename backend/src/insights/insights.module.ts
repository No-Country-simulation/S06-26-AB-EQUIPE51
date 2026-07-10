import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { InsightsController } from './controllers/insights.controller';
import { InsightsRepository } from './repositories/insights.repository';
import { InsightsService } from './services/insights.service';

@Module({
  imports: [PrismaModule],
  controllers: [InsightsController],
  providers: [
    InsightsRepository,
    InsightsService,
  ],
})
export class InsightsModule {}
