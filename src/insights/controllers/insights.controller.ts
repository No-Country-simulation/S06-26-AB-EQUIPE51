import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

import { InsightsService } from '../services/insights.service';

@Controller('insights')
export class InsightsController {
  constructor(
    private readonly service: InsightsService,
  ) {}

  @Roles('EMPRESA', 'ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  buscarInsights() {
    return this.service.buscarInsights();
  }
}
