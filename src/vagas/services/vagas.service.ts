import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import type { Request } from 'express';

import { VagaRepository } from '../repositories/vaga.repository';
import { CriarVagaDto } from '../dto/criar-vaga.dto';
import { AtualizarVagaDto } from '../dto/atualizar-vaga.dto';
import { VagaNormalizer } from '../../common/utils/vaga-normalizer';
import { LogsVagaService } from '../../logs-vaga/services/logs-vaga.service';

@Injectable()
export class VagasService {
  constructor(
    private readonly repository: VagaRepository,
    private readonly logsVagaService: LogsVagaService,
  ) {}

  private readonly niveisPermitidos = ['JUNIOR', 'PLENO', 'SENIOR'];

  private readonly camposAuditaveis = [
    'titulo',
    'cargo',
    'modalidade',
    'nivel',
    'regiao',
    'skills',
  ];

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
    alteracoes: AtualizarVagaDto,
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

  private getUsuarioLogadoId(req: Request): string {
    return String((req as any).user?.id);
  }

  private validarProprietarioVaga(
    usuarioLogadoId: string,
    usuarioDonoDaVagaId: string,
    roleUsuarioLogado: string | undefined,
    mensagem: string,
  ) {
    if (roleUsuarioLogado === 'ADMIN') {
      return;
    }

    if (usuarioDonoDaVagaId !== usuarioLogadoId) {
      throw new ForbiddenException(mensagem);
    }
  }

  async criar(dto: CriarVagaDto, req: Request) {
    const usuarioLogadoId = this.getUsuarioLogadoId(req);

    const ipOrigem =
      req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress;

    const userAgent = req.headers['user-agent'];

    if (!dto.titulo?.trim()) {
      throw new BadRequestException('Título é obrigatório.');
    }

    if (!dto.nivel?.trim()) {
      throw new BadRequestException('Nível é obrigatório.');
    }

    if (!dto.regiao?.trim()) {
      throw new BadRequestException('Região é obrigatória.');
    }

    dto.titulo = VagaNormalizer.normalizarTitulo(dto.titulo);

    dto.nivel = VagaNormalizer.normalizarNivel(dto.nivel);

    dto.regiao = VagaNormalizer.normalizarRegiao(dto.regiao);

    dto.skills = VagaNormalizer.normalizarSkills(dto.skills);

    const empresa = await this.repository.buscarEmpresaPorId(dto.empresaId);

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    this.validarProprietarioVaga(
      usuarioLogadoId,
      empresa.usuarioId,
      (req as any).user?.role,
      'Você não possui permissão para criar vaga para esta empresa.',
    );

    const vagaExistente = await this.repository.buscarDuplicada(
      dto.empresaId,
      dto.titulo,
    );

    if (vagaExistente) {
      throw new BadRequestException(
        'Já existe uma vaga com este título para esta empresa.',
      );
    }

    if (!this.niveisPermitidos.includes(dto.nivel)) {
      throw new BadRequestException(
        'Nível inválido. Utilize JUNIOR, PLENO ou SENIOR.',
      );
    }

    const vaga = await this.repository.criar(dto);

    await this.logsVagaService.registrar({
      vagaId: vaga.id,
      acao: 'CRIAR_VAGA',
      descricao: 'Vaga criada',
      usuarioResponsavel: usuarioLogadoId,
      ipOrigem: String(ipOrigem),
      userAgent: String(userAgent),
      dadosAntes: null,
      dadosDepois: this.selecionarCamposAuditaveis(vaga),
    });

    return vaga;
  }

  async listar(req?: Request) {
    const usuarioLogado = (req as any)?.user;
    const roleUsuarioLogado = usuarioLogado?.role || usuarioLogado?.tipo;

    if (roleUsuarioLogado === 'EMPRESA') {
      const empresa = await this.repository.buscarEmpresaPorUsuarioId(
        String(usuarioLogado.id),
      );

      return empresa ? this.repository.listarPorEmpresa(empresa.id) : [];
    }

    return this.repository.listar();
  }

  async buscarPorId(id: string) {
    const vaga = await this.repository.buscarPorId(id);

    if (!vaga) {
      throw new NotFoundException('Vaga não encontrada.');
    }

    return vaga;
  }

