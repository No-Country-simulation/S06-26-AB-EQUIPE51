import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { MatchController } from './controllers/match.controller';
import { MatchRepository } from './repositories/match.repository';
import { MatchService } from './services/match.service';
import { DistanciaService } from './services/distancia.service';

@Module({
  controllers: [MatchController],
  providers: [PrismaService, MatchRepository, MatchService, DistanciaService],
  exports: [DistanciaService],
})
export class MatchModule {}
