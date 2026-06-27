export class CriarLogCandidatoDto {
  candidatoId!: string;

  acao!: string;

  descricao!: string;

  usuarioResponsavel?: string;

  ipOrigem?: string;

  userAgent?: string;

  dadosAntes?: any;

  dadosDepois?: any;
}
