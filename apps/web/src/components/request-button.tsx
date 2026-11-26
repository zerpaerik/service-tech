'use client';

import type { ServiceType } from '@mandaito/shared';
import type { ReactNode } from 'react';
import type { RequestMode } from './request-dialog';
import { useRequest } from './request-provider';

/** Botón que abre el formulario: en "Solicitar servicio" o "Agendar llamada". */
export function RequestButton({
  service,
  mode,
  idea,
  className,
  children,
}: {
  service?: ServiceType;
  mode?: RequestMode;
  idea?: string;
  className?: string;
  children: ReactNode;
}) {
  const { openRequest } = useRequest();
  return (
    <button
      type="button"
      onClick={() => openRequest({ service, mode, idea })}
      aria-haspopup="dialog"
      className={className}
    >
      {children}
    </button>
  );
}
