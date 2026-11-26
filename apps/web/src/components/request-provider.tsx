'use client';

import { SERVICE_TYPES, type Locale, type ServiceType } from '@mandaito/shared';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Dictionary } from '@/i18n';
import { track } from '@/lib/analytics';
import { captureSource } from '@/lib/attribution';
import { RequestDialog, type RequestMode } from './request-dialog';

export interface OpenRequestOptions {
  service?: ServiceType;
  mode?: RequestMode;
  /** Idea preseleccionada, p. ej. "Tienda online". */
  idea?: string;
}

interface RequestContextValue {
  openRequest: (options?: OpenRequestOptions) => void;
}

const RequestContext = createContext<RequestContextValue | null>(null);

/** Alias aceptados en los enlaces directos: ?servicio=web, ?service=systems… */
const SERVICE_ALIASES: Record<string, ServiceType> = {
  web: 'WEB',
  webs: 'WEB',
  software: 'SOFTWARE',
  marketing: 'MARKETING',
  sistemas: 'SYSTEMS',
  systems: 'SYSTEMS',
  apps: 'SYSTEMS',
};

/**
 * Enlaces directos para campañas y redes:
 * `?solicitar` o `#solicitar` abre el formulario, `?servicio=web` lo abre con ese
 * servicio, y `?agendar` o `#agendar` abre directo en "Agendar llamada".
 */
function readDeepLink(): OpenRequestOptions | null {
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.slice(1).toLowerCase();
  const rawService = (params.get('servicio') ?? params.get('service') ?? '').toLowerCase();
  const service =
    SERVICE_ALIASES[rawService] ?? SERVICE_TYPES.find((type) => type.toLowerCase() === rawService);
  const wantsCall =
    params.has('agendar') || params.has('book') || hash === 'agendar' || hash === 'book';
  const wantsRequest =
    params.has('solicitar') || params.has('request') || hash === 'solicitar' || hash === 'request';
  if (!wantsCall && !wantsRequest && !service) return null;
  return { service, mode: wantsCall ? 'call' : 'request' };
}

export function RequestProvider({
  lang,
  copy,
  whatsappNumber,
  children,
}: {
  lang: Locale;
  copy: Dictionary['request'];
  whatsappNumber: string;
  children: ReactNode;
}) {
  const [state, setState] = useState<{
    open: boolean;
    service: ServiceType;
    mode: RequestMode;
    idea?: string;
    key: number;
  }>({ open: false, service: 'WEB', mode: 'request', key: 0 });

  const openRequest = useCallback((options: OpenRequestOptions = {}) => {
    const mode = options.mode ?? 'request';
    track({ name: 'open_form', mode });
    // Cambiar la key reinicia el formulario en cada apertura.
    setState((prev) => ({
      open: true,
      service: options.service ?? 'WEB',
      mode,
      idea: options.idea,
      key: prev.key + 1,
    }));
  }, []);

  useEffect(() => {
    captureSource();
    const link = readDeepLink();
    // Sincroniza con la URL (sistema externo): abre el formulario si el enlace lo pide.
    // oxlint-disable-next-line react/set-state-in-effect
    if (link) openRequest(link);
  }, [openRequest]);

  const close = useCallback(() => setState((prev) => ({ ...prev, open: false })), []);
  const value = useMemo(() => ({ openRequest }), [openRequest]);

  return (
    <RequestContext.Provider value={value}>
      {children}
      <RequestDialog
        key={state.key}
        lang={lang}
        copy={copy}
        open={state.open}
        initialService={state.service}
        initialMode={state.mode}
        initialIdea={state.idea}
        whatsappNumber={whatsappNumber}
        onClose={close}
      />
    </RequestContext.Provider>
  );
}

export function useRequest(): RequestContextValue {
  const context = useContext(RequestContext);
  if (!context) throw new Error('useRequest debe usarse dentro de <RequestProvider>');
  return context;
}
