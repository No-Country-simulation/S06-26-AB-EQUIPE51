import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CriarLogAcessoCandidatoDto } from '../dto/criar-log-acesso-candidato.dto';

@Injectable()
export class LogsAcessoCandidatoRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async criar(
    data: CriarLogAcessoCandidatoDto,
  ) {
    return this.prisma.logAcessoCandidato.create({
      data,
    });
  }
}
