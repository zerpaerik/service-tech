import { serviceList } from '@mandaito/shared';
import { getDictionary, homePath, type Locale } from '@/i18n';
import { site } from '@/lib/site';
import { Cta } from './cta';
import { Hero } from './hero';
import { Process } from './process';
import { RequestProvider } from './request-provider';
import { Services } from './services';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';
import { Tech } from './tech';
import { WhatsAppFloat } from './whatsapp-float';

export function HomePage({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.name,
    description: t.meta.description,
    url: `${site.url}${homePath(lang) === '/' ? '' : homePath(lang)}`,
    inLanguage: lang,
    ...(site.whatsappNumber ? { telephone: `+${site.whatsappNumber}` } : {}),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: t.meta.offerCatalog,
      itemListElement: serviceList(lang).map((service) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: service.label },
      })),
    },
  };

  return (
    <RequestProvider lang={lang} copy={t.request} whatsappNumber={site.whatsappNumber}>
      <SiteHeader lang={lang} />
      <main>
        <Hero lang={lang} />
        <Services lang={lang} />
        <Process lang={lang} />
        <Tech lang={lang} />
        <Cta lang={lang} />
      </main>
      <SiteFooter lang={lang} />
      <WhatsAppFloat lang={lang} />
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
