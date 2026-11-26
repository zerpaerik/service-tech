import { navLinks } from '@/lib/site';
import { buttonStyles } from '@/lib/ui';
import { Logo } from './logo';
import { RequestButton } from './request-button';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/6 bg-ink/72 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-[1200px] items-center justify-between gap-4 px-5 sm:gap-6 sm:px-6">
        <a href="#inicio" aria-label="Mandaito Tech, inicio" className="text-fg">
          <Logo id="header" />
        </a>
        <nav aria-label="Principal" className="hidden items-center gap-8 text-[15px] md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-fg-soft transition-colors hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <RequestButton className={`${buttonStyles.primarySm} whitespace-nowrap`}>
          <span className="sm:hidden">Solicitar</span>
          <span className="hidden sm:inline">Solicitar servicio</span>
        </RequestButton>
      </div>
    </header>
  );
}
