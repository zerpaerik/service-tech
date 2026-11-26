import { WEB_STARTING_PRICE, type ServiceType } from '@mandaito/shared';
import { ArrowRight, CodeXml, Globe, Layers, TrendingUp, type LucideIcon } from 'lucide-react';
import { getDictionary, type Dictionary, type Locale } from '@/i18n';
import { buttonStyles } from '@/lib/ui';
import { Reveal } from './reveal';
import { RequestButton } from './request-button';
import { SectionHeading } from './section-heading';

interface ServiceCard {
  id: ServiceType;
  icon: LucideIcon;
  wide?: boolean;
  glow?: 'brand' | 'accent';
  price?: number;
}

const cards: ServiceCard[] = [
  { id: 'SOFTWARE', icon: CodeXml, wide: true, glow: 'brand' },
  { id: 'WEB', icon: Globe, price: WEB_STARTING_PRICE },
  { id: 'MARKETING', icon: TrendingUp },
  { id: 'SYSTEMS', icon: Layers, wide: true, glow: 'accent' },
];

export function Services({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  return (
    <section id={t.anchors.services} className="scroll-mt-18 px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <SectionHeading eyebrow={t.services.eyebrow} title={t.services.title}>
            {t.services.lead}
          </SectionHeading>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {cards.map((card, index) => (
            <Reveal
              key={card.id}
              delay={index * 0.06}
              className={card.wide ? 'md:col-span-2' : undefined}
            >
              <ServiceCardView card={card} t={t.services} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCardView({ card, t }: { card: ServiceCard; t: Dictionary['services'] }) {
  const Icon = card.icon;
  const copy = t.cards[card.id];
  return (
    <article className="group relative flex h-full min-h-80 flex-col gap-4 overflow-hidden rounded-[22px] border border-line bg-surface p-8 shadow-[0_1px_2px_var(--shadow)] transition duration-300 hover:-translate-y-0.75 hover:border-tint/22 hover:bg-surface-2 hover:shadow-[0_20px_44px_var(--shadow)] sm:p-8.5">
      {card.glow ? (
        <div
          aria-hidden="true"
          className={
            card.glow === 'brand'
              ? 'absolute -top-45 -right-35 size-[420px] rounded-full glow-brand opacity-70'
              : 'absolute -right-30 -bottom-55 size-[420px] rounded-full glow-accent opacity-80'
          }
        />
      ) : null}

      <span className="relative flex size-13.5 items-center justify-center rounded-[14px] border border-tint/8 bg-brand/15">
        <Icon className="size-6.5 text-brand-soft" aria-hidden="true" />
      </span>
      <h3 className="relative mt-1.5 font-display text-2xl font-bold tracking-tight sm:text-[26px]">
        {copy.title}
      </h3>
      <p className="relative max-w-[520px] leading-relaxed text-fg-muted">{copy.description}</p>

      {copy.tags.length > 0 ? (
        <ul className="relative flex flex-wrap gap-2">
          {copy.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line-2 bg-tint/5 px-3 py-1.5 text-[13px] text-fg-soft"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      {card.price ? (
        <div className="relative flex items-baseline gap-2 rounded-[14px] border border-tint/8 bg-brand/15 px-4 py-3.5">
          <span className="text-sm font-medium text-fg-soft">{t.from}</span>
          <span className="font-display text-[34px] leading-none font-bold tracking-tight text-brand-soft">
            ${card.price}
          </span>
          <span className="text-[13px] text-fg-muted">{t.perSite}</span>
        </div>
      ) : null}

      <RequestButton service={card.id} className={`relative mt-auto ${buttonStyles.ghostSm}`}>
        {card.wide ? t.requestThis : t.request}
        <ArrowRight className="size-4" aria-hidden="true" />
      </RequestButton>
    </article>
  );
}
