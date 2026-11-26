import { Injectable, Logger } from '@nestjs/common';
import { callDateTime, type CreatedLead, type CreateLeadData } from '@mandaito/shared';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateLeadData): Promise<CreatedLead> {
    const callAt =
      data.kind === 'CALL' && data.callDate && data.callTime
        ? callDateTime(data.callDate, data.callTime)
        : null;
    const lead = await this.prisma.lead.create({
      data: {
        kind: data.kind,
        service: data.service,
        name: data.name,
        contact: data.contact ?? null,
        title: data.title ?? null,
        description: data.description ?? null,
        budget: data.budget ?? null,
        callAt,
        callMode: callAt ? (data.callMode ?? null) : null,
        source: data.source ?? null,
        locale: data.locale,
      },
      select: { id: true },
    });
    this.logger.log(`Nuevo lead ${lead.id} (${data.kind} · ${data.service})`);
    return { id: lead.id };
  }
}
