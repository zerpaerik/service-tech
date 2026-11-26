import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ClientIpThrottlerGuard } from './common/throttler.guard.js';
import { EnvModule } from './config/env.module.js';
import { HealthModule } from './health/health.module.js';
import { LeadsModule } from './leads/leads.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    EnvModule,
    PrismaModule,
    ThrottlerModule.forRoot({ throttlers: [{ name: 'default', ttl: 60_000, limit: 60 }] }),
    HealthModule,
    LeadsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ClientIpThrottlerGuard }],
})
export class AppModule {}
