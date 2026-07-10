import { Injectable } from '@nestjs/common';

import type { Request } from 'express';

import { CriarLogAcessoCandidatoDto } from '../dto/criar-log-acesso-candidato.dto';
import { LogsAcessoCandidatoRepository } from '../repositories/logs-acesso-candidato.repository';

@Injectable()
export class LogsAcessoCandidatoService {
  constructor(
    private readonly repository: LogsAcessoCandidatoRepository,
  ) {}

  private getIpOrigem(
    req?: Request,
  ) {
    if (!req) {
      return undefined;
    }

    return String(
      req.headers['x-forwarded-for'] ||
        req.ip ||
        req.socket.remoteAddress,
    );
  }

  async registrar(
    dto: CriarLogAcessoCandidatoDto,
  ) {
    return this.repository.criar(dto);
  }

  async registrarVisualizacao(
    params: {
      candidatoId: string;
      usuarioResponsavel: string;
      finalidade: string;
      req?: Request;
    },
  ) {
    return this.registrar({
      candidatoId: params.candidatoId,
      usuarioResponsavel:
        params.usuarioResponsavel,
      finalidade: params.finalidade,
      ipOrigem: this.getIpOrigem(params.req),
      userAgent: params.req?.headers[
        'user-agent'
      ] as string | undefined,
    });
  }
}
