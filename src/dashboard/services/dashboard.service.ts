import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';

import { PrismaService } from '../../prisma/prisma.service';

type AuthRequest = Request & {
  user?: {
    id?: string;
    role?: string;
  };
};

type RegistroDashboard = {
  id: string;
  tipo: string;
  acao: string;
  descricao: string;
  criadoEm: Date;
  referencia?: string;
};

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async listarUltimosRegistros(
    req: AuthRequest,
  ): Promise<RegistroDashboard[]> {
    const usuario = req.user;

    if (!usuario?.id || !usuario.role) {
      throw new ForbiddenException(
        'Usuario autenticado nao identificado.',
      );
    }

    if (usuario.role === 'ADMIN') {
      return this.listarRegistrosAdmin();
    }

    throw new ForbiddenException(
      'Apenas administradores podem acessar os registros do dashboard.',
    );
  }

  private async listarRegistrosEmpresa(
    usuarioId: string,
  ) {
    const empresa =
      await this.prisma.empresa.findFirst({
        where: {
          usuarioId,
          ativo: true,
        },
        select: {
          id: true,
        },
      });

    if (!empresa) {
      throw new NotFoundException(
        'Empresa logada nao encontrada.',
      );
    }

    const [logsEmpresa, logsVagas] =
      await Promise.all([
        this.prisma.logEmpresa.findMany({
          where: {
            empresaId: empresa.id,
          },
          orderBy: {
            criadoEm: 'desc',
          },
          take: 5,
          select: {
            id: true,
            acao: true,
            descricao: true,
            criadoEm: true,
          },
        }),
        this.prisma.logVaga.findMany({
          where: {
            vaga: {
              empresaId: empresa.id,
            },
          },
          orderBy: {
            criadoEm: 'desc',
          },
          take: 5,
          select: {
            id: true,
            acao: true,
            descricao: true,
            criadoEm: true,
            vaga: {
              select: {
                titulo: true,
              },
            },
          },
        }),
      ]);

    return [
      ...logsEmpresa.map((log) => ({
        ...log,
        tipo: 'EMPRESA',
      })),
      ...logsVagas.map((log) => ({
        id: log.id,
        tipo: 'VAGA',
        acao: log.acao,
        descricao: log.descricao,
        criadoEm: log.criadoEm,
        referencia: log.vaga.titulo,
      })),
    ]
      .sort(
        (a, b) =>
          b.criadoEm.getTime() -
          a.criadoEm.getTime(),
      )
      .slice(0, 5);
  }

  private async listarRegistrosCandidato(
    usuarioId: string,
  ) {
    const candidato =
      await this.prisma.candidato.findFirst({
        where: {
          usuarioId,
          ativo: true,
          usuario: {
            ativo: true,
          },
        },
        select: {
          id: true,
        },
      });

    if (!candidato) {
      throw new NotFoundException(
        'Candidato logado nao encontrado.',
      );
    }

    const logs =
      await this.prisma.logCandidato.findMany({
        where: {
          candidatoId: candidato.id,
        },
        orderBy: {
          criadoEm: 'desc',
        },
        take: 5,
        select: {
          id: true,
          acao: true,
          descricao: true,
          criadoEm: true,
        },
      });

    return logs.map((log) => ({
      ...log,
      tipo: 'CANDIDATO',
    }));
  }

  private async listarRegistrosAdmin() {
    const logs =
      await this.prisma.logAuth.findMany({
        orderBy: {
          criadoEm: 'desc',
        },
        take: 5,
        select: {
          id: true,
          acao: true,
          motivo: true,
          sucesso: true,
          criadoEm: true,
        },
      });

    return logs.map((log) => ({
      id: log.id,
      tipo: 'AUTH',
      acao: log.acao,
      descricao:
        log.motivo ||
        (log.sucesso
          ? 'Acao de autenticacao concluida.'
          : 'Acao de autenticacao recusada.'),
      criadoEm: log.criadoEm,
    }));
  }
}
