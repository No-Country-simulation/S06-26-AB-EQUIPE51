import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

import { EmpresaRepository } from '../empresas/repositories/empresa.repository';
import { LogsAuthService } from '../logs-auth/services/logs-auth.service';
import { PrismaService } from '../prisma/prisma.service';

import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  private readonly accessTokenExpiresIn = '15m';
  private readonly refreshTokenExpiresIn = '7d';
  private readonly refreshTokenExpiresInSeconds = 604800;
  private readonly refreshTokenSecret =
    process.env.JWT_REFRESH_SECRET ||
    process.env.JWT_SECRET ||
    'appbit-refresh-secret-dev';

  constructor(
    private readonly jwtService: JwtService,
    private readonly empresaRepository: EmpresaRepository,
    private readonly prisma: PrismaService,
    private readonly logsAuthService: LogsAuthService,
  ) {}

  private criarPayload(usuarioId: string, role: string) {
    return {
      sub: usuarioId,
      role,
    };
  }

  private aplicarCookieRefresh(
    res: Response | undefined,
    refreshToken: string,
  ) {
    res?.cookie('appbit_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite:
        process.env.NODE_ENV === 'production'
          ? 'none'
          : 'lax',
      path: '/',
      maxAge: this.refreshTokenExpiresInSeconds * 1000,
    });
  }

  private limparCookieRefresh(
    res: Response | undefined,
  ) {
    res?.clearCookie('appbit_refresh_token', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite:
        process.env.NODE_ENV === 'production'
          ? 'none'
          : 'lax',
    });
  }

  private retornarAccessToken(tokens: {
    access_token: string;
    token_type: string;
    expires_in: number;
  }) {
    return {
      access_token: tokens.access_token,
      token_type: tokens.token_type,
      expires_in: tokens.expires_in,
    };
  }

  private async assinarTokens(usuarioId: string, role: string) {
    const payload = this.criarPayload(usuarioId, role);
    const refreshTokenJti = randomUUID();

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.accessTokenExpiresIn,
    });

    const refreshToken = await this.jwtService.signAsync(
      {
        ...payload,
        jti: refreshTokenJti,
      },
      {
        secret: this.refreshTokenSecret,
        expiresIn: this.refreshTokenExpiresIn,
      },
    );

    const tokenHash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.refreshToken.create({
      data: {
        usuarioId,
        jti: refreshTokenJti,
        tokenHash,
        expiraEm: new Date(
          Date.now() +
            this.refreshTokenExpiresInSeconds * 1000,
        ),
      },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 900,
      refresh_expires_in: this.refreshTokenExpiresInSeconds,
    };
  }

  async me(usuarioId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        id: usuarioId,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        ativo: true,
        criadoEm: true,
        atualizadoEm: true,
        empresa: {
          select: {
            id: true,
            nomeEmpresa: true,
            metaDiversidade: true,
            gruposPrioritarios: true,
            ativo: true,
          },
        },
        candidato: {
          select: {
            id: true,
            skills: true,
            nivel: true,
            cargoDesejado: true,
            regiao: true,
            grupoDiversidade: true,
            latitude: true,
            longitude: true,
            ativo: true,
          },
        },
      },
    });

    if (!usuario || !usuario.ativo) {
      throw new NotFoundException('Usuario nao encontrado.');
    }

    return usuario;
  }

  async login(
    dto: LoginDto,
    req?: Request,
    res?: Response,
  ) {
    const usuario =
      await this.empresaRepository.buscarUsuarioPorEmail(
        dto.email,
      );

    if (!usuario) {
      await this.logsAuthService.registrarLogin({
        email: dto.email,
        sucesso: false,
        motivo: 'USUARIO_NAO_ENCONTRADO',
        req,
      });

      throw new UnauthorizedException(
        'E-mail ou senha inválidos.',
      );
    }

    if (!usuario.ativo) {
      await this.logsAuthService.registrarLogin({
        usuarioId: usuario.id,
        email: usuario.email,
        sucesso: false,
        motivo: 'USUARIO_INATIVO',
        req,
      });

      throw new UnauthorizedException(
        'E-mail ou senha inválidos.',
      );
    }

    const senhaValida = await bcrypt.compare(
      dto.senha,
      usuario.senha,
    );

    if (!senhaValida) {
      await this.logsAuthService.registrarLogin({
        usuarioId: usuario.id,
        email: usuario.email,
        sucesso: false,
        motivo: 'SENHA_INVALIDA',
        req,
      });

      throw new UnauthorizedException(
        'E-mail ou senha inválidos.',
      );
    }

    const tokens = await this.assinarTokens(
      usuario.id,
      usuario.role,
    );

    this.aplicarCookieRefresh(
      res,
      tokens.refresh_token,
    );

    await this.logsAuthService.registrarLogin({
      usuarioId: usuario.id,
      email: usuario.email,
      sucesso: true,
      req,
    });

    return this.retornarAccessToken(tokens);
  }

  async refresh(
    dto: RefreshTokenDto = {},
    req?: Request,
    res?: Response,
  ) {
    let usuarioId: string | undefined;

    const refreshTokenBody =
      typeof dto.refresh_token === 'string'
        ? dto.refresh_token
        : undefined;

    const refreshToken =
      refreshTokenBody ??
      req?.cookies?.appbit_refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException(
        'Refresh token invalido ou expirado.',
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.refreshTokenSecret,
        },
      );

      if (!payload?.sub || !payload?.jti) {
        throw new UnauthorizedException(
          'Refresh token invalido ou expirado.',
        );
      }

      usuarioId = payload.sub;

      const refreshTokenSalvo =
        await this.prisma.refreshToken.findUnique({
          where: {
            jti: payload.jti,
          },
          include: {
            usuario: {
              select: {
                ativo: true,
                role: true,
              },
            },
          },
        });

      if (
        !refreshTokenSalvo ||
        refreshTokenSalvo.usuarioId !== payload.sub ||
        refreshTokenSalvo.revogadoEm ||
        refreshTokenSalvo.expiraEm <= new Date() ||
        !refreshTokenSalvo.usuario.ativo
      ) {
        throw new UnauthorizedException(
          'Refresh token invalido ou expirado.',
        );
      }

      const tokenValido = await bcrypt.compare(
        refreshToken,
        refreshTokenSalvo.tokenHash,
      );

      if (!tokenValido) {
        throw new UnauthorizedException(
          'Refresh token invalido ou expirado.',
        );
      }

      const revogacao =
        await this.prisma.refreshToken.updateMany({
          where: {
            id: refreshTokenSalvo.id,
            revogadoEm: null,
            expiraEm: {
              gt: new Date(),
            },
          },
          data: {
            revogadoEm: new Date(),
          },
        });

      if (revogacao.count !== 1) {
        throw new UnauthorizedException(
          'Refresh token invalido ou expirado.',
        );
      }

      const tokens = await this.assinarTokens(
        payload.sub,
        refreshTokenSalvo.usuario.role,
      );

      this.aplicarCookieRefresh(
        res,
        tokens.refresh_token,
      );

      await this.logsAuthService.registrarRefresh({
        usuarioId: payload.sub,
        sucesso: true,
        req,
      });

      return this.retornarAccessToken(tokens);
    } catch {
      await this.logsAuthService.registrarRefresh({
        usuarioId,
        sucesso: false,
        motivo: 'REFRESH_INVALIDO',
        req,
      });

      throw new UnauthorizedException(
        'Refresh token invalido ou expirado.',
      );
    }
  }

  async logout(
    dto: RefreshTokenDto = {},
    req?: Request,
    res?: Response,
  ) {
    const refreshTokenBody =
      typeof dto.refresh_token === 'string'
        ? dto.refresh_token
        : undefined;

    const refreshToken =
      refreshTokenBody ??
      req?.cookies?.appbit_refresh_token;

    this.limparCookieRefresh(res);

    if (!refreshToken) {
      return {
        message: 'Logout realizado com sucesso.',
      };
    }

    let usuarioId: string | undefined;

    try {
      const payload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.refreshTokenSecret,
        },
      );

      if (!payload?.sub || !payload?.jti) {
        throw new UnauthorizedException(
          'Refresh token invalido ou expirado.',
        );
      }

      usuarioId = payload.sub;

      const refreshTokenSalvo =
        await this.prisma.refreshToken.findUnique({
          where: {
            jti: payload.jti,
          },
        });

      if (
        refreshTokenSalvo &&
        refreshTokenSalvo.usuarioId === payload.sub &&
        !refreshTokenSalvo.revogadoEm
      ) {
        const tokenValido = await bcrypt.compare(
          refreshToken,
          refreshTokenSalvo.tokenHash,
        );

        if (tokenValido) {
          await this.prisma.refreshToken.update({
            where: {
              id: refreshTokenSalvo.id,
            },
            data: {
              revogadoEm: new Date(),
            },
          });
        }
      }

      await this.logsAuthService.registrar({
        usuarioId,
        acao: 'LOGOUT_SUCESSO',
        sucesso: true,
        ipOrigem: String(
          req?.headers['x-forwarded-for'] ||
            req?.ip ||
            req?.socket.remoteAddress ||
            '',
        ),
        userAgent: req?.headers[
          'user-agent'
        ] as string | undefined,
      });
    } catch {
      await this.logsAuthService.registrar({
        usuarioId,
        acao: 'LOGOUT_FALHA',
        sucesso: false,
        motivo: 'REFRESH_INVALIDO',
        ipOrigem: String(
          req?.headers['x-forwarded-for'] ||
            req?.ip ||
            req?.socket.remoteAddress ||
            '',
        ),
        userAgent: req?.headers[
          'user-agent'
        ] as string | undefined,
      });
    }

    return {
      message: 'Logout realizado com sucesso.',
    };
  }
}
