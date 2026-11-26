export const SERVICE_TYPES = ['SOFTWARE', 'WEB', 'MARKETING', 'SYSTEMS'] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

export interface ServiceInfo {
  id: ServiceType;
  label: string;
}

/** Catálogo de servicios: fuente única para el front, el back y el mensaje de WhatsApp. */
export const SERVICES: Record<ServiceType, ServiceInfo> = {
  SOFTWARE: { id: 'SOFTWARE', label: 'Software a medida' },
  WEB: { id: 'WEB', label: 'Desarrollo web' },
  MARKETING: { id: 'MARKETING', label: 'Marketing digital' },
  SYSTEMS: { id: 'SYSTEMS', label: 'Sistemas y apps' },
};

export const SERVICE_LIST: ServiceInfo[] = SERVICE_TYPES.map((id) => SERVICES[id]);

export const BUDGET_OPTIONS = [
  'Aún no lo sé',
  '$50 – $200',
  '$200 – $1.000',
  'Más de $1.000',
] as const;

export type BudgetOption = (typeof BUDGET_OPTIONS)[number];

/** Precio desde el que se ofrecen las webs (USD). */
export const WEB_STARTING_PRICE = 50;
