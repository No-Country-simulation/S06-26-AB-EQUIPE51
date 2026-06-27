import { Injectable } from '@nestjs/common';

import { InsightsRepository } from '../repositories/insights.repository';
import { InsightsResponseDto } from '../dto/insights-response.dto';

@Injectable()
export class InsightsService {
  constructor(
    private readonly repository: InsightsRepository,
  ) {}

  async buscarInsights(): Promise<InsightsResponseDto> {
    const regioes =
      await this.repository.buscarMapaTalentos();

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
