import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InsightsRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async buscarVagaPorId(id: string) {
    return this.prisma.vaga.findFirst({
      where: {
        id,
        ativo: true,
      },
      include: {
        empresa: {
          select: {
            usuarioId: true,
          },
        },
      },
    });
  }

  async buscarMapaTalentos(cargoDesejado?: string) {
    const where: any = {
      ativo: true,
      usuario: {
        ativo: true,
      },
      latitude: {
        not: null,
      },
      longitude: {
        not: null,
      },
    };

    if (cargoDesejado) {
      where.cargoDesejado = cargoDesejado;
    } else {
      where.OR = [
        {
          regiao: {
            contains: 'Florianopolis',
            mode: 'insensitive',
          },
        },
        {
          regiao: {
            contains: 'Floripa',
            mode: 'insensitive',
          },
        },
      ];
    }

    const candidatos =
      await this.prisma.candidato.findMany({
        where,
        select: {
          regiao: true,
          latitude: true,
          longitude: true,
        },
      });

    const regioes = candidatos
      .filter(
        (candidato) =>
          candidato.latitude !== null &&
          candidato.longitude !== null,
      )
      .reduce(
        (mapa, candidato) => {
          const regiao = candidato.regiao;

          if (!mapa.has(regiao)) {
            mapa.set(regiao, {
              regiao,
              concentracao: 0,
              cobertura_rede: 'Dado agregado',
              perfis_disponiveis: 0,
              lat: Number(candidato.latitude!.toFixed(6)),
              lon: Number(candidato.longitude!.toFixed(6)),
            });
          }

          const item = mapa.get(regiao)!;
          item.concentracao += 1;
          item.perfis_disponiveis += 1;

          return mapa;
        },
        new Map<
          string,
          {
            regiao: string;
            concentracao: number;
            cobertura_rede: string;
            perfis_disponiveis: number;
            lat: number;
            lon: number;
          }
        >(),
      );

    return [...regioes.values()];
  }
}
