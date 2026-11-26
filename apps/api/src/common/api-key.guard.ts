import { timingSafeEqual } from 'node:crypto';
import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { ENV, type Env } from '../config/env.js';

/**
 * Si INTERNAL_API_KEY está definido, exige la cabecera x-api-key.
 * Protege el API si algún día se le asigna un dominio público.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(@Inject(ENV) private readonly env: Env) {}

  canActivate(context: ExecutionContext): boolean {
    const expected = this.env.INTERNAL_API_KEY;
    if (!expected) return true;

    const provided = context.switchToHttp().getRequest<Request>().header('x-api-key') ?? '';
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new UnauthorizedException('API key inválida');
    }
    return true;
  }
}
