import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CandidatoController } from './controllers/candidato.controller';
import { CandidatoService } from './services/candidato.service';
import { CandidatoRepository } from './repositories/candidato.repository';
import { LogsCandidatoService } from '../logs-candidato/services/logs-candidato.service';
import { LogsCandidatoRepository } from '../logs-candidato/repositories/logs-candidato.repository';
import { LogsAcessoCandidatoService } from '../logs-acesso-candidato/services/logs-acesso-candidato.service';
import { LogsAcessoCandidatoRepository } from '../logs-acesso-candidato/repositories/logs-acesso-candidato.repository';

@Module({
  controllers: [CandidatoController],
  providers: [
    PrismaService,
    CandidatoRepository,
    CandidatoService,
    LogsCandidatoService,
    LogsCandidatoRepository,
    LogsAcessoCandidatoService,
    LogsAcessoCandidatoRepository,
  ],
  exports: [CandidatoService],
})
export class CandidatoModule {}
