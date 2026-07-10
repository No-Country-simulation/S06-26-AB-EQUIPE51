import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CriarEmpresaDto } from '../dto/criar-empresa.dto';

@Injectable()
export class EmpresaRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async criar(dto: CriarEmpresaDto) {
    return this.prisma.empresa.create({
      data: {
        nomeEmpresa: dto.nomeEmpresa,

        metaDiversidade:
          dto.metaDiversidade,

        gruposPrioritarios:
          dto.gruposPrioritarios,

        usuario: {
          create: {
            nome: dto.nome,
            email: dto.email,
            senha: dto.senha,
            role: 'EMPRESA',
          },
        },
      },

      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            role: true,
            ativo: true,
            criadoEm: true,
            atualizadoEm: true,
          },
        },
      },
    });
  }

  async buscarUsuarioPorEmail(
    email: string,
  ) {
    return this.prisma.usuario.findUnique({
      where: {
        email,
      },
    });
  }

  async buscarPorNomeEmpresa(
    nomeEmpresa: string,
  ) {
    return this.prisma.empresa.findUnique({
      where: {
        nomeEmpresa,
      },
    });
  }

  async listar() {
    return this.prisma.empresa.findMany({
      where: {
        ativo: true,
      },

      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            role: true,
            ativo: true,
            criadoEm: true,
            atualizadoEm: true,
          },
        },
      },

      orderBy: {
        criadoEm: 'desc',
      },
    });
  }

  async buscarPorUsuarioId(
    usuarioId: string,
  ) {
    return this.prisma.empresa.findFirst({
      where: {
        usuarioId,
        ativo: true,
      },

      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            role: true,
            ativo: true,
            criadoEm: true,
            atualizadoEm: true,
          },
        },
      },
    });
  }

  async buscarPorId(id: string) {
    return this.prisma.empresa.findFirst({
      where: {
        id,
        ativo: true,
      },

      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            role: true,
            ativo: true,
            criadoEm: true,
            atualizadoEm: true,
          },
        },
      },
    });
  }

  async atualizar(
    id: string,
    data: any,
  ) {
    return this.prisma.empresa.update({
      where: {
        id,
      },

      data,

      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            role: true,
            ativo: true,
            criadoEm: true,
            atualizadoEm: true,
          },
        },
      },
    });
  }

  async remover(id: string) {
    return this.prisma.empresa.update({
      where: {
        id,
      },

      data: {
        ativo: false,
      },
    });
  }
}
