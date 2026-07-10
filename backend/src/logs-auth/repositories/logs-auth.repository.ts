import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CriarLogAuthDto } from '../dto/criar-log-auth.dto';

@Injectable()
export class LogsAuthRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async criar(
    data: CriarLogAuthDto,
  ) {
    return this.prisma.logAuth.create({
      data,
    });
  }
}
