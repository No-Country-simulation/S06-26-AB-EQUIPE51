import { Injectable } from '@nestjs/common';

import { LogsVagaRepository } from '../repositories/logs-vaga.repository';

import { CriarLogVagaDto } from '../dto/criar-log-vaga.dto';

@Injectable()
export class LogsVagaService {
  constructor(
    private readonly repository: LogsVagaRepository,
  ) {}

  async registrar(
    dto: CriarLogVagaDto,
  ) {
    return this.repository.criar(dto);
  }

  async listarPorVaga(
    vagaId: string,
  ) {
    return this.repository.listarPorVaga(
      vagaId,
    );
  }
}