import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CriarLogCandidatoDto } from '../dto/criar-log-candidato.dto';

@Injectable()
export class LogsCandidatoRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async criar(
    data: CriarLogCandidatoDto,
  ) {
    return this.prisma.logCandidato.create({
      data,
    });
  }

  async listarPorCandidato(
    candidatoId: string,
  ) {
    return this.prisma.logCandidato.findMany({
      where: {
        candidatoId,
      },
      orderBy: {
        criadoEm: 'desc',
      },
    });
  }
}
