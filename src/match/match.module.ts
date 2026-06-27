import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { UserOrIaAuthGuard } from '../auth/guards/user-or-ia-auth.guard';

import { MatchController } from './controllers/match.controller';
import { MatchRepository } from './repositories/match.repository';
import { MatchService } from './services/match.service';
import { DistanciaService } from './services/distancia.service';

@Module({
  imports: [AuthModule],
  controllers: [MatchController],
  providers: [
    PrismaService,
    MatchRepository,
    MatchService,
    DistanciaService,
    UserOrIaAuthGuard,
  ],
  exports: [DistanciaService],
})
export class MatchModule {}
