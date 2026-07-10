import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MatchRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async buscarEmpresaPorId(
    id: string,
  ) {
    return this.prisma.empresa.findFirst({
      where: {
        id,
        ativo: true,
      },
      include: {
        usuario: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async listarCandidatosAtivos() {
    return this.prisma.candidato.findMany({
      where: {
        ativo: true,
        usuario: {
          ativo: true,
        },
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });
  }
}
