import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';
import * as bcrypt from 'bcrypt';

import { CandidatoRepository } from '../repositories/candidato.repository';

import { CriarCandidatoDto } from '../dto/criar-candidato.dto';
import { AtualizarCandidatoDto } from '../dto/atualizar-candidato.dto';

import { CandidatoNormalizer } from '../../common/utils/candidato-normalizer';
import { LogsCandidatoService } from '../../logs-candidato/services/logs-candidato.service';
import { LogsAcessoCandidatoService } from '../../logs-acesso-candidato/services/logs-acesso-candidato.service';
import { Cargo } from '../../common/enums/cargo.enum';

@Injectable()
export class CandidatoService {
  constructor(
    private readonly repository: CandidatoRepository,
    private readonly logsCandidatoService: LogsCandidatoService,
    private readonly logsAcessoCandidatoService: LogsAcessoCandidatoService,
  ) {}

  private readonly gruposPermitidos = [
    'MULHER',
    'PCD',
    'NEGRO',
    'INDIGENA',
    'LGBTQIA+',
  ];

  private readonly camposAuditaveis = [
    'skills',
    'nivel',
    'cargoDesejado',
    'regiao',
    'grupoDiversidade',
    'latitude',
    'longitude',
    'ageGroup',
    'incomeCluster',
    'mobilityPattern',
    'scoreMobilidade',
    'ativo',
  ];

  private normalizarCargo(valor: string): Cargo {
    const cargo = valor.trim().toUpperCase() as Cargo;

    if (!Object.values(Cargo).includes(cargo)) {
      throw new BadRequestException('Cargo desejado inválido.');
    }

    return cargo;
  }

  private selecionarCamposAuditaveis(origem: any) {
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
    alteracoes: AtualizarCandidatoDto,
  ) {
    return Object.keys(alteracoes).reduce(
      (dados, campo) => {
        if (this.camposAuditaveis.includes(campo)) {
          dados[campo] = antes[campo];
        }

        return dados;
      },
      {} as Record<string, any>,
    );
  }

  private getIpOrigem(req?: Request) {
    if (!req) {
      return undefined;
    }

    return String(
      req.headers?.['x-forwarded-for'] || req.ip || req.socket?.remoteAddress,
    );
  }

  private getUserAgent(req?: Request) {
    return req?.headers?.['user-agent'] as string | undefined;
  }

  private getUsuarioResponsavel(req: Request | undefined, fallback?: string) {
    return String((req as any)?.user?.id || fallback || 'nao_identificado');
  }

  private getUsuarioLogado(req?: Request) {
    return (req as any)?.user;
  }

  private validarAcessoAoCandidato(candidato: any, req?: Request) {
    const usuario = this.getUsuarioLogado(req);

    if (!usuario) {
      return;
    }

    if (usuario.role === 'ADMIN') {
      return;
    }

    if (usuario.role === 'CANDIDATO' && candidato.usuario?.id === usuario.id) {
      return;
    }

    throw new ForbiddenException(
      'Você não possui permissão para acessar este candidato.',
    );
  }

  private validarDonoOuAdmin(candidato: any, req?: Request) {
    const usuario = this.getUsuarioLogado(req);

    if (!usuario) {
      return;
    }

    if (usuario.role === 'ADMIN') {
      return;
    }

    if (usuario.role === 'CANDIDATO' && candidato.usuario?.id === usuario.id) {
      return;
    }

    throw new ForbiddenException(
      'Você não possui permissão para alterar este candidato.',
    );
  }

  async criar(dto: CriarCandidatoDto, req?: Request) {
    if ((req as any)?.user?.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Apenas administradores podem cadastrar candidatos.',
      );
    }

    dto.nome = CandidatoNormalizer.normalizarNome(dto.nome);

    dto.email = CandidatoNormalizer.normalizarEmail(dto.email);

    dto.skills = CandidatoNormalizer.normalizarSkills(dto.skills);

    dto.regiao = CandidatoNormalizer.normalizarRegiao(dto.regiao);

    dto.cargoDesejado = this.normalizarCargo(dto.cargoDesejado);

    if (dto.grupoDiversidade !== undefined) {
      dto.grupoDiversidade = dto.grupoDiversidade.trim().toUpperCase();

      if (!this.gruposPermitidos.includes(dto.grupoDiversidade)) {
        throw new BadRequestException('Grupo de diversidade inválido.');
      }
    }

    const candidatoExistente = await this.repository.buscarPorEmail(dto.email);

    if (candidatoExistente) {
      throw new BadRequestException('E-mail já cadastrado.');
    }

    if (!dto.senha || dto.senha.length < 6) {
      throw new BadRequestException(
        'Senha deve possuir no minimo 6 caracteres.',
      );
    }

