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

export class CriarVagaDto {
  @IsString()
  empresaId!: string;

  @IsString()
  titulo!: string;

  @IsEnum(Cargo)
  cargo!: Cargo;

  @IsEnum(Modalidade)
  modalidade!: Modalidade;

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

  @IsArray()
  @ArrayMinSize(1)
  skills!: string[];
}
