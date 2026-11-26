import { Injectable, Logger } from '@nestjs/common';
import type { CreatedLead, CreateLeadData } from '@mandaito/shared';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateLeadData): Promise<CreatedLead> {
    const lead = await this.prisma.lead.create({
      data: {
        service: data.service,
        name: data.name,
        contact: data.contact ?? null,
        title: data.title,
        description: data.description,
        budget: data.budget ?? null,
      },
      select: { id: true },
    });
    this.logger.log(`Nuevo lead ${lead.id} (${data.service})`);
    return { id: lead.id };
  }
}