    dto.senha = await bcrypt.hash(dto.senha, 10);

    const candidato = await this.repository.criar(dto);

    await this.logsCandidatoService.registrar({
      candidatoId: candidato.id,
      acao: 'CRIAR_CANDIDATO',
      descricao: 'Candidato criado',
      usuarioResponsavel: this.getUsuarioResponsavel(req, dto.email),
      ipOrigem: this.getIpOrigem(req),
      userAgent: this.getUserAgent(req),
      dadosAntes: null,
      dadosDepois: this.selecionarCamposAuditaveis(candidato),
    });

    return candidato;
  }

  async listar() {
    return this.repository.listar();
  }

  async buscarMeuPerfil(req: Request) {
    const usuario = this.getUsuarioLogado(req);
    const candidato = await this.repository.buscarPorUsuarioId(
      String(usuario?.id),
    );

    if (!candidato) {
      throw new NotFoundException('Candidato logado nÃ£o encontrado.');
    }

    return candidato;
  }

  async buscarPorId(id: string, req?: Request) {
    const candidato = await this.repository.buscarPorId(id);

    if (!candidato) {
      throw new NotFoundException('Candidato não encontrado.');
    }

    this.validarAcessoAoCandidato(candidato, req);

    if (req) {
      await this.logsAcessoCandidatoService.registrarVisualizacao({
        candidatoId: id,
        usuarioResponsavel: this.getUsuarioResponsavel(req),
        finalidade: 'VISUALIZACAO_PROCESSO_RECRUTAMENTO',
        req,
      });
    }

    return candidato;
  }

  async atualizar(id: string, dto: AtualizarCandidatoDto, req?: Request) {
    const candidatoAntes = await this.buscarPorId(id);

    this.validarDonoOuAdmin(candidatoAntes, req);

    if (dto.nome !== undefined) {
      dto.nome = CandidatoNormalizer.normalizarNome(dto.nome);
    }

    if (dto.email !== undefined) {
      const emailNormalizado = CandidatoNormalizer.normalizarEmail(dto.email);

      dto.email = emailNormalizado;

      const candidatoExistente =
        await this.repository.buscarPorEmail(emailNormalizado);

      if (candidatoExistente && candidatoExistente.id !== id) {
        throw new BadRequestException('E-mail já cadastrado.');
      }
    }

    if (dto.senha !== undefined) {
      if (dto.senha.length < 6) {
        throw new BadRequestException(
          'Senha deve possuir no minimo 6 caracteres.',
        );
      }

      dto.senha = await bcrypt.hash(dto.senha, 10);
    }

    if (dto.skills !== undefined) {
      dto.skills = CandidatoNormalizer.normalizarSkills(dto.skills);
    }

    if (dto.regiao !== undefined) {
      dto.regiao = CandidatoNormalizer.normalizarRegiao(dto.regiao);
    }

    if (dto.cargoDesejado !== undefined) {
      dto.cargoDesejado = this.normalizarCargo(dto.cargoDesejado);
    }

    if (dto.grupoDiversidade !== undefined) {
      dto.grupoDiversidade = dto.grupoDiversidade.trim().toUpperCase();

      if (!this.gruposPermitidos.includes(dto.grupoDiversidade)) {
        throw new BadRequestException('Grupo de diversidade inválido.');
      }
    }

    const candidatoAtualizado = await this.repository.atualizar(id, dto);

    await this.logsCandidatoService.registrar({
      candidatoId: id,
      acao: 'ATUALIZAR_CANDIDATO',
      descricao: 'Candidato atualizado',
      usuarioResponsavel: this.getUsuarioResponsavel(req),
      ipOrigem: this.getIpOrigem(req),
      userAgent: this.getUserAgent(req),
      dadosAntes: this.montarDadosAntesAtualizacao(candidatoAntes, dto),
      dadosDepois: this.selecionarCamposAuditaveis(dto),
    });

    return candidatoAtualizado;
  }

  async remover(id: string, req?: Request) {
    const candidato = await this.buscarPorId(id);

    this.validarDonoOuAdmin(candidato, req);

    const candidatoRemovido = await this.repository.remover(id);

    await this.logsCandidatoService.registrar({
      candidatoId: id,
      acao: 'REMOVER_CANDIDATO',
      descricao: 'Candidato removido',
      usuarioResponsavel: this.getUsuarioResponsavel(req),
      ipOrigem: this.getIpOrigem(req),
      userAgent: this.getUserAgent(req),
      dadosAntes: this.selecionarCamposAuditaveis(candidato),
      dadosDepois: null,
    });

    return candidatoRemovido;
  }
}
