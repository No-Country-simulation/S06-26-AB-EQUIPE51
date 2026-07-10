import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { UserOrIaAuthGuard } from '../auth/guards/user-or-ia-auth.guard';

import { VagasController } from './controllers/vagas.controller';
import { VagasService } from './services/vagas.service';
import { VagaRepository } from './repositories/vaga.repository';

import { LogsVagaService } from '../logs-vaga/services/logs-vaga.service';
import { LogsVagaRepository } from '../logs-vaga/repositories/logs-vaga.repository';

@Module({
  imports: [AuthModule],
  controllers: [VagasController],

  providers: [
    VagasService,
    VagaRepository,

    LogsVagaService,
    LogsVagaRepository,
    UserOrIaAuthGuard,
  ],
})
export class VagasModule {}
