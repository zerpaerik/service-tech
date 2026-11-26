import { buildWhatsAppUrl } from '@mandaito/shared';
import type { ReactNode } from 'react';
import { site } from '@/lib/site';

const GREETING = 'Hola Mandaito Tech, quiero información sobre sus servicios.';

/** Enlace directo a WhatsApp con un saludo precargado. */
export function WhatsAppLink({
  className,
  children,
  ariaLabel,
}: {
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <a
      href={buildWhatsAppUrl(site.whatsappNumber, GREETING)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </a>
  );
}
