import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

import { CriarMatchDto } from '../dto/criar-match.dto';
import { MatchService } from '../services/match.service';

@Controller('match')
export class MatchController {
  constructor(
    private readonly service: MatchService,
  ) {}

  @Roles('EMPRESA', 'ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  executar(
    @Body() dto: CriarMatchDto,
    @Req() req: Request,
  ) {
    return this.service.executar(dto, req);
  }
}
