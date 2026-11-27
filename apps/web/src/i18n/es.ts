import type { CallMode, ServiceType } from '@mandaito/shared';

export interface Promo {
  /** Texto de la franja superior, p. ej. "Lanzamiento: dominio gratis el primer año". */
  text: string;
  /** Texto del enlace a los paquetes. */
  cta: string;
}

export interface PackagePlan {
  id: 'landing' | 'corporate' | 'store';
  name: string;
  description: string;
  /** Precio "desde" en USD; null muestra "A medida". */
  price: number | null;
  features: string[];
  cta: string;
  /** Idea que se preselecciona en el formulario. */
  idea: string;
  featured?: boolean;
}

/** Textos de la página en español (idioma por defecto). */
export const es = {
  meta: {
    tagline: 'Software, webs y marketing digital',
    description:
      'Desarrollamos sitios web, sistemas a medida y estrategias de marketing digital para empresas que quieren vender más y trabajar mejor. Webs desde $50.',
    keywords: [
      'desarrollo web',
      'páginas web',
      'software a medida',
      'sistemas a medida',
      'marketing digital',
      'tiendas online',
      'aplicaciones móviles',
    ],
    ogLocale: 'es_ES',
    ogHeadline: 'Convertimos ideas en software que hace crecer tu negocio',
    ogSubline: 'Software a medida · Webs desde $50 · Marketing digital',
    offerCatalog: 'Servicios',
  },
  /**
   * Franja de promoción arriba de la página. En null no se muestra.
   * Ejemplo: { text: 'Lanzamiento: dominio gratis el primer año', cta: 'Ver paquetes' }
   */
  promo: null as Promo | null,
  anchors: {
    home: 'inicio',
    services: 'servicios',
    packages: 'paquetes',
    process: 'proceso',
    tech: 'tecnologias',
    faq: 'preguntas',
    contact: 'contacto',
  },
  nav: {
    services: 'Servicios',
    packages: 'Paquetes',
    process: 'Proceso',
    faq: 'Preguntas',
    main: 'Principal',
    footer: 'Pie de página',
    homeLabel: 'Mandaito Tech, inicio',
  },
  header: {
    request: 'Solicitar servicio',
    schedule: 'Agendar llamada',
    language: 'EN',
    languageLabel: 'View in English',
    themeLabel: 'Cambiar entre modo claro y oscuro',
  },
  hero: {
    badge: 'Respondemos en menos de 24 h',
    titleStart: 'Convertimos ideas en',
    rotatingWords: ['webs', 'tiendas online', 'sistemas', 'campañas'],
    /** Lo que leen los lectores de pantalla en lugar de la palabra animada. */
    rotatingWordsLabel: 'webs, tiendas online, sistemas y campañas',
    titleEnd: 'que hacen crecer tu negocio',
    lead: 'Cuéntanos tu idea en un minuto o agenda una llamada. Te respondemos por WhatsApp con una propuesta clara.',
    request: 'Solicitar servicio',
    schedule: 'Agendar una llamada',
    preferWrite: '¿Prefieres escribir?',
    whatsapp: 'Háblanos por WhatsApp',
    webFrom: 'Webs desde',
  },
  heroVisual: {
    online: 'en línea',
    customer1: 'Hola, quiero una tienda online para mi emprendimiento',
    customer2: 'Con catálogo y pagos en línea',
    reply: '¡Perfecto! Hoy mismo te enviamos la propuesta',
    fileName: 'tienda.ts',
    comment: '// construyendo tu tienda...',
    store: 'tienda',
    create: 'crear',
    catalog: 'catálogo',
    catalogValue: '128 productos',
    payments: 'pagos',
    paymentsValue: 'en línea',
    mobile: 'móvil',
    building: 'Construyendo',
    stage: 'Etapa 2 de 3',
    url: 'tu-tienda.com',
    banner: 'Nueva colección',
    published: 'Tienda publicada',
    publishedSub: 'Lista para vender',
    order: 'Primer pedido',
    orderSub: 'desde tu tienda nueva',
    steps: ['Nos escribes', 'Lo construimos', 'Empiezas a vender'],
  },
  services: {
    eyebrow: 'Servicios',
    title: 'Soluciones digitales de punta a punta',
    lead: 'Desde tu primera web hasta el sistema que organiza toda tu operación.',
    from: 'Desde',
    perSite: 'por sitio web',
    request: 'Solicitar',
    requestThis: 'Solicitar este servicio',
    cards: {
      SOFTWARE: {
        title: 'Software a medida',
        description:
          'Plataformas que se adaptan a tus procesos, no al revés: ERPs, CRMs, portales internos, integraciones y automatización de tareas repetitivas.',
        tags: ['Aplicaciones web', 'APIs e integraciones', 'Automatización', 'Paneles y reportes'],
      },
      WEB: {
        title: 'Desarrollo web',
        description:
          'Sitios, landing pages y tiendas online rápidas, optimizadas para SEO y pensadas para convertir visitas en clientes.',
        tags: [],
      },
      MARKETING: {
        title: 'Marketing digital',
        description:
          'Estrategia, campañas en Google y redes sociales, contenido y analítica para atraer clientes y medir cada resultado.',
        tags: [],
      },
      SYSTEMS: {
        title: 'Sistemas y aplicaciones',
        description:
          'Sistemas de gestión y apps móviles para inventario, ventas, reservas o facturación, con acceso desde cualquier dispositivo.',
        tags: ['Inventario y ventas', 'Reservas y agenda', 'Apps móviles'],
      },
    } satisfies Record<ServiceType, { title: string; description: string; tags: string[] }>,
  },
  packages: {
    eyebrow: 'Paquetes',
    title: 'Precios claros para empezar hoy',
    lead: 'Elige un punto de partida. Lo ajustamos a tu negocio antes de empezar.',
    from: 'Desde',
    currency: 'USD',
    customPrice: 'A medida',
    customNote: 'Cotización sin compromiso',
    recommended: 'Recomendado',
    plans: [
      {
        id: 'landing',
        name: 'Landing page',
        description: 'Una página para presentar tu negocio y recibir clientes por WhatsApp.',
        price: 50,
        features: [
          'Diseño a tu medida',
          'Se ve perfecta en el celular',
          'Botón directo a WhatsApp',
          'Formulario de contacto',
        ],
        cta: 'Quiero mi landing',
        idea: 'Landing page',
      },
      {
        id: 'corporate',
        name: 'Web corporativa',
        description: 'Tu empresa completa en línea, lista para aparecer en Google.',
        price: null,
        features: [
          'Inicio, servicios, nosotros y contacto',
          'Optimizada para Google (SEO)',
          'Mapa, redes y WhatsApp',
          'Textos y fotos de tu negocio',
        ],
        cta: 'Quiero mi web',
        idea: 'Web corporativa',
        featured: true,
      },
      {
        id: 'store',
        name: 'Tienda online',
        description: 'Vende las 24 horas con catálogo, carrito y pedidos.',
        price: null,
        features: [
          'Catálogo de productos',
          'Carrito y pedidos por WhatsApp',
          'Pagos en línea',
          'Panel para editar tus productos',
        ],
        cta: 'Quiero mi tienda',
        idea: 'Tienda online',
      },
    ] as PackagePlan[],
    bigTitle: '¿Algo más grande? Sistemas, apps o marketing',
    bigText:
      'Cada proyecto es distinto: te preparamos una cotización a la medida después de una llamada corta.',
    schedule: 'Agendar llamada',
    quote: 'Pedir cotización',
  },
  process: {
    eyebrow: 'Cómo trabajamos',
    title: 'Un proceso claro, sin sorpresas',
    steps: [
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
    ],
  },
  tech: {
    eyebrow: 'Tecnologías',
    title: 'Construimos con herramientas modernas y probadas',
    reasons: [
      {
        title: 'Código propio, sin plantillas',
        text: 'Cada proyecto se construye para tu caso y el código es tuyo.',
      },
      {
        title: 'Comunicación directa',
        text: 'Hablas con quien construye tu proyecto, por WhatsApp y sin intermediarios.',
      },
      {
        title: 'Pensado para crecer',
        text: 'Arquitectura escalable en la nube, lista para sumar funciones cuando las necesites.',
      },
    ],
  },
  faq: {
    eyebrow: 'Preguntas frecuentes',
    title: 'Lo que todos nos preguntan',
    items: [
      {
        q: '¿Cuánto tarda mi web?',
        a: 'Depende del alcance: una landing page es lo más rápido. Antes de empezar te damos fechas claras para cada etapa.',
      },
      {
        q: '¿Cómo se paga?',
        a: 'Te detallamos las formas de pago y el calendario en la propuesta, antes de empezar. Sin sorpresas.',
      },
      {
        q: '¿Incluye dominio y hosting?',
        a: 'Te asesoramos para elegir y registrar tu dominio, y dejamos tu web publicada y funcionando.',
      },
      {
        q: '¿Puedo pedir cambios?',
        a: 'Sí. Revisas avances en cada etapa y ajustamos lo necesario antes de publicar.',
      },
      {
        q: '¿Trabajan con clientes de otros países?',
        a: 'Sí. Todo el proceso es en línea: hablamos por WhatsApp o videollamada y te mostramos avances por enlace.',
      },
      {
        q: '¿Qué pasa después de publicar?',
        a: 'Te explicamos cómo actualizar tu contenido y te acompañamos con soporte y mejoras cuando las necesites.',
      },
    ],
  },
  cta: {
    title: '¿Prefieres hablarlo primero?',
    text: 'Agenda una llamada corta y sin compromiso. Elige el día y la hora que te queden mejor.',
    schedule: 'Agendar llamada',
    whatsapp: 'WhatsApp directo',
  },
  footer: {
    tagline: 'Software, sitios web y marketing digital a la medida de tu negocio.',
    rights: 'Todos los derechos reservados.',
    contact: 'Contacto',
    instagram: 'Síguenos en Instagram',
    email: 'Escríbenos un correo',
    whatsapp: 'Escríbenos por WhatsApp',
  },
  mobileBar: {
    label: 'Acciones rápidas',
    schedule: 'Agendar',
    request: 'Solicitar servicio',
    whatsapp: 'Escríbenos por WhatsApp',
  },
  whatsappFloat: 'Escríbenos por WhatsApp',
  request: {
    title: '¿Cómo quieres empezar?',
    lead: 'Elige lo que te quede más cómodo. Todo sigue por WhatsApp.',
    tabsLabel: 'Tipo de contacto',
    tabRequest: 'Solicitar servicio',
    tabCall: 'Agendar llamada',
    serviceType: 'Tipo de servicio',
    callTopic: '¿De qué quieres hablar?',
    need: '¿Qué necesitas?',
    needHint: 'Toca una idea o escribe la tuya',
    ideas: {
      WEB: ['Landing page', 'Web corporativa', 'Tienda online', 'Rediseño de mi web'],
      SOFTWARE: ['Sistema de inventario', 'Facturación', 'CRM de clientes', 'Automatizar tareas'],
      MARKETING: ['Campaña en Instagram', 'Google Ads', 'Manejo de redes', 'Logo e identidad'],
      SYSTEMS: ['App móvil', 'Reservas y agenda', 'Punto de venta', 'Panel de gestión'],
    } satisfies Record<ServiceType, string[]>,
    details: 'Cuéntanos en una frase',
    detailsPlaceholder: 'Ej. Vendo ropa por Instagram y quiero recibir pedidos en línea',
    name: 'Tu nombre',
    namePlaceholder: 'Tu nombre',
    contact: 'Email o teléfono',
    contactPlaceholder: 'nombre@empresa.com',
    optional: '(opcional)',
    callMode: '¿Cómo prefieres hablar?',
    modes: {
      VIDEO: { label: 'Videollamada', hint: 'Google Meet' },
      WHATSAPP: { label: 'Llamada de WhatsApp', hint: 'Desde tu teléfono' },
      PHONE: { label: 'Llamada telefónica', hint: 'Te llamamos' },
    } satisfies Record<CallMode, { label: string; hint: string }>,
    day: 'Elige el día',
    time: 'Elige la hora',
    timeZone: 'hora de Venezuela (GMT−4)',
    summaryZone: 'hora de Venezuela',
    summaryConfirm: 'Te confirmamos por WhatsApp',
    honeypot: 'No completes este campo',
    sending: 'Enviando…',
    send: 'Enviar por WhatsApp',
    sendCall: 'Agendar por WhatsApp',
    reassurance: 'Sin compromiso · Respondemos en menos de 24 h',
    previewLabel: 'Vista previa del mensaje',
    businessAccount: 'Cuenta de empresa',
    steps: [
      'Guardamos tu solicitud para no perder ningún detalle.',
      'Se abre WhatsApp con el mensaje listo para enviar.',
      'Te respondemos con preguntas y una propuesta.',
    ],
    callSteps: [
      'Eliges día, hora y cómo prefieres hablar.',
      'Nos llega tu solicitud por WhatsApp.',
      'Te confirmamos la cita y, si es videollamada, el enlace.',
    ],
    close: 'Cerrar',
    doneTitle: '¡Listo! Recibimos tu solicitud',
    doneText:
      'Abrimos WhatsApp con tu mensaje. Si no se abrió automáticamente, usa el botón de abajo para enviarlo.',
    doneCallTitle: '¡Listo! Recibimos tu solicitud de llamada',
    doneCallText:
      'Abrimos WhatsApp con los detalles de la cita. Envía el mensaje y te confirmamos por ese medio.',
    openWhatsApp: 'Abrir WhatsApp',
    rateLimited: 'Enviaste varias solicitudes seguidas. Espera un minuto y vuelve a intentarlo.',
  },
  notFound: {
    title: 'Página no encontrada',
    text: 'La página que buscas no existe o cambió de dirección.',
    back: 'Volver al inicio',
  },
};

export type Dictionary = typeof es;
