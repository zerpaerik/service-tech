import { cacheLife } from 'next/cache';
import { getDictionary, type Locale } from '@/i18n';
import { navLinks, site } from '@/lib/site';
import { Logo } from './logo';

async function currentYear(): Promise<number> {
  'use cache';
  cacheLife('days');
  return new Date().getFullYear();
}

export async function SiteFooter({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const year = await currentYear();
  return (
    <footer className="border-t border-tint/6 px-6 pt-12 pb-8">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-start justify-between gap-8">
        <div className="flex max-w-[360px] flex-col gap-3">
          <Logo id="footer" size={30} />
          <p className="text-sm leading-relaxed text-fg-muted">{t.footer.tagline}</p>
        </div>
        <nav aria-label={t.nav.footer} className="flex flex-wrap gap-x-7 gap-y-3 text-sm">
          {navLinks(t).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-fg-soft transition-colors hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="mx-auto mt-9 max-w-[1200px] border-t border-tint/5 pt-6 text-[13px] text-fg-faint">
        © {year} {site.name}. {t.footer.rights}
      </p>
    </footer>
  );
}
