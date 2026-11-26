import { renderOgImage } from '@/lib/og-image';
import { getDictionary } from '@/i18n';
import { site } from '@/lib/site';

export const alt = `${site.name} · ${getDictionary('en').meta.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return renderOgImage('en', size);
}
