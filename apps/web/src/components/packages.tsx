import { ArrowRight, CalendarDays, Check } from 'lucide-react';
import { getDictionary, type Locale } from '@/i18n';
import { buttonStyles } from '@/lib/ui';
import { Reveal } from './reveal';
import { RequestButton } from './request-button';
import { SectionHeading } from './section-heading';
import { SpotlightCard } from './spotlight-card';

export function Packages({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).packages;
  const anchor = getDictionary(lang).anchors.packages;
  return (
    <section id={anchor} className="scroll-mt-18 px-6 pt-6 pb-24 sm:pb-28">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <SectionHeading eyebrow={t.eyebrow} title={t.title}>
            {t.lead}
          </SectionHeading>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 pt-3 md:grid-cols-3">
          {t.plans.map((plan, index) => (
            <Reveal key={plan.id} delay={index * 0.06}>
              <SpotlightCard
                glow={plan.featured ? 'brand' : 'accent'}
                className={`flex h-full flex-col gap-5 rounded-[22px] border bg-surface p-7 shadow-[0_1px_2px_var(--shadow)] transition duration-300 hover:-translate-y-0.75 hover:shadow-[0_20px_44px_var(--shadow)] sm:p-8 ${
                  plan.featured ? 'border-brand-soft' : 'border-line hover:border-tint/22'
                }`}
              >
                {plan.featured ? (
                  <span className="absolute -top-3.25 left-7 rounded-full bg-brand px-3 py-1 text-xs font-bold tracking-wide text-on-brand uppercase">
                    {t.recommended}
                  </span>
                ) : null}
                <div className="relative">
                  <h3 className="font-display text-2xl font-bold tracking-tight">{plan.name}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">
                    {plan.description}
                  </p>
                </div>
                <div className="relative flex min-h-14.5 items-end gap-2">
                  {plan.price !== null ? (
                    <>
                      <span className="text-sm text-fg-soft">{t.from}</span>
                      <span className="font-display text-[44px] leading-none font-bold tracking-tight text-brand-soft">
                        ${plan.price}
                      </span>
                      <span className="text-[13px] text-fg-muted">{t.currency}</span>
                    </>
                  ) : (
                    <span className="flex flex-col gap-1.5">
                      <span className="font-display text-[34px] leading-none font-bold tracking-tight whitespace-nowrap text-brand-soft">
                        {t.customPrice}
                      </span>
                      <span className="text-[13px] text-fg-muted">{t.customNote}</span>
                    </span>
                  )}
                </div>
                <ul className="relative flex flex-col gap-3 border-t border-line pt-4.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-[15px] leading-snug text-fg-soft"
                    >
                      <Check
                        className="mt-px size-4.5 flex-none text-accent"
                        strokeWidth={2.4}
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <RequestButton
                  service="WEB"
                  idea={plan.idea}
                  className={`relative mt-auto w-full ${plan.featured ? buttonStyles.primaryMd : buttonStyles.ghostMd}`}
                >
                  {plan.cta}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </RequestButton>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-5 rounded-[22px] border border-line-2 bg-[linear-gradient(110deg,rgb(249_115_22/0.1),rgb(34_211_238/0.08))] bg-surface p-7 sm:px-8">
            <div className="min-w-0 flex-[1_1_420px]">
              <h3 className="font-display text-[22px] font-bold tracking-tight">{t.bigTitle}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-fg-muted">{t.bigText}</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <RequestButton mode="call" service="SOFTWARE" className={buttonStyles.ghostMd}>
                <CalendarDays className="size-4.5 text-accent" aria-hidden="true" />
                {t.schedule}
              </RequestButton>
              <RequestButton service="SOFTWARE" className={buttonStyles.primaryMd}>
                {t.quote}
              </RequestButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
