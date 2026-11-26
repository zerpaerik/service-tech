import { getDictionary, type Locale } from '@/i18n';
import { WhatsAppIcon } from './icons';
import { WhatsAppLink } from './whatsapp-link';

/** Botón flotante de WhatsApp (en móviles lo reemplaza la barra de acciones). */
export function WhatsAppFloat({ lang }: { lang: Locale }) {
  return (
    <WhatsAppLink
      lang={lang}
      ariaLabel={getDictionary(lang).whatsappFloat}
      className="fixed right-6 bottom-6 z-30 hidden size-15 items-center justify-center rounded-full bg-whatsapp text-whatsapp-ink shadow-[0_12px_30px_rgba(37,211,102,0.35)] transition hover:-translate-y-0.5 hover:scale-105 md:flex"
    >
      <WhatsAppIcon className="size-7" strokeWidth={2.2} />
    </WhatsAppLink>
  );
}
