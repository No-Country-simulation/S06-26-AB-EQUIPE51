import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import type { Request } from 'express';
import * as bcrypt from 'bcrypt';

import { EmpresaRepository } from '../repositories/empresa.repository';
import { CriarEmpresaDto } from '../dto/criar-empresa.dto';
import { AtualizarEmpresaDto } from '../dto/atualizar-empresa.dto';

import { EmpresaNormalizer } from '../../common/utils/empresa-normalizer';
import { LogsEmpresaService } from '../../logs-empresa/services/logs-empresa.service';

@Injectable()
export class EmpresasService {
  constructor(
    private readonly repository: EmpresaRepository,
    private readonly logsEmpresaService: LogsEmpresaService,
  ) { }

  private readonly gruposPermitidos = [
    'MULHER',
    'PCD',
    'NEGRO',
    'INDIGENA',
    'LGBTQIA+',
  ];

  private readonly camposAuditaveis = [
    'nomeEmpresa',
    'metaDiversidade',
    'gruposPrioritarios',
  ];

  private selecionarCamposAuditaveis(
    origem: any,
  ) {
    return this.camposAuditaveis.reduce(
      (dados, campo) => {
        if (origem[campo] !== undefined) {
          dados[campo] = origem[campo];
        }

        return dados;
      },
      {} as Record<string, any>,
    );
  }

  private montarDadosAntesAtualizacao(
    antes: any,
    alteracoes: AtualizarEmpresaDto,
  ) {
    return Object.keys(alteracoes).reduce(
      (dados, campo) => {
        if (
          this.camposAuditaveis.includes(
            campo,
          )
        ) {
          dados[campo] = antes[campo];
        }

        return dados;
      },
      {} as Record<string, any>,
    );
  }


  private getUsuarioLogadoId(
    req: Request,
  ): string {
    return String(
      (req as any).user?.id,
    );
  }

  private validarProprietarioEmpresa(
    usuarioLogadoId: string,
    usuarioDonoEmpresaId: string,
    roleUsuarioLogado: string | undefined,
    mensagem: string,
  ) {
    if (roleUsuarioLogado === 'ADMIN') {
      return;
    }

    if (
      usuarioLogadoId !==
      usuarioDonoEmpresaId
    ) {
      throw new ForbiddenException(
        mensagem,
      );
    }
  }

  async criar(
    dto: CriarEmpresaDto,
    req: Request,
  ) {

    dto.nome =
      EmpresaNormalizer.normalizarNome(
        dto.nome,
      );

    dto.email =
      EmpresaNormalizer.normalizarEmail(
        dto.email,
      );

    dto.nomeEmpresa =
      EmpresaNormalizer.normalizarNomeEmpresa(
        dto.nomeEmpresa,
      );

    dto.gruposPrioritarios =
      EmpresaNormalizer.normalizarGrupos(
        dto.gruposPrioritarios,
      );

    if (
      !dto.senha ||
      dto.senha.length < 6
    ) {
      throw new BadRequestException(
        'Senha deve possuir no mínimo 6 caracteres.',
      );
    }

    if (
      dto.metaDiversidade < 0 ||
      dto.metaDiversidade > 100
    ) {
      throw new BadRequestException(
        'Meta de diversidade deve estar entre 0 e 100.',
      );
    }

    const gruposInvalidos =
      dto.gruposPrioritarios.filter(
        (grupo) =>
          !this.gruposPermitidos.includes(
            grupo,
          ),
      );

    if (gruposInvalidos.length > 0) {
      throw new BadRequestException(
        `Grupo(s) inválido(s): ${gruposInvalidos.join(', ')}`,
      );
    }

    const usuarioExistente =
      await this.repository.buscarUsuarioPorEmail(
        dto.email,
      );

    if (usuarioExistente) {
      throw new BadRequestException(
        'E-mail já cadastrado.',
      );
    }

    const empresaExistente =
      await this.repository.buscarPorNomeEmpresa(
        dto.nomeEmpresa,
      );

    if (empresaExistente) {
      throw new BadRequestException(
        'Já existe uma empresa com este nome.',
      );
    }

    dto.senha = await bcrypt.hash(
      dto.senha,
      10,
    );

    const empresa =
      await this.repository.criar(dto);

    const ipOrigem =
      req.headers['x-forwarded-for'] ||
      req.ip ||
      req.socket.remoteAddress;

    const userAgent =
      req.headers['user-agent'];

    await this.logsEmpresaService.registrar({
      empresaId: empresa.id,
      acao: 'CRIAR_EMPRESA',
      descricao: 'Empresa criada',
      usuarioResponsavel:
        dto.email,
      ipOrigem: String(ipOrigem),
      userAgent: String(userAgent),
      dadosAntes: null,
      dadosDepois:
        this.selecionarCamposAuditaveis(
          empresa,
        ),
    });

    return empresa;
  }

  async listar(
    req?: Request,
  ) {
    const usuarioLogado =
      (req as any)?.user;
    const roleUsuarioLogado =
      usuarioLogado?.role ||
      usuarioLogado?.tipo;

    if (
      roleUsuarioLogado === 'EMPRESA'
    ) {
      const empresa =
        await this.repository.buscarPorUsuarioId(
          String(usuarioLogado.id),
        );

      return empresa ? [empresa] : [];
    }

    return this.repository.listar();
  }

