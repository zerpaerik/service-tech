import { normalizeWhatsAppNumber } from '@mandaito/shared';

/**
 * Configuración del sitio. Se lee en el servidor; la página es estática,
 * así que estos valores se fijan en el build (Railway recompila al cambiar variables).
 */
export const site = {
  name: 'Mandaito Tech',
  shortName: 'Mandaito',
  tagline: 'Software, webs y marketing digital',
  description:
    'Desarrollamos sitios web, sistemas a medida y estrategias de marketing digital para empresas que quieren vender más y trabajar mejor. Webs desde $50.',
  url: (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  whatsappNumber: normalizeWhatsAppNumber(process.env.WHATSAPP_NUMBER),
} as const;

export const navLinks = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#proceso', label: 'Proceso' },
  { href: '#tecnologias', label: 'Tecnologías' },
  { href: '#contacto', label: 'Contacto' },
] as const;
