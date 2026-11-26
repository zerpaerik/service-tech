import { getDictionary, homePath, otherLocale, type Locale } from '@/i18n';

/** Enlace a la misma página en el otro idioma. */
export function LanguageSwitch({ lang }: { lang: Locale }) {
  const target = otherLocale(lang);
  const t = getDictionary(lang).header;
  return (
    <a
      href={homePath(target)}
      hrefLang={target}
      lang={target}
      aria-label={t.languageLabel}
      title={t.languageLabel}
      className="flex h-10 flex-none items-center justify-center rounded-[10px] border border-line-2 bg-tint/4 px-2.5 text-[13px] font-semibold tracking-wide text-fg-soft transition-colors hover:bg-tint/8 hover:text-fg sm:h-11 sm:px-3"
    >
      {t.language}
    </a>
  );
}
