import { Module } from '@nestjs/common';

import { VagasController } from './controllers/vagas.controller';
import { VagasService } from './services/vagas.service';
import { VagaRepository } from './repositories/vaga.repository';

import { LogsVagaService } from '../logs-vaga/services/logs-vaga.service';
import { LogsVagaRepository } from '../logs-vaga/repositories/logs-vaga.repository';

@Module({
  controllers: [VagasController],

  providers: [
    VagasService,
    VagaRepository,

    LogsVagaService,
    LogsVagaRepository,
  ],
})
export class VagasModule {}