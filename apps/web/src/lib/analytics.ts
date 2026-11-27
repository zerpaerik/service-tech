/**
 * Eventos de conversión para Google Analytics 4 y el Pixel de Meta.
 * Si los scripts no están cargados (sin IDs configurados), no hace nada.
 */
type Gtag = (command: 'event', name: string, params?: Record<string, unknown>) => void;
type Fbq = (
  command: 'track' | 'trackCustom',
  name: string,
  params?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    fbq?: Fbq;
  }
}

export type ConversionEvent =
  | { name: 'open_form'; mode: 'request' | 'call' }
  | { name: 'lead'; kind: 'REQUEST' | 'CALL'; service: string }
  | { name: 'whatsapp_click'; place: string }
  | { name: 'email_click'; place: string }
  | { name: 'instagram_click'; place: string };

export function track(event: ConversionEvent): void {
  if (typeof window === 'undefined') return;
  try {
    switch (event.name) {
      case 'open_form':
        window.gtag?.('event', 'open_form', { form_mode: event.mode });
        window.fbq?.('trackCustom', 'OpenForm', { mode: event.mode });
        break;
      case 'lead':
        window.gtag?.('event', 'generate_lead', { lead_type: event.kind, service: event.service });
        window.fbq?.('track', event.kind === 'CALL' ? 'Schedule' : 'Lead', {
          content_category: event.service,
        });
        break;
      case 'whatsapp_click':
        window.gtag?.('event', 'contact_whatsapp', { place: event.place });
        window.fbq?.('track', 'Contact');
        break;
      case 'email_click':
        window.gtag?.('event', 'contact_email', { place: event.place });
        window.fbq?.('track', 'Contact');
        break;
      case 'instagram_click':
        window.gtag?.('event', 'visit_instagram', { place: event.place });
        window.fbq?.('trackCustom', 'VisitInstagram', { place: event.place });
        break;
    }
  } catch {
    // La medición nunca debe romper la página.
  }
}

/** IDs válidos: evitan inyectar cualquier otro texto en los scripts. */
export function analyticsIds() {
  const ga = process.env.GA_MEASUREMENT_ID?.trim() ?? '';
  const pixel = process.env.META_PIXEL_ID?.trim() ?? '';
  return {
    gaId: /^G-[A-Z0-9]+$/.test(ga) ? ga : undefined,
    pixelId: /^\d{6,20}$/.test(pixel) ? pixel : undefined,
  };
}
