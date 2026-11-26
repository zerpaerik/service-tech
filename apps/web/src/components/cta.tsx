import { ArrowRight } from 'lucide-react';
import { buttonStyles } from '@/lib/ui';
import { WhatsAppIcon } from './icons';
import { Reveal } from './reveal';
import { RequestButton } from './request-button';
import { WhatsAppLink } from './whatsapp-link';

export function Cta() {
  return (
    <section id="contacto" className="scroll-mt-18 px-6 pt-6 pb-28">
      <Reveal>
        <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[28px] border border-line-2 bg-surface px-8 py-20 text-center">
          <div
            aria-hidden="true"
            className="absolute -top-65 -left-30 size-[520px] animate-drift rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.36),transparent_65%)]"
          />
          <div
            aria-hidden="true"
            className="absolute -right-35 -bottom-70 size-[520px] animate-drift-slow rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.2),transparent_65%)]"
          />
          <h2 className="relative font-display text-[clamp(32px,4.4vw,54px)] leading-[1.1] font-bold tracking-tight">
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="relative mx-auto mt-4.5 max-w-[580px] text-lg leading-relaxed text-fg-soft">
            Cuéntanos tu idea en dos minutos. Te respondemos por WhatsApp con una propuesta a tu
            medida.
          </p>
          <div className="relative mt-9 flex flex-wrap justify-center gap-3">
            <RequestButton className={buttonStyles.primary}>
              Solicitar servicio
              <ArrowRight className="size-4.5" aria-hidden="true" />
            </RequestButton>
            <WhatsAppLink className={buttonStyles.whatsapp}>
              <WhatsAppIcon className="size-5" />
              WhatsApp directo
            </WhatsAppLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
