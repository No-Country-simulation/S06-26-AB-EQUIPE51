import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CriarEmpresaDto {
  @IsString({
    message: 'Nome deve ser um texto.',
  })
  @MinLength(3, {
    message:
      'Nome deve possuir no mínimo 3 caracteres.',
  })
  nome!: string;

  @IsEmail(
    {},
    {
      message: 'E-mail inválido.',
    },
  )
  email!: string;

  @IsString({
    message: 'Senha deve ser um texto.',
  })
  @MinLength(6, {
    message:
      'Senha deve possuir no mínimo 6 caracteres.',
  })
  senha!: string;

  @IsString({
    message:
      'Nome da empresa deve ser um texto.',
  })
  @MinLength(2, {
    message:
      'Nome da empresa deve possuir no mínimo 2 caracteres.',
  })
  nomeEmpresa!: string;

  @IsInt({
    message:
      'Meta de diversidade deve ser um número inteiro.',
  })
  @Min(0, {
    message:
      'Meta de diversidade não pode ser menor que 0.',
  })
  @Max(100, {
    message:
      'Meta de diversidade não pode ser maior que 100.',
  })
  metaDiversidade!: number;

  @IsArray({
    message:
      'Grupos prioritários deve ser uma lista.',
  })
  @ArrayMinSize(1, {
    message:
      'Informe ao menos um grupo prioritário.',
  })
  @IsString({
    each: true,
    message:
      'Todos os grupos devem ser texto.',
  })
  gruposPrioritarios!: string[];
}