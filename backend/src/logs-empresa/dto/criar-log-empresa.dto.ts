export class CriarLogEmpresaDto {
  empresaId!: string;

  acao!: string;

  descricao!: string;

  usuarioResponsavel?: string;

  ipOrigem?: string;

  userAgent?: string;

  dadosAntes?: any;

  dadosDepois?: any;
}