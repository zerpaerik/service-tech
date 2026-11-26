import { WEB_STARTING_PRICE, type ServiceType } from '@mandaito/shared';
import { ArrowRight, CodeXml, Globe, Layers, TrendingUp, type LucideIcon } from 'lucide-react';
import { buttonStyles } from '@/lib/ui';
import { Reveal } from './reveal';
import { RequestButton } from './request-button';
import { SectionHeading } from './section-heading';

interface ServiceCard {
  id: ServiceType;
  title: string;
  description: string;
  icon: LucideIcon;
  tags?: string[];
  wide?: boolean;
  glow?: 'brand' | 'accent';
  price?: number;
}

const cards: ServiceCard[] = [
  {
    id: 'SOFTWARE',
    title: 'Software a medida',
    description:
      'Plataformas que se adaptan a tus procesos, no al revés: ERPs, CRMs, portales internos, integraciones y automatización de tareas repetitivas.',
    icon: CodeXml,
    tags: ['Aplicaciones web', 'APIs e integraciones', 'Automatización', 'Paneles y reportes'],
    wide: true,
    glow: 'brand',
  },
  {
    id: 'WEB',
    title: 'Desarrollo web',
    description:
      'Sitios, landing pages y tiendas online rápidas, optimizadas para SEO y pensadas para convertir visitas en clientes.',
    icon: Globe,
    price: WEB_STARTING_PRICE,
  },
  {
    id: 'MARKETING',
    title: 'Marketing digital',
    description:
      'Estrategia, campañas en Google y redes sociales, contenido y analítica para atraer clientes y medir cada resultado.',
    icon: TrendingUp,
  },
  {
    id: 'SYSTEMS',
    title: 'Sistemas y aplicaciones',
    description:
      'Sistemas de gestión y apps móviles para inventario, ventas, reservas o facturación, con acceso desde cualquier dispositivo.',
    icon: Layers,
    tags: ['Inventario y ventas', 'Reservas y agenda', 'Apps móviles'],
    wide: true,
    glow: 'accent',
  },
];

export function Services() {
  return (
    <section id="servicios" className="scroll-mt-18 px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <SectionHeading eyebrow="Servicios" title="Soluciones digitales de punta a punta">
            Desde tu primera web hasta el sistema que organiza toda tu operación.
          </SectionHeading>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {cards.map((card, index) => (
            <Reveal
              key={card.id}
              delay={index * 0.06}
              className={card.wide ? 'md:col-span-2' : undefined}
            >
              <ServiceCardView card={card} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCardView({ card }: { card: ServiceCard }) {
  const Icon = card.icon;
  return (
    <article className="group relative flex h-full min-h-80 flex-col gap-4 overflow-hidden rounded-[22px] border border-line bg-surface p-8 transition duration-300 hover:-translate-y-0.75 hover:border-white/22 hover:bg-[#141729] sm:p-8.5">
      {card.glow ? (
        <div
          aria-hidden="true"
          className={
            card.glow === 'brand'
              ? 'absolute -top-45 -right-35 size-[420px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.36),transparent_65%)] opacity-70'
              : 'absolute -right-30 -bottom-55 size-[420px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.2),transparent_65%)] opacity-80'
          }
        />
      ) : null}

      <span className="relative flex size-13.5 items-center justify-center rounded-[14px] border border-white/8 bg-brand/15">
        <Icon className="size-6.5 text-brand-soft" aria-hidden="true" />
      </span>
      <h3 className="relative mt-1.5 font-display text-2xl font-bold tracking-tight sm:text-[26px]">
        {card.title}
      </h3>
      <p className="relative max-w-[520px] leading-relaxed text-fg-muted">{card.description}</p>

      {card.tags ? (
        <ul className="relative flex flex-wrap gap-2">
          {card.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line-2 bg-white/5 px-3 py-1.5 text-[13px] text-fg-soft"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      {card.price ? (
        <div className="relative flex items-baseline gap-2 rounded-[14px] border border-white/8 bg-brand/15 px-4 py-3.5">
          <span className="text-sm font-medium text-fg-soft">Desde</span>
          <span className="font-display text-[34px] leading-none font-bold tracking-tight text-brand-soft">
            ${card.price}
          </span>
          <span className="text-[13px] text-fg-muted">por sitio web</span>
        </div>
      ) : null}

      <RequestButton service={card.id} className={`relative mt-auto ${buttonStyles.ghostSm}`}>
        {card.wide ? 'Solicitar este servicio' : 'Solicitar'}
        <ArrowRight className="size-4" aria-hidden="true" />
      </RequestButton>
    </article>
  );
}
