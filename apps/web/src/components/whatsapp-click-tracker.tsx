'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

/** Registra cada clic en un enlace directo a WhatsApp (header, hero, barra, botón flotante…). */
export function WhatsAppClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="https://wa.me/"]');
      if (!link || link.closest('dialog')) return;
      // Sección donde estaba el enlace (hero, contacto…), la barra móvil o el botón flotante.
      const place =
        link.closest('section[id]')?.id ?? (link.closest('nav') ? 'mobile-bar' : 'floating');
      track({ name: 'whatsapp_click', place });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
