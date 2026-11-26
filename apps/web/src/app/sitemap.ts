import type { MetadataRoute } from 'next';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n';
import { site } from '@/lib/site';

const absoluteUrl = (lang: Locale) => (lang === DEFAULT_LOCALE ? site.url : `${site.url}/${lang}`);

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(LOCALES.map((lang) => [lang, absoluteUrl(lang)]));
  return LOCALES.map((lang) => ({
    url: absoluteUrl(lang),
    changeFrequency: 'monthly',
    priority: lang === DEFAULT_LOCALE ? 1 : 0.9,
    alternates: { languages },
  }));
}
