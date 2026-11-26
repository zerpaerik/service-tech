import { z } from 'zod';
import { BUDGET_OPTIONS, DEFAULT_LOCALE, SERVICE_TYPES, type Locale } from './services.js';

export const LEAD_LIMITS = {
  name: { min: 2, max: 80 },
  contact: { max: 120 },
  title: { min: 4, max: 120 },
  description: { min: 10, max: 2000 },
} as const;

const MESSAGES = {
  es: {
    service: 'Elige un tipo de servicio',
    name: 'Escribe tu nombre',
    nameTooLong: 'El nombre es demasiado largo',
    contact: 'Contacto inválido',
    contactTooLong: 'El contacto es demasiado largo',
    title: 'Escribe un título breve para tu proyecto',
    titleTooLong: 'El título es demasiado largo',
    description: 'Cuéntanos un poco más (mínimo 10 caracteres)',
    descriptionTooLong: 'La descripción es demasiado larga',
    budget: 'Elige un rango de presupuesto',
  },
  en: {
    service: 'Choose a type of service',
    name: 'Enter your name',
    nameTooLong: 'The name is too long',
    contact: 'Invalid contact',
    contactTooLong: 'The contact is too long',
    title: 'Add a short title for your project',
    titleTooLong: 'The title is too long',
    description: 'Tell us a bit more (at least 10 characters)',
    descriptionTooLong: 'The description is too long',
    budget: 'Choose a budget range',
  },
} satisfies Record<Locale, Record<string, string>>;

/**
 * Validación de una solicitud de servicio, con los mensajes de error en el idioma indicado.
 * La usan el formulario, la Server Action y el API.
 */
export function buildLeadSchema(locale: Locale = DEFAULT_LOCALE) {
  const m = MESSAGES[locale];
  return z.object({
    service: z.enum(SERVICE_TYPES, { error: m.service }),
    name: z
      .string({ error: m.name })
      .trim()
      .min(LEAD_LIMITS.name.min, m.name)
      .max(LEAD_LIMITS.name.max, m.nameTooLong),
    contact: z
      .string({ error: m.contact })
      .trim()
      .max(LEAD_LIMITS.contact.max, m.contactTooLong)
      .optional()
      .transform((value) => (value ? value : undefined)),
    title: z
      .string({ error: m.title })
      .trim()
      .min(LEAD_LIMITS.title.min, m.title)
      .max(LEAD_LIMITS.title.max, m.titleTooLong),
    description: z
      .string({ error: m.description })
      .trim()
      .min(LEAD_LIMITS.description.min, m.description)
      .max(LEAD_LIMITS.description.max, m.descriptionTooLong),
    budget: z.enum(BUDGET_OPTIONS, { error: m.budget }).optional(),
  });
}

/** Esquema con mensajes en español (el que usa el API). */
export const createLeadSchema = buildLeadSchema(DEFAULT_LOCALE);

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
