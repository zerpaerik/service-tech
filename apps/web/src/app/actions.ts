'use server';

import { headers } from 'next/headers';
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  createLeadSchema,
  leadReference,
  toFieldErrors,
  type CreatedLead,
  type CreateLeadInput,
  type LeadFieldErrors,
} from '@mandaito/shared';
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
export async function submitLead(input: SubmitLeadInput): Promise<SubmitLeadResult> {
  const parsed = createLeadSchema.safeParse(input);
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
        message: 'Enviaste varias solicitudes seguidas. Espera un minuto y vuelve a intentarlo.',
      };
    }
    reference = leadReference(lead.id);
  } catch (error) {
    console.error('[submitLead] No se pudo registrar el lead en el API:', error);
  }

  const message = buildWhatsAppMessage({ ...data, reference });
  return {
    ok: true,
    whatsappUrl: buildWhatsAppUrl(site.whatsappNumber, message),
    saved: reference !== undefined,
  };
}

async function saveLead(data: unknown): Promise<CreatedLead | 'rate-limited'> {
  const apiUrl = (process.env.API_INTERNAL_URL || 'http://localhost:3001').replace(/\/$/, '');
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
