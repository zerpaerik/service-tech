import { DEFAULT_LOCALE, LOCALES, type Locale } from '@mandaito/shared';
import { en } from './en';
import { es, type Dictionary } from './es';

export { DEFAULT_LOCALE, LOCALES, type Dictionary, type Locale };

const dictionaries: Record<Locale, Dictionary> = { es, en };

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}

/** Ruta de la página principal en cada idioma: español en "/", inglés en "/en". */
export function homePath(lang: Locale): string {
  return lang === DEFAULT_LOCALE ? '/' : `/${lang}`;
}

export function otherLocale(lang: Locale): Locale {
  return lang === 'es' ? 'en' : 'es';
}
