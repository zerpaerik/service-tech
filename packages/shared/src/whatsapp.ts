import type { CallMode, LeadKind } from './lead.js';
import {
  budgetLabel,
  DEFAULT_LOCALE,
  SERVICE_LABELS,
  type Locale,
  type ServiceType,
} from './services.js';

export interface WhatsAppLeadDraft {
  kind?: LeadKind;
  service: ServiceType;
  name?: string;
  contact?: string;
  /** Lo que necesita (p. ej. la idea elegida). */
  title?: string;
  description?: string;
  budget?: string;
  callMode?: CallMode;
  /** AAAA-MM-DD */
  callDate?: string;
  /** HH:MM */
  callTime?: string;
  /** Identificador del lead guardado, para cruzarlo con la base de datos. */
  reference?: string;
}

const COPY = {
  es: {
    hello: (name: string) => `Hola, soy ${name}.`,
    request: 'Quiero solicitar:',
    call: (mode: string, service: string) =>
      `Quiero agendar una *${mode}* para hablar de *${service}*.`,
    modes: { VIDEO: 'videollamada', WHATSAPP: 'llamada de WhatsApp', PHONE: 'llamada telefónica' },
    name: '[tu nombre]',
    need: '[lo que necesitas]',
    needLabel: 'Necesito',
    detailsLabel: 'Detalles',
    budgetLabel: 'Presupuesto',
    contactLabel: 'Contacto',
    dayLabel: 'Día',
    timeLabel: 'Hora',
    day: '[elige un día]',
    time: '[elige una hora]',
    timeZone: '(hora de Venezuela)',
  },
  en: {
    hello: (name: string) => `Hi, I'm ${name}.`,
    request: "I'd like to request:",
    call: (mode: string, service: string) =>
      `I'd like to schedule a *${mode}* to talk about *${service}*.`,
    modes: { VIDEO: 'video call', WHATSAPP: 'WhatsApp call', PHONE: 'phone call' },
    name: '[your name]',
    need: '[what you need]',
    needLabel: 'I need',
    detailsLabel: 'Details',
    budgetLabel: 'Budget',
    contactLabel: 'Contact',
    dayLabel: 'Day',
    timeLabel: 'Time',
    day: '[pick a day]',
    time: '[pick a time]',
    timeZone: '(Venezuela time, GMT−4)',
  },
} satisfies Record<Locale, Record<string, unknown>>;

/** Saludo del enlace directo a WhatsApp. */
export const WHATSAPP_GREETING: Record<Locale, string> = {
  es: 'Hola Mandaito Tech, quiero información sobre sus servicios.',
  en: "Hi Mandaito Tech, I'd like some information about your services.",
};

/** Día de la llamada legible: "jueves 27/11" o "Thursday, Nov 27". */
export function formatCallDay(date: string, locale: Locale = DEFAULT_LOCALE): string {
  const day = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(day.getTime())) return date;
  if (locale === 'en') {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(day);
  }
  const weekday = new Intl.DateTimeFormat('es', { weekday: 'long', timeZone: 'UTC' }).format(day);
  return `${weekday} ${day.getUTCDate()}/${day.getUTCMonth() + 1}`;
}

/**
 * Arma el texto que el cliente envía por WhatsApp, en el idioma de la página.
 * Usa *negritas* con la sintaxis de WhatsApp.
 */
export function buildWhatsAppMessage(
  draft: WhatsAppLeadDraft,
  locale: Locale = DEFAULT_LOCALE,
): string {
  const c = COPY[locale];
  const service = SERVICE_LABELS[locale][draft.service];
  const lines = [c.hello(draft.name?.trim() || c.name)];
  const title = draft.title?.trim();
  const description = draft.description?.trim();

  if (draft.kind === 'CALL') {
    lines.push(c.call(c.modes[draft.callMode ?? 'VIDEO'], service), '');
    lines.push(
      `*${c.dayLabel}:* ${draft.callDate ? formatCallDay(draft.callDate, locale) : c.day}`,
    );
    lines.push(`*${c.timeLabel}:* ${draft.callTime ? `${draft.callTime} ${c.timeZone}` : c.time}`);
    if (title) lines.push(`*${c.needLabel}:* ${title}`);
    if (description) lines.push(`*${c.detailsLabel}:* ${description}`);
  } else {
    lines.push(`${c.request} *${service}*`, '');
    // Sin idea elegida, la línea "Necesito:" sobra si ya hay detalles.
    if (title || !description) lines.push(`*${c.needLabel}:* ${title || c.need}`);
    if (description) lines.push(`*${c.detailsLabel}:* ${description}`);
  }
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
