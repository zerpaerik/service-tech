import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

interface TrackableRequest {
  ip?: string;
  headers: Record<string, string | string[] | undefined>;
}

/**
 * Limita por IP del visitante. El frontend llama al API desde su servidor
 * (red privada de Railway) y reenvía la IP real en x-forwarded-for.
 */
@Injectable()
export class ClientIpThrottlerGuard extends ThrottlerGuard {
  protected override async getTracker(req: TrackableRequest): Promise<string> {
    const forwarded = req.headers['x-forwarded-for'];
    const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim();
    return first || req.ip || 'unknown';
  }
}
