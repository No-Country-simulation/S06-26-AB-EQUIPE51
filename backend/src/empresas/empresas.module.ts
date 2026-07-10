import { Module } from '@nestjs/common';

import { EmpresasController } from './controllers/empresas.controller';
import { EmpresasService } from './services/empresas.service';
import { EmpresaRepository } from './repositories/empresa.repository';

import { LogsEmpresaService } from '../logs-empresa/services/logs-empresa.service';
import { LogsEmpresaRepository } from '../logs-empresa/repositories/logs-empresa.repository';

@Module({
  controllers: [EmpresasController],

  providers: [
    EmpresasService,
    EmpresaRepository,

    LogsEmpresaService,
    LogsEmpresaRepository,
  ],
})
export class EmpresasModule {}