import { PartialType } from '@nestjs/mapped-types';
import { CriarEmpresaDto } from './criar-empresa.dto';

export class AtualizarEmpresaDto extends PartialType(
  CriarEmpresaDto,
) {}