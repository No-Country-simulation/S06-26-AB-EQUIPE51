import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserOrIaAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  private extrairBearerToken(authorization?: string) {
    const [tipo, token] = authorization?.split(' ') || [];

    if (tipo !== 'Bearer' || !token) {
      return undefined;
    }

    return token;
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extrairBearerToken(request.headers.authorization);
    const iaInternalToken = process.env.IA_INTERNAL_TOKEN;

    if (!token) {
      throw new UnauthorizedException('Token nao informado.');
    }

    if (iaInternalToken && token === iaInternalToken) {
      request.authType = 'ia';
      request.user = {
        id: 'ia-service',
        role: 'ADMIN',
      };

      return true;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      request.authType = 'user';
      request.user = {
        id: payload.sub,
        role: payload.role || payload.tipo,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Token invalido.');
    }
  }
}
