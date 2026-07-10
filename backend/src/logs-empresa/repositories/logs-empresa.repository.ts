import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LogsEmpresaRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async criar(data: any) {
    return this.prisma.logEmpresa.create({
      data,
    });
  }

  async listarPorEmpresa(
    empresaId: string,
  ) {
    return this.prisma.logEmpresa.findMany({
      where: {
        empresaId,
      },
      orderBy: {
        criadoEm: 'desc',
      },
    });
  }
}