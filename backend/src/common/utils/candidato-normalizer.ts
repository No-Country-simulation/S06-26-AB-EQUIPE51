import { BadRequestException } from '@nestjs/common';

export class CandidatoNormalizer {
  static normalizarNome(
    nome: string,
  ): string {
    const valor = nome.trim();

    if (
      valor.length < 3 ||
      !/[a-zA-ZÀ-ÿ]/.test(valor)
    ) {
      throw new BadRequestException(
        'Nome inválido.',
      );
    }

    return valor;
  }

  static normalizarEmail(
    email: string,
  ): string {
    const valor =
      email.trim().toLowerCase();

    const regex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(valor)) {
      throw new BadRequestException(
        'E-mail inválido.',
      );
    }

    return valor;
  }

  static normalizarSkills(
    skills: string[],
  ): string[] {
    if (!skills?.length) {
      throw new BadRequestException(
        'Informe ao menos uma skill.',
      );
    }

    return skills.map((skill) =>
      skill.trim().toUpperCase(),
    );
  }

  static normalizarRegiao(
    regiao: string,
  ): string {
    const valor = regiao.trim();

    if (valor.length < 2) {
      throw new BadRequestException(
        'Região inválida.',
      );
    }

    return valor;
  }
}