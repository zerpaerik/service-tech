import { WEB_STARTING_PRICE } from '@mandaito/shared';
import { ArrowRight, Check } from 'lucide-react';
import { buttonStyles } from '@/lib/ui';
import { WhatsAppIcon } from './icons';
import { HeroVisual } from './hero-visual';
import { RequestButton } from './request-button';
import { WhatsAppLink } from './whatsapp-link';

const highlights = [
  'Respuesta en menos de 24 h',
  'Presupuesto sin compromiso',
  'Código propio y escalable',
];

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 bg-grid" />
      <div
        aria-hidden="true"
        className="absolute -top-[260px] -left-40 size-[680px] animate-drift rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.36),transparent_65%)] blur-[30px]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-30 -right-50 size-[620px] animate-drift-slow rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.2),transparent_65%)] blur-[30px]"
      />

      <div className="relative mx-auto flex max-w-[1200px] flex-wrap items-center gap-14 px-6 pt-20 pb-24 sm:pt-26 sm:pb-30">
        <div className="min-w-0 flex-[1_1_520px] animate-fade-up">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/4 px-3.5 py-1.5 text-[13px] text-fg-soft">
            <span className="size-2 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]" />
            Software · Web · Marketing digital
          </div>

          <h1 className="mt-6 font-display text-[clamp(40px,5.4vw,70px)] leading-[1.05] font-bold tracking-[-0.035em]">
            Convertimos ideas en <span className="text-gradient">software que hace crecer</span> tu
            negocio
          </h1>

          <p className="mt-6 max-w-[560px] text-lg leading-relaxed text-fg-muted sm:text-[19px]">
            Desarrollamos sitios web, sistemas a medida y estrategias de marketing digital para
            empresas que quieren vender más y trabajar mejor.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <RequestButton className={`${buttonStyles.primary} w-full sm:w-auto`}>
              Solicitar servicio
              <ArrowRight className="size-4.5" aria-hidden="true" />
            </RequestButton>
            <WhatsAppLink className={`${buttonStyles.ghost} w-full sm:w-auto`}>
              <WhatsAppIcon className="size-5 text-whatsapp" />
              Escríbenos por WhatsApp
            </WhatsAppLink>
          </div>

          <ul className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3.5 text-sm text-fg-soft">
            {highlights.map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <Check className="size-4.5 text-accent" strokeWidth={2.4} aria-hidden="true" />
                {item}
              </li>
            ))}
            <li className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-brand/15 px-3 py-1 font-semibold text-fg">
              Webs desde <span className="text-brand-soft">${WEB_STARTING_PRICE}</span>
            </li>
          </ul>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
