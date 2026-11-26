import { z } from 'zod';
import { BUDGET_OPTIONS, DEFAULT_LOCALE, LOCALES, SERVICE_TYPES, type Locale } from './services.js';

/** Tipo de solicitud: pedir un servicio o agendar una llamada. */
export const LEAD_KINDS = ['REQUEST', 'CALL'] as const;
export type LeadKind = (typeof LEAD_KINDS)[number];

/** Cómo prefiere hablar quien agenda una llamada. */
export const CALL_MODES = ['VIDEO', 'WHATSAPP', 'PHONE'] as const;
export type CallMode = (typeof CALL_MODES)[number];

/** Zona horaria de las llamadas: Venezuela, UTC−4 todo el año (sin horario de verano). */
export const CALL_TIME_ZONE = 'America/Caracas';
export const CALL_UTC_OFFSET = '-04:00';

export const LEAD_LIMITS = {
  name: { min: 2, max: 80 },
  contact: { max: 120 },
  title: { max: 120 },
  description: { max: 2000 },
  source: { max: 200 },
} as const;

const MESSAGES = {
  es: {
    service: 'Elige un tipo de servicio',
    name: 'Escribe tu nombre',
    nameTooLong: 'El nombre es demasiado largo',
    contact: 'Contacto inválido',
    contactTooLong: 'El contacto es demasiado largo',
    need: 'Elige una idea o cuéntanos qué necesitas',
    titleTooLong: 'El texto es demasiado largo',
    descriptionTooLong: 'La descripción es demasiado larga',
    budget: 'Elige un rango de presupuesto',
    callMode: 'Elige cómo prefieres hablar',
    callDate: 'Elige un día',
    callTime: 'Elige una hora',
  },
  en: {
    service: 'Choose a type of service',
    name: 'Enter your name',
    nameTooLong: 'The name is too long',
    contact: 'Invalid contact',
    contactTooLong: 'The contact is too long',
    need: 'Pick an idea or tell us what you need',
    titleTooLong: 'The text is too long',
    descriptionTooLong: 'The description is too long',
    budget: 'Choose a budget range',
    callMode: 'Choose how you’d like to talk',
    callDate: 'Choose a day',
    callTime: 'Choose a time',
  },
} satisfies Record<Locale, Record<string, string>>;

/** Texto opcional: recorta espacios y convierte "" en undefined. */
function optionalText(max: number, tooLong: string, invalid: string) {
  return z
    .string({ error: invalid })
    .trim()
    .max(max, tooLong)
    .optional()
    .transform((value) => (value ? value : undefined));
}

function isValidDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

/**
 * Validación de una solicitud (servicio o llamada), con los mensajes de error
 * en el idioma indicado. La usan el formulario, la Server Action y el API.
 */
export function buildLeadSchema(locale: Locale = DEFAULT_LOCALE) {
  const m = MESSAGES[locale];
  return z
    .object({
      kind: z.enum(LEAD_KINDS).default('REQUEST'),
      service: z.enum(SERVICE_TYPES, { error: m.service }),
      name: z
        .string({ error: m.name })
        .trim()
        .min(LEAD_LIMITS.name.min, m.name)
        .max(LEAD_LIMITS.name.max, m.nameTooLong),
      contact: optionalText(LEAD_LIMITS.contact.max, m.contactTooLong, m.contact),
      /** Lo que necesita, en pocas palabras (p. ej. la idea elegida: "Tienda online"). */
      title: optionalText(LEAD_LIMITS.title.max, m.titleTooLong, m.need),
      description: optionalText(LEAD_LIMITS.description.max, m.descriptionTooLong, m.need),
      budget: z.enum(BUDGET_OPTIONS, { error: m.budget }).optional(),
      callMode: z.enum(CALL_MODES, { error: m.callMode }).optional(),
      /** Día de la llamada (AAAA-MM-DD, hora de Venezuela). */
      callDate: z
        .string({ error: m.callDate })
        .regex(/^\d{4}-\d{2}-\d{2}$/, m.callDate)
        .refine(isValidDate, m.callDate)
        .optional(),
      /** Hora de la llamada (HH:MM, hora de Venezuela). */
      callTime: z
        .string({ error: m.callTime })
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, m.callTime)
        .optional(),
      /** De dónde llegó la persona (UTM o sitio de referencia). */
      source: optionalText(LEAD_LIMITS.source.max, m.contactTooLong, m.contact),
      locale: z.enum(LOCALES).default(DEFAULT_LOCALE),
    })
    .superRefine((data, ctx) => {
      if (data.kind === 'REQUEST' && !data.title && !data.description) {
        ctx.addIssue({ code: 'custom', path: ['title'], message: m.need });
      }
      if (data.kind === 'CALL') {
        if (!data.callMode)
          ctx.addIssue({ code: 'custom', path: ['callMode'], message: m.callMode });
        if (!data.callDate)
          ctx.addIssue({ code: 'custom', path: ['callDate'], message: m.callDate });
        if (!data.callTime)
          ctx.addIssue({ code: 'custom', path: ['callTime'], message: m.callTime });
      }
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

/** Fecha y hora de la llamada como instante exacto (hora de Venezuela). */
export function callDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00${CALL_UTC_OFFSET}`);
}
