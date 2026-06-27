import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Cargo } from '../../common/enums/cargo.enum';

export class CriarCandidatoDto {
  @IsString()
  nome!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  senha!: string;

  @IsArray()
  skills!: string[];

  @IsString()
  nivel!: string;

  @IsEnum(Cargo)
  cargoDesejado!: Cargo;

  @IsString()
  regiao!: string;

  @IsOptional()
  @IsString()
  grupoDiversidade?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  ageGroup?: string;

  @IsOptional()
  @IsString()
  incomeCluster?: string;

  @IsOptional()
  @IsString()
  mobilityPattern?: string;

  @IsOptional()
  @IsNumber()
  scoreMobilidade?: number;
}
