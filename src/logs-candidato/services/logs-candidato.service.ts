import { Injectable } from '@nestjs/common';

import { CriarLogCandidatoDto } from '../dto/criar-log-candidato.dto';
import { LogsCandidatoRepository } from '../repositories/logs-candidato.repository';

@Injectable()
export class LogsCandidatoService {
  constructor(
    private readonly repository: LogsCandidatoRepository,
  ) {}

  async registrar(
    dto: CriarLogCandidatoDto,
  ) {
    return this.repository.criar(dto);
  }

  async listarPorCandidato(
    candidatoId: string,
  ) {
    return this.repository.listarPorCandidato(
      candidatoId,
    );
  }
}
