import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { CriarVagaDto } from '../dto/criar-vaga.dto';

@Injectable()
export class VagaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CriarVagaDto) {
    return this.prisma.vaga.create({
      data: {
        empresaId: dto.empresaId,
        titulo: dto.titulo,
        cargo: dto.cargo,
        modalidade: dto.modalidade,
        nivel: dto.nivel,
        regiao: dto.regiao,
        latitude: dto.latitude,
        longitude: dto.longitude,
        skills: dto.skills,
      },

      include: {
        empresa: true,
      },
    });
  }

  async listar() {
    return this.prisma.vaga.findMany({
      where: {
        ativo: true,
      },

      include: {
        empresa: {
          select: {
            id: true,
            usuarioId: true,
            nomeEmpresa: true,
          },
        },
      },

      orderBy: {
        criadoEm: 'desc',
      },
    });
  }

  async buscarPorId(id: string) {
    return this.prisma.vaga.findFirst({
      where: {
        id,
        ativo: true,
      },

      include: {
        empresa: {
          select: {
            id: true,
            usuarioId: true,
            nomeEmpresa: true,
          },
        },
      },
    });
  }

  async listarPorEmpresa(empresaId: string) {
    return this.prisma.vaga.findMany({
      where: {
        empresaId,
        ativo: true,
      },

      include: {
        empresa: true,
      },

      orderBy: {
        criadoEm: 'desc',
      },
    });
  }

  async buscarEmpresaPorId(empresaId: string) {
    return this.prisma.empresa.findFirst({
      where: {
        id: empresaId,
        ativo: true,
      },
    });
  }

  async buscarEmpresaPorUsuarioId(usuarioId: string) {
    return this.prisma.empresa.findFirst({
      where: {
        usuarioId,
        ativo: true,
      },
    });
  }

  async buscarDuplicada(empresaId: string, titulo: string) {
    return this.prisma.vaga.findFirst({
      where: {
        empresaId,
        titulo,
        ativo: true,
      },
    });
  }

  async atualizar(id: string, data: any) {
    return this.prisma.vaga.update({
      where: {
        id,
      },

      data,

      include: {
        empresa: {
          select: {
            id: true,
            usuarioId: true,
            nomeEmpresa: true,
          },
        },
      },
    });
  }

  async remover(id: string) {
    return this.prisma.vaga.update({
      where: {
        id,
      },

      data: {
        ativo: false,
      },

      include: {
        empresa: {
          select: {
            id: true,
            usuarioId: true,
            nomeEmpresa: true,
          },
        },
      },
    });
  }
}
