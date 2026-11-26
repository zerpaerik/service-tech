'use server';

import { headers } from 'next/headers';
import {
  buildWhatsAppMessage,
  buildLeadSchema,
  buildWhatsAppUrl,
  DEFAULT_LOCALE,
  LOCALES,
  leadReference,
  toFieldErrors,
  type CreatedLead,
  type CreateLeadInput,
  type LeadFieldErrors,
  type Locale,
} from '@mandaito/shared';
import { getDictionary } from '@/i18n';
import { site } from '@/lib/site';

export type SubmitLeadResult =
  | { ok: true; whatsappUrl: string; saved: boolean }
  | { ok: false; errors: LeadFieldErrors; message?: string };

export interface SubmitLeadInput extends CreateLeadInput {
  /** Campo trampa para bots: un humano nunca lo completa. */
  website?: string;
}

const API_TIMEOUT_MS = 5000;

/**
 * Registra la solicitud en el API (por la red privada de Railway) y devuelve
 * el enlace de WhatsApp con el mensaje listo. Si el API no responde, el cliente
 * igual puede escribirnos: nunca perdemos el contacto.
 */
export async function submitLead(
  input: SubmitLeadInput,
  requestedLang?: Locale,
): Promise<SubmitLeadResult> {
  // El idioma llega del cliente: solo aceptamos los que existen.
  const lang = LOCALES.includes(requestedLang as Locale)
    ? (requestedLang as Locale)
    : DEFAULT_LOCALE;
  const parsed = buildLeadSchema(lang).safeParse({ ...input, locale: lang });
  if (!parsed.success) {
    return { ok: false, errors: toFieldErrors(parsed.error) };
  }
  const data = parsed.data;

  // Bot detectado: respondemos como si todo hubiera ido bien, sin guardar nada.
  if (input.website) {
    return { ok: true, whatsappUrl: buildWhatsAppUrl(site.whatsappNumber), saved: false };
  }

  let reference: string | undefined;
  try {
    const lead = await saveLead(data);
    if (lead === 'rate-limited') {
      return {
        ok: false,
        errors: {},
        message: getDictionary(lang).request.rateLimited,
      };
    }
    if (lead) reference = leadReference(lead.id);
  } catch (error) {
    console.error('[submitLead] No se pudo registrar el lead en el API:', error);
  }

  const message = buildWhatsAppMessage({ ...data, reference }, lang);
  return {
    ok: true,
    whatsappUrl: buildWhatsAppUrl(site.whatsappNumber, message),
    saved: reference !== undefined,
  };
}

/**
 * Guarda el lead en el API. Devuelve null si API_INTERNAL_URL no está definido:
 * la web puede desplegarse sola y en ese caso solo redirige a WhatsApp.
 */
async function saveLead(data: unknown): Promise<CreatedLead | 'rate-limited' | null> {
  const apiUrl = process.env.API_INTERNAL_URL?.trim().replace(/\/$/, '');
  if (!apiUrl) return null;

  const apiKey = process.env.INTERNAL_API_KEY;
  const requestHeaders = await headers();
  const clientIp =
    requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    requestHeaders.get('x-real-ip') ||
    '';

  const response = await fetch(`${apiUrl}/leads`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(clientIp ? { 'x-forwarded-for': clientIp } : {}),
      ...(apiKey ? { 'x-api-key': apiKey } : {}),
    },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    cache: 'no-store',
  });

  if (response.status === 429) return 'rate-limited';
  if (!response.ok) {
    throw new Error(`API respondió ${response.status}: ${await response.text()}`);
  }
  return (await response.json()) as CreatedLead;
}
