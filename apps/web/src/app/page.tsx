import { SERVICE_LIST } from '@mandaito/shared';
import { Cta } from '@/components/cta';
import { Hero } from '@/components/hero';
import { Process } from '@/components/process';
import { RequestProvider } from '@/components/request-provider';
import { Services } from '@/components/services';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Tech } from '@/components/tech';
import { WhatsAppFloat } from '@/components/whatsapp-float';
import { site } from '@/lib/site';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: site.name,
  description: site.description,
  url: site.url,
  ...(site.whatsappNumber ? { telephone: `+${site.whatsappNumber}` } : {}),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios',
    itemListElement: SERVICE_LIST.map((service) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: service.label },
    })),
  },
};

export default function HomePage() {
  return (
    <RequestProvider whatsappNumber={site.whatsappNumber}>
      <SiteHeader />
      <main>
        <Hero />
        <Services />
        <Process />
        <Tech />
        <Cta />
      </main>
      <SiteFooter />
      <WhatsAppFloat />
      <script
        type="application/ld+json"
        // Contenido estático generado en el servidor, sin datos del usuario.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
    </RequestProvider>
  );
}
