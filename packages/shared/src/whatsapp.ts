import { SERVICES, type ServiceType } from './services.js';

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

/**
 * Arma el texto que el cliente envía por WhatsApp.
 * Usa *negritas* con la sintaxis de WhatsApp.
 */
export function buildWhatsAppMessage(draft: WhatsAppLeadDraft): string {
  const name = draft.name?.trim() || '[tu nombre]';
  const title = draft.title?.trim() || '[título del proyecto]';
  const description = draft.description?.trim() || '[describe tu proyecto]';

  const lines = [
    `Hola, soy ${name}.`,
    `Quiero solicitar: *${SERVICES[draft.service].label}*`,
    '',
    `*Título:* ${title}`,
    `*Descripción:* ${description}`,
  ];
  if (draft.budget) lines.push(`*Presupuesto:* ${draft.budget}`);
  if (draft.contact?.trim()) lines.push(`*Contacto:* ${draft.contact.trim()}`);
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
