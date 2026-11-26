import { BadRequestException, Injectable, type PipeTransform } from '@nestjs/common';
import { z } from 'zod';

/** Valida el body con un esquema de Zod (el mismo que usa el frontend). */
@Injectable()
export class ZodValidationPipe<TSchema extends z.ZodType> implements PipeTransform {
  constructor(private readonly schema: TSchema) {}

  transform(value: unknown): z.output<TSchema> {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      const errors = Object.fromEntries(
        Object.entries(fieldErrors).map(([field, messages]) => [field, (messages as string[])[0]]),
      );
      throw new BadRequestException({ message: 'Datos inválidos', errors });
    }
    return result.data;
  }
}
