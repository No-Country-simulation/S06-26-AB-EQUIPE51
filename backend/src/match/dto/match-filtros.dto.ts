import {
  IsBoolean,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class MatchFiltrosDto {
  @IsOptional()
  @IsBoolean()
  anti_vies?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  diversidade_minima?: number;
}
