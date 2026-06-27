import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CriarCandidatoDto } from '../dto/criar-candidato.dto';
import { AtualizarCandidatoDto } from '../dto/atualizar-candidato.dto';

@Injectable()
export class CandidatoRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private readonly includeUsuario = {
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
  };

  async criar(
    data: CriarCandidatoDto,
  ) {
    const {
      nome,
      email,
      senha,
      ...perfil
    } = data;

    return this.prisma.candidato.create({
      data: {
        ...perfil,
        usuario: {
          create: {
            nome,
            email,
            senha,
            role: 'CANDIDATO',
          },
        },
      },
      include: this.includeUsuario,
    });
  }

  async listar() {
    return this.prisma.candidato.findMany({
      where: {
        ativo: true,
        usuario: {
          ativo: true,
        },
      },
      include: this.includeUsuario,
      orderBy: {
        criadoEm: 'desc',
      },
    });
  }

  async buscarPorId(
    id: string,
  ) {
    return this.prisma.candidato.findUnique({
      where: {
        id,
      },
      include: this.includeUsuario,
    });
  }

  async buscarPorUsuarioId(
    usuarioId: string,
  ) {
    return this.prisma.candidato.findFirst({
      where: {
        usuarioId,
        ativo: true,
        usuario: {
          ativo: true,
        },
      },
      include: this.includeUsuario,
    });
  }

  async buscarPorEmail(
    email: string,
  ) {
    return this.prisma.candidato.findFirst({
      where: {
        usuario: {
          email,
        },
      },
      include: this.includeUsuario,
    });
  }

  async atualizar(
    id: string,
    data: AtualizarCandidatoDto,
  ) {
    const {
      nome,
      email,
      senha,
      ...perfil
    } = data;

    const usuario: Record<string, string> = {};

    if (nome !== undefined) {
      usuario.nome = nome;
    }

    if (email !== undefined) {
      usuario.email = email;
    }

    if (senha !== undefined) {
      usuario.senha = senha;
    }

    const updateData: any = {
      ...perfil,
    };

    if (Object.keys(usuario).length > 0) {
      updateData.usuario = {
        update: usuario,
      };
    }

    return this.prisma.candidato.update({
      where: {
        id,
      },
      data: updateData,
      include: this.includeUsuario,
    });
  }

  async remover(
    id: string,
  ) {
    return this.prisma.candidato.update({
      where: {
        id,
      },
      data: {
        ativo: false,
      },
      include: this.includeUsuario,
    });
  }

  async ativar(
    id: string,
  ) {
    return this.prisma.candidato.update({
      where: {
        id,
      },
      data: {
        ativo: true,
      },
      include: this.includeUsuario,
    });
  }

  async desativar(
    id: string,
  ) {
    return this.prisma.candidato.update({
      where: {
        id,
      },
      data: {
        ativo: false,
      },
      include: this.includeUsuario,
    });
  }

  async listarAtivos() {
    return this.prisma.candidato.findMany({
      where: {
        ativo: true,
        usuario: {
          ativo: true,
        },
      },
      include: this.includeUsuario,
      orderBy: {
        criadoEm: 'desc',
      },
    });
  }
}
