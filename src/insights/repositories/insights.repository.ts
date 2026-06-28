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
          usuario: {
            select: {
              nome: true,
            },
          },
          latitude: true,
          longitude: true,
        },
      });

    return candidatos
      .filter(
        (candidato) =>
          candidato.latitude !== null &&
          candidato.longitude !== null,
      )
      .map((candidato, index) => ({
        regiao:
          candidato.usuario.nome ||
          `Usuario ${index + 1}`,
        concentracao: 1,
        cobertura_rede: 'Dado agregado',
        perfis_disponiveis: 1,
        lat: Number(candidato.latitude!.toFixed(6)),
        lon: Number(candidato.longitude!.toFixed(6)),
      }));
  }
}
