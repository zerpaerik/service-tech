import { CalendarDays } from 'lucide-react';
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
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 px-4 sm:h-18 sm:gap-6 sm:px-6">
        <a href={`#${t.anchors.home}`} aria-label={t.nav.homeLabel} className="min-w-0 text-fg">
          <Logo id="header" size={32} />
        </a>
        <nav aria-label={t.nav.main} className="hidden items-center gap-7 text-[15px] xl:flex">
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
          {/* En móviles estas acciones viven en la barra fija de abajo. */}
          <div className="ml-1 hidden lg:flex">
            <RequestButton mode="call" className={`${buttonStyles.ghostSm} whitespace-nowrap`}>
              <CalendarDays className="size-4" aria-hidden="true" />
              {t.header.schedule}
            </RequestButton>
          </div>
          <div className="ml-1 hidden md:flex">
            <RequestButton className={`${buttonStyles.primarySm} whitespace-nowrap`}>
              {t.header.request}
            </RequestButton>
          </div>
        </div>
      </div>
    </header>
  );
}