  async listarPorEmpresa(empresaId: string, req?: Request) {
    const usuarioLogado = (req as any)?.user;
    const roleUsuarioLogado = usuarioLogado?.role || usuarioLogado?.tipo;

    if (roleUsuarioLogado === 'EMPRESA') {
      const empresa = await this.repository.buscarEmpresaPorId(empresaId);

      if (!empresa) {
        throw new NotFoundException('Empresa nÃ£o encontrada.');
      }

      this.validarProprietarioVaga(
        String(usuarioLogado.id),
        empresa.usuarioId,
        roleUsuarioLogado,
        'VocÃª nÃ£o possui permissÃ£o para acessar vagas desta empresa.',
      );
    }

    return this.repository.listarPorEmpresa(empresaId);
  }

  async atualizar(id: string, dto: AtualizarVagaDto, req: Request) {
    const usuarioLogadoId = this.getUsuarioLogadoId(req);

    const ipOrigem =
      req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress;

    const userAgent = req.headers['user-agent'];

    const vaga = await this.repository.buscarPorId(id);

    if (!vaga) {
      throw new NotFoundException('Vaga não encontrada.');
    }

    this.validarProprietarioVaga(
      usuarioLogadoId,
      vaga.empresa.usuarioId,
      (req as any).user?.role,
      'Você não possui permissão para alterar esta vaga.',
    );

    if (dto.titulo) {
      dto.titulo = VagaNormalizer.normalizarTitulo(dto.titulo);

      const vagaDuplicada = await this.repository.buscarDuplicada(
        vaga.empresaId,
        dto.titulo,
      );

      if (vagaDuplicada && vagaDuplicada.id !== id) {
        throw new BadRequestException(
          'Já existe uma vaga com este título para esta empresa.',
        );
      }
    }

    if (dto.nivel) {
      dto.nivel = VagaNormalizer.normalizarNivel(dto.nivel);

      if (!this.niveisPermitidos.includes(dto.nivel)) {
        throw new BadRequestException(
          'Nível inválido. Utilize JUNIOR, PLENO ou SENIOR.',
        );
      }
    }

    if (dto.regiao) {
      dto.regiao = VagaNormalizer.normalizarRegiao(dto.regiao);
    }

    if (dto.skills && dto.skills.length === 0) {
      throw new BadRequestException('Informe ao menos uma skill.');
    }

    if (dto.skills) {
      dto.skills = VagaNormalizer.normalizarSkills(dto.skills);
    }

    const vagaAtualizada = await this.repository.atualizar(id, dto);

    await this.logsVagaService.registrar({
      vagaId: id,
      acao: 'ATUALIZAR_VAGA',
      descricao: 'Vaga atualizada',
      usuarioResponsavel: usuarioLogadoId,
      ipOrigem: String(ipOrigem),
      userAgent: String(userAgent),
      dadosAntes: this.montarDadosAntesAtualizacao(vaga, dto),
      dadosDepois: this.selecionarCamposAuditaveis(dto),
    });

    return vagaAtualizada;
  }

  async remover(id: string, req: Request) {
    const usuarioLogadoId = this.getUsuarioLogadoId(req);

    const ipOrigem =
      req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress;

    const userAgent = req.headers['user-agent'];

    const vaga = await this.repository.buscarPorId(id);

    if (!vaga) {
      throw new NotFoundException('Vaga não encontrada.');
    }

    this.validarProprietarioVaga(
      usuarioLogadoId,
      vaga.empresa.usuarioId,
      (req as any).user?.role,
      'Você não possui permissão para remover esta vaga.',
    );

    const vagaRemovida = await this.repository.remover(id);

    await this.logsVagaService.registrar({
      vagaId: id,
      acao: 'REMOVER_VAGA',
      descricao: 'Vaga removida',
      usuarioResponsavel: usuarioLogadoId,
      ipOrigem: String(ipOrigem),
      userAgent: String(userAgent),
      dadosAntes: this.selecionarCamposAuditaveis(vaga),
      dadosDepois: null,
    });

    return vagaRemovida;
  }
}
