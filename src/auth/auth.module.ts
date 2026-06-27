import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtStrategy } from './strategies/jwt.strategy';

import { EmpresaRepository } from '../empresas/repositories/empresa.repository';
import { LogsAuthRepository } from '../logs-auth/repositories/logs-auth.repository';
import { LogsAuthService } from '../logs-auth/services/logs-auth.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        'appbit-secret-dev',

      signOptions: {
        expiresIn: '15m',
      },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,

    PrismaService,
    EmpresaRepository,
    LogsAuthService,
    LogsAuthRepository,
  ],

  exports: [
    JwtModule,
    AuthService,
  ],
})
export class AuthModule {}
