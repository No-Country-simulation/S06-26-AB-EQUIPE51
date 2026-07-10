import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { EmpresasModule } from './empresas/empresas.module';
import { VagasModule } from './vagas/vagas.module';
import { AuthModule } from './auth/auth.module';
import { CandidatoModule } from './candidatos/candidato.module';
import { MatchModule } from './match/match.module';
import { InsightsModule } from './insights/insights.module';
import { DashboardModule } from './dashboard/dashboard.module';


@Module({
  imports: [
    PrismaModule,
    EmpresasModule,
    VagasModule,
    AuthModule,
    CandidatoModule,
    MatchModule,
    InsightsModule,
    DashboardModule,
  ],
})
export class AppModule {}
