import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

const steps = [
  {
    title: 'Conversamos',
    text: 'Nos cuentas tu idea por WhatsApp y entendemos tu negocio, tus objetivos y tu presupuesto.',
  },
  {
    title: 'Diseñamos',
    text: 'Te proponemos alcance, diseño y tiempos claros antes de escribir una sola línea de código.',
  },
  {
    title: 'Desarrollamos',
    text: 'Construimos por etapas, con avances que puedes revisar y probar en cada entrega.',
  },
  {
    title: 'Lanzamos',
    text: 'Publicamos, medimos resultados y te acompañamos con soporte y mejoras continuas.',
  },
];

export function Process() {
  return (
    <section
      id="proceso"
      className="scroll-mt-18 border-y border-white/5 bg-ink-2 px-6 py-24 sm:py-26"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <SectionHeading eyebrow="Cómo trabajamos" title="Un proceso claro, sin sorpresas" />
        </Reveal>
        <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <li className="h-full rounded-[20px] border border-line bg-surface p-7">
                <span className="text-gradient font-display text-[40px] font-bold tracking-tight">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3.5 font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-fg-muted">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
