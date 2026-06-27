import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';


import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';


import type { Request } from 'express';

import { VagasService } from '../services/vagas.service';

import { CriarVagaDto } from '../dto/criar-vaga.dto';
import { AtualizarVagaDto } from '../dto/atualizar-vaga.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vagas')
export class VagasController {
  constructor(
    private readonly vagasService: VagasService,
  ) {}

  @Roles('EMPRESA', 'ADMIN')
  @Post()
  async criar(
    @Body() dto: CriarVagaDto,
    @Req() req: Request,
  ) {
    return this.vagasService.criar(
      dto,
      req,
    );
  }

  @Roles('EMPRESA', 'CANDIDATO', 'ADMIN')
  @Get()
  async listar(
    @Req() req: Request,
  ) {
    return this.vagasService.listar(req);
  }

  @Roles('EMPRESA', 'CANDIDATO', 'ADMIN')
  @Get('empresa/:empresaId')
  async listarPorEmpresa(
    @Param('empresaId')
    empresaId: string,
    @Req() req: Request,
  ) {
    return this.vagasService.listarPorEmpresa(
      empresaId,
      req,
    );
  }

  @Roles('EMPRESA', 'CANDIDATO', 'ADMIN')
  @Get(':id')
  async buscarPorId(
    @Param('id') id: string,
  ) {
    return this.vagasService.buscarPorId(id);
  }

  @Roles('EMPRESA', 'ADMIN')
  @Patch(':id')
  async atualizar(
    @Param('id') id: string,
    @Body() dto: AtualizarVagaDto,
    @Req() req: Request,
  ) {
    return this.vagasService.atualizar(
      id,
      dto,
      req,
    );
  }

  @Roles('EMPRESA', 'ADMIN')
  @Delete(':id')
  async remover(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.vagasService.remover(
      id,
      req,
    );
  }
}
