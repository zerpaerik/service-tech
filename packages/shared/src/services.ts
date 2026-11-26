export const LOCALES = ['es', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'es';

export const SERVICE_TYPES = ['SOFTWARE', 'WEB', 'MARKETING', 'SYSTEMS'] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

export interface ServiceInfo {
  id: ServiceType;
  label: string;
}

/** Nombre de cada servicio por idioma: fuente única para el front, el back y WhatsApp. */
export const SERVICE_LABELS: Record<Locale, Record<ServiceType, string>> = {
  es: {
    SOFTWARE: 'Software a medida',
    WEB: 'Desarrollo web',
    MARKETING: 'Marketing digital',
    SYSTEMS: 'Sistemas y apps',
  },
  en: {
    SOFTWARE: 'Custom software',
    WEB: 'Web development',
    MARKETING: 'Digital marketing',
    SYSTEMS: 'Systems & apps',
  },
};

/** Catálogo en español (idioma por defecto). */
export const SERVICES: Record<ServiceType, ServiceInfo> = serviceMap(DEFAULT_LOCALE);

export const SERVICE_LIST: ServiceInfo[] = serviceList(DEFAULT_LOCALE);

export function serviceList(locale: Locale): ServiceInfo[] {
  return SERVICE_TYPES.map((id) => ({ id, label: SERVICE_LABELS[locale][id] }));
}

function serviceMap(locale: Locale): Record<ServiceType, ServiceInfo> {
  return Object.fromEntries(serviceList(locale).map((info) => [info.id, info])) as Record<
    ServiceType,
    ServiceInfo
  >;
}

/**
 * Rangos de presupuesto. El valor (en español) es el que se valida y se guarda
 * en la base de datos; `BUDGET_LABELS` da el texto a mostrar en cada idioma.
 */
export const BUDGET_OPTIONS = [
  'Aún no lo sé',
  '$50 – $200',
  '$200 – $1.000',
  'Más de $1.000',
] as const;

export type BudgetOption = (typeof BUDGET_OPTIONS)[number];

export const BUDGET_LABELS: Record<Locale, Record<BudgetOption, string>> = {
  es: {
    'Aún no lo sé': 'Aún no lo sé',
    '$50 – $200': '$50 – $200',
    '$200 – $1.000': '$200 – $1.000',
    'Más de $1.000': 'Más de $1.000',
  },
  en: {
    'Aún no lo sé': 'Not sure yet',
    '$50 – $200': '$50 – $200',
    '$200 – $1.000': '$200 – $1,000',
    'Más de $1.000': 'Over $1,000',
  },
};

export function budgetLabel(value: string, locale: Locale): string {
  return BUDGET_LABELS[locale][value as BudgetOption] ?? value;
}

/** Precio desde el que se ofrecen las webs (USD). */
export const WEB_STARTING_PRICE = 50;
