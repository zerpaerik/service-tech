import type { Metadata, Viewport } from 'next';
import { getDictionary, homePath, LOCALES, type Locale } from '@/i18n';
import { site } from './site';
import { themeColors } from './theme';

/** Rutas de la página en cada idioma, para `hreflang` y el sitemap. */
export const languageAlternates = {
  ...Object.fromEntries(LOCALES.map((lang) => [lang, homePath(lang)])),
  'x-default': homePath('es'),
} as Record<string, string>;

export function buildMetadata(lang: Locale): Metadata {
  const t = getDictionary(lang).meta;
  const title = `${site.name} · ${t.tagline}`;
  const path = homePath(lang);
  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s · ${site.name}` },
    description: t.description,
    applicationName: site.name,
    keywords: t.keywords,
    alternates: { canonical: path, languages: languageAlternates },
    openGraph: {
      type: 'website',
      locale: t.ogLocale,
      alternateLocale: LOCALES.filter((other) => other !== lang).map(
        (other) => getDictionary(other).meta.ogLocale,
      ),
      url: path,
      siteName: site.name,
      title,
      description: t.description,
    },
    twitter: { card: 'summary_large_image', title, description: t.description },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: themeColors.dark },
    { media: '(prefers-color-scheme: light)', color: themeColors.light },
  ],
  colorScheme: 'dark light',
};
