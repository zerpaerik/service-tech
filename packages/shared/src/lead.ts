import { z } from 'zod';
import { BUDGET_OPTIONS, SERVICE_TYPES } from './services.js';

export const LEAD_LIMITS = {
  name: { min: 2, max: 80 },
  contact: { max: 120 },
  title: { min: 4, max: 120 },
  description: { min: 10, max: 2000 },
} as const;

/** Validación de una solicitud de servicio. La usan el formulario, la Server Action y el API. */
export const createLeadSchema = z.object({
  service: z.enum(SERVICE_TYPES, { error: 'Elige un tipo de servicio' }),
  name: z
    .string({ error: 'Escribe tu nombre' })
    .trim()
    .min(LEAD_LIMITS.name.min, 'Escribe tu nombre')
    .max(LEAD_LIMITS.name.max, 'El nombre es demasiado largo'),
  contact: z
    .string({ error: 'Contacto inválido' })
    .trim()
    .max(LEAD_LIMITS.contact.max, 'El contacto es demasiado largo')
    .optional()
    .transform((value) => (value ? value : undefined)),
  title: z
    .string({ error: 'Escribe un título breve para tu proyecto' })
    .trim()
    .min(LEAD_LIMITS.title.min, 'Escribe un título breve para tu proyecto')
    .max(LEAD_LIMITS.title.max, 'El título es demasiado largo'),
  description: z
    .string({ error: 'Cuéntanos un poco más (mínimo 10 caracteres)' })
    .trim()
    .min(LEAD_LIMITS.description.min, 'Cuéntanos un poco más (mínimo 10 caracteres)')
    .max(LEAD_LIMITS.description.max, 'La descripción es demasiado larga'),
  budget: z.enum(BUDGET_OPTIONS, { error: 'Elige un rango de presupuesto' }).optional(),
});

export type CreateLeadInput = z.input<typeof createLeadSchema>;
export type CreateLeadData = z.output<typeof createLeadSchema>;

export interface CreatedLead {
  id: string;
}

export type LeadFieldErrors = Partial<Record<keyof CreateLeadInput, string>>;

/** Convierte un error de Zod en un mensaje por campo (el primero de cada uno). */
export function toFieldErrors(error: z.ZodError): LeadFieldErrors {
  const result: LeadFieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && !(field in result)) {
      result[field as keyof CreateLeadInput] = issue.message;
    }
  }
  return result;
}