  async buscarMinhaEmpresa(
    req: Request,
  ) {
    const usuarioLogado =
      (req as any)?.user;
    const usuarioLogadoId =
      String(usuarioLogado?.id);

    const empresa =
      await this.repository.buscarPorUsuarioId(
        usuarioLogadoId,
      );

    if (!empresa) {
      throw new NotFoundException(
        'Empresa logada nÃ£o encontrada.',
      );
    }

    return empresa;
  }

  async buscarPorId(
    id: string,
    req?: Request,
  ) {
    const empresa =
      await this.repository.buscarPorId(
        id,
      );

    if (!empresa) {
      throw new NotFoundException(
        'Empresa não encontrada.',
      );
    }

    if (req) {
      this.validarProprietarioEmpresa(
        this.getUsuarioLogadoId(req),
        empresa.usuario.id,
        (req as any).user?.role ||
          (req as any).user?.tipo,
        'VocÃª nÃ£o possui permissÃ£o para acessar esta empresa.',
      );
    }

    return empresa;
  }

  async atualizar(
    id: string,
    dto: AtualizarEmpresaDto,
    req: Request,
  ) {
    const empresaAntes =
      await this.repository.buscarPorId(
        id,
      );

    if (!empresaAntes) {
      throw new NotFoundException(
        'Empresa não encontrada.',
      );
    }

    const usuarioLogadoId =
      this.getUsuarioLogadoId(req);

    this.validarProprietarioEmpresa(
      usuarioLogadoId,
      empresaAntes.usuario.id,
      (req as any).user?.role,
      'Você não possui permissão para alterar esta empresa.',
    );

    if (
      dto.metaDiversidade !== undefined
    ) {
      if (
        dto.metaDiversidade < 0 ||
        dto.metaDiversidade > 100
      ) {
        throw new BadRequestException(
          'Meta de diversidade deve estar entre 0 e 100.',
        );
      }
    }

    if (dto.nomeEmpresa) {
      dto.nomeEmpresa =
        EmpresaNormalizer.normalizarNomeEmpresa(
          dto.nomeEmpresa,
        );

      const empresaExistente =
        await this.repository.buscarPorNomeEmpresa(
          dto.nomeEmpresa,
        );

      if (
        empresaExistente &&
        empresaExistente.id !== id
      ) {
        throw new BadRequestException(
          'Já existe uma empresa com este nome.',
        );
      }
    }

    if (dto.gruposPrioritarios) {
      dto.gruposPrioritarios =
        EmpresaNormalizer.normalizarGrupos(
          dto.gruposPrioritarios,
        );

      const gruposInvalidos =
        dto.gruposPrioritarios.filter(
          (grupo) =>
            !this.gruposPermitidos.includes(
              grupo,
            ),
        );

      if (gruposInvalidos.length > 0) {
        throw new BadRequestException(
          `Grupo(s) inválido(s): ${gruposInvalidos.join(', ')}`,
        );
      }
    }

    const empresaAtualizada =
      await this.repository.atualizar(
        id,
        dto,
      );

    const ipOrigem =
      req.headers['x-forwarded-for'] ||
      req.ip ||
      req.socket.remoteAddress;

    const userAgent =
      req.headers['user-agent'];

    await this.logsEmpresaService.registrar({
      empresaId: id,
      acao: 'ATUALIZAR_EMPRESA',
      descricao:
        'Empresa atualizada',
      usuarioResponsavel:
        usuarioLogadoId,
      ipOrigem: String(ipOrigem),
      userAgent: String(userAgent),
      dadosAntes:
        this.montarDadosAntesAtualizacao(
          empresaAntes,
          dto,
        ),
      dadosDepois:
        this.selecionarCamposAuditaveis(
          dto,
        ),
    });

    return empresaAtualizada;
  }

  async remover(
    id: string,
    req: Request,
  ) {
    const empresa =
      await this.repository.buscarPorId(
        id,
      );

    if (!empresa) {
      throw new NotFoundException(
        'Empresa não encontrada.',
      );
    }

    const usuarioLogadoId =
      this.getUsuarioLogadoId(req);

    this.validarProprietarioEmpresa(
      usuarioLogadoId,
      empresa.usuario.id,
      (req as any).user?.role,
      'Você não possui permissão para remover esta empresa.',
    );

    const empresaRemovida =
      await this.repository.remover(id);

    const ipOrigem =
      req.headers['x-forwarded-for'] ||
      req.ip ||
      req.socket.remoteAddress;

    const userAgent =
      req.headers['user-agent'];

    await this.logsEmpresaService.registrar({
      empresaId: id,
      acao: 'REMOVER_EMPRESA',
      descricao:
        'Empresa removida',
      usuarioResponsavel:
        usuarioLogadoId,
      ipOrigem: String(ipOrigem),
      userAgent: String(userAgent),
      dadosAntes:
        this.selecionarCamposAuditaveis(
          empresa,
        ),
      dadosDepois: null,
    });

    return empresaRemovida;
  }
}
