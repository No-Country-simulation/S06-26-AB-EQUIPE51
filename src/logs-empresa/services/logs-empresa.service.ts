import { Injectable } from '@nestjs/common';

import { LogsEmpresaRepository } from '../repositories/logs-empresa.repository';
import { CriarLogEmpresaDto } from '../dto/criar-log-empresa.dto';

@Injectable()
export class LogsEmpresaService {
  constructor(
    private readonly repository: LogsEmpresaRepository,
  ) {}

  async registrar(
    dto: CriarLogEmpresaDto,
  ) {
    return this.repository.criar(dto);
  }

  async listarPorEmpresa(
    empresaId: string,
  ) {
    return this.repository.listarPorEmpresa(
      empresaId,
    );
  }
}