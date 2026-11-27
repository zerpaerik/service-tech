'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

const CONTACT_LINKS = 'a[href^="https://wa.me/"], a[href^="mailto:"], a[href*="instagram.com/"]';

/** Dónde estaba el enlace: la sección (hero, contacto…), el pie, la barra móvil o el botón flotante. */
function placeOf(link: Element): string {
  const section = link.closest('section[id]');
  if (section) return section.id;
  if (link.closest('footer')) return 'footer';
  return link.closest('nav') ? 'mobile-bar' : 'floating';
}

/** Registra cada clic en un enlace de contacto: WhatsApp, correo o Instagram. */
export function WhatsAppClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.(CONTACT_LINKS);
      // Los enlaces del formulario ya cuentan como solicitud (generate_lead).
      if (!(link instanceof HTMLAnchorElement) || link.closest('dialog')) return;
      const place = placeOf(link);
      if (link.href.startsWith('mailto:')) track({ name: 'email_click', place });
      else if (link.hostname.endsWith('instagram.com')) track({ name: 'instagram_click', place });
      else track({ name: 'whatsapp_click', place });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
