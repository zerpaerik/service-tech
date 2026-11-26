import { getDictionary, type Locale } from '@/i18n';
import { navLinks } from '@/lib/site';
import { buttonStyles } from '@/lib/ui';
import { LanguageSwitch } from './language-switch';
import { Logo } from './logo';
import { RequestButton } from './request-button';
import { ThemeToggle } from './theme-toggle';

export function SiteHeader({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  return (
    <header className="sticky top-0 z-40 border-b border-tint/6 bg-ink/72 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-[1200px] items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6">
        <a href={`#${t.anchors.home}`} aria-label={t.nav.homeLabel} className="min-w-0 text-fg">
          {/* En teléfonos muy angostos solo cabe el símbolo; el nombre queda para lectores de pantalla. */}
          <Logo id="header" size={32} wordmarkClassName="max-[374px]:sr-only" />
        </a>
        <nav aria-label={t.nav.main} className="hidden items-center gap-8 text-[15px] lg:flex">
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
        <div className="flex flex-none items-center gap-1.5 sm:gap-2">
          <LanguageSwitch lang={lang} />
          <ThemeToggle label={t.header.themeLabel} />
          <RequestButton className={`${buttonStyles.primarySm} ml-0.5 whitespace-nowrap sm:ml-1`}>
            <span className="sm:hidden">{t.header.requestShort}</span>
            <span className="hidden sm:inline">{t.header.request}</span>
          </RequestButton>
        </div>
      </div>
    </header>
  );
}
