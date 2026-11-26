import { normalizeWhatsAppNumber } from '@mandaito/shared';
import type { Dictionary } from '@/i18n';

/**
 * Configuración del sitio. Se lee en el servidor; la página es estática,
 * así que estos valores se fijan en el build (Railway recompila al cambiar variables).
 */
export const site = {
  name: 'Mandaito Tech',
  shortName: 'Mandaito',
  url: (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  whatsappNumber: normalizeWhatsAppNumber(process.env.WHATSAPP_NUMBER),
} as const;

/** Enlaces de navegación (anclas de cada sección) en el idioma de la página. */
export function navLinks(t: Dictionary) {
  return [
    { href: `#${t.anchors.services}`, label: t.nav.services },
    { href: `#${t.anchors.packages}`, label: t.nav.packages },
    { href: `#${t.anchors.process}`, label: t.nav.process },
    { href: `#${t.anchors.faq}`, label: t.nav.faq },
  ];
}
