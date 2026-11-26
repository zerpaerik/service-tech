import { CalendarDays } from 'lucide-react';
import { getDictionary, type Locale } from '@/i18n';
import { WhatsAppIcon } from './icons';
import { RequestButton } from './request-button';
import { WhatsAppLink } from './whatsapp-link';

/** Barra fija abajo en móviles: agendar, solicitar y WhatsApp siempre a un toque. */
export function MobileActionBar({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).mobileBar;
  return (
    <nav
      aria-label={t.label}
      className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-line bg-surface/92 px-3 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_var(--shadow)] backdrop-blur-md md:hidden"
    >
      <RequestButton
        mode="call"
        className="flex h-13 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line-3 bg-surface text-[15px] font-semibold text-fg"
      >
        <CalendarDays className="size-4.5 text-accent" aria-hidden="true" />
        {t.schedule}
      </RequestButton>
      <RequestButton className="flex h-13 flex-[1.3] cursor-pointer items-center justify-center rounded-xl bg-brand text-[15px] font-semibold text-on-brand shadow-[0_8px_20px_rgba(249,115,22,0.3)]">
        {t.request}
      </RequestButton>
      <WhatsAppLink
        lang={lang}
        ariaLabel={t.whatsapp}
        className="flex size-13 flex-none items-center justify-center rounded-xl bg-whatsapp text-whatsapp-ink"
      >
        <WhatsAppIcon className="size-6" strokeWidth={2.2} />
      </WhatsAppLink>
    </nav>
  );
}
