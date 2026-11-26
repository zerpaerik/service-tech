import {
  budgetLabel,
  DEFAULT_LOCALE,
  SERVICE_LABELS,
  type Locale,
  type ServiceType,
} from './services.js';

export interface WhatsAppLeadDraft {
  service: ServiceType;
  name?: string;
  contact?: string;
  title?: string;
  description?: string;
  budget?: string;
  /** Identificador del lead guardado, para cruzarlo con la base de datos. */
  reference?: string;
}

const COPY = {
  es: {
    hello: (name: string) => `Hola, soy ${name}.`,
    request: 'Quiero solicitar:',
    name: '[tu nombre]',
    title: '[título del proyecto]',
    description: '[describe tu proyecto]',
    titleLabel: 'Título',
    descriptionLabel: 'Descripción',
    budgetLabel: 'Presupuesto',
    contactLabel: 'Contacto',
  },
  en: {
    hello: (name: string) => `Hi, I'm ${name}.`,
    request: "I'd like to request:",
    name: '[your name]',
    title: '[project title]',
    description: '[describe your project]',
    titleLabel: 'Title',
    descriptionLabel: 'Description',
    budgetLabel: 'Budget',
    contactLabel: 'Contact',
  },
} satisfies Record<Locale, Record<string, unknown>>;

/** Saludo del enlace directo a WhatsApp. */
export const WHATSAPP_GREETING: Record<Locale, string> = {
  es: 'Hola Mandaito Tech, quiero información sobre sus servicios.',
  en: "Hi Mandaito Tech, I'd like some information about your services.",
};

/**
 * Arma el texto que el cliente envía por WhatsApp, en el idioma de la página.
 * Usa *negritas* con la sintaxis de WhatsApp.
 */
export function buildWhatsAppMessage(
  draft: WhatsAppLeadDraft,
  locale: Locale = DEFAULT_LOCALE,
): string {
  const c = COPY[locale];
  const name = draft.name?.trim() || c.name;
  const title = draft.title?.trim() || c.title;
  const description = draft.description?.trim() || c.description;

  const lines = [
    c.hello(name),
    `${c.request} *${SERVICE_LABELS[locale][draft.service]}*`,
    '',
    `*${c.titleLabel}:* ${title}`,
    `*${c.descriptionLabel}:* ${description}`,
  ];
  if (draft.budget) lines.push(`*${c.budgetLabel}:* ${budgetLabel(draft.budget, locale)}`);
  if (draft.contact?.trim()) lines.push(`*${c.contactLabel}:* ${draft.contact.trim()}`);
  if (draft.reference) lines.push('', `Ref. ${draft.reference}`);
  return lines.join('\n');
}

/** Deja solo los dígitos del número (formato internacional que exige wa.me). */
export function normalizeWhatsAppNumber(phone: string | undefined): string {
  return (phone ?? '').replace(/\D/g, '');
}

/** Enlace wa.me, opcionalmente con un mensaje precargado. */
export function buildWhatsAppUrl(phone: string | undefined, message?: string): string {
  const digits = normalizeWhatsAppNumber(phone);
  const base = digits ? `https://wa.me/${digits}` : 'https://wa.me/';
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Referencia corta y legible a partir del id del lead. */
export function leadReference(id: string): string {
  return `#${id.slice(-6).toUpperCase()}`;
}
