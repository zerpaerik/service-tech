import { cacheLife } from 'next/cache';
import { getDictionary, type Locale } from '@/i18n';
import { displayPhone, instagramUrl, navLinks, site } from '@/lib/site';
import { InstagramIcon, MailIcon, WhatsAppIcon } from './icons';
import { Logo } from './logo';
import { WhatsAppLink } from './whatsapp-link';

async function currentYear(): Promise<number> {
  'use cache';
  cacheLife('days');
  return new Date().getFullYear();
}

const contactLink =
  'inline-flex items-center gap-2.5 text-fg-soft transition-colors hover:text-fg [&>svg]:size-4.5 [&>svg]:flex-none [&>svg]:text-brand-soft';

export async function SiteFooter({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const year = await currentYear();
  return (
    <footer className="border-t border-tint/6 px-6 pt-12 pb-8">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-start justify-between gap-x-12 gap-y-9">
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
        <div className="flex flex-col gap-3 text-sm">
          <p className="font-semibold text-fg">{t.footer.contact}</p>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t.footer.instagram}: @${site.instagram}`}
            className={contactLink}
          >
            <InstagramIcon />@{site.instagram}
          </a>
          <a
            href={`mailto:${site.email}`}
            aria-label={`${t.footer.email}: ${site.email}`}
            className={contactLink}
          >
            <MailIcon />
            {site.email}
          </a>
          {site.whatsappNumber ? (
            <WhatsAppLink lang={lang} ariaLabel={t.footer.whatsapp} className={contactLink}>
              <WhatsAppIcon />
              {displayPhone(site.whatsappNumber)}
            </WhatsAppLink>
          ) : null}
        </div>
      </div>
      <p className="mx-auto mt-9 max-w-[1200px] border-t border-tint/5 pt-6 text-[13px] text-fg-faint">
        © {year} {site.name}. {t.footer.rights}
      </p>
    </footer>
  );
}
