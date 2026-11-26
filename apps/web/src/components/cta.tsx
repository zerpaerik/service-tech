import { CalendarDays } from 'lucide-react';
import { getDictionary, type Locale } from '@/i18n';
import { buttonStyles } from '@/lib/ui';
import { WhatsAppIcon } from './icons';
import { Reveal } from './reveal';
import { RequestButton } from './request-button';
import { WhatsAppLink } from './whatsapp-link';

export function Cta({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  return (
    <section id={t.anchors.contact} className="scroll-mt-18 px-6 pt-24 pb-28 sm:pt-26">
      <Reveal>
        <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[28px] border border-line-2 bg-surface px-6 py-18 text-center shadow-[0_24px_60px_var(--shadow)] sm:px-8 sm:py-20">
          <div
            aria-hidden="true"
            className="absolute -top-65 -left-30 size-[520px] animate-drift rounded-full glow-brand"
          />
          <div
            aria-hidden="true"
            className="absolute -right-35 -bottom-70 size-[520px] animate-drift-slow rounded-full glow-accent"
          />
          <h2 className="relative font-display text-[clamp(32px,4.4vw,54px)] leading-[1.1] font-bold tracking-tight">
            {t.cta.title}
          </h2>
          <p className="relative mx-auto mt-4.5 max-w-[580px] text-lg leading-relaxed text-fg-soft">
            {t.cta.text}
          </p>
          <div className="relative mt-9 flex flex-wrap justify-center gap-3">
            <RequestButton mode="call" className={buttonStyles.primary}>
              <CalendarDays className="size-5" aria-hidden="true" />
              {t.cta.schedule}
            </RequestButton>
            <WhatsAppLink lang={lang} className={buttonStyles.whatsapp}>
              <WhatsAppIcon className="size-5" />
              {t.cta.whatsapp}
            </WhatsAppLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
