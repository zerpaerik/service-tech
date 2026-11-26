import { CodeXml, TrendingUp, type LucideIcon } from 'lucide-react';
import { WhatsAppIcon } from './icons';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

const technologies = [
  'Next.js',
  'React',
  'NestJS',
  'Node.js',
  'TypeScript',
  'PostgreSQL',
  'Prisma',
  'Tailwind CSS',
  'Docker',
  'Railway',
  'Google Ads',
  'Meta Ads',
  'Google Analytics',
  'Figma',
];

const reasons: { title: string; text: string; icon: LucideIcon | typeof WhatsAppIcon }[] = [
  {
    title: 'Código propio, sin plantillas',
    text: 'Cada proyecto se construye para tu caso y el código es tuyo.',
    icon: CodeXml,
  },
  {
    title: 'Comunicación directa',
    text: 'Hablas con quien construye tu proyecto, por WhatsApp y sin intermediarios.',
    icon: WhatsAppIcon,
  },
  {
    title: 'Pensado para crecer',
    text: 'Arquitectura escalable en la nube, lista para sumar funciones cuando las necesites.',
    icon: TrendingUp,
  },
];

export function Tech() {
  return (
    <section id="tecnologias" className="scroll-mt-18 px-6 py-24 sm:py-26">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <SectionHeading
            eyebrow="Tecnologías"
            title="Construimos con herramientas modernas y probadas"
          />
        </Reveal>

        <div className="mask-fade-x -mt-4 overflow-hidden py-2">
          <ul className="flex w-max animate-marquee gap-3.5 hover:[animation-play-state:paused]">
            {[...technologies, ...technologies].map((tech, index) => (
              <li
                key={`${tech}-${index}`}
                aria-hidden={index >= technologies.length ? true : undefined}
                className="flex-none rounded-xl border border-line bg-surface px-5 py-3 text-[15px] font-medium whitespace-nowrap text-fg-soft"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <Reveal key={reason.title} delay={index * 0.08}>
                <div className="flex items-start gap-4">
                  <span className="flex size-11 flex-none items-center justify-center rounded-xl bg-brand/15">
                    <Icon className="size-5.5 text-brand-soft" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-[17px] font-semibold">{reason.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-fg-muted">
                      {reason.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
