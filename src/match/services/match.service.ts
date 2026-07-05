import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';

import { CriarMatchDto } from '../dto/criar-match.dto';
import { MatchRepository } from '../repositories/match.repository';
import { Modalidade } from '../../common/enums/modalidade.enum';

@Injectable()
export class MatchService {
  constructor(private readonly repository: MatchRepository) {}

  private normalizarTexto(valor?: string | null) {
    return String(valor || '')
      .trim()
      .toUpperCase();
  }

  private normalizarLista(valores?: string[]) {
    return (valores || []).map((valor) => this.normalizarTexto(valor));
  }

  private obterGruposDiversidade(candidato: any) {
    if (Array.isArray(candidato.gruposDiversidade)) {
      return candidato.gruposDiversidade;
    }

    if (candidato.grupoDiversidade) {
      return [candidato.grupoDiversidade];
    }

    return [];
  }

  private calcularPercentualSkills(
    skillsVaga: string[],
    skillsCandidato: string[],
  ) {
    if (skillsVaga.length === 0) {
      return 0;
    }

    const skillsCandidatoSet = new Set(skillsCandidato);
    const comuns = skillsVaga.filter((skill) => skillsCandidatoSet.has(skill));

    return comuns.length / skillsVaga.length;
  }

  private obterPesos(modalidade: Modalidade) {
    if (modalidade === Modalidade.REMOTO) {
      return {
        cargo: 35,
        skills: 40,
        nivel: 15,
        diversidade: 10,
        mobilidade: 0,
      };
    }

    if (modalidade === Modalidade.HIBRIDO) {
      return {
        cargo: 30,
        skills: 35,
        nivel: 15,
        diversidade: 10,
        mobilidade: 10,
      };
    }

    return {
      cargo: 25,
      skills: 30,
      nivel: 15,
      diversidade: 10,
      mobilidade: 20,
    };
  }

  private analisarCandidato(params: {
    candidato: any;
    dto: CriarMatchDto;
    gruposPrioritarios: string[];
  }) {
    const skillsVaga = this.normalizarLista(params.dto.vaga.skills);
    const skillsCandidato = this.normalizarLista(params.candidato.skills);
    const percentualSkills = this.calcularPercentualSkills(
      skillsVaga,
      skillsCandidato,
    );
    const quantidadeSkillsEncontradas = skillsVaga.filter((skill) =>
      skillsCandidato.includes(skill),
    ).length;

    const modalidade = params.dto.vaga.modalidade;
    const vagaRemota = modalidade === Modalidade.REMOTO;
    const pesos = this.obterPesos(modalidade);

    const cargoVaga = this.normalizarTexto(params.dto.vaga.cargo);
    const cargoCandidato = this.normalizarTexto(params.candidato.cargoDesejado);
    const cargoCompativel = cargoCandidato === cargoVaga;

    const nivelCompativel =
      this.normalizarTexto(params.candidato.nivel) ===
      this.normalizarTexto(params.dto.vaga.nivel);

    const gruposDiversidade = this.normalizarLista(
      this.obterGruposDiversidade(params.candidato),
    );
    const diversidadeCompativel = gruposDiversidade.some((grupo) =>
      params.gruposPrioritarios.includes(grupo),
    );

    const scoreMobilidade = Math.max(
      0,
      Math.min(Number(params.candidato.scoreMobilidade || 0), 100),
    );

    const scoreTecnico =
      percentualSkills * pesos.skills +
      (cargoCompativel ? pesos.cargo : 0) +
      (nivelCompativel ? pesos.nivel : 0) +
      scoreMobilidade * (pesos.mobilidade / 100);

    const score =
      scoreTecnico + (diversidadeCompativel ? pesos.diversidade : 0);

    return {
      score_match: Math.round(Math.min(score, 100)),
      score_tecnico: Math.round(Math.min(scoreTecnico, 100)),
      score_ordenacao_anti_vies: scoreTecnico + (diversidadeCompativel ? 5 : 0),
      diversidadeCompativel,
      explicacao: [
        `${quantidadeSkillsEncontradas} de ${skillsVaga.length} skills encontradas`,
        nivelCompativel ? 'Nivel compativel' : 'Nivel diferente da vaga',
        cargoCompativel ? 'Cargo compativel' : 'Cargo diferente da vaga',
        vagaRemota
          ? 'Vaga remota: regiao e mobilidade nao consideradas'
          : `Modalidade ${modalidade}: mobilidade com peso de ${pesos.mobilidade}%`,
        diversidadeCompativel
          ? 'Grupo alinhado aos objetivos ESG da empresa'
          : 'Grupo nao priorizado pela empresa',
        ...(vagaRemota
          ? []
          : [
              `Score de mobilidade: ${scoreMobilidade} (peso ${pesos.mobilidade}%)`,
            ]),
      ],
    };
  }

  private criarDestaque(params: {
    score: number;
    candidato: any;
    gruposPrioritarios: string[];
    modalidade: Modalidade;
  }) {
    if (params.score >= 85) {
      return 'ALTA_COMPATIBILIDADE';
    }

    if (
      this.normalizarLista(
        this.obterGruposDiversidade(params.candidato),
      ).some((grupo) => params.gruposPrioritarios.includes(grupo))
    ) {
      return 'DIVERSIDADE_ALINHADA';
    }

    if (
      params.modalidade !== Modalidade.REMOTO &&
      params.candidato.scoreMobilidade
    ) {
      return 'TALENTO_REGIONAL';
    }

    return 'COMPATIVEL';
  }

