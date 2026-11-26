'use client';

import type { ServiceType } from '@mandaito/shared';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { RequestDialog } from './request-dialog';

interface RequestContextValue {
  openRequest: (service?: ServiceType) => void;
}

const RequestContext = createContext<RequestContextValue | null>(null);

export function RequestProvider({
  whatsappNumber,
  children,
}: {
  whatsappNumber: string;
  children: ReactNode;
}) {
  const [state, setState] = useState<{ open: boolean; service: ServiceType; key: number }>({
    open: false,
    service: 'WEB',
    key: 0,
  });

  const openRequest = useCallback((service: ServiceType = 'WEB') => {
    // Cambiar la key reinicia el formulario en cada apertura.
    setState((prev) => ({ open: true, service, key: prev.key + 1 }));
  }, []);

  const close = useCallback(() => setState((prev) => ({ ...prev, open: false })), []);
  const value = useMemo(() => ({ openRequest }), [openRequest]);

  return (
    <RequestContext.Provider value={value}>
      {children}
      <RequestDialog
        key={state.key}
        open={state.open}
        initialService={state.service}
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
