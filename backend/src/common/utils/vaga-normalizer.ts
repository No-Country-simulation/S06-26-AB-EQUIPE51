import { BadRequestException } from '@nestjs/common';

export class VagaNormalizer {
  private static readonly skillsPermitidas = [
    'NODEJS',
    'NESTJS',
    'POSTGRESQL',
    'PRISMA',
    'REACT',
    'NEXTJS',
    'TYPESCRIPT',
    'JAVASCRIPT',
    'JAVA',
    'SPRING',
    'PYTHON',
    'DJANGO',
    'FLASK',
    'MYSQL',
    'SQL',
    'MONGODB',
    'DOCKER',
    'AWS',
    'AZURE',
    'GCP',
    'GIT',
    'GITHUB',
    'POWER BI',
    'EXCEL',
    'FIGMA',
    'UX',
    'UI',
    'CYPRESS',
    'JEST',
  ];

  private static possuiLetras(
    valor: string,
  ): boolean {
    return /[A-ZÀ-Ú]/i.test(valor);
  }

  static normalizarTitulo(
    titulo: string,
  ) {
    const tituloNormalizado =
      titulo.trim().toUpperCase();

    if (tituloNormalizado.length < 3) {
      throw new BadRequestException(
        'Título deve possuir no mínimo 3 caracteres.',
      );
    }

    if (
      !this.possuiLetras(
        tituloNormalizado,
      )
    ) {
      throw new BadRequestException(
        'Título inválido.',
      );
    }

    return tituloNormalizado;
  }

  static normalizarNivel(
    nivel: string,
  ) {
    const nivelNormalizado =
      nivel.trim().toUpperCase();

    if (
      !this.possuiLetras(
        nivelNormalizado,
      )
    ) {
      throw new BadRequestException(
        'Nível inválido.',
      );
    }

    return nivelNormalizado;
  }

  static normalizarRegiao(
    regiao: string,
  ) {
    const regiaoNormalizada =
      regiao.trim().toUpperCase();

    if (
      regiaoNormalizada.length < 2
    ) {
      throw new BadRequestException(
        'Região inválida.',
      );
    }

    if (
      !this.possuiLetras(
        regiaoNormalizada,
      )
    ) {
      throw new BadRequestException(
        'Região inválida.',
      );
    }

    return regiaoNormalizada;
  }

  static validarSkills(
    skills: string[],
  ) {
    if (
      !skills ||
      skills.length === 0
    ) {
      throw new BadRequestException(
        'Informe ao menos uma skill.',
      );
    }

    for (const skill of skills) {
      const skillNormalizada =
        skill.trim().toUpperCase();

      if (
        skillNormalizada.length < 2
      ) {
        throw new BadRequestException(
          `Skill inválida: ${skill}`,
        );
      }

      if (
        !this.possuiLetras(
          skillNormalizada,
        )
      ) {
        throw new BadRequestException(
          `Skill inválida: ${skill}`,
        );
      }

      if (
        !this.skillsPermitidas.includes(
          skillNormalizada,
        )
      ) {
        throw new BadRequestException(
          `Skill não permitida: ${skill}`,
        );
      }
    }
  }

  static normalizarSkills(
    skills: string[],
  ) {
    this.validarSkills(skills);

    return skills.map((skill) =>
      skill
        .trim()
        .toUpperCase(),
    );
  }
}