import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InsightsRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async buscarMapaTalentos() {
    const candidatos =
      await this.prisma.candidato.findMany({
        where: {
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
          OR: [
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
          ],
        },
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
