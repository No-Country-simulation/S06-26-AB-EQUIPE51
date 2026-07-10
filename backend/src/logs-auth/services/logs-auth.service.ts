import { Injectable } from '@nestjs/common';

import type { Request } from 'express';

import { LogsAuthRepository } from '../repositories/logs-auth.repository';
import { CriarLogAuthDto } from '../dto/criar-log-auth.dto';

@Injectable()
export class LogsAuthService {
  constructor(
    private readonly repository: LogsAuthRepository,
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

  private mascararEmail(
    email?: string,
  ) {
    if (!email) {
      return undefined;
    }

    const [nome, dominio] =
      email.toLowerCase().split('@');

    if (!nome || !dominio) {
      return email.toLowerCase();
    }

    return `${nome.slice(0, 2)}***@${dominio}`;
  }

  async registrar(
    dto: CriarLogAuthDto,
  ) {
    return this.repository.criar(dto);
  }

  async registrarLogin(
    params: {
      usuarioId?: string;
      email?: string;
      sucesso: boolean;
      motivo?: string;
      req?: Request;
    },
  ) {
    return this.registrar({
      usuarioId: params.usuarioId,
      acao: params.sucesso
        ? 'LOGIN_SUCESSO'
        : 'LOGIN_FALHA',
      identificador:
        this.mascararEmail(params.email),
      sucesso: params.sucesso,
      motivo: params.motivo,
      ipOrigem: this.getIpOrigem(params.req),
      userAgent: params.req?.headers[
        'user-agent'
      ] as string | undefined,
    });
  }

  async registrarRefresh(
    params: {
      usuarioId?: string;
      sucesso: boolean;
      motivo?: string;
      req?: Request;
    },
  ) {
    return this.registrar({
      usuarioId: params.usuarioId,
      acao: params.sucesso
        ? 'REFRESH_SUCESSO'
        : 'REFRESH_FALHA',
      sucesso: params.sucesso,
      motivo: params.motivo,
      ipOrigem: this.getIpOrigem(params.req),
      userAgent: params.req?.headers[
        'user-agent'
      ] as string | undefined,
    });
  }
}
