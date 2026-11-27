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
  email: 'mandaitotech@gmail.com',
  instagram: 'mandaitotech',
} as const;

/** Número de WhatsApp legible: "+58 422 111 4369" (Venezuela) o "+<dígitos>" en otros países. */
export function displayPhone(digits: string): string {
  const ve = /^58(\d{3})(\d{3})(\d{4})$/.exec(digits);
  return ve ? `+58 ${ve[1]} ${ve[2]} ${ve[3]}` : `+${digits}`;
}

/** Perfil de Instagram de la marca. */
export const instagramUrl = `https://www.instagram.com/${site.instagram}/`;

/** Enlaces de navegación (anclas de cada sección) en el idioma de la página. */
export function navLinks(t: Dictionary) {
  return [
    { href: `#${t.anchors.services}`, label: t.nav.services },
    { href: `#${t.anchors.packages}`, label: t.nav.packages },
    { href: `#${t.anchors.process}`, label: t.nav.process },
    { href: `#${t.anchors.faq}`, label: t.nav.faq },
  ];
}
