import { buildWhatsAppUrl, WHATSAPP_GREETING, type Locale } from '@mandaito/shared';
import type { ReactNode } from 'react';
import { site } from '@/lib/site';

/** Enlace directo a WhatsApp con un saludo precargado en el idioma de la página. */
export function WhatsAppLink({
  lang,
  className,
  children,
  ariaLabel,
}: {
  lang: Locale;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <a
      href={buildWhatsAppUrl(site.whatsappNumber, WHATSAPP_GREETING[lang])}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </a>
  );
}
