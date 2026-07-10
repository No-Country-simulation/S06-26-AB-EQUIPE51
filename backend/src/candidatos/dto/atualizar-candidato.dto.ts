import { PartialType } from '@nestjs/mapped-types';
import { CriarCandidatoDto } from './criar-candidato.dto';

export class AtualizarCandidatoDto extends PartialType(
  CriarCandidatoDto,
) {}