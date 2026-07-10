import {
  IsEmail,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
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
}