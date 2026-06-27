import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

import { CandidatoService } from '../services/candidato.service';

import { CriarCandidatoDto } from '../dto/criar-candidato.dto';
import { AtualizarCandidatoDto } from '../dto/atualizar-candidato.dto';

@Controller('candidatos')
export class CandidatoController {
  constructor(
    private readonly service: CandidatoService,
  ) {}

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  criar(
    @Body() dto: CriarCandidatoDto,
    @Req() req: Request,
  ) {
    return this.service.criar(dto, req);
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  listar() {
    return this.service.listar();
  }

  @Roles('CANDIDATO')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('me')
  buscarMeuPerfil(
    @Req() req: Request,
  ) {
    return this.service.buscarMeuPerfil(req);
  }

  @Roles('CANDIDATO', 'ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  buscarPorId(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.service.buscarPorId(id, req);
  }

  @Roles('CANDIDATO', 'ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  atualizar(
    @Param('id') id: string,
    @Body() dto: AtualizarCandidatoDto,
    @Req() req: Request,
  ) {
    return this.service.atualizar(id, dto, req);
  }

  @Roles('CANDIDATO', 'ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remover(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.service.remover(id, req);
  }
}
