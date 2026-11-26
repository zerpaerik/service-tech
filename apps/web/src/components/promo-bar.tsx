import { ArrowRight, Gift } from 'lucide-react';
import { getDictionary, type Locale } from '@/i18n';

/** Franja de promoción. Solo aparece si `promo` tiene texto en el diccionario. */
export function PromoBar({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  if (!t.promo) return null;
  return (
    <a
      href={`#${t.anchors.packages}`}
      className="flex min-h-10 items-center justify-center gap-2.5 bg-linear-to-r from-brand to-[#fb923c] px-4 py-2 text-center text-[13px] font-semibold text-on-brand sm:text-sm"
    >
      <Gift className="size-4 flex-none" aria-hidden="true" />
      <span>
        {t.promo.text} · <span className="underline underline-offset-2">{t.promo.cta}</span>
      </span>
      <ArrowRight className="size-4 flex-none" aria-hidden="true" />
    </a>
  );
}
