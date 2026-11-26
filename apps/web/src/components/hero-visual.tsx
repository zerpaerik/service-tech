import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { WhatsAppIcon } from './icons';

/** Composición decorativa: ventana de código y tarjetas flotantes. */
export function HeroVisual() {
  return (
    <div aria-hidden="true" className="relative min-w-0 flex-[1_1_440px] py-11">
      <div className="relative mx-5 overflow-hidden rounded-[18px] border border-line-2 bg-linear-to-b from-[#171a2b]/92 to-[#0d0f1c]/92 shadow-[0_40px_80px_rgba(0,0,0,0.5),0_0_80px_rgba(249,115,22,0.3)]">
        <div className="flex items-center gap-2 border-b border-line px-4.5 py-3.5">
          <span className="size-2.75 rounded-full bg-[#3a3f5c]" />
          <span className="size-2.75 rounded-full bg-[#3a3f5c]" />
          <span className="size-2.75 rounded-full bg-[#3a3f5c]" />
          <span className="ml-3 font-mono text-xs text-fg-faint">proyecto.ts</span>
        </div>
        <pre className="overflow-x-auto px-5.5 pt-5.5 pb-6.5 font-mono text-[13px] leading-[1.75] text-fg sm:text-sm">
          <code>
            <span className="text-fg-faint">{'// tu idea, convertida en producto'}</span>
            {'\n'}
            <span className="text-brand-soft">const</span> proyecto ={' '}
            <span className="text-brand-soft">await</span> mandaito.
            <span className="text-amber-200">crear</span>({'{'}
            {'\n  '}tipo: <span className="text-accent">&quot;sistema a medida&quot;</span>,{'\n  '}
            stack: [<span className="text-accent">&quot;Next.js&quot;</span>,{' '}
            <span className="text-accent">&quot;NestJS&quot;</span>,{' '}
            <span className="text-accent">&quot;PostgreSQL&quot;</span>],
            {'\n  '}marketing: <span className="text-brand-soft">true</span>,{'\n  '}entrega:{' '}
            <span className="text-accent">&quot;por etapas&quot;</span>,{'\n'}
            {'});'}
            {'\n\n'}proyecto.<span className="text-amber-200">lanzar</span>();{' '}
            <span className="text-fg-faint">{'// listo para vender'}</span>
          </code>
        </pre>
      </div>

      <FloatingCard
        className="top-0 right-0 animate-bob"
        iconClass="bg-emerald-400/15 text-emerald-400"
        icon={<Check className="size-4.5" strokeWidth={2.4} />}
        title="Deploy exitoso"
        subtitle="Producción · Railway"
      />
      <FloatingCard
        className="bottom-0 left-0 animate-bob-slow"
        iconClass="bg-whatsapp/15 text-whatsapp"
        icon={<WhatsAppIcon className="size-4.5" />}
        title="Nueva solicitud"
        subtitle="Tienda online · vía WhatsApp"
      />
    </div>
  );
}

function FloatingCard({
  className,
  iconClass,
  icon,
  title,
  subtitle,
}: {
  className: string;
  iconClass: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      className={`absolute flex items-center gap-3 rounded-[14px] border border-line-2 bg-surface/92 px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-md ${className}`}
    >
      <span className={`flex size-8.5 items-center justify-center rounded-[10px] ${iconClass}`}>
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="text-[13px] font-semibold">{title}</span>
        <span className="text-xs text-fg-muted">{subtitle}</span>
      </span>
    </div>
  );
}
