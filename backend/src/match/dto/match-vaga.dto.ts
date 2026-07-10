import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Cargo } from '../../common/enums/cargo.enum';
import { Modalidade } from '../../common/enums/modalidade.enum';

export class MatchVagaDto {
  @IsString()
  titulo!: string;

  @IsEnum(Cargo)
  cargo!: Cargo;

  @IsEnum(Modalidade)
  modalidade!: Modalidade;

  @IsArray()
  @ArrayMinSize(1)
  skills!: string[];

  @IsString()
  nivel!: string;

  @IsString()
  regiao!: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}
