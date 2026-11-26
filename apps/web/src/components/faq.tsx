import { ChevronDown } from 'lucide-react';
import { getDictionary, type Locale } from '@/i18n';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

/** Preguntas frecuentes con <details> nativo: funciona sin JavaScript y es accesible. */
export function Faq({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  return (
    <section
      id={t.anchors.faq}
      className="scroll-mt-18 border-y border-tint/5 bg-ink-2 px-6 py-24 sm:py-26"
    >
      <div className="mx-auto max-w-[820px]">
        <Reveal>
          <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} />
        </Reveal>
        <div className="-mt-2 flex flex-col gap-3">
          {t.faq.items.map((item, index) => (
            <details
              key={item.q}
              open={index === 0}
              className="group rounded-2xl border border-line bg-surface shadow-[0_1px_2px_var(--shadow)] open:border-line-3"
            >
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5.5 py-4 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown
                  className="size-5 flex-none text-brand-soft transition-transform duration-200 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="px-5.5 pb-5 text-[15px] leading-relaxed text-fg-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Datos estructurados FAQPage para Google. */
export function faqStructuredData(lang: Locale) {
  const t = getDictionary(lang).faq;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: t.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}
