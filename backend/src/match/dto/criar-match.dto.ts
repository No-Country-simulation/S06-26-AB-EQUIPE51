import {
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { MatchFiltrosDto } from './match-filtros.dto';
import { MatchVagaDto } from './match-vaga.dto';

export class CriarMatchDto {
  @IsString()
  empresa_id!: string;

  @ValidateNested()
  @Type(() => MatchVagaDto)
  vaga!: MatchVagaDto;

  @ValidateNested()
  @Type(() => MatchFiltrosDto)
  filtros!: MatchFiltrosDto;
}
