import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';

import { InsightsRepository } from '../repositories/insights.repository';
import { InsightsResponseDto } from '../dto/insights-response.dto';

@Injectable()
export class InsightsService {
  constructor(
    private readonly repository: InsightsRepository,
  ) {}

  private validarAcessoVaga(vaga: any, req?: Request) {
    const usuario = (req as any)?.user;

    if (!usuario || usuario.role === 'ADMIN') {
      return;
    }

    if (vaga.empresa.usuarioId === usuario.id) {
      return;
    }

    throw new ForbiddenException(
      'Voce nao possui permissao para acessar insights desta vaga.',
    );
  }

  async buscarInsights(
    vagaId?: string,
    req?: Request,
  ): Promise<InsightsResponseDto> {
    let cargoDesejado: string | undefined;

    if (vagaId) {
      const vaga =
        await this.repository.buscarVagaPorId(vagaId);

      if (!vaga) {
        throw new NotFoundException('Vaga nao encontrada.');
      }

      this.validarAcessoVaga(vaga, req);

      cargoDesejado = vaga.cargo;
    }

    const regioes =
      await this.repository.buscarMapaTalentos(cargoDesejado);

    return {
      mapa_talentos: regioes,
      total_regioes: regioes.length,
      total_candidatos: regioes.reduce(
        (total, regiao) =>
          total + regiao.perfis_disponiveis,
        0,
      ),
    };
  }
}
