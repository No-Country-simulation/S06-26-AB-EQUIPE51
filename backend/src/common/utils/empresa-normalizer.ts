import { BadRequestException } from '@nestjs/common';

export class EmpresaNormalizer {
  private static possuiLetras(
    valor: string,
  ): boolean {
    return /[A-ZÀ-Ú]/i.test(valor);
  }

  static normalizarNome(
    valor: string,
  ): string {
    const nome = valor.trim();

    if (nome.length < 3) {
      throw new BadRequestException(
        'Nome deve possuir no mínimo 3 caracteres.',
      );
    }

    if (!this.possuiLetras(nome)) {
      throw new BadRequestException(
        'Nome inválido.',
      );
    }

    return nome;
  }

  static normalizarEmail(
    valor: string,
  ): string {
    const email = valor
      .trim()
      .toLowerCase();

    const regex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {
      throw new BadRequestException(
        'E-mail inválido.',
      );
    }

    return email;
  }

  static normalizarNomeEmpresa(
    valor: string,
  ): string {
    const nomeEmpresa =
      valor
        .trim()
        .toUpperCase();

    if (
      nomeEmpresa.length < 3
    ) {
      throw new BadRequestException(
        'Nome da empresa deve possuir no mínimo 3 caracteres.',
      );
    }

    if (
      !this.possuiLetras(
        nomeEmpresa,
      )
    ) {
      throw new BadRequestException(
        'Nome da empresa inválido.',
      );
    }

    return nomeEmpresa;
  }

  static normalizarGrupos(
    grupos: string[],
  ): string[] {
    if (
      !grupos ||
      grupos.length === 0
    ) {
      throw new BadRequestException(
        'Informe ao menos um grupo prioritário.',
      );
    }

    return grupos.map(
      (grupo) => {
        const grupoNormalizado =
          grupo
            .trim()
            .toUpperCase();

        if (
          grupoNormalizado.length < 2
        ) {
          throw new BadRequestException(
            `Grupo inválido: ${grupo}`,
          );
        }

        if (
          !this.possuiLetras(
            grupoNormalizado,
          )
        ) {
          throw new BadRequestException(
            `Grupo inválido: ${grupo}`,
          );
        }

        return grupoNormalizado;
      },
    );
  }
}