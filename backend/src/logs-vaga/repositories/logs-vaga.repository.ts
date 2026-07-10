import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LogsVagaRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async criar(data: any) {
    return this.prisma.logVaga.create({
      data,
    });
  }

  async listarPorVaga(
    vagaId: string,
  ) {
    return this.prisma.logVaga.findMany({
      where: {
        vagaId,
      },

      orderBy: {
        criadoEm: 'desc',
      },
    });
  }
}