  private ordenarCandidatos(candidatos: any[], antiVies?: boolean) {
    return [...candidatos].sort((a, b) => {
      if (antiVies) {
        const diferencaAntiVies =
          b.score_ordenacao_anti_vies - a.score_ordenacao_anti_vies;

        if (diferencaAntiVies !== 0) {
          return diferencaAntiVies;
        }
      }

      return b.score_match - a.score_match;
    });
  }

  private aplicarDiversidadeMinima(
    candidatosOrdenados: any[],
    diversidadeMinima?: number,
  ) {
    const limiteShortlist = 10;
    const shortlist = candidatosOrdenados.slice(0, limiteShortlist);

    if (
      !diversidadeMinima ||
      diversidadeMinima <= 0 ||
      shortlist.length === 0
    ) {
      return shortlist;
    }

    const quantidadeMinima = Math.ceil(
      (shortlist.length * diversidadeMinima) / 100,
    );

    const contarDiversidade = (candidatos: any[]) =>
      candidatos.filter((candidato) => candidato.diversidadeCompativel).length;

    while (contarDiversidade(shortlist) < quantidadeMinima) {
      const candidatoDiverso = candidatosOrdenados.find(
        (candidato) =>
          candidato.diversidadeCompativel && !shortlist.includes(candidato),
      );

      const indiceSubstituicao = shortlist
        .map((candidato, indice) => ({
          candidato,
          indice,
        }))
        .filter(({ candidato }) => !candidato.diversidadeCompativel)
        .sort(
          (a, b) => a.candidato.score_match - b.candidato.score_match,
        )[0]?.indice;

      if (!candidatoDiverso || indiceSubstituicao === undefined) {
        break;
      }

      shortlist[indiceSubstituicao] = candidatoDiverso;
    }

    return shortlist.sort((a, b) => b.score_match - a.score_match);
  }

  private validarEmpresa(empresa: any, req?: Request) {
    const usuario = (req as any)?.user;

    if (!usuario || usuario.role === 'ADMIN') {
      return;
    }

    if (usuario.role === 'EMPRESA' && empresa.usuario.id === usuario.id) {
      return;
    }

    throw new ForbiddenException(
      'Você não possui permissão para executar match para esta empresa.',
    );
  }

  async executar(dto: CriarMatchDto, req?: Request) {
    const empresa = await this.repository.buscarEmpresaPorId(dto.empresa_id);

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    this.validarEmpresa(empresa, req);

    const gruposPrioritarios = this.normalizarLista(empresa.gruposPrioritarios);
    const candidatos = await this.repository.listarCandidatosAtivos();
    const cargoVaga = this.normalizarTexto(dto.vaga.cargo);
    const candidatosElegiveis = candidatos.filter(
      (candidato) =>
        this.normalizarTexto(candidato.cargoDesejado) === cargoVaga,
    );

    const candidatosPontuados = candidatosElegiveis.map((candidato, indice) => {
      const analise = this.analisarCandidato({
        candidato,
        dto,
        gruposPrioritarios,
      });

      return {
        candidato_id: candidato.id,
        nome: candidato.usuario?.nome || `Candidato ${indice + 1}`,
        score_match: analise.score_match,
        score_tecnico: analise.score_tecnico,
        score_ordenacao_anti_vies: analise.score_ordenacao_anti_vies,
        diversidadeCompativel: analise.diversidadeCompativel,
        badge_diversidade: this.obterGruposDiversidade(candidato),
        destaque: this.criarDestaque({
          score: analise.score_match,
          candidato,
          gruposPrioritarios,
          modalidade: dto.vaga.modalidade,
        }),
        explicacao: analise.explicacao,
        motivos: analise.explicacao,
        skills: candidato.skills,
        ...(candidato.cargoDesejado
          ? {
              cargoDesejado: candidato.cargoDesejado,
            }
          : {}),
        gruposDiversidade: this.obterGruposDiversidade(candidato),
      };
    });

    const candidatosOrdenados = this.ordenarCandidatos(
      candidatosPontuados,
      dto.filtros?.anti_vies,
    );

    const shortlist = this.aplicarDiversidadeMinima(
      candidatosOrdenados,
      dto.filtros?.diversidade_minima,
    );

    const totalDiversidade = shortlist.filter((candidato) =>
      this.normalizarLista(candidato.gruposDiversidade).some((grupo) =>
        gruposPrioritarios.includes(grupo),
      ),
    ).length;

    const diversidadeResultado =
      shortlist.length === 0
        ? 0
        : Math.round((totalDiversidade / shortlist.length) * 100);

    return {
      modalidade_vaga: dto.vaga.modalidade,
      candidatos: shortlist.map(
        ({
          gruposDiversidade,
          score_tecnico,
          score_ordenacao_anti_vies,
          diversidadeCompativel,
          ...candidato
        }) => candidato,
      ),
      total_analisados: candidatosElegiveis.length,
      diversidade_resultado: diversidadeResultado,
    };
  }
}
