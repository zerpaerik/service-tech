import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { createLeadSchema, type CreatedLead, type CreateLeadData } from '@mandaito/shared';
import { ApiKeyGuard } from '../common/api-key.guard.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { LeadsService } from './leads.service.js';

@Controller('leads')
@UseGuards(ApiKeyGuard)
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  /** Registra una solicitud de servicio. Máximo 5 por minuto por visitante. */
  @Post()
  @HttpCode(201)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  create(
    @Body(new ZodValidationPipe(createLeadSchema)) body: CreateLeadData,
  ): Promise<CreatedLead> {
    return this.leads.create(body);
  }
}
