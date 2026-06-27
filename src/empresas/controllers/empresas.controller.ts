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

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';

import { EmpresasService } from '../services/empresas.service';
import { CriarEmpresaDto } from '../dto/criar-empresa.dto';
import { AtualizarEmpresaDto } from '../dto/atualizar-empresa.dto';

@Controller('empresas')
export class EmpresasController {
  constructor(
    private readonly empresasService: EmpresasService,
  ) {}

  // Exclusivo para administradores
  @Post()
  async criar(
    @Body() dto: CriarEmpresaDto,
    @Req() req: Request,
  ) {
    return this.empresasService.criar(
      dto,
      req,
    );
  }

  // Privado
  @Roles('EMPRESA', 'ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async listar(
    @Req() req: Request,
  ) {
    return this.empresasService.listar(
      req,
    );
  }

  // Privado
  @Roles('EMPRESA')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('me')
  async buscarMinhaEmpresa(
    @Req() req: Request,
  ) {
    return this.empresasService.buscarMinhaEmpresa(
      req,
    );
  }

  // Privado
  @Roles('EMPRESA', 'ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async buscarPorId(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.empresasService.buscarPorId(
      id,
      req,
    );
  }

  // Privado
  @Roles('EMPRESA', 'ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async atualizar(
    @Param('id') id: string,
    @Body() dto: AtualizarEmpresaDto,
    @Req() req: Request,
  ) {
    return this.empresasService.atualizar(
      id,
      dto,
      req,
    );
  }

  // Privado
  @Roles('EMPRESA', 'ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remover(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.empresasService.remover(
      id,
      req,
    );
  }
}
