import { getDictionary, type Locale } from '@/i18n';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

export function Process({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  return (
    <section
      id={t.anchors.process}
      className="scroll-mt-18 border-y border-tint/5 bg-ink-2 px-6 py-24 sm:py-26"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <SectionHeading eyebrow={t.process.eyebrow} title={t.process.title} />
        </Reveal>
        <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.process.steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <li className="h-full rounded-[20px] border border-line bg-surface p-7 shadow-[0_1px_2px_var(--shadow)]">
                <span className="text-gradient font-display text-[40px] font-bold tracking-tight">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3.5 font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-fg-muted">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
