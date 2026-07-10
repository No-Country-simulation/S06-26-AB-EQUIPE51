import {
  IsOptional,
  IsString,
} from 'class-validator';

export class RefreshTokenDto {
  @IsOptional()
  @IsString({
    message: 'Refresh token deve ser um texto.',
  })
  refresh_token?: string;
}
