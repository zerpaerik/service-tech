'use client';

import type { ServiceType } from '@mandaito/shared';
import type { ReactNode } from 'react';
import { useRequest } from './request-provider';

/** Botón que abre el modal de solicitud con un servicio preseleccionado. */
export function RequestButton({
  service,
  className,
  children,
}: {
  service?: ServiceType;
  className?: string;
  children: ReactNode;
}) {
  const { openRequest } = useRequest();
  return (
    <button
      type="button"
      onClick={() => openRequest(service)}
      aria-haspopup="dialog"
      className={className}
    >
      {children}
    </button>
  );
}
