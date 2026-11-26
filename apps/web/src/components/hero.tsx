import { WEB_STARTING_PRICE } from '@mandaito/shared';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { getDictionary, type Locale } from '@/i18n';
import { buttonStyles } from '@/lib/ui';
import { HeroVisual } from './hero-visual';
import { RequestButton } from './request-button';
import { WhatsAppLink } from './whatsapp-link';

export function Hero({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  return (
    <section id={t.anchors.home} className="relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 bg-grid" />
      <div
        aria-hidden="true"
        className="absolute -top-[260px] -left-40 size-[680px] animate-drift rounded-full glow-brand blur-[30px]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-30 -right-50 size-[620px] animate-drift-slow rounded-full glow-accent blur-[30px]"
      />

      <div className="relative mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-14 gap-y-6 px-6 pt-14 pb-20 sm:pt-20 sm:pb-26">
        <div className="min-w-0 flex-[1_1_600px] animate-fade-up">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-tint/10 bg-tint/4 px-3.5 py-1.5 text-[13px] text-fg-soft">
            <span className="size-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
            {t.hero.badge}
          </p>

          <h1 className="mt-6 font-display text-[clamp(38px,4.7vw,60px)] leading-[1.06] font-bold tracking-[-0.035em]">
            {t.hero.titleStart} <span className="sr-only">{t.hero.rotatingWordsLabel}</span>
            <span aria-hidden="true" className="rotating-words">
              {t.hero.rotatingWords.map((word) => (
                <span key={word} className="text-gradient whitespace-nowrap">
                  {word}
                </span>
              ))}
            </span>
            <br />
            {t.hero.titleEnd}
          </h1>

          <p className="mt-6 max-w-[540px] text-lg leading-relaxed text-fg-muted sm:text-[19px]">
            {t.hero.lead}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <RequestButton className={`${buttonStyles.primary} w-full sm:w-auto`}>
              {t.hero.request}
              <ArrowRight className="size-4.5" aria-hidden="true" />
            </RequestButton>
            <RequestButton mode="call" className={`${buttonStyles.ghost} w-full sm:w-auto`}>
              <CalendarDays className="size-5 text-accent" aria-hidden="true" />
              {t.hero.schedule}
            </RequestButton>
          </div>

          <p className="mt-5 text-sm text-fg-faint">
            {t.hero.preferWrite}{' '}
            <WhatsAppLink
              lang={lang}
              className="font-semibold text-brand-soft underline-offset-4 hover:underline"
            >
              {t.hero.whatsapp}
            </WhatsAppLink>{' '}
            · {t.hero.webFrom}{' '}
            <strong className="font-semibold text-brand-soft">${WEB_STARTING_PRICE}</strong>
          </p>
        </div>

        <HeroVisual lang={lang} />
      </div>
    </section>
  );
}
