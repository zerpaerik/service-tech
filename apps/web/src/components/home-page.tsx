import { serviceList } from '@mandaito/shared';
import { getDictionary, homePath, type Locale } from '@/i18n';
import { site } from '@/lib/site';
import { Cta } from './cta';
import { Faq, faqStructuredData } from './faq';
import { Hero } from './hero';
import { MobileActionBar } from './mobile-action-bar';
import { Packages } from './packages';
import { Process } from './process';
import { PromoBar } from './promo-bar';
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
      <PromoBar lang={lang} />
      <SiteHeader lang={lang} />
      <main>
        <Hero lang={lang} />
        <Services lang={lang} />
        <Packages lang={lang} />
        <Process lang={lang} />
        <Tech lang={lang} />
        <Faq lang={lang} />
        <Cta lang={lang} />
      </main>
      {/* En móviles deja espacio para la barra fija de acciones. */}
      <div className="pb-22 md:pb-0">
        <SiteFooter lang={lang} />
      </div>
      <WhatsAppFloat lang={lang} />
      <MobileActionBar lang={lang} />
      {[structuredData, faqStructuredData(lang)].map((data) => (
        <script
          key={String(data['@type'])}
          type="application/ld+json"
          // Contenido estático generado en el servidor, sin datos del usuario.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
        />
      ))}
    </RequestProvider>
  );
}
