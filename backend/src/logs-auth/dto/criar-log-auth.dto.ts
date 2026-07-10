export class CriarLogAuthDto {
  usuarioId?: string;

  acao!: string;

  identificador?: string;

  sucesso!: boolean;

  motivo?: string;

  ipOrigem?: string;

  userAgent?: string;
}